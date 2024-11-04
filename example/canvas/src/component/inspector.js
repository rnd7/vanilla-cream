import Component from "@rnd7/vc"
import Display from "./display.js"

export default class Inspector extends Component {

    #title = document.createElement("h1")
    #xComp = Display.create({options: {label: "x"}})
    #yComp = Display.create({options: {label: "y"}})
    #downComp = Display.create({options: {label: "pressed"}})

    constructor() {
        super()
        this.stateMap = {
            x: this.#xComp,
            y: this.#yComp,
            down: this.#downComp
        }
    }

    async initialize() {
        await this.appendStylesheet(import.meta.resolve('./inspector.css'))
        this.shadowRoot.append(this.#title)
        this.#title.textContent = "Drw Smth"
        this.shadowRoot.append(this.#xComp)
        this.shadowRoot.append(this.#yComp)
        this.shadowRoot.append(this.#downComp)
    }
}