<script setup lang="ts">
    const admin = useState("admin")
    function toggleAdmin() {
        admin.value = false
        sessionStorage.removeItem("token")
    }
</script>
<template>
    <div id="nav-admin" v-if="admin == true">
        <div>
            <NuxtLink to="/top">Home</NuxtLink>
        </div>
        <div>
            <NuxtLink to="/all">View all times</NuxtLink>
        </div>
        <div>
            <NuxtLink to="/setup">Setup</NuxtLink>
        </div>
        <div>
            <button @click="toggleAdmin">Disable admin access</button>
        </div>
    </div>
    <div id="nav-noadmin" v-else>
        <div>
            <NuxtLink to="/top">Home</NuxtLink>
        </div>
        <div>
            <NuxtLink to="/all">View all times</NuxtLink>
        </div>
        <div>
            <NuxtLink to="/login">Enable admin access</NuxtLink>
        </div>
    </div>
</template>
<style scoped>
    #nav-admin {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        margin-bottom: 10px;
    }
    #nav-noadmin {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 10px;
    }
</style>