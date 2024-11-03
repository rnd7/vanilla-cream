import Binding from "./utility/binding.js"
import camelToKebab from "./utility/camel-to-kebab.js"
import defer from "./utility/defer.js"
import { FETCH, MODIFY_STATE, REMOVE_STATE, REPLACE_STATE } from "./event.js"
import handleStateEvent from "./handle-state-event.js"

export default class Component extends HTMLElement {

    static RESIZE = "resize"
    static prefix = "vc"
    static register = new Set()
    static domParser = new DOMParser()

    static getComponentName(prefix = "", suffix = "") {
        const nameArr = [camelToKebab(this.name)]
        if (prefix) nameArr.unshift(prefix)
        else nameArr.unshift(Component.prefix)
        if (suffix) nameArr.push(suffix)
        return nameArr.join('-')
    }

    static create({state = null, options = null, prefix = "", suffix = ""} = {}) {
        const name = this.getComponentName(prefix, suffix)
        if (!this.register.has(name)) {
            customElements.define(name, this)
            this.register.add(name)
        }
        const el = document.createElement(name)
        el.prefix = prefix
        el.suffix = suffix
        if (options) Object.assign(el, options)
        if (state) el.updateState(state)
        return el
    }

    static async fetch(event) {
        event.stopPropagation()
        const { resource, options, resolve, reject } = event.detail
        try {
            const response = fetch(resource, options)
            resolve(response)
        } catch (error) {
            reject(error)
        }
    }

    #prefix
    #suffix
    #binding
    #state
    #renderQueue = new Set()
    #listeners = []
    #animationFrame
    #initialized = false
    #renderTriggered = false
    #resizeTriggered = false
    #resizeObserver
    #width
    #height
    #interceptFetch
    #interceptState

    constructor({
        resizeObserver = false,
        interceptFetch = false,
        interceptState = false
    } = {}) {
        super()
        this.#binding = new Binding(this)
        this.#interceptFetch = interceptFetch
        this.#interceptState = interceptState
        this.attachShadow({ mode: 'open' })
        if (resizeObserver) {
            this.#resizeObserver = new ResizeObserver(this.bind(this.#onResize))
            this.#resizeObserver.observe(this)
        }
        if (this.#interceptFetch) {
            this.addEventListener(FETCH, Component.fetch)
        }
        if (this.#interceptState) {
            this.addEventListener(MODIFY_STATE, this.bind(this.modifyState))
        }
    }

    connectedCallback() {
        requestAnimationFrame(()=>{
            this.initialize()
        })
    }

    async initialize() {
        if (this.#initialized) return
        this.intitialized = true
        if (this.#resizeTriggered) this.resize()
        if (this.#renderTriggered) this.#triggerRender()
    }

    get width() {
        return this.#width
    }

    get height() {
        return this.#height
    }

    set state(value) {
        this.#state = value
    }

    get state() {
        return this.#state
    }

    set intitialized(value) {
        this.#initialized = value
    }

    get intitialized() {
        return this.#initialized
    }

    set prefix(value) {
        this.#prefix = value
    }

    get prefix() {
        return this.#prefix
    }

    set suffix(value) {
        this.#suffix = value
    }

    get suffix() {
        return this.#suffix
    }

    /* Wrappers */

    bind(fn) {
        return this.#binding.bind(fn)
    }
    
    on(element, event, listener) {
        this.#listeners.push({element, event, listener})
        element.addEventListener(event, this.bind(listener))
    }

    off(element, event, listener) {
        element.removeEventListener(event, this.bind(listener))
        this.#listeners = this.#listeners.filter((listener)=>{
            return element !== listener.element
                && event !== listener.event
                && listener !== listener
        })
    }

    fetch(resource, options = null) {
        return new Promise((resolve, reject)=>{
            this.dispatchEvent(
                new CustomEvent(FETCH, {
                    composed: true,
                    detail: {
                        resource,
                        options,
                        resolve,
                        reject
                    }
                })
            )
        }) 
    }

    /* State management */

    replaceState(modifiedState, reference = null) {
        this.dispatchEvent(
            new CustomEvent(MODIFY_STATE, {
                composed: true,
                detail: {
                    type: REPLACE_STATE,
                    modifiedState,
                    reference
                }
            })
        )
    }

    removeState(reference = null) {
        this.dispatchEvent(
            new CustomEvent(MODIFY_STATE, {
                composed: true,
                detail: {
                    type: REMOVE_STATE,
                    reference
                }
            })
        )
    }

    updateState(state) {
        if (state === this.#state) return false
        this.#state = state
        return true
    }

    modifyState(event) {
        event.stopPropagation()
        const state = handleStateEvent(event)
        defer(this.updateState(state))
    }

    /* Dynamic loading */

    async importModule(module) {
        return import(module)
    }

    async appendStylesheet(url) {
        return new Promise((resolve, reject) => {
            try {
                const styleEl = document.createElement('link')
                styleEl.type = 'text/css'
                styleEl.rel = 'stylesheet'
                styleEl.onload = () => resolve(styleEl)
                styleEl.onerror = () => reject()
                styleEl.href = url
                this.shadowRoot.append(styleEl)
            } catch (e) {
                reject(e)
            }
               
        })
    }

    async appendHTML(src) {
        const response = await fetch(src)
        const text = await response.text()
        const domEl = Component.domParser.parseFromString(text, 'text/html')
        for (const child of domEl.head.childNodes) {
            this.shadowRoot.append(child)
        }
        for (const child of domEl.body.childNodes) {
            this.shadowRoot.append(child)
        }
    }

    /* Component resize */

    #onResize(entries) {
        for (let entry of entries) {
            if (entry.contentBoxSize?.length > 0) {
                this.#width = entry.contentBoxSize[0].inlineSize
                this.#height = entry.contentBoxSize[0].blockSize
                if (this.#initialized) this.resize()
                else this.#resizeTriggered = true
                break
            }
        }
    }

    resize() {
        // implement in subclass or listen to event
        this.dispatchEvent(
            new CustomEvent(Component.RESIZE, {
                composed: true,
                detail: {component: this, width: this.#width, height: this.#height}
            })
        )
    }

    /* Rendering */

    /* 
    Use this method to queue DOM changes or to render canvas elements. 
    All queued funtions are executed once and serialize on animation frame and after initialization.
    */
    addToRenderQueue(fn) {
        if (!this.#renderQueue) return
        this.#renderQueue.add(fn)
        this.#triggerRender()
    }

    #triggerRender() {
        this.#renderTriggered = false
        if (this.#animationFrame) return
        if (this.#initialized) this.#animationFrame = requestAnimationFrame(this.bind(this.#render))
        else this.#renderTriggered = true
    }

    #render() {
        this.#animationFrame = null
        for (const fn of this.#renderQueue) fn()
        this.#renderQueue = new Set()
    }

    /* disposal */

    dispose() {
        this.#listeners.forEach((listener)=>{this.off(listener.element, listener.event, listener.listener)})
        this.#binding = null
        this.#renderQueue = null
        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect()
            this.#resizeObserver = null
        }
        if (this.#interceptFetch) {
            this.removeEventListener(FETCH, Component.fetch)
        }
        if (this.#interceptState) {
            this.removeEventListener(MODIFY_STATE, this.bind(this.modifyState))
        }
        cancelAnimationFrame(this.#animationFrame)
        this.remove()
    }
}