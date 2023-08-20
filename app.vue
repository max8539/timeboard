<script setup lang="ts">
    const admin = useState("admin", () => false)
    const route = useRoute()

    const pageBg = computed(() => {return {
        'bg-blue-100': route.path == "/top",
    }})
    
    useHead({
        title: "Timeboard"
    })
    
    onMounted(async () => {
        await checkAdmin()
    })
</script>

<template>
    <div class="w-full h-full font-sans" :class="pageBg">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
