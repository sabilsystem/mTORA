import React, { forwardRef } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'muted' | 'dark' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg';
export type CardElevation = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  elevation?: CardElevation;
  selectable?: boolean;
  isSelected?: boolean;
  interactive?: boolean;
  as?: React.ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      radius = 'md',
      elevation = 'sm',
      selectable = false,
      isSelected = false,
      interactive = false,
      as: Component = 'div',
      className,
      tabIndex,
      onKeyDown,
      onClick,
      ...props
    },
    ref
  ) => {
    const isClickable = interactive || selectable || Boolean(onClick);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (selectable && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(e);
    };

    const variantClass = styles[variant] || styles.default;
    const paddingClass = {
      none: styles.pNone,
      sm: styles.pSm,
      md: styles.pMd,
      lg: styles.pLg,
    }[padding];

    const radiusClass = {
      none: styles.rNone,
      sm: styles.rSm,
      md: styles.rMd,
      lg: styles.rLg,
    }[radius];

    const elevationClass = {
      none: styles.elevNone,
      sm: styles.elevSm,
      md: styles.elevMd,
      lg: styles.elevLg,
    }[elevation];

    const combinedClassName = [
      styles.card,
      variantClass,
      paddingClass,
      radiusClass,
      elevationClass,
      interactive ? styles.interactive : '',
      selectable ? styles.selectable : '',
      isSelected ? styles.isSelected : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component
        ref={ref}
        className={combinedClassName}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={isClickable && tabIndex === undefined ? 0 : tabIndex}
        role={selectable ? 'checkbox' : isClickable ? 'button' : props.role}
        aria-checked={selectable ? isSelected : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
