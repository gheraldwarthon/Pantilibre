import React, { useState, useEffect } from 'react';
import {
  Creator,
  Post,
  PrivateGallery,
  StoreItem,
  UserProfile,
  CreatorStory
} from '../types';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Rating,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
  Tooltip,
  MenuItem
} from '@mui/material';
import {
  Verified,
  Star,
  ChatBubble,
  Lock,
  LockOpen,
  ShoppingBag,
  AutoAwesome,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
  CheckCircle,
  LocalShipping,
  Shield,
  PhotoCamera,
  PlayArrow,
  MonetizationOn,
  Spa,
  Close,
  Straighten,
  Notifications,
  NotificationsActive,
  NotificationsNone,
  FlashOn,
  AccountBalance,
  CreditCard,
  ContentCopy,
  Check,
  QrCode2,
  CurrencyExchange,
  Send,
  SecurityOutlined
} from '@mui/icons-material';
import { Crown, Sparkles, Wallet, Smartphone, Landmark, ShieldCheck } from 'lucide-react';
import { calculateItemDiscount, canAccessContent, getCreatorPaymentMethods, formatRelativeTime } from '../utils/platformLogic';
import { CREATOR_REVIEWS, CREATORS } from '../data/mockData';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { fetchCreatorReviews } from '../services/dataService';
import { CreatorPaymentMethod, CreatorReview } from '../types';

interface CreatorProfileViewProps {
  creator: Creator;
  user: UserProfile;
  posts: Post[];
  galleries: PrivateGallery[];
  storeItems: StoreItem[];
  allCreators: Creator[];
  onBack: () => void;
  onSelectCreator: (creator: Creator) => void;
  onOpenChat: (creator: Creator) => void;
  onSendTip: (creatorId: string, creatorName: string, amount: number, message: string) => void;
  onUnlockGallery: (gallery: PrivateGallery) => void;
  onBuyStoreItem: (item: StoreItem) => void;
  onSubscribeCreator: (creator: Creator) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenPlans: () => void;
  showToast: (msg: string, sev?: 'success' | 'info' | 'warning') => void;
  stories?: CreatorStory[];
  onSelectStory?: (storyId: string) => void;
  onToggleFavorite?: (creator: Creator) => void;
  onTriggerNotificationForCreator?: (creatorId: string, forceType?: 'story' | 'post') => void;
}

