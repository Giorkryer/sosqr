import type { FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HeartHandshake, ShieldAlert, PlusCircle, Users } from 'lucide-react';

export const RootLayout: FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Prontuários', path: '/', icon: Users },
    { label: 'Novo Perfil', path: '/patients/new', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-teal-50 selection:text-teal-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none rounded-xl p-1"
            aria-label="SOSqr Página Inicial"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-800 transition-colors">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-stone-900 block">
                SOSqr
              </span>
              <p className="text-xs text-stone-600 font-medium">Cuidado & Emergência</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-700/20'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Emergency Hotline / Quick Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/emergency/demo"
              className="flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 px-3.5 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
              title="Simular leitura de QR Code do Socorrista"
            >
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Simular Socorro</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* Accessible Footer with LGPD Compliance Note */}
      <footer className="border-t border-stone-200 bg-white py-8 text-center text-stone-600 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            SOSqr &bull; Proteção, Cuidado e Identificação Rápida
          </p>
          <p className="text-xs text-stone-600 max-w-md">
            Conforme a LGPD (Lei nº 13.709/2018): os dados acessados no QR Code público são estritamente emergenciais, preservando a intimidade e a segurança do titular.
          </p>
        </div>
      </footer>
    </div>
  );
};
