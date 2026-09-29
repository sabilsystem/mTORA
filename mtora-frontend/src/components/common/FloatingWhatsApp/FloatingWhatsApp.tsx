import React from 'react';
import styles from './FloatingWhatsApp.module.css';

export interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  label?: string;
  showTooltip?: boolean;
  className?: string;
  bottomOffset?: number | string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '919030999072',
  message = 'Hi mTORA, I have a question about protein roti.',
  label,
  showTooltip = false,
  className,
  bottomOffset,
}) => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  const styleOverride: React.CSSProperties = {};
  if (bottomOffset !== undefined) {
    styleOverride.bottom = typeof bottomOffset === 'number' ? `${bottomOffset}px` : bottomOffset;
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with mTORA on WhatsApp"
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      style={styleOverride}
    >
      {label && (
        <span
          className={[
            styles.tooltip,
            showTooltip ? styles.alwaysShowTooltip : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </span>
      )}

      <div className={styles.button}>
        <svg
          viewBox="0 0 24 24"
          className={styles.icon}
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.05 7.42C8.86 7.42 8.54 7.49 8.28 7.78C8.01 8.07 7.27 8.77 7.27 10.19C7.27 11.61 8.31 12.98 8.45 13.17C8.6 13.36 10.45 16.22 13.32 17.46C14.01 17.75 14.54 17.93 14.95 18.06C15.65 18.28 16.28 18.25 16.79 18.18C17.35 18.1 18.52 17.47 18.76 16.78C19.01 16.09 19.01 15.51 18.93 15.38C18.86 15.26 18.67 15.19 18.38 15.04C18.1 14.9 16.71 14.22 16.45 14.12C16.19 14.03 16 13.98 15.82 14.27C15.63 14.55 15.08 15.19 14.92 15.38C14.76 15.56 14.59 15.59 14.31 15.45C14.03 15.3 12.86 14.92 11.47 13.68C10.38 12.71 9.65 11.52 9.5 11.23C9.36 10.95 9.48 10.8 9.63 10.65C9.76 10.53 9.92 10.32 10.06 10.15C10.21 9.97 10.26 9.85 10.35 9.66C10.45 9.47 10.4 9.3 10.33 9.16C10.26 9.01 9.69 7.62 9.46 7.07C9.23 6.54 9 6.61 8.83 6.61C8.67 6.61 8.48 6.6 8.29 6.6C8.1 6.6 7.79 6.67 7.53 6.96" />
        </svg>
      </div>
    </a>
  );
};

FloatingWhatsApp.displayName = 'FloatingWhatsApp';
