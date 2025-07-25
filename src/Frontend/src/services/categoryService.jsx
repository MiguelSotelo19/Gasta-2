import axiosInstance from "./axiosInstance"

export const getCategoriesByEspacio = async (idEspacio) => {
  const response = await axiosInstance.get(`/api/categorias/${idEspacio}`)
  return response.data
}

