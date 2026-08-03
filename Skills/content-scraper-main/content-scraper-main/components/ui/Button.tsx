import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon,
  className,
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-sm",
    outline: "border border-border text-text-main hover:bg-surface hover:border-primary/30 bg-transparent",
    ghost: "bg-transparent text-text-muted hover:text-primary hover:bg-primary/5",
  };

  return (
    <button 
      className={clsx(baseStyles, variants[variant], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon}
      {children}
    </button>
  );
};