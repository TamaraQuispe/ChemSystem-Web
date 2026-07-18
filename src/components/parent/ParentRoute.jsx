import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useParentStore } from '../../store/parentStore';

const ParentRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const fetchChildren = useParentStore((state) => state.fetchChildren);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'parent') {
      fetchChildren();
    }
  }, [isAuthenticated, user, fetchChildren]);

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'parent') return <Navigate to="/home" />;
  return children;
};

export default ParentRoute;
