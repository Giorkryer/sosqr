import { type ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emergency' | 'action' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variants = {
      primary:
        'bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-700 shadow-sm',
      emergency:
        'bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500 shadow-sm',
      action:
        'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 shadow-sm',
      outline:
        'border-2 border-stone-200 bg-white text-stone-900 hover:bg-stone-100 hover:border-stone-300 focus-visible:ring-teal-700',
      ghost:
        'text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus-visible:ring-teal-700',
    };

    // Altura mínima de 44px-48px para conformidade WCAG e facilidade de toque universal
    const sizes = {
      sm: 'text-sm px-3.5 py-2 min-h-[40px] gap-1.5',
      md: 'text-base px-5 py-3 min-h-[48px] gap-2 font-semibold',
      lg: 'text-lg px-6 py-3.5 min-h-[56px] gap-2.5 font-bold',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
