import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Loading from "../components/Loading";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const { checkAuth, user, loading } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkAuth();
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <div className=" flex items-center h-screen justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/browse" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
