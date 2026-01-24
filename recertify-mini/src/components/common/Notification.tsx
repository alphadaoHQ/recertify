'use client';

import React, { useEffect } from 'react';
import { Alert, Snackbar, Box, IconButton } from '@mui/material';
import { Close, CheckCircle, Error, Info, Warning } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationMessage {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: NotificationMessage[];
  onClose: (id: string) => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle />;
    case 'error':
      return <Error />;
    case 'warning':
      return <Warning />;
    case 'info':
    default:
      return <Info />;
  }
};

const getColor = (type: NotificationType): 'success' | 'error' | 'info' | 'warning' => {
  return type as 'success' | 'error' | 'info' | 'warning';
};

export function NotificationSystem({ notifications, onClose }: NotificationSystemProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 400, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.3 }}
            style={{
              marginBottom: 8,
              pointerEvents: 'auto'
            }}
          >
            <NotificationItem
              notification={notification}
              onClose={() => onClose(notification.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}

interface NotificationItemProps {
  notification: NotificationMessage;
  onClose: () => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const { message, type, duration = 5000, action } = notification;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <Alert
      icon={getIcon(type)}
      severity={getColor(type)}
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        minWidth: '300px',
        backgroundColor: (theme) => {
          const colors = {
            success: '#E8F5E9',
            error: '#FFEBEE',
            warning: '#FFF3E0',
            info: '#E3F2FD'
          };
          return colors[type];
        },
        color: (theme) => {
          const colors = {
            success: '#1B5E20',
            error: '#B71C1C',
            warning: '#E65100',
            info: '#0D47A1'
          };
          return colors[type];
        },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '& .MuiAlert-icon': {
          fontSize: '1.5rem',
          color: 'inherit'
        }
      }}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {action && (
            <button
              onClick={() => {
                action.onClick();
                onClose();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'underline'
              }}
            >
              {action.label}
            </button>
          )}
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.1)'
              }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      {message}
    </Alert>
  );
}
