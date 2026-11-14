import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { PantilibreLogo } from './PantilibreLogo';
import {
  signIn,
  signUp,
  getFriendlyAuthError,
  sendPasswordReset,
  changePassword,
  resendConfirmationEmail,
  getCurrentAuthStatus
} from '../services/authService';
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
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Close,
  Person,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Shield as ShieldIcon,
  Key as KeyIcon
} from '@mui/icons-material';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginAs: (user: UserProfile) => void;
  onLogout?: () => void;
  initialTab?: 'login' | 'register' | 'account' | 'reset';
  initialAuthMode?: 'login' | 'register';
}

type ModalTab = 'login' | 'register' | 'account' | 'forgot' | 'reset' | 'verify';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginAs,
  onLogout,
  initialTab,
  initialAuthMode
}) => {
  const [modalTab, setModalTab] = useState<ModalTab>(initialTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [asCreator, setAsCreator] = useState(false);
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ severity: 'error' | 'success'; text: string } | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ email: string; confirmed: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setModalTab(initialTab || 'login');
      if (initialAuthMode) setModalTab(initialAuthMode);
      setFeedback(null);
      setShowPassword(false);
      if (currentUser) {
        void getCurrentAuthStatus().then(status => {
          if (status) {
            setEmailStatus({ email: status.email, confirmed: status.emailConfirmed });
            if (initialTab === 'reset') setEmail(status.email);
          }
        });
      }
    }
  }, [isOpen, initialTab, initialAuthMode, currentUser]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setAsCreator(false);
    setIsAdultConfirmed(false);
    setShowPassword(false);
    setFeedback(null);
  };

  const handleBackToLogin = () => {
    setModalTab('login');
    setFeedback(null);
  };

  const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = email.trim();

    if (modalTab === 'register' || modalTab === 'login') {
      if (!isAdultConfirmed) {
        setFeedback({ severity: 'error', text: 'Debes confirmar ser mayor de 18 años para acceder a Pantilibre.' });
        return;
      }
      if (!isEmailValid(emailTrimmed)) {
        setFeedback({ severity: 'error', text: 'Escribe un correo electrónico válido.' });
        return;
      }
      if (modalTab === 'register') {
        const usernameTrimmed = username.trim();
        if (usernameTrimmed.length < 3 || usernameTrimmed.length > 20) {
          setFeedback({ severity: 'error', text: 'El nombre de usuario debe tener entre 3 y 20 caracteres.' });
          return;
        }
        if (!/^[a-zA-Z0-9._]+$/.test(usernameTrimmed)) {
          setFeedback({ severity: 'error', text: 'El nombre de usuario solo puede contener letras, números, puntos y guiones bajos.' });
          return;
        }
        if (password.length < 8) {
          setFeedback({ severity: 'error', text: 'La contraseña debe tener al menos 8 caracteres.' });
          return;
        }
      }
    }

    setBusy(true);
    setFeedback(null);
    try {
      if (modalTab === 'register') {
        const user = await signUp(emailTrimmed, password, username.trim(), asCreator);
        onLoginAs(user);
        onClose();
      } else if (modalTab === 'login') {
        const user = await signIn(emailTrimmed, password);
        onLoginAs(user);
        onClose();
      } else if (modalTab === 'forgot') {
        if (!isEmailValid(emailTrimmed)) {
          setFeedback({ severity: 'error', text: 'Escribe un correo electrónico válido.' });
          setBusy(false);
          return;
        }
        await sendPasswordReset(emailTrimmed);
        setFeedback({ severity: 'success', text: 'Te enviamos un correo con un enlace para restablecer tu contraseña.' });
      } else if (modalTab === 'reset') {
        if (password.length < 8) {
          setFeedback({ severity: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
          setBusy(false);
          return;
        }
        await changePassword(password);
        setFeedback({ severity: 'success', text: 'Contraseña actualizada con éxito. Ya puedes iniciar sesión.' });
        setTimeout(() => handleBackToLogin(), 1200);
      } else if (modalTab === 'verify') {
        if (emailStatus?.email && !emailStatus.confirmed) {
          await resendConfirmationEmail(emailStatus.email);
          setFeedback({ severity: 'success', text: 'Correo de confirmación reenviado. Revisa tu bandeja de entrada.' });
        }
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Error de autenticación';
      setFeedback({ severity: 'error', text: getFriendlyAuthError(raw) });
    } finally {
      setBusy(false);
    }
  };

  const tabValue = (modalTab === 'account' || modalTab === 'verify') ? 'account'
    : (modalTab === 'forgot' || modalTab === 'reset') ? 'login'
    : modalTab;

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
          value={tabValue}
          onChange={(_, val: string) => { setModalTab(val as ModalTab); setFeedback(null); }}
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

          <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2D1822', mb: 1 }}>
              Seguridad de la cuenta
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" startIcon={<KeyIcon />} onClick={() => setModalTab('reset')}
                sx={{ justifyContent: 'flex-start', borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}>
                Cambiar contraseña
              </Button>
              {emailStatus && !emailStatus.confirmed && (
                <Alert severity="warning" sx={{ py: 0.5, fontSize: 11.5, borderRadius: 2 }}>
                  Tu correo aún no está confirmado. Confírmalo para proteger tu cuenta.
                </Alert>
              )}
              <Button variant="outlined" startIcon={<EmailIcon />} onClick={() => setModalTab('verify')}
                sx={{ justifyContent: 'flex-start', borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}>
                Confirmar correo electrónico
              </Button>
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

      {modalTab === 'verify' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822' }}>
            Confirmación de correo
          </Typography>
          {emailStatus?.confirmed ? (
            <Alert severity="success" sx={{ borderRadius: 2.5 }}>
              Tu correo ya está confirmado.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2.5 }}>
              Te enviaremos un enlace de confirmación a tu correo registrado.
            </Alert>
          )}
          {feedback && (
            <Alert severity={feedback.severity} sx={{ py: 0.5, fontSize: 11, borderRadius: 2 }}>
              {feedback.text}
            </Alert>
          )}
          <Button
            variant="contained" onClick={handleSubmit as unknown as () => void} disabled={busy || emailStatus?.confirmed}
            sx={{ py: 1.2, borderRadius: 3, fontWeight: 800, bgcolor: '#E05D84', color: '#FFFFFF', '&:hover': { bgcolor: '#BE185D' } }}
          >
            {busy ? 'Enviando...' : 'Reenviar correo de confirmación'}
          </Button>
          <Button onClick={() => setModalTab('account')} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Volver a Mi Cuenta
          </Button>
        </Box>
      )}

      {modalTab !== 'account' && modalTab !== 'verify' && (
        <DialogContent sx={{ px: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {modalTab !== 'reset' && (
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF0F5', border: '1px solid #FBCFE8', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ShieldIcon sx={{ color: '#BE185D', fontSize: 22 }} />
                <Typography variant="caption" sx={{ color: '#4A2A38', fontSize: 11.5, fontWeight: 600 }}>
                  Contenido para adultos (+18). Discreción total en pagos y envíos.
                </Typography>
              </Box>
            )}

            {modalTab === 'forgot' && (
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822' }}>
                Recuperar contraseña
              </Typography>
            )}

            {modalTab === 'reset' && (
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822' }}>
                Cambiar contraseña
              </Typography>
            )}

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
              </>
            )}

            <TextField
              fullWidth size="small" label="Correo electrónico" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required={modalTab !== 'reset'}
              disabled={modalTab === 'reset'}
              sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              fullWidth size="small" label={modalTab === 'reset' ? 'Nueva contraseña' : 'Contraseña'}
              type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} required
              helperText={modalTab === 'register' || modalTab === 'reset'
                ? 'Mínimo 8 caracteres con mayúsculas, números y símbolos (ej. Panti!2026).'
                : undefined}
              sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(v => !v)} edge="end" size="small">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            {(modalTab === 'register' || modalTab === 'login') && (
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
            )}

            {feedback && (
              <Alert severity={feedback.severity} sx={{ py: 0.5, fontSize: 11, borderRadius: 2 }}>
                {feedback.text}
              </Alert>
            )}

            <Button
              type="submit" fullWidth variant="contained" disabled={busy}
              sx={{ py: 1.2, borderRadius: 3, fontWeight: 800, bgcolor: '#E05D84', color: '#FFFFFF', '&:hover': { bgcolor: '#BE185D' } }}
            >
              {busy ? 'Conectando...'
                : modalTab === 'register' ? 'Crear mi cuenta'
                : modalTab === 'forgot' ? 'Enviar enlace de recuperación'
                : modalTab === 'reset' ? 'Actualizar contraseña'
                : 'Acceder'}
            </Button>

            {modalTab === 'login' && (
              <Button type="button" onClick={() => { setModalTab('forgot'); setFeedback(null); }} sx={{ textTransform: 'none', fontWeight: 700, color: '#BE185D' }}>
                ¿Olvidaste tu contraseña?
              </Button>
            )}

            {modalTab === 'forgot' && (
              <Button type="button" onClick={handleBackToLogin} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Volver a Iniciar Sesión
              </Button>
            )}

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
