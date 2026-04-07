import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { APP_CONFIG, ROUTES } from "../utils/constants";
import { Video } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm border-b border-gray-200">
        <div className="mx-12 px-4 sm:px-6 lg_px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                <Video color="white"/>
              </div>
              <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                {APP_CONFIG.APP_NAME}
              </h1>
            </Link>

            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>

                  <div className="flex items-center space-x-2 bg-gray-50 ">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-300 to-indigo-500 flex items-center justify-center rounded-2xl">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <span className="text-gray-700 font-medium text-sm hidden sm-inline">
                      {user?.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 txt-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus: ring-offset-2 focus:ring-red-500 transition-colors shadow-sm rounded-2xl"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    to={ROUTES.REGISTER}
                    className="px-4 py-2 txt-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus: ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
