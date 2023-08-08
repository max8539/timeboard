// Temporary method for testing only
export default defineEventHandler(async (e) => {
    const query = getQuery(e)
    return query.admin
})