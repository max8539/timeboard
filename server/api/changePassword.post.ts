// Verify token and old password, change password and return new token
export default defineEventHandler(async (e) => {
    let token = ""
    let body = await readBody(e)
    if (!(await checkToken(body.token))) {
        return {checkToken: false, success: false, token: ""}
    }
    if (body.newPass == 'admin') {
        return {checkToken: true, success: false, token: ""}
    }
    try {
        token = await changePassword(body.oldPass, body.newPass)
    } catch (e) {
        if (e instanceof LoginError) {
            return {checkToken: true, success: false, token: ""}
        }
    }
    return {checkToken: true, success: true, token: token}
})