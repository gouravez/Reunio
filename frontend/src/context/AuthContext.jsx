import { useEffect, useState } from "react";
import api from "../services/api";
import { API_ENDPOINTS } from "../utils/constants";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CHECK IF USER IS AUTHENTICATED ON MOUNT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.CHECK_AUTH);
        setUser(response.data.user);
      } catch (error) {
        setError(error.message);
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
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        name,
        email,
        password,
      });
      setUser(response.data.user);
      return { success: true, user };
    } catch (error) {
      setError(error.message.data.message || "Registration failed");
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });
      setUser(response.data.user);
      return { success: true, user };
    } catch (error) {
      setError(error.message.data.message || "Registration failed");
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

    const logout = async () => {
      try {
        setLoading(true);
        setError(null);
        await api.post(API_ENDPOINTS.LOGOUT);
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
