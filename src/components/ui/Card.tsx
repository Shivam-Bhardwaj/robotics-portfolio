import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'glass' | 'robotics';
  hover?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = true, className = '', children, ...props }, ref) => {
    const baseClasses = [
      'rounded-xl overflow-hidden transition-all duration-300',
      'border border-gray-200 dark:border-gray-700'
    ];

    const variantClasses = {
      default: [
        'bg-white dark:bg-gray-800 shadow-md',
        hover && 'hover:shadow-lg hover:-translate-y-1'
      ].filter(Boolean),
      glow: [
        'bg-white dark:bg-gray-800',
        'shadow-lg border-brand-accent/20',
        'hover:shadow-xl hover:shadow-brand-accent/30',
        hover && 'hover:-translate-y-1'
      ].filter(Boolean),
      glass: [
        'glass backdrop-blur-lg',
        'border-white/20 shadow-lg',
        hover && 'hover:bg-white/20 hover:-translate-y-1'
      ].filter(Boolean),
      robotics: [
        'bg-gradient-to-br from-gray-900 to-gray-800',
        'border-electric/30 shadow-lg shadow-electric/20',
        'text-white',
        hover && 'hover:shadow-xl hover:shadow-electric/40 hover:-translate-y-1'
      ].filter(Boolean)
    };

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      className
    ].join(' ');

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pb-0 ${className}`}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = '', ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = '', ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-foreground-muted mt-2 ${className}`}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 ${className}`}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 flex items-center gap-2 ${className}`}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export default Card;