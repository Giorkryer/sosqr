import { useState, useEffect, type FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api';
import { DeletePatientModal, type PatientToDelete } from '../components/DeletePatientModal';
import { PatientCard } from '../features/patients/components/PatientCard';

export interface EmergencyContact {
  id?: number;
  name: string;
  phone_number: string;
  relationship: string;
  is_primary?: boolean;
}

export interface Patient {
  id: number;
  clerk_user_id?: string;
  public_token: string;
  display_name: string;
  full_name: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  blood_type: string;
  avatar_url?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  medications_in_use?: string[];
  medical_devices?: string[];
  health_insurance_name?: string;
  health_insurance_number?: string;
  medical_notes?: string;
  emergency_contacts?: EmergencyContact[];
  last_scan?: {
    date?: string;
    scanned_at?: string;
    ip_address?: string;
    ip?: string;
  };
  created_at?: string;
  updated_at?: string;
}

const DEMO_PATIENTS: Patient[] = [
  {
    id: 1,
    public_token: 'cb11872a-8338-4119-8ca6-f14f7b77aace',
    display_name: 'Dona Francisca',
    full_name: 'Maria Francisca dos Santos',
    age: 74,
    birth_date: '1952-05-10',
    gender: 'Feminino',
    blood_type: 'O+',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    allergies: ['Penicilina e Dipirona'],
    chronic_conditions: ['Hipertensão Arterial', 'Diabetes Tipo 2 (Risco de choque)', 'Demência/Alzheimer (Desorientação)'],
    medications_in_use: ['Rivaroxabana (Xarelto)', 'Insulina'],
    medical_devices: ['Marcapasso Cardíaco (Não desfibrilar convencionalmente)', 'Prótese no fêmur'],
    medical_notes: 'Apresenta marcha instável com risco de quedas ao entardecer. Restrição hídrica moderada prescrita por cardiologista.',
    health_insurance_name: 'Unimed Fortaleza',
    health_insurance_number: '123456789-0',
    emergency_contacts: [
      { name: 'Carlos', phone_number: '(85) 99123-4567', relationship: 'Filho', is_primary: true },
      { name: 'Mariana', phone_number: '(85) 99234-5678', relationship: 'Filha', is_primary: false },
    ],
    last_scan: {
      date: '14/09/2026 09:12',
      scanned_at: '14/09/2026 09:12',
      ip_address: '191.209.45.12',
      ip: '191.209...',
    },
  },
];

export const DashboardPage: FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQrPatient, setSelectedQrPatient] = useState<Patient | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientToDelete | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    setLoading(true);
    api
      .get<Patient[]>('/patients')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPatients(res.data);
        } else {
          setPatients(DEMO_PATIENTS);
        }
      })
      .catch(() => {
        setPatients(DEMO_PATIENTS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/emergency/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300/80 text-emerald-950 font-bold text-sm flex items-center justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 p-1 rounded-lg hover:bg-emerald-100/60 transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Painel de Perfis
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-medium mt-0.5">
            Gestão de fichas vitais e cartões de emergência
          </p>
        </div>

        <Link to="/pacientes/novo" className="shrink-0">
          <button className="w-full sm:w-auto bg-[#0B6651] hover:bg-[#084d3d] active:bg-[#063b2f] text-white rounded-xl px-6 py-3.5 font-bold text-base flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all">
            <Plus className="w-5 h-5" />
            <span>+ Novo Perfil</span>
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl md:rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-stone-200" />
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-stone-200 rounded" />
                  <div className="h-4 w-24 bg-stone-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-36 bg-stone-200 rounded" />
              <div className="h-4 w-28 bg-stone-200 rounded" />
              <div className="h-4 w-64 bg-stone-200 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="h-10 w-24 bg-stone-200 rounded-xl" />
                <div className="h-10 w-36 bg-stone-200 rounded-xl" />
                <div className="h-10 w-28 bg-stone-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient as unknown as import('../features/patients/types').Patient}
              onOpenQr={(p) => setSelectedQrPatient(p as unknown as Patient)}
              onDelete={setPatientToDelete}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-stone-900">Alertas Recentes</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Sistema em monitoramento ativo" />
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-rose-950">
                  Escaneamento Emergencial Registrado
                </p>
                <p className="text-xs text-rose-800 mt-0.5">
                  Ficha de <strong>Maria Francisca</strong> acessada em 14/09/2026 às 09:12 (IP: 191.209.45.12).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-700/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-teal-950">
                  Alergias e Medicamentos Atualizados
                </p>
                <p className="text-xs text-teal-800 mt-0.5">
                  Alergia a Penicilina/Dipirona e uso de anticoagulante confirmados pelo cuidador.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-800">
                  Cartão Físico Pronto para Emissão
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  Versão em PDF de alta resolução disponível com padrão CR80.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-stone-900">Estatísticas de Uso</h3>
            <Activity className="w-5 h-5 text-teal-700" />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-2xl font-black text-stone-900 block">14</span>
              <span className="text-[11px] font-bold text-stone-600 uppercase">Leituras QR</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-2xl font-black text-emerald-600 block">&lt; 30s</span>
              <span className="text-[11px] font-bold text-stone-600 uppercase">Tempo Médio</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-2xl font-black text-teal-700 block">100%</span>
              <span className="text-[11px] font-bold text-stone-600 uppercase">Contatos OK</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block mb-3">
              Frequência de Acesso (Últimos 7 dias)
            </span>
            <div className="h-24 flex items-end justify-between gap-2 px-2">
              {[
                { day: 'Seg', val: 40 },
                { day: 'Ter', val: 25 },
                { day: 'Qua', val: 70 },
                { day: 'Qui', val: 45 },
                { day: 'Sex', val: 90 },
                { day: 'Sáb', val: 60 },
                { day: 'Dom', val: 80 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full bg-teal-700 hover:bg-teal-800 rounded-t-md transition-all duration-300 cursor-pointer"
                    style={{ height: `${item.val}%` }}
                    title={`${item.day}: ${Math.round(item.val / 10)} acessos`}
                  />
                  <span className="text-[10px] font-bold text-stone-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedQrPatient && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedQrPatient(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 relative border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQrPatient(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-stone-900">QR Code de Emergência</h3>
              <p className="text-xs text-stone-600 font-medium">
                {selectedQrPatient.full_name}
              </p>
            </div>

            <div className="flex justify-center p-5 bg-stone-50 rounded-2xl border-2 border-stone-200 shadow-inner">
              <QRCodeSVG
                value={`${window.location.origin}/emergency/${selectedQrPatient.public_token}`}
                size={210}
                level="H"
                includeMargin
              />
            </div>

            <div className="space-y-3">
              <div className="p-2.5 bg-stone-100 rounded-xl text-center">
                <span className="text-[10px] font-mono text-stone-600 select-all break-all">
                  {selectedQrPatient.public_token}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleCopyLink(selectedQrPatient.public_token)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? 'Copiado!' : 'Copiar Link'}</span>
                </button>

                <a
                  href={`/emergency/${selectedQrPatient.public_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Ficha</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeletePatientModal
        isOpen={Boolean(patientToDelete)}
        patient={patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onSuccess={(deletedId, patientName) => {
          setPatients((prev) => prev.filter((p) => p.id !== deletedId));
          setToastMessage(`O perfil de "${patientName}" foi excluído com sucesso.`);
        }}
      />
    </div>
  );
};

export default DashboardPage;
