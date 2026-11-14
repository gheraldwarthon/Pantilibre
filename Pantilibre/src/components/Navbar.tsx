import React, { useState } from 'react';
import { PantilibreLogo } from './PantilibreLogo';
import {
  AppBar,
  Toolbar,
  Button,
  Badge,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  Chip,
  Typography
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ChatBubble,
  AutoAwesome,
  DynamicFeed,
  Category,
  Home as HomeIcon,
  Notifications,
  NotificationsActive,
  AddPhotoAlternate,
  AdminPanelSettings
} from '@mui/icons-material';
import { Crown } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: 'landing' | 'feed' | 'categories' | 'vip' | 'chat' | 'profile';
  setCurrentTab: (tab: 'landing' | 'feed' | 'categories' | 'vip' | 'chat' | 'profile') => void;
  user: UserProfile;
  unreadCount: number;
  unreadNotificationsCount?: number;
  onOpenNotifications?: (event: React.MouseEvent<HTMLElement>) => void;
  onOpenPlans: () => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  onOpenDataSaver?: () => void;
  onOpenAdmin?: () => void;
  onOpenComposer?: () => void;
  onLogout?: () => void;
  onToggleDataSaver?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  unreadCount,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenPlans,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onOpenComposer,
  onLogout,
  onToggleDataSaver
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isDark = false;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDark ? 'rgba(11, 3, 9, 0.94)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(14px)',
        borderBottom: isDark ? '1px solid rgba(212, 175, 55, 0.22)' : '1px solid #FCE7F3',
        color: isDark ? '#FFFFFF' : '#2D1822',
        zIndex: 1100,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: '1280px',
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          minHeight: '68px',
        }}
      >
        {/* Zone 1: Pantilibre Brand Wordmark */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <PantilibreLogo
            size="md"
            onClick={() => setCurrentTab('landing')}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            subtitleClassName={isDark ? "text-[#FDE047]" : "text-[#D4AF37]"}
          />
        </Box>

        {/* Zone 2: Navigation Links (Material UI Text Buttons with indicators) */}
        <Box
          component="nav"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: { md: 0.8, lg: 1.5 },
          }}
        >
          <Button
            onClick={() => setCurrentTab('landing')}
            variant={currentTab === 'landing' ? 'contained' : 'text'}
            size="small"
            startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: currentTab === 'landing' ? '#E05D84' : 'transparent',
              color: currentTab === 'landing' ? '#FFFFFF' : (isDark ? '#E2CBD6' : '#4A2A38'),
              '&:hover': {
                bgcolor: currentTab === 'landing' ? '#BE185D' : (isDark ? 'rgba(255,255,255,0.08)' : '#FDF2F8'),
              },
            }}
          >
            Inicio
          </Button>

          <Button
            onClick={() => setCurrentTab('feed')}
            variant={currentTab === 'feed' ? 'contained' : 'text'}
            size="small"
            startIcon={<DynamicFeed sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: currentTab === 'feed' ? '#E05D84' : 'transparent',
              color: currentTab === 'feed' ? '#FFFFFF' : (isDark ? '#E2CBD6' : '#4A2A38'),
              '&:hover': {
                bgcolor: currentTab === 'feed' ? '#BE185D' : (isDark ? 'rgba(255,255,255,0.08)' : '#FDF2F8'),
              },
            }}
          >
            Muro VIP
          </Button>

          <Button
            onClick={() => setCurrentTab('categories')}
            variant={currentTab === 'categories' ? 'contained' : 'text'}
            size="small"
            startIcon={<Category sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: currentTab === 'categories' ? '#E05D84' : 'transparent',
              color: currentTab === 'categories' ? '#FFFFFF' : (isDark ? '#E2CBD6' : '#4A2A38'),
              '&:hover': {
                bgcolor: currentTab === 'categories' ? '#BE185D' : (isDark ? 'rgba(255,255,255,0.08)' : '#FDF2F8'),
              },
            }}
          >
            Categorías
          </Button>

          <Button
            onClick={() => setCurrentTab('vip')}
            variant={currentTab === 'vip' ? 'contained' : 'text'}
            size="small"
            startIcon={<Crown color="#FCD34D" size={18} />}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: currentTab === 'vip' ? '#E05D84' : 'transparent',
              color: currentTab === 'vip' ? '#FFFFFF' : (isDark ? '#E2CBD6' : '#4A2A38'),
              '&:hover': {
                bgcolor: currentTab === 'vip' ? '#BE185D' : (isDark ? 'rgba(255,255,255,0.08)' : '#FDF2F8'),
              },
            }}
          >
            Vendedoras VIP
          </Button>

          <Button
            onClick={() => setCurrentTab('chat')}
            variant={currentTab === 'chat' ? 'contained' : 'text'}
            size="small"
            startIcon={
              <Badge badgeContent={unreadCount} color="error">
                <ChatBubble sx={{ fontSize: 18 }} />
              </Badge>
            }
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: currentTab === 'chat' ? '#E05D84' : 'transparent',
              color: currentTab === 'chat' ? '#FFFFFF' : (isDark ? '#E2CBD6' : '#4A2A38'),
              '&:hover': {
                bgcolor: currentTab === 'chat' ? '#BE185D' : (isDark ? 'rgba(255,255,255,0.08)' : '#FDF2F8'),
              },
            }}
          >
            Mensajes
          </Button>

          <Button
            onClick={onOpenPlans}
            variant="outlined"
            size="small"
            startIcon={<AutoAwesome sx={{ color: '#FCD34D', fontSize: 18 }} />}
            sx={{
              borderRadius: 3,
              borderColor: isDark ? 'rgba(212, 175, 55, 0.45)' : '#E5C378',
              color: isDark ? '#FDE047' : '#8A6D1E',
              fontWeight: 700,
              bgcolor: isDark ? 'rgba(212, 175, 55, 0.1)' : '#FFFDF0',
              backdropFilter: isDark ? 'blur(8px)' : 'none',
              '&:hover': {
                borderColor: '#FCD34D',
                bgcolor: isDark ? 'rgba(212, 175, 55, 0.2)' : '#FFF9E0',
              },
            }}
          >
            Membresías
          </Button>
        </Box>

        {/* Zone 3: Coin balance, Profile & Mobile Hamburger */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexShrink: 0 }}>
          {/* Composer (sellers) */}
          {onOpenComposer && (
            <Tooltip title="Nueva publicación">
              <IconButton
                onClick={onOpenComposer}
                size="small"
                sx={{
                  color: '#FFF', bgcolor: '#E05D84', borderRadius: '50%', p: 0.85,
                  transition: 'all 0.2s', '&:hover': { bgcolor: '#BE185D' }
                }}
              >
                <AddPhotoAlternate sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Admin panel button */}
          {onOpenAdmin && (
            <Tooltip title="Centro de Control (Admin)">
              <IconButton
                onClick={onOpenAdmin}
                size="small"
                sx={{
                  color: '#8A6D1E', bgcolor: '#FFFDF0', border: '1px solid #E5C378',
                  borderRadius: '50%', p: 0.85, transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#FFF9E0', borderColor: '#D4AF37' }
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Notifications Bell Icon Button */}
          {onOpenNotifications && (
            <Tooltip title="Notificaciones en vivo">
              <IconButton
                onClick={onOpenNotifications}
                size="small"
                sx={{
                  color: isDark
                    ? unreadNotificationsCount > 0
                      ? '#FDE047'
                      : '#E2CBD6'
                    : unreadNotificationsCount > 0
                    ? '#BE185D'
                    : '#4A2A38',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFF0F5',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid #FBCFE8',
                  borderRadius: '50%',
                  p: 0.85,
                  position: 'relative',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.16)' : '#FCE7F3',
                    borderColor: '#E05D84'
                  }
                }}
              >
                <Badge
                  badgeContent={unreadNotificationsCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#BE185D',
                      color: '#FFF',
                      fontWeight: 900,
                      fontSize: 10,
                      height: 18,
                      minWidth: 18,
                      boxShadow: '0 0 8px rgba(190, 24, 93, 0.6)'
                    }
                  }}
                >
                  {unreadNotificationsCount > 0 ? (
                    <NotificationsActive sx={{ fontSize: 20 }} />
                  ) : (
                    <Notifications sx={{ fontSize: 20 }} />
                  )}
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* User Profile Button */}
          <Box
            onClick={onOpenProfile}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFF0F5',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid #FBCFE8',
              borderRadius: 9999,
              py: 0.5,
              px: 1,
              pr: { xs: 1, sm: 1.8 },
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#E05D84',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.14)' : '#FCE7F3',
              },
            }}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 28, height: 28, border: '1.5px solid #E05D84' }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 12, fontWeight: 700, color: isDark ? '#FFFFFF' : '#4A2A38', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name.split(' ')[0]}
            </Box>
            {user.plan !== 'free' && (
              <Chip
                label="VIP"
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 800,
                  bgcolor: '#D4AF37',
                  color: '#FFFFFF',
                }}
              />
            )}
          </Box>

          {/* Mobile Drawer Hamburger */}
          <IconButton
            onClick={() => setMobileDrawerOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' }, color: isDark ? '#FDE047' : '#E05D84' }}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Material UI Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              bgcolor: '#FFF8F9',
              p: 2,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <PantilibreLogo size="sm" />
          <IconButton onClick={() => setMobileDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                setCurrentTab('landing');
                setMobileDrawerOpen(false);
              }}
              selected={currentTab === 'landing'}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#E05D84' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 600, fontSize: 15 }}>Inicio (Landing)</Typography>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                setCurrentTab('feed');
                setMobileDrawerOpen(false);
              }}
              selected={currentTab === 'feed'}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#E05D84' }}>
                <DynamicFeed />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 600, fontSize: 15 }}>Muro VIP</Typography>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                setCurrentTab('categories');
                setMobileDrawerOpen(false);
              }}
              selected={currentTab === 'categories'}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#E05D84' }}>
                <Category />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 600, fontSize: 15 }}>Categorías & Filtros</Typography>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                setCurrentTab('vip');
                setMobileDrawerOpen(false);
              }}
              selected={currentTab === 'vip'}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#D4AF37' }}>
                <Crown size={20} />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 600, fontSize: 15 }}>Vendedoras VIP</Typography>} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                setCurrentTab('chat');
                setMobileDrawerOpen(false);
              }}
              selected={currentTab === 'chat'}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#E05D84' }}>
                <ChatBubble />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 600, fontSize: 15 }}>Mensajes en Vivo</Typography>} />
              {unreadCount > 0 && <Chip label={unreadCount} size="small" color="error" />}
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                onOpenPlans();
                setMobileDrawerOpen(false);
              }}
              sx={{ borderRadius: 2, bgcolor: '#FFFDF0', border: '1px solid #F5DE98' }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#D4AF37' }}>
                <AutoAwesome />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ fontWeight: 700, fontSize: 15, color: '#8A6D1E' }}>Membresías & Coins</Typography>} />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #FCE7F3' }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => {
              onOpenAuth();
              setMobileDrawerOpen(false);
            }}
            sx={{ mb: 1 }}
          >
            Cambiar Rol / Cuenta
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => {
              setCurrentTab('landing');
              setMobileDrawerOpen(false);
            }}
            sx={{ color: '#E05D84' }}
          >
            Ver Landing Page
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};
