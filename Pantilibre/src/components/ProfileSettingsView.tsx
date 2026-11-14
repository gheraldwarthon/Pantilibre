import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Badge as BadgeIcon,
  PhotoCamera,
  Save,
  Logout,
  DataSaverOn,
  NotificationsActive,
  Verified,
  WorkspacePremium
} from '@mui/icons-material';
import type { UserProfile } from '../types';
import { fetchMyProfile, updateMyProfile } from '../services/dataService';

interface ProfileSettingsViewProps {
  user: UserProfile;
  onBack: () => void;
  onUpdated: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenPlans: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  user,
  onBack,
  onUpdated,
  onLogout,
  onOpenPlans
}) => {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ severity: 'error' | 'success'; text: string } | null>(null);

  const roleLabel = user.role === 'admin' ? 'Administrador' : user.role === 'creator' ? 'Vendedora' : 'Fan';

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    if (trimmedName.length < 2 || trimmedName.length > 40) {
      setFeedback({ severity: 'error', text: 'El nombre debe tener entre 2 y 40 caracteres.' });
      return;
    }
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      setFeedback({ severity: 'error', text: 'El nombre de usuario debe tener entre 3 y 20 caracteres.' });
      return;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(trimmedUsername)) {
      setFeedback({ severity: 'error', text: 'El nombre de usuario solo admite letras, números, puntos y guiones bajos.' });
      return;
    }
    if (avatarUrl.trim() && !/^https?:\/\//.test(avatarUrl.trim())) {
      setFeedback({ severity: 'error', text: 'La foto de perfil debe ser un enlace que empiece por https://...' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      await updateMyProfile({
        name: trimmedName,
        username: trimmedUsername,
        avatarUrl: avatarUrl.trim()
      });
      const fresh = await fetchMyProfile();
      onUpdated(fresh);
      setFeedback({ severity: 'success', text: '¡Cambios guardados con éxito!' });
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Error al guardar';
      const friendly = raw.includes('duplicate key') || raw.includes('unique')
        ? 'Ese nombre de usuario ya está en uso. Elige otro.'
        : raw;
      setFeedback({ severity: 'error', text: friendly });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDataSaver = async () => {
    const next = !user.dataSaverMode;
    try {
      await updateMyProfile({ dataSaverMode: next });
      onUpdated({ ...user, dataSaverMode: next });
    } catch {
      setFeedback({ severity: 'error', text: 'No se pudo guardar la preferencia.' });
    }
  };

  const handleToggleNotifications = async () => {
    const next = !user.interactiveNotifications;
    try {
      await updateMyProfile({ interactiveNotifications: next });
      onUpdated({ ...user, interactiveNotifications: next });
    } catch {
      setFeedback({ severity: 'error', text: 'No se pudo guardar la preferencia.' });
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFF8FA', pb: 12 }}>
      {/* Sticky sub-bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 64,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #FCE7F3',
          px: { xs: 2, sm: 4, md: 6 },
          py: 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Button
          onClick={onBack}
          startIcon={<ArrowBack />}
          variant="outlined"
          size="small"
          sx={{
            borderColor: '#FBCFE8',
            color: '#831843',
            fontWeight: 700,
            borderRadius: 3,
            textTransform: 'none',
            px: 2,
            '&:hover': { bgcolor: '#FDF2F8', borderColor: '#F472B6' }
          }}
        >
          Volver
        </Button>
        <Typography sx={{ fontWeight: 900, color: '#831843', fontSize: { xs: 15, sm: 17 } }}>
          Configuración de Perfil
        </Typography>
        <Box sx={{ width: 90 }} />
      </Box>

      <Box sx={{ maxWidth: 760, mx: 'auto', px: { xs: 2, sm: 3 }, mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Identity summary */}
        <Card sx={{ borderRadius: 4, border: '1.5px solid #FCE7F3', boxShadow: '0 8px 28px rgba(224, 93, 132, 0.10)' }}>
          <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
            <Avatar src={user.avatar} sx={{ width: 84, height: 84, border: '3px solid #FBCFE8' }} />
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography sx={{ fontWeight: 900, color: '#2D1822', fontSize: 19 }}>{user.name}</Typography>
              <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 700, display: 'block' }}>
                @{user.username} · {roleLabel}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.8, mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<WorkspacePremium sx={{ fontSize: 14, color: '#854D0E !important' }} />}
                  label={`Plan: ${user.plan.toUpperCase()}`}
                  size="small"
                  sx={{ bgcolor: '#FEF08A', color: '#854D0E', fontWeight: 900, fontSize: 10, height: 22 }}
                />
                {user.sellerTier && (
                  <Chip
                    icon={<Verified sx={{ fontSize: 14, color: user.sellerTier === 'vip' ? '#2D1822 !important' : '#BE185D !important' }} />}
                    label={user.sellerTier === 'vip' ? 'Vendedora VIP' : 'Vendedora FREE'}
                    size="small"
                    sx={{
                      bgcolor: user.sellerTier === 'vip' ? '#D4AF37' : '#FFF0F5',
                      color: user.sellerTier === 'vip' ? '#2D1822' : '#BE185D',
                      fontWeight: 900, fontSize: 10, height: 22
                    }}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', px: 2, py: 1, borderRadius: 3, bgcolor: '#FFF0F5', border: '1px solid #FBCFE8' }}>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontWeight: 700 }}>PantiCoins</Typography>
              <Typography sx={{ fontWeight: 900, color: '#8A6D1E', fontSize: 20 }}>{user.coins} C</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Editable profile data */}
        <Card sx={{ borderRadius: 4, border: '1.5px solid #FCE7F3', boxShadow: '0 8px 28px rgba(224, 93, 132, 0.10)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person sx={{ color: '#BE185D', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 900, color: '#2D1822', fontSize: 16 }}>Datos de tu perfil</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#FFFFFF', borderRadius: 3, border: '1px solid rgba(0, 0, 0, 0.23)', px: 1.4, '&:hover': { borderColor: '#2D1822' }, '&:focus-within': { borderColor: '#BE185D', borderWidth: 2 } }}>
                <BadgeIcon sx={{ color: '#E05D84', fontSize: 20, mr: 1 }} />
                <TextField
                  fullWidth size="small" label="Nombre visible" value={name}
                  onChange={e => setName(e.target.value)}
                  sx={{ bgcolor: 'transparent', '& .MuiOutlinedInput-root': { borderRadius: 3 }, '& fieldset': { borderColor: 'transparent' } }}
                />
              </Box>
              <TextField
                fullWidth size="small" label="Nombre de usuario" value={username}
                onChange={e => setUsername(e.target.value)}
                helperText="Letras, números, puntos y guiones bajos. Será tu @identificador público."
                sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#FFFFFF', borderRadius: 3, border: '1px solid rgba(0, 0, 0, 0.23)', px: 1.4, '&:hover': { borderColor: '#2D1822' }, '&:focus-within': { borderColor: '#BE185D', borderWidth: 2 } }}>
                <PhotoCamera sx={{ color: '#E05D84', fontSize: 20, mr: 1 }} />
                <TextField
                  fullWidth size="small" label="Foto de perfil (URL de imagen)"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  sx={{ bgcolor: 'transparent', '& .MuiOutlinedInput-root': { borderRadius: 3 }, '& fieldset': { borderColor: 'transparent' } }}
                />
              </Box>

              {feedback && (
                <Alert severity={feedback.severity} sx={{ borderRadius: 2, fontSize: 12 }}>
                  {feedback.text}
                </Alert>
              )}

              <Button
                onClick={() => void handleSave()}
                disabled={saving}
                variant="contained"
                startIcon={<Save />}
                sx={{
                  alignSelf: 'flex-start',
                  py: 1.2, px: 4, borderRadius: 3, fontWeight: 900, textTransform: 'none',
                  bgcolor: '#E05D84', color: '#FFF', '&:hover': { bgcolor: '#BE185D' }
                }}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card sx={{ borderRadius: 4, border: '1.5px solid #FCE7F3', boxShadow: '0 8px 28px rgba(224, 93, 132, 0.10)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DataSaverOn sx={{ color: '#BE185D', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 900, color: '#2D1822', fontSize: 16 }}>Preferencias</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', mb: 2 }}>
              Se guardan automáticamente en tu cuenta.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#2D1822', fontSize: 14 }}>Modo Ahorro de Datos</Typography>
                  <Typography variant="caption" sx={{ color: '#7A5868' }}>
                    Comprime las imágenes para gastar menos datos.
                  </Typography>
                </Box>
                <Switch checked={Boolean(user.dataSaverMode)} onChange={() => void handleToggleDataSaver()} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#E05D84' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#E05D84' } }} />
              </Box>
              <Divider sx={{ borderColor: '#FCE7F3' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#2D1822', fontSize: 14, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <NotificationsActive sx={{ fontSize: 17, color: '#E05D84' }} /> Avisos Flotantes en Vivo
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#7A5868' }}>
                    Muestra avisos emergentes cuando una vendedora publica.
                  </Typography>
                </Box>
                <Switch checked={Boolean(user.interactiveNotifications)} onChange={() => void handleToggleNotifications()} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#E05D84' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#E05D84' } }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Membership shortcut + logout */}
        <Card sx={{ borderRadius: 4, border: '1.5px solid #FCE7F3', boxShadow: '0 8px 28px rgba(224, 93, 132, 0.10)' }}>
          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              onClick={onOpenPlans}
              variant="contained"
              sx={{
                alignSelf: 'flex-start', borderRadius: 3, fontWeight: 900, textTransform: 'none',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', color: '#2D1822',
                '&:hover': { background: 'linear-gradient(135deg, #B8860B 0%, #8A6D1E 100%)' }
              }}
            >
              Mejorar membresía / Comprar PantiCoins
            </Button>
            <Button
              onClick={onLogout}
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              sx={{ alignSelf: 'flex-start', borderRadius: 3, fontWeight: 800, textTransform: 'none' }}
            >
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
