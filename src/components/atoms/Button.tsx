import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-bold rounded-lg border-2 transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && [
          'bg-gradient-to-br from-parchment-400 to-parchment-500',
          'border-brown-500 text-brown-700',
          'shadow-md hover:shadow-lg',
          'hover:enabled:scale-[1.03] hover:enabled:from-parchment-300 hover:enabled:to-parchment-400',
        ],
        variant === 'ghost' && [
          'bg-brown-500/15 border-brown-500 text-brown-700',
          'hover:enabled:bg-brown-500/25',
        ],
        size === 'sm' && 'px-3 py-1.5 text-[13px]',
        size === 'md' && 'px-4 py-2 text-[14px]',
        size === 'lg' && 'px-6 py-3 text-[16px]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
