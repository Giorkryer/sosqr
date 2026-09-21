import { useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { HeartHandshake, TriangleAlert, Phone, ShieldAlert, FileText } from 'lucide-react';
import axios from 'axios';

export interface EmergencyContact {
  name: string;
  phone_number: string;
  relationship: string;
  is_primary: boolean;
}

export interface EmergencyProfile {
  public_token: string;
  display_name?: string;
  full_name: string;
  age: number;
  birth_date: string;
  gender?: string;
  blood_type: string;
  organ_donor?: boolean;
  medical_notes?: string;
  medical_devices: string[];
  health_insurance_name?: string;
  health_insurance_number?: string;
  allergies: string[];
  chronic_conditions: string[];
  medications_in_use: string[];
  emergency_contacts: EmergencyContact[];
}

const DEMO_PROFILE: EmergencyProfile = {
  public_token: 'demo',
  display_name: 'Dona Francisca',
  full_name: 'Maria Francisca dos Santos',
  age: 74,
  birth_date: '1952-05-10',
  gender: 'Feminino',
  blood_type: 'O+',
  organ_donor: true,
  allergies: ['Penicilina e Dipirona'],
  medications_in_use: ['Rivaroxabana (Xarelto) e Insulina'],
  chronic_conditions: [
    'Hipertensão Arterial',
    'Diabetes Tipo 2 (Risco de choque)',
    'Demência/Alzheimer (Desorientação)',
  ],
  medical_devices: [
    'Marcapasso Cardíaco (Não desfibrilar convencionalmente)',
    'Prótese no fêmur',
  ],
  medical_notes: 'Apresenta marcha instável com risco de quedas ao entardecer. Restrição hídrica moderada prescrita por cardiologista.',
  health_insurance_name: 'Unimed Fortaleza',
  health_insurance_number: '123456789-0',
  emergency_contacts: [
    {
      name: 'Carlos',
      relationship: 'Filho',
      phone_number: '(85) 99123-4567',
      is_primary: true,
    },
    {
      name: 'Mariana',
      relationship: 'Filha',
      phone_number: '(85) 99234-5678',
      is_primary: false,
    },
  ],
};

const formatDateBR = (dateStr?: string): string => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const formatBloodRh = (bloodType?: string): string => {
  if (!bloodType) return '';
  if (bloodType.includes('+')) return '(Positivo)';
  if (bloodType.includes('-')) return '(Negativo)';
  return '';
};

export const EmergencyProfilePage: FC = () => {
  const { public_token } = useParams<{ public_token: string }>();
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (public_token === 'demo') {
      setProfile(DEMO_PROFILE);
      setIsNotFound(false);
      setLoading(false);
      return;
    }

    if (!public_token) {
      setIsNotFound(true);
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setIsNotFound(false);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

    axios
      .get<EmergencyProfile>(`${apiUrl}/emergency/${public_token}`)
      .then((res) => {
        setProfile(res.data);
        setIsNotFound(false);
      })
      .catch(() => {
        setIsNotFound(true);
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [public_token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] text-stone-900 flex flex-col font-sans">
        <header className="bg-[#0B6651] text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-3.5 sm:py-4 flex items-center justify-center sm:justify-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 animate-pulse" />
            <div className="h-5 w-64 bg-white/20 rounded animate-pulse" />
          </div>
        </header>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
          {/* Card 1 Skeleton */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200 p-5 sm:p-7 space-y-4 shadow-sm animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-8 w-64 bg-stone-200 rounded-lg" />
                <div className="h-4 w-40 bg-stone-200 rounded-md" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-18 h-18 bg-rose-200 rounded-full" />
                <div className="h-4 w-24 bg-stone-200 rounded" />
              </div>
            </div>
            <div className="h-12 bg-rose-100/70 rounded-xl" />
            <div className="h-12 bg-stone-100 rounded-xl" />
          </div>

          {/* Card 2 Skeleton */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200 p-5 sm:p-7 space-y-5 shadow-sm animate-pulse">
            <div className="space-y-2">
              <div className="h-3.5 w-44 bg-stone-200 rounded" />
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-32 bg-stone-200 rounded-full" />
                <div className="h-7 w-40 bg-stone-200 rounded-full" />
                <div className="h-7 w-48 bg-stone-200 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-48 bg-stone-200 rounded" />
              <div className="h-7 w-72 bg-stone-200 rounded-xl" />
            </div>
          </div>

          {/* Botões Skeleton */}
          <div className="space-y-3 pt-1">
            <div className="h-14 bg-emerald-200/80 rounded-xl animate-pulse" />
            <div className="h-14 bg-emerald-200/80 rounded-xl animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (isNotFound || !profile) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] text-stone-900 flex flex-col font-sans">
        <header className="bg-[#0B6651] text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-3.5 sm:py-4 flex items-center justify-center sm:justify-start gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm sm:text-base font-black tracking-tight text-white uppercase">
              SOSqr | FICHA PÚBLICA DE EMERGÊNCIA
            </span>
          </div>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col items-center text-center justify-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <ShieldAlert className="w-9 h-9 text-rose-600" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">
            Ficha de Emergência Não Encontrada
          </h1>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            O QR Code escaneado não corresponde a um prontuário ativo, pode ter sido desativado pelo cuidador ou o endereço é inválido.
          </p>

          <div className="w-full space-y-3">
            <a
              href="tel:192"
              className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow transition-colors"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>Acionar SAMU (192)</span>
            </a>
            <a
              href="tel:193"
              className="w-full bg-stone-800 hover:bg-stone-900 active:bg-stone-950 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow transition-colors"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>Acionar Bombeiros (193)</span>
            </a>
          </div>

          <footer className="mt-12 text-xs text-stone-500 font-medium">
            Dados de emergência públicos protegidos (LGPD) • SOSqr
          </footer>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-stone-900 font-sans flex flex-col selection:bg-teal-50 selection:text-teal-800">
      <header className="bg-[#0B6651] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3.5 sm:py-4 flex items-center justify-center sm:justify-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
            <HeartHandshake className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-black tracking-tight text-white uppercase">
              SOSqr
            </span>
            <span className="text-stone-300 font-light text-sm sm:text-base">|</span>
            <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide text-white/95 uppercase">
              FICHA PÚBLICA DE EMERGÊNCIA
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
                {profile.full_name}
              </h1>
              <p className="text-stone-600 font-semibold text-sm sm:text-base mt-1">
                ({profile.age} anos / {formatDateBR(profile.birth_date)})
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-500 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                <span className="text-2xl sm:text-3xl font-black leading-none">
                  {profile.blood_type}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold mt-0.5 opacity-95">
                  {formatBloodRh(profile.blood_type)}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-black text-stone-800 leading-tight block uppercase">
                  Tipo Sanguíneo /
                  <br />
                  Fator Rh
                </span>
              </div>
            </div>
          </div>

          {profile.allergies && profile.allergies.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4 flex items-start sm:items-center gap-2.5 sm:gap-3 text-rose-950">
              <TriangleAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0 fill-rose-600/20" />
              <div className="text-xs sm:text-sm leading-snug">
                <strong className="font-extrabold text-rose-900 tracking-wide uppercase mr-1.5">
                  ALERGIAS SEVERAS E MEDICAMENTOSAS:
                </strong>
                <span className="font-bold text-rose-950">
                  {Array.isArray(profile.allergies) ? profile.allergies.join(' e ') : profile.allergies}
                </span>
              </div>
            </div>
          )}

          {profile.medications_in_use && profile.medications_in_use.length > 0 && (
            <div className="bg-white border-2 border-rose-300 rounded-xl p-3 sm:p-4 flex items-start sm:items-center gap-2.5 sm:gap-3 text-rose-950 shadow-xs">
              <div className="text-xs sm:text-sm leading-snug">
                <strong className="font-extrabold text-rose-900 tracking-tight mr-1.5">
                  MEDICAMENTOS CRÍTICOS EM USO (Risco Cirúrgico/Sangramento):
                </strong>
                <span className="font-bold text-stone-900">
                  {Array.isArray(profile.medications_in_use)
                    ? profile.medications_in_use.join(' e ')
                    : profile.medications_in_use}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-5">
          {profile.chronic_conditions && profile.chronic_conditions.length > 0 && (
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 block mb-2.5">
                COMORBIDADES RELEVANTES
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.chronic_conditions.map((item, idx) => {
                  const isHighAlert =
                    item.toLowerCase().includes('alzheimer') ||
                    item.toLowerCase().includes('demência') ||
                    item.toLowerCase().includes('desorientação');

                  return (
                    <span
                      key={idx}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-full inline-flex items-center ${
                        isHighAlert
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-200/90 text-stone-800'
                      }`}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {profile.medical_devices && profile.medical_devices.length > 0 && (
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 block mb-2.5">
                DISPOSITIVOS E IMPLANTES
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.medical_devices.map((device, idx) => (
                  <span
                    key={idx}
                    className="bg-stone-100 border border-stone-200/90 text-stone-800 text-xs font-semibold px-3.5 py-1.5 rounded-xl inline-flex items-center"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.medical_notes && profile.medical_notes.trim() !== '' && (
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5 mb-2">
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                OBSERVAÇÕES CLÍNICAS IMPORTANTES
              </span>
              <div className="bg-stone-100 border border-stone-200 rounded-xl p-4 text-stone-800 text-sm leading-relaxed whitespace-pre-line">
                {profile.medical_notes}
              </div>
            </div>
          )}

          {(profile.health_insurance_name || profile.health_insurance_number) && (
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 block mb-1">
                CONVÊNIO MÉDICO
              </span>
              <p className="text-sm font-semibold text-stone-700">
                {profile.health_insurance_name || 'Convênio'}
                {profile.health_insurance_number ? ` - Nº ${profile.health_insurance_number}` : ''}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-1">
          {profile.emergency_contacts && profile.emergency_contacts.length > 0 ? (
            profile.emergency_contacts.map((contact, idx) => {
              const cleanPhone = contact.phone_number.replace(/\D/g, '');
              return (
                <a
                  key={idx}
                  href={`tel:${cleanPhone}`}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 min-h-[56px] text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 px-4 shadow-md hover:shadow-lg transition-all transform active:scale-[0.99]"
                >
                  <Phone className="w-5 h-5 shrink-0 fill-current" />
                  <span className="text-center truncate">
                    Ligar para {contact.name} ({contact.relationship}
                    {contact.is_primary ? ' - Contato Principal' : ''}) - {contact.phone_number}
                  </span>
                </a>
              );
            })
          ) : (
            <a
              href="tel:192"
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 min-h-[56px] text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 px-4 shadow-md"
            >
              <Phone className="w-5 h-5 fill-current" />
              <span>Ligar para o SAMU 192 (Serviço de Emergência)</span>
            </a>
          )}
        </div>

        <footer className="text-center py-6">
          <p className="text-xs text-stone-500 font-medium">
            Dados de emergência públicos protegidos (LGPD) • SOSqr
          </p>
        </footer>
      </main>
    </div>
  );
};

export default EmergencyProfilePage;
