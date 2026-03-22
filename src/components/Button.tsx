import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<string, string> = {
  primary: 'bg-tracker-primary text-white hover:bg-tracker-primary-hover active:scale-[0.97]',
  secondary: 'bg-tracker-surface text-tracker-text border border-tracker-border hover:bg-tracker-hover active:scale-[0.97]',
  ghost: 'text-tracker-muted hover:text-tracker-text hover:bg-tracker-hover active:scale-[0.97]',
  danger: 'bg-tracker-danger/10 text-tracker-danger hover:bg-tracker-danger/20 active:scale-[0.97]',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
  lg: 'px-5 py-2 text-sm',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-tracker-ring disabled:opacity-40 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
