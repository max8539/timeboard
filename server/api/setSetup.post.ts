import { updateSetup } from "../utils/dataUtils"

// Save new setup data to server
export default defineEventHandler(async (e) => {
    let body = await readBody(e)
    if (!(await checkToken(body.token))) {
        return {tokenCheck: false, success: false}
    }
    if (!(
        body.timeFormat == "hh:mm:ss.mss" || body.timeFormat == "hh:mm:ss" || 
        body.timeFormat == "mm:ss.mss" || body.timeFormat == "mm:ss" || 
        body.timeFormat == "ss.mss"
    )) {
        return {tokenCheck: true, success: false}
    }
    await updateSetup(body.rankOrder, body.boardName, body.timeFormat, body.numShow)
    return {tokenCheck: true, success: true}
})