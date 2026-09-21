import { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-base font-semibold text-stone-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 min-h-[48px] text-base rounded-xl border-2 transition-colors bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none ${
            error
              ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
              : 'border-stone-200 hover:border-stone-300 focus:border-teal-700 focus:ring-1 focus:ring-teal-700'
          } disabled:bg-stone-100 disabled:opacity-60 ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-sm font-semibold text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-stone-600">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
