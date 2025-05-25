import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to={`/quiz/${user.currentQuizIndex}`} replace />;
    }

    return children;
};

export default GuestRoute;
