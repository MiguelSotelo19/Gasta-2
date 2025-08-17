import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const auth = async (correo, password) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/auth/signin`,
      data: {
        correo: correo,
        password: password,
      },
    }) 
    console.log("auth: ",response)

    if (response.data.data) {
      localStorage.setItem("accessToken", response.data.data.token);
      localStorage.setItem("userName", response.data.data.user);
      localStorage.setItem("userId", response.data.data.id);
    }

    return {
      data: response.data,
      status: response.status
    };
    
  } catch (error) {
    console.error("Error en autenticación:", error)
    return null
  }
}