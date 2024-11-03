export default function findAccessor(parent, child) {
    if(Array.isArray(parent)) {
        const index = parent.indexOf(child)
        if (index >= 0) return index
    } else if (typeof parent === "object") {
        for (const [key, value] of Object.entries(parent)) {
            if (value === child) return key
        }
    }
    return null
}
