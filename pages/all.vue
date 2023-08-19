<script setup lang="ts">
    type clientSideRecord = {
        id: string,
        name: string,
        ranking: string,
        time: string,
        removed: boolean
    }
    
    const admin = useState("admin")
    const search = ref("")
    const remove = ref(false)
    const allRecords = ref<clientSideRecord[]>([])
    let intervalId: any

    const initialData = (await useFetch("/api/getAll", {method: "GET"})).data
    if (initialData.value != undefined) {
        allRecords.value = initialData.value.records
    }
    const displayRecords = computed(() => {
        if (search.value == "") {
            return allRecords.value
        } else {
            let searchResult: clientSideRecord[] = []
            for (let r of allRecords.value) {
                if (r.name.includes(search.value)) {
                    searchResult.push(r)
                }
            }
            return searchResult
        }
    })

    async function refreshData() {
        allRecords.value = (await $fetch("/api/getAll", {method: "GET"})).records
    }

    function toggleRemove() {
        if (remove.value) {
            remove.value = false
            intervalId = setInterval(refreshData, 20000)
        } else {
            remove.value = true
            clearInterval(intervalId)
        }
    }

    async function removeTime(id: string) {
        console.log(`remove ${id}`)
        const res = await $fetch("/api/removeTime", {method: "POST", body: {
            token: sessionStorage.getItem("token"),
            id: id
        }})
        if (!res.tokenCheck) {
            admin.value = false
            sessionStorage.removeItem("token")
        }
        refreshData()
        toggleRemove()
    }

    onMounted(() => {
        intervalId = setInterval(refreshData, 20000)
    })
    onUnmounted(() => {
        clearInterval(intervalId)
    })
</script>

<template>
    <h1>All times</h1>
    <input type="text" v-model="search" placeholder="Search for a name..." />
    <br>
    <div v-if="admin">
        <div v-if="remove">
            <button @click="toggleRemove()">Cancel</button>
        </div>
        <div v-else>
            <button @click="toggleRemove()">Remove a time</button>
        </div>
    </div>

    <div v-for="r of displayRecords" :key="r.id">
        <p>{{ r.ranking }}</p>
        <p>{{ r.name }}</p>
        <p>{{ r.time }}</p>
        <div v-if="admin && remove">
            <button @click="removeTime(r.id)">Remove time</button>
        </div>
        <div v-else></div>
    </div>
</template>
