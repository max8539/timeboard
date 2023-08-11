<script setup lang="ts">
    const admin = useState("admin")
    const defaultPass = ref(false)
    const formState = ref("none")
   
    let currentVals = {
        rankOrder: "shortest",
        boardName: "",
        timeFormet: "mm:ss.mss"
    }
    
    let requestData = await useFetch("/api/getSetup", {method: "GET"})
    if (requestData.data.value != undefined) {
        currentVals.rankOrder = requestData.data.value.rankOrder
        currentVals.boardName = requestData.data.value.boardName
        currentVals.timeFormet = requestData.data.value.timeFormat
    }
    const rankOrder = ref(currentVals.rankOrder)
    const boardName = ref(currentVals.boardName)
    const timeFormat = ref(currentVals.timeFormet)

    let checkDefaultPass = await useFetch("/api/isDefaultPassword", {method: "GET"})
    if (checkDefaultPass.data.value != undefined && checkDefaultPass.data.value.result) {
        defaultPass.value = true
    }

    function disableForm() {
        return formState.value == "sent"
    }

    function disableSubmit() {
        return disableForm() || boardName.value.length > 30 ||
        (rankOrder.value == currentVals.rankOrder &&
        boardName.value == currentVals.boardName &&
        timeFormat.value == currentVals.timeFormet)
    }

    function showSuccess() {
        return formState.value == "success" && 
        rankOrder.value == rankOrder.value && boardName.value == boardName.value
    }

    async function submitForm() {
        formState.value = "sent"
        let res = await $fetch("/api/setSetup", {method: "POST", body: {
            token: sessionStorage.getItem("token"),
            rankOrder: rankOrder.value,
            boardName: boardName.value,
            timeFormat: timeFormat.value
        }})
        if (!res.tokenCheck) {
            admin.value = false
            sessionStorage.removeItem("token")
        }
        formState.value = "success"
        currentVals.rankOrder = rankOrder.value
        currentVals.boardName = boardName.value
        currentVals.timeFormet = timeFormat.value
    }

    async function reset() {
        formState.value = "sent"
        let res = await $fetch("/api/reset", {method: "POST", body: {
            token: sessionStorage.getItem("token")
        }})
        admin.value = false
        sessionStorage.removeItem("token")
        if (res.success) {
            navigateTo("/top")
        }
    }

    definePageMeta({
        layout: "nav-home-only"
    })
</script>
<template>
    <div v-if="admin">
        <div v-if="defaultPass">
            <p>It appears the default password is still being used. For security reasons, you must change the password before adding a time or changing settings.</p>
            <p><NuxtLink href="/changePassword">Change timeboard password</NuxtLink></p>
        </div>
        <div v-else>
            <h1>Update Timeboard settings</h1>
            <form>
                <label for="rank-order">
                    <p>Set ranking order</p>
                </label>
                <p>
                    Rank the
                    <select id="rank-order" v-model="rankOrder" :disabled="disableForm()">
                        <option value="shortest">shortest</option>
                        <option value="longest">longest</option>
                    </select>
                    times first.
                </p>
                <label for="board-name">
                    <p>Set board title</p>
                </label>
                <input type="text" id="board-name" v-model="boardName" :disabled="disableForm()"/>
                <br>
                <p>{{ boardName.length }}/30</p>
                <label for="time-format">
                    <p>Set time display format</p>
                </label>
                <select id="time-format" v-model="timeFormat" :disabled="disableForm()">
                    <option value="ss.mss">ss.mss</option>
                    <option value="mm:ss.mss">mm:ss.mss</option>
                    <option value="mm:ss">mm:ss</option>
                    <option value="hh:mm:ss.mss">hh:mm:ss.mss</option>
                    <option value="hh:mm:ss">hh:mm:ss</option>
                </select>
                <br>
                <button type="submit" @click.prevent="submitForm" :disabled="disableSubmit()">Save changes</button>
            </form>
            <div v-if="showSuccess()">
                <p>Changes saved.</p>
                <p><NuxtLink href="/top">Back to leaderboard</NuxtLink></p>
            </div>
            <div v-else></div>
            <h1>Other timeboard actions</h1>
            <p><NuxtLink href="/changePassword">Change admin password</NuxtLink></p>
            <br>
            <button @click="reset">Reset Timeboard</button>
        </div>
    </div>
    <div v-else>
        <h1>Unauthorised</h1>
        <NuxtLink href="/top">Back to leaderboards</NuxtLink>
    </div>
</template>
