import React, { useEffect } from 'react';
import { AppNotification } from '../types';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button
} from '@mui/material';
import {
  Close,
  PhotoCamera,
  Feed,
  Lock,
  ShoppingBag,
  ArrowForward
} from '@mui/icons-material';

interface RealTimeNotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
  onOpenTarget: (notification: AppNotification) => void;
}

export const RealTimeNotificationToast: React.FC<RealTimeNotificationToastProps> = ({
  notification,
  onClose,
  onOpenTarget
}) => {
  useEffect(() => {
    if (!notification) return;

    // Auto-dismiss after 7 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 7000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isStory = notification.type === 'story';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 75, sm: 85 },
        right: { xs: 12, sm: 24 },
        zIndex: 1400,
        maxWidth: 390,
        width: 'calc(100vw - 24px)',
        bgcolor: '#1F0B17',
        color: '#FFFFFF',
        borderRadius: 4,
        p: 2,
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(224, 93, 132, 0.35)',
        border: '1.5px solid rgba(224, 93, 132, 0.45)',
        backdropFilter: 'blur(16px)',
        animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        '@keyframes slideInRight': {
          from: { transform: 'translateX(100%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 }
        }
      }}
    >
      {/* Top Header Tag */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.2,
              borderRadius: 2,
              bgcolor: isStory ? 'rgba(224, 93, 132, 0.3)' : 'rgba(234, 179, 8, 0.25)',
              color: isStory ? '#F472B6' : '#FDE047',
              fontSize: 10,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {isStory ? <PhotoCamera sx={{ fontSize: 13 }} /> : <Feed sx={{ fontSize: 13 }} />}
            <span>{isStory ? 'Nueva Historia' : 'Nuevo Contenido'}</span>
          </Box>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
            {notification.timeAgo}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#FFF' } }}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Content Body */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
        {/* Avatar with glowing ring */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            src={notification.creatorAvatar}
            alt={notification.creatorName}
            sx={{
              width: 48,
              height: 48,
              border: isStory ? '2.5px solid #E05D84' : '2.5px solid #FDE047',
              boxShadow: '0 0 12px rgba(224, 93, 132, 0.6)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              bgcolor: '#10B981',
              borderRadius: '50%',
              border: '2px solid #1F0B17'
            }}
          />
        </Box>

        {/* Text Details */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFF', fontSize: 13, lineHeight: 1.2 }}>
            {notification.creatorName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.82)',
              fontSize: 12,
              mt: 0.3,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {notification.message}
          </Typography>
        </Box>

        {/* Media Thumbnail */}
        {notification.mediaPreviewUrl && (
          <Box
            component="img"
            src={notification.mediaPreviewUrl}
            alt="Preview"
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              objectFit: 'cover',
              border: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0
            }}
          />
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 0.5 }}>
        <Button
          size="small"
          onClick={onClose}
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'none'
          }}
        >
          Descartar
        </Button>

        <Button
          size="small"
          variant="contained"
          onClick={() => {
            onClose();
            onOpenTarget(notification);
          }}
          endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
          sx={{
            bgcolor: isStory ? '#E05D84' : '#BE185D',
            color: '#FFF',
            fontSize: 11,
            fontWeight: 800,
            borderRadius: 2.5,
            px: 2,
            py: 0.6,
            textTransform: 'none',
            '&:hover': { bgcolor: '#BE185D' }
          }}
        >
          {isStory ? 'Ver Historia' : 'Ver Contenido'}
        </Button>
      </Box>
    </Box>
  );
};
