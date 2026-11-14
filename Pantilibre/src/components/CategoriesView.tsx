import React, { useState, useMemo } from 'react';
import { Creator, CategoryType, UserProfile } from '../types';
import { CATEGORIES_LIST, POPULAR_TAGS } from '../data/mockData';
import { filterAndSortCreators } from '../utils/platformLogic';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search,
  Tune,
  Star,
  Verified,
  ChatBubble,
  Clear,
  LocalFireDepartment,
  AccessTime,
  PeopleAlt,
  GridView,
  ViewAgenda
} from '@mui/icons-material';

interface CategoriesViewProps {
  creators: Creator[];
  user: UserProfile;
  onSelectCreator: (creator: Creator) => void;
  onOpenChatWithCreator: (creator: Creator) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  creators,
  user,
  onSelectCreator,
  onOpenChatWithCreator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'recent' | 'subscribers'>('popularity');
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [onlyVip, setOnlyVip] = useState<boolean>(false);
  const [contentType, setContentType] = useState<'all' | 'galleries' | 'store'>('all');
  const [cardDensity, setCardDensity] = useState<'simplified' | 'detailed'>('simplified');

  const filteredCreators = useMemo(() => {
    let result = filterAndSortCreators(creators, {
      category: selectedCategory,
      tag: selectedTag,
      searchQuery,
      sortBy,
      onlyVip,
      onlyOnline
    });

    if (contentType === 'galleries') {
      result = result.filter(c => c.privateGalleriesCount > 0);
    } else if (contentType === 'store') {
      result = result.filter(c => c.categories.includes('used_clothes'));
    }

    return result;
  }, [creators, selectedCategory, selectedTag, searchQuery, sortBy, onlyVip, onlyOnline, contentType]);

