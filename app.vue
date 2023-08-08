<script setup lang="ts">
    const adminAccess = useState("admin", () => false)
    
</script>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
