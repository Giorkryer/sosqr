import { useState, type FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/clerk-react';
import { HeartHandshake, ShieldAlert, PlusCircle, Users, Menu, X, Bell, MessageSquare, ShieldCheck } from 'lucide-react';

export const DashboardLayout: FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const navItems = [
    { label: 'Prontuários', path: '/dashboard', icon: Users, aliases: ['/'] },
    { label: 'Novo Perfil', path: '/pacientes/novo', icon: PlusCircle, aliases: ['/patients/new'] },
    { label: 'Admin', path: '/admin', icon: ShieldCheck },
  ];

  const renderLayoutContent = () => (
    <div className="min-h-screen flex flex-col bg-[#f4f4f5] text-stone-900 font-sans selection:bg-teal-50 selection:text-teal-800">
      <header className="sticky top-0 z-40 bg-[#0B6651] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group focus:outline-none rounded-xl p-1"
            aria-label="SOSqr Página Inicial"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-white shadow-xs group-hover:bg-white/25 transition-colors">
              <HeartHandshake className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-white">
              SOSqr
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                Boolean(item.aliases?.includes(location.pathname));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-white/20 text-white shadow-xs'
                      : 'text-teal-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:flex items-center justify-center relative"
              title="Notificações"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-rose-400 absolute top-2 right-2 ring-2 ring-[#0B6651]" />
            </button>

            <button
              className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title="Suporte / Mensagens"
              aria-label="Suporte / Mensagens"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <Link
              to="/emergency/demo"
              className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
              title="Simular leitura de QR Code do Socorrista"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="hidden lg:inline">Simular Socorro</span>
            </Link>

            <div className="flex items-center pl-1 sm:pl-2 border-l border-white/20">
              <UserButton
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-10 h-10 ring-2 ring-white/40 hover:ring-white transition-all rounded-full',
                    userButtonTrigger: 'focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full',
                  },
                }}
              />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#084D3D] px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                Boolean(item.aliases?.includes(location.pathname));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-teal-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

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

  if (clerkPubKey) {
    return (
      <>
        <SignedIn>{renderLayoutContent()}</SignedIn>
        <SignedOut>
          <RedirectToSignIn signInFallbackRedirectUrl="/dashboard" />
        </SignedOut>
      </>
    );
  }

  return renderLayoutContent();
};

export default DashboardLayout;
