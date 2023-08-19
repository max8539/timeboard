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

    function newPassInvalid() {
        return newPass.value == "admin"
    }

    function passwordMatch() {
        return confirmPass.value != '' && newPass.value == confirmPass.value 
        && newPass.value != "admin" && !disableForm()
    }

    // Tailwind class overrides for certain form states
    const newPassState = computed(() => { return {
        'bg-blue-100': !(newPass.value == "admin" || passwordMatch()),
        'focus-within:bg-blue-50': !(newPass.value == "admin" || passwordMatch()),
        'bg-red-300': newPass.value == "admin", 
        'focus:bg-red-300': newPass.value == "admin", 
        'bg-green-300': passwordMatch(), 
        'focus:bg-green-300': passwordMatch()
    }})
    const confirmPassState = computed(() => { return {
        'bg-blue-100': !passwordMatch(),
        'focus-within:bg-blue-50': !passwordMatch(),
        'bg-green-300': passwordMatch(), 
        'focus:bg-green-300': passwordMatch()
    }})

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
            navigateTo("/setup")
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
    <FormContainer v-if="admin">
        <FormHeading>Change Password</FormHeading>
        <form>
            <FieldLabel for="old-pass">Current password:</FieldLabel>
            <input type="password" id="old-pass" v-model="oldPass" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus-within:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600" />
            <FieldLabel for="new-pass">New password:</FieldLabel>
            <input type="password" id="new-pass" v-model="newPass" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus-within:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600" :class="newPassState" />
            <FieldLabel for="confirm-pass">Confirm password:</FieldLabel>
            <input type="password" id="confirm-pass" v-model="confirmPass" :disabled="disableForm()" class="block w-full my-2 px-2 py-1 bg-blue-100 focus-within:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600" :class="confirmPassState" />
            <BlockButton type="submit" @click.prevent="submitForm()" :disabled="disableSubmit()">Change password</BlockButton>
        </form>
        <ErrorBox v-if="newPass == 'admin'">You cannot set the password to the default password.</ErrorBox>
        <ErrorBox v-else-if="confirmPass != '' && confirmPass != newPass">Passwords do not match.</ErrorBox>
        <ErrorBox v-if="formState == 'failed' && oldPass == '' && newPass == '' && confirmPass == ''">Password could not be changed.</ErrorBox>
    </FormContainer>
    <Unauth v-else />
</template>