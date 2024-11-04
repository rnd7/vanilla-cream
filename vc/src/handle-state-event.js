import { REMOVE_STATE, REPLACE_STATE } from "./event.js"
import findRecursive from "./utility/find-recursive.js"
import findStateMapReference from "./utility/find-state-map-reference.js"
import removeFrom from "./utility/remove-from.js"
import replaceWith from "./utility/replace-with.js"

export default function handleStateEvent(event) {
    const eventPath = event.composedPath()
    const statePath = []
    let previousEl = null
    for (const el of eventPath) {
        if (el.stateMap && previousEl) {
            const pathFromMap = findStateMapReference(el.stateMap, el.state, previousEl)
            if(pathFromMap) statePath.push(...pathFromMap.reverse())
        }
        if (el.state) {
            statePath.push(el.state)
            previousEl = el
        }
    }
    if (event.detail.reference) {
        const subPath = findRecursive(statePath[0], event.detail.reference)
        if (subPath) statePath.unshift(...subPath)
    }
    if (statePath.length <= 1) {
        return event.detail.modifiedState
    }
    const root = statePath[statePath.length-1]
    if (event.detail.type === REMOVE_STATE) {
        const child = statePath[0]
        const parent = statePath[1]
        const host = statePath[2]
        let modified
        if (Array.isArray(parent) || typeof parent === "object") {
            modified = removeFrom(parent, child)
        } 
        if (host && host != parent) {
            replaceWith(host, parent, modified)
        } else {
            return modified
        }
    } else if (event.detail.type === REPLACE_STATE) {
        const child = statePath[0]
        const parent = statePath[1]
        replaceWith(parent, child, event.detail.modifiedState)
    }
    return root
}