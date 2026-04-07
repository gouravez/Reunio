import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { API_ENDPOINTS } from "../utils/constants";
import Auth from "../pages/Auth";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CHECK IF USER IS AUTHENTICATED ON MOUNT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.AUTH.ME);
        setUser(response.data.user);
      } catch (error) {
        // setError(error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
      });

      const userData = response.data.user;

      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.log("REGISTER ERROR:", error.response || error);
      const message = error.response?.data?.message || "Registration failed";

      setError(message);

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const userData = response.data.user;
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";

      setError(message);

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      setUser(null);
      return { success: true };
    } catch (error) {
      setError(error.message.data.message || "Logout failed");
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
