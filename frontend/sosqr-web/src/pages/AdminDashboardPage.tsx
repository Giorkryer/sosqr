import { useState, useEffect, type FC } from 'react';
import { ShieldCheck, Users, QrCode, Search, Clock, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

interface AdminScan {
  id: number;
  patient_id: number;
  patient_name: string;
  public_token: string;
  ip_address: string;
  user_agent: string;
  scanned_at: string;
}

interface AdminDashboardData {
  kpis: {
    total_patients: number;
    total_scans: number;
    total_caregivers: number;
  };
  recent_scans: AdminScan[];
}

const DEMO_ADMIN_DATA: AdminDashboardData = {
  kpis: {
    total_patients: 128,
    total_scans: 1450,
    total_caregivers: 94,
  },
  recent_scans: [
    {
      id: 542,
      patient_id: 1,
      patient_name: 'Maria Francisca dos Santos',
      public_token: 'cb11872a-8338-4119-8ca6-f14f7b77aace',
      ip_address: '191.209.45.12',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)',
      scanned_at: '2026-09-21T08:15:30.000Z',
    },
    {
      id: 541,
      patient_id: 8,
      patient_name: 'Antônio Carlos Ferreira',
      public_token: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      ip_address: '187.12.34.56',
      user_agent: 'Mozilla/5.0 (Linux; Android 14; SM-G998B)',
      scanned_at: '2026-09-20T19:42:10.000Z',
    },
    {
      id: 540,
      patient_id: 3,
      patient_name: 'Helena Ribeiro de Souza',
      public_token: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ip_address: '200.189.112.45',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      scanned_at: '2026-09-20T14:10:05.000Z',
    },
  ],
};

const formatDateBR = (isoStr: string) => {
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
};

export const AdminDashboardPage: FC = () => {
  const [data, setData] = useState<AdminDashboardData>(DEMO_ADMIN_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<AdminDashboardData>('/admin/dashboard')
      .then((res) => {
        if (res.data && res.data.kpis) {
          setData(res.data);
        } else {
          setData(DEMO_ADMIN_DATA);
        }
      })
      .catch(() => {
        setData(DEMO_ADMIN_DATA);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredScans = data.recent_scans.filter((scan) => {
    const q = searchTerm.toLowerCase();
    return (
      scan.patient_name.toLowerCase().includes(q) ||
      scan.public_token.toLowerCase().includes(q) ||
      scan.ip_address.includes(q)
    );
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Painel Administrativo SOSqr
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Monitoramento global de perfis, leituras de emergência e auditoria de acessos
            </p>
          </div>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Total de Perfis Cadastrados */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
              Total de Perfis Cadastrados
            </span>
            <span className="text-3xl font-black text-stone-900 mt-1 block">
              {loading ? '...' : data.kpis.total_patients}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 mt-1 inline-block">
              Perfis de socorro ativos
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* KPI 2: Total de Leituras QR Code */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
              Total de Leituras QR Code
            </span>
            <span className="text-3xl font-black text-stone-900 mt-1 block">
              {loading ? '...' : data.kpis.total_scans}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 mt-1 inline-block">
              Acessos auditados em scan_logs
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <QrCode className="w-7 h-7" />
          </div>
        </div>

        {/* KPI 3: Total de Cuidadores Registrados */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
              Total de Cuidadores Registrados
            </span>
            <span className="text-3xl font-black text-stone-900 mt-1 block">
              {loading ? '...' : data.kpis.total_caregivers}
            </span>
            <span className="text-[11px] font-bold text-stone-600 mt-1 inline-block">
              Contas Clerk vinculadas
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Tabela de Auditoria dos Últimos Acessos */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-700" />
              Histórico de Escaneamentos Recentes
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Últimos 50 acessos a fichas públicas de emergência registrados no sistema
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, token ou IP..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-black uppercase text-stone-500 bg-stone-50/50">
                <th className="py-3 px-4">Pessoa / Titular</th>
                <th className="py-3 px-4">Token UUID</th>
                <th className="py-3 px-4">Endereço IP</th>
                <th className="py-3 px-4">Dispositivo / User-Agent</th>
                <th className="py-3 px-4">Data e Hora</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-800">
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {scan.patient_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                      {scan.public_token.slice(0, 13)}...
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-teal-800 font-bold">
                      {scan.ip_address}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 max-w-[220px] truncate" title={scan.user_agent}>
                      {scan.user_agent}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                      {formatDateBR(scan.scanned_at)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`/emergency/${scan.public_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold text-[11px]"
                        title="Abrir ficha pública"
                      >
                        <span>Ver</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500 text-xs">
                    Nenhum escaneamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
