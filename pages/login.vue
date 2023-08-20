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
    <FormContainer>
        <FormHeading>Organiser Login</FormHeading>
        <form>
            <FieldLabel for="password">Enter password:</FieldLabel>
            <input type="password" id="password" v-model="password" :disabled="disableForm()" placeholder="Password" class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 disabled:bg-slate-300 disabled:text-gray-600 drop-shadow-md"/>
            <BlockButton type="submit" @click.prevent="submitForm()" :disabled="disableForm()">Login</BlockButton>
        </form>
        <ErrorBox v-if="formState == 'failed' && password == ''">Incorrect password. Please try again.</ErrorBox>
    </FormContainer>
</template>
