import Component from "@rnd7/vc"
import Button from "./button.js"
import Input from "./input.js"

/*
Component use as example list entry.
Loads its stylesheet dynamically
Registeres a pointerup event listener
removes itself from the state using the automatic state management when event is triggered
After it is removed from the state the component instance will be disposed by the superordinate component list
*/

export default class Entry extends Component {

    static STYLE = import.meta.resolve('./entry.css')

    #inputEl = Input.create({options: {label: "Name"}})
    #removeButtonEl = Button.create({options:{label: "Remove"}})

    constructor() {
        super()
        this.stateMap = {
            title: (state) => {this.#inputEl.value = state}
        }
    }

    async initialize() {
        await this.appendStylesheet(Entry.STYLE)
        this.shadowRoot.append(this.#inputEl)
        this.shadowRoot.append(this.#removeButtonEl)
        this.on(this.#inputEl, Input.CHANGE, this.#onInputChange)
        this.on(this.#removeButtonEl, "pointerup", this.#onRemovePointerUp)
    }

    #onRemovePointerUp(event) {
        event.stopPropagation()
        this.removeState()
    }

    #onInputChange(event) {
        event.stopPropagation()
        this.replaceState({...this.state, title: event.detail})
    }
}