import assert from "./utils/assert.js"
import summarize from "./utils/summarize.js"

export default async function testAssert() {
    console.group(`*️⃣  ${import.meta.url}`)
    const result = [
        await assert(() => assert(true)),
        await assert(() => assert(()=>{return true})),
        await assert(() => assert(()=>{
            return new Promise((resolve, reject)=>{
                setTimeout(()=>{resolve(true)})
            })
        }))
    ]
    console.groupEnd()
    summarize(result)
    return result
}
