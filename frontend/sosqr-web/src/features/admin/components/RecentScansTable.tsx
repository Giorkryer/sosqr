import { useState, useMemo, type FC } from 'react';
import { Search, Clock, ShieldAlert, ExternalLink, Inbox } from 'lucide-react';
import type { ScanLogItem } from '../../../types/admin';

interface RecentScansTableProps {
  scans: ScanLogItem[];
  loading?: boolean;
}

const formatDateTime = (isoString: string): string => {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
};

/**
 * Tabela de auditoria dos últimos acessos a perfis públicos de emergência.
 * Inclui campo de busca em tempo real por titular e formatação humanizada.
 */
export const RecentScansTable: FC<RecentScansTableProps> = ({ scans, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScans = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return scans;

    return scans.filter((scan) =>
      scan.patient_name?.toLowerCase().includes(query) ||
      scan.ip_address?.includes(query) ||
      scan.user_agent?.toLowerCase().includes(query)
    );
  }, [scans, searchTerm]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
      {/* Barra de Ferramentas / Cabeçalho da Tabela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-700" />
            Histórico de Escaneamentos Recentes
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Últimos 50 acessos a fichas de emergência auditados pelo sistema
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do titular..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
            aria-label="Buscar escaneamentos por titular"
          />
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-[11px] font-bold uppercase text-stone-500 bg-stone-50/70">
              <th className="py-3 px-4 rounded-l-xl">Titular / Pessoa</th>
              <th className="py-3 px-4">Data e Hora</th>
              <th className="py-3 px-4">IP Mascarado</th>
              <th className="py-3 px-4">Dispositivo / Navegador</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-800">
            {loading ? (
              // Skeleton Loader Rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="py-3.5 px-4">
                    <div className="h-4 bg-stone-100 rounded-md w-36" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 bg-stone-100 rounded-md w-28" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 bg-stone-100 rounded-md w-24" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 bg-stone-100 rounded-md w-40" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-4 bg-stone-100 rounded-md w-12 ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredScans.length > 0 ? (
              filteredScans.map((scan) => {
                const isDeactivated = scan.patient_name === 'Perfil Desativado';

                return (
                  <tr
                    key={scan.id}
                    className="hover:bg-stone-50/60 transition-colors"
                  >
                    {/* Titular */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {isDeactivated && (
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span
                          className={`font-bold ${
                            isDeactivated ? 'text-stone-500 italic' : 'text-stone-900'
                          }`}
                        >
                          {scan.patient_name}
                        </span>
                      </div>
                    </td>

                    {/* Data e Hora */}
                    <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                      {formatDateTime(scan.scanned_at)}
                    </td>

                    {/* IP Mascarado */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-teal-800 font-semibold whitespace-nowrap">
                      {scan.ip_address || '***.***'}
                    </td>

                    {/* Dispositivo / Navegador */}
                    <td
                      className="py-3.5 px-4 text-stone-600 max-w-[260px] truncate"
                      title={scan.user_agent}
                    >
                      {scan.user_agent || 'Desconhecido'}
                    </td>

                    {/* Ação */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {scan.public_token ? (
                        <a
                          href={`/emergency/${scan.public_token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold text-[11px] hover:underline"
                          title="Abrir ficha pública de socorro"
                        >
                          <span>Ver ficha</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-stone-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              // Estado Vazio
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-stone-400 space-y-2">
                    <Inbox className="w-8 h-8 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-stone-600">
                      {searchTerm
                        ? `Nenhum escaneamento encontrado para "${searchTerm}"`
                        : 'Nenhum escaneamento registrado no sistema até o momento.'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-teal-700 hover:text-teal-900 font-bold underline"
                      >
                        Limpar busca
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScansTable;
