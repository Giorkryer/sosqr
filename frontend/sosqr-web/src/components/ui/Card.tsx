import type { FC, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'alert' | 'highlight';
}

export const Card: FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200 overflow-hidden';

  const variants = {
    default: 'bg-white border border-stone-200 shadow-sm',
    elevated: 'bg-white border border-stone-200 shadow-md hover:shadow-lg',
    alert: 'bg-rose-50 border-2 border-rose-200 text-stone-900',
    highlight: 'bg-teal-50 border-2 border-teal-700/20 text-stone-900',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-6 border-b border-stone-200/80 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`p-6 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);
