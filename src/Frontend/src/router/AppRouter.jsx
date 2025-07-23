import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import IniciarSesion from "../screens/IniciarSesion";
import Hub from "../screens/Hub";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<IniciarSesion />} />
                <Route path="/Hub" element={<Hub />} />
                
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;