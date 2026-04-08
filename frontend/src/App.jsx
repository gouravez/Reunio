import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./utils/constants";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Call from "./pages/Call"
import Dashboard from "./pages/Dashboard";
import JoinSession from "./pages/JoinSession";
import HostSession from "./pages/HostSession";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { SessionProvider } from "./context/SessionContext";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout({ children, showHeader = true, showFooter = true }) {
  return (
    <>
      {showHeader && <Header />}
      <main className={showHeader ? "pt-16" : ""}>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <SessionProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Routes>
              <Route
                path={ROUTES.HOME}
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />

              <Route
                path={ROUTES.LOGIN}
                element={
                  <Layout showHeader={false} showFooter={false}>
                    <Auth />
                  </Layout>
                }
              />

              <Route
                path={ROUTES.REGISTER}
                element={
                  <Layout showHeader={false} showFooter={false}>
                    <Auth />
                  </Layout>
                }
              />

              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.JOIN}
                element={
                  <Layout>
                    <JoinSession />
                  </Layout>
                }
              />

              <Route
                path={ROUTES.HOST}
                element={
                  <Layout>
                    <HostSession />
                  </Layout>
                }
              />

              <Route
                path="*"
                element={
                  <Layout>
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                          404
                        </h1>
                        <p className="text-gray-600 mb-4">Page Not Found</p>
                        <a
                          href={ROUTES.HOME}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Go to Home
                        </a>
                      </div>
                    </div>
                  </Layout>
                }
              />

              <Route
                path={ROUTES.CALL}
                element={
                  <ProtectedRoute>
                    <Layout showHeader={false} showFooter={false}>
                      <Call />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </SessionProvider>
    </AuthProvider>
  );
};

export default App;
