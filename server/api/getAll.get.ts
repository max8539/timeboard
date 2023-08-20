export default defineEventHandler(async (e) => {
    let recordsData = await getRecords()
    let result = []
    for (let r of recordsData.records) {
        result.push({
            id: r.id,
            name: r.name,
            ranking: r.ranking,
            time: formatTime(r.time, recordsData.timeFormat),
            removed: r.removed
        })
    }
    return {
        boardName: recordsData.boardName,
        records: result
    }
})