import Component from "@rnd7/vc"

/*
This Button component is generic and not bound to a state.
It is updated using a setter.
A Stylesheet is loaded dynamically on initialize
Everytime a label is set the button is updated
*/

export default class Button extends Component {

    static STYLE = import.meta.resolve('./button.css')

    #buttonEl = document.createElement('button')
    #label = ""

    set label(value) {
        this.#label = value
        this.addToRenderQueue(this.bind(this.#render))
    }

    get label() {
        return this.#label
    }

    async initialize() {
        await this.appendStylesheet(Button.STYLE)
        this.shadowRoot.append(this.#buttonEl)
        this.addToRenderQueue(this.bind(this.#render))
        await super.initialize()
    }

    #render() {
        this.#buttonEl.textContent = this.#label
    }
}