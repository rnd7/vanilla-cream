import Component from "@rnd7/vc"


/*
Text Component base class.
Illustrates the use of inheritance.
HTML tag of content element can be defined by passing it to the constructor.
*/
export default class Text extends Component {

    static STYLE = import.meta.resolve('./text.css')

    #textElement
    #content = ""
    #tag

    constructor({tag = "span"}) {
        super()
        this.#tag = tag
    }

    async initialize() {
        await this.appendStylesheet(Text.STYLE)
        this.#textElement = document.createElement(this.#tag)
        this.shadowRoot.append(this.#textElement)
        this.addToRenderQueue(this.bind(this.#render))
    }

    set content(value) {
        this.#content = value
        this.addToRenderQueue(this.bind(this.#render))
    }

    get content() {
        return this.#content
    }

    #render() {
        this.#textElement.textContent = this.#content
    }
}