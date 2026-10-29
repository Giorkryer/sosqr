import { useState, useRef, useEffect, type FC } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldAlert,
  PlusCircle,
  Users,
  Menu,
  X,
  Bell,
  MessageSquare,
  BarChart3,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export const DashboardLayout: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isAdmin, signOut, isConfigured } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown do usuário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Prontuários', path: '/dashboard', icon: Users, aliases: ['/'] },
    { label: 'Novo Perfil', path: '/pacientes/novo', icon: PlusCircle, aliases: ['/patients/new'] },
    ...(isAdmin ? [{ label: 'Painel Admin', path: '/admin', icon: BarChart3 }] : []),
  ];

  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Cuidador';

  const userInitials = userDisplayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s: string) => s[0].toUpperCase())
    .join('');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <div className="w-10 h-10 border-3 border-[#0B6651] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-semibold text-stone-500">Carregando painel SOSqr...</p>
      </div>
    );
  }

  // Se o Supabase estiver configurado e o usuário não estiver logado, redireciona para login
  if (isConfigured && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
        <div className="w-14 h-14 bg-teal-50 text-[#0B6651] rounded-2xl flex items-center justify-center mb-4">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Autenticação Necessária</h2>
        <p className="text-sm text-stone-600 max-w-sm mb-6">
          Você precisa estar autenticado como cuidador para gerenciar os prontuários e cartões médicos.
        </p>
        <Link
          to="/login"
          className="bg-[#0B6651] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#084D3D] transition-colors"
        >
          Acessar com E-mail ou Google
        </Link>
      </div>
    );
  }

  return (
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
            <span className="font-black text-2xl tracking-tight text-white">SOSqr</span>
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
              title="Notificações de Socorro"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-rose-400 absolute top-2 right-2 ring-2 ring-[#0B6651]" />
            </button>

            <button
              className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title="Suporte SOSqr"
              aria-label="Suporte"
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

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  location.pathname === '/admin'
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title="Acessar Painel Administrativo"
              >
                <BarChart3 className="w-4 h-4 text-teal-100" />
                <span className="hidden sm:inline">Painel Admin</span>
              </Link>
            )}

            {/* Menu do Usuário Supabase */}
            <div className="relative pl-1 sm:pl-2 border-l border-white/20" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Menu do usuário"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white font-black text-xs flex items-center justify-center ring-2 ring-white/30">
                  {userInitials || <UserIcon className="w-4 h-4" />}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-teal-100 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-stone-900 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900 truncate">{userDisplayName}</p>
                    <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="mt-1.5 inline-block bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Administrador
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      <Users className="w-4 h-4 text-stone-400" />
                      Meus Prontuários
                    </Link>

                    <Link
                      to="/pacientes/novo"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                    >
                      <PlusCircle className="w-4 h-4 text-stone-400" />
                      Novo Perfil
                    </Link>
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sair da Conta
                    </button>
                  </div>
                </div>
              )}
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
                    isActive ? 'bg-white/20 text-white' : 'text-teal-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-rose-300 hover:bg-white/10"
              >
                <LogOut className="w-5 h-5 text-rose-300" />
                Sair da Conta
              </button>
            </div>
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
            Conforme a LGPD (Lei nº 13.709/2018): os dados acessados no QR Code público são estritamente
            emergenciais, preservando a intimidade e a segurança do titular.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
