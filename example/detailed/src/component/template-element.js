import Component from "@rnd7/vc"

/*
Component to illustrate an alternative approach to build the dom
Uses build in support to load and parse html files
*/
export default class TemplateElement extends Component {

    static STYLE = import.meta.resolve('./template-element.css')
    static TEMPLATE = import.meta.resolve('./template-element.html')

    async initialize() {
        await this.appendStylesheet(TemplateElement.STYLE)
        await this.appendHTML(TemplateElement.TEMPLATE)
        this.addToRenderQueue(this.bind(this.#render))
    }

    #render() {
        const myElement = this.shadowRoot.querySelector('#my-element')
        myElement.textContent = "Dynamically replaced Template Element Content"
    }
}