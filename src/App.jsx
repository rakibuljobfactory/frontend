import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// View Screen Component Imports
import { Home } from "./Home";
import { Login } from "./Login";
import { Register } from "./Register";
import { Dashboard } from "./user/Dashboard"; // User dashboard
import { Dashboard as VendorDashboard } from "./vendor/Dashboard"; // Vendor dashboard
import { CreateJob } from "./vendor/CreateJob";
import { MyList } from "./vendor/MyList";
import { AdminDashboard } from "./admin/AdminDashboard"; // Admin dashboard
import { AllVendor } from "./admin/AllVendor";
import { PendingVendor } from "./admin/PendingVendor";
import { ActiveVendor } from "./admin/ActiveVendor";
import { ShowPassword } from "./admin/ShowPassword"; // Admin: Show Passwords
import { JobAnalytics } from "./admin/JobAnalytics"; // Admin job analytics
import { Footer } from './Footer';

// ==========================================
// 1. ROUTE GUARD COMPONENT (ProtectedRoute)
// ==========================================
export const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // If there's no token or user profile session, kick them back to Login
    if (!token || !storedUser) {
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(storedUser);

    // Role Guardrail: If they don't match the required clearance, route to fallback defaults
    if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
        return user.role === "vendor" 
            ? <Navigate to="/vendor-dashboard" replace /> 
            : <Navigate to="/user-dashboard" replace />;
    }

    // Render matching sub-routes if authorization is clear
    return <Outlet />;
};

// ==========================================
// 2. MAIN APPLICATION COMPONENT
// ==========================================
function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Public / Semi-Public Routes */}
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Auth Redirects: If already logged in, skip the Auth layout screens */}
          {/* <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} /> */}
          {/* <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />} /> */}

          {/* Regular User Channels (role: 'user') */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/user-dashboard" element={<Dashboard />} />
          </Route>

          {/* Vendor Operational Layers (role: 'vendor') */}
          <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/my-list" element={<MyList />} />
          </Route>


          {/* Admin Control Panel (role: 'admin') */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/all-vendors" element={<AllVendor />} />
            <Route path="/admin-dashboard/pending-vendors" element={<PendingVendor />} />
            <Route path="/admin-dashboard/active-vendors" element={<ActiveVendor />} />
            <Route path="/admin-dashboard/jobs" element={<JobAnalytics />} />
            <Route path="/admin-dashboard/users-passwords" element={<ShowPassword />} />
          </Route>

          {/* 404 Fallback Catch */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;