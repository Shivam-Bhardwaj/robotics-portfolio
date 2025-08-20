import React from 'react';
import { motion } from 'framer-motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'robotics';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helper, 
    icon, 
    iconPosition = 'left',
    variant = 'default',
    className = '', 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses = [
      'w-full rounded-lg border transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400'
    ];

    const variantClasses = {
      default: [
        'border-gray-300 bg-white text-gray-900',
        'focus:border-brand-primary focus:ring-brand-primary',
        error ? 'border-error focus:border-error focus:ring-error' : ''
      ].filter(Boolean),
      robotics: [
        'border-electric/30 bg-gray-900 text-white',
        'focus:border-electric focus:ring-electric',
        'placeholder:text-gray-400',
        error ? 'border-error focus:border-error focus:ring-error' : ''
      ].filter(Boolean)
    };

    const sizeClasses = icon ? 
      (iconPosition === 'left' ? 'pl-10 pr-4 py-3' : 'pl-4 pr-10 py-3') : 
      'px-4 py-3';

    const inputClasses = [
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses,
      className
    ].join(' ');

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <motion.input
            ref={ref}
            id={inputId}
            className={inputClasses}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-error text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
        
        {helper && !error && (
          <p className="text-gray-500 text-sm mt-1">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;