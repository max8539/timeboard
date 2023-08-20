<script setup lang="ts">
    const admin = useState("admin")
    const defaultPass = ref(false)
    const formState = ref("none")
    const resetMenu = ref(false)
   
    let currentVals = {
        rankOrder: "shortest",
        boardName: "",
        timeFormet: "mm:ss.mss",
        numShow: 5
    }
    
    let requestData = await useFetch("/api/getSetup", {method: "GET"})
    if (requestData.data.value != undefined) {
        currentVals.rankOrder = requestData.data.value.rankOrder
        currentVals.boardName = requestData.data.value.boardName
        currentVals.timeFormet = requestData.data.value.timeFormat
        currentVals.numShow = requestData.data.value.numShow
    }
    const rankOrder = ref(currentVals.rankOrder)
    const boardName = ref(currentVals.boardName)
    const timeFormat = ref(currentVals.timeFormet)
    const numShow = ref(currentVals.numShow)

    let checkDefaultPass = await useFetch("/api/isDefaultPassword", {method: "GET"})
    if (checkDefaultPass.data.value != undefined && checkDefaultPass.data.value.result) {
        defaultPass.value = true
    }

    function disableForm() {
        return formState.value == "sent"
    }

    function disableSubmit() {
        return disableForm() ||
        (rankOrder.value == currentVals.rankOrder &&
        boardName.value == currentVals.boardName &&
        timeFormat.value == currentVals.timeFormet &&
        numShow.value == currentVals.numShow)
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
            timeFormat: timeFormat.value,
            numShow: numShow.value
        }})
        if (!res.tokenCheck) {
            admin.value = false
            sessionStorage.removeItem("token")
        }
        formState.value = "success"
        currentVals.rankOrder = rankOrder.value
        currentVals.boardName = boardName.value
        currentVals.timeFormet = timeFormat.value
        currentVals.numShow = numShow.value
    }

    function toggleResetMenu() {
        resetMenu.value = !resetMenu.value
    }

    async function reset() {
        formState.value = "sent"
        let res = await $fetch("/api/reset", {method: "POST", body: {
            token: sessionStorage.getItem("token")
        }})
        if (!res.tokenCheck) {
            admin.value = false
            sessionStorage.removeItem("token")
        }

        if (res.success) {
            navigateTo("/top")
        }
    }
</script>

<template>
    <div v-if="admin">
        <DefaultPass v-if="defaultPass" />
        <FormContainer v-else>
            <FormHeading>Timeboard Settings</FormHeading>
            <form>
                <div>
                    <FieldLabel for="rank-order">Set ranking order:</FieldLabel>
                    <p>
                        Rank the
                        <select id="rank-order" v-model="rankOrder" :disabled="disableForm()" class="span px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600">
                            <option value="shortest">shortest</option>
                            <option value="longest">longest</option>
                        </select>
                        times first.
                    </p>
                </div>
                <div>
                    <FieldLabel for="board-name">Set leaderboard title:</FieldLabel>
                    <input type="text" id="board-name" v-model="boardName" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600" />
                </div>
                <div>
                    <FieldLabel for="time-format">Set time display format</FieldLabel>
                    <select id="time-format" v-model="timeFormat" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600">
                        <option value="ss.mss">ss.mss</option>
                        <option value="mm:ss.mss">mm:ss.mss</option>
                        <option value="mm:ss">mm:ss</option>
                        <option value="hh:mm:ss.mss">hh:mm:ss.mss</option>
                        <option value="hh:mm:ss">hh:mm:ss</option>
                    </select>
                </div>
                <div>
                    <FieldLabel for="num-sho2">Set the number of times to show on the main leaderboard:</FieldLabel>
                    <input type="number" min="1" v-model="numShow" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600" />
                </div>
                <BlockButton type="submit" @click.prevent="submitForm()" :disabled="disableSubmit()">Save changes</BlockButton>
            </form>
            <SuccessBox v-if="showSuccess()">Changes saved.</SuccessBox>
            <br>

            <FormHeading>Other Timeboard Actions</FormHeading>
            <NuxtLink href="/changePassword" class="block w-full my-4 text-center p-2 bg-blue-400 hover:bg-blue-300 disabled:bg-slate-400 disabled:text-gray-600 drop-shadow-md">Change password</NuxtLink>
            <RedButton @click="toggleResetMenu()" :disabled="resetMenu">Delete all times</RedButton>
            <div v-if="resetMenu">
                <p>You are about to clear the leaderboard and delete all times that are saved on the system. This cannot be undone, and you cannot restore these times later. Continue?</p>
                <div class="flex space-x-2 sm:space-x-4">
                    <BlockButton @click="toggleResetMenu()">Cancel</BlockButton>
                    <RedButton @click="reset()">Delete all times</RedButton>
                </div>
            </div>
            
        </FormContainer>
    </div>

    <Unauth v-else />
</template>
