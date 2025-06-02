import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import * as React from "react";
import AdminLayout from "./components/Admin/layout";
import ProtectedRoute from "./guards/ProtectedRoute";
import AuthGuard from "./guards/AuthGuard";
import Loading from "./components/Loading";
import MainLayout from "./pages/MainLayout";
import ContactPage from "./pages/Contact";
import TermsOfServicePage from "./pages/Terms";
import PrivacyPolicyPage from "./pages/Privacy";
import ErrorBoundary from "./components/ErrorBoundary";
import BrowsePage from "./pages/cards/Browse";
import FavouritesPage from "./pages/cards/Favourites";
import { AnimatePresence } from "framer-motion";

// Lazy load pages
const Landing = React.lazy(() => import("./pages/Landing"));

// auth
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// other
const Favorites = React.lazy(() => import("./pages/Favorites"));
const Profile = React.lazy(() => import("./pages/Profile"));
const About = React.lazy(() => import("./pages/About"));
const CardsPage = React.lazy(() => import("./pages/cards/Page"));

// Admin
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const UsersPage = React.lazy(() => import("./pages/admin/Users"));
const AdminCardsPage = React.lazy(() => import("./pages/admin/Cards"));

// Cards
const CardDetailPage = React.lazy(() => import("./pages/cards/Detail"));
const EditCardPage = React.lazy(() => import("./pages/cards/Edit"));
const CreateCardPage = React.lazy(() => import("./pages/cards/Create"));
const Settings = React.lazy(() => import("./pages/Settings"));

// error
const Forbidden = React.lazy(() => import("./pages/errors/_403"));
const NotFound = React.lazy(() => import("./pages/errors/_404"));
const Unauthorized = React.lazy(() => import("./pages/errors/_401"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loading />
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<MainLayout />} errorElement={<ErrorBoundary />}>
              <Route
                path="/"
                element={<Layout />}
                errorElement={<ErrorBoundary />}
              >
                <Route index element={<Landing />} />

                <Route path="browse" element={<BrowsePage />} />
                <Route path="favourites" element={<FavouritesPage />} />

                {/* auth routes */}
                <Route
                  path="login"
                  element={
                    <AuthGuard>
                      <Login />
                    </AuthGuard>
                  }
                  errorElement={<ErrorBoundary />}
                />
                <Route
                  path="register"
                  element={
                    <AuthGuard>
                      <Register />
                    </AuthGuard>
                  }
                />
                <Route
                  path="forgot-password"
                  element={
                    <AuthGuard>
                      <ForgotPassword />
                    </AuthGuard>
                  }
                />
                <Route path="reset-password">
                  <Route
                    path=":token"
                    element={
                      <AuthGuard>
                        <ResetPassword />
                      </AuthGuard>
                    }
                  />
                </Route>

                {/* cards routes */}
                <Route path="cards">
                  <Route
                    index
                    element={
                      <ProtectedRoute roles={["admin"]}>
                        <CardsPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route path=":id">
                    <Route index element={<CardDetailPage />}></Route>
                    <Route
                      path="edit"
                      element={
                        <ProtectedRoute roles={["admin"]}>
                          <EditCardPage />
                        </ProtectedRoute>
                      }
                    ></Route>
                  </Route>

                  <Route
                    path="create"
                    element={
                      <ProtectedRoute roles={["admin"]}>
                        <CreateCardPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                </Route>
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route path="about" element={<About />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="terms" element={<TermsOfServicePage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
              </Route>

              <Route
                path="admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="cards" element={<AdminCardsPage />} />
              </Route>

              {/* error pages */}
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
