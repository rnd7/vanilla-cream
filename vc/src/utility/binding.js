export default class Binding {
    #context
    #bindings = new Map()
    constructor(context) {
        this.#context = context
    }

    bind(fn) {
        if (!this.#bindings.has(fn)) this.#bindings.set(fn, fn.bind(this.#context))
        return this.#bindings.get(fn)
    } 
}