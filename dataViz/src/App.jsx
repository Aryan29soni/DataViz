import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import { FileProvider } from './FileContext';
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./components/Home";
import Reports from "./components/Reports";
import Databases from "./components/Databases";
import HelpAndSupport from "./components/HelpAndSupport";
import Notifications from "./components/Notifications";
import UserProfile from "./components/UserProfile";
import UploadPage from "./components/UploadPage";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AuthCallback from "./components/AuthCallback";
import Chatbot from "./components/Chatbot/Chatbot";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <Router>
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
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/home" element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="reports" element={<Reports />} />
                <Route path="databases" element={<Databases />} />
                <Route path="help-and-support" element={<HelpAndSupport />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="user-profile" element={<UserProfile />} />
                <Route path="chatbot" element={<Chatbot />} />
                <Route path="upload" element={<UploadPage />} />
              </Route>
            </Route>
            <Route path="/dashboard/:fileName" element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FileProvider>
    </AuthProvider>
  );
}

export default App;