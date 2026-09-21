import type { FC } from 'react';
import { Phone, Star } from 'lucide-react';
import type { PublicEmergencyContact } from '../types';

interface EmergencyContactsListProps {
  contacts: PublicEmergencyContact[];
}

export const EmergencyContactsList: FC<EmergencyContactsListProps> = ({ contacts }) => {
  if (!contacts || contacts.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-stone-100 text-stone-600 text-sm text-center">
        Nenhum contato de emergência cadastrado.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact, index) => {
        const cleanPhone = contact.phone_number.replace(/\D/g, '');

        return (
          <div
            key={index}
            className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              contact.is_primary
                ? 'bg-emerald-50/50 border-emerald-500/40'
                : 'bg-white border-stone-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-stone-900">{contact.name}</span>
                {contact.is_primary && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-emerald-600" />
                    Principal
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-stone-600">
                {contact.relationship} &bull; {contact.phone_number}
              </p>
            </div>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow transition-transform active:scale-95 text-base"
              aria-label={`Ligar para ${contact.name}`}
            >
              <Phone className="w-5 h-5 fill-white" />
              <span>LIGAR AGORA</span>
            </a>
          </div>
        );
      })}
    </div>
  );
};
