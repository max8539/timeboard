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
        formState.value = "success"
    }
</script>
<template>
    <div v-if="admin">
        <div v-if="defaultPass">
            <p>It appears the default password is still being used. For security reasons, you must change the password before adding a time or changing settings.</p>
            <p><NuxtLink href="/changePassword">Change timeboard password</NuxtLink></p>
        </div>
        <div v-else>
            <h1>Add a time</h1>
            <form>
                <label for="name">
                    <p>Enter name</p>
                </label>
                <input type="text" id="name" v-model="name" :disabled="disableForm()" />
                <br>
                <p>{{ name.length }}/15</p>
                <label for="time">
                    <p>Enter time</p>
                </label>
                <input type="text" id="time" v-model="time" :disabled="disableForm()" />
                <br>
                <div v-if="time != '' && !validTime()">
                    <p>Invalid time.</p>
                </div>
                <button type="submit" @click.prevent="submitForm()" :disabled="disableSubmit()">Add time</button>
            </form>
            <div v-if="formState == 'success'">
                <p>Time added!</p>
                <p><NuxtLink href="/top">Back to leaderboard</NuxtLink></p>
            </div>
        </div>
    </div>
    <div v-else>
        <h1>Unauthorised</h1>
        <NuxtLink href="/top">Back to leaderboards</NuxtLink>
    </div>
</template>