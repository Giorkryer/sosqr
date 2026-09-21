import type { FC, HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'rose' | 'emerald' | 'stone' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'stone',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-colors';

  const variants = {
    teal: 'bg-teal-50 text-teal-800 border border-teal-700/20',
    rose: 'bg-rose-50 text-rose-600 border border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    stone: 'bg-stone-100 text-stone-900 border border-stone-200',
    outline: 'bg-transparent text-stone-600 border-2 border-stone-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};
