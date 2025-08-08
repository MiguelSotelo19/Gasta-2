import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import IniciarSesion from '../screens/Login/IniciarSesion';
import Hub from '../screens/Hub';
import Registrarse from '../screens/Login/Registrarse';
import ForgotPassword from '../screens/Login/ForgotPassword';
import PrivacyPage from '../screens/Login/Privacy';
import TermsPage from '../screens/Login/Terms';
import { E404 } from '../screens/errorPages/E404';
import { E401 } from '../screens/errorPages/E401';
import { E403 } from '../screens/errorPages/E403';

const isAuthenticated = () => {
    return localStorage.getItem("userId") !== null;
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <E401 />;
};

const RedirectIfAuthenticated = ({ element }) => {
    return isAuthenticated() ? <Navigate to="/Hub" replace /> : element;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<RedirectIfAuthenticated element={<IniciarSesion />} />} />
                <Route path='/register' element={<RedirectIfAuthenticated element={<Registrarse />} />} />
                <Route path='/Hub' element={<ProtectedRoute element={<Hub />} />} />
                <Route path='/forgot-password' element={<RedirectIfAuthenticated element={<ForgotPassword />} />} />
                <Route path='/terms' element={<TermsPage />} />
                <Route path='/privacy' element={<PrivacyPage />} />

                <Route path='*' element={<E404 />} />
                <Route path='/403' element={<E403 />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;