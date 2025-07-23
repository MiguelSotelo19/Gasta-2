import "./css/miembros.css"
import "./css/general.css"

export const Miembros = ({ espacioActual }) => {
    const members = [
        { name: "María González", role: "Administrador", percentage: 30, avatar: "MG" },
        { name: "Juan Pérez", role: "Miembro", percentage: 25, avatar: "JP" },
        { name: "Ana López", role: "Miembro", percentage: 25, avatar: "AL" },
        { name: "Carlos Ruiz", role: "Administrador", percentage: 20, avatar: "CR" },
    ]
    return (
        <>

            <div>
                <div className="members-header">
                    <div className="dashboard-title">
                        <h1>Miembros</h1>
                        <p>Gestiona los miembros del espacio: { espacioActual }</p>
                    </div>
                    <div className="members-actions">
                        <button className="outline-button">
                            Código: <span className="code-display">CP2024</span>
                        </button>
                        <button className="primary-button">
                            <span>+</span>
                            Invitar Miembro
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Miembros del Espacio</h3>
                        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                            Administra los permisos y porcentajes de contribución de cada miembro
                        </p>
                    </div>
                    <div className="card-content">
                        {members.map((member, index) => (
                            <div key={index} className="member-item">
                                <div className="member-info">
                                    <div className="member-avatar">{member.avatar}</div>
                                    <div className="member-details">
                                        <h4>{member.name}</h4>
                                        <div className="member-role">{member.role}</div>
                                    </div>
                                </div>
                                <div className="member-actions">
                                    <div className="member-percentage">
                                        <div className="percentage">{member.percentage}%</div>
                                        <div className="label">Contribución</div>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="small-button">✏️</button>
                                        <button className="small-button danger">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}