<script setup lang="ts">
    type clientSideRecord = {
        id: string,
        name: string,
        ranking: string,
        time: string,
        removed: boolean
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
        intervalId = setInterval(refreshData, 5000)
    })

    onUnmounted(() => {
        clearInterval(intervalId)
    })
</script>
<template>
    <h1>{{ boardName }}</h1>
    <div v-if="admin">
        <p><NuxtLink href="/addTime">Add time</NuxtLink></p>
    </div>
    <div id="top-leaderboard">
        <div id="empty" v-if="records.length == 0">
            <h2>Be the first to set a time!</h2>
        </div>
        <div v-else>
            <div class="first-record">
                <div class="first-rank">1</div>
                <div class="first-name">{{ records[0].name }}</div>
                <div class="first-time">{{ records[0].time }}</div>
            </div>
            <div class="second-record" v-if="records.length >= 2">
                <div class="second-rank">2</div>
                <div class="second-name">{{ records[1].name }}</div>
                <div class="second-time">{{ records[1].time }}</div>
            </div>
            <div class="other-record" v-if="records.length >= 3">
                <div class="other-rank">3</div>
                <div class="other-name">{{ records[2].name }}</div>
                <div class="other-time">{{ records[2].time }}</div>
            </div>
            <div class="other-record" v-if="records.length >= 4">
                <div class="other-rank">4</div>
                <div class="other-name">{{ records[3].name }}</div>
                <div class="other-time">{{ records[3].time }}</div>
            </div>
            <div class="other-record" v-if="records.length >= 5">
                <div class="other-rank">5</div>
                <div class="other-name">{{ records[4].name }}</div>
                <div class="other-time">{{ records[4].time }}</div>
            </div>
        </div>
    </div>
    
    <p>Timeboard | <a href="https://github.com/max8539/timeboard" target="_blank" rel="noreferrer noopener">View source on Github</a></p>
</template>
