import * as fs from "fs"
import * as crypto from "crypto"
import * as jose from "jose"

export type record = {
    id: string,
    ranking: string,
    name: string,
    time: number,
    removed: boolean
}

type jsonData = {
    setup: {
        boardName: string,
        rankOrder: string,
        timeFormat: string,
        numShow: number,
        password: string
    },
    records: record[]
}

export class LoginError extends Error{}

async function getData(): Promise<jsonData> {
    if (!fs.existsSync("data.json")) {
        await init()
    }
    return JSON.parse(await fs.promises.readFile("data.json", {encoding:"utf-8"}))
}


function doRankings(records: record[]) {
    let playerNames: string[] = []
    let nextRank = 1
    let prevTime = NaN
    let prevRank = " "
    for (let r of records) {
        if (r.removed) {
            r.ranking = " "
        } else if (playerNames.includes(r.name)) {
            r.ranking = "-"
        } else {
            if (r.time == prevTime) {
                r.ranking = prevRank
            } else {
                r.ranking = nextRank.toString()
                prevRank = r.ranking
                prevTime = r.time
            }
            playerNames.push(r.name)
            nextRank += 1
        }
    }
    return records
}

function sortRecords(records: record[], rankOrder: string) {
    records.sort((a,b) => {
        if (rankOrder == "longest") {
            return b.time - a.time
        } else {
            return a.time - b.time
        }
    })
    return doRankings(records)
}

function insertRecord(records: record[], newRecord: record, rankOrder: string) {
    let result: record[] = []
    let i = 0
    if (rankOrder == "longest") {
        while (i < records.length && records[i].time >= newRecord.time) {
            result.push(records[i])
            i += 1
        }
    } else {
        while (i < records.length && records[i].time <= newRecord.time) {
            result.push(records[i])
            i += 1
        }
    }
    result.push(newRecord)
    while (i < records.length) {
        result.push(records[i])
        i += 1
    }
    return doRankings(result)
}

async function setData(data: jsonData) {
    await fs.promises.writeFile("data.json", JSON.stringify(data), {encoding:"utf-8"})
}

export async function init() {
    let data: jsonData = {
        setup: {
            boardName: "Records",
            rankOrder: "shortest",
            timeFormat: "mm:ss.mss",
            numShow: 5,
            password: ""
        },
        records: []
    }
    const hasher = crypto.createHash("sha256")
    const hashedPass = hasher.update("admin").digest("base64url")
    data.setup.password = hashedPass
    await setData(data)
}

export async function getRecords() {
    let data = await getData()
    return {
        boardName: data.setup.boardName,
        timeFormat: data.setup.timeFormat,
        records: data.records
    }
}

export function formatTime(seconds: number, format: string) {
    let milliseconds = seconds % 1
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let millisecondsStr = (Math.round(milliseconds * 1000)).toString().padEnd(3, "0")
    let secondsStr = Math.floor(seconds).toString().padStart(2, "0")
    let minutesStr = Math.floor(minutes).toString().padStart(2, "0")
    let hoursStr = Math.floor(hours).toString().padStart(2, "0")
    
    if (format == "hh:mm:ss:mss" || format == "hh:mm:ss") {
        minutesStr = Math.floor(minutes % 60).toString().padStart(2, "0")
        secondsStr = Math.floor(seconds % 60).toString().padStart(2, "0")
    } else if (format == "mm:ss" || !(format == "ss.mss")) {
        secondsStr = Math.floor(seconds % 60).toString().padStart(2, "0")
    }

    if (format == "ss.mss") {
        return `${secondsStr}.${millisecondsStr}`
    } else if (format == "mm:ss") {
        return `${minutesStr}:${secondsStr}`
    } else if (format == "hh:mm:ss:mss") {
        return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`
    } else if (format == "hh:mm:ss") {
        return `${hoursStr}:${minutesStr}:${secondsStr}`
    } else {
        return `${minutesStr}:${secondsStr}.${millisecondsStr}`
    }
}

export async function getSetup() {
    let data = await getData()
    return data.setup
}

export async function getSortOrder() {
    let setup = await getSetup()
    return setup.rankOrder
}

export async function login(password: string) {
    if (password == undefined) {
        throw new LoginError()
    }
    const setup = await getSetup()
    const hasher = crypto.createHash("sha256")
    const hashedPass = new TextEncoder().encode(hasher.update(password).digest("base64url"))
    const secret = new TextEncoder().encode(setup.password)
    if (!crypto.timingSafeEqual(hashedPass, secret)) {
        throw new LoginError()
    }
    let loginId = crypto.randomUUID()

    let token = await new jose.SignJWT({id:loginId}).setProtectedHeader({alg: "HS256"}).sign(secret)
    return token
}

export async function checkToken(token: string) {
    if (token == "") {
        return false
    }
    const setup = await getSetup()
    const secret = new TextEncoder().encode(setup.password)
    try {
        await jose.jwtVerify(token, secret, {algorithms: ["HS256"]})
    } catch (e) {
        return false
    }
    return true
}

export async function updateSetup(rankOrder: string, boardName: string, timeFormat: string, numShow: number) {
    if (rankOrder == undefined || boardName == undefined || timeFormat == undefined || numShow == undefined) {
        return
    }
    let data = await getData()
    if (rankOrder != data.setup.rankOrder) {
        data.records = sortRecords(data.records, rankOrder)
    }
    data.setup.rankOrder = rankOrder
    data.setup.boardName = boardName
    data.setup.timeFormat = timeFormat
    data.setup.numShow = numShow
    await setData(data)
}

export async function addRecord(name: string, time: number) {
    if (name == undefined || time == undefined) {
        return
    }
    let data = await getData()
    let newRecord = {
        id: crypto.randomUUID(),
        ranking: "",
        name: name,
        time: time,
        removed: false
    }
    data.records = insertRecord(data.records, newRecord, data.setup.rankOrder)
    await setData(data)
}

export async function removeRecord(id: string) {
    if (id == undefined) {
        return
    }
    let data = await getData()
    for (let r of data.records) {
        if (r.id == id) {
            r.removed = true
        }
    }
    data.records = doRankings(data.records)
    await setData(data)
}

export async function restoreRecord(id: string) {
    if (id == undefined) {
        return
    }
    let data = await getData()
    for (let r of data.records) {
        if (r.id == id) {
            r.removed = false
        }
    }
    data.records = doRankings(data.records)
    await setData(data)
}

export async function changePassword(oldPass: string, newPass: string) {
    if (oldPass == undefined || newPass == undefined) {
        throw new LoginError()
    }
    await login(oldPass)
    let data = await getData()
    const hasher = crypto.createHash("sha256")
    const hashedPass = hasher.update(newPass).digest("base64url")
    data.setup.password = hashedPass
    await setData(data)

    const secret = new TextEncoder().encode(data.setup.password)
    let loginId = crypto.randomUUID()
    let token = await new jose.SignJWT({id:loginId}).setProtectedHeader({alg: "HS256"}).sign(secret)
    return token
}

export async function reset() {
    let data = await getData()
    data.records = []
    await setData(data)
}

