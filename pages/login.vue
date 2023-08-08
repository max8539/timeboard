<script setup lang="ts">
    const admin = useState("admin")
    const password = ref("")
    const loginState = ref("none")

    definePageMeta({
        layout: "hide-nav"
    })

    async function login() {
        let res = await $fetch("/api/login", {method: "POST", body: {password: password.value}})
        if (res.success) {
            loginState.value = "success"
            sessionStorage.setItem("token", res.token)
            admin.value = true
        } else {
            loginState.value = "failed"
            password.value = ""
        }
    }
</script>
<template>
    <h1>login.vue</h1>
    <form>
        <label for="password">Enter password:</label>
        <br>
        <input type="password" id="password" v-model="password" :disabled="loginState == 'success'"/>
        <br>
        <button type="submit" @click.prevent="login" :disabled="loginState == 'success'">Enable admin access</button>
    </form>

    <button @click="login">Login</button>
    <div v-if="loginState == 'success'">
        <p>Login success!</p>
        <NuxtLink href="/setup">Setup panel</NuxtLink>
        <br>
        <NuxtLink href="/top">Back to leaderboard</NuxtLink>
    </div>
    <div v-else-if="loginState == 'failed' && password == ''">
        <p>Incorrect password. Please try again.</p>
    </div>
</template>