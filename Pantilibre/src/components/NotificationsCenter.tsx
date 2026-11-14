import React, { useState } from 'react';
import { AppNotification, CreatorStory, Creator } from '../types';
import {
  Menu,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  Close,
  DoneAll,
  PhotoCamera,
  Feed,
  Lock,
  ShoppingBag,
  DeleteOutlined,
  ArrowForward,
  PlayArrow
} from '@mui/icons-material';
import { Sparkles } from 'lucide-react';

interface NotificationsCenterProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  stories: CreatorStory[];
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  onSelectStory: (storyId: string) => void;
  onSelectNotificationTarget: (notification: AppNotification) => void;
  onTriggerSimulatedNotification: (type?: 'story' | 'post') => void;
  interactiveNotifications: boolean;
  onToggleInteractiveNotifications: () => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  anchorEl,
  isOpen,
  onClose,
  notifications,
  stories,
  unreadCount,
  onMarkAllAsRead,
  onMarkAsRead,
  onDeleteNotification,
  onSelectStory,
  onSelectNotificationTarget,
  onTriggerSimulatedNotification,
  interactiveNotifications,
  onToggleInteractiveNotifications
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'stories' | 'posts' | 'store'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'stories') return n.type === 'story';
    if (filterTab === 'posts') return n.type === 'post';
    if (filterTab === 'store') return n.type === 'store_item' || n.type === 'gallery';
    return true;
  });

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '96vw', sm: 440 },
            maxWidth: 440,
            maxHeight: 620,
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid #FCE7F3',
            boxShadow: '0 20px 50px rgba(224, 93, 132, 0.22)',
            overflow: 'hidden',
            p: 0,
            mt: 1.5
          }
        }
      }}
    >
      {/* ========================================================
          HEADER WITH TITLE & CONTROLS (Clean & Simplified)
      ======================================================== */}
      <Box sx={{ p: 2, pb: 1.5, bgcolor: '#FFF8FA', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsActive sx={{ color: '#BE185D', fontSize: 22 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822', fontSize: 16 }}>
              Notificaciones
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} nuevas`}
                size="small"
                sx={{
                  bgcolor: '#BE185D',
                  color: '#FFF',
                  fontWeight: 900,
                  fontSize: 10,
                  height: 20
                }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {unreadCount > 0 && (
              <Tooltip title="Marcar todas como leídas">
                <IconButton size="small" onClick={onMarkAllAsRead} sx={{ color: '#047857' }}>
                  <DoneAll sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}

            <IconButton size="small" onClick={onClose} sx={{ color: '#6B4C5D' }}>
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          TABS FILTER
      ======================================================== */}
      <Box sx={{ borderBottom: '1px solid #FCE7F3', bgcolor: '#FFFDFE' }}>
        <Tabs
          value={filterTab}
          onChange={(_, val) => setFilterTab(val)}
          variant="fullWidth"
          sx={{
            minHeight: 40,
            '& .MuiTabs-indicator': { bgcolor: '#BE185D', height: 2.5 }
          }}
        >
          <Tab
            value="all"
            label="Todas"
            sx={{ fontWeight: 800, fontSize: 12, textTransform: 'none', minHeight: 40 }}
          />
          <Tab
            value="stories"
            label="Historias"
            sx={{ fontWeight: 800, fontSize: 12, textTransform: 'none', minHeight: 40 }}
          />
          <Tab
            value="posts"
            label="Posts"
            sx={{ fontWeight: 800, fontSize: 12, textTransform: 'none', minHeight: 40 }}
          />
          <Tab
            value="store"
            label="Armario"
            sx={{ fontWeight: 800, fontSize: 12, textTransform: 'none', minHeight: 40 }}
          />
        </Tabs>
      </Box>

      {/* ========================================================
          NOTIFICATIONS LIST
      ======================================================== */}
      <Box sx={{ maxHeight: 380, overflowY: 'auto', p: 1 }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 40, color: '#FBCFE8', mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6B4C5D' }}>
              No hay avisos pendientes
            </Typography>
            <Typography variant="caption" sx={{ color: '#9D7387' }}>
              Te avisaremos en cuanto tus vendedoras favoritas publiquen historias o nuevo contenido.
            </Typography>
          </Box>
        ) : (
          filteredNotifications.map(notif => {
            const isStory = notif.type === 'story';

            return (
              <Box
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  onSelectNotificationTarget(notif);
                  onClose();
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 3,
                  mb: 0.8,
                  bgcolor: notif.read ? '#FFFFFF' : '#FFF0F5',
                  border: notif.read ? '1px solid #FFF0F5' : '1px solid #FCE7F3',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: notif.read ? '#FFF8FA' : '#FCE7F3' }
                }}
              >
                {/* Unread indicator dot */}
                {!notif.read && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 6,
                      width: 7,
                      height: 7,
                      bgcolor: '#BE185D',
                      borderRadius: '50%'
                    }}
                  />
                )}

                {/* Avatar with Type Badge */}
                <Box sx={{ position: 'relative', flexShrink: 0, ml: !notif.read ? 1 : 0 }}>
                  <Avatar
                    src={notif.creatorAvatar}
                    alt={notif.creatorName}
                    sx={{ width: 44, height: 44, border: '2px solid #FFF' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: isStory ? '#E05D84' : '#BE185D',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    {isStory ? (
                      <PhotoCamera sx={{ fontSize: 11 }} />
                    ) : notif.type === 'store_item' ? (
                      <ShoppingBag sx={{ fontSize: 11 }} />
                    ) : (
                      <Feed sx={{ fontSize: 11 }} />
                    )}
                  </Box>
                </Box>

                {/* Content details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 13 }}>
                      {notif.creatorName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9D7387', fontSize: 10 }}>
                      {notif.timeAgo}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4B3642',
                      fontSize: 12,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {notif.message}
                  </Typography>

                  {/* Action Link */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
                    <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 800, fontSize: 11 }}>
                      {isStory ? 'Ver Historia 📸' : 'Ver Contenido →'}
                    </Typography>
                  </Box>
                </Box>

                {/* Media Thumbnail Preview */}
                {notif.mediaPreviewUrl && (
                  <Box
                    component="img"
                    src={notif.mediaPreviewUrl}
                    alt="Preview"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      objectFit: 'cover',
                      border: '1px solid #FCE7F3',
                      flexShrink: 0
                    }}
                  />
                )}

                {/* Delete button */}
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteNotification(notif.id);
                  }}
                  sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}
                >
                  <DeleteOutlined sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            );
          })
        )}
      </Box>
    </Menu>
  );
};
