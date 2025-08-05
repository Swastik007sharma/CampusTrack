import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ItemDetails from "./pages/ItemDetails";
import ItemCreate from "./pages/ItemCreate";
import Profile from "./pages/Profile";
import Conversations from "./pages/Conversations";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import UserDetail from "./pages/UserDetail";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import VerifyOtp from "./pages/Auth/VerifyOtp"; // Import the VerifyOtp component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} /> {/* Add this route */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/items/:id" element={<ItemDetails />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/messages/:conversationId" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items/create"
                element={
                  <ProtectedRoute>
                    <ItemCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <AdminRoute>
                    <UserDetail />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;