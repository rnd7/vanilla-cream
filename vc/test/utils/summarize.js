export default function summarize(results)  {
    const summary = results.reduce(
        (accumulator, currentValue) => {
            if(currentValue) accumulator.succesful++
            else accumulator.failed++
            return accumulator
        },
        {succesful:0, failed:0}
    )
    const icon = (summary.failed)?'❌':'✅'
    console.log(`${icon} Assertions: ${results.length}, successful: ${summary.succesful}, failed: ${summary.failed}`)

}