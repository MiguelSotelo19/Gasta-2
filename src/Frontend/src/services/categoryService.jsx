import axiosInstance from "./axiosInstance"
//Visualizar
export const getCategoriesByEspacio = async (idEspacio) => {
  const response = await axiosInstance.get(`/api/categorias/${idEspacio}`)
  return response.data
}

//Crear

export const createCategoria = async (idEspacio, nombreCategoria) => {
  const response = await axiosInstance.post(`/api/categorias/`, {
    nombre: nombreCategoria,
    espacioBean: {
      id: idEspacio,
    },
  });
  return response.data;
};



