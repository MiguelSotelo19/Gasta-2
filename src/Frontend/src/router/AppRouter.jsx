import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import IniciarSesion from '../screens/Login/IniciarSesion';
import Hub from '../screens/Hub';
import Registrarse from '../screens/Login/Registrarse';
import ForgotPassword from '../screens/Login/ForgotPassword';
import PrivacyPage from '../screens/Login/Privacy';
import TermsPage from '../screens/Login/Terms';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<IniciarSesion />} />
                <Route path='/register' element={<Registrarse />} />
                <Route path='/Hub' element={<Hub />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/terms' element={<TermsPage />} />                
                <Route path='/privacy' element={<PrivacyPage />} />
                
                <Route path='*' element={<Navigate to='/404' replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;