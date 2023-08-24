export async function checkAdmin() {
    const admin = useState("admin")
    let token = sessionStorage.getItem("cockatoo-timeboard-token")
    if (sessionStorage.getItem("cockatoo-timeboard-token") == null) {
        admin.value = false
        return
    }
    let res = await $fetch("/api/validateToken", {method: "GET", params: {token: token}})
    if (!res.success) {
        sessionStorage.removeItem("cockatoo-timeboard-token")
    }
    admin.value = res.success
}
