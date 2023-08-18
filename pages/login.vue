<script setup lang="ts">
    const admin = useState("admin")
    const password = ref("")
    const formState = ref("none")

    definePageMeta({
        layout: "nav-home-only"
    })

    function disableForm() {
        return formState.value == "sent"
    }
    
    async function submitForm() {
        formState.value = "sent"
        let res = await $fetch("/api/login", {method: "POST", body: {password: password.value}})
        if (res.success) {
            sessionStorage.setItem("token", res.token)
            admin.value = true
            navigateTo("/setup")
        } else {
            formState.value = "failed"
            password.value = ""
        }
    }
</script>
<template>
    <div class="w-full sm:w-[600px] m-auto p-6 text-black">
        <h1 class="text-center text-2xl">Organiser login</h1>
        <form>
            <label for="password" class="block my-2">Enter password:</label>
            <input type="password" id="password" v-model="password" :disabled="disableForm()" placeholder="Password" class="block w-full h-8 my-2 px-2 py-1 bg-blue-100 focus-within:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600" />
            <button type="submit" @click.prevent="submitForm" :disabled="disableForm()" class="block w-full h-8 my-2 text-center p-1 bg-blue-400 hover:bg-blue-300 disabled:bg-slate-400 disabled:text-gray-600">Login</button>
        </form>
        <div v-if="formState == 'failed' && password == ''" class="my-4 px-2 py-1 bg-red-300">
            <p>Incorrect password. Please try again.</p>
        </div>
    </div>
</template>
