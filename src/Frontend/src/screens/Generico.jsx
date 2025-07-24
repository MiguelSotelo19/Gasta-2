import "./css/general.css"
import "./css/miembros.css"
export const Generico = () => {
    return (
        <>

            <div>
                <div className="members-header">

                    <div className="dashboard-title">
                        <h1>Sin espacio seleccionado</h1>
                        <p>No tienes espacios a mostrar, ¡únete o crea uno!</p>
                    </div>
                </div>


                <div className="card flex flex-col grow h-full min-h-[60vh]">
                    <div className="card-header">
                        <h3 className="card-title mt-2"></h3>
                    </div>
                    <div className="card-content flex-grow"></div>
                </div>
            </div>
        </>
    )
}