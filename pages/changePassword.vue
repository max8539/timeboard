<script setup lang="ts">
    const admin = useState("admin")
    const oldPass = ref("")
    const newPass = ref("")
    const confirmPass = ref("")
    const formState = ref("none")

    function disableForm() {
        return formState.value == "sent" || formState.value == "success"
    }
    
    function disableSubmit() {
        return disableForm() || newPass.value == "" || newPass.value == "admin" 
        || newPass.value != confirmPass.value
    }

    async function submitForm() {
        formState.value == "sent"
        let res = await $fetch("/api/changePassword", {method: "POST", body: {
            token: sessionStorage.getItem("token"),
            oldPass: oldPass.value,
            newPass: newPass.value
        }})

        if (!res.checkToken) {
            sessionStorage.removeItem("token")
            admin.value = false
        } else if (!res.success) {
            formState.value = "failed"
            oldPass.value = ""
            newPass.value = ""
            confirmPass.value = ""
        } else {
            sessionStorage.setItem("token", res.token)
            formState.value = "success"
        }
    }

    definePageMeta({
        layout: "nav-home-only"
    })

    onMounted(async () => {
        await checkAdmin()
    })
</script>
<template>
    <div v-if="admin">
        <form>
            <label for="old-pass">Current password</label>
            <br>
            <input type="password" id="old-pass" v-model="oldPass" :disabled="disableForm()"/>
            <br>
            <label for="new-pass">New password</label>
            <br>
            <input type="password" id="new-pass" v-model="newPass" :disabled="disableForm()"/>
            <br>
            <label for="confirm-pass">Confirm new password</label>
            <br>
            <input type="password" id="confirm-pass" v-model="confirmPass" :disabled="disableForm()"/>
            <br>
            <button type="submit" @click.prevent="submitForm" :disabled="disableSubmit()">Change password</button>
        </form>
        <div v-if="newPass == 'admin'">
            <p>You cannot set the password to the default password.</p>
        </div>
        <div v-if="confirmPass != '' && confirmPass != newPass">
            <p>Passwords do not match</p>
        </div>
        <div v-if="formState == 'failed'">
            <p>Password could not be changed.</p>
        </div>
        <div v-else-if="formState == 'success'">
            <p>Password changed.</p>
            <NuxtLink href="/setup">Back to setup</NuxtLink>
        </div>
    </div>
    <div v-else>
        <h1>Unauthorised</h1>
        <NuxtLink href="/top">Back to leaderboards</NuxtLink>
    </div>
</template>