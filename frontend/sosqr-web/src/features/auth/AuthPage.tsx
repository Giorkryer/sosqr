import { useState, useEffect, type FC, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeartHandshake, Mail, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from '../../components/ui/Button';

interface AuthPageProps {
  initialMode?: 'sign-in' | 'sign-up';
}

export const AuthPage: FC<AuthPageProps> = ({ initialMode = 'sign-in' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithOAuth, isConfigured } = useAuth();

  const [mode, setMode] = useState<'sign-in' | 'sign-up'>(
    location.pathname.includes('cadastro') ? 'sign-up' : initialMode
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detecta mensagens de erro de OAuth vindas de redirecionamento (query params ou URL hash)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hash = location.hash ? new URLSearchParams(location.hash.replace(/^#/, '')) : null;

    const errorDesc =
      params.get('error_description') ||
      hash?.get('error_description') ||
      params.get('error') ||
      hash?.get('error');

    if (errorDesc) {
      if (
        errorDesc.includes('provider is not enabled') ||
        errorDesc.includes('validation_failed') ||
        errorDesc.includes('unsupported_provider')
      ) {
        setErrorMessage(
          'O login com Google ainda não está ativado no painel do Supabase (Authentication > Providers > Google).'
        );
      } else {
        setErrorMessage(`Falha na autenticação com provedor: ${decodeURIComponent(errorDesc)}`);
      }
    }
  }, [location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      if (mode === 'sign-in') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('E-mail ou senha incorretos.');
          } else if (error.message.includes('Email not confirmed')) {
            setErrorMessage('Por favor, confirme seu e-mail antes de fazer login.');
          } else {
            setErrorMessage(error.message || 'Falha ao autenticar.');
          }
        } else {
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setErrorMessage(error.message || 'Falha ao criar cadastro.');
        } else {
          setSuccessMessage(
            'Cadastro realizado! Se a confirmação de e-mail estiver ativada, verifique sua caixa de entrada.'
          );
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google') => {
    setErrorMessage(null);
    setOauthLoading(true);

    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        if (
          error.message?.includes('provider is not enabled') ||
          error.message?.includes('validation_failed')
        ) {
          setErrorMessage(
            'O login com Google não está ativado no Supabase (Authentication > Providers > Google).'
          );
        } else {
          setErrorMessage(error.message || 'Falha ao iniciar autenticação com o Google.');
        }
        setOauthLoading(false);
      }
      // Se não houver erro síncrono, o navegador será redirecionado para a tela de autenticação
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao iniciar autenticação com o Google.';
      setErrorMessage(msg);
      setOauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 selection:bg-teal-50 selection:text-teal-800">
      <div className="max-w-md w-full space-y-6">
        {/* Header / Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#0B6651] flex items-center justify-center text-white mx-auto shadow-md">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">SOSqr</h1>
          <p className="text-sm text-stone-600 font-medium">
            {mode === 'sign-in'
              ? 'Acesse seus prontuários e cartões médicos de emergência'
              : 'Crie sua conta para proteger sua família com QR Codes de socorro'}
          </p>
        </div>

        {/* Not Configured Notice */}
        {!isConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Atenção: Supabase não configurado no .env</p>
              <p className="mt-1 text-amber-800 leading-relaxed">
                Adicione <code className="bg-amber-100/80 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> e{' '}
                <code className="bg-amber-100/80 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> no arquivo{' '}
                <code className="bg-amber-100/80 px-1 py-0.5 rounded">frontend/sosqr-web/.env</code>.
              </p>
            </div>
          </div>
        )}

        {/* Card Principal */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign-up' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Seu Nome Completo
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo da Silva"
                    className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6651] focus:bg-white transition-all text-stone-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6651] focus:bg-white transition-all text-stone-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Senha
                </label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6651] focus:bg-white transition-all text-stone-900"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={submitting || !isConfigured}
              className="mt-2 bg-[#0B6651] hover:bg-[#084D3D] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'sign-in' ? 'Entrar no SOSqr' : 'Criar Conta de Cuidador'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-xs text-stone-600 font-medium uppercase tracking-wider">ou</span>
            <div className="border-t border-stone-200 w-full" />
          </div>

          {/* Social Login Button */}
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={submitting || oauthLoading || !isConfigured}
            aria-busy={oauthLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-stone-200 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-stone-300"
          >
            {oauthLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#0B6651]" />
                <span>Conectando com o Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continuar com o Google</span>
              </>
            )}
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-stone-600">
          {mode === 'sign-in' ? (
            <p>
              Não possui uma conta?{' '}
              <button
                type="button"
                onClick={() => setMode('sign-up')}
                className="font-bold text-[#0B6651] hover:underline"
              >
                Cadastre-se gratuitamente
              </button>
            </p>
          ) : (
            <p>
              Já possui cadastro?{' '}
              <button
                type="button"
                onClick={() => setMode('sign-in')}
                className="font-bold text-[#0B6651] hover:underline"
              >
                Fazer login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
