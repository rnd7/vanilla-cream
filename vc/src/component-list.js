import Component from "./component.js"
import updateElementListState from "./update-element-list-state.js"
import updateElementList from "./update-element-list.js"

export default class ComponentList extends Component {

    #moduleName
    #module
    #component

    constructor() {
        super()
    }

    async initialize() {
        this.addToRenderQueue(this.bind(this.#render))
        await super.initialize()
        
    }

    set moduleName(value) {
        this.#moduleName = value
        this.#loadListItemModule()
    }

    get moduleName() {
        return this.#moduleName
    }

    set module(value) {
        this.#module = value
        this.component = this.#module.default
    }

    get module() {
        return this.#module
    }

    set component(value) {
        this.#component = value
        this.addToRenderQueue(this.bind(this.#render))
    }

    get component() {
        return this.#component
    }

    async #loadListItemModule() {
        try {
            this.module = await this.importModule(this.#moduleName)
        } catch (e) {
            console.warn(e)
        }
    }

    updateState(state) {
        if (super.updateState(state)) this.addToRenderQueue(this.bind(this.#render))
        updateElementListState(this.shadowRoot, state)
    }

    #render() {
        if (!this.#component) return 
        updateElementList(
            this.shadowRoot, 
            this.#component, 
            this.state,
            {prefix: this.prefix}
        )
    }
}