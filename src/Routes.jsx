import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
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
        <Route path="/" element={<MainAdminDashboard />} />
        <Route path="/main-admin-dashboard" element={<MainAdminDashboard />} />
        <Route path="/department-admin-dashboard" element={<DepartmentAdminDashboard />} />
        <Route path="/timetable-management" element={<TimetableManagement />} />
        <Route path="/staff-registration-management" element={<StaffRegistrationManagement />} />
        <Route path="/choice-form-creation-management" element={<ChoiceFormCreationManagement />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;