import { useState, useEffect, useCallback, type FC } from 'react';
import {
  ShieldCheck,
  Users,
  QrCode,
  HeartHandshake,
  Activity,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import type { AdminDashboardData } from '../types/admin';
import { AdminKpiCard } from '../features/admin/components/AdminKpiCard';
import { RecentScansTable } from '../features/admin/components/RecentScansTable';

/**
 * Orquestrador da Página do Painel Administrativo.
 * Carrega dados analíticos globais do SOSqr via GET /api/v1/admin/dashboard.
 */
export const AdminDashboardPage: FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<AdminDashboardData>('/admin/dashboard');

      if (response.data) {
        setData(response.data);
      }
    } catch (err: unknown) {
      console.error('[AdminDashboardPage] Falha ao carregar dashboard:', err);
      const apiError = err as {
        customMessage?: string;
        response?: { data?: { error?: string } };
      };

      setError(
        apiError.customMessage ||
          apiError.response?.data?.error ||
          'Não foi possível estabelecer conexão com o serviço de administração.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Formata a data atual em português com inicial maiúscula
  const rawDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const currentDateFormatted = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Cabeçalho do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Painel Administrativo
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              Modo Administrador
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            {currentDateFormatted} &bull; Monitoramento global do ecossistema SOSqr
          </p>
        </div>

        <div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 active:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all shadow-2xs disabled:opacity-60 cursor-pointer"
            title="Recarregar dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-700' : ''}`} />
            <span>Atualizar dados</span>
          </button>
        </div>
      </div>

      {/* Banner de Erro com Botão de Reconexão */}
      {error && !loading && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors w-fit"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Grid de 4 Cards Métricos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Perfis Cadastrados */}
        <AdminKpiCard
          label="Perfis Cadastrados"
          value={data?.total_patients ?? data?.kpis?.total_patients ?? 0}
          icon={Users}
          badgeText="Perfis de socorro"
          loading={loading}
          colorScheme="teal"
        />

        {/* Card 2: Total de Leituras QR */}
        <AdminKpiCard
          label="Total de Scans"
          value={data?.total_scans ?? data?.kpis?.total_scans ?? 0}
          icon={QrCode}
          badgeText="Auditoria de leituras"
          loading={loading}
          colorScheme="rose"
        />

        {/* Card 3: Total de Cuidadores */}
        <AdminKpiCard
          label="Total de Cuidadores"
          value={data?.total_caregivers ?? data?.kpis?.total_caregivers ?? 0}
          icon={HeartHandshake}
          badgeText="Contas vinculadas"
          loading={loading}
          colorScheme="amber"
        />

        {/* Card 4: Scans Hoje */}
        <AdminKpiCard
          label="Scans Hoje"
          value={data?.scans_today ?? data?.kpis?.scans_today ?? 0}
          icon={Activity}
          badgeText="Acessos nas 24h"
          loading={loading}
          colorScheme="emerald"
        />
      </div>

      {/* Tabela de Auditoria dos Últimos Escaneamentos */}
      <RecentScansTable
        scans={data?.recent_scans || []}
        loading={loading}
      />
    </div>
  );
};

export default AdminDashboardPage;
