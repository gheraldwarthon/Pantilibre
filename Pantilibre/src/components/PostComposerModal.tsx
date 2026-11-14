import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  Chip,
  Avatar,
  Slider,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Close,
  AddPhotoAlternate,
  Lock as LockIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { supabase } from '../services/supabaseClient';
import type { UserProfile } from '../types';

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onPublished: (message: string) => void;
  onError: (message: string) => void;
}

const CATEGORY_OPTIONS = ['lingerie', 'feet', 'latex', 'used_clothes', 'cosplay', 'gorditas', 'mature', 'teens'];

export const PostComposerModal: React.FC<PostComposerModalProps> = ({ isOpen, onClose, user, onPublished, onError }) => {
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [category, setCategory] = useState('lingerie');
  const [isLocked, setIsLocked] = useState(false);
  const [coinPrice, setCoinPrice] = useState(10);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoLimit = user.photoLimit ?? null;
  const remaining = photoLimit === null ? null : Math.max(0, photoLimit - imageUrls.length);

  const addUrl = () => {
    const url = newUrl.trim();
    if (!url) return;
    if (remaining !== null && imageUrls.length >= photoLimit!) {
      setError(`Tu plan ${user.sellerTier === 'vip' ? 'VIP' : 'FREE'} permite ${photoLimit} foto(s) por publicación. Contacta al administrador para ampliarlo.`);
      return;
    }
    setImageUrls(prev => [...prev, url]);
    setNewUrl('');
    setError(null);
  };

  const removeUrl = (idx: number) => setImageUrls(prev => prev.filter((_, i) => i !== idx));

  const handlePublish = async () => {
    if (!content.trim() && imageUrls.length === 0) {
      setError('Escribe algo o añade al menos una foto.');
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('posts').insert({
        creator_id: user.id,
        content: content.trim(),
        image_urls: imageUrls,
        category,
        is_locked: isLocked,
        coin_price: isLocked ? coinPrice : 0
      });
      if (insertError) throw insertError;
      onPublished('¡Publicación enviada al muro VIP!');
      setContent('');
      setImageUrls([]);
      setIsLocked(false);
      setCoinPrice(10);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al publicar';
      setError(message);
      onError(message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 5, bgcolor: '#FFF8FA', border: '1.5px solid #FCE7F3' } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={user.avatar} sx={{ width: 40, height: 40, border: '2px solid #FBCFE8' }} />
          <Box>
            <Typography sx={{ fontWeight: 900, color: '#2D1822', fontSize: 15 }}>Nueva publicación</Typography>
            <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 700 }}>
              {user.sellerTier === 'vip' ? 'Vendedora VIP' : 'Vendedora FREE'}
              {photoLimit !== null ? ` · ${remaining} de ${photoLimit} fotos restantes` : ' · fotos ilimitadas'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}><Close /></IconButton>
      </Box>

      <DialogContent sx={{ px: 2.5, pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            multiline
            minRows={3}
            fullWidth
            placeholder="¿Qué quieres compartir con tus fans hoy?"
            value={content}
            onChange={e => setContent(e.target.value)}
            sx={{ bgcolor: '#FFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AddPhotoAlternate sx={{ fontSize: 16 }} /> Fotos ({imageUrls.length}
                {photoLimit !== null ? `/${photoLimit}` : ''})
              </Typography>
              {photoLimit !== null && (
                <Chip
                  label={user.sellerTier === 'vip' ? 'Plan VIP' : 'Plan FREE'}
                  size="small"
                  sx={{ bgcolor: user.sellerTier === 'vip' ? '#D4AF37' : '#FFF0F5', color: user.sellerTier === 'vip' ? '#2D1822' : '#BE185D', fontWeight: 900, fontSize: 10, height: 20 }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="URL de la imagen (https://...)"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                sx={{ bgcolor: '#FFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Button variant="contained" onClick={addUrl} sx={{ borderRadius: 3, fontWeight: 800, whiteSpace: 'nowrap' }}>
                Añadir
              </Button>
            </Box>
            {imageUrls.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                {imageUrls.map((url, idx) => (
                  <Box key={`${url}-${idx}`} sx={{ position: 'relative' }}>
                    <Box component="img" src={url} sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 3, border: '2px solid #FBCFE8' }} />
                    <IconButton size="small" onClick={() => removeUrl(idx)}
                      sx={{ position: 'absolute', top: -6, right: -6, bgcolor: '#BE185D', color: '#FFF', '&:hover': { bgcolor: '#9D174D' }, width: 22, height: 22 }}>
                      <Close sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
            {remaining === 0 && (
              <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2, fontSize: 12 }}>
                Has alcanzado tu límite de {photoLimit} fotos. El administrador puede ampliarlo desde el Centro de Control.
              </Alert>
            )}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822', display: 'block', mb: 0.5 }}>Categoría</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {CATEGORY_OPTIONS.map(cat => (
                <Chip
                  key={cat}
                  label={cat.replace('_', ' ')}
                  size="small"
                  onClick={() => setCategory(cat)}
                  sx={{
                    fontWeight: 700, fontSize: 11, textTransform: 'capitalize',
                    bgcolor: category === cat ? '#E05D84' : '#FFF0F5',
                    color: category === cat ? '#FFF' : '#BE185D'
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF', border: '1.5px solid #FCE7F3' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LockIcon sx={{ fontSize: 16 }} /> Publicación bloqueada (solo con PantiCoins)
              </Typography>
              <Chip label={isLocked ? 'DESBLOQUEO PAGADO' : 'GRATUITA'} size="small"
                sx={{ bgcolor: isLocked ? '#FEE2E2' : '#ECFDF5', color: isLocked ? '#991B1B' : '#065F46', fontWeight: 900, fontSize: 10, height: 20 }} />
            </Box>
            {isLocked && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#7A5868', fontWeight: 700 }}>Precio en PantiCoins</Typography>
                <Slider
                  value={coinPrice}
                  min={1}
                  max={100}
                  onChange={(_, v: number | number[]) => setCoinPrice(v as number)}
                  valueLabelDisplay="auto"
                  sx={{ color: '#E05D84' }}
                />
                <TextField
                  size="small"
                  type="number"
                  value={coinPrice}
                  onChange={e => setCoinPrice(Number(e.target.value))}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">Coins</InputAdornment>
                    }
                  }}
                  sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
            )}
            <Button size="small" variant={isLocked ? 'contained' : 'outlined'} onClick={() => setIsLocked(prev => !prev)}
              sx={{ mt: 1, borderRadius: 2, fontSize: 12, fontWeight: 800 }}>
              {isLocked ? 'Quitar bloqueo' : 'Bloquear contenido'}
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ borderRadius: 2, fontSize: 12 }}>{error}</Alert>}

          <Tooltip title={user.sellerTier ? '' : 'El administrador debe activarte como vendedora'}>
            <span>
              <Button
                fullWidth
                variant="contained"
                disabled={publishing || !user.sellerTier}
                onClick={() => void handlePublish()}
                startIcon={<SendIcon />}
                sx={{ py: 1.3, borderRadius: 3, fontWeight: 900, bgcolor: '#E05D84', color: '#FFF', '&:hover': { bgcolor: '#BE185D' } }}
              >
                {publishing ? 'Publicando...' : 'Publicar en el muro'}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
