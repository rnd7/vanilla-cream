import handleStateEvent from "../src/handle-state-event.js"
import { REMOVE_STATE, REPLACE_STATE } from "../src/event.js"
import assert from "./utils/assert.js"
import summarize from "./utils/summarize.js"


/*
    Replace,
    Remove
    Insert


*/
function syntheticEvent({modifiedState, reference=null, remove=false, statePath=[]}) {
    const ev =  {
        detail: {
            modifiedState
        },
        composedPath:()=>{
            return statePath.map(state=>{
                return {state}
            })
        }
    }
    if (remove) ev.detail.type = REMOVE_STATE
    else ev.detail.type = REPLACE_STATE
    if (reference) ev.detail.reference = reference
    return ev
}

export default async function testHandleStateEvent() {
    
    console.group(`*️⃣  ${import.meta.url}`)
    const result = [
        await assert(async () => {
            const state = {
                title: "Hello"
            }
            const modifiedState = {title: "Again"}
            const statePath = [state]
            const changedState = handleStateEvent(syntheticEvent({modifiedState, statePath}))
            return assert(() => {
                return changedState.title == "Again" 
                && changedState !== state
            })
        }), 
        await assert(async () => {
            const state = {
                title: "Hello",
                nested: {
                    property: "Something"
                }
            }
            const modifiedState = {property: "Anything"}
            const statePath = [state.nested, state]
            const changedState = handleStateEvent(syntheticEvent({modifiedState, statePath}))
            console.log("changedState", changedState)
            return assert(() => {
                return changedState?.nested?.property === "Anything" 
                && changedState === state
            })
        }), 
        await assert(async () => {
            const state = {
                title: "People",
                list: [{
                    name: "Peter",
                },{
                    name: "Paul",
                },{
                    name: "Mary"
                }]
            }
            const previousEntry = state.list[0]
            const modifiedState = {name: "Justus"}
            const statePath = [state.list[1], state.list, state]
            const changedState = handleStateEvent(syntheticEvent({modifiedState, statePath}))
            console.log("changedState", changedState)
            return assert(() => {
                return changedState?.list[1]?.name === "Justus" 
                && changedState === state
                && changedState.list === state.list
                && changedState.list[1] !== previousEntry
            })
        }), 
        await assert(async () => {
            const state = {
                title: "People",
                list: [{
                    name: "Peter",
                },{
                    name: "Paul",
                },{
                    name: "Mary"
                }]
            }
            const previousEntry = state.list
            const statePath = [state.list[1], state.list, state]
            const changedState = handleStateEvent(syntheticEvent({remove: true, statePath}))
            console.log("changedState", changedState)
            return assert(() => {
                return changedState?.list.length == 2
                    && changedState === state
                    && previousEntry !== changedState.list
            })
        }),
        await assert(async () => {
            const state = {
                title: "People",
                list: [{
                    name: "Peter",
                    tags: ["Good ol fellow"]
                },{
                    name: "Paul",
                    tags: ["Senior Creator"]
                },{
                    name: "Mary",
                    tags: ["Advisory Board Member"]
                }]
            }
            const reference = state.list[1].tags
            const previousEntry = state.list[1].tags
            const modifiedState = [...state.list[1].tags, "Vice President"]
            const statePath = [state.list[1], state.list, state]
            const changedState = handleStateEvent(syntheticEvent({modifiedState, reference, statePath}))
            console.log("state", state.list)
            console.log("changedState", changedState.list)
            return assert(() => {
                return changedState?.list[1]?.tags.length == 2
                    && changedState?.list[1]?.tags[1] === "Vice President"
                    && changedState?.list[1]?.tags !== previousEntry
                    && changedState?.list[1] === state.list[1]
            })
        }), 
    ]
    console.groupEnd()
    summarize(result)
    return result
}
