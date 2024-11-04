import Component, { ComponentList } from "@rnd7/vc"
import Entry from "./entry.js"

export default class Todo extends Component {

    #headlineElement = document.createElement("h1")
    /*
    Passing a Component class to the list component
    You might alternatively choose to pass a path as moduleName for dynamic imports. 
    */
    #listComponent = ComponentList.create({
        options: {
            component: Entry
        }
    })
    
    #addEntryButton = document.createElement('button')

    constructor() {
        /* 
        If interceptState is true state events are handled automatically by the
        Component base class. The state is modified and updateState is invoked.
        */
        super({interceptState: true})
        this.stateMap = this.#listComponent
    }

    async initialize() {
        await this.appendStylesheet(import.meta.resolve('./todo.css'))
        await this.appendStylesheet(import.meta.resolve('./ui.css'))

        this.shadowRoot.append(this.#headlineElement)
        this.#headlineElement.textContent = "Todo, Done & Gone"
        this.shadowRoot.append(this.#listComponent)
        this.#addEntryButton.textContent = "New"
        this.shadowRoot.append(this.#addEntryButton)

        this.on(this.#addEntryButton, "pointerup", (event) => {
            this.replaceState([...this.state, {label:""}])
        })
    }
}