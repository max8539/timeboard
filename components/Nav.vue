<script setup lang="ts">
    const admin = useState("admin")
    const hamburger = ref(false)

    function toggleAdmin() {
        admin.value = false
        sessionStorage.removeItem("token")
    }

    function toggleHamburger() {
        hamburger.value = !hamburger.value
    }
</script>

<template>
    <div class="hidden sm:block h-12 bg-blue-950 text-white shadow">
        <div class="grid grid-cols-[auto_1fr_1fr_1fr_1fr]" v-if="admin">
            <NuxtLink to="/top">
                <img src="logo-white.png" alt="Timeboard logo" class=" h-12 p-1 m-auto" />
            </NuxtLink>
            <NuxtLink class="h-12 w-full hover:bg-blue-900 text-center" to="/top">
                <span class="leading-[3em]">Home</span>
            </NuxtLink>
            <NuxtLink class="h-12 w-full hover:bg-blue-900 text-center" to="/all">
                <span class="leading-[3em]">All Times</span>
            </NuxtLink>
            <NuxtLink class="h-12 w-full hover:bg-blue-900 text-center" to="/setup">
                <span class="leading-[3em]">Settings</span>
            </NuxtLink>
            <button class="h-12 w-full hover:bg-blue-900 text-center" @click="toggleAdmin">
                <span class="leading-[3em]">Logout</span>
            </button>
        </div>
        <div class="grid grid-cols-[auto_1fr_1fr_1fr]" v-else>
            <NuxtLink to="/top">
                <img src="logo-white.png" alt="Timeboard logo" class="h-12 p-1 m-auto" />
            </NuxtLink>
            <NuxtLink class="h-12 w-full hover:bg-blue-900 text-center" to="/top">
                <span class="leading-[3em]">Home</span>
            </NuxtLink>
            <NuxtLink class="h-12 w-full hover:bg-blue-900 text-center" to="/all">
                <span class="leading-[3em]">All Times</span>
            </NuxtLink>
            <NuxtLink class="h-12 w-full hover:bg-blue-900 text-center" to="/login">
                <span class="leading-[3em]">Organiser Login</span>
            </NuxtLink>
        </div>
    </div>

    <div class="block sm:hidden h-12 bg-blue-950 text-white">
        <div class="grid grid-cols-[1fr_auto]">
            <NuxtLink to="/top">
                <img src="logo-white.png" alt="Timeboard logo" class=" h-12 p-1" />
            </NuxtLink>
            <div class="hover:bg-blue-900 h-12">
                <div v-if="hamburger">
                    <button class="m-0 p-0" @click="toggleHamburger()">
                        <img src="cross.png" alt="Close menu" class="h-12 p-1 m-auto" />
                    </button>
                </div>
                <div v-else>
                    <button class="m-0 p-0" @click="toggleHamburger()">
                        <img src="hamburger.png" alt="Open menu" class="h-12 p-1 m-auto" />
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="hamburger" class="w-full block bg-blue-950 text-white">
        <div v-if="admin">
            <NuxtLink class="block h-12 w-full hover:bg-blue-900 text-center" to="/top">
                <span class="leading-[3em]">Home</span>
            </NuxtLink>
            <NuxtLink class="block h-12 w-full hover:bg-blue-900 text-center" to="/all">
                <span class="leading-[3em]">All Times</span>
            </NuxtLink>
            <NuxtLink class="block h-12 w-full hover:bg-blue-900 text-center" to="/setup">
                <span class="leading-[3em]">Settings</span>
            </NuxtLink>
            <button class="block h-12 w-full hover:bg-blue-900 text-center" @click="toggleAdmin">
                <span class="leading-[3em]">Logout</span>
            </button>
        </div>
        <div v-else>
            <NuxtLink class="block h-12 w-full hover:bg-blue-900 text-center" to="/top">
                <span class="leading-[3em]">Home</span>
            </NuxtLink>
            <NuxtLink class="block h-12 w-full hover:bg-blue-900 text-center" to="/all">
                <span class="leading-[3em]">All Times</span>
            </NuxtLink>
            <NuxtLink class="block h-12 w-full hover:bg-blue-900 text-center" to="/login">
                <span class="leading-[3em]">Organiser Login</span>
            </NuxtLink>
        </div>
    </div>
</template>
