import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './components/auth/LoginPage';
import CarManagementLayout from './components/layout/CarManagementLayout';
import ClientLayout from './components/client/ClientLayout';
import Dashboard from './components/dashboard/Dashboard';
import Cars from './components/cars/Cars';
import Customers from './components/customers/Customers';
import Sales from './components/sales/Sales';
import Employees from './components/employees/Employees';
import CarList from './components/client/CarList';
import FavoriteList from './components/client/FavoriteList';
import AppointmentForm from './components/client/AppointmentForm';
import AppointmentPage from './components/client/AppointmentPage';
import AppointmentManagement from './components/appointments/AppointmentManagement';
import CarDetail from './components/client/CarDetail';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CarManagementLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cars" element={<Cars />} />
              <Route path="customers" element={<Customers />} />
              <Route path="sales" element={<Sales />} />
              <Route path="employees" element={<Employees />} />
              <Route path="appointments" element={<AppointmentManagement />} />
            </Route>

            {/* Client Routes */}
            <Route
              path="/client"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/client/cars" replace />} />
              <Route path="cars" element={<CarList />} />
              <Route path="cars/:carId" element={<CarDetail />} />
              <Route path="favorites" element={<FavoriteList />} />
              <Route path="appointment" element={<AppointmentPage />} />
              <Route path="appointment/:carId" element={<AppointmentForm />} />
            </Route>

            {/* Redirect unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;