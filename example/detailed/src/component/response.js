import Component from "@rnd7/vc"
import Code from "./code.js"
import Headline from "./headline.js"

/*
Displays result of pseudo API Call
*/
export default class Response extends Component {

    static STYLE = import.meta.resolve('./text.css')

    #codeElement = Code.create()
    #headlineEl = Headline.create()

    async initialize() {
        await this.appendStylesheet(Response.STYLE)
        this.shadowRoot.append(this.#headlineEl)
        this.shadowRoot.append(this.#codeElement)
        await super.initialize()
    }

    set body(value) {
        this.#codeElement.content = value
    }

    get body() {
        return this.#codeElement.content
    }

    set url(value) {
        this.#headlineEl.content = value
    }

    get url() {
        return this.#headlineEl.content
    }
}