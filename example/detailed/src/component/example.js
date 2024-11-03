import Component from "@rnd7/vc"
import Button from "./button.js"
import TemplateElement from "./template-element.js"
import Title from "./title.js"
import Response from "./response.js"
import Toolbar from "./toolbar.js"

/*
Example App
This is the root component of the example app
Imports and creates multiple components
It loads a custom style sheet on initialization
Illustrates usage of the interceptable fetch method
Dynamically imports the list component
*/

export default class Example extends Component {

    #titleEl = Title.create()
    
    #listModule
    #listComp

    #addEntryButton = Button.create({options:{label: "Add"}})
    #templateElement = TemplateElement.create()
    #toolbarElement = Toolbar.create({
        options: {
            elements: [
                Button.create({options:{label: "Load something heavy"}}),
                Button.create({options:{label: "Make an API call"}})
            ]
        }
    })

    /* 
    The constructor is called by the browser when the element is created.
    Do not create Component Instances using the new keyword
    Use static create method. In this case Example.create()
    */
    constructor() {
        super()
    }

    async initialize() {

        this.shadowRoot.append(this.#templateElement)

        this.shadowRoot.append(this.#titleEl)

        this.#listModule = await this.importModule("./component-list.js")

        /* 
        Intialize list module.
        List item component module url passed as type. 
        You can also pass some already imported module as module.
        */
        this.#listComp = this.#listModule.default.create({
            state: this.state?.entries,
            options: {
                moduleName: import.meta.resolve('./entry.js')
            }
        })
        this.shadowRoot.append(this.#listComp)

        this.shadowRoot.append(this.#addEntryButton)

        /* 
        Using the addEventListener wrapper
        While personally prefer passing class methods, you can of course use closures
        */
        this.on(this.#addEntryButton, "pointerup", (event) => {
            this.replaceState([...this.state.entries, {title:"Peter"}], this.state.entries)
        })

        this.shadowRoot.append(this.#toolbarElement)
        
        /*
        In this example the toolbar elements were created before initialization.
        In a production environment I recommend not to access the buttons via the 
        toolbar elements getter
        */
        this.on(this.#toolbarElement.elements[0], "pointerup", async (event) => {
            /* Importing a really big module dynamically during runtime */
            const heavy = await this.importModule(import.meta.resolve('./heavy.js'))
            this.shadowRoot.append(heavy.default.create())
        })

        this.on(this.#toolbarElement.elements[1], "pointerup", async (event) => {
            /* Importing a really big module dynamically during runtime */
            const url = import.meta.resolve('../../api/item/test.json')
            const response = await this.fetch(url)
            const body = JSON.stringify(await response.json(), null, 2)
            const apiCallElement = Response.create({
                options: {
                    body,
                    url 

                }

            })
            this.shadowRoot.append(apiCallElement)
        })

        await super.initialize()
    }

    updateState(state) {
        if (super.updateState(state)) {
            /* only invoked if the local state reference is changed */
            this.#titleEl.content = this.state.title
        }
        /* Components are responsible to propagate the state to nested Components */
        if (this.#listComp) this.#listComp.updateState(this.state?.entries)
    }

}