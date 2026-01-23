'use client';

import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'elevated' | 'filled' | 'outlined';
  children: React.ReactNode;
  elevation?: number;
}

// Material Design 3 Card Variants
const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        },
      };
    case 'filled':
      return {
        backgroundColor: 'var(--md-sys-color-surface-container)',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'var(--md-sys-color-surface-container-high)',
        },
      };
    case 'outlined':
      return {
        backgroundColor: 'var(--md-sys-color-surface)',
        border: '1px solid var(--md-sys-color-outline-variant)',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'var(--md-sys-color-surface-variant)',
        },
      };
    default:
      return {
        backgroundColor: 'var(--md-sys-color-surface)',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      };
  }
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'elevated', children, elevation = 1, ...props }, ref) => {
    const motionProps = {
      whileHover: { 
        y: -2,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 20
        }
      },
      whileTap: { scale: 0.98 }
    };

    return (
      <motion.div {...motionProps}>
        <MuiCard
          ref={ref}
          elevation={0}
          sx={{
            ...getVariantStyles(variant),
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s cubic-bezier(0.2, 0.0, 0.0, 1.0)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              opacity: 0,
              transition: 'opacity 0.2s',
              pointerEvents: 'none',
            },
            '&:hover::before': {
              opacity: 1,
            },
          }}
          {...props}
        >
          {children}
        </MuiCard>
      </motion.div>
    );
  }
);

Card.displayName = 'Card';