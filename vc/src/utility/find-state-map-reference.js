export default function findStateMapReference(stateMap, state, search, path = []) {
    if(Array.isArray(stateMap)) {
        for (const itemIndex in stateMap) {
            const item = stateMap[itemIndex]
            if (item === search) return path
            const stateRef = state[itemIndex]
            const traversed = findStateMapReference(item, stateRef, search, [...path, stateRef])
            if (traversed) return traversed
        }
    } else if (typeof stateMap === "object") {
        for (const [key, value] of Object.entries(stateMap)) {
            if (value === search) return path
            const stateRef = state[key]
            const traversed = findStateMapReference(value, stateRef, search, [...path, stateRef])
            if (traversed) return traversed
        }
    }
    return null
}
