import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import "./css/modal-miembros.css";

export default function ModalAsignarPorcentajes({ abierto, onClose, miembros, idEspacio, onSuccess }) {
  const [porcentajes, setPorcentajes] = useState(
    miembros.reduce((acc, m) => ({ ...acc, [m.idUsuario]: m.porcentajeGasto || 0 }), {})
  );
  const total = Object.values(porcentajes).reduce((a, b) => a + Number(b), 0);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleChange = (id, value) => {
    setPorcentajes({ ...porcentajes, [id]: Number(value) });
  };

  const handleGuardar = async () => {
    if (total !== 100) return alert("La suma debe ser 100%");
    const asignaciones = Object.entries(porcentajes).map(([idUsuario, porcentaje]) => ({
      idUsuario: Number(idUsuario),
      porcentaje: Number(porcentaje),
    }));
    await axiosInstance.put(`${API_URL}/api/usuarios-espacios/asignar-porcentajes`, {
      idEspacio,
      asignaciones,
    });
    onSuccess && onSuccess();
    onClose();
  };

  if (!abierto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Asignar Porcentajes</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {miembros.map((m) => (
            <div key={m.idUsuario} className="porcentaje-item">
              <span>{m.nombreUsuario}</span>
              <input
                type="number"
                min={0}
                max={100}
                value={porcentajes[m.idUsuario]}
                onChange={e => handleChange(m.idUsuario, e.target.value)}
                className="porcentaje-input-simple"
              />
              <span>%</span>
            </div>
          ))}
          <div className="total-reasignacion">
            <span className={`total-display ${total === 100 ? "correcto" : "incorrecto"}`}>
              Total: {total}% {total === 100 ? "✅" : "❌"}
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-confirmar-btn" disabled={total !== 100} onClick={handleGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}