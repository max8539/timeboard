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

    const { data, refresh } = await useFetch("/api/getAll", {method: "GET"})
    if (data.value != undefined) {
        allRecords.value = data.value.records
        boardName.value = data.value.boardName
    }
    
    const activeRecords = computed(() => {
        let result: clientSideRecord[] = []
        for (let r of allRecords.value) {
            if (manage.value || !r.removed) {
                result.push(r)
            }
        }
        return result
    })
    
    const searchRecords = computed (() => {
        if (search.value == "") {
            return activeRecords.value
        } else {
            let searchResult: clientSideRecord[] = []
            for (let r of activeRecords.value) {
                if (r.name.includes(search.value)) {
                    searchResult.push(r)
                }
            }
            return searchResult
        }
    })

    async function refreshData() {
        await refresh()
        boardName.value = data.value?.boardName || boardName.value
        allRecords.value = data.value?.records || allRecords.value
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
                <NuxtLink v-if="admin" href="/addTime" class="block w-full p-2 mx-auto mt-4 text-center bg-blue-400 hover:bg-blue-300 drop-shadow-md">Add time</NuxtLink>
            </div>
            <div class="block w-full">
                <button v-if="manage" @click="toggleManage()" class="block w-full mt-4 text-center p-2 bg-blue-400 hover:bg-blue-300 drop-shadow-md">Exit</button>
                <button v-else @click="toggleManage()" class="block w-full mt-4 text-center p-2 bg-blue-400 hover:bg-blue-300 drop-shadow-md">Manage times</button>
            </div>
        </div>
        
        <div v-if="activeRecords.length == 0 && !(manage && allRecords.length > 0)" class="text-center my-4 px-4 py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-28 bg-blue-200 drop-shadow-md">
            <h2 v-if="admin" class="font-bold text-2xl">The leaderboard is currently empty.</h2>
            <h2 v-else class="font-bold text-2xl">Be the first to set a time!</h2>
            <p v-if="admin" class="text-lg"><NuxtLink href="/addTime" class="text-blue-900 hover:underline ">Click here</NuxtLink> to add a time to the lederboard.</p>
            <p v-else class="text-lg">Call an organser to have your time added to the leaderboard.</p>
        </div>
        <div v-else class="max-w-full overflow-auto drop-shadow-md mb-4">
            <input type="text" v-model="search" placeholder="Search for a name..." class="block w-full my-4 px-2 py-1 bg-blue-100 focus:bg-blue-50 drop-shadow-md" />
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
                    <tr v-for="record of searchRecords" :key="record.id" class="p-2 bg-blue-200">
                        <td class="w-4 p-2 text-center">{{ record.ranking }}</td>
                        <td class="p-2">{{ record.name }}</td>
                        <td class="p-2 text-right">{{ record.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p>Timeboard | 
            <a href="https://github.com/max8539/timeboard" target="_blank" rel="noreferrer noopener" class=" text-blue-800 hover:underline">View source on Github</a>
        </p>
    </WideContainer>
    
</template>
