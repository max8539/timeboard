// Return setup data, or an empty data set if unauthorised
export default defineEventHandler(async (e) => {
    let setupData = await getSetup()
    return {
        rankOrder: setupData.rankOrder,
        boardName: setupData.boardName,
        timeFormat: setupData.timeFormat,
        numShow: setupData.numShow
    }
})