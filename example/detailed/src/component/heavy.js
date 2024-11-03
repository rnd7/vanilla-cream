import Component from "@rnd7/vc"
import Headline from "./headline.js"
import Caption from "./caption.js"

/* This component is big in filesize to illustrate dynamic imports. */

export default class Heavy extends Component {

    static STYLE = import.meta.resolve('./heavy.css')

    #headlineEl = Headline.create({options: {content: "Something heavy"}})
    #imgContainer = document.createElement('div')
    #imgEl = document.createElement('img')
    #credits = Caption.create({options: {content: "Image Credits: Aditya Pal"}})

    async initialize() {
        await this.appendStylesheet(Heavy.STYLE)
        this.shadowRoot.append(this.#headlineEl)
        this.#imgContainer.classList.add("container")
        this.shadowRoot.append(this.#imgContainer)
        this.#imgEl.src = BASE64_IMAGE
        this.#imgContainer.append(this.#imgEl)
        this.shadowRoot.append(this.#credits)
        await super.initialize()
    }
}


/*
Base64 encoded image to increase file size.

Title
Greater one-horned rhinoceros mother and calf in Chitwan National Park, Nepal.

Author
Aditya Pal
https://commons.wikimedia.org/wiki/User:Paladitya

License
CC-CY-SA
https://creativecommons.org/licenses/by-sa/4.0

Source:
https://de.wikipedia.org/wiki/Rhinoceros_%28Gattung%29#/media/Datei:Greater_one-horned_rhinoceros_at_Chitwan.jpg
*/