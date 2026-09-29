import React, { forwardRef } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'wheat-outline' | 'ghost' | 'pill';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled = false,
      href,
      className,
      type = 'button',
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const isButtonDisabled = disabled || isLoading;

    const variantClass = {
      primary: styles.primary,
      secondary: styles.secondary,
      outline: styles.outline,
      'wheat-outline': styles.wheatOutline,
      ghost: styles.ghost,
      pill: `${styles.primary} ${styles.pill}`,
    }[variant];

    const sizeClass = styles[size] || styles.md;
    const widthClass = fullWidth ? styles.fullWidth : '';
    const loadingClass = isLoading ? styles.loading : '';
    const disabledClass = isButtonDisabled ? styles.disabled : '';

    const combinedClassName = [
      styles.button,
      variantClass,
      sizeClass,
      widthClass,
      loadingClass,
      disabledClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {isLoading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </span>
        )}
        {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </>
    );

    if (href && !isButtonDisabled) {
      const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
      if (isExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target={target || '_blank'}
            rel={rel || 'noopener noreferrer'}
            className={combinedClassName}
            aria-disabled={isButtonDisabled}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedClassName}
          aria-disabled={isButtonDisabled}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={isButtonDisabled}
        aria-busy={isLoading}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
