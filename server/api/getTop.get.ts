export default defineEventHandler(async (e) => {
    let recordsData = await getRecords()
    let i = 0
    let topFive = []
    while (i < recordsData.records.length && topFive.length < 5) {
        if (recordsData.records[i].ranking != "-") {
            topFive.push({
                id: recordsData.records[i].id,
                name: recordsData.records[i].name,
                ranking: recordsData.records[i].ranking,
                time: formatTime(recordsData.records[i].time, recordsData.timeFormat)
            })
        }
        i += 1
    }
    return {
        boardName: recordsData.boardName,
        records: topFive
    }
})