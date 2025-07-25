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
      id:parseInt(idEspacio) 
    },
  });
  return response.data;
};
//Actualizar
export const updateCategoria = async (idCategoria, nombreCategoria, idEspacio) => {
  const response = await axiosInstance.put(`/api/categorias/update/${idCategoria}`, {
    nombre: nombreCategoria,
    espacioBean: {
      id:parseInt(idEspacio) 
    },
  });
  return response.data;
};



// Eliminar categoría
export const deleteCategoria = async (idCategoria) => {
  const response = await axiosInstance.delete(`/api/categorias/delete/${idCategoria}`)
  return response.data
}
