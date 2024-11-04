import Component from "@rnd7/vc"

/* 
Generic single line input
Not bound to a state using setter to update elements
Dispatches change event
*/
export default class Input extends Component {

    static CHANGE = "change"
    static STYLE = import.meta.resolve('./input.css')

    #labelEl = document.createElement("label")
    #inputEl = document.createElement("input")
    #value = ""
    #label = ""

    async initialize() {
        await this.appendStylesheet(Input.STYLE)
        this.on(this.#inputEl, "change", this.#onInputChange)
        this.#labelEl.htmlFor = "input"
        this.shadowRoot.append(this.#labelEl)
        this.#inputEl.id = "input"
        this.shadowRoot.append(this.#inputEl)
    }

    set label(value) {
        this.#label = value
        this.addToRenderQueue(this.bind(this.#renderLabel))
    }

    get label() {
        return this.#label
    }

    set value(value) {
        this.#value = value
        this.addToRenderQueue(this.bind(this.#renderInput))
    }

    get value() {
        return this.#value
    }

    #onInputChange(event) {
        this.dispatchEvent(
            new CustomEvent(
                Input.CHANGE,
                {
                    detail: this.#inputEl.value,
                    composed: true
                }
            )
        )
    }

    #renderInput() {
        this.#inputEl.value = this.#value
    }

    #renderLabel() {
        this.#labelEl.textContent = this.#label
    }
}