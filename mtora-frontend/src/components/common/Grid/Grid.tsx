import React, { forwardRef } from 'react';
import styles from './Grid.module.css';

export type GridColumnSpan = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface ResponsiveColumns {
  sm?: GridColumnSpan;
  md?: GridColumnSpan;
  lg?: GridColumnSpan;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: GridColumnSpan | ResponsiveColumns;
  gap?: GridGap;
  as?: React.ElementType;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      columns = 1,
      gap = 4,
      as: Component = 'div',
      className,
      ...props
    },
    ref
  ) => {
    let columnClasses = '';

    if (typeof columns === 'number') {
      columnClasses = styles[`cols${columns}`] || styles.cols1;
    } else if (typeof columns === 'object') {
      const smClass = columns.sm ? styles[`smCols${columns.sm}`] : styles.smCols1;
      const mdClass = columns.md ? styles[`mdCols${columns.md}`] : '';
      const lgClass = columns.lg ? styles[`lgCols${columns.lg}`] : '';
      columnClasses = [smClass, mdClass, lgClass].filter(Boolean).join(' ');
    }

    const gapClass = styles[`gap${gap}`] || styles.gap4;

    const combinedClassName = [
      styles.grid,
      columnClasses,
      gapClass,
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

Grid.displayName = 'Grid';
