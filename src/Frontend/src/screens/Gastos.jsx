import "./css/general.css";
import { useState, useEffect } from "react";
import ModalAsignarPorcentajes from "../components/ModalAsignarPorcentajes";
import axiosInstance from "../services/axiosInstance";

export const Gastos = ({ espacioActual, nombreEspacio }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [miembros, setMiembros] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  console.log(espacioActual);

  useEffect(() => {
    if (espacioActual) {
      axiosInstance
        .get(`${API_URL}/api/usuarios-espacios/all/${espacioActual.idEspacio}`)
        .then((res) => setMiembros(res.data.data))
        .catch(() => setMiembros([]));
    }
  }, [espacioActual]);

  return (
    <>
      <div>
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Gastos</h1>
            <p>Administra todos los gastos del espacio: {nombreEspacio}</p>
          </div>
          {espacioActual?.rol === "Administrador" && (
            <button
              className="primary-button"
              onClick={() => setModalAbierto(true)}
            >
              <span>+</span>
              Asignar Porcentajes
            </button>
          )}
        </div>
        <div className="empty-state">
          <p>Sección de gastos en desarrollo</p>
        </div>
      </div>
      <ModalAsignarPorcentajes
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        miembros={miembros}
        idEspacio={espacioActual?.id}
        onSuccess={() => {
          // Opcional: recargar miembros o mostrar mensaje de éxito
        }}
      />
    </>
  );
};
