import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
  className?: string;
  Icon?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    children, 
    className = '', 
    Icon,
    ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-brand-primary text-white border-transparent hover:bg-brand-primary-dark focus:ring-brand-primary',
    secondary: 'bg-white text-brand-text-primary border-brand-background-strong hover:bg-brand-background-soft focus:ring-brand-primary',
    danger: 'bg-brand-error text-white border-transparent hover:bg-red-700 focus:ring-brand-error',
    ghost: 'bg-transparent text-brand-text-secondary border-transparent hover:bg-brand-background-soft focus:ring-brand-primary'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2 -ml-1" />}
      {children}
    </button>
  );
};