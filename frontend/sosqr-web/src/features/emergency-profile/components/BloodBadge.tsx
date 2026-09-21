import type { FC } from 'react';
import { Droplet } from 'lucide-react';
import type { BloodType } from '../../../types';

interface BloodBadgeProps {
  bloodType: BloodType;
  size?: 'md' | 'lg';
}

export const BloodBadge: FC<BloodBadgeProps> = ({ bloodType, size = 'lg' }) => {
  const isLarge = size === 'lg';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 font-extrabold shadow-sm ${
        isLarge ? 'px-4 py-3 text-2xl' : 'px-3 py-1.5 text-lg'
      }`}
      aria-label={`Tipo Sanguíneo: ${bloodType}`}
    >
      <Droplet className={`${isLarge ? 'w-7 h-7' : 'w-5 h-5'} fill-rose-500 text-rose-500`} />
      <span className="tracking-wide">{bloodType}</span>
    </div>
  );
};
