import { useEffect, type FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import { HeartHandshake } from 'lucide-react';
import { setAuthTokenGetter } from './services/api';

import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { PatientFormPage } from './pages/PatientFormPage';
import { CardIssuePage } from './pages/CardIssuePage';
import { EmergencyProfilePage } from './pages/EmergencyProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminRoute } from './components/AdminRoute';

/**
 * Componente utilitário para sincronizar o método getToken() do Clerk
 * com o interceptor de requisições do Axios (api.ts)
 */
const ClerkTokenSync: FC = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!clerkPubKey) return null;

  return <ClerkAuthBinder />;
};

const ClerkAuthBinder: FC = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
  }, [getToken]);

  return null;
};

export const App: FC = () => {
  return (
    <BrowserRouter>
      <ClerkTokenSync />
      <Routes>
        <Route path="/emergency/:public_token" element={<EmergencyProfilePage />} />

        <Route
          path="/login/*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 selection:bg-teal-50 selection:text-teal-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
                  <HeartHandshake className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-extrabold text-2xl tracking-tight text-stone-900 block">
                    SOSqr
                  </span>
                  <p className="text-xs text-stone-600 font-medium">Acesso do Cuidador</p>
                </div>
              </div>

              <SignIn
                routing="path"
                path="/login"
                signUpUrl="/cadastro"
                fallbackRedirectUrl="/dashboard"
              />
            </div>
          }
        />

        <Route
          path="/cadastro/*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 selection:bg-teal-50 selection:text-teal-800">
              <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
                  <HeartHandshake className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-extrabold text-2xl tracking-tight text-stone-900 block">
                    SOSqr
                  </span>
                  <p className="text-xs text-stone-600 font-medium">Cadastro de Cuidador</p>
                </div>
              </div>

              <SignUp
                routing="path"
                path="/cadastro"
                signInUrl="/login"
                fallbackRedirectUrl="/dashboard"
              />
            </div>
          }
        />

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes/novo" element={<PatientFormPage />} />
          <Route path="/pacientes/:id/editar" element={<PatientFormPage />} />
          <Route path="/pacientes/:id/cartao" element={<CardIssuePage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

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
