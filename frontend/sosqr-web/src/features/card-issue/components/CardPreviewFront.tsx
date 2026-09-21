import type { FC } from 'react';
import { HeartHandshake, Droplet, Phone, AlertTriangle } from 'lucide-react';
import type { Patient } from '../../patients/types';

interface CardPreviewFrontProps {
  patient: Patient;
}

export const CardPreviewFront: FC<CardPreviewFrontProps> = ({ patient }) => {
  const contacts = patient.emergency_contacts || [];
  const primaryContact =
    contacts.find((c) => c.is_primary) ||
    contacts[0];

  return (
    <div className="w-[360px] sm:w-[420px] aspect-[1.586] bg-stone-50 border-2 border-stone-300 rounded-2xl shadow-md p-5 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-teal-800 uppercase block">
              SOSqr
            </span>
            <span className="text-[10px] text-stone-600 font-bold tracking-tight">
              CARTÃO MÉDICO DE SOCORRO
            </span>
          </div>
        </div>

        {/* Blood Badge */}
        <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 text-rose-600 px-2.5 py-1 rounded-lg text-sm font-extrabold shadow-2xs">
          <Droplet className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>{patient.blood_type}</span>
        </div>
      </div>

      {/* Center Details */}
      <div className="py-2 space-y-1">
        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
          Nome / Titular
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight truncate">
          {patient.display_name}
        </h3>

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-bold pt-1 truncate">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Alergias: {patient.allergies.slice(0, 2).join(', ')}
              {patient.allergies.length > 2 ? '...' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Contact and Legal Notice */}
      <div className="border-t border-stone-200 pt-2.5 flex items-center justify-between text-xs">
        {primaryContact ? (
          <div>
            <span className="text-[10px] text-stone-600 font-semibold block">
              Contato de Emergência ({primaryContact.relationship}):
            </span>
            <span className="font-extrabold text-stone-900 flex items-center gap-1 text-sm">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              {primaryContact.phone_number}
            </span>
          </div>
        ) : (
          <span className="text-stone-500">Consulte o verso para contatos</span>
        )}

        <div className="text-right">
          <span className="text-[9px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded border border-teal-700/20">
            FRENTE
          </span>
        </div>
      </div>
    </div>
  );
};
