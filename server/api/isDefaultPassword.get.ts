// Check if the default password "admin" is still being used 
export default defineEventHandler(async (e) => {
    try {
        await login("admin")
    } catch (e) {
        if (e instanceof LoginError) {
            return {result: false}
        } else {
            throw e
        }
    }
    return {result: true}
})