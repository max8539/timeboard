export async function checkAdmin() {
    const admin = useState("admin")
    let token = sessionStorage.getItem("token")
    if (sessionStorage.getItem("token") == null) {
        admin.value = false
        return
    }
    let res = await $fetch("/api/validateToken", {method: "GET", params: {token: token}})
    if (!res.success) {
        sessionStorage.removeItem("token")
    }
    admin.value = res.success
}