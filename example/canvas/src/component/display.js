import Component from "@rnd7/vc"

export default class Display extends Component {

    #label

    async initialize() {
        await this.appendStylesheet(import.meta.resolve('./display.css'))
    }

    set label(value) {
        this.#label = value
        this.addToRenderQueue(this.bind(this.#render))
    }

    get label() {
        return this.#label
    }

    stateChange() {
        this.addToRenderQueue(this.bind(this.#render))
    }

    #render() {
        this.shadowRoot.textContent = `${this.#label}: ${this.state}`
    }


}