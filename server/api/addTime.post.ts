export default defineEventHandler(async (e) => {
    const timeRegex = new RegExp("^([0-9]+:)?([0-9]+:)?[0-9]+(\\.[0-9]+)?$") 

    let body = await readBody(e)
    if (!(await checkToken(body.token))) {
        return {tokenCheck: false, success: false}
    }
    if (!timeRegex.test(body.time)) {
        return {tokenCheck: true, success: false}
    }
    let timeParts = body.time.split(":")
    let seconds = 0
    if (timeParts.length == 3) {
        seconds += (Number(timeParts[0]) * 3600)
        seconds += (Number(timeParts[1] * 60))
        seconds += (Number(timeParts[2]))
    } else if (timeParts.length == 2) {
        seconds += (Number(timeParts[0] * 60))
        seconds += (Number(timeParts[1]))
    } else {
        seconds = Number(timeParts[0])
    }
    await addRecord(body.name, seconds)
    return {tokenCheck: true, success: true}
})