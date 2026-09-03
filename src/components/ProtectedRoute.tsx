import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; 

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; 

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;