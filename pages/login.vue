<script setup lang="ts">
    const admin = useState("admin")
    const password = ref("")
    const formState = ref("none")

    definePageMeta({
        layout: "nav-home-only"
    })

    function disableForm() {
        return formState.value == "success" || formState.value == "sent"
    }
    
    async function submitForm() {
        formState.value = "sent"
        let res = await $fetch("/api/login", {method: "POST", body: {password: password.value}})
        if (res.success) {
            formState.value = "success"
            sessionStorage.setItem("token", res.token)
            admin.value = true
        } else {
            formState.value = "failed"
            password.value = ""
        }
    }
</script>
<template>
    <h1>login.vue</h1>
    <form>
        <label for="password">Enter password:</label>
        <br>
        <input type="password" id="password" v-model="password" :disabled="disableForm()"/>
        <br>
        <button type="submit" @click.prevent="submitForm" :disabled="disableForm()">Enable admin access</button>
    </form>
    <div v-if="formState == 'success'">
        <p>Login success!</p>
        <NuxtLink href="/setup">Setup panel</NuxtLink>
        <br>
        <NuxtLink href="/top">Back to leaderboard</NuxtLink>
    </div>
    <div v-else-if="formState == 'failed' && password == ''">
        <p>Incorrect password. Please try again.</p>
    </div>
    <div v-else></div>
</template>
