export default function findRecursive(ref, search, path = []) {
    if(Array.isArray(ref)) {
        for (const item of ref) {
            if (item === search) return [...path, item]
            const traversed = findRecursive(item, search, [...path, ref])
            if (traversed) return traversed
        }
    } else if (typeof ref === "object") {
        for (const [key, value] of Object.entries(ref)) {
            if (value === search) return [...path, value]
            const traversed = findRecursive(value, search, [...path, ref])
            if (traversed) return traversed
        }
    }
    return null
}