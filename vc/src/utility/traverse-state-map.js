import Component from "../component.js"

export default function traverseStateMap(stateMapReference, stateReference) {
    if (stateMapReference instanceof Component) {
        stateMapReference.updateState(stateReference)
    } else if (typeof stateMapReference === "function") {
        stateMapReference(stateReference)
    } else if (Array.isArray(stateMapReference)) {
        stateMapReference.forEach((stateMapReferenceItem)=>{
            traverseStateMap(stateMapReferenceItem, stateReference)
        })
    } else if (stateMapReference && typeof stateMapReference === "object" ) {
        for (let key of Object.keys(stateMapReference)) {
            if (stateReference && stateReference[key] !== undefined) {
                traverseStateMap(stateMapReference[key], stateReference[key])
            }
        }
    }
}