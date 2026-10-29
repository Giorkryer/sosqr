import { type FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { PatientFormPage } from './pages/PatientFormPage';
import { CardIssuePage } from './pages/CardIssuePage';
import { EmergencyProfilePage } from './pages/EmergencyProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminGuard } from './features/admin/components/AdminGuard';
import { AuthPage } from './features/auth/AuthPage';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública de emergência médica (acessada pelo QR Code) */}
        <Route path="/emergency/:public_token" element={<EmergencyProfilePage />} />

        {/* Rotas de Autenticação Supabase */}
        <Route path="/login" element={<AuthPage initialMode="sign-in" />} />
        <Route path="/cadastro" element={<AuthPage initialMode="sign-up" />} />

        {/* Rotas autenticadas do Cuidador */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes/novo" element={<PatientFormPage />} />
          <Route path="/pacientes/:id/editar" element={<PatientFormPage />} />
          <Route path="/pacientes/:id/cartao" element={<CardIssuePage />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboardPage />
              </AdminGuard>
            }
          />

          {/* Aliases e redirecionamentos */}
          <Route path="/patients/new" element={<Navigate to="/pacientes/novo" replace />} />
          <Route path="/patients/:id/edit" element={<PatientFormPage />} />
          <Route path="/patients/:id/card" element={<CardIssuePage />} />
          <Route path="/card-issue" element={<CardIssuePage />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
