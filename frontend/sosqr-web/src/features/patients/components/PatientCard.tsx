import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, QrCode, IdCard, Trash2, ExternalLink } from 'lucide-react';
import type { Patient } from '../types';
import { formatAgeDisplay } from '../../../utils/date';

export interface PatientCardProps {
  patient: Patient;
  onOpenQr?: (patient: Patient) => void;
  onDelete?: (patient: { id: number; full_name: string }) => void;
}

export const PatientCard: FC<PatientCardProps> = ({ patient, onOpenQr, onDelete }) => {
  const contactsCount = patient.emergency_contacts?.length ?? 0;
  const displayName = patient.full_name || patient.display_name;
  const ageDisplay = formatAgeDisplay(patient.birth_date, patient.age);

  const hasScan = Boolean(
    patient.last_scan && (patient.last_scan.scanned_at || patient.last_scan.date)
  );
  const scanDate = patient.last_scan?.scanned_at || patient.last_scan?.date;
  const scanIp = patient.last_scan?.ip_address || patient.last_scan?.ip || 'Não registrado';

  return (
    <div
      data-testid={`patient-card-${patient.id}`}
      className="bg-white rounded-2xl md:rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow p-6 space-y-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 border-2 border-stone-100 shrink-0 shadow-xs flex items-center justify-center">
            {patient.avatar_url ? (
              <img
                src={patient.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-teal-50 text-teal-800 font-black text-xl flex items-center justify-center">
                {displayName
                  ? displayName
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'P'}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              {displayName}
            </h2>
            <div className="flex items-center gap-2.5 mt-1">
              <span className="text-base font-bold text-stone-600">
                {ageDisplay}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                Ativo
              </span>
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete({ id: patient.id, full_name: displayName })}
            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            title={`Excluir cadastro de ${displayName}`}
            aria-label={`Excluir cadastro de ${displayName}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-1.5 pt-1 text-base text-stone-900 font-bold">
        <p>Ficha Vital: Completa</p>
        <p>Contatos: {contactsCount}</p>
        {hasScan ? (
          <p className="text-sm sm:text-base font-bold text-stone-800">
            Último Escaneamento: {scanDate} (IP: {scanIp})
          </p>
        ) : (
          <p className="text-sm sm:text-base font-bold text-stone-500">
            Nenhum escaneamento prévio registrado
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2.5">
        <Link
          to={`/pacientes/${patient.id}/editar`}
          className="border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl px-3.5 py-2.5 flex items-center justify-center gap-2 text-stone-800 font-bold text-sm transition-colors"
          title="Editar perfil de emergência"
        >
          <Edit3 className="w-4 h-4 text-teal-700" />
          <span>Editar</span>
        </Link>

        <button
          type="button"
          onClick={() => onOpenQr?.(patient)}
          className="border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl px-3.5 py-2.5 flex items-center justify-center gap-2 text-stone-800 font-bold text-sm transition-colors"
          title="Visualizar QR Code ampliado"
        >
          <QrCode className="w-4 h-4 text-teal-700" />
          <span>QR Code</span>
        </button>

        <Link
          to={`/pacientes/${patient.id}/cartao`}
          className="border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl px-3.5 py-2.5 flex items-center justify-center gap-2 text-stone-800 font-bold text-sm transition-colors"
          title="Emitir cartão físico CR80 com QR Code"
        >
          <IdCard className="w-4 h-4 text-teal-700" />
          <span>Emitir Cartão</span>
        </Link>

        <a
          href={`/emergency/${patient.public_token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 rounded-xl px-3.5 py-2.5 flex items-center justify-center gap-2 text-stone-800 font-bold text-sm transition-colors"
          title="Visualizar Ficha Pública de Emergência em nova aba"
        >
          <ExternalLink className="w-4 h-4 text-teal-700" />
          <span>Ver Ficha</span>
        </a>
      </div>
    </div>
  );
};