  const activeCategoryInfo = CATEGORIES_LIST.find(c => c.id === selectedCategory);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSearchQuery('');
    setSortBy('popularity');
    setOnlyOnline(false);
    setOnlyVip(false);
    setContentType('all');
  };

  const isAnyFilterActive =
    selectedCategory !== 'all' ||
    selectedTag !== 'all' ||
    searchQuery.trim() !== '' ||
    onlyOnline ||
    onlyVip ||
    contentType !== 'all' ||
    sortBy !== 'popularity';

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
      {/* Streamlined Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1F0A17', fontSize: { xs: 20, sm: 24 }, letterSpacing: '-0.02em' }}>
            Vendedoras VIP por Categoría
          </Typography>
          <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 13, mt: 0.3 }}>
            Encuentra creadoras verificadas por temática, lencería y fetiches exclusivos
          </Typography>
        </Box>

        <Chip
          icon={<Verified sx={{ color: '#D4AF37 !important', fontSize: 16 }} />}
          label={`${filteredCreators.length} vendedoras`}
          sx={{
            bgcolor: '#FFF0F5',
            border: '1px solid #FBCFE8',
            color: '#BE185D',
            fontWeight: 800,
            fontSize: 12,
            boxShadow: '0 2px 8px rgba(190, 24, 93, 0.08)'
          }}
        />
      </Box>

      {/* Thematic Category Pills Strip */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1.2,
          mb: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {CATEGORIES_LIST.map(category => {
          const isSelected = selectedCategory === category.id;
          return (
            <Chip
              key={category.id}
              label={category.label}
              onClick={() => setSelectedCategory(category.id)}
              clickable
              sx={{
                fontWeight: isSelected ? 800 : 600,
                fontSize: 12,
                py: 2,
                px: 0.5,
                bgcolor: isSelected ? '#BE185D' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#4A2A38',
                border: `1.5px solid ${isSelected ? '#BE185D' : '#FCE7F3'}`,
                boxShadow: isSelected ? '0 4px 14px rgba(190, 24, 93, 0.25)' : 'none',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  bgcolor: isSelected ? '#9D174D' : '#FFF0F5',
                  borderColor: isSelected ? '#9D174D' : '#F472B6',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Active Category Description Banner (if category selected) */}
      {activeCategoryInfo && activeCategoryInfo.id !== 'all' && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            px: 2,
            borderRadius: 3,
            bgcolor: '#FFF0F5',
            border: '1px solid #FBCFE8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#BE185D', fontSize: 13 }}>
              {activeCategoryInfo.label}
            </Typography>
            <Typography variant="caption" sx={{ color: '#4A2A38', display: 'block', fontSize: 11.5 }}>
              {activeCategoryInfo.description}
            </Typography>
          </Box>
          <Button
            onClick={() => setSelectedCategory('all')}
            size="small"
            startIcon={<Clear sx={{ fontSize: 13 }} />}
            sx={{ color: '#7A5868', fontSize: 11, fontWeight: 700, textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            Quitar filtro
          </Button>
        </Box>
      )}

      {/* Streamlined Filter Toolbar */}
      <Box
        sx={{
          p: 1.8,
          borderRadius: 3.5,
          bgcolor: '#FFFFFF',
          border: '1px solid #FCE7F3',
          boxShadow: '0 2px 10px rgba(224, 93, 132, 0.04)',
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        {/* Search Box */}
        <TextField
          size="small"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, país, fetiche o etiqueta..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#BE185D', fontSize: 19 }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <Clear sx={{ fontSize: 15 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{
            flex: { xs: '1 1 100%', sm: '1 1 240px' },
            bgcolor: '#FFF8FA',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: 12.5,
              height: 38,
              '& fieldset': { borderColor: '#FCE7F3' },
              '&:hover fieldset': { borderColor: '#F472B6' },
              '&.Mui-focused fieldset': { borderColor: '#BE185D' },
            },
          }}
        />

        {/* Quick Toggles: En Línea & Solo VIP */}
        <Chip
          label="En Línea"
          icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: onlyOnline ? '#FFFFFF' : '#10B981', mr: 0.5 }} />}
          onClick={() => setOnlyOnline(!onlyOnline)}
          clickable
          size="small"
          sx={{
            bgcolor: onlyOnline ? '#10B981' : '#FFF8FA',
            color: onlyOnline ? '#FFFFFF' : '#4B5563',
            fontWeight: 700,
            fontSize: 11.5,
            py: 1.8,
            border: `1px solid ${onlyOnline ? '#10B981' : '#E5E7EB'}`,
            '&:hover': { bgcolor: onlyOnline ? '#059669' : '#ECFDF5' }
          }}
        />

        <Chip
          label="Solo VIP"
          icon={<Star sx={{ fontSize: 14, color: onlyVip ? '#FDE047 !important' : '#D4AF37 !important' }} />}
          onClick={() => setOnlyVip(!onlyVip)}
          clickable
          size="small"
          sx={{
            bgcolor: onlyVip ? '#BE185D' : '#FFF8FA',
            color: onlyVip ? '#FFFFFF' : '#831843',
            fontWeight: 700,
            fontSize: 11.5,
            py: 1.8,
            border: `1px solid ${onlyVip ? '#BE185D' : '#FCE7F3'}`,
            '&:hover': { bgcolor: onlyVip ? '#9D174D' : '#FFF0F5' }
          }}
        />

        {/* Sort Select */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            sx={{
              borderRadius: 3,
              bgcolor: '#FFF8FA',
              fontSize: 12,
              fontWeight: 700,
              color: '#2D1822',
              height: 34,
              '& fieldset': { borderColor: '#FCE7F3' },
            }}
          >
            <MenuItem value="popularity">🔥 Populares</MenuItem>
            <MenuItem value="rating">⭐ Calificación (4.9+)</MenuItem>
            <MenuItem value="subscribers">👑 Más Fans</MenuItem>
            <MenuItem value="recent">📅 Recientes</MenuItem>
          </Select>
        </FormControl>

        {/* Density Selector */}
        <Box
          sx={{
            display: 'inline-flex',
            bgcolor: '#FFF0F5',
            p: 0.3,
            borderRadius: 2.5,
            border: '1px solid #FBCFE8',
            ml: { xs: 0, sm: 'auto' },
          }}
        >
          <Button
            size="small"
            onClick={() => setCardDensity('simplified')}
            startIcon={<GridView sx={{ fontSize: 14 }} />}
            sx={{
              py: 0.2,
              px: 1,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: cardDensity === 'simplified' ? '#BE185D' : 'transparent',
              color: cardDensity === 'simplified' ? '#FFFFFF' : '#7A5868',
              boxShadow: cardDensity === 'simplified' ? '0 2px 6px rgba(190, 24, 93, 0.25)' : 'none',
              '&:hover': {
                bgcolor: cardDensity === 'simplified' ? '#9D174D' : 'rgba(224, 93, 132, 0.08)',
              },
            }}
          >
            Simplificada
          </Button>
          <Button
            size="small"
            onClick={() => setCardDensity('detailed')}
            startIcon={<ViewAgenda sx={{ fontSize: 14 }} />}
            sx={{
              py: 0.2,
              px: 1,
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: cardDensity === 'detailed' ? '#BE185D' : 'transparent',
              color: cardDensity === 'detailed' ? '#FFFFFF' : '#7A5868',
              boxShadow: cardDensity === 'detailed' ? '0 2px 6px rgba(190, 24, 93, 0.25)' : 'none',
              '&:hover': {
                bgcolor: cardDensity === 'detailed' ? '#9D174D' : 'rgba(224, 93, 132, 0.08)',
              },
            }}
          >
            Detallada
          </Button>
        </Box>

        {/* Reset button */}
        {isAnyFilterActive && (
          <Button
            onClick={resetFilters}
            size="small"
            startIcon={<Clear sx={{ fontSize: 13 }} />}
            sx={{ color: '#E11D48', fontWeight: 700, fontSize: 11, textTransform: 'none' }}
          >
            Restablecer
          </Button>
        )}
      </Box>

      {/* Creators Grid */}
      <Box sx={{ mt: 2 }}>
        {filteredCreators.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                cardDensity === 'simplified'
                  ? { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }
                  : { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: cardDensity === 'simplified' ? 2.2 : 3,
            }}
          >
            {filteredCreators.map(creator => {
              const isDiamond = creator.badge === 'DIAMOND';
              const isSuperVip = creator.badge === 'SUPER_VIP';

              if (cardDensity === 'simplified') {
                return (
                  <Card
                    key={creator.id}
                    elevation={0}
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderRadius: 3.5,
                      border: '1.5px solid #FCE7F3',
                      boxShadow: '0 2px 10px rgba(224, 93, 132, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      p: 2.2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: '#F472B6',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 22px rgba(224, 93, 132, 0.12)',
                      },
                    }}
                  >
                    <Box>
                      {/* Top Row: Avatar + Info */}
                      <Box sx={{ display: 'flex', gap: 1.8, alignItems: 'flex-start' }}>
                        {/* Avatar with Status Ring and Online Dot */}
                        <Box
                          onClick={() => onSelectCreator(creator)}
                          sx={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                        >
                          <Avatar
                            src={creator.avatar}
                            alt={creator.name}
                            sx={{
                              width: 58,
                              height: 58,
                              border: `2.5px solid ${creator.isOnline ? '#10B981' : '#FCE7F3'}`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}
                          />
                          {/* Online Indicator Dot */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 1,
                              right: 1,
                              width: 13,
                              height: 13,
                              borderRadius: '50%',
                              bgcolor: creator.isOnline ? '#10B981' : '#9CA3AF',
                              border: '2px solid #FFFFFF',
                              boxShadow: creator.isOnline ? '0 0 6px #10B981' : 'none',
                            }}
                          />
                        </Box>

                        {/* Creator Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, minWidth: 0 }}>
                              <Typography
                                onClick={() => onSelectCreator(creator)}
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 800,
                                  color: '#1F0A17',
                                  fontSize: 15,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  '&:hover': { color: '#BE185D' },
                                }}
                              >
                                {creator.name}
                              </Typography>
                              {creator.isVerified && <Verified sx={{ color: '#D4AF37', fontSize: 16, flexShrink: 0 }} />}
                            </Box>

                            {/* VIP Badge */}
                            <Chip
                              label={creator.badge}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: 9,
                                fontWeight: 900,
                                bgcolor: isDiamond ? '#7E22CE' : isSuperVip ? '#D4AF37' : '#E05D84',
                                color: '#FFFFFF',
                                borderRadius: 1.5,
                                flexShrink: 0,
                              }}
                            />
                          </Box>

                          <Typography
                            variant="caption"
                            sx={{
                              color: '#7A5868',
                              fontSize: 12,
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              mt: 0.2,
                            }}
                          >
                            @{creator.username} · {creator.location}
                          </Typography>

                          {/* Price & Rating in compact header row */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.6 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#8A6D1E', fontSize: 13 }}>
                              ${creator.monthlySubscriptionPrice}
                              <Typography component="span" variant="caption" sx={{ color: '#7A5868', fontWeight: 500, fontSize: 11 }}>
                                /mes
                              </Typography>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                              <Star sx={{ fontSize: 13, color: '#D4AF37' }} />
                              <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D1822', fontSize: 11.5 }}>
                                {creator.rating}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 10.5 }}>
                                ({creator.reviewCount})
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      {/* Compact Tags & Counts Row */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mt: 1.8, alignItems: 'center' }}>
                        {creator.tags.slice(0, 3).map(tag => (
                          <Box
                            key={tag}
                            component="span"
                            sx={{
                              bgcolor: '#FFF0F5',
                              color: '#BE185D',
                              border: '1px solid #FCE7F3',
                              borderRadius: 1.5,
                              px: 0.8,
                              py: 0.2,
                              fontSize: 10.5,
                              fontWeight: 700,
                            }}
                          >
                            #{tag}
                          </Box>
                        ))}
                        <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11, ml: 'auto' }}>
                          {creator.subscribersCount} fans · {creator.privateGalleriesCount} galerías
                        </Typography>
                      </Box>
                    </Box>

                    {/* Simplified Action Buttons */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: 1,
                        mt: 2,
                        pt: 1.5,
                        borderTop: '1px solid #FFF0F5',
                      }}
                    >
                      <Button
                        onClick={() => onSelectCreator(creator)}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#FCE7F3',
                          bgcolor: '#FFF8FA',
                          color: '#4A2A38',
                          fontWeight: 700,
                          borderRadius: 2.5,
                          fontSize: 11.5,
                          py: 0.6,
                          '&:hover': { bgcolor: '#FFF0F5', borderColor: '#F472B6', color: '#BE185D' },
                        }}
                      >
                        Ver Perfil
                      </Button>

                      <Button
                        onClick={() => onOpenChatWithCreator(creator)}
                        variant="contained"
                        size="small"
                        startIcon={<ChatBubble sx={{ fontSize: 14 }} />}
                        sx={{
                          bgcolor: '#E05D84',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          borderRadius: 2.5,
                          fontSize: 11.5,
                          py: 0.6,
                          px: 2,
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#BE185D' },
                        }}
                      >
                        Chatear
                      </Button>
                    </Box>
                  </Card>
                );
              }

              // Detailed View (original)
              return (
                <Card
                  key={creator.id}
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
                  <Box>
                    {/* Cover Image */}
                    <Box sx={{ position: 'relative', height: 125, bgcolor: '#FFF0F5' }}>
                      <Box
                        component="img"
                        src={creator.coverImage}
                        alt="Cover"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <Chip
                          label={creator.isOnline ? 'En Línea' : 'Desconectada'}
                          size="small"
                          sx={{
                            bgcolor: creator.isOnline ? '#ECFDF5' : '#F3F4F6',
                            color: creator.isOnline ? '#065F46' : '#6B7280',
                            border: `1px solid ${creator.isOnline ? '#A7F3D0' : '#E5E7EB'}`,
                            fontWeight: 700,
                            fontSize: 10,
                            height: 20,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Avatar & Header */}
                    <Box sx={{ px: 2.5, pb: 1, position: 'relative', mt: -5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
                        <Box onClick={() => onSelectCreator(creator)} sx={{ position: 'relative', cursor: 'pointer' }}>
                          <Avatar
                            src={creator.avatar}
                            alt={creator.name}
                            sx={{
                              width: 72,
                              height: 72,
                              border: '3px solid #FFFFFF',
                              boxShadow: '0 4px 12px rgba(224, 93, 132, 0.2)',
                            }}
                          />
                          <Chip
                            label={creator.badge}
                            size="small"
                            sx={{
                              position: 'absolute',
                              bottom: -4,
                              right: -4,
                              height: 18,
                              fontSize: 9,
                              fontWeight: 900,
                              bgcolor: isDiamond ? '#7E22CE' : isSuperVip ? '#D4AF37' : '#E05D84',
                              color: '#FFFFFF',
                            }}
                          />
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontSize: 10 }}>
                            SUSCRIPCIÓN
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#8A6D1E' }}>
                            ${creator.monthlySubscriptionPrice}
                            <Typography component="span" variant="caption" sx={{ color: '#7A5868', fontWeight: 500 }}>
                              /mes
                            </Typography>
                          </Typography>
                        </Box>
                      </Box>

                      {/* Name & verification */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Typography
                          onClick={() => onSelectCreator(creator)}
                          variant="subtitle1"
                          sx={{ fontWeight: 800, color: '#2D1822', cursor: 'pointer', '&:hover': { color: '#E05D84' } }}
                        >
                          {creator.name}
                        </Typography>
                        {creator.isVerified && <Verified sx={{ color: '#D4AF37', fontSize: 18 }} />}
                      </Box>

                      <Typography variant="caption" sx={{ color: '#7A5868' }}>
                        @{creator.username} · {creator.location}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#4A2A38',
                          fontSize: 12,
                          mt: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 34,
                        }}
                      >
                        {creator.bio}
                      </Typography>

                      {/* Clean Unboxed Tags */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1.5 }}>
                        {creator.tags.slice(0, 4).map(tag => (
                          <Typography key={tag} variant="caption" sx={{ color: '#BE185D', fontWeight: 700, fontSize: 11 }}>
                            #{tag}
                          </Typography>
                        ))}
                      </Box>

                      {/* Stats strip */}
                      <Box
                        sx={{
                          mt: 2,
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor: '#FFF8FA',
                          border: '1px solid #FCE7F3',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          textAlign: 'center',
                        }}
                      >
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#8A6D1E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.3 }}>
                            <Star sx={{ fontSize: 13, color: '#D4AF37' }} />
                            {creator.rating}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 10, display: 'block' }}>
                            {creator.reviewCount} reviews
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822', display: 'block' }}>
                            {creator.subscribersCount}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 10, display: 'block' }}>
                            Fans
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1822', display: 'block' }}>
                            {creator.privateGalleriesCount}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 10, display: 'block' }}>
                            Galerías VIP
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <CardActions sx={{ p: 2, pt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Button
                      onClick={() => onSelectCreator(creator)}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#FCE7F3',
                        color: '#4A2A38',
                        fontWeight: 700,
                        borderRadius: 2.5,
                        fontSize: 11,
                        '&:hover': { bgcolor: '#FFF0F5', borderColor: '#FBCFE8' },
                      }}
                    >
                      Ver Perfil
                    </Button>

                    <Button
                      onClick={() => onOpenChatWithCreator(creator)}
                      variant="contained"
                      size="small"
                      startIcon={<ChatBubble sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: '#E05D84',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        borderRadius: 2.5,
                        fontSize: 11,
                        '&:hover': { bgcolor: '#BE185D' },
                      }}
                    >
                      Chatear
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ p: 6, bgcolor: '#FFFFFF', borderRadius: 4, border: '1px solid #FCE7F3', textAlign: 'center', maxWidth: 480, mx: 'auto' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822', mb: 1 }}>
              No encontramos vendedoras con estos filtros
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 12, mb: 3 }}>
              Prueba cambiando la temática seleccionada o limpiando las etiquetas.
            </Typography>
            <Button onClick={resetFilters} variant="contained" sx={{ bgcolor: '#E05D84', color: '#FFF' }}>
              Restablecer todos los filtros
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
