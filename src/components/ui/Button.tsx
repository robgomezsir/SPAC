'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const baseClasses = "group relative flex justify-center py-2 px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      default: "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:ring-blue-500",
      ghost: "border-transparent text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-500",
      destructive: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
