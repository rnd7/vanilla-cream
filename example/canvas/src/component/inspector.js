import Component from "@rnd7/vc"
import Display from "./display.js"

export default class Inspector extends Component {

    #title = document.createElement("h1")
    #xComp = Display.create({options: {label: "x"}})
    #yComp = Display.create({options: {label: "y"}})
    #downComp = Display.create({options: {label: "pressed"}})

    async initialize() {
        await this.appendStylesheet(import.meta.resolve('./inspector.css'))
        this.shadowRoot.append(this.#title)
        this.#title.textContent = "Drw Smth"
        this.shadowRoot.append(this.#xComp)
        this.shadowRoot.append(this.#yComp)
        this.shadowRoot.append(this.#downComp)
        await super.initialize()
    }

    updateState(state) {
        super.updateState(state)
        this.#xComp.updateState(this.state.x)
        this.#yComp.updateState(this.state.y)
        this.#downComp.updateState(this.state.down)
    }


}