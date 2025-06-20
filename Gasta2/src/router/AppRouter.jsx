import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Hub } from '../screens/Hub';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/Gasta2' element={ <Hub/> } />
            </Routes>
        </Router>
    );
};

export default AppRouter;