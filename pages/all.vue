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
    const manage = ref(false)
    const boardName = ref("Records")
    const allRecords = ref<clientSideRecord[]>([])
    let intervalId: any

    const initialData = (await useFetch("/api/getAll", {method: "GET"})).data
    if (initialData.value != undefined) {
        allRecords.value = initialData.value.records
        boardName.value = initialData.value.boardName
    }
    
    const searchRecords = computed (() => {
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
    const displayRecords = computed(() => {
        let result: clientSideRecord[] = []
        for (let r of searchRecords.value) {
            if (!r.removed) {
                result.push(r)
            }
        }
        return result
    })

    async function refreshData() {
        let newData = (await $fetch("/api/getAll", {method: "GET"}))
        boardName.value = newData.boardName
        allRecords.value = newData.records
    }

    function toggleManage() {
        if (manage.value) {
            manage.value = false
            intervalId = setInterval(refreshData, 20000)
        } else {
            manage.value = true
            clearInterval(intervalId)
        }
    }

    async function removeTime(id: string) {
        const res = await $fetch("/api/removeTime", {method: "POST", body: {
            token: sessionStorage.getItem("cockatoo-timeboard-token"),
            id: id
        }})
        if (!res.tokenCheck) {
            admin.value = false
            sessionStorage.removeItem("cockatoo-timeboard-token")
        }
        refreshData()
    }

    async function restoreTime(id: string) {
        const res = await $fetch("/api/restoreTime", {method: "POST", body: {
            token: sessionStorage.getItem("cockatoo-timeboard-token"),
            id: id
        }})
        if (!res.tokenCheck) {
            admin.value = false
            sessionStorage.removeItem("cockatoo-timeboard-token")
        }
        refreshData()
    }

    onMounted(() => {
        intervalId = setInterval(refreshData, 20000)
    })
    onUnmounted(() => {
        clearInterval(intervalId)
    })
</script>

<template>
    <WideContainer>
        <h1 class="text-center text-2xl font-bold">{{ boardName }}</h1>
        <div v-if="admin" class="w-full flex space-x-2 sm:space-x-4">
            <div class="block w-full">
                <NuxtLink v-if="admin" href="/addTime" class="block w-full p-2 mx-auto my-4 text-center bg-blue-400 hover:bg-blue-300 drop-shadow-md">Add time</NuxtLink>
            </div>
            <div class="block w-full">
                <button v-if="manage" @click="toggleManage()" class="block w-full my-4 text-center p-2 bg-blue-400 hover:bg-blue-300 drop-shadow-md">Cancel</button>
                <button v-else @click="toggleManage()" class="block w-full my-4 text-center p-2 bg-blue-400 hover:bg-blue-300 drop-shadow-md">Manage times</button>
            </div>
        </div>
        <input type="text" v-model="search" placeholder="Search for a name..." class="block w-full my-2 px-2 py-1 bg-blue-100 focus:bg-blue-50 drop-shadow-md" />
        
        <div class="max-w-full overflow-auto drop-shadow-md my-4">
            <table v-if="manage" class="w-full">
                <tbody>
                    <tr v-for="record of searchRecords" :key="record.id" :class="{'bg-blue-200':!record.removed, 'bg-slate-200':record.removed}">
                        <td class="w-4 p-2 text-center" :class="{'line-through':record.removed, 'text-gray-700':record.removed}">{{ record.ranking }}</td>
                        <td class="p-2" :class="{'line-through':record.removed, 'text-gray-700':record.removed}">{{ record.name }}</td>
                        <td class="p-2 text-right" :class="{'line-through':record.removed, 'text-gray-700':record.removed}">{{ record.time }}</td>
                        <td class="w-24 p-1 text-right">
                            <button v-if="record.removed" @click="restoreTime(record.id)" class="block w-full p-1 bg-green-400 hover:green-red-300 drop-shadow-md">Restore</button>
                            <button v-else @click="removeTime(record.id)" class="block w-full p-1 bg-red-400 hover:bg-red-300 drop-shadow-md">Remove</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table v-else class="w-full">
                <tbody>
                    <tr v-for="record of displayRecords" :key="record.id" class="p-2 bg-blue-200">
                        <td class="w-4 p-2 text-center">{{ record.ranking }}</td>
                        <td class="p-2">{{ record.name }}</td>
                        <td class="p-2 text-right">{{ record.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </WideContainer>
    
</template>
