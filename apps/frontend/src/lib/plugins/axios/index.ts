import axios, { AxiosError, AxiosResponse } from "axios"
import { TGenericResponse, TLoginResponseDetails } from "@/lib/types/responses"
import { API_ROUTES } from "@/common/constants/api-routes"
import { useAuth } from "@/lib/hooks/use-cases/useAuth"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,

    headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain',
    },
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosInstance.interceptors.request.use(async config => {
    // Get access token from Zustand store
    const accessToken = useAuth.getState().accessToken
  
    // If token is found
    if (accessToken) {
      // Get request headers and if headers is undefined assign blank object
      config.headers = config.headers || {}
  
      // Set authorization header
      config.headers.Authorization = `Bearer ${accessToken}`
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
      const refreshToken = useAuth.getState().refreshToken
      if (refreshToken) {
        let response: AxiosResponse<TGenericResponse<TLoginResponseDetails | null>>
        try {
          response = await axios.get(API_ROUTES.AUTH_REFRESH, {
            headers: {
              'Accept': 'text/plain',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`,
            },
          })
  
          if (typeof (response.data.details) !== 'string') {
            // refresh token
            const details = response.data.details
            
            if(details === null) {
              // toast.error('Nous n\'avons pas pu vous reconnecter. Veuillez vous reconnecter')
              useAuth.getState().logout()
              // router.push('/login')
            }else {
              useAuth.getState().setTokens(details.accessToken, details?.refreshToken)
              useAuth.getState().setUser(details.user)
            }
            // Update tokens in Zustand store
          }
          else {
            // toast.error('Nous n\'avons pas pu vous reconnecter. Veuillez vous reconnecter')
            useAuth.getState().logout()
            // router.push('/login')
          }
        }
        catch (err) {
          console.log('error: ', err)
        }
      }
      else {
        // toast.error('Nous n\'avons pas pu vous reconnecter. Veuillez vous reconnecter')
        useAuth.getState().logout()
        // router.push('/login')
      }
  
      return Promise.reject(error)
    }
    else {
      return Promise.reject(error)
    }
  }
)