import React, { useMemo, useState } from 'react';
import { Post, Creator, UserProfile, CreatorStory } from '../types';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubble,
  MonetizationOn,
  Verified,
  Send,
  Lock,
  Speed
} from '@mui/icons-material';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { formatRelativeTime, getFeedFlankPhotos, type FeedFlankPhotoItem } from '../utils/platformLogic';

interface SellerPhotoTileProps {
  item: FeedFlankPhotoItem<Creator>;
  variant: 'vip' | 'new';
  dataSaverMode?: boolean;
  onSelect: (creator: Creator) => void;
}

const SellerPhotoTile: React.FC<SellerPhotoTileProps> = ({
  item,
  variant,
  dataSaverMode,
  onSelect
}) => {
  const [hasError, setHasError] = useState(false);
  const { creator, imageUrl } = item;
  const isVip = variant === 'vip';
  const optimizedSrc = getOptimizedImageUrl(imageUrl, dataSaverMode, isVip ? 'card' : 'thumbnail');

  return (
    <Box
      component="button"
      type="button"
      data-testid={`flank-photo-${variant}`}
      data-creator-id={creator.id}
      aria-label={`Ver perfil de ${creator.name}`}
      title={creator.name}
      onClick={() => onSelect(creator)}
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        aspectRatio: isVip ? '3 / 4' : '1 / 1',
        p: 0,
        m: 0,
        border: isVip ? '1px solid #E5C378' : '1px solid #F3DCE6',
        borderRadius: 0,
        overflow: 'hidden',
        bgcolor: '#FFF0F5',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        '&:hover, &:focus-visible': {
          outline: 'none',
          transform: 'translateY(-2px)',
          borderColor: isVip ? '#B88B22' : '#E05D84',
          boxShadow: isVip
            ? '0 8px 20px rgba(184, 139, 34, 0.22)'
            : '0 6px 14px rgba(224, 93, 132, 0.16)',
          '& .flank-photo-overlay': {
            opacity: 1
          },
          '& img': {
            transform: 'scale(1.04)'
          }
        }
      }}
    >
      {!hasError && optimizedSrc ? (
        <Box
          component="img"
          src={optimizedSrc}
          alt={creator.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            transition: 'transform 0.35s ease'
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isVip
              ? 'linear-gradient(145deg, #FDF2F8 0%, #FEF3C7 100%)'
              : 'linear-gradient(145deg, #FFF5F8 0%, #FCE7F3 100%)',
            color: '#831843',
            fontWeight: 800,
            fontSize: isVip ? 24 : 16
          }}
        >
          {creator.name.slice(0, 2).toUpperCase()}
        </Box>
      )}

      <Box
        className="flank-photo-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(32, 14, 23, 0.78) 0%, rgba(32, 14, 23, 0) 48%)',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          display: 'flex',
          alignItems: 'flex-end',
          p: isVip ? 1 : 0.7,
          pointerEvents: 'none'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: isVip ? 11.5 : 10,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%'
          }}
        >
          {creator.name}
        </Typography>
      </Box>
    </Box>
  );
};

interface FeedSectionProps {
  posts: Post[];
  user: UserProfile;
  creators: Creator[];
  stories?: CreatorStory[];
  onSelectStory?: (storyId: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSendTip: (creatorId: string, creatorName: string, amount: number, message: string) => void;
  onSelectCreator: (creator: Creator) => void;
  onOpenPlans: () => void;
  onOpenChatWithCreator: (creator: Creator) => void;
  onToggleDataSaver?: () => void;
  onToggleFavorite?: (creator: Creator) => void;
  onToggleInteractiveNotifications?: () => void;
}

export const FeedSection: React.FC<FeedSectionProps> = ({
  posts,
  user,
  creators,
  onLikePost,
  onAddComment,
  onSendTip,
  onSelectCreator,
  onOpenPlans,
  onOpenChatWithCreator,
  onToggleDataSaver
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'vip' | 'media'>('all');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [tipModalData, setTipModalData] = useState<{ creatorId: string; creatorName: string } | null>(null);
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(50);
  const [tipMessage, setTipMessage] = useState<string>('');
  const [tipSentFeedback, setTipSentFeedback] = useState(false);

  // Quick Post Draft state
  const [newPostText, setNewPostText] = useState('');
  const [newPostSuccess, setNewPostSuccess] = useState(false);

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleSendTipConfirm = () => {
    if (!tipModalData) return;
    onSendTip(tipModalData.creatorId, tipModalData.creatorName, selectedTipAmount, tipMessage);
    setTipSentFeedback(true);
    setTimeout(() => {
      setTipSentFeedback(false);
      setTipModalData(null);
      setTipMessage('');
    }, 1500);
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'following') {
      return user.followingCreatorIds.includes(post.creatorId);
    }
    if (activeTab === 'vip') {
      return post.creatorBadge === 'VIP' || post.creatorBadge === 'SUPER_VIP' || post.creatorBadge === 'DIAMOND';
    }
    if (activeTab === 'media') {
      return post.imageUrls.length > 0;
    }
    return true;
  });

  const { vipPhotos, newSellerPhotos } = useMemo(
    () => getFeedFlankPhotos(creators, 20),
    [creators]
  );

  return (
    <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 2, sm: 3, xl: 4 }, py: 3.5 }}>
      {/* 3-Column Layout: Left Larger VIP Photos (20) | Center Feed | Right Compact New Seller Photos (20) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '280px minmax(360px, 500px) 200px',
            lg: '330px minmax(420px, 540px) 220px',
            xl: '370px minmax(480px, 570px) 240px'
          },
          justifyContent: 'center',
          gap: { xs: 2.5, md: 2.5, lg: 3.5 },
          alignItems: 'start'
        }}
      >
        {/* ========================================================
            FLANK 1: LATERAL IZQUIERDO (20 Fotos Grandes de Vendedoras VIP)
        ======================================================== */}
        <Box
          component="aside"
          data-testid="feed-flank-vip"
          aria-label="Vendedoras VIP"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: 1.2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              pb: 0.75,
              borderBottom: '1px solid #E5C378'
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 900,
                color: '#2D1822',
                fontSize: 12,
                letterSpacing: '0.08em',
                lineHeight: 1.2
              }}
            >
              Vendedoras VIP
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#8A6D1E',
                fontSize: 11,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {vipPhotos.length}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 0.8
            }}
          >
            {vipPhotos.map(item => (
              <SellerPhotoTile
                key={item.id}
                item={item}
                variant="vip"
                dataSaverMode={user.dataSaverMode}
                onSelect={onSelectCreator}
              />
            ))}
          </Box>
        </Box>

        {/* ========================================================
            CENTER STREAM: FEED MÁS ANGOSTO (Stream Central)
        ======================================================== */}
        <Box
          component="section"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            width: '100%',
            minWidth: 0,
            maxWidth: { xs: '100%', lg: '620px' },
            mx: 'auto'
          }}
        >
          {/* Data Saver Mode Active Notification Banner */}
          {user.dataSaverMode && (
            <Box
              sx={{
                p: 1.5,
                px: 2,
                borderRadius: 3.5,
                bgcolor: '#ECFDF5',
                border: '1.5px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.12)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Speed sx={{ color: '#047857', fontSize: 20 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#065F46', fontSize: 12, lineHeight: 1.2 }}>
                    Modo Ahorro de Datos Activado
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#047857', fontSize: 11 }}>
                    Imágenes en versión comprimida (thumbnails). Ahorras ~75% de ancho de banda.
                  </Typography>
                </Box>
              </Box>

              {onToggleDataSaver && (
                <Button
                  size="small"
                  onClick={onToggleDataSaver}
                  sx={{
                    color: '#047857',
                    fontWeight: 800,
                    fontSize: 11,
                    textTransform: 'none',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #6EE7B7',
                    borderRadius: 2,
                    px: 1.2,
                    py: 0.3,
                    '&:hover': { bgcolor: '#D1FAE5' }
                  }}
                >
                  Ver en HD
                </Button>
              )}
            </Box>
          )}

          {/* Segmented Filter Control */}
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              p: 0.8,
              borderRadius: 3.5,
              border: '1px solid #FCE7F3',
              boxShadow: '0 2px 10px rgba(224, 93, 132, 0.05)',
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {[
              { id: 'all', label: 'Todo el Muro' },
              { id: 'following', label: 'Mis Vendedoras' },
              { id: 'vip', label: 'Exclusivo VIP' },
              { id: 'media', label: 'Fotos & Videos' }
            ].map(tab => (
              <Button
                key={tab.id}
                size="small"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                sx={{
                  flex: '1 0 auto',
                  borderRadius: 2.5,
                  py: 0.8,
                  px: 2,
                  fontWeight: 800,
                  fontSize: 12,
                  textTransform: 'none',
                  bgcolor: activeTab === tab.id ? '#E05D84' : 'transparent',
                  color: activeTab === tab.id ? '#FFFFFF' : '#7A5868',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(224, 93, 132, 0.3)' : 'none',
                  '&:hover': {
                    bgcolor: activeTab === tab.id ? '#BE185D' : '#FFF0F5',
                  },
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>

          {/* Quick Draft for User Interaction */}
          <Card
            elevation={0}
            sx={{
              bgcolor: '#FFFFFF',
              border: '1px solid #FCE7F3',
              borderRadius: 4,
              p: 2,
              boxShadow: '0 2px 12px rgba(224, 93, 132, 0.05)'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Avatar
                src={getOptimizedImageUrl(user.avatar, user.dataSaverMode, 'avatar')}
                sx={{ width: 40, height: 40, border: '1.5px solid #FBCFE8' }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="Pregunta a las vendedoras o pide una prenda personalizada..."
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                sx={{
                  bgcolor: '#FFF8FA',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontSize: 13,
                    '& fieldset': { borderColor: '#FCE7F3' }
                  }
                }}
              />
              <Button
                variant="contained"
                disabled={!newPostText.trim()}
                onClick={() => {
                  setNewPostSuccess(true);
                  setNewPostText('');
                  setTimeout(() => setNewPostSuccess(false), 2500);
                }}
                sx={{
                  bgcolor: '#BE185D',
                  color: '#FFF',
                  fontWeight: 800,
                  borderRadius: 2.5,
                  px: 2,
                  minWidth: 42,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#9D174D' }
                }}
              >
                <Send sx={{ fontSize: 16 }} />
              </Button>
            </Box>
            {newPostSuccess && (
              <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, mt: 1, display: 'block' }}>
                ✓ Petición enviada al muro de creadoras. Te responderán al DM.
              </Typography>
            )}
          </Card>

          {/* Posts Wall Stream */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredPosts.map(post => {
              const currentCreator = creators.find(c => c.id === post.creatorId);
              const isCommentsOpen = !!expandedComments[post.id];

              return (
                <Card
                  key={post.id}
                  elevation={0}
                  sx={{
                    bgcolor: '#FFFFFF',
                    borderRadius: 4,
                    border: '1px solid #FCE7F3',
                    overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(224, 93, 132, 0.05)',
                  }}
                >
                  {/* Card Header with Creator Info */}
                  <CardHeader
                    avatar={
                      <Box
                        onClick={() => currentCreator && onSelectCreator(currentCreator)}
                        sx={{ position: 'relative', cursor: 'pointer' }}
                      >
                        <Avatar
                          src={getOptimizedImageUrl(post.creatorAvatar, user.dataSaverMode, 'avatar')}
                          sx={{ width: 44, height: 44, border: '2px solid #FBCFE8' }}
                        />
                        {currentCreator?.isOnline && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 12,
                              height: 12,
                              bgcolor: '#10B981',
                              borderRadius: '50%',
                              border: '2px solid #FFF'
                            }}
                          />
                        )}
                      </Box>
                    }
                    action={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={post.creatorBadge}
                          size="small"
                          sx={{
                            bgcolor: '#FFFDF0',
                            border: '1px solid #F5DE98',
                            color: '#8A6D1E',
                            fontWeight: 900,
                            fontSize: 10,
                            height: 22,
                          }}
                        />
                        <Button
                          size="small"
                          onClick={() => setTipModalData({ creatorId: post.creatorId, creatorName: post.creatorName })}
                          startIcon={<MonetizationOn sx={{ color: '#F59E0B' }} />}
                          sx={{
                            bgcolor: '#FFFBEB',
                            color: '#854D0E',
                            fontWeight: 800,
                            fontSize: 11,
                            borderRadius: 2,
                            px: 1.2,
                            py: 0.3,
                            textTransform: 'none',
                            border: '1px solid #FDE68A',
                            '&:hover': { bgcolor: '#FEF3C7' }
                          }}
                        >
                          Propina
                        </Button>
                      </Box>
                    }
                    title={
                      <Box
                        onClick={() => currentCreator && onSelectCreator(currentCreator)}
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer' }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 14 }}>
                          {post.creatorName}
                        </Typography>
                        {post.isVerified && <Verified sx={{ color: '#E05D84', fontSize: 16 }} />}
                      </Box>
                    }
                    subheader={
                      <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11 }}>
                        @{post.creatorUsername} · {formatRelativeTime(post.publishedAt)}
                      </Typography>
                    }
                  />

                  {/* Post Content */}
                  <CardContent sx={{ pt: 0, pb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#3A1E2B', fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {post.content}
                    </Typography>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mt: 1.5 }}>
                        {post.tags.map(tag => (
                          <Chip
                            key={tag}
                            label={`#${tag}`}
                            size="small"
                            sx={{ height: 20, fontSize: 10.5, bgcolor: '#FFF0F5', color: '#BE185D', fontWeight: 700 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>

                  {/* Media Content with Data Saver Optimizer */}
                  {post.imageUrls.length > 0 && (
                    <Box sx={{ position: 'relative', bgcolor: '#FFF0F5', overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={getOptimizedImageUrl(post.imageUrls[0], user.dataSaverMode, 'feed')}
                        alt="Publicación"
                        loading="lazy"
                        sx={{
                          width: '100%',
                          maxHeight: 460,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />

                      {/* Data Saver Mode Pill Indicator on Image */}
                      {user.dataSaverMode && (
                        <Chip
                          icon={<Speed sx={{ fontSize: 13, color: '#047857 !important' }} />}
                          label="Modo Ahorro · Thumbnail Comprimido"
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            bgcolor: 'rgba(255, 255, 255, 0.94)',
                            backdropFilter: 'blur(6px)',
                            color: '#065F46',
                            fontWeight: 800,
                            fontSize: 10,
                            height: 22,
                            border: '1px solid #A7F3D0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      )}

                      {/* Locked Content Overlay */}
                      {post.isLocked && (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'rgba(45, 24, 34, 0.82)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            textAlign: 'center',
                          }}
                        >
                          <Lock sx={{ fontSize: 40, color: '#F5DE98', mb: 1.5 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 0.5 }}>
                            Contenido Exclusivo para Suscriptores
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#D8B8C9', fontSize: 12, mb: 2, maxWidth: 300 }}>
                            Desbloquea esta sesión privada o suscríbete al club de {post.creatorName}.
                          </Typography>
                          <Button
                            onClick={onOpenPlans}
                            variant="contained"
                            sx={{
                              bgcolor: '#F5DE98',
                              color: '#2D1822',
                              fontWeight: 800,
                              borderRadius: 3,
                              px: 3,
                              '&:hover': { bgcolor: '#E5C378' },
                            }}
                          >
                            Desbloquear por {post.coinPrice} Coins
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Actions Bar */}
                  <CardActions sx={{ px: 2, py: 1.2, borderTop: '1px solid #FFF0F5', display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Button
                        onClick={() => onLikePost(post.id)}
                        size="small"
                        startIcon={
                          post.isLikedByUser ? (
                            <Favorite sx={{ color: '#E05D84' }} />
                          ) : (
                            <FavoriteBorder sx={{ color: '#7A5868' }} />
                          )
                        }
                        sx={{
                          color: post.isLikedByUser ? '#E05D84' : '#7A5868',
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {post.likesCount}
                      </Button>

                      <Button
                        onClick={() => toggleComments(post.id)}
                        size="small"
                        startIcon={<ChatBubble sx={{ color: '#7A5868', fontSize: 16 }} />}
                        sx={{ color: '#7A5868', fontWeight: 600, fontSize: 12 }}
                      >
                        {post.comments.length}
                      </Button>

                      <Button
                        onClick={() => currentCreator && onOpenChatWithCreator(currentCreator)}
                        size="small"
                        sx={{ color: '#BE185D', fontWeight: 700, fontSize: 12, textTransform: 'none' }}
                      >
                        Chat DM
                      </Button>
                    </Box>

                    <Button
                      size="small"
                      onClick={() => currentCreator && onSelectCreator(currentCreator)}
                      sx={{ color: '#854D0E', fontWeight: 800, fontSize: 11, textTransform: 'none' }}
                    >
                      Ver Perfil →
                    </Button>
                  </CardActions>

                  {/* Expandable comments */}
                  {isCommentsOpen && (
                    <Box sx={{ p: 2, bgcolor: '#FFF8FA', borderTop: '1px solid #FCE7F3' }}>
                      {post.comments.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                          {post.comments.map(c => (
                            <Box
                              key={c.id}
                              sx={{
                                p: 1.2,
                                borderRadius: 3,
                                bgcolor: '#FFFFFF',
                                border: '1px solid #FCE7F3',
                                display: 'flex',
                                gap: 1.2,
                              }}
                            >
                              <Avatar src={getOptimizedImageUrl(c.userAvatar, user.dataSaverMode, 'avatar')} sx={{ width: 26, height: 26 }} />
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 11 }}>
                                    {c.userName}
                                    {c.isVip && (
                                      <Chip label="VIP" size="small" sx={{ ml: 0.5, height: 16, fontSize: 8, bgcolor: '#D4AF37', color: '#FFF' }} />
                                    )}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 10 }}>
                                    {c.createdAt}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#4A2A38', fontSize: 12, mt: 0.3 }}>
                                  {c.text}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', mb: 1.5 }}>
                          Sé el primero en dejar un comentario sensual a esta creadora.
                        </Typography>
                      )}

                      {/* Input */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={commentInputs[post.id] || ''}
                          onChange={e =>
                            setCommentInputs(prev => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              handleCommentSubmit(post.id);
                            }
                          }}
                          placeholder="Escribe un comentario..."
                          sx={{
                            bgcolor: '#FFFFFF',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              fontSize: 12,
                              '& fieldset': { borderColor: '#FCE7F3' },
                            },
                          }}
                        />
                        <Button
                          onClick={() => handleCommentSubmit(post.id)}
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: '#E05D84',
                            color: '#FFFFFF',
                            borderRadius: 3,
                            fontWeight: 800,
                            minWidth: 40,
                            '&:hover': { bgcolor: '#BE185D' },
                          }}
                        >
                          <Send sx={{ fontSize: 16 }} />
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* ========================================================
            FLANK 2: LATERAL DERECHO (20 Fotos de Nuevas Vendedoras)
        ======================================================== */}
        <Box
          component="aside"
          data-testid="feed-flank-new"
          aria-label="Nuevas Vendedoras"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: 1.2
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              pb: 0.75,
              borderBottom: '1px solid #F3DCE6'
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: 900,
                color: '#2D1822',
                fontSize: 11,
                letterSpacing: '0.07em',
                lineHeight: 1.2
              }}
            >
              Nuevas Vendedoras
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: '#BE185D',
                fontSize: 11,
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {newSellerPhotos.length}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 0.65
            }}
          >
            {newSellerPhotos.map(item => (
              <SellerPhotoTile
                key={item.id}
                item={item}
                variant="new"
                dataSaverMode={user.dataSaverMode}
                onSelect={onSelectCreator}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Material UI Tip Dialog */}
      <Dialog
        open={!!tipModalData}
        onClose={() => setTipModalData(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#2D1822', pb: 0.5 }}>
          Enviar Propina a {tipModalData?.creatorName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 12, mb: 2 }}>
            Apoya a tu creadora favorita con PantiCoins doradas.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2 }}>
            {[25, 50, 100, 200].map(amt => (
              <Button
                key={amt}
                onClick={() => setSelectedTipAmount(amt)}
                variant={selectedTipAmount === amt ? 'contained' : 'outlined'}
                sx={{
                  bgcolor: selectedTipAmount === amt ? '#E05D84' : '#FFF8FA',
                  borderColor: selectedTipAmount === amt ? '#E05D84' : '#FCE7F3',
                  color: selectedTipAmount === amt ? '#FFFFFF' : '#2D1822',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {amt} C
              </Button>
            ))}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={2}
            value={tipMessage}
            onChange={e => setTipMessage(e.target.value)}
            placeholder="Dedicatoria o petición especial (opcional)..."
            size="small"
            sx={{
              bgcolor: '#FFF8FA',
              borderRadius: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '& fieldset': { borderColor: '#FCE7F3' },
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 1, borderTop: '1px solid #FCE7F3' }}>
            <Typography variant="caption" sx={{ color: '#7A5868' }}>
              Tu saldo actual:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8A6D1E' }}>
              {user.coins} Coins
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setTipModalData(null)} sx={{ color: '#7A5868' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSendTipConfirm}
            disabled={user.coins < selectedTipAmount}
            variant="contained"
            sx={{ bgcolor: '#E05D84', color: '#FFF', fontWeight: 800, '&:hover': { bgcolor: '#BE185D' } }}
          >
            Confirmar ({selectedTipAmount} C)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
