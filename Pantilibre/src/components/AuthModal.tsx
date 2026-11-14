import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { PantilibreLogo } from './PantilibreLogo';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  IconButton,
  Alert,
  Switch,
  Chip,
  Card,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Close,
  Security,
  Speed,
  Tune,
  Person,
  CheckCircle,
  MonetizationOn,
  NotificationsActive,
  NotificationsOff,
  SignalCellularAlt,
  FlashOn,
  Lock,
  AutoAwesome
} from '@mui/icons-material';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginAs: (user: UserProfile) => void;
  onToggleDataSaver: () => void;
  onToggleInteractiveNotifications?: () => void;
  initialTab?: 'settings' | 'profile' | 'switch';
  initialAuthMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginAs,
  onToggleDataSaver,
  onToggleInteractiveNotifications,
  initialTab,
  initialAuthMode
}) => {
  const [modalTab, setModalTab] = useState<'settings' | 'profile' | 'switch'>(initialTab || 'settings');
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialAuthMode || 'login');

  useEffect(() => {
    if (isOpen) {
      if (initialTab) setModalTab(initialTab);
      if (initialAuthMode) setAuthMode(initialAuthMode);
    }
  }, [isOpen, initialTab, initialAuthMode]);
  const [selectedRole, setSelectedRole] = useState<'fan' | 'creator'>('fan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdultConfirmed) {
      setFeedback('Debes confirmar ser mayor de 18 años para acceder a Pantilibre.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: username || (email ? email.split('@')[0] : 'Usuario VIP'),
      username: username ? username.toLowerCase().replace(/\s+/g, '_') : 'fan_exclusivo',
      avatar:
        selectedRole === 'creator'
          ? '/assets/aistudio/image_4e4bce0c.png'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: selectedRole,
      plan: selectedRole === 'creator' ? 'gold_vip' : 'free',
      coins: selectedRole === 'creator' ? 500 : 100,
      unlockedGalleries: [],
      savedPosts: [],
      followingCreatorIds: ['cr_1'],
      favoriteCreatorIds: ['cr_1'],
      dataSaverMode: currentUser.dataSaverMode || false,
      interactiveNotifications: Boolean(currentUser.interactiveNotifications)
    };

    onLoginAs(newUser);
    onClose();
  };

  const handleQuickSwitch = (role: 'fan' | 'creator') => {
    if (role === 'creator') {
      const creatorUser: UserProfile = {
        id: 'usr_camila',
        name: 'Camila Gold (Modelo VIP)',
        username: 'camilagold',
        avatar: '/assets/aistudio/image_4e4bce0c.png',
        role: 'creator',
        plan: 'black_diamond',
        coins: 1250,
        unlockedGalleries: ['gal_1', 'gal_2', 'gal_3', 'gal_4'],
        savedPosts: ['post_1', 'post_2'],
        followingCreatorIds: ['cr_2', 'cr_3'],
        favoriteCreatorIds: ['cr_2', 'cr_3'],
        dataSaverMode: currentUser.dataSaverMode || false,
        interactiveNotifications: Boolean(currentUser.interactiveNotifications)
      };
      onLoginAs(creatorUser);
    } else {
      const fanUser: UserProfile = {
        id: 'usr_me',
        name: 'Alejandro M. (Fan VIP)',
        username: 'alex_vip',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: 'fan',
        plan: 'gold_vip',
        coins: 380,
        unlockedGalleries: ['gal_1'],
        savedPosts: ['post_1'],
        followingCreatorIds: ['cr_1', 'cr_3'],
        favoriteCreatorIds: ['cr_1', 'cr_3'],
        dataSaverMode: currentUser.dataSaverMode || false,
        interactiveNotifications: Boolean(currentUser.interactiveNotifications)
      };
      onLoginAs(fanUser);
    }
    onClose();
  };

  const isDataSaver = Boolean(currentUser.dataSaverMode);
  const isInteractive = Boolean(currentUser.interactiveNotifications);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 5,
            bgcolor: '#FFF8FA',
            border: '1.5px solid #FCE7F3',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 24px 60px rgba(224, 93, 132, 0.22)',
            overflow: 'hidden'
          },
        },
      }}
    >
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <PantilibreLogo size="sm" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822', fontSize: 16 }}>
            Configuración & Cuenta
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#7A5868', '&:hover': { color: '#BE185D' } }}>
          <Close />
        </IconButton>
      </Box>

      {/* Navigation Tabs in Modal */}
      <Box sx={{ borderBottom: '1px solid #FCE7F3', mb: 2.5 }}>
        <Tabs
          value={modalTab}
          onChange={(_, val) => setModalTab(val)}
          variant="fullWidth"
          sx={{
            minHeight: 42,
            '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: 13, minHeight: 42 },
            '& .Mui-selected': { color: '#BE185D !important' },
            '& .MuiTabs-indicator': { bgcolor: '#BE185D', height: 2.5 },
          }}
        >
          <Tab value="settings" label="Configuración" icon={<Tune sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab value="profile" label="Mi Perfil" icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab value="switch" label="Cambiar Usuario" icon={<Lock sx={{ fontSize: 18 }} />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* ========================================================
          TAB 1: CONFIGURACIÓN DE LA CUENTA (Modo Ahorro)
      ======================================================== */}
      {modalTab === 'settings' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* PRIMARY CARD: MODO AHORRO DE DATOS (INTERRUPTOR) */}
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              bgcolor: isDataSaver ? '#ECFDF5' : '#FFFFFF',
              border: isDataSaver ? '2px solid #10B981' : '1.5px solid #FCE7F3',
              boxShadow: isDataSaver ? '0 6px 20px rgba(16, 185, 129, 0.15)' : '0 2px 12px rgba(224, 93, 132, 0.05)',
              transition: 'all 0.25s'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 3,
                    bgcolor: isDataSaver ? '#D1FAE5' : '#FFF0F5',
                    color: isDataSaver ? '#047857' : '#BE185D',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Speed sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822', fontSize: 15 }}>
                      Modo Ahorro de Datos
                    </Typography>
                    {isDataSaver ? (
                      <Chip
                        icon={<CheckCircle sx={{ fontSize: 13, color: '#047857 !important' }} />}
                        label="ACTIVADO"
                        size="small"
                        sx={{ bgcolor: '#A7F3D0', color: '#065F46', fontWeight: 900, fontSize: 10, height: 20 }}
                      />
                    ) : (
                      <Chip
                        label="HD ESTÁNDAR"
                        size="small"
                        sx={{ bgcolor: '#F3F4F6', color: '#6B7280', fontWeight: 800, fontSize: 10, height: 20 }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: isDataSaver ? '#065F46' : '#7A5868', fontWeight: 600, fontSize: 11 }}>
                    Para conexiones lentas, datos móviles reducidos o roaming
                  </Typography>
                </Box>
              </Box>

              {/* THE SWITCH TOGGLE */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Switch
                  checked={isDataSaver}
                  onChange={onToggleDataSaver}
                  color="success"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#10B981',
                      '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.08)' }
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: '#10B981'
                    }
                  }}
                />
                <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 800, color: isDataSaver ? '#047857' : '#9CA3AF' }}>
                  {isDataSaver ? 'ON' : 'OFF'}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: '#4A2A38', fontSize: 12.5, lineHeight: 1.55, mb: 2 }}>
              Al activarse, el sistema <strong>sustituye automáticamente las imágenes y portadas en alta resolución</strong> por versiones comprimidas (thumbnails ligeros). Acelera drásticamente los tiempos de carga en el muro y reduce el consumo de ancho de banda hasta un 75%.
            </Typography>

            {/* Bandwidth Savings Comparison Metric */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: isDataSaver ? '#FFFFFF' : '#FFF8FA',
                border: '1px solid',
                borderColor: isDataSaver ? '#A7F3D0' : '#FCE7F3',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
                textAlign: 'center'
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontSize: 10 }}>
                  Resolución de Imágenes
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: isDataSaver ? '#047857' : '#2D1822', fontSize: 13 }}>
                  {isDataSaver ? 'Thumbnail 360px (q=35)' : 'HD Original 1200px (q=80)'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontSize: 10 }}>
                  Ahorro Estimado de Red
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: isDataSaver ? '#059669' : '#8A6D1E', fontSize: 13 }}>
                  {isDataSaver ? '⚡ ~75% Menos Megas' : '0% (Consumo Estándar)'}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* SECONDARY CARD: NOTIFICACIONES INTERACTIVAS EN TIEMPO REAL */}
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              bgcolor: isInteractive ? '#FFF8FA' : '#FFFFFF',
              border: isInteractive ? '1.5px solid #FCE7F3' : '1px solid #E5E7EB',
              boxShadow: '0 2px 10px rgba(224, 93, 132, 0.05)',
              transition: 'all 0.25s'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 3,
                    bgcolor: isInteractive ? '#FFF0F5' : '#F3F4F6',
                    color: isInteractive ? '#BE185D' : '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {isInteractive ? <NotificationsActive sx={{ fontSize: 24 }} /> : <NotificationsOff sx={{ fontSize: 24 }} />}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822', fontSize: 15 }}>
                      Notificaciones Interactivas
                    </Typography>
                    <Chip
                      icon={isInteractive ? <CheckCircle sx={{ fontSize: 13, color: '#BE185D !important' }} /> : undefined}
                      label={isInteractive ? 'ACTIVADAS' : 'DESACTIVADAS'}
                      size="small"
                      sx={{
                        bgcolor: isInteractive ? '#FFF0F5' : '#F3F4F6',
                        color: isInteractive ? '#BE185D' : '#6B7280',
                        fontWeight: 900,
                        fontSize: 10,
                        height: 20
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: isInteractive ? '#9D7387' : '#7A5868', fontWeight: 600, fontSize: 11 }}>
                    Avisos emergentes flotantes en pantalla (toasts) en tiempo real
                  </Typography>
                </Box>
              </Box>

              {/* THE SWITCH TOGGLE */}
              {onToggleInteractiveNotifications && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Switch
                    checked={isInteractive}
                    onChange={onToggleInteractiveNotifications}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#BE185D',
                        '&:hover': { bgcolor: 'rgba(190, 24, 93, 0.08)' }
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        bgcolor: '#BE185D'
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 800, color: isInteractive ? '#BE185D' : '#9CA3AF' }}>
                    {isInteractive ? 'ON' : 'OFF'}
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography variant="body2" sx={{ color: '#4A2A38', fontSize: 12, lineHeight: 1.55, mb: 1.8 }}>
              Muestra avisos interactivos emergentes en la esquina inferior cuando una de tus vendedoras favoritas suba una nueva historia de 24h o publique nuevo contenido. Puedes desactivarlos si prefieres navegar sin avisos flotantes.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, pt: 1.2, borderTop: '1px solid #FFF0F5', flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: '#9D7387', fontSize: 11 }}>
                {isInteractive ? '✓ Recibiendo avisos flotantes interactivos' : 'Al desactivar, las publicaciones se guardan silenciosamente en la campana'}
              </Typography>
              {onToggleInteractiveNotifications && (
                <Button
                  size="small"
                  variant={isInteractive ? 'outlined' : 'contained'}
                  onClick={onToggleInteractiveNotifications}
                  sx={{
                    borderRadius: 2,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'none',
                    py: 0.4,
                    px: 1.5,
                    bgcolor: isInteractive ? 'transparent' : '#BE185D',
                    color: isInteractive ? '#BE185D' : '#FFF',
                    borderColor: '#E05D84',
                    boxShadow: isInteractive ? 'none' : '0 2px 8px rgba(190, 24, 93, 0.25)',
                    '&:hover': {
                      bgcolor: isInteractive ? '#FFF0F5' : '#9D174D',
                      borderColor: '#BE185D'
                    }
                  }}
                >
                  {isInteractive ? 'Desactivar Notificaciones' : 'Activar Notificaciones'}
                </Button>
              )}
            </Box>
          </Card>

          {/* PRIVACY & DISCRETION CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3.5,
              bgcolor: '#FFF0F5',
              border: '1px solid #FBCFE8',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Security sx={{ color: '#BE185D', fontSize: 22 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 12 }}>
                Privacidad & Facturación Oculta Certificada
              </Typography>
              <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11 }}>
                Tus pagos en PantiCoins nunca mencionan términos para adultos. Empaque termosellado al vacío neutro.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* ========================================================
          TAB 2: MI PERFIL & DATOS
      ======================================================== */}
      {modalTab === 'profile' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3.5, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
            <Avatar src={currentUser.avatar} sx={{ width: 64, height: 64, border: '3px solid #FBCFE8' }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822' }}>
                {currentUser.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 700, display: 'block' }}>
                @{currentUser.username} · Rol: {currentUser.role === 'creator' ? 'Creadora VIP' : 'Fan VIP'}
              </Typography>
              <Chip
                label={`Plan: ${currentUser.plan.toUpperCase()}`}
                size="small"
                sx={{ mt: 0.8, bgcolor: '#FEF08A', color: '#854D0E', fontWeight: 900, fontSize: 10, height: 20 }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block' }}>
                Saldo de PantiCoins
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#8A6D1E', mt: 0.5 }}>
                {currentUser.coins} C
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block' }}>
                Vendedoras Seguidas
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#BE185D', mt: 0.5 }}>
                {currentUser.followingCreatorIds.length}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* ========================================================
          TAB 3: CAMBIAR USUARIO / LOGIN
      ======================================================== */}
      {modalTab === 'switch' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Quick Access Switchers */}
          <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF0F5', border: '1px solid #FBCFE8', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#BE185D', display: 'block', mb: 1 }}>
              ⚡ Acceso Rápido de Demostración:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Button
                onClick={() => handleQuickSwitch('fan')}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 2, fontSize: 11, fontWeight: 700, borderColor: '#F472B6', color: '#BE185D', bgcolor: '#FFF' }}
              >
                Entrar como Fan Gold
              </Button>
              <Button
                onClick={() => handleQuickSwitch('creator')}
                size="small"
                variant="contained"
                sx={{ borderRadius: 2, fontSize: 11, fontWeight: 800, bgcolor: '#D4AF37', color: '#2D1822', '&:hover': { bgcolor: '#B88B22' } }}
              >
                Entrar como Creadora VIP
              </Button>
            </Box>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                type="button"
                onClick={() => setAuthMode('login')}
                variant={authMode === 'login' ? 'contained' : 'outlined'}
                size="small"
                sx={{ flex: 1, borderRadius: 2, fontSize: 11, bgcolor: authMode === 'login' ? '#BE185D' : '#FFF', color: authMode === 'login' ? '#FFF' : '#BE185D' }}
              >
                Iniciar Sesión
              </Button>
              <Button
                type="button"
                onClick={() => setAuthMode('register')}
                variant={authMode === 'register' ? 'contained' : 'outlined'}
                size="small"
                sx={{ flex: 1, borderRadius: 2, fontSize: 11, bgcolor: authMode === 'register' ? '#BE185D' : '#FFF', color: authMode === 'register' ? '#FFF' : '#BE185D' }}
              >
                Nuevo Registro
              </Button>
            </Box>

            {authMode === 'register' && (
              <TextField
                fullWidth
                size="small"
                label="Nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            )}

            <TextField
              fullWidth
              size="small"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              size="small"
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdultConfirmed}
                  onChange={e => setIsAdultConfirmed(e.target.checked)}
                  size="small"
                  sx={{ color: '#E05D84', '&.Mui-checked': { color: '#E05D84' } }}
                />
              }
              label={
                <Typography variant="caption" sx={{ color: '#4A2A38', fontSize: 11 }}>
                  Certifico que tengo <strong>18 años o más</strong> y acepto las políticas.
                </Typography>
              }
            />

            {feedback && (
              <Alert severity="error" sx={{ py: 0.5, fontSize: 11, borderRadius: 2 }}>
                {feedback}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: 3,
                fontWeight: 800,
                bgcolor: '#E05D84',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#BE185D' },
              }}
            >
              {authMode === 'login' ? 'Acceder' : 'Registrar'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Footer Note */}
      <Box sx={{ mt: 2.5, pt: 1.5, borderTop: '1px solid #FCE7F3', textAlign: 'center', color: '#7A5868', fontSize: 11 }}>
        🔒 Pantilibre · Discreción garantizada en todos los pedidos y navegación.
      </Box>
    </Dialog>
  );
};
