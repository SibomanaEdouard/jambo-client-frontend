import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DevicePending from './pages/DevicePending';
import { AuthProvider } from './context/authContext';
import { useAuth } from './context/auth';
import Header from './components/Layout/Header';


const DevicePendingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, deviceVerified } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If device is verified, redirect to dashboard
  if (deviceVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const DashboardRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, deviceVerified } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If device is not verified, redirect to pending page
  if (!deviceVerified) {
    return <Navigate to="/device-pending" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, deviceVerified } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show header if authenticated AND device is verified */}
      {isAuthenticated && deviceVerified && <Header />}
      <main className={isAuthenticated && deviceVerified ? '' : 'min-h-screen'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <DashboardRoute>
                <Dashboard />
              </DashboardRoute>
            } 
          />
          <Route 
            path="/device-pending" 
            element={
              <DevicePendingRoute>
                <DevicePending />
              </DevicePendingRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;