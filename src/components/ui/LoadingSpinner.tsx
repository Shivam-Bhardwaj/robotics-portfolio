import React from 'react';
import { motion } from 'framer-motion';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'robotics' | 'dots' | 'pulse';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  switch (variant) {
    case 'robotics':
      return (
        <div className={`${baseClasses} relative`}>
          <motion.div
            className="absolute inset-0 border-2 border-electric/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
          />
          <motion.div
            className="absolute inset-0 border-2 border-transparent border-t-electric rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
          />
          <motion.div
            className="absolute inset-1 border border-neon/50 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" as const }}
          />
        </div>
      );

    case 'dots':
      return (
        <div className={`flex items-center justify-center space-x-1 ${className}`}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`bg-brand-primary rounded-full ${sizeClasses[size].split(' ')[0].replace('w-', 'w-').replace('h-', 'h-').replace(/\d+/, (match) => String(Math.ceil(parseInt(match) / 3)))}`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      );

    case 'pulse':
      return (
        <motion.div
          className={`${baseClasses} bg-brand-primary rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
      );

    default:
      return (
        <motion.div
          className={`${baseClasses} border-2 border-gray-300 border-t-brand-primary rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
        />
      );
  }
};

export default LoadingSpinner;