import React, { useState } from 'react';
import { Creator, Post, PrivateGallery, StoreItem, UserProfile } from '../types';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Rating
} from '@mui/material';
import {
  Close,
  Verified,
  Star,
  ChatBubble,
  Lock,
  LockOpen,
  ShoppingBag,
  AutoAwesome,
  Favorite
} from '@mui/icons-material';
import { calculateItemDiscount, canAccessContent } from '../utils/platformLogic';

interface CreatorProfileModalProps {
  creator: Creator | null;
  user: UserProfile;
  posts: Post[];
  galleries: PrivateGallery[];
  storeItems: StoreItem[];
  onClose: () => void;
  onOpenChat: (creator: Creator) => void;
  onSendTip: (creatorId: string, creatorName: string, amount: number, message: string) => void;
  onUnlockGallery: (gallery: PrivateGallery) => void;
  onBuyStoreItem: (item: StoreItem) => void;
  onSubscribeCreator: (creator: Creator) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  user,
  posts,
  galleries,
  storeItems,
  onClose,
  onOpenChat,
  onSendTip,
  onUnlockGallery,
  onBuyStoreItem,
  onSubscribeCreator
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'galleries' | 'store' | 'reviews'>('posts');
  const [isFollowing, setIsFollowing] = useState(
    creator ? user.followingCreatorIds.includes(creator.id) : false
  );

  if (!creator) return null;

  const creatorPosts = posts.filter(p => p.creatorId === creator.id);
  const creatorGalleries = galleries.filter(g => g.creatorId === creator.id);
  const creatorStoreItems = storeItems.filter(i => i.creatorId === creator.id);

