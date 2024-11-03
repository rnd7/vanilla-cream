import testAssert from "./test-assert.js"
import testHandleStateEvent from "./test-handle-state-event.js"
import summarize from "./utils/summarize.js"

(async function run() {

    const results = []
    console.group(`🚀 Run tests`)
    results.push(...await testAssert())
    console.log("---")
    results.push(...await testHandleStateEvent())
    console.log("---")
    console.groupEnd()
    summarize(results)
})()