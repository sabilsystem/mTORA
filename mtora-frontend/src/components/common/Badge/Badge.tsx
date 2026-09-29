import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'wheat' | 'success' | 'warning' | 'error' | 'neutral' | 'dark';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'wheat',
  size = 'md',
  icon,
  className,
  ...props
}) => {
  const variantClass = styles[variant] || styles.wheat;
  const sizeClass = styles[size] || styles.md;

  const combinedClassName = [
    styles.badge,
    variantClass,
    sizeClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={combinedClassName} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

Badge.displayName = 'Badge';
