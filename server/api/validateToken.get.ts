import * as jwt from "jsonwebtoken"

export default defineEventHandler(async (e) => {
    let query = getQuery(e)
    if (query == undefined || query.token == undefined) {
        return {"success": "noquery"}
    }
    let token = query.token.toString()
    let result = await checkToken(token)
    return {"success": result}
})