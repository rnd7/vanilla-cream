import Component from "@rnd7/vc"
import Canvas from "./canvas.js"
import Inspector from "./inspector.js"

export default class App extends Component {

    #canvas = Canvas.create()
    #inspector = Inspector.create()

    async initialize() {
        await this.appendStylesheet(import.meta.resolve('./app.css'))
        this.shadowRoot.append(this.#canvas)
        this.shadowRoot.append(this.#inspector)
        await super.initialize()
    }

    updateState(state) {
        super.updateState(state)
        this.#canvas.updateState(this.state.instructions)
        this.#inspector.updateState(this.state)
    }

}