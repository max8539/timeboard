<script setup lang="ts">
    const admin = useState("admin", () => false)
    
    useHead({
        title: "Timeboard"
    })
    
    onMounted(async () => {
        await checkAdmin()
    })
</script>

<template>
    <div class="font-sans">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
