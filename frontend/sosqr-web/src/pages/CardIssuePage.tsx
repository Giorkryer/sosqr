import { useState, useEffect, type FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  ArrowLeft,
  Phone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Loader2,
  LayoutGrid,
} from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { EmergencyCardDocument, type CardPatientData } from '../features/card-issue/pdf/EmergencyCardDocument';
import { api } from '../services/api';

const DEMO_PATIENT: CardPatientData = {
  id: 1,
  public_token: 'a8f9-31bc-4119-8ca6-f14f7b77aace',
  display_name: 'Dona Maria',
  full_name: 'MARIA DE SOUZA SILVA',
  birth_date: '1944-05-12',
  age: 82,
  gender: 'Feminino',
  blood_type: 'O+',
  allergies: ['Penicilina e Dipirona'],
  chronic_conditions: ['Hipertensão', 'Diabetes Tipo 2'],
  medications_in_use: ['Rivaroxabana (Xarelto)'],
  emergency_contacts: [
    {
      name: 'Carlos',
      phone_number: '(85) 99123-4567',
      relationship: 'Filho',
      is_primary: true,
    },
  ],
};

const formatDateBR = (dateStr?: string): string => {
  if (!dateStr) return '12/05/1944';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const CardIssuePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<CardPatientData>(DEMO_PATIENT);
  const [loading, setLoading] = useState(Boolean(id));
  const [zoomScale, setZoomScale] = useState(1);
  const [cardSideView, setCardSideView] = useState<'both' | 'front' | 'back'>('both');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get<CardPatientData>(`/patients/${id}`)
        .then((res) => {
          if (res.data) {
            setPatient({
              ...res.data,
              full_name: res.data.full_name || res.data.display_name,
            });
          }
        })
        .catch(() => {
          setPatient(DEMO_PATIENT);
        })
        .finally(() => setLoading(false));
    } else {
      setPatient(DEMO_PATIENT);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = document.getElementById('qr-hidden-canvas') as HTMLCanvasElement;
      if (canvas) {
        setQrDataUrl(canvas.toDataURL('image/png'));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [patient.public_token]);

  const primaryContact =
    patient.emergency_contacts?.find((c) => c.is_primary) ||
    patient.emergency_contacts?.[0] || {
      name: 'Carlos',
      phone_number: '(85) 99123-4567',
      relationship: 'Filho',
      is_primary: true,
    };

  const publicUrl = `${window.location.origin}/emergency/${patient.public_token}`;
  const tokenShort = patient.public_token ? patient.public_token.slice(0, 9) : 'a8f9-31bc';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-10 h-10 text-teal-700 animate-spin" />
        <p className="text-stone-600 font-bold text-sm">Carregando dados para emissão do cartão...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans">
      <div className="hidden">
        <QRCodeCanvas
          id="qr-hidden-canvas"
          value={publicUrl}
          size={300}
          level="H"
          includeMargin
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Voltar para o Painel"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Emissão de Cartão Físico: {patient.display_name || patient.full_name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1 ml-10">
            Formato oficial CR80 (85,60 mm × 53,98 mm) com cantos arredondados para impressão em PVC ou papel plastificado.
          </p>
        </div>

        <div className="shrink-0">
          <PDFDownloadLink
            document={<EmergencyCardDocument patient={patient} qrDataUrl={qrDataUrl} />}
            fileName={`Cartao_SOSqr_${patient.display_name || 'Perfil'}_CR80.pdf`}
            className="w-full sm:w-auto bg-[#0B6651] hover:bg-[#084d3d] active:bg-[#063b2f] text-white rounded-xl px-5 py-3 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-sm hover:shadow transition-all"
          >
            {({ loading: pdfLoading }) => (
              <>
                {pdfLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>{pdfLoading ? 'Gerando PDF...' : 'Baixar PDF para Impressão'}</span>
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white rounded-2xl md:rounded-3xl border border-stone-200 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900">Cardholder Info</h2>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-700/20 px-2 py-0.5 rounded-full">
              CR80 Oficial
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 block">Nome</label>
            <input
              type="text"
              readOnly
              value={patient.full_name || patient.display_name}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 select-all cursor-default"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 block">Tipo Sanguíneo</label>
            <div className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">{patient.blood_type || 'O+'}</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Alerta Médico
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 block">Emergency Contact</label>
            <div className="px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs font-bold text-stone-900">
              <div className="truncate mr-2">
                <span>{primaryContact.phone_number}</span>
                <span className="text-stone-500 text-[11px] block font-medium truncate">
                  ({primaryContact.name} - {primaryContact.relationship})
                </span>
              </div>
              <Phone className="w-4 h-4 text-emerald-600 shrink-0 fill-emerald-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600 block">Opções de Design</label>
            <select
              value="standard"
              disabled
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 cursor-default"
            >
              <option value="standard">Padrão Oficial CR80 (PVC / Cartão)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between text-center relative">
              <div className="absolute left-6 right-6 top-3 h-0.5 bg-emerald-200 -z-0" />

              <div className="flex flex-col items-center z-10 space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-stone-700">Visualização</span>
              </div>

              <div className="flex flex-col items-center z-10 space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-stone-700">Configurações</span>
              </div>

              <div className="flex flex-col items-center z-10 space-y-1">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-[#0B6651] text-[#0B6651] flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
                <span className="text-[10px] font-bold text-[#0B6651]">Download PDF</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#e2e4e9] rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[540px] relative shadow-inner space-y-8 overflow-hidden">
          <div
            className="flex flex-col xl:flex-row items-center justify-center gap-8 transition-transform duration-200"
            style={{ transform: `scale(${zoomScale})` }}
          >
            {(cardSideView === 'both' || cardSideView === 'front') && (
              <div className="space-y-2 text-center">
                <span className="text-xs font-black uppercase tracking-wider text-stone-600 block">
                  Front Card (Frente)
                </span>

                <div className="w-[340px] sm:w-[380px] md:w-[400px] aspect-[85.6/53.98] bg-[#F3EFE6] rounded-2xl sm:rounded-3xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col justify-between text-left select-none relative group">
                  <div className="bg-[#0B6651] text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                        <HeartHandshake className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-black text-xs sm:text-sm tracking-tight text-white">
                        SOSqr
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-[9px] sm:text-[10px] tracking-wider text-white uppercase block leading-tight">
                        EMERGÊNCIA MÉDICA
                      </span>
                      <span className="text-[7px] sm:text-[8px] text-teal-100 font-medium block leading-tight">
                        Escaneie para dados vitais
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between gap-3 flex-1">
                    <div className="space-y-1 flex-1 pr-2">
                      <h3 className="font-black text-sm sm:text-base md:text-lg text-stone-900 uppercase leading-tight tracking-tight line-clamp-2">
                        {patient.full_name || patient.display_name}
                      </h3>

                      <p className="text-[11px] sm:text-xs font-bold text-stone-800">
                        Nasc: {formatDateBR(patient.birth_date)}
                      </p>

                      <p className="text-[11px] sm:text-xs font-black text-stone-900 flex items-center gap-1">
                        <span>Sangue: {patient.blood_type || 'O+'}</span>
                        <AlertTriangle className="w-3 h-3 text-amber-600 fill-amber-600" />
                      </p>

                      <div className="pt-2">
                        <span className="text-[8px] sm:text-[9px] text-stone-500 block leading-tight">
                          Acesso rápido via link:
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-black text-[#0B6651] underline block truncate max-w-[170px]">
                          sosqr.com.br/{tokenShort}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-stone-300 shadow-xs flex items-center justify-center shrink-0">
                      <QRCodeSVG
                        value={publicUrl}
                        size={88}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(cardSideView === 'both' || cardSideView === 'back') && (
              <div className="space-y-2 text-center">
                <span className="text-xs font-black uppercase tracking-wider text-stone-600 block">
                  Back Card (Verso)
                </span>

                <div className="w-[340px] sm:w-[380px] md:w-[400px] aspect-[85.6/53.98] bg-[#F3EFE6] rounded-2xl sm:rounded-3xl border border-stone-300 shadow-2xl overflow-hidden flex flex-col justify-between text-center select-none relative group">
                  <div className="bg-[#0B6651] text-white py-2.5 text-center">
                    <span className="font-black text-xs sm:text-sm tracking-widest text-white uppercase">
                      MAIS INFORMAÇÕES
                    </span>
                  </div>

                  <div className="p-4 flex flex-col items-center justify-center flex-1 space-y-2">
                    <div className="bg-white p-2 rounded-xl border border-stone-300 shadow-xs">
                      <QRCodeSVG
                        value={publicUrl}
                        size={82}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <span className="font-black text-[9px] sm:text-[10px] text-stone-900 tracking-wider uppercase block leading-tight">
                        APONTE A CÂMERA DO CELULAR
                      </span>
                      <span className="font-black text-[9px] sm:text-[10px] text-stone-900 tracking-wider uppercase block leading-tight">
                        PARA VER A FICHA MÉDICA
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="font-black text-[8.5px] sm:text-[9.5px] text-stone-900 uppercase tracking-tight block">
                        CONTATO DE EMERGÊNCIA: {primaryContact.phone_number} ({primaryContact.name} - {primaryContact.relationship})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:px-4 sm:py-2.5 border border-stone-300 shadow-lg flex items-center gap-3 text-xs font-bold text-stone-700">
            <span className="hidden sm:inline text-stone-500 font-semibold border-r border-stone-200 pr-3">
              Ajustar Visualização
            </span>

            <button
              onClick={() => setZoomScale((prev) => Math.max(0.7, prev - 0.1))}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
              title="Reduzir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono w-10 text-center">{Math.round(zoomScale * 100)}%</span>

            <button
              onClick={() => setZoomScale((prev) => Math.min(1.3, prev + 0.1))}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoomScale(1)}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900 transition-colors border-l border-stone-200 pl-2.5"
              title="Resetar escala original"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (cardSideView === 'both') setCardSideView('front');
                else if (cardSideView === 'front') setCardSideView('back');
                else setCardSideView('both');
              }}
              className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 hover:text-stone-900 transition-colors"
              title="Alternar modo de exibição (Ambos / Frente / Verso)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardIssuePage;
