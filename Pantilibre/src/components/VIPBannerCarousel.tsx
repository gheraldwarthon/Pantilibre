import React from 'react';
import { Creator } from '../types';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Rating,
  IconButton
} from '@mui/material';
import {
  Verified,
  ChatBubble,
  ArrowForward,
  Star
} from '@mui/icons-material';
import { Crown } from 'lucide-react';

interface VIPBannerCarouselProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onOpenChatWithCreator: (creator: Creator) => void;
  onViewAllVIP: () => void;
}

export const VIPBannerCarousel: React.FC<VIPBannerCarouselProps> = ({
  creators,
  onSelectCreator,
  onOpenChatWithCreator,
  onViewAllVIP
}) => {
  const vipCreators = creators.filter(
    c => c.badge === 'VIP' || c.badge === 'SUPER_VIP' || c.badge === 'DIAMOND'
  );

  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(180deg, #FFF0F5 0%, #FFF8FA 100%)',
        borderBottom: '1px solid #FCE7F3',
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
        {/* Header Strip */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 3,
                bgcolor: '#FFFDF0',
                border: '1px solid #F5DE98',
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Crown size={22} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822', fontSize: { xs: 16, sm: 19 } }}>
                  Vendedoras VIP Destacadas
                </Typography>
                <Chip
                  label="VERIFICADAS"
                  size="small"
                  sx={{
                    bgcolor: '#FFFDF0',
                    border: '1px solid #F5DE98',
                    color: '#8A6D1E',
                    fontWeight: 800,
                    fontSize: '10px',
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontSize: 12 }}>
                Creadoras exclusivas con atención personalizada, envíos discretos y galerías privadas
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={onViewAllVIP}
            size="small"
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              color: '#BE185D',
              fontWeight: 700,
              fontSize: '12px',
              '&:hover': { bgcolor: '#FCE7F3' },
            }}
          >
            Ver todas
          </Button>
        </Box>

        {/* Horizontal Creator Cards Strip */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 1.5,
            pt: 0.5,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#F472B6', borderRadius: 4 },
          }}
        >
          {vipCreators.map(creator => {
            const isDiamond = creator.badge === 'DIAMOND';
            const isSuperVip = creator.badge === 'SUPER_VIP';

            return (
              <Card
                key={creator.id}
                elevation={0}
                sx={{
                  flexShrink: 0,
                  width: { xs: 260, sm: 290 },
                  bgcolor: '#FFFFFF',
                  borderRadius: 4,
                  border: '1px solid #FCE7F3',
                  boxShadow: '0 4px 18px -2px rgba(224, 93, 132, 0.08)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: '#E05D84',
                    boxShadow: '0 10px 24px -4px rgba(224, 93, 132, 0.16)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, pb: 1 }}>
                  {/* Top Avatar & Name */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                      onClick={() => onSelectCreator(creator)}
                      sx={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                    >
                      <Avatar
                        src={creator.avatar}
                        alt={creator.name}
                        sx={{
                          width: 56,
                          height: 56,
                          border: '2.5px solid #F5DE98',
                          boxShadow: '0 2px 8px rgba(212, 175, 55, 0.25)',
                        }}
                      />
                      {creator.isOnline && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 14,
                            height: 14,
                            bgcolor: '#10B981',
                            borderRadius: '50%',
                            border: '2.5px solid #FFFFFF',
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                          onClick={() => onSelectCreator(creator)}
                          variant="subtitle2"
                          sx={{
                            fontWeight: 800,
                            color: '#2D1822',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            '&:hover': { color: '#E05D84' },
                          }}
                        >
                          {creator.name}
                        </Typography>
                        {creator.isVerified && (
                          <Verified sx={{ color: '#D4AF37', fontSize: 16, flexShrink: 0 }} />
                        )}
                      </Box>

                      <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontSize: 11 }}>
                        @{creator.username}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={creator.badge}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: 9,
                            fontWeight: 800,
                            bgcolor: isDiamond ? '#F3E8FF' : isSuperVip ? '#FFFDF0' : '#FCE7F3',
                            color: isDiamond ? '#7E22CE' : isSuperVip ? '#8A6D1E' : '#BE185D',
                            border: `1px solid ${isDiamond ? '#D8B4FE' : isSuperVip ? '#F5DE98' : '#FBCFE8'}`,
                          }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#8A6D1E' }}>
                          <Star sx={{ fontSize: 13, color: '#D4AF37', mr: 0.2 }} />
                          {creator.rating}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Bio */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A2A38',
                      fontSize: 12,
                      mt: 1.5,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 34,
                    }}
                  >
                    {creator.bio}
                  </Typography>
                </CardContent>

                {/* Card Actions */}
                <Box
                  sx={{
                    p: 1.5,
                    pt: 1,
                    borderTop: '1px solid #FFF0F5',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={() => onSelectCreator(creator)}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#FCE7F3',
                      color: '#4A2A38',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: 2.5,
                      '&:hover': { bgcolor: '#FFF5F8', borderColor: '#FBCFE8' },
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
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: 2.5,
                      '&:hover': { bgcolor: '#BE185D' },
                    }}
                  >
                    Chat VIP
                  </Button>
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
