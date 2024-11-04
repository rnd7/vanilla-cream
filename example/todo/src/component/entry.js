import Component from "@rnd7/vc"

export default class Entry extends Component {

    #inputElement = document.createElement("input")
    #checkButtonElement = document.createElement("button")
    #removeButtonElement = document.createElement("button")
    #showRemoveButton = false

    async initialize() {
        await this.appendStylesheet(import.meta.resolve('./ui.css'))
        await this.appendStylesheet(import.meta.resolve('./entry.css'))
        this.#checkButtonElement.textContent = "⚪️"
        this.on(this.#checkButtonElement, "pointerup", this.#onCheckButtonPointerUp)
        this.shadowRoot.append(this.#checkButtonElement)
        this.shadowRoot.append(this.#inputElement)
        this.on(this.#inputElement, "change", this.#onInputChange)
        this.on(this, "focus", this.#onFocus)
        this.on(this, "blur", this.#onBlur)
        this.on(this, "pointerover", this.#onFocus)
        this.on(this, "pointerleave", this.#onBlur)
        this.#removeButtonElement.textContent = "✖️"
        this.shadowRoot.append(this.#removeButtonElement)
        this.#removeButtonElement.classList.add("nobg")
        this.on(this.#removeButtonElement, "pointerup", this.#onRemovePointerUp)
    }

    #onFocus(event) { 
        event.stopPropagation()
        this.showRemoveButton = true
    }

    #onBlur(event) { 
        event.stopPropagation()
        this.showRemoveButton = false
    }

    set showRemoveButton(value) {
        this.#showRemoveButton = value
        this.addToRenderQueue(this.bind(this.#renderRemoveButton))
    }

    #onCheckButtonPointerUp(event) { 
        event.stopPropagation()
        this.replaceState({...this.state, check: !this.state.check})
    }

    #onRemovePointerUp(event) { 
        event.stopPropagation()
        this.removeState()
    }

    #onInputChange(event) {
        event.stopPropagation()
        this.replaceState({...this.state, label: this.#inputElement.value})
    }

    stateChange() {
        this.addToRenderQueue(this.bind(this.#render))
    }

    #render() {
        this.#checkButtonElement.textContent = this.state.check ? "🔘":"⚪️"
        this.#inputElement.value = this.state.label
    }

    #renderRemoveButton() {
        if (this.#showRemoveButton && !this.#removeButtonElement.parentNode) this.shadowRoot.append(this.#removeButtonElement)
        else if (!this.#showRemoveButton && this.#removeButtonElement.parentNode) this.#removeButtonElement.remove()
    }
}