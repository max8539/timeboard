<script setup lang="ts">
    const adminState = useState("admin")
    onMounted(async () => {
        let token = sessionStorage.getItem("token")
        let res = await $fetch("/api/validateToken", {method: "GET", params: {token: token}})
        if (!res.success) {
            sessionStorage.removeItem("token")
        }
        adminState.value = res.success
    })
</script>
<template>
    <div v-if="adminState == true">
        <h1>setup.vue</h1>
        <p>admin: {{adminState}}</p>
    </div>
    <div v-else>
        <h1>Unauthorised</h1>
        <NuxtLink href="/top">Back to safety</NuxtLink>
    </div>
</template>
