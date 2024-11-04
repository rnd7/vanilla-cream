import Component from "@rnd7/vc"

/*
This Button component is generic and not bound to a state.
It is updated using a setter.
A Stylesheet is loaded dynamically on initialize
Everytime a label is set the button is updated
*/

export default class Toolbar extends Component {

    static STYLE = import.meta.resolve('./toolbar.css')

    #container = document.createElement("div")
    #elements = []

    async initialize() {
        await this.appendStylesheet(Toolbar.STYLE)
        this.shadowRoot.append(this.#container)
    }

    set elements(value) {
        this.#elements = value
        this.addToRenderQueue(this.bind(this.#render))
    }

    get elements() {
        return this.#elements
    }

    #render() {
        while (this.#container.firstChild) {
            this.#container.removeChild(this.#container.lastChild)
        }
        this.#elements.forEach((element)=>{this.#container.append(element)})
    }
}