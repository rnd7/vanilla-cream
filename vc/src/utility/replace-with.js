export default function replaceWith(parent, child, replacement) {
    if(Array.isArray(parent)) {
        const index = parent.indexOf(child)
        parent.splice(index, 1, replacement)
    } else if (typeof parent === "object") {
        for (const [key, value] of Object.entries(parent)) {
            if (value === child) {
                parent[key] = replacement
                break
            }
        }
    }
    return parent
}