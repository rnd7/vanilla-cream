export default async function assert(assertion, check) {
    console.group(`#️⃣  Assertion: `+`${assertion}`.replace(/\n/gi," ").replace(/\s{2,}/gi," ").substring(0,100))
    let result
    try {
        let returnValue
        if (typeof assertion === "function") {
            returnValue = assertion()
            if (returnValue instanceof Promise) returnValue = await returnValue
        } else {
            returnValue = assertion
        }
        if (typeof check === "function") {
            result = check(returnValue)
            if (result instanceof Promise) result = await result
        } else if (check === undefined) {
            result = !!returnValue
        } else {
            result = returnValue === check
        }
    } catch(err) {
        console.error(err)
    }
    
    console.groupEnd()
    if (!result) {
        console.warn(`❎ Failed`)
    } else {
        console.log(`✅ Successful`)
    }
    return result
}