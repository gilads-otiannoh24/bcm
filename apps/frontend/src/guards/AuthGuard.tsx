import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Loading from "../components/Loading";

const AuthGuard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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

  if (user) {
    return <Navigate to="/cards" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
