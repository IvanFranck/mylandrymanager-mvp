import axios, { AxiosError, AxiosResponse } from "axios"
import { TGenericResponse, TLoginResponseDetails } from "@/lib/types/responses"
import { API_ROUTES } from "@/common/constants/api-routes"
import { AXIOS_ACCESS_TOKEN, AXIOS_REFRESH_TOKEN, STORED_USER_DATA } from "@/common/constants/local-storage-keys"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,

    headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain',
    },
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosInstance.interceptors.request.use(async config => {
    // Retrieve token from auth query
    const token = localStorage.getItem(AXIOS_ACCESS_TOKEN)
  
    // If token is found
    if (token) {
      // Get request headers and if headers is undefined assign blank object
      config.headers = config.headers || {}
  
      // Set authorization header
      config.headers.Authorization = token ? `Bearer ${token}` : ''
    }
  
    // Return modified config
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ℹ️ Add response interceptor to handle 401 response
axiosInstance.interceptors.response.use((response: AxiosResponse) => {
    return response
  }, async (error: AxiosError) => {
    // Handle error
    if (error.code === 'ECONNABORTED') {
        //toast
      return Promise.reject(error)
    }
  
    if (error.response?.status === 401) {
      // try to refresh token
      const refresh_token: string | null = localStorage.getItem(AXIOS_REFRESH_TOKEN)
      if (refresh_token) {
        let response: AxiosResponse<TGenericResponse<TLoginResponseDetails>>
        try {
          response = await axios.get(API_ROUTES.AUTH_REFRESH, {
            headers: {
              'Accept': 'text/plain',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refresh_token}`,
            },
          })
  
          if (typeof (response.data.details) !== 'string') {
          // refresh token
            const details = response.data.details
  
            localStorage.setItem(AXIOS_ACCESS_TOKEN, details.accessToken)
  
            localStorage.setItem(AXIOS_REFRESH_TOKEN, details.refreshToken)
            localStorage.setItem(STORED_USER_DATA, JSON.stringify(details.user))
          }
          else {
            // toast.error('Nous n\'avons pas pu vous reconnecter. Veuillez vous reconnecter')
  
            // Remove "userData" from localStorage
            localStorage.removeItem(STORED_USER_DATA)
  
            // Remove "accessToken" from localStorage
            localStorage.removeItem(AXIOS_ACCESS_TOKEN)
  
            // router.push('/login')
          }
        }
        catch (err) {
          console.log('error: ', err)
        }
      }
      else {
        // toast.error('Nous n\'avons pas pu vous reconnecter. Veuillez vous reconnecter')
  
        // router.push('/login')
      }
  
      return Promise.reject(error)
    }
    else {
      return Promise.reject(error)
    }
  }
)