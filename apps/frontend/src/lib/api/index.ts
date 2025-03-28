import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth-storage")
    if (token) {
        const { state } = JSON.parse(token)
        if (state.selectedAgency) {
            config.headers["X-Agency-ID"] = state.selectedAgency.id
        }
    }
    return config
}) 