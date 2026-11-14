import React, { useState } from 'react';
import { PrivateGallery, UserProfile } from '../types';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Button,
  Dialog,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Lock,
  LockOpen,
  Visibility,
  AutoAwesome,
  PhotoCamera,
  Videocam,
  Favorite,
  Close
} from '@mui/icons-material';
import { canAccessContent } from '../utils/platformLogic';

interface PrivateGalleriesSectionProps {
  galleries: PrivateGallery[];
  user: UserProfile;
  onUnlockGallery: (gallery: PrivateGallery) => void;
  onOpenPlans: () => void;
}

export const PrivateGalleriesSection: React.FC<PrivateGalleriesSectionProps> = ({
  galleries,
  user,
  onUnlockGallery,
  onOpenPlans
}) => {
  const [activeViewerGallery, setActiveViewerGallery] = useState<PrivateGallery | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleOpenGallery = (gallery: PrivateGallery) => {
    const hasAccess = canAccessContent(user, {
      isLocked: gallery.isLocked,
      coinPrice: gallery.coinPrice,
      contentId: gallery.id
    });

    if (hasAccess) {
      setActiveViewerGallery(gallery);
      setActivePhotoIndex(0);
    } else {
      onUnlockGallery(gallery);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: 5,
        bgcolor: '#FFF8FA',
        borderBottom: '1px solid #FCE7F3',
      }}
    >
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Section Title */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            mb: 3.5,
            gap: 1.5,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 2.5,
                  bgcolor: '#FFF0F5',
                  border: '1px solid #FBCFE8',
                  color: '#E05D84',
                  display: 'flex',
                }}
              >
                <AutoAwesome sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D1822', fontSize: { xs: 18, sm: 22 } }}>
                Galerías Multimedia Privadas
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#7A5868', mt: 0.5, fontSize: { xs: 12, sm: 13 } }}>
              Sets fotográficos y videos de alta resolución sin censura. Acceso exclusivo con PantiCoins o Membresía Gold / Black.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: 12 }}>
            <Chip
              label="Pase VIP Black / Gold"
              size="small"
              sx={{ bgcolor: '#FFFDF0', border: '1px solid #F5DE98', color: '#8A6D1E', fontWeight: 700 }}
            />
            <Button
              onClick={onOpenPlans}
              size="small"
              sx={{ color: '#BE185D', fontWeight: 700, textDecoration: 'underline' }}
            >
              Mejorar a VIP Black
            </Button>
          </Box>
        </Box>

        {/* Gallery Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {galleries.map(gallery => {
            const hasAccess = canAccessContent(user, {
              isLocked: gallery.isLocked,
              coinPrice: gallery.coinPrice,
              contentId: gallery.id
            });

            return (
              <Card
                key={gallery.id}
                elevation={0}
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 4,
                  border: '1px solid #FCE7F3',
                  boxShadow: '0 4px 18px -2px rgba(224, 93, 132, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  transition: 'all 0.25s',
                  '&:hover': {
                    borderColor: '#E05D84',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 28px -4px rgba(224, 93, 132, 0.16)',
                  },
                }}
              >
                {/* Media Image with Blur / Lock */}
                <Box sx={{ position: 'relative', width: '100%', pt: '70%', bgcolor: '#FFF0F5', overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={gallery.coverImage}
                    alt={gallery.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: !hasAccess ? 'blur(10px) brightness(0.85)' : 'none',
                      transform: !hasAccess ? 'scale(1.08)' : 'none',
                      transition: 'transform 0.4s ease',
                    }}
                  />

                  {/* Top Badges */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      right: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      pointerEvents: 'none',
                    }}
                  >
                    <Chip
                      icon={<PhotoCamera sx={{ fontSize: 13, color: '#FFFFFF !important' }} />}
                      label={`${gallery.mediaCount} fotos`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(45, 24, 34, 0.75)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: 10,
                        height: 22,
                      }}
                    />

                    {hasAccess ? (
                      <Chip
                        icon={<LockOpen sx={{ fontSize: 13, color: '#10B981 !important' }} />}
                        label="Desbloqueada"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(236, 253, 245, 0.95)',
                          color: '#065F46',
                          fontWeight: 700,
                          fontSize: 10,
                          height: 22,
                          border: '1px solid #A7F3D0',
                        }}
                      />
                    ) : (
                      <Chip
                        icon={<Lock sx={{ fontSize: 13, color: '#D4AF37 !important' }} />}
                        label={`${gallery.coinPrice} Coins`}
                        size="small"
                        sx={{
                          bgcolor: '#FFFDF0',
                          border: '1px solid #F5DE98',
                          color: '#8A6D1E',
                          fontWeight: 800,
                          fontSize: 10,
                          height: 22,
                        }}
                      />
                    )}
                  </Box>

                  {/* Centered Lock Icon if not unlocked */}
                  {!hasAccess && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        textAlign: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          boxShadow: '0 4px 14px rgba(224, 93, 132, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#D4AF37',
                          mb: 1,
                        }}
                      >
                        <Lock sx={{ fontSize: 24 }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                        Galería Privada VIP
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Content */}
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar
                      src={gallery.creatorAvatar}
                      alt={gallery.creatorName}
                      sx={{ width: 22, height: 22, border: '1px solid #F5DE98' }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#4A2A38' }}>
                      {gallery.creatorName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#D4AF37', fontWeight: 800 }}>
                      · {gallery.creatorBadge}
                    </Typography>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: '#2D1822',
                      fontSize: 13,
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {gallery.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7A5868',
                      fontSize: 11,
                      mt: 0.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 32,
                    }}
                  >
                    {gallery.description}
                  </Typography>
                </CardContent>

                {/* Footer Actions */}
                <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#E05D84', fontSize: 11, fontWeight: 700 }}>
                    <Favorite sx={{ fontSize: 15 }} />
                    <span>{gallery.likesCount}</span>
                  </Box>

                  <Button
                    onClick={() => handleOpenGallery(gallery)}
                    variant="contained"
                    size="small"
                    startIcon={hasAccess ? <Visibility sx={{ fontSize: 15 }} /> : <LockOpen sx={{ fontSize: 15 }} />}
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 2.5,
                      bgcolor: hasAccess ? '#FCE7F3' : '#E05D84',
                      color: hasAccess ? '#BE185D' : '#FFFFFF',
                      '&:hover': {
                        bgcolor: hasAccess ? '#FBCFE8' : '#BE185D',
                      },
                    }}
                  >
                    {hasAccess ? 'Ver Fotos' : `Desbloquear (${gallery.coinPrice} C)`}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      </Box>

      {/* Material UI Gallery Viewer Dialog */}
      {activeViewerGallery && (
        <Dialog
          open={!!activeViewerGallery}
          onClose={() => setActiveViewerGallery(null)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                bgcolor: '#1E141C',
                color: '#FFFFFF',
                borderRadius: 4,
                overflow: 'hidden',
              },
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={activeViewerGallery.creatorAvatar} sx={{ width: 32, height: 32, border: '1.5px solid #D4AF37' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {activeViewerGallery.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Por {activeViewerGallery.creatorName} · {activePhotoIndex + 1} de {activeViewerGallery.fullImages.length}
                </Typography>
              </Box>
            </Box>

            <IconButton onClick={() => setActiveViewerGallery(null)} sx={{ color: '#FFFFFF' }}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: '#000000', minHeight: 380 }}>
            <Box
              component="img"
              src={activeViewerGallery.fullImages[activePhotoIndex]}
              alt="Foto completa"
              sx={{ maxHeight: 480, maxWidth: '100%', objectFit: 'contain', borderRadius: 2 }}
            />
          </Box>

          <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto', bgcolor: '#1E141C' }}>
            {activeViewerGallery.fullImages.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                onClick={() => setActivePhotoIndex(i)}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: activePhotoIndex === i ? '2px solid #D4AF37' : '2px solid transparent',
                  opacity: activePhotoIndex === i ? 1 : 0.6,
                }}
              />
            ))}
          </Box>
        </Dialog>
      )}
    </Box>
  );
};
