export default function removeFrom(parent, child) {
    let result
    if(Array.isArray(parent)) {
        result = [...parent]
        const index = parent.indexOf(child)
        result.splice(index, 1)
        
    } else if (typeof parent === "object") {
        result = {...parent}
        for (const [key, value] of Object.entries(result)) {
            if (value === child) {
                delete result[key]
                break
            }
        }
    }
    return result
}