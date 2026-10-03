import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Consultation from "./pages/Consultation";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/patients"
          element={
            <DashboardLayout>
              <Patients />
            </DashboardLayout>
          }
        />

        <Route
          path="/consultation"
          element={
            <DashboardLayout>
              <Consultation />
            </DashboardLayout>
          }
        />

        <Route
          path="/knowledge-graph"
          element={
            <DashboardLayout>
              <KnowledgeGraph />
            </DashboardLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;