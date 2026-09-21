import type { FC } from 'react';
import { AlertTriangle, AlertCircle, Cpu } from 'lucide-react';

interface MedicalAlertBoxProps {
  title: string;
  items: string[];
  type?: 'allergy' | 'condition' | 'device';
}

export const MedicalAlertBox: FC<MedicalAlertBoxProps> = ({
  title,
  items,
  type = 'condition',
}) => {
  if (!items || items.length === 0) return null;

  const styles = {
    allergy: {
      container: 'bg-rose-50 border-2 border-rose-200 text-stone-900',
      badge: 'bg-rose-500 text-white font-bold',
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
    },
    condition: {
      container: 'bg-stone-100 border border-stone-200 text-stone-900',
      badge: 'bg-stone-900 text-white font-semibold',
      icon: <AlertCircle className="w-5 h-5 text-teal-700" />,
    },
    device: {
      container: 'bg-teal-50 border border-teal-700/20 text-stone-900',
      badge: 'bg-teal-700 text-white font-semibold',
      icon: <Cpu className="w-5 h-5 text-teal-700" />,
    },
  }[type];

  return (
    <div className={`rounded-2xl p-5 ${styles.container}`}>
      <div className="flex items-center gap-2 mb-3">
        {styles.icon}
        <h3 className="text-base font-bold text-stone-900 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span
            key={idx}
            className={`px-3.5 py-1.5 rounded-xl text-sm ${styles.badge} shadow-xs`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
