import React, { forwardRef } from 'react';
import styles from './Container.module.css';

export type ContainerMaxWidth = 'default' | 'checkout' | 'narrow' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: ContainerMaxWidth;
  padding?: 'normal' | 'none';
  as?: React.ElementType;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      maxWidth = 'default',
      padding = 'normal',
      as: Component = 'div',
      className,
      ...props
    },
    ref
  ) => {
    const maxWidthClass = styles[maxWidth] || styles.default;
    const paddingClass = padding === 'none' ? styles.padNone : styles.padNormal;

    const combinedClassName = [
      styles.container,
      maxWidthClass,
      paddingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={combinedClassName} {...props}>
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
