export default defineEventHandler(async (e) => {
    let body = await readBody(e)
    if (!(await checkToken(body.token))) {
        return {tokenCheck: false, success: false}
    }
    console.log(`remove ${body.id}`)
    await deleteRecord(body.id)
    return {tokenCheck: true, success: true}
})