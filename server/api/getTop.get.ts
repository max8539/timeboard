export default defineEventHandler(async (e) => {
    let recordsData = await getRecords()
    let i = 0
    let topRecords = []
    while (i < recordsData.records.length && topRecords.length < recordsData.numShow) {
        if (recordsData.records[i].ranking != "-" && !recordsData.records[i].removed) {
            topRecords.push({
                id: recordsData.records[i].id,
                name: recordsData.records[i].name,
                ranking: recordsData.records[i].ranking,
                time: formatTime(recordsData.records[i].time, recordsData.timeFormat),
                removed: recordsData.records[i].removed
            })
        }
        i += 1
    }
    return {
        boardName: recordsData.boardName,
        records: topRecords
    }
})