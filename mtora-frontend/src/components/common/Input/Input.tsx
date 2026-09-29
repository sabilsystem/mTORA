import React, { forwardRef, useId } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
  containerClassName?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      fullWidth = true,
      id,
      className,
      containerClassName,
      wrapperClassName,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = [
      error ? errorId : null,
      helperText && !error ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div
        className={[
          styles.container,
          fullWidth ? styles.fullWidth : '',
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required} aria-hidden="true">*</span>}
          </label>
        )}

        <div
          className={[
            styles.inputWrapper,
            error ? styles.hasError : '',
            disabled ? styles.disabled : '',
            wrapperClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {prefix && <div className={styles.prefix}>{prefix}</div>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={[styles.input, className].filter(Boolean).join(' ')}
            {...props}
          />
          {suffix && <div className={styles.suffix}>{suffix}</div>}
        </div>

        {error && (
          <div id={errorId} role="alert" className={styles.errorMessage}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!error && helperText && (
          <div id={helperId} className={styles.helperText}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
