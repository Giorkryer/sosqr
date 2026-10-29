import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface AdminKpiCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  badgeText?: string;
  loading?: boolean;
  colorScheme?: 'teal' | 'rose' | 'amber' | 'blue' | 'emerald';
}

const colorStyles: Record<
  NonNullable<AdminKpiCardProps['colorScheme']>,
  { iconBg: string; iconColor: string; badgeColor: string }
> = {
  teal: {
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-700',
    badgeColor: 'text-teal-800 bg-teal-50/80',
  },
  rose: {
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badgeColor: 'text-rose-700 bg-rose-50/80',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    badgeColor: 'text-amber-800 bg-amber-50/80',
  },
  blue: {
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-700',
    badgeColor: 'text-sky-800 bg-sky-50/80',
  },
  emerald: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-700',
    badgeColor: 'text-emerald-800 bg-emerald-50/80',
  },
};

/**
 * Card métrico com a identidade visual "Cuidado Suave" do SOSqr:
 * Fundo branco, borda stone-200, cantos rounded-2xl, sombra suave e destaque tipográfico.
 */
export const AdminKpiCard: FC<AdminKpiCardProps> = ({
  label,
  value,
  icon: Icon,
  description,
  badgeText,
  loading = false,
  colorScheme = 'teal',
}) => {
  const styles = colorStyles[colorScheme] || colorStyles.teal;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex-1 pr-4">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
          {label}
        </span>

        {loading ? (
          <div className="mt-2 space-y-2">
            <div className="h-8 w-20 bg-stone-100 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-stone-100 rounded-md animate-pulse" />
          </div>
        ) : (
          <>
            <span className="text-3xl font-bold text-stone-900 mt-1 block tracking-tight">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </span>

            {badgeText && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md mt-1.5 inline-block ${styles.badgeColor}`}
              >
                {badgeText}
              </span>
            )}

            {description && !badgeText && (
              <p className="text-xs text-stone-500 mt-1 font-medium">
                {description}
              </p>
            )}
          </>
        )}
      </div>

      <div
        className={`w-14 h-14 rounded-2xl ${styles.iconBg} ${styles.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
        aria-hidden="true"
      >
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};

export default AdminKpiCard;
