export default defineEventHandler(async (e) => {
    let body = await readBody(e)
    let password = body.password
    let token = ""
    try {
        token = await login(password)
    } catch (err) {
        if (err instanceof LoginError) {
            return {success: false, token: ""}
        } else {
            throw err
        }
    } 
    return {success: true, token: token}
})