import React from 'react';
import { motion } from 'framer-motion';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'robotics';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', animate = false, className = '', children, ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-full transition-all duration-200',
      'border'
    ];

    const variantClasses = {
      default: [
        'bg-gray-100 text-gray-800 border-gray-200',
        'hover:bg-gray-200'
      ],
      primary: [
        'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
        'hover:bg-brand-primary/20'
      ],
      secondary: [
        'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
        'hover:bg-brand-secondary/20'
      ],
      success: [
        'bg-success/10 text-success border-success/20',
        'hover:bg-success/20'
      ],
      warning: [
        'bg-warning/10 text-warning border-warning/20',
        'hover:bg-warning/20'
      ],
      error: [
        'bg-error/10 text-error border-error/20',
        'hover:bg-error/20'
      ],
      robotics: [
        'bg-gradient-to-r from-electric/10 to-neon/10',
        'text-electric border-electric/30 font-robotics',
        'hover:from-electric/20 hover:to-neon/20',
        'shadow-sm hover:shadow-md hover:shadow-electric/20'
      ]
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    };

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      className
    ].join(' ');

    const badgeContent = (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );

    if (animate) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.2 
          }}
        >
          {badgeContent}
        </motion.span>
      );
    }

    return badgeContent;
  }
);

Badge.displayName = 'Badge';

export default Badge;