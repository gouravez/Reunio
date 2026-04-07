import { useAuth } from "../hooks/useAuth";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-grey-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return children;
}

export default ProtectedRoute;