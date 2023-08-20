<script setup lang="ts">
    const admin = useState("admin")
    const defaultPass = ref(false)
    const formState = ref("none")
    const name = ref("")
    const time = ref("")
    const timeRegex = new RegExp("^([0-9]+:)?([0-9]+:)?[0-9]+(\\.[0-9]+)?$") 

    let checkDefaultPass = await useFetch("/api/isDefaultPassword", {method: "GET"})
    if (checkDefaultPass.data.value != undefined && checkDefaultPass.data.value.result) {
        defaultPass.value = true
    }

    function validTime() {
        return timeRegex.test(time.value)
    }

    function disableForm() {
        return formState.value == "sent" || formState.value == "success"
    }
    function disableSubmit() {
        return disableForm() || name.value == "" || name.value.length > 15 || !validTime()
    }

    async function submitForm() {
        formState.value = "sent"
        let res = await $fetch("/api/addTime", {method: "POST", body: {
            token: sessionStorage.getItem("token"),
            name: name.value,
            time: time.value
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
        <WideContainer v-else>
            <h1 class="text-center font-bold text-2xl sm:text-4xl">Add a Time</h1>
            <form>
                <label for="name" class="font-bold sm:text-2xl">Name:</label>
                <input type="text" id="name" maxlength="15" v-model="name" :disabled="disableForm()" class="block w-full mt-2 px-2 py-1 sm:mt-4 sm:px-4 sm:py-2 sm:text-2xl bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600"/>
                <p class="mb-2 sm:mh-4 text-right text-xs sm:text-base" :class="{'text-red-500': name.length > 15}">{{ name.length }}/15</p>
                <label for="time" class="font-bold sm:text-2xl">Time:</label>
                <input type="text" id="time" v-model="time" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 sm:my-4 sm:px-4 sm:py-2 sm:text-2xl bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600"/>
                <button type="submit" @click.prevent="submitForm()" :disabled="disableSubmit()" class="block w-full my-4 p-2 sm:my-8 sm:p-4 sm:text-2xl text-center  bg-blue-400 hover:bg-blue-300 disabled:bg-slate-400 disabled:text-gray-600 drop-shadow-md">Add time</button>
            </form>
            <div v-if="time != '' && !validTime()" class="my-4 px-2 py-4 sm:my-8 sm:px-4 sm:py-8 sm:text-2xl bg-red-300">
                <p>Invalid time.</p>
            </div>
            <div v-if="formState == 'success'" class="my-4 px-2 py-4 sm:my-8 sm:px-4 sm:py-8 sm:text-2xl bg-green-300">
                <p>Time added!</p>
                <p><NuxtLink href="/top">Back to leaderboard</NuxtLink></p>
            </div>
        </WideContainer>
    </div>
    
    <Unauth v-else />
</template>
