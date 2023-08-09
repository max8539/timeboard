import { updateSetup } from "../utils/dataUtils"

// Save new setup data to server
export default defineEventHandler(async (e) => {
    let body = await readBody(e)
    if (!(await checkToken(body.token))) {
        return {tokenCheck: false, success: false}
    }
    await updateSetup(body.rankOrder, body.boardName, body.timeFormat)
    return {tokenCheck: true, success: true}
})