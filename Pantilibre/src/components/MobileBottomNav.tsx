import React from 'react';
import { Box, Typography, Badge } from '@mui/material';
import {
  Home as HomeIcon,
  DynamicFeed,
  Category,
  ChatBubble,
  AutoAwesome
} from '@mui/icons-material';
import { Crown } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'landing' | 'feed' | 'categories' | 'vip' | 'chat' | 'profile';
  setCurrentTab: (tab: 'landing' | 'feed' | 'categories' | 'vip' | 'chat' | 'profile') => void;
  unreadChatCount: number;
  unreadNotificationsCount?: number;
  onOpenPlans?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  unreadChatCount,
  onOpenPlans
}) => {
  const navItems = [
    {
      id: 'landing' as const,
      label: 'Inicio',
      icon: <HomeIcon sx={{ fontSize: 22 }} />
    },
    {
      id: 'feed' as const,
      label: 'Muro',
      icon: <DynamicFeed sx={{ fontSize: 22 }} />
    },
    {
      id: 'categories' as const,
      label: 'Fetiches',
      icon: <Category sx={{ fontSize: 22 }} />
    },
    {
      id: 'vip' as const,
      label: 'Vendedoras',
      icon: <Crown size={20} />
    },
    {
      id: 'chat' as const,
      label: 'Mensajes',
      icon: (
        <Badge
          badgeContent={unreadChatCount}
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#BE185D',
              color: '#FFF',
              fontWeight: 900,
              fontSize: 10,
              height: 16,
              minWidth: 16,
              boxShadow: '0 0 6px rgba(190, 24, 93, 0.7)'
            }
          }}
        >
          <ChatBubble sx={{ fontSize: 20 }} />
        </Badge>
      )
    }
  ];

  return (
    <Box
      component="nav"
      aria-label="Navegación móvil inferior"
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1.5px solid #FCE7F3',
        boxShadow: '0 -4px 20px rgba(224, 93, 132, 0.1)',
        px: 1,
        pt: 0.8,
        pb: 'max(env(safe-area-inset-bottom, 8px), 8px)',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '62px',
        boxSizing: 'content-box'
      }}
    >
      {navItems.map(item => {
        const isActive = currentTab === item.id;

        return (
          <Box
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            component="button"
            type="button"
            sx={{
              flex: 1,
              maxWidth: 72,
              height: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.3,
              borderRadius: 3,
              border: 'none',
              bgcolor: isActive ? '#FFF0F5' : 'transparent',
              color: isActive ? '#BE185D' : '#7A5868',
              cursor: 'pointer',
              transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              p: 0.5,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              '&:active': {
                transform: 'scale(0.92)'
              }
            }}
          >
            {/* Top subtle highlight dot for active tab */}
            {isActive && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  width: 14,
                  height: 3,
                  bgcolor: '#BE185D',
                  borderRadius: 2
                }}
              />
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? '#BE185D' : '#7A5868',
                transition: 'color 0.18s ease'
              }}
            >
              {item.icon}
            </Box>

            <Typography
              variant="caption"
              sx={{
                fontSize: 10,
                fontWeight: isActive ? 900 : 700,
                color: isActive ? '#BE185D' : '#7A5868',
                lineHeight: 1,
                letterSpacing: '-0.01em'
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
