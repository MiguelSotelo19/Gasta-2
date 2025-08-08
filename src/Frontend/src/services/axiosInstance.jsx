import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      //localStorage.removeItem("accessToken")
      //localStorage.removeItem("correo")
      //sessionStorage.removeItem("usuario")
      //window.location.href = "/"
      //localStorage.removeItem("userId")
    }
    if (error.response?.status === 403) {
      window.location.href = "/403"
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
