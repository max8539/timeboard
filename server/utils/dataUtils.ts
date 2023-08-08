import * as fs from "fs"
import * as crypto from "crypto"
import * as jose from "jose"

type record = {
    id: string,
    name: string,
    time: number
}

type jsonData = {
    setup: {
        boardName: string,
        ranking: string,
        password: string
    },
    records: record[]
}

export class LoginError extends Error{}

async function setData(data: jsonData) {
    await fs.promises.writeFile("data.json", JSON.stringify(data), {encoding:"utf-8"})
}

export async function init() {
    let data: jsonData = {
        setup: {
            boardName: "Records board",
            ranking: "shortest",
            password: ""
    
        },
        records: []
    }
    const h1 = crypto.createHash("sha256")
    const hashedPass = h1.update("admin").digest("base64url")
    data.setup.password = hashedPass
    await setData(data)
}

async function getData(): Promise<jsonData> {
    if (!fs.existsSync("data.json")) {
        await init()
    }
    return JSON.parse(await fs.promises.readFile("data.json", {encoding:"utf-8"}))
}

export async function getRecords() {
    return (await getData()).records
}

export async function getSetup() {
    return (await getData()).setup
}

export async function getSortOrder() {
    let setup = await getSetup()
    return setup.ranking
}

export async function login(password: string) {
    const setup = await getSetup()
    const h1 = crypto.createHash("sha256")
    const hashedPass = new TextEncoder().encode(h1.update(password).digest("base64url"))
    const secret = new TextEncoder().encode(setup.password)
    if (!crypto.timingSafeEqual(hashedPass, secret)) {
        throw new LoginError("Invalid login")
    }
    let loginId = crypto.randomUUID()

    let token = await new jose.SignJWT({id:loginId}).setProtectedHeader({alg: "HS256"}).sign(secret)
    return token
}

export async function checkToken(token: string) {
    const setup = await getSetup()
    const secret = new TextEncoder().encode(setup.password)
    try {
        jose.jwtVerify(token, secret)
    } catch (e) {
        return false
    }
    return true
}

export async function addRecord(name: string, time: number) {
    let data = await getData()
    data.records.push({
        name: name,
        time: time,
        id: crypto.randomUUID().toString()
    })
    data.records.sort((a,b) => {
        if (data.setup.ranking == "longest") {
            return b.time - a.time
        } else {
            return a.time - b.time
        }
    })
    await setData(data)
}

export async function deleteRecord(id: string) {
    let data = await getData()
    data.records.filter(r => r.id != id)
    await setData(data)
}

export async function reset() {
    let setup = await getSetup()
    let data: jsonData = {
        setup: {
            boardName: "Records board",
            ranking: "shortest",
            password: setup.password
    
        },
        records: []
    }
    await setData(data)
}

