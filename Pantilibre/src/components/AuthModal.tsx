import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { PantilibreLogo } from './PantilibreLogo';
import { signIn, signUp } from '../services/authService';
import {
  Dialog,
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
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Close,
  Person,
  Lock,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginAs: (user: UserProfile) => void;
  onLogout?: () => void;
  initialTab?: 'login' | 'register' | 'account';
  initialAuthMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginAs,
  onLogout,
  initialTab,
  initialAuthMode
}) => {
  const [modalTab, setModalTab] = useState<'login' | 'register' | 'account'>(initialTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [asCreator, setAsCreator] = useState(false);
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ severity: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setModalTab(initialTab || 'login');
      if (initialAuthMode) setModalTab(initialAuthMode);
      setFeedback(null);
    }
  }, [isOpen, initialTab, initialAuthMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdultConfirmed) {
      setFeedback({ severity: 'error', text: 'Debes confirmar ser mayor de 18 años para acceder a Pantilibre.' });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      if (modalTab === 'register') {
        if (!username.trim()) {
          setFeedback({ severity: 'error', text: 'Elige un nombre de usuario.' });
          return;
        }
        const user = await signUp(email.trim(), password, username.trim(), asCreator);
        onLoginAs(user);
        onClose();
      } else {
        const user = await signIn(email.trim(), password);
        onLoginAs(user);
        onClose();
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Error de autenticación';
      const friendly = raw.includes('Invalid login credentials')
        ? 'Correo o contraseña incorrectos.'
        : raw.includes('already registered')
        ? 'Ese correo ya está registrado. Inicia sesión.'
        : raw.includes('Password')
        ? 'La contraseña debe tener al menos 6 caracteres.'
        : raw;
      setFeedback({ severity: 'error', text: friendly });
    } finally {
      setBusy(false);
    }
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <PantilibreLogo size="sm" />
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#7A5868', '&:hover': { color: '#BE185D' } }}>
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ borderBottom: '1px solid #FCE7F3', mb: 2.5 }}>
        <Tabs
          value={modalTab}
          onChange={(_, val: 'login' | 'register' | 'account') => setModalTab(val)}
          variant="fullWidth"
          sx={{
            minHeight: 42,
            '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: 13, minHeight: 42 },
            '& .Mui-selected': { color: '#BE185D !important' },
            '& .MuiTabs-indicator': { bgcolor: '#BE185D', height: 2.5 },
          }}
        >
          <Tab value="login" label="Iniciar Sesión" icon={<LoginIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab value="register" label="Crear Cuenta" icon={<PersonAddIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          {currentUser && <Tab value="account" label="Mi Cuenta" icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" />}
        </Tabs>
      </Box>

      {modalTab === 'account' && currentUser && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 3.5, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
            <Avatar src={currentUser.avatar} sx={{ width: 64, height: 64, border: '3px solid #FBCFE8' }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822' }}>
                {currentUser.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 700, display: 'block' }}>
                @{currentUser.username} · Rol: {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'creator' ? 'Vendedora' : 'Fan'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.8 }}>
                <Chip label={`Plan: ${currentUser.plan.toUpperCase()}`} size="small"
                  sx={{ bgcolor: '#FEF08A', color: '#854D0E', fontWeight: 900, fontSize: 10, height: 20 }} />
                {currentUser.sellerTier && (
                  <Chip label={currentUser.sellerTier === 'vip' ? 'Vendedora VIP' : 'Vendedora FREE'} size="small"
                    sx={{ bgcolor: currentUser.sellerTier === 'vip' ? '#D4AF37' : '#FFF0F5', color: currentUser.sellerTier === 'vip' ? '#2D1822' : '#BE185D', fontWeight: 900, fontSize: 10, height: 20 }} />
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block' }}>Saldo de PantiCoins</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#8A6D1E', mt: 0.5 }}>{currentUser.coins} C</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block' }}>Vendedoras seguidas</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#BE185D', mt: 0.5 }}>{currentUser.followingCreatorIds.length}</Typography>
            </Box>
          </Box>

          {onLogout && (
            <Button variant="outlined" color="error" onClick={() => { onLogout(); onClose(); }}
              sx={{ borderRadius: 3, fontWeight: 800 }}>
              Cerrar sesión
            </Button>
          )}
        </Box>
      )}

      {modalTab !== 'account' && (
        <DialogContent sx={{ px: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF0F5', border: '1px solid #FBCFE8', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShieldIcon sx={{ color: '#BE185D', fontSize: 22 }} />
              <Typography variant="caption" sx={{ color: '#4A2A38', fontSize: 11.5, fontWeight: 600 }}>
                Contenido para adultos (+18). Discreción total en pagos y envíos.
              </Typography>
            </Box>

            {modalTab === 'register' && (
              <>
                <TextField
                  fullWidth size="small" label="Nombre de usuario" value={username}
                  onChange={e => setUsername(e.target.value)} required
                  sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button type="button" onClick={() => setAsCreator(false)}
                    variant={!asCreator ? 'contained' : 'outlined'} size="small"
                    sx={{ flex: 1, borderRadius: 2, fontSize: 11, bgcolor: !asCreator ? '#BE185D' : '#FFF', color: !asCreator ? '#FFF' : '#BE185D' }}>
                    Soy Fan
                  </Button>
                  <Button type="button" onClick={() => setAsCreator(true)}
                    variant={asCreator ? 'contained' : 'outlined'} size="small"
                    sx={{ flex: 1, borderRadius: 2, fontSize: 11, bgcolor: asCreator ? '#D4AF37' : '#FFF', color: asCreator ? '#2D1822' : '#8A6D1E' }}>
                    Quiero vender (creadora)
                  </Button>
                </Box>
                {asCreator && (
                  <Alert severity="info" sx={{ borderRadius: 2, fontSize: 11.5 }}>
                    Tu cuenta de vendedora empieza en plan <strong>FREE</strong> (2 fotos por publicación). El administrador puede promoverte a VIP con más capacidad desde el Centro de Control.
                  </Alert>
                )}
              </>
            )}

            <TextField
              fullWidth size="small" label="Correo electrónico" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required
              sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              fullWidth size="small" label="Contraseña" type="password" value={password}
              onChange={e => setPassword(e.target.value)} required
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
              <Alert severity={feedback.severity} sx={{ py: 0.5, fontSize: 11, borderRadius: 2 }}>
                {feedback.text}
              </Alert>
            )}

            <Button
              type="submit" fullWidth variant="contained" disabled={busy}
              sx={{ py: 1.2, borderRadius: 3, fontWeight: 800, bgcolor: '#E05D84', color: '#FFFFFF', '&:hover': { bgcolor: '#BE185D' } }}
            >
              {busy ? 'Conectando...' : modalTab === 'register' ? 'Crear mi cuenta' : 'Acceder'}
            </Button>

            <Divider sx={{ my: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#9D7387', textAlign: 'center', fontSize: 10.5 }}>
              Al continuar aceptas los términos de Pantilibre. Tu discreción está garantizada.
            </Typography>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};