  return (
    <Dialog
      open={!!creator}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 5,
            bgcolor: '#FFF8FA',
            border: '1px solid #FCE7F3',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(224, 93, 132, 0.18)',
          },
        },
      }}
    >
      {/* Cover Image & Close */}
      <Box sx={{ position: 'relative', height: { xs: 160, sm: 220 }, bgcolor: '#FFF0F5' }}>
        <Box
          component="img"
          src={creator.coverImage}
          alt="Cover"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            color: '#2D1822',
            '&:hover': { bgcolor: '#FFFFFF' },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Profile Header Details */}
      <DialogContent sx={{ p: { xs: 2.5, sm: 4 }, pt: 0, position: 'relative', mt: { xs: -5, sm: -7 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'flex-end' },
            gap: 2,
            mb: 3,
          }}
        >
          {/* Avatar and name */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={creator.avatar}
                alt={creator.name}
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 4px 18px rgba(224, 93, 132, 0.25)',
                }}
              />
              {creator.isOnline && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    bgcolor: '#10B981',
                    borderRadius: '50%',
                    border: '3px solid #FFF',
                  }}
                />
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822' }}>
                  {creator.name}
                </Typography>
                {creator.isVerified && <Verified sx={{ color: '#D4AF37', fontSize: 20 }} />}
                <Chip
                  label={creator.badge}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    bgcolor: '#FFFDF0',
                    border: '1px solid #F5DE98',
                    color: '#8A6D1E',
                    fontSize: 10,
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 12 }}>
                @{creator.username} · {creator.location}
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              onClick={() => setIsFollowing(!isFollowing)}
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#FCE7F3',
                color: '#4A2A38',
                borderRadius: 3,
                fontWeight: 700,
                bgcolor: '#FFFFFF',
              }}
            >
              {isFollowing ? 'Siguiendo' : '+ Seguir'}
            </Button>

            <Button
              onClick={() => {
                onClose();
                onOpenChat(creator);
              }}
              variant="contained"
              size="small"
              startIcon={<ChatBubble sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: '#E05D84',
                color: '#FFFFFF',
                borderRadius: 3,
                fontWeight: 700,
                '&:hover': { bgcolor: '#BE185D' },
              }}
            >
              Chat en Vivo
            </Button>

            <Button
              onClick={() => onSubscribeCreator(creator)}
              variant="contained"
              size="small"
              startIcon={<AutoAwesome sx={{ color: '#2D1822', fontSize: 16 }} />}
              sx={{
                background: 'linear-gradient(135deg, #F5DE98 0%, #D4AF37 50%, #B88B22 100%)',
                color: '#2D1822',
                borderRadius: 3,
                fontWeight: 800,
              }}
            >
              Suscribirme (${creator.monthlySubscriptionPrice}/mes)
            </Button>
          </Box>
        </Box>

        {/* Bio */}
        <Typography variant="body2" sx={{ color: '#4A2A38', fontSize: 13, lineHeight: 1.6, maxWidth: 680 }}>
          {creator.bio}
        </Typography>

        {creator.socialQuote && (
          <Typography variant="caption" sx={{ color: '#8A6D1E', fontStyle: 'italic', fontWeight: 600, display: 'block', mt: 1 }}>
            "{creator.socialQuote}"
          </Typography>
        )}

        {/* Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          {creator.tags.map(t => (
            <Typography key={t} variant="caption" sx={{ color: '#BE185D', fontWeight: 700 }}>
              #{t}
            </Typography>
          ))}
        </Box>

        {/* Stats strip */}
        <Box
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: 3.5,
            bgcolor: '#FFFFFF',
            border: '1px solid #FCE7F3',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#8A6D1E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3 }}>
              <Star sx={{ fontSize: 15, color: '#D4AF37' }} />
              {creator.rating}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11 }}>
              {creator.reviewCount} valoraciones
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822' }}>
              {creator.subscribersCount}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11 }}>
              Suscriptores VIP
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822' }}>
              {creator.privateGalleriesCount}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11 }}>
              Galerías Privadas
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822' }}>
              {creator.postCount}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11 }}>
              Publicaciones
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #FCE7F3', mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: 12,
                textTransform: 'none',
              },
            }}
          >
            <Tab value="posts" label={`Muro & Posts (${creatorPosts.length})`} />
            <Tab value="galleries" label={`Galerías Secretas (${creatorGalleries.length})`} icon={<Lock sx={{ fontSize: 14 }} />} iconPosition="start" />
            <Tab value="store" label={`Tienda de Prendas (${creatorStoreItems.length})`} icon={<ShoppingBag sx={{ fontSize: 14 }} />} iconPosition="start" />
            <Tab value="reviews" label={`Reseñas (${creator.reviewCount})`} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ mt: 3 }}>
          {activeTab === 'posts' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {creatorPosts.map(p => (
                <Box key={p.id} sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
                  <Typography variant="body2" sx={{ color: '#2D1822', mb: 1 }}>{p.content}</Typography>
                  {p.imageUrls.length > 0 && (
                    <Box component="img" src={p.imageUrls[0]} sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2 }} />
                  )}
                  <Box sx={{ display: 'flex', gap: 2, mt: 1.5, color: '#7A5868', fontSize: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Favorite sx={{ fontSize: 14, color: '#E05D84' }} /> {p.likesCount}
                    </Box>
                    <Box>{p.comments.length} comentarios</Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {activeTab === 'galleries' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {creatorGalleries.map(g => {
                const hasAccess = canAccessContent(user, { isLocked: g.isLocked, coinPrice: g.coinPrice, contentId: g.id });
                return (
                  <Box key={g.id} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', p: 1.5 }}>
                    <Box sx={{ position: 'relative', pt: '56%', borderRadius: 2, overflow: 'hidden', mb: 1 }}>
                      <Box component="img" src={g.coverImage} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: !hasAccess ? 'blur(6px)' : 'none' }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 12 }}>{g.title}</Typography>
                    <Button
                      fullWidth
                      onClick={() => onUnlockGallery(g)}
                      variant="contained"
                      size="small"
                      sx={{ mt: 1, bgcolor: hasAccess ? '#FCE7F3' : '#E05D84', color: hasAccess ? '#BE185D' : '#FFF', fontSize: 11, fontWeight: 700 }}
                    >
                      {hasAccess ? 'Ver Fotos' : `Desbloquear (${g.coinPrice} Coins)`}
                    </Button>
                  </Box>
                );
              })}
            </Box>
          )}

          {activeTab === 'store' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {creatorStoreItems.map(item => {
                const discount = calculateItemDiscount(item.priceUsd, user.plan);
                return (
                  <Box key={item.id} sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Box component="img" src={item.image} sx={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 2 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 12 }}>{item.title}</Typography>
                        <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontSize: 11 }}>{item.description}</Typography>
                        <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>✓ Sellado al vacío</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1, borderTop: '1px solid #FFF0F5' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#8A6D1E' }}>${discount.finalPrice}</Typography>
                        <Typography variant="caption" sx={{ color: '#7A5868' }}>o {item.priceCoins} Coins</Typography>
                      </Box>
                      <Button
                        onClick={() => onBuyStoreItem(item)}
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: '#E05D84', color: '#FFF', fontWeight: 700, fontSize: 11 }}
                      >
                        Comprar Prenda
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {activeTab === 'reviews' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822' }}>Comprador VIP Anónimo</Typography>
                  <Rating value={5} readOnly size="small" />
                </Box>
                <Typography variant="body2" sx={{ color: '#4A2A38', fontSize: 12 }}>
                  "Increíble atención por chat y la prenda llegó sellada al vacío de manera súper discreta. El aroma y la suavidad del satén superaron mis expectativas."
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
