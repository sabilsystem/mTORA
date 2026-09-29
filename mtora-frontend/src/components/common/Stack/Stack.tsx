import React, { forwardRef } from 'react';
import styles from './Stack.module.css';

export type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  align?: StackAlign;
  justify?: StackJustify;
  gap?: StackGap;
  wrap?: boolean;
  as?: React.ElementType;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      direction = 'column',
      align,
      justify,
      gap = 4,
      wrap = false,
      as: Component = 'div',
      className,
      ...props
    },
    ref
  ) => {
    const directionClass = {
      row: styles.row,
      column: styles.column,
      'row-reverse': styles.rowReverse,
      'column-reverse': styles.columnReverse,
    }[direction];

    const alignClass = align
      ? {
          start: styles.alignStart,
          center: styles.alignCenter,
          end: styles.alignEnd,
          stretch: styles.alignStretch,
          baseline: styles.alignBaseline,
        }[align]
      : '';

    const justifyClass = justify
      ? {
          start: styles.justifyStart,
          center: styles.justifyCenter,
          end: styles.justifyEnd,
          between: styles.justifyBetween,
          around: styles.justifyAround,
          evenly: styles.justifyEvenly,
        }[justify]
      : '';

    const gapClass = styles[`gap${gap}`] || styles.gap4;

    const combinedClassName = [
      styles.stack,
      directionClass,
      alignClass,
      justifyClass,
      gapClass,
      wrap ? styles.wrap : '',
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

Stack.displayName = 'Stack';
