<script setup lang="ts">
    const admin = useState("admin", () => false)
    onMounted(async () => {
        await checkAdmin()
    })
</script>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
