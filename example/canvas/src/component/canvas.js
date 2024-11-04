import Component, { ComponentList } from "@rnd7/vc"

export default class Canvas extends Component {

    #cv = document.createElement("canvas")
    #ctx

    constructor() {
        /*
        If resizeObserver is true the compoenent registeres a resize
        observer. The resize method is implementd on this subclass
        */
        super({resizeObserver: true})
    }

    async initialize() {
        this.#ctx = this.#cv.getContext('2d')
        this.shadowRoot.append(this.#cv)
    }

    stateChange() {
        this.addToRenderQueue(this.bind(this.#render))
    }

    resize() {
        this.addToRenderQueue(this.bind(this.#render))
    }

    #render() {
        if (!this.state) return
        this.#cv.width = this.width
        this.#cv.height = this.height
        this.#ctx.clearRect(0,0, this.width, this.height)
        this.#ctx.lineCap = "round"
        this.state.forEach(instruction => {
            if (typeof this.#ctx[instruction.name] === "function") {
                this.#ctx[instruction.name](...instruction.parameters || [])
            } else if (this.#ctx[instruction.name] !== undefined) {
                this.#ctx[instruction.name] = instruction.value
            }
        })
    }
}