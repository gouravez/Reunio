import { UserPlus, Video } from "lucide-react";
import React from "react";
import { APP_CONFIG } from "../utils/constants";

const AuthForm = ({
  mode,
  formData,
  onChange,
  onsubmit,
  loading,
  error,
  localError,
}) => {
  const isLogin = mode === "login";
  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isLogin ? "bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50" : "bg-linear-to-br from-purple-50 via-pink-50 to-red-50"}`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4 ${isLogin ? "bg-linear-to-br from-blue-600 to-indigo-600 " : "bg-linear-to-br from-purple-600 to-pink-600 "}`}
          >
            {isLogin ? (
              <Video className="w-8 h-8" color="white" />
            ) : (
              <UserPlus className="w-8 h-8" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isLogin ? APP_CONFIG.APP_NAME : `Join ${APP_CONFIG.APP_NAME}`}
          </h1>

          <p>{isLogin ? APP_CONFIG.APP_TAGLINE : `Start your journey today`}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
