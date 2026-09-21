import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldAlert, PhoneCall } from 'lucide-react';

export const PublicLayout: FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      {/* High-visibility Emergency Header */}
      <header className="bg-rose-500 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                SOSqr &bull; Ficha Médica de Emergência
              </h1>
              <p className="text-xs text-rose-100 font-medium">
                Atendimento Rápido e Primeiros Socorros
              </p>
            </div>
          </div>

          <a
            href="tel:192"
            className="flex items-center gap-2 bg-white text-rose-600 px-3.5 py-2 rounded-xl text-sm font-extrabold shadow hover:bg-rose-50 active:scale-95 transition-transform"
            aria-label="Ligar para o SAMU 192"
          >
            <PhoneCall className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>LIGAR 192</span>
          </a>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-600 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-stone-900">
            Ficha de Identificação de Socorro Conforme LGPD
          </p>
          <p>
            Em caso de acidente grave ou pessoa desorientada, acione imediatamente o SAMU (192) ou Bombeiros (193).
          </p>
        </div>
      </footer>
    </div>
  );
};
