import Text from "./text.js"

export default class Caption extends Text {
    constructor() {
        super({tag: "p"})
    }
}