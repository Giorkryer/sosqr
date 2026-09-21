import { useState, type FC } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AuthPage: FC = () => {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 flex items-center justify-center text-white mx-auto shadow-md">
            <HeartHandshake className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            SOSqr
          </h1>
          <p className="text-sm text-stone-600">
            Acesso para gestão de prontuários e cartões médicos de emergência.
          </p>
        </div>

        {/* Clerk Auth or Dev Fallback */}
        {clerkPubKey ? (
          <div className="flex justify-center">
            {mode === 'sign-in' ? (
              <SignIn
                routing="hash"
                afterSignInUrl="/"
                signUpUrl="#sign-up"
              />
            ) : (
              <SignUp
                routing="hash"
                afterSignUpUrl="/"
                signInUrl="#sign-in"
              />
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5 text-center">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-stone-900">Autenticação Clerk</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Para ativar a autenticação real por e-mail/Google, adicione a chave pública em <code className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">.env</code>:
              </p>
              <div className="p-3 bg-stone-100 rounded-xl text-left text-xs font-mono text-stone-800 select-all overflow-x-auto">
                VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
              </div>
            </div>

            <div className="pt-2">
              <Link to="/">
                <Button variant="primary" fullWidth size="lg" className="gap-2">
                  <span>Acessar Painel (Modo Dev)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {clerkPubKey && (
          <div className="text-center text-xs text-stone-500">
            {mode === 'sign-in' ? (
              <button
                onClick={() => setMode('sign-up')}
                className="hover:text-teal-700 underline"
              >
                Não tem uma conta? Crie agora
              </button>
            ) : (
              <button
                onClick={() => setMode('sign-in')}
                className="hover:text-teal-700 underline"
              >
                Já possui conta? Fazer login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
