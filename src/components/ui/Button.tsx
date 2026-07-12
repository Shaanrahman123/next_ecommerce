'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'premium'
  | 'premium-soft'
  | 'premium-outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  iconOnly?: boolean;
}

const PREMIUM_VARIANTS: ButtonVariant[] = ['premium', 'premium-soft', 'premium-outline'];

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

/** Bandhani pattern — matches footer, tuned for button scale */
function PremiumDarkPattern() {
  return (
    <>
      <div
        className="absolute inset-0 text-amber-200 opacity-[0.11] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1.2px, transparent 1.2px)',
          backgroundSize: '14px 14px',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none text-amber-100"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 0.8px, transparent 0.8px)',
          backgroundSize: '7px 7px',
          backgroundPosition: '3px 3px',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-amber-400/[0.06] via-transparent to-amber-900/[0.08] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none"
        aria-hidden
      />
    </>
  );
}

function PremiumButton({
  children,
  variant,
  size,
  fullWidth,
  isLoading,
  iconOnly,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDark = variant === 'premium';
  const isSoft = variant === 'premium-soft';
  const isOutline = variant === 'premium-outline';

  const sizeStyles = {
    sm: iconOnly ? 'p-2 min-w-[2.25rem]' : 'px-4 py-2 text-xs',
    md: iconOnly ? 'p-2.5 min-w-[2.75rem]' : 'px-5 py-2.5 text-sm',
    lg: iconOnly ? 'p-3 min-w-[3rem]' : 'px-6 py-3 text-sm',
    xl: iconOnly ? 'p-4 min-w-[3.5rem]' : 'px-8 py-4 text-base',
  };

  const innerBg = isDark
    ? 'bg-linear-to-r from-[#1a1209] via-heading to-[#1a1209] text-white'
    : isSoft
      ? 'bg-white text-heading hover:bg-amber-50/40'
      : 'bg-white text-heading hover:bg-amber-50/60';

  const borderWrap = isDark
    ? 'from-amber-500/80 via-amber-400 to-amber-600/70'
    : isSoft
      ? 'from-amber-200/80 via-amber-300/60 to-amber-200/80'
      : 'from-amber-300/70 via-amber-400/50 to-amber-300/70';

  const shadow = isDark
    ? 'shadow-[0_6px_24px_rgba(0,0,0,0.25),0_2px_10px_rgba(180,83,9,0.2)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.3),0_4px_14px_rgba(180,83,9,0.28)]'
    : isSoft
      ? 'shadow-sm hover:shadow-md hover:shadow-amber-900/8'
      : 'shadow-sm hover:shadow-md hover:shadow-amber-900/10';

  return (
    <button
      className={`
        group relative inline-flex items-center justify-center font-semibold tracking-wide
        rounded-xl p-px bg-linear-to-br ${borderWrap}
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${isDark ? 'hover:-translate-y-0.5 active:translate-y-0' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${shadow}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      <span
        className={`
          relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[11px]
          transition-colors duration-300
          ${sizeStyles[size ?? 'md']}
          ${innerBg}
          ${iconOnly ? 'aspect-square' : ''}
        `}
      >
        {isDark && <PremiumDarkPattern />}

        {isDark && (
          <span
            className="absolute inset-0 bg-linear-to-t from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden
          />
        )}

        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? <LoadingSpinner /> : children}
        </span>
      </span>
    </button>
  );
}

function StandardButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[var(--theme-primary)] text-[var(--theme-secondary)] hover:bg-[var(--theme-accent)] focus:ring-[var(--theme-primary)]',
    secondary:
      'bg-[var(--theme-secondary)] text-[var(--theme-primary)] border border-[var(--theme-border)] hover:bg-[var(--theme-hover)] focus:ring-[var(--theme-primary)]',
    outline:
      'bg-transparent text-[var(--theme-primary)] border-2 border-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-[var(--theme-secondary)] focus:ring-[var(--theme-primary)]',
    ghost: 'bg-transparent text-[var(--theme-primary)] hover:bg-[var(--theme-hover)] focus:ring-[var(--theme-primary)]',
    premium: '',
    'premium-soft': '',
    'premium-outline': '',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-small rounded-lg',
    md: 'px-4 py-2 text-body rounded-lg',
    lg: 'px-6 py-2.5 text-body rounded-lg',
    xl: 'px-8 py-4 text-base rounded-xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
}

export default function Button(props: ButtonProps) {
  const { variant = 'primary' } = props;

  if (PREMIUM_VARIANTS.includes(variant)) {
    return <PremiumButton {...props} variant={variant} />;
  }

  return <StandardButton {...props} variant={variant} />;
}