export const CreatorProfileView: React.FC<CreatorProfileViewProps> = ({
  creator,
  user,
  posts,
  galleries,
  storeItems,
  allCreators,
  onBack,
  onSelectCreator,
  onOpenChat,
  onSendTip,
  onUnlockGallery,
  onBuyStoreItem,
  onSubscribeCreator,
  onLikePost,
  onAddComment,
  onOpenPlans,
  showToast,
  stories,
  onSelectStory,
  onToggleFavorite,
  onTriggerNotificationForCreator
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'galleries' | 'store' | 'payments' | 'reviews' | 'about'>('posts');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [selectedGalleryForView, setSelectedGalleryForView] = useState<PrivateGallery | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Payment Methods State & Handlers
  const [copiedMethodId, setCopiedMethodId] = useState<string | null>(null);
  const [selectedPaymentModal, setSelectedPaymentModal] = useState<CreatorPaymentMethod | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'peru' | 'bank' | 'international' | 'crypto'>('all');
  const paymentMethods = getCreatorPaymentMethods(creator);

  const filteredPaymentMethods = paymentMethods.filter(m => {
    if (paymentFilter === 'all') return true;
    if (paymentFilter === 'peru') return m.type === 'yape' || m.type === 'plin';
    if (paymentFilter === 'bank') return m.type === 'transfer';
    if (paymentFilter === 'international') return m.type === 'paypal';
    if (paymentFilter === 'crypto') return m.type === 'binance' || m.type === 'panticoins';
    return true;
  });

  const handleCopyPaymentInfo = (text: string, label: string, methodId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedMethodId(methodId);
    showToast(`¡${label} copiado al portapapeles!`, 'success');
    setTimeout(() => setCopiedMethodId(null), 2500);
  };

  // Tip Modal State
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(100);
  const [tipNote, setTipNote] = useState<string>('');

  // Custom Request Modal State
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [customDaysWorn, setCustomDaysWorn] = useState(2);
  const [customGarmentType, setCustomGarmentType] = useState('Pantis de seda');
  const [customSpecialNotes, setCustomSpecialNotes] = useState('');

  const isFollowing = user.followingCreatorIds.includes(creator.id);
  const isFavorite = (user.favoriteCreatorIds || user.followingCreatorIds).includes(creator.id);
  const activeStory = stories?.find(s => s.creatorId === creator.id);

  const creatorPosts = posts.filter(p => p.creatorId === creator.id);
  const creatorGalleries = galleries.filter(g => g.creatorId === creator.id);
  const creatorStoreItems = storeItems.filter(i => i.creatorId === creator.id);
  const similarCreators = allCreators.filter(c => c.id !== creator.id).slice(0, 3);

  const [liveReviews, setLiveReviews] = useState<CreatorReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setReviewsLoading(true);
    fetchCreatorReviews(creator.id)
      .then(rows => { if (mounted) setLiveReviews(rows); })
      .catch(() => { if (mounted) setLiveReviews([]); })
      .finally(() => { if (mounted) setReviewsLoading(false); });
    return () => { mounted = false; };
  }, [creator.id]);

  const mockCreator = CREATORS.find(c => c.username === creator.username);
  const fallbackReviews = mockCreator
    ? CREATOR_REVIEWS.filter(r => r.creatorId === mockCreator.id)
    : [];
  const creatorReviews = liveReviews.length > 0 ? liveReviews : fallbackReviews;

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('¡Enlace del perfil copiado al portapapeles!');
    } else {
      showToast(`Perfil de ${creator.name}: @${creator.username}`);
    }
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleConfirmTip = () => {
    if (user.coins < tipAmount) {
      showToast('Saldo insuficiente de PantiCoins', 'warning');
      setIsTipModalOpen(false);
      onOpenPlans();
      return;
    }
    onSendTip(creator.id, creator.name, tipAmount, tipNote);
    setIsTipModalOpen(false);
    setTipNote('');
  };

  const handleConfirmCustomOrder = () => {
    showToast(
      `¡Solicitud enviada a ${creator.name}! ${customGarmentType} con ${customDaysWorn} días de uso. Te responderá por chat privado.`,
      'success'
    );
    setIsCustomOrderOpen(false);
    onOpenChat(creator);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#FFF8FA', pb: 12 }}>
      {/* ========================================================
          STICKY TOP SUB-BAR / BREADCRUMB
      ======================================================== */}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.8, color: '#9D7387', fontSize: 13 }}>
            <span>Inicio</span>
            <span>/</span>
            <span>Creadoras VIP</span>
            <span>/</span>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#831843' }}>
              {creator.name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            icon={<Shield sx={{ fontSize: 16, color: '#10B981 !important' }} />}
            label="Perfil 100% Verificado"
            size="small"
            sx={{
              bgcolor: '#ECFDF5',
              color: '#065F46',
              fontWeight: 800,
              fontSize: 11,
              border: '1px solid #A7F3D0',
              display: { xs: 'none', md: 'flex' }
            }}
          />

          <Button
            onClick={handleShareProfile}
            startIcon={<Share sx={{ fontSize: 18 }} />}
            size="small"
            variant="text"
            sx={{
              color: '#BE185D',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 3
            }}
          >
            Compartir
          </Button>
        </Box>
      </Box>

      {/* ========================================================
          FULL-WIDTH HERO COVER BANNER
      ======================================================== */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 200, sm: 300, md: 380 },
          bgcolor: '#1E0B16',
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          src={getOptimizedImageUrl(creator.coverImage, user.dataSaverMode, 'cover')}
          alt={creator.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.85)'
          }}
        />

        {/* Ambient Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(20, 4, 13, 0.95) 0%, rgba(20, 4, 13, 0.4) 40%, rgba(20, 4, 13, 0.1) 100%)'
          }}
        />

        {/* Overlaid Badges on Cover */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 20 },
            right: { xs: 12, sm: 24 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 1
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              px: 2,
              py: 0.6,
              borderRadius: 3,
              background:
                creator.badge === 'DIAMOND'
                  ? 'linear-gradient(135deg, #0F172A 0%, #3B82F6 100%)'
                  : 'linear-gradient(135deg, #78350F 0%, #F59E0B 50%, #D97706 100%)',
              color: '#FFF',
              fontWeight: 900,
              fontSize: 12,
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Crown size={15} />
            <span>{creator.badge === 'SUPER_VIP' ? 'SUPER VIP' : creator.badge}</span>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.6,
              px: 1.5,
              py: 0.4,
              borderRadius: 3,
              bgcolor: creator.isOnline ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0, 0, 0, 0.65)',
              color: '#FFF',
              fontWeight: 700,
              fontSize: 11,
              backdropFilter: 'blur(6px)'
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: creator.isOnline ? '#FFF' : '#9CA3AF'
              }}
            />
            <span>{creator.isOnline ? 'En Línea Ahora' : 'Última vez hace 25 min'}</span>
          </Box>
        </Box>

        {/* Discretion Pill Top Left */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 20 },
            left: { xs: 12, sm: 24 },
            display: { xs: 'none', sm: 'inline-flex' },
            alignItems: 'center',
            gap: 0.8,
            px: 1.8,
            py: 0.6,
            borderRadius: 3,
            bgcolor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            color: '#FDE047',
            fontSize: 12,
            fontWeight: 700,
            border: '1px solid rgba(253, 224, 71, 0.3)',
            zIndex: 2,
          }}
        >
          <LocalShipping sx={{ fontSize: 16 }} />
          <span>Envíos al vacío 100% discretos sin logos</span>
        </Box>
      </Box>

      {/* ========================================================
          CREATOR INFO BLOCK (Overlapping Hero)
      ======================================================== */}
      <Box
        sx={{
          maxWidth: 1240,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          mt: { xs: -8, sm: -10, md: -12 }
        }}
      >
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: { xs: 4, sm: 5 },
            p: { xs: 2.5, sm: 4 },
            boxShadow: '0 12px 40px rgba(224, 93, 132, 0.12)',
            border: '1px solid #FCE7F3'
          }}
        >
          {/* Top row: Avatar & Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: 3,
              mb: 3
            }}
          >
            {/* Avatar + Main Names */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: { xs: 2, sm: 3 } }}>
              <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  onClick={() => activeStory && onSelectStory && onSelectStory(activeStory.id)}
                  sx={{
                    position: 'relative',
                    cursor: activeStory ? 'pointer' : 'default',
                    p: activeStory ? '4px' : '0px',
                    borderRadius: '50%',
                    background: activeStory
                      ? 'linear-gradient(135deg, #E05D84 0%, #F59E0B 50%, #BE185D 100%)'
                      : 'transparent',
                    boxShadow: activeStory ? '0 0 25px rgba(224, 93, 132, 0.65)' : 'none',
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    '&:hover': activeStory ? { transform: 'scale(1.04)' } : {}
                  }}
                >
                  <Avatar
                    src={getOptimizedImageUrl(creator.avatar, user.dataSaverMode, 'avatar')}
                    alt={creator.name}
                    sx={{
                      width: { xs: 96, sm: 128, md: 140 },
                      height: { xs: 96, sm: 128, md: 140 },
                      border: activeStory ? '3.5px solid #FFFFFF' : '5px solid #FFFFFF',
                      boxShadow: '0 8px 30px rgba(224, 93, 132, 0.35)',
                      bgcolor: '#FFF0F5'
                    }}
                  />
                  {creator.isOnline && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        width: 22,
                        height: 22,
                        bgcolor: '#10B981',
                        borderRadius: '50%',
                        border: '4px solid #FFF',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.6)'
                      }}
                    />
                  )}
                </Box>

                {activeStory && (
                  <Chip
                    icon={<PhotoCamera sx={{ fontSize: 13, color: '#FFF !important' }} />}
                    label="Ver Historia Activa"
                    size="small"
                    onClick={() => onSelectStory && onSelectStory(activeStory.id)}
                    sx={{
                      mt: 1,
                      bgcolor: '#BE185D',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: 'pointer',
                      height: 24,
                      boxShadow: '0 4px 12px rgba(190, 24, 93, 0.4)',
                      '&:hover': { bgcolor: '#9D174D' }
                    }}
                  />
                )}
              </Box>

              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: '#2D1822',
                      fontSize: { xs: '1.4rem', sm: '1.9rem', md: '2.2rem' },
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {creator.name}
                  </Typography>
                  <Tooltip title="Identidad Verificada 100%">
                    <Verified sx={{ color: '#E05D84', fontSize: { xs: 24, sm: 28 } }} />
                  </Tooltip>
                  {isFavorite && (
                    <Chip
                      icon={<Star sx={{ fontSize: 13, color: '#F59E0B !important' }} />}
                      label="Vendedora Favorita"
                      size="small"
                      sx={{
                        bgcolor: '#FEF3C7',
                        color: '#92400E',
                        fontWeight: 900,
                        fontSize: 10.5,
                        height: 22,
                        border: '1px solid #FDE68A'
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mt: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#E05D84', fontWeight: 800 }}>
                    @{creator.username}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9D7387' }}>•</Typography>
                  <Typography variant="body2" sx={{ color: '#4B3642', fontWeight: 600 }}>
                    {creator.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9D7387' }}>•</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <Rating value={creator.rating} precision={0.05} readOnly size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#8A6D1E', ml: 0.5 }}>
                      {creator.rating}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9D7387' }}>
                      ({creator.reviewCount} reseñas)
                    </Typography>
                  </Box>
                </Box>

                {creator.socialQuote && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: '#6B4C5D',
                      fontStyle: 'italic',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    "{creator.socialQuote}"
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Main Action Buttons */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'auto auto auto auto auto' },
                gap: 1.2,
                width: { xs: '100%', md: 'auto' }
              }}
            >
              {/* Chat Button */}
              <Button
                variant="contained"
                onClick={() => onOpenChat(creator)}
                startIcon={<ChatBubble />}
                sx={{
                  bgcolor: '#BE185D',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: { xs: 13, sm: 14 },
                  borderRadius: 3.5,
                  px: { xs: 1.5, sm: 3 },
                  py: 1.2,
                  boxShadow: '0 6px 20px rgba(190, 24, 93, 0.35)',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#9D174D' }
                }}
              >
                Chatear al DM
              </Button>

              {/* Send Tip Button */}
              <Button
                variant="outlined"
                onClick={() => setIsTipModalOpen(true)}
                startIcon={<MonetizationOn sx={{ color: '#EAB308' }} />}
                sx={{
                  borderColor: '#FDE047',
                  bgcolor: '#FEFCE8',
                  color: '#854D0E',
                  fontWeight: 800,
                  fontSize: { xs: 13, sm: 14 },
                  borderRadius: 3.5,
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1.2,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#FEF08A', borderColor: '#EAB308' }
                }}
              >
                Mandar Propina
              </Button>

              {/* Subscribe Toggle Button */}
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                onClick={() => onSubscribeCreator(creator)}
                startIcon={isFollowing ? <CheckCircle /> : <AutoAwesome />}
                sx={{
                  gridColumn: { xs: 'span 2', md: 'auto' },
                  bgcolor: isFollowing ? 'transparent' : '#2D1822',
                  borderColor: isFollowing ? '#D1D5DB' : 'transparent',
                  color: isFollowing ? '#4B5563' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: { xs: 13, sm: 14 },
                  borderRadius: 3.5,
                  px: 2.5,
                  py: 1.2,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: isFollowing ? '#F3F4F6' : '#111827'
                  }
                }}
              >
                {isFollowing ? 'Suscrito VIP' : `Suscribirme ($${creator.monthlySubscriptionPrice}/mes)`}
              </Button>

              {/* Real-Time Notification Alerts Toggle */}
              <Tooltip title={isFavorite ? 'Avisos en vivo activos para historias y nuevos posts' : 'Haz clic para recibir alertas instantáneas cuando suba nuevo contenido o historias'}>
                <Button
                  variant={isFavorite ? 'contained' : 'outlined'}
                  onClick={() => onToggleFavorite ? onToggleFavorite(creator) : onSubscribeCreator(creator)}
                  startIcon={isFavorite ? <NotificationsActive sx={{ color: '#FDE047' }} /> : <NotificationsNone sx={{ color: '#831843' }} />}
                  sx={{
                    bgcolor: isFavorite ? '#831843' : '#FFF0F5',
                    borderColor: isFavorite ? '#831843' : '#FCE7F3',
                    color: isFavorite ? '#FFFFFF' : '#831843',
                    fontWeight: 800,
                    fontSize: { xs: 12, sm: 13 },
                    borderRadius: 3.5,
                    px: { xs: 1.5, sm: 2.2 },
                    py: 1.2,
                    textTransform: 'none',
                    boxShadow: isFavorite ? '0 4px 14px rgba(131, 24, 67, 0.35)' : 'none',
                    '&:hover': {
                      bgcolor: isFavorite ? '#9D174D' : '#FCE7F3',
                      borderColor: '#F472B6'
                    }
                  }}
                >
                  {isFavorite ? 'Avisos' : 'Avisarme'}
                </Button>
              </Tooltip>

              {/* Custom Order Request */}
              <Button
                variant="outlined"
                onClick={() => setIsCustomOrderOpen(true)}
                startIcon={<ShoppingBag sx={{ color: '#E05D84' }} />}
                sx={{
                  borderColor: '#FBCFE8',
                  color: '#831843',
                  fontWeight: 700,
                  fontSize: { xs: 12, sm: 13 },
                  borderRadius: 3.5,
                  px: { xs: 1.5, sm: 2 },
                  py: 1.2,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#FDF2F8', borderColor: '#F472B6' }
                }}
              >
                Prenda
              </Button>
            </Box>
          </Box>

          {/* Extended Bio */}
          <Typography variant="body1" sx={{ color: '#3F2231', lineHeight: 1.7, mb: 2.5 }}>
            {creator.bio}
          </Typography>

          {/* Tags / Categories */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {creator.tags.map(tag => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                sx={{
                  bgcolor: '#FFF0F5',
                  color: '#BE185D',
                  fontWeight: 700,
                  borderRadius: 2,
                  border: '1px solid #FCE7F3',
                  '&:hover': { bgcolor: '#FCE7F3' }
                }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 2.5, borderColor: '#FFF0F5' }} />

          {/* ========================================================
              METRICS STRIP (Stat Counters)
          ======================================================== */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
              gap: 2
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                Suscriptores VIP
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#831843' }}>
                {creator.subscribersCount.toLocaleString()}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                Publicaciones
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822' }}>
                {creator.postCount}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                Galerías Privadas
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#BE185D' }}>
                {creator.privateGalleriesCount} Sets
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                Prendas al Vacío
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#047857' }}>
                {creator.ordersShippedCount || 89} Envíos
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                textAlign: 'center',
                gridColumn: { xs: 'span 2', sm: 'auto' }
              }}
            >
              <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                Tiempo en Chat
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#B45309' }}>
                &lt; {creator.responseTimeMinutes || 10} min
              </Typography>
            </Box>
          </Box>

          {/* ========================================================
              QUICK OVERVIEW: MÉTODOS DE PAGO ACEPTADOS DIRECTOS
          ======================================================== */}
          <Box
            sx={{
              mt: 3.5,
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3.5,
              background: 'linear-gradient(135deg, #FFF1F5 0%, #FDF2F8 60%, #FCE7F3 100%)',
              border: '1.5px solid #FBCFE8',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              boxShadow: '0 4px 16px rgba(224, 93, 132, 0.08)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  bgcolor: '#E05D84',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(224,93,132,0.3)',
                  flexShrink: 0
                }}
              >
                <AccountBalance sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#831843', fontSize: { xs: 13, sm: 14 } }}>
                    Métodos de Pago Aceptados & Verificados
                  </Typography>
                  <Chip
                    icon={<SecurityOutlined sx={{ fontSize: 13, color: '#065F46 !important' }} />}
                    label="100% Discreto & Seguro"
                    size="small"
                    sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 800, fontSize: 10, height: 20 }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#6B4C5D', fontSize: 12 }}>
                  Acepta Yape, Plin, Transferencia Bancaria (BCP/BBVA/Interbank), PayPal y Cripto sin comisiones ocultas.
                </Typography>
              </Box>
            </Box>

            {/* Quick Pills & Action Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                width: { xs: '100%', md: 'auto' },
                justifyContent: { xs: 'flex-start', md: 'flex-end' }
              }}
            >
              <Chip
                label="🟣 Yape"
                size="small"
                onClick={() => setActiveTab('payments')}
                sx={{ bgcolor: '#732282', color: '#FFF', fontWeight: 800, fontSize: 11, cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
              />
              <Chip
                label="🔵 Plin"
                size="small"
                onClick={() => setActiveTab('payments')}
                sx={{ bgcolor: '#00D1D1', color: '#03414D', fontWeight: 800, fontSize: 11, cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
              />
              <Chip
                label="🏦 BCP / BBVA"
                size="small"
                onClick={() => setActiveTab('payments')}
                sx={{ bgcolor: '#002A8F', color: '#FFF', fontWeight: 800, fontSize: 11, cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
              />
              <Chip
                label="🅿️ PayPal"
                size="small"
                onClick={() => setActiveTab('payments')}
                sx={{ bgcolor: '#003087', color: '#FFF', fontWeight: 800, fontSize: 11, cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={() => setActiveTab('payments')}
                sx={{
                  bgcolor: '#BE185D',
                  color: '#FFF',
                  fontWeight: 800,
                  textTransform: 'none',
                  borderRadius: 2.5,
                  px: 2,
                  fontSize: 12,
                  boxShadow: '0 2px 8px rgba(190, 24, 93, 0.25)',
                  '&:hover': { bgcolor: '#9D174D' }
                }}
              >
                Ver Cuentas & Pagar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          FULL TABS NAVIGATION
      ======================================================== */}
      <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, mt: 4 }}>
        <Box
          sx={{
            borderBottom: '2px solid #FCE7F3',
            bgcolor: '#FFFFFF',
            borderRadius: 3,
            p: 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                bgcolor: '#E05D84',
                height: 3,
                borderRadius: 2
              }
            }}
          >
            <Tab
              value="posts"
              label={`Publicaciones (${creatorPosts.length})`}
              icon={<PhotoCamera sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ fontWeight: 800, textTransform: 'none', color: '#6B4C5D', '&.Mui-selected': { color: '#BE185D' } }}
            />
            <Tab
              value="galleries"
              label={`Galerías VIP (${creatorGalleries.length})`}
              icon={<Lock sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ fontWeight: 800, textTransform: 'none', color: '#6B4C5D', '&.Mui-selected': { color: '#BE185D' } }}
            />
            <Tab
              value="store"
              label={`Armario & Prendas Usadas (${creatorStoreItems.length})`}
              icon={<ShoppingBag sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ fontWeight: 800, textTransform: 'none', color: '#6B4C5D', '&.Mui-selected': { color: '#BE185D' } }}
            />
            <Tab
              value="payments"
              label={`Métodos de Pago (${paymentMethods.length})`}
              icon={<AccountBalance sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{
                fontWeight: 800,
                textTransform: 'none',
                color: '#6B4C5D',
                '&.Mui-selected': { color: '#BE185D', bgcolor: '#FFF1F5' },
                borderRadius: 2
              }}
            />
            <Tab
              value="reviews"
              label={`Reseñas Verificadas (${creatorReviews.length})`}
              icon={<Star sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ fontWeight: 800, textTransform: 'none', color: '#6B4C5D', '&.Mui-selected': { color: '#BE185D' } }}
            />
            <Tab
              value="about"
              label="Ficha Técnica & Medidas"
              icon={<Straighten sx={{ fontSize: 18 }} />}
              iconPosition="start"
              sx={{ fontWeight: 800, textTransform: 'none', color: '#6B4C5D', '&.Mui-selected': { color: '#BE185D' } }}
            />
          </Tabs>
        </Box>

        {/* ========================================================
            TAB 1: POSTS & FEED
        ======================================================== */}
        {activeTab === 'posts' && (
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {creatorPosts.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#FFF', borderRadius: 4, border: '1px solid #FCE7F3' }}>
                <PhotoCamera sx={{ fontSize: 48, color: '#F472B6', mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822' }}>
                  No hay publicaciones aún
                </Typography>
                <Typography variant="body2" sx={{ color: '#9D7387' }}>
                  {creator.name} subirá contenido nuevo muy pronto.
                </Typography>
              </Box>
            ) : (
              creatorPosts.map(post => (
                <Card
                  key={post.id}
                  sx={{
                    borderRadius: 4,
                    border: '1px solid #FCE7F3',
                    boxShadow: '0 4px 20px rgba(224, 93, 132, 0.08)',
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* Header of Post */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={creator.avatar} alt={creator.name} sx={{ width: 44, height: 44 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822', lineHeight: 1.2 }}>
                            {creator.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9D7387' }}>
                            {formatRelativeTime(post.publishedAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={post.category}
                        size="small"
                        sx={{ bgcolor: '#FFF0F5', color: '#BE185D', fontWeight: 700, fontSize: 11 }}
                      />
                    </Box>

                    {/* Post Text */}
                    <Typography variant="body1" sx={{ color: '#3A1E2C', mb: 2, whiteSpace: 'pre-line' }}>
                      {post.content}
                    </Typography>

                    {/* Post Images Grid */}
                    {post.imageUrls.length > 0 && (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: post.imageUrls.length > 1 ? 'repeat(2, 1fr)' : '1fr',
                          gap: 1.5,
                          borderRadius: 3,
                          overflow: 'hidden',
                          mb: 2
                        }}
                      >
                        {post.imageUrls.map((imgUrl, idx) => (
                          <Box
                            key={idx}
                            onClick={() => setLightboxImage(imgUrl)}
                            sx={{
                              position: 'relative',
                              pt: post.imageUrls.length > 1 ? '100%' : '56.25%',
                              bgcolor: '#F3E8EE',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              '&:hover img': { transform: 'scale(1.03)' }
                            }}
                          >
                            <Box
                              component="img"
                              src={imgUrl}
                              alt="Post media"
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Action Bar (Like, Comment count, Share) */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 1.5,
                        borderTop: '1px solid #FFF0F5'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          onClick={() => onLikePost(post.id)}
                          startIcon={
                            post.isLikedByUser ? (
                              <Favorite sx={{ color: '#E11D48' }} />
                            ) : (
                              <FavoriteBorder sx={{ color: '#BE185D' }} />
                            )
                          }
                          size="small"
                          sx={{
                            color: post.isLikedByUser ? '#E11D48' : '#6B4C5D',
                            fontWeight: 700,
                            textTransform: 'none'
                          }}
                        >
                          {post.likesCount} Me gusta
                        </Button>

                        <Typography variant="body2" sx={{ color: '#6B4C5D', fontWeight: 600 }}>
                          💬 {post.comments.length} Comentarios
                        </Typography>
                      </Box>

                      <Button
                        onClick={() => {
                          onOpenChat(creator);
                        }}
                        size="small"
                        sx={{ color: '#BE185D', fontWeight: 700, textTransform: 'none' }}
                      >
                        Preguntar en chat
                      </Button>
                    </Box>

                    {/* Comments Section */}
                    {post.comments.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {post.comments.map(c => (
                          <Box
                            key={c.id}
                            sx={{
                              p: 1.2,
                              borderRadius: 2.5,
                              bgcolor: '#FFF8FA',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1.2
                            }}
                          >
                            <Avatar src={c.userAvatar} sx={{ width: 28, height: 28 }} />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822' }}>
                                  {c.userName}
                                </Typography>
                                {c.isVip && (
                                  <Chip
                                    label="VIP"
                                    size="small"
                                    sx={{ height: 16, fontSize: 9, bgcolor: '#FEF08A', color: '#854D0E', fontWeight: 900 }}
                                  />
                                )}
                                <Typography variant="caption" sx={{ color: '#9D7387', fontSize: 10 }}>
                                  {c.createdAt}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ color: '#4B3642', fontSize: 13, mt: 0.2 }}>
                                {c.text}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Add Comment Input */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Escribe un comentario respetuoso..."
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: '#FFF8FA',
                            fontSize: 13
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleCommentSubmit(post.id)}
                        sx={{
                          bgcolor: '#E05D84',
                          fontWeight: 700,
                          borderRadius: 3,
                          textTransform: 'none',
                          px: 2.5,
                          '&:hover': { bgcolor: '#BE185D' }
                        }}
                      >
                        Enviar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* ========================================================
            TAB 2: PRIVATE GALLERIES
        ======================================================== */}
        {activeTab === 'galleries' && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822' }}>
                Galerías Exclusivas & Sets en Video 4K
              </Typography>
              <Typography variant="body2" sx={{ color: '#9D7387' }}>
                Desbloquea con PantiCoins o membresía Gold VIP
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3
              }}
            >
              {creatorGalleries.map(gallery => {
                const hasAccess = canAccessContent(user, {
                  isLocked: gallery.isLocked,
                  coinPrice: gallery.coinPrice,
                  contentId: gallery.id
                });

                return (
                  <Card
                    key={gallery.id}
                    sx={{
                      borderRadius: 4,
                      border: '1px solid #FCE7F3',
                      boxShadow: '0 4px 20px rgba(224, 93, 132, 0.08)',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '65%', bgcolor: '#1F0A17', overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={gallery.coverImage}
                        alt={gallery.title}
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: !hasAccess ? 'blur(10px) brightness(0.7)' : 'none',
                          transform: !hasAccess ? 'scale(1.08)' : 'none',
                          transition: 'all 0.3s ease'
                        }}
                      />

                      {/* Top Badges */}
                      <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 0.8 }}>
                        <Chip
                          label={`${gallery.mediaCount} fotos`}
                          size="small"
                          sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: '#FFF', fontWeight: 800, fontSize: 11, backdropFilter: 'blur(4px)' }}
                        />
                        {gallery.videoDuration && (
                          <Chip
                            icon={<PlayArrow sx={{ fontSize: 14, color: '#FDE047 !important' }} />}
                            label={gallery.videoDuration}
                            size="small"
                            sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: '#FDE047', fontWeight: 800, fontSize: 11, backdropFilter: 'blur(4px)' }}
                          />
                        )}
                      </Box>

                      {/* Lock Overlay if locked */}
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
                            textAlign: 'center'
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              bgcolor: 'rgba(224, 93, 132, 0.9)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFF',
                              mb: 1,
                              boxShadow: '0 4px 15px rgba(224, 93, 132, 0.5)'
                            }}
                          >
                            <Lock />
                          </Box>
                          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            Contenido Privado VIP
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822', mb: 0.5 }}>
                          {gallery.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 13, mb: 2 }}>
                          {gallery.description}
                        </Typography>
                      </Box>

                      <Box sx={{ pt: 1.5, borderTop: '1px solid #FFF0F5' }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            if (hasAccess) {
                              setSelectedGalleryForView(gallery);
                            } else {
                              onUnlockGallery(gallery);
                            }
                          }}
                          startIcon={hasAccess ? <LockOpen /> : <Lock />}
                          sx={{
                            bgcolor: hasAccess ? '#ECFDF5' : '#E05D84',
                            color: hasAccess ? '#065F46' : '#FFFFFF',
                            fontWeight: 800,
                            fontSize: 13,
                            borderRadius: 3,
                            py: 1,
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: hasAccess ? '#D1FAE5' : '#BE185D'
                            }
                          }}
                        >
                          {hasAccess ? 'Ver Álbum Completo' : `Desbloquear (${gallery.coinPrice} PantiCoins)`}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ========================================================
            TAB 3: STORE & WORN GARMENTS
        ======================================================== */}
        {activeTab === 'store' && (
          <Box sx={{ mt: 3 }}>
            {/* VIP Guarantee Alert Banner */}
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                borderRadius: 4,
                bgcolor: '#FFF1F2',
                border: '1px solid #FECDD3',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  bgcolor: '#BE185D',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Spa />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#881337' }}>
                  Garantía de Preservación de Esencia y Sellado al Vacío
                </Typography>
                <Typography variant="body2" sx={{ color: '#9F1239', fontSize: 13 }}>
                  Cada prenda se empaca inmediatamente después del uso en doble bolsa termosellada de grado médico.
                  Incluye certificado de autenticidad firmado y se envía en caja sin ningún tipo de publicidad externa.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3
              }}
            >
              {creatorStoreItems.map(item => {
                const discount = calculateItemDiscount(item.priceUsd, user.plan);

                return (
                  <Card
                    key={item.id}
                    sx={{
                      borderRadius: 4,
                      border: '1px solid #FCE7F3',
                      boxShadow: '0 4px 20px rgba(224, 93, 132, 0.08)',
                      overflow: 'hidden',
                      p: 2.5,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2.5
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{
                        width: { xs: '100%', sm: 160 },
                        height: { xs: 180, sm: 180 },
                        objectFit: 'cover',
                        borderRadius: 3,
                        flexShrink: 0
                      }}
                    />

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          {item.daysWorn && (
                            <Chip
                              label={`⏱️ ${item.daysWorn} días de uso`}
                              size="small"
                              sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 800, fontSize: 11 }}
                            />
                          )}
                          <Chip
                            label="✓ Sellado al vacío"
                            size="small"
                            sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 800, fontSize: 11 }}
                          />
                          <Chip
                            label={`Stock: ${item.inStock}`}
                            size="small"
                            sx={{ bgcolor: '#F3F4F6', color: '#374151', fontWeight: 700, fontSize: 11 }}
                          />
                        </Box>

                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822', mb: 0.5 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 13, mb: 1.5 }}>
                          {item.description}
                        </Typography>
                      </Box>

                      <Box sx={{ pt: 1.5, borderTop: '1px solid #FFF0F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: '#831843' }}>
                            ${discount.finalPrice} USD
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700 }}>
                            o {item.priceCoins} PantiCoins
                          </Typography>
                        </Box>

                        <Button
                          variant="contained"
                          onClick={() => onBuyStoreItem(item)}
                          disabled={item.inStock <= 0}
                          sx={{
                            bgcolor: '#E05D84',
                            color: '#FFF',
                            fontWeight: 800,
                            borderRadius: 3,
                            px: 2.5,
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#BE185D' }
                          }}
                        >
                          {item.inStock > 0 ? 'Adquirir Prenda' : 'Agotado'}
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ========================================================
            TAB: DIRECT PAYMENT METHODS (YAPE, PLIN, TRANSFER, PAYPAL, BINANCE)
        ======================================================== */}
        {activeTab === 'payments' && (
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Header & Discretion Banner */}
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 4,
                border: '1.5px solid #FBCFE8',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 100%)',
                boxShadow: '0 4px 20px rgba(224, 93, 132, 0.08)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2.5, alignItems: { md: 'center' } }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#2D1822' }}>
                      Métodos de Pago Aceptados por {creator.name}
                    </Typography>
                    <Chip
                      icon={<SecurityOutlined sx={{ fontSize: 14, color: '#065F46 !important' }} />}
                      label="Cuentas Verificadas"
                      size="small"
                      sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 800, fontSize: 11 }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#6B4C5D', maxWidth: 700, fontSize: 13.5 }}>
                    Realiza tus pagos directos para pedidos personalizados, propinas, prendas usadas exclusivas o acceso a galerías VIP.
                    Todos los datos son directos de la creadora y cuentan con protección de privacidad.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => onOpenChat(creator)}
                  startIcon={<ChatBubble sx={{ fontSize: 18 }} />}
                  sx={{
                    borderColor: '#F472B6',
                    color: '#BE185D',
                    fontWeight: 800,
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 2.5,
                    py: 1,
                    alignSelf: { xs: 'flex-start', md: 'center' },
                    '&:hover': { bgcolor: '#FDF2F8', borderColor: '#DB2777' }
                  }}
                >
                  Consultar al Chat Privado
                </Button>
              </Box>

              {/* Privacy Notice Strip */}
              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#FFF8FA',
                  border: '1px dashed #F472B6',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5
                }}
              >
                <ShieldCheck size={22} color="#BE185D" style={{ flexShrink: 0, marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#831843', fontSize: 13 }}>
                    Garantía de Glosa & Concepto 100% Discreto
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B4C5D', fontSize: 12, display: 'block', mt: 0.3 }}>
                    Para cuidar tu total privacidad, todas las transacciones se emiten bajo conceptos comerciales neutros como 
                    <strong> "Servicios Digitales"</strong> o <strong>"Asesoría de Imagen"</strong>. En tus extractos bancarios 
                    <strong> jamás aparecerán referencias a fetiches ni prendas íntimas</strong>.
                  </Typography>
                </Box>
              </Box>

              {/* Filter Pills */}
              <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#831843', textTransform: 'uppercase', mr: 1 }}>
                  Filtrar por:
                </Typography>
                <Chip
                  label={`Todos (${paymentMethods.length})`}
                  onClick={() => setPaymentFilter('all')}
                  variant={paymentFilter === 'all' ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 800,
                    borderRadius: 2.5,
                    bgcolor: paymentFilter === 'all' ? '#BE185D' : 'transparent',
                    color: paymentFilter === 'all' ? '#FFF' : '#6B4C5D',
                    borderColor: '#FBCFE8',
                    '&:hover': { bgcolor: paymentFilter === 'all' ? '#9D174D' : '#FDF2F8' }
                  }}
                />
                <Chip
                  label="🇵🇪 Billeteras Perú (Yape / Plin)"
                  onClick={() => setPaymentFilter('peru')}
                  variant={paymentFilter === 'peru' ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 800,
                    borderRadius: 2.5,
                    bgcolor: paymentFilter === 'peru' ? '#732282' : 'transparent',
                    color: paymentFilter === 'peru' ? '#FFF' : '#6B4C5D',
                    borderColor: '#FBCFE8',
                    '&:hover': { bgcolor: paymentFilter === 'peru' ? '#5E1B6A' : '#FDF2F8' }
                  }}
                />
                <Chip
                  label="🏦 Transferencias Bancarias (BCP / BBVA / Interbank)"
                  onClick={() => setPaymentFilter('bank')}
                  variant={paymentFilter === 'bank' ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 800,
                    borderRadius: 2.5,
                    bgcolor: paymentFilter === 'bank' ? '#002A8F' : 'transparent',
                    color: paymentFilter === 'bank' ? '#FFF' : '#6B4C5D',
                    borderColor: '#FBCFE8',
                    '&:hover': { bgcolor: paymentFilter === 'bank' ? '#001E66' : '#FDF2F8' }
                  }}
                />
                <Chip
                  label="🌎 PayPal Internacional"
                  onClick={() => setPaymentFilter('international')}
                  variant={paymentFilter === 'international' ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 800,
                    borderRadius: 2.5,
                    bgcolor: paymentFilter === 'international' ? '#003087' : 'transparent',
                    color: paymentFilter === 'international' ? '#FFF' : '#6B4C5D',
                    borderColor: '#FBCFE8',
                    '&:hover': { bgcolor: paymentFilter === 'international' ? '#002260' : '#FDF2F8' }
                  }}
                />
                <Chip
                  label="⚡ Criptomonedas & Monedero"
                  onClick={() => setPaymentFilter('crypto')}
                  variant={paymentFilter === 'crypto' ? 'filled' : 'outlined'}
                  sx={{
                    fontWeight: 800,
                    borderRadius: 2.5,
                    bgcolor: paymentFilter === 'crypto' ? '#B45309' : 'transparent',
                    color: paymentFilter === 'crypto' ? '#FFF' : '#6B4C5D',
                    borderColor: '#FBCFE8',
                    '&:hover': { bgcolor: paymentFilter === 'crypto' ? '#92400E' : '#FDF2F8' }
                  }}
                />
              </Box>
            </Card>

            {/* Payment Cards Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2.5
              }}
            >
              {filteredPaymentMethods.map(method => {
                const isCopied = copiedMethodId === method.id;
                const isCopiedCCI = copiedMethodId === `${method.id}-cci`;

                return (
                  <Card
                    key={method.id}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      border: '1.5px solid #FCE7F3',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      bgcolor: '#FFFFFF',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: '#F472B6',
                        boxShadow: '0 10px 30px rgba(224, 93, 132, 0.12)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {/* Top color indicator line */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        bgcolor: method.color || '#E05D84'
                      }}
                    />

                    <Box>
                      {/* Card Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 3,
                              bgcolor: `${method.color}15`,
                              color: method.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: 18,
                              border: `1.5px solid ${method.color}30`
                            }}
                          >
                            {method.type === 'yape' ? '🟣' :
                             method.type === 'plin' ? '🔵' :
                             method.type === 'transfer' ? '🏦' :
                             method.type === 'paypal' ? '🅿️' :
                             method.type === 'binance' ? '🟡' : '🪙'}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822', fontSize: 16 }}>
                              {method.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700 }}>
                              {method.bankName ? `${method.bankName} • ` : ''}Monedas: {method.currencies?.join(', ') || 'PEN, USD'}
                            </Typography>
                          </Box>
                        </Box>

                        <Chip
                          label={method.badge}
                          size="small"
                          sx={{
                            bgcolor: method.isInstant ? '#ECFDF5' : '#FFF1F5',
                            color: method.isInstant ? '#065F46' : '#BE185D',
                            fontWeight: 800,
                            fontSize: 10.5,
                            border: `1px solid ${method.isInstant ? '#A7F3D0' : '#FBCFE8'}`
                          }}
                        />
                      </Box>

                      {/* Beneficiary */}
                      <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#FFF8FA', mb: 2, border: '1px solid #FDF2F8' }}>
                        <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, display: 'block' }}>
                          Titular / Beneficiaria:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#831843', fontSize: 14 }}>
                          {method.accountHolder}
                        </Typography>
                      </Box>

                      {/* Account Number / Identifier Box */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#6B4C5D', fontWeight: 800, fontSize: 11 }}>
                            {method.type === 'yape' || method.type === 'plin' ? 'Número Telefónico Asociado:' :
                             method.type === 'paypal' ? 'Correo de Pago PayPal:' :
                             method.type === 'binance' ? 'Binance Pay ID / USDT TRC20:' :
                             'Número de Cuenta:'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 700, fontSize: 10 }}>
                            Clic para copiar
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1.2,
                            borderRadius: 2.5,
                            bgcolor: '#F8FAFC',
                            border: '1.5px solid #E2E8F0',
                            gap: 1
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              color: '#1E293B',
                              fontSize: { xs: 13, sm: 14 },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {method.identifier}
                          </Typography>

                          <Button
                            size="small"
                            variant={isCopied ? 'contained' : 'outlined'}
                            onClick={() => handleCopyPaymentInfo(method.identifier || method.accountNumber || '', method.title, method.id)}
                            startIcon={isCopied ? <Check sx={{ fontSize: 15 }} /> : <ContentCopy sx={{ fontSize: 15 }} />}
                            sx={{
                              minWidth: 90,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: 11,
                              fontWeight: 800,
                              bgcolor: isCopied ? '#10B981' : 'transparent',
                              color: isCopied ? '#FFF' : '#BE185D',
                              borderColor: '#F472B6',
                              '&:hover': {
                                bgcolor: isCopied ? '#059669' : '#FDF2F8',
                                borderColor: '#DB2777'
                              }
                            }}
                          >
                            {isCopied ? '¡Copiado!' : 'Copiar'}
                          </Button>
                        </Box>
                      </Box>

                      {/* Bank CCI (if available) */}
                      {method.accountNumber && method.identifier !== method.accountNumber && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#6B4C5D', fontWeight: 800, fontSize: 11 }}>
                              Código Interbancario (CCI para otros bancos):
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              p: 1.2,
                              borderRadius: 2.5,
                              bgcolor: '#F8FAFC',
                              border: '1.5px solid #E2E8F0',
                              gap: 1
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                color: '#1E293B',
                                fontSize: { xs: 12, sm: 13 },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {method.accountNumber}
                            </Typography>

                            <Button
                              size="small"
                              variant={isCopiedCCI ? 'contained' : 'outlined'}
                              onClick={() => handleCopyPaymentInfo(method.accountNumber || '', 'CCI Interbancario', `${method.id}-cci`)}
                              startIcon={isCopiedCCI ? <Check sx={{ fontSize: 15 }} /> : <ContentCopy sx={{ fontSize: 15 }} />}
                              sx={{
                                minWidth: 90,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: 11,
                                fontWeight: 800,
                                bgcolor: isCopiedCCI ? '#10B981' : 'transparent',
                                color: isCopiedCCI ? '#FFF' : '#002A8F',
                                borderColor: '#93C5FD',
                                '&:hover': {
                                  bgcolor: isCopiedCCI ? '#059669' : '#EFF6FF',
                                  borderColor: '#3B82F6'
                                }
                              }}
                            >
                              {isCopiedCCI ? '¡Copiado!' : 'Copiar CCI'}
                            </Button>
                          </Box>
                        </Box>
                      )}

                      {/* Instructions / Recommended Note */}
                      <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#FFFDF9', border: '1px solid #FEF3C7', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 800, display: 'block', mb: 0.3, fontSize: 11 }}>
                          💡 Instrucción de Discreción:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#78350F', fontSize: 11.5, display: 'block', lineHeight: 1.4 }}>
                          {method.instructions}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ pt: 2, borderTop: '1px solid #FFF0F5', display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelectedPaymentModal(method)}
                        startIcon={<QrCode2 sx={{ fontSize: 17 }} />}
                        sx={{
                          flex: 1,
                          fontWeight: 800,
                          color: '#831843',
                          borderColor: '#FBCFE8',
                          borderRadius: 2.5,
                          textTransform: 'none',
                          fontSize: 12,
                          py: 0.9,
                          '&:hover': { bgcolor: '#FFF1F5', borderColor: '#F472B6' }
                        }}
                      >
                        Ver QR y Datos
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          showToast(`Abre el chat con ${creator.name} y adjunta tu comprobante de pago para procesar tu pedido.`, 'info');
                          onOpenChat(creator);
                        }}
                        startIcon={<Send sx={{ fontSize: 16 }} />}
                        sx={{
                          flex: 1,
                          fontWeight: 800,
                          bgcolor: method.color || '#E05D84',
                          color: '#FFF',
                          borderRadius: 2.5,
                          textTransform: 'none',
                          fontSize: 12,
                          py: 0.9,
                          boxShadow: `0 2px 8px ${method.color ? method.color + '40' : 'rgba(224,93,132,0.3)'}`,
                          '&:hover': { opacity: 0.9 }
                        }}
                      >
                        Notificar al Chat
                      </Button>
                    </Box>
                  </Card>
                );
              })}
            </Box>

            {/* How Payment & Delivery Works Strip */}
            <Card
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1px solid #FCE7F3'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822', mb: 2 }}>
                Pasos para Pagar y Recibir tu Pedido con 100% Discreción
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 2.5
                }}
              >
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: '#E05D84', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13 }}>
                      1
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#831843' }}>
                      Copia los Datos
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 12.5 }}>
                    Selecciona tu billetera móvil favorita (Yape, Plin), cuenta bancaria BCP/BBVA o PayPal y copia el número o código con 1 clic.
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: '#BE185D', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13 }}>
                      2
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#831843' }}>
                      Transfiere con Glosa Neutra
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 12.5 }}>
                    Coloca como motivo "Servicios Digitales" o "Asesoría". Guarda la captura del comprobante en tu teléfono.
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: '#047857', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13 }}>
                      3
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#047857' }}>
                      Envía Comprobante al Chat
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 12.5 }}>
                    Usa el botón "Notificar al Chat" para hablar directamente con {creator.name}. Ella confirmará la recepción y gestionará el envío sellado al vacío.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        )}

        {/* ========================================================
            TAB 4: VERIFIED REVIEWS
        ======================================================== */}
        {activeTab === 'reviews' && (
          <Box sx={{ mt: 3 }}>
            {/* Reviews Summary Card */}
            <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #FCE7F3', mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center', minWidth: { sm: 200 }, borderRight: { sm: '1px solid #FCE7F3' }, pr: { sm: 3 } }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#831843' }}>
                    {creator.rating}
                  </Typography>
                  <Rating value={creator.rating} precision={0.1} readOnly size="medium" sx={{ my: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#9D7387', fontWeight: 700 }}>
                    Basado en {creator.reviewCount} compradores verificados
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="caption" sx={{ width: 140, fontWeight: 700, color: '#4B3642' }}>
                        Discreción de Envío
                      </Typography>
                      <Box sx={{ flex: 1, height: 8, bgcolor: '#F3E8EE', borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ width: '100%', height: '100%', bgcolor: '#10B981' }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#065F46' }}>100%</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="caption" sx={{ width: 140, fontWeight: 700, color: '#4B3642' }}>
                        Preservación de Aroma
                      </Typography>
                      <Box sx={{ flex: 1, height: 8, bgcolor: '#F3E8EE', borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ width: '99%', height: '100%', bgcolor: '#E05D84' }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#BE185D' }}>99%</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="caption" sx={{ width: 140, fontWeight: 700, color: '#4B3642' }}>
                        Atención en Chat Privado
                      </Typography>
                      <Box sx={{ flex: 1, height: 8, bgcolor: '#F3E8EE', borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ width: '98%', height: '100%', bgcolor: '#F59E0B' }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#B45309' }}>98%</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Card>

            {/* Individual Reviews */}
            {reviewsLoading ? (
              <Typography variant="body2" sx={{ color: '#9D7387', textAlign: 'center', py: 4 }}>
                Cargando reseñas verificadas...
              </Typography>
            ) : creatorReviews.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#9D7387', textAlign: 'center', py: 4 }}>
                Aún no hay reseñas para esta creadora.
              </Typography>
            ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {creatorReviews.map(rev => (
                <Card
                  key={rev.id}
                  sx={{
                    p: 2.5,
                    borderRadius: 3.5,
                    border: '1px solid #FCE7F3',
                    boxShadow: '0 2px 12px rgba(224, 93, 132, 0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={rev.buyerAvatar} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822' }}>
                            {rev.buyerName}
                          </Typography>
                          {rev.isVipBuyer && (
                            <Chip
                              label="VIP Member"
                              size="small"
                              sx={{ height: 18, fontSize: 10, bgcolor: '#FEF08A', color: '#854D0E', fontWeight: 900 }}
                            />
                          )}
                          <Chip
                            label="Compra Verificada"
                            size="small"
                            sx={{ height: 18, fontSize: 10, bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 700 }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#E05D84', fontWeight: 700 }}>
                          Adquirió: {rev.itemPurchased}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Rating value={rev.rating} readOnly size="small" />
                      <Typography variant="caption" sx={{ color: '#9D7387', display: 'block' }}>
                        {rev.date}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#4B3642', lineHeight: 1.6 }}>
                    "{rev.comment}"
                  </Typography>
                </Card>
              ))}
            </Box>
            )}
          </Box>
        )}

        {/* ========================================================
            TAB 5: ABOUT & TECHNICAL DETAILS / FETISHES
        ======================================================== */}
        {activeTab === 'about' && (
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3
              }}
            >
              <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #FCE7F3', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822', mb: 2 }}>
                  Ficha Técnica & Atributos Físicos
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #FFF0F5' }}>
                    <Typography variant="body2" sx={{ color: '#9D7387', fontWeight: 600 }}>Estatura</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1822' }}>{creator.height || '1.68 m'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #FFF0F5' }}>
                    <Typography variant="body2" sx={{ color: '#9D7387', fontWeight: 600 }}>Talla de Calzado (Pies)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1822' }}>{creator.shoeSize || '37 EUR'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #FFF0F5' }}>
                    <Typography variant="body2" sx={{ color: '#9D7387', fontWeight: 600 }}>Medidas Corporales</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1822' }}>{creator.measurements || '88-60-92'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #FFF0F5' }}>
                    <Typography variant="body2" sx={{ color: '#9D7387', fontWeight: 600 }}>Perfume / Fragancia Favorita</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#BE185D' }}>{creator.favoritePerfume || 'Esencia Dulce de Vainilla'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #FFF0F5' }}>
                    <Typography variant="body2" sx={{ color: '#9D7387', fontWeight: 600 }}>Puntuación de Discreción</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981' }}>{creator.discreetShippingScore || 100}%</Typography>
                  </Box>
                </Box>
              </Card>

              <Card sx={{ p: 3, borderRadius: 4, border: '1px solid #FCE7F3', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822', mb: 2 }}>
                  Política de Pedidos Personalizados
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#BE185D', mb: 0.5 }}>
                      💌 Cartelito con tu Nombre / Dedicatoria
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 13 }}>
                      Disponible con foto polaroid firmada y tu nombre escrito a mano al adquirir cualquier prenda íntima.
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#BE185D', mb: 0.5 }}>
                      ⏱️ Días de Uso Específicos (24h a 72h)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 13 }}>
                      Puedes pactar días de uso adicionales o condiciones específicas (por ejemplo, uso durante entrenamiento o con tacones específicos) directamente en el chat privado.
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#BE185D', mb: 0.5 }}>
                      🎙️ Audios de Voz Personalizados
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 13 }}>
                      Mensajes de voz susurrados con tu nombre al desbloquear galerías o enviar propinas especiales.
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        )}

        {/* ========================================================
            SIMILAR / RECOMMENDED VIP CREATORS
        ======================================================== */}
        <Box sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#2D1822' }}>
              Otras Creadoras VIP Recomendadas
            </Typography>
            <Typography variant="body2" sx={{ color: '#E05D84', fontWeight: 700 }}>
              Explora más perfiles
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 3
            }}
          >
            {similarCreators.map(sc => (
              <Card
                key={sc.id}
                onClick={() => onSelectCreator(sc)}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #FCE7F3',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(224, 93, 132, 0.2)'
                  }
                }}
              >
                <Box sx={{ height: 110, position: 'relative' }}>
                  <Box
                    component="img"
                    src={sc.coverImage}
                    alt={sc.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Avatar
                    src={sc.avatar}
                    alt={sc.name}
                    sx={{
                      width: 60,
                      height: 60,
                      border: '3px solid #FFF',
                      position: 'absolute',
                      bottom: -24,
                      left: 16,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                  />
                </Box>
                <CardContent sx={{ pt: 4, pb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822' }}>
                    {sc.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#E05D84', fontWeight: 700 }}>
                    @{sc.username} • {sc.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 12, mt: 1, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {sc.bio}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          TIP MODAL DIALOG
      ======================================================== */}
      <Dialog
        open={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: '#2D1822', pb: 1 }}>
          Mandar Propina a {creator.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6B4C5D', mb: 2 }}>
            Tu saldo actual: <strong>{user.coins} PantiCoins</strong>
          </Typography>

          {/* Quick presets */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2.5 }}>
            {[50, 100, 250, 500].map(amt => (
              <Button
                key={amt}
                variant={tipAmount === amt ? 'contained' : 'outlined'}
                onClick={() => setTipAmount(amt)}
                sx={{
                  bgcolor: tipAmount === amt ? '#EAB308' : 'transparent',
                  color: tipAmount === amt ? '#FFF' : '#854D0E',
                  borderColor: '#FDE047',
                  fontWeight: 800,
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#FACC15' }
                }}
              >
                {amt} 🪙
              </Button>
            ))}
          </Box>

          <TextField
            fullWidth
            type="number"
            label="Cantidad de PantiCoins"
            value={tipAmount}
            onChange={e => setTipAmount(Math.max(1, Number(e.target.value)))}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Dedicatoria o petición (opcional)"
            placeholder="Ej: Para tu próximo set con medias de encaje..."
            value={tipNote}
            onChange={e => setTipNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsTipModalOpen(false)} sx={{ color: '#9D7387', fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmTip}
            sx={{
              bgcolor: '#BE185D',
              color: '#FFF',
              fontWeight: 800,
              borderRadius: 3,
              px: 3,
              '&:hover': { bgcolor: '#9D174D' }
            }}
          >
            Enviar {tipAmount} Coins
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================
          CUSTOM ORDER REQUEST DIALOG
      ======================================================== */}
      <Dialog
        open={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: '#2D1822', pb: 1 }}>
          Petición de Prenda Personalizada
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6B4C5D', mb: 2.5 }}>
            Solicita a {creator.name} una prenda personalizada a tu gusto. Todos los envíos se realizan en doble bolsa sellada al vacío sin marcas exteriores.
          </Typography>

          <TextField
            fullWidth
            select
            label="Tipo de Prenda"
            value={customGarmentType}
            onChange={e => setCustomGarmentType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Pantis de seda">Pantis de seda</MenuItem>
            <MenuItem value="Medias de encaje con costura">Medias de encaje con costura</MenuItem>
            <MenuItem value="Calcetines post-tacones">Calcetines post-tacones</MenuItem>
            <MenuItem value="Lencería de satén completa">Lencería de satén completa</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Días de Uso Solicitados (1 a 4 días)"
            value={customDaysWorn}
            onChange={e => setCustomDaysWorn(Math.min(4, Math.max(1, Number(e.target.value))))}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Instrucciones especiales (tacones a usar, perfume, dedicatoria en foto polaroid)"
            value={customSpecialNotes}
            onChange={e => setCustomSpecialNotes(e.target.value)}
            placeholder="Ej: Me gustaría que la uses con tus tacones negros de 12cm y que incluyas una foto dedicada para Alejandro."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsCustomOrderOpen(false)} sx={{ color: '#9D7387', fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmCustomOrder}
            sx={{
              bgcolor: '#BE185D',
              color: '#FFF',
              fontWeight: 800,
              borderRadius: 3,
              px: 3,
              '&:hover': { bgcolor: '#9D174D' }
            }}
          >
            Enviar Solicitud al DM
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================
          FULL GALLERY VIEWER MODAL
      ======================================================== */}
      {selectedGalleryForView && (
        <Dialog
          open={!!selectedGalleryForView}
          onClose={() => setSelectedGalleryForView(null)}
          maxWidth="md"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: '#11030B', color: '#FFF' } } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#FFF' }}>
                {selectedGalleryForView.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#E05D84' }}>
                {selectedGalleryForView.mediaCount} fotos en alta resolución
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedGalleryForView(null)} sx={{ color: '#FFF' }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              {selectedGalleryForView.fullImages.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img}
                  alt={`Photo ${i + 1}`}
                  onClick={() => setLightboxImage(img)}
                  sx={{
                    width: '100%',
                    height: 260,
                    objectFit: 'cover',
                    borderRadius: 3,
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.9 }
                  }}
                />
              ))}
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* ========================================================
          LIGHTBOX FOR SINGLE PHOTO
      ======================================================== */}
      {lightboxImage && (
        <Dialog
          open={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          maxWidth="lg"
          slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none' } } }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={() => setLightboxImage(null)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#FFF',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
              }}
            >
              <Close />
            </IconButton>
            <Box
              component="img"
              src={lightboxImage}
              alt="Zoomed"
              sx={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 3,
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
              }}
            />
          </Box>
        </Dialog>
      )}

      {/* ========================================================
          PAYMENT DETAILS & QR CODE MODAL
      ======================================================== */}
      {selectedPaymentModal && (
        <Dialog
          open={Boolean(selectedPaymentModal)}
          onClose={() => setSelectedPaymentModal(null)}
          maxWidth="xs"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: 4,
                p: 1,
                border: '1.5px solid #FBCFE8',
                boxShadow: '0 20px 40px rgba(224, 93, 132, 0.2)'
              }
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: selectedPaymentModal.color || '#BE185D',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16
                }}
              >
                {selectedPaymentModal.type === 'yape' ? '🟣' :
                 selectedPaymentModal.type === 'plin' ? '🔵' :
                 selectedPaymentModal.type === 'transfer' ? '🏦' :
                 selectedPaymentModal.type === 'paypal' ? '🅿️' : '⚡'}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2D1822', fontSize: 16 }}>
                {selectedPaymentModal.title}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedPaymentModal(null)} size="small" sx={{ color: '#9D7387' }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            {/* Visual QR Code Display Frame */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3.5,
                bgcolor: '#FFF5F8',
                border: '1.5px solid #FCE7F3',
                textAlign: 'center',
                mb: 2.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Simulated crisp QR display container */}
              <Box
                sx={{
                  width: 180,
                  height: 180,
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  p: 1.5,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  border: '2px solid #FBCFE8',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {/* SVG QR Code Pattern */}
                <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#831843" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#831843" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#831843" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#831843" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#831843" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#831843" />

                  {/* QR Data Grid Pattern */}
                  <rect x="38" y="8" width="8" height="8" fill="#BE185D" />
                  <rect x="50" y="8" width="8" height="8" fill="#831843" />
                  <rect x="38" y="22" width="8" height="8" fill="#831843" />
                  <rect x="50" y="22" width="8" height="8" fill="#BE185D" />

                  <rect x="8" y="38" width="8" height="8" fill="#831843" />
                  <rect x="22" y="38" width="8" height="8" fill="#BE185D" />
                  <rect x="8" y="50" width="8" height="8" fill="#BE185D" />
                  <rect x="22" y="50" width="8" height="8" fill="#831843" />

                  <rect x="38" y="38" width="24" height="24" rx="4" fill={selectedPaymentModal.color || '#E05D84'} />

                  <rect x="68" y="38" width="8" height="8" fill="#831843" />
                  <rect x="82" y="38" width="8" height="8" fill="#BE185D" />
                  <rect x="68" y="50" width="8" height="8" fill="#BE185D" />
                  <rect x="82" y="50" width="8" height="8" fill="#831843" />

                  <rect x="38" y="68" width="8" height="8" fill="#831843" />
                  <rect x="50" y="68" width="8" height="8" fill="#BE185D" />
                  <rect x="38" y="82" width="8" height="8" fill="#BE185D" />
                  <rect x="50" y="82" width="8" height="8" fill="#831843" />

                  <rect x="68" y="68" width="10" height="10" fill="#831843" />
                  <rect x="82" y="82" width="10" height="10" fill="#BE185D" />
                </svg>

                {/* Center Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    fontSize: 14
                  }}
                >
                  {selectedPaymentModal.type === 'yape' ? '🟣' :
                   selectedPaymentModal.type === 'plin' ? '🔵' :
                   selectedPaymentModal.type === 'paypal' ? '🅿️' : '🏦'}
                </Box>
              </Box>

              <Typography variant="caption" sx={{ color: '#831843', fontWeight: 800, mt: 1.5 }}>
                Escanea desde tu app o copia los datos abajo
              </Typography>
            </Box>

            {/* Holder details & Copy */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                Titular Verificada
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822' }}>
                {selectedPaymentModal.accountHolder}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#9D7387', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>
                {selectedPaymentModal.type === 'yape' || selectedPaymentModal.type === 'plin' ? 'Celular / Teléfono' :
                 selectedPaymentModal.type === 'paypal' ? 'Correo de Cuenta PayPal' :
                 'Número de Cuenta'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.2,
                  borderRadius: 2.5,
                  bgcolor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  mt: 0.5
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#1E293B' }}>
                  {selectedPaymentModal.identifier}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleCopyPaymentInfo(selectedPaymentModal.identifier || selectedPaymentModal.accountNumber || '', selectedPaymentModal.title, 'modal-id')}
                  startIcon={copiedMethodId === 'modal-id' ? <Check sx={{ fontSize: 15 }} /> : <ContentCopy sx={{ fontSize: 15 }} />}
                  sx={{
                    bgcolor: copiedMethodId === 'modal-id' ? '#10B981' : '#E05D84',
                    color: '#FFF',
                    fontWeight: 800,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontSize: 11,
                    '&:hover': { bgcolor: copiedMethodId === 'modal-id' ? '#059669' : '#BE185D' }
                  }}
                >
                  {copiedMethodId === 'modal-id' ? 'Copiado' : 'Copiar'}
                </Button>
              </Box>
            </Box>

            {/* Instructions */}
            <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#FFFDF9', border: '1px solid #FEF3C7', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 800, display: 'block', mb: 0.3 }}>
                🔒 Instrucción de Privacidad:
              </Typography>
              <Typography variant="caption" sx={{ color: '#78350F', fontSize: 11.5, display: 'block', lineHeight: 1.4 }}>
                {selectedPaymentModal.instructions}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setSelectedPaymentModal(null);
                showToast(`Chat abierto con ${creator.name}. Adjunta tu comprobante aquí.`, 'success');
                onOpenChat(creator);
              }}
              startIcon={<Send sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: '#BE185D',
                color: '#FFF',
                fontWeight: 800,
                borderRadius: 2.5,
                py: 1,
                textTransform: 'none',
                '&:hover': { bgcolor: '#9D174D' }
              }}
            >
              Abrir Chat y Notificar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
