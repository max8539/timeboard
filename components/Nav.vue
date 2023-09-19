<script setup lang="ts">
    const admin = useState("admin")
    const hamburger = ref(false)

    function toggleAdmin() {
        admin.value = false
        sessionStorage.removeItem("cockatoo-timeboard-token")
        navigateTo("/")
    }

    function toggleHamburger() {
        hamburger.value = !hamburger.value
    }
</script>

<template>
    <div class="hidden sm:block h-12 bg-blue-950 text-white drop-shadow-xl">
        <div class="grid grid-cols-[auto_1fr_1fr_1fr_1fr]" v-if="admin">
            <PageLogo />
            <NuxtLink class="block h-12 w-full py-3 hover:bg-blue-900 text-center" to="/">Home</NuxtLink>
            <NuxtLink class="block h-12 w-full py-3 hover:bg-blue-900 text-center" to="/all">All Times</NuxtLink>
            <NuxtLink class="block h-12 w-full py-3 hover:bg-blue-900 text-center" to="/setup">Settings</NuxtLink>
            <button class="block h-12 w-full py-3 hover:bg-blue-900 text-center" @click="toggleAdmin">Logout</button>
        </div>
        <div class="grid grid-cols-[auto_1fr_1fr_1fr]" v-else>
            <PageLogo />
            <NuxtLink class="block h-12 w-full py-3 hover:bg-blue-900 text-center" to="/">Home</NuxtLink>
            <NuxtLink class="block h-12 w-full py-3 hover:bg-blue-900 text-center" to="/all">All Times</NuxtLink>
            <NuxtLink class="block h-12 w-full py-3 hover:bg-blue-900 text-center" to="/login">Organiser Login</NuxtLink>
        </div>
    </div>

    <div class="block sm:hidden h-12 bg-blue-950 text-white drop-shadow-xl">
        <div class="grid grid-cols-[1fr_auto]">
            <div>
                <PageLogo />
            </div>
            <div class="hover:bg-blue-900 h-12">
                <div v-if="hamburger">
                    <button class="m-0 p-0" @click="toggleHamburger()">
                        <NuxtImg src="/cross.png" alt="Close menu" height="40px" densities="x1 x2" class="h-12 p-1 m-auto" />
                        <!-- <img src="/cross.png" alt="Close menu" class="h-12 p-1 m-auto" /> -->
                    </button>
                </div>
                <div v-else>
                    <button class="m-0 p-0" @click="toggleHamburger()">
                        <NuxtImg src="/hamburger.png" alt="Open menu" height="40px" densities="x1 x2" class="h-12 p-1 m-auto" />
                        <!-- <img src="/hamburger.png" alt="Open menu" class="h-12 p-1 m-auto" /> -->
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="hamburger" class="w-full block sm:hidden bg-blue-950 text-white drop-shadow-xl">
        <div v-if="admin">
            <NuxtLink class="block p-2 w-full hover:bg-blue-900 text-center" to="/">Home</NuxtLink>
            <NuxtLink class="block p-2 w-full hover:bg-blue-900 text-center" to="/all">All Times
            </NuxtLink>
            <NuxtLink class="block p-2 w-full hover:bg-blue-900 text-center" to="/setup">Settings</NuxtLink>
            <button class="block p-2 w-full hover:bg-blue-900 text-center" @click="toggleAdmin">Logout</button>
        </div>
        <div v-else>
            <NuxtLink class="block p-2 w-full hover:bg-blue-900 text-center" to="/">Home</NuxtLink>
            <NuxtLink class="block p-2 w-full hover:bg-blue-900 text-center" to="/all">All Times
            </NuxtLink>
            <NuxtLink class="block p-2 w-full hover:bg-blue-900 text-center" to="/login">Organiser Login</NuxtLink>
        </div>
    </div>
</template>
