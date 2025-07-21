import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
// Add your imports here
import LoginPage from "pages/login";
import MainAdminDashboard from "pages/main-admin-dashboard";
import DepartmentAdminDashboard from "pages/department-admin-dashboard";
import TimetableManagement from "pages/timetable-management";
import StaffRegistrationManagement from "pages/staff-registration-management";
import ChoiceFormCreationManagement from "pages/choice-form-creation-management";
import StaffDashboard from "pages/staff-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/main-admin-dashboard" element={
          <ProtectedRoute requiredRoles={['main_admin']}>
            <MainAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/department-admin-dashboard" element={
          <ProtectedRoute requiredRoles={['department_admin']}>
            <DepartmentAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/timetable-management" element={
          <ProtectedRoute requiredRoles={['main_admin', 'department_admin']}>
            <TimetableManagement />
          </ProtectedRoute>
        } />
        <Route path="/staff-registration-management" element={
          <ProtectedRoute requiredRoles={['main_admin', 'department_admin']}>
            <StaffRegistrationManagement />
          </ProtectedRoute>
        } />
        <Route path="/choice-form-creation-management" element={
          <ProtectedRoute requiredRoles={['main_admin', 'department_admin']}>
            <ChoiceFormCreationManagement />
          </ProtectedRoute>
        } />
        <Route path="/staff-dashboard" element={
          <ProtectedRoute requiredRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;