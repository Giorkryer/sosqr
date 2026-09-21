import type { FC } from 'react';
import { Camera, PhoneCall } from 'lucide-react';
import { QrCodeRenderer } from './QrCodeRenderer';
import type { Patient } from '../../patients/types';

interface CardPreviewBackProps {
  patient: Patient;
}

export const CardPreviewBack: FC<CardPreviewBackProps> = ({ patient }) => {
  const emergencyUrl = `${window.location.origin}/emergency/${patient.public_token}`;

  return (
    <div className="w-[360px] sm:w-[420px] aspect-[1.586] bg-stone-900 text-white rounded-2xl shadow-md p-5 flex items-center justify-between gap-4 relative overflow-hidden select-none border-2 border-stone-800">
      {/* QR Code */}
      <div className="shrink-0 flex flex-col items-center gap-1.5">
        <QrCodeRenderer value={emergencyUrl} size={110} />
        <span className="text-[8px] text-stone-400 font-mono tracking-wider">
          {patient.public_token.slice(0, 13)}...
        </span>
      </div>

      {/* Rescuer Instructions */}
      <div className="flex-1 flex flex-col justify-between h-full py-1">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
            <Camera className="w-3 h-3 text-rose-400" />
            Socorro Imediato
          </div>

          <h4 className="text-sm font-black text-white leading-tight uppercase">
            Aponte a Câmera para Ler o QR Code
          </h4>

          <p className="text-[11px] text-stone-300 leading-snug">
            Acesso instantâneo a remédios, alergias, convênio e telefones dos parentes.
          </p>
        </div>

        <div className="border-t border-stone-700 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SAMU 192</span>
          </div>

          <span className="text-[9px] bg-stone-800 text-stone-300 font-bold px-2 py-0.5 rounded border border-stone-700">
            VERSO
          </span>
        </div>
      </div>
    </div>
  );
};
