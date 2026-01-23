'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'filled' | 'elevated' | 'filled-tonal' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  fullWidth?: boolean;
}

// Material Design 3 Button Variants
const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'elevated':
      return {
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        },
      };
    case 'filled-tonal':
      return {
        backgroundColor: 'var(--md-sys-color-secondary-container)',
        color: 'var(--md-sys-color-on-secondary-container)',
        '&:hover': {
          backgroundColor: 'var(--md-sys-color-secondary-container)',
        },
      };
    case 'outlined':
      return {
        border: '1px solid var(--md-sys-color-outline)',
        color: 'var(--md-sys-color-primary)',
        '&:hover': {
          backgroundColor: 'var(--md-sys-color-surface-variant)',
        },
      };
    case 'text':
      return {
        color: 'var(--md-sys-color-primary)',
        '&:hover': {
          backgroundColor: 'var(--md-sys-color-surface-variant)',
        },
      };
    case 'filled':
    default:
      return {
        backgroundColor: 'var(--md-sys-color-primary)',
        color: 'var(--md-sys-color-on-primary)',
        '&:hover': {
          backgroundColor: 'var(--md-sys-color-primary)',
        },
      };
  }
};

// Size configurations
const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return {
        height: '40px',
        padding: '0px 16px',
        fontSize: '14px',
        borderRadius: '20px',
      };
    case 'large':
      return {
        height: '56px',
        padding: '0px 28px',
        fontSize: '16px',
        borderRadius: '28px',
      };
    case 'medium':
    default:
      return {
        height: '40px',
        padding: '0px 24px',
        fontSize: '14px',
        borderRadius: '20px',
      };
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'filled', size = 'medium', children, fullWidth = false, ...props }, ref) => {
const motionProps = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.02 },
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 17
    }
  };

    return (
      <motion.div {...motionProps} style={{ width: fullWidth ? '100%' : 'auto' }}>
        <MuiButton
          ref={ref}
          variant={variant === 'filled' ? 'contained' : variant === 'outlined' ? 'outlined' : 'text'}
          size={size}
          fullWidth={fullWidth}
          sx={{
            ...getVariantStyles(variant),
            ...getSizeStyles(size),
            textTransform: 'none',
            fontWeight: 500,
            minWidth: fullWidth ? '100%' : 'auto',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              opacity: 0,
              transition: 'opacity 0.2s',
            },
            '&:hover::before': {
              opacity: 1,
            },
            '&.Mui-disabled': {
              opacity: 0.38,
              color: 'var(--md-sys-color-on-surface)',
            },
          }}
          {...props}
        >
          {children}
        </MuiButton>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';