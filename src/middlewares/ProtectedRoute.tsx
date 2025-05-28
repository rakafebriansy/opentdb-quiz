import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const location = useLocation();

    const { user, loading } = useAuth();
    const from = location.state?.from || '/login';

    if (loading) {
        return <div></div>; // atau spinner
    }
    if (!location.pathname.includes('/result') && user?.endAt == -1) {
        return <Navigate to="/result" replace />;
    }

    if (location.pathname.includes('/result') && user?.endAt !== -1 || location.pathname == '/') {
        return <Navigate to={from} replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
