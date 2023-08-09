<script setup lang="ts">
    type clientSideRecord = {
        id: string,
        name: string,
        ranking: string,
        time: string
    }

    const admin = useState("admin")
    const initialData = (await useFetch("/api/getTop", {method: "GET"})).data
    const boardName = ref("Records")
    const records = ref<clientSideRecord[]>([])
    if (initialData.value != undefined) {
        boardName.value = initialData.value.boardName
        records.value = initialData.value.records
    }

    let intervalId: any

    async function refreshData() {
        records.value = (await $fetch("/api/getTop", {method: "GET"})).records
    }

    onMounted(() => {
        intervalId = setInterval(refreshData, 10000)
    })

    onUnmounted(() => {
        clearInterval(intervalId)
    })
</script>
<template>
    <h1>top.vue</h1>
    <p>admin: {{admin}}</p>
    <h1>{{ boardName }}</h1>
    <div v-if="records.length == 0">
        <h2>Be the first to set a time!</h2>
    </div>
    <div v-else>
        <p>Records display area</p>
    </div>
    <p>Timebaord | <a href="https://github.com/max8539/timeboard">View source on Github</a></p>
</template>
