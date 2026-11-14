import React, { useState } from 'react';
import { PantilibreLogo } from './PantilibreLogo';
import { Creator, PrivateGallery, UserProfile, CreatorStory } from '../types';
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Tooltip,
  Divider
} from '@mui/material';
import {
  AutoAwesome,
  Verified,
  Security,
  ArrowForward,
  Tune,
  MarkEmailRead,
  LocalShipping,
  ExpandMore,
  MonetizationOn,
  Lock,
  ChatBubble,
  CheckCircle,
  Visibility,
  Favorite,
  ShieldOutlined,
  Inventory2Outlined,
  CreditCardOutlined,
  PhotoCamera,
  NotificationsActive
} from '@mui/icons-material';
import { Crown, Sparkles } from 'lucide-react';

interface LandingPageViewProps {
  creators: Creator[];
  galleries: PrivateGallery[];
  user: UserProfile;
  stories?: CreatorStory[];
  onSelectStory?: (storyId: string) => void;
  onExploreFeed: () => void;
  onExploreCategories: () => void;
  onExploreVIP: () => void;
  onSelectCreator: (creator: Creator) => void;
  onOpenChatWithCreator: (creator: Creator) => void;
  onUnlockGallery: (gallery: PrivateGallery) => void;
  onOpenPlans: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenLegal: (page: 'terms' | 'privacy') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  creators,
  galleries,
  user,
  stories,
  onSelectStory,
  onExploreFeed,
  onExploreCategories,
  onExploreVIP,
  onSelectCreator,
  onOpenChatWithCreator,
  onUnlockGallery,
  onOpenPlans,
  onOpenAuth,
  onOpenLegal
}) => {
  const featuredVip = creators.filter(c => c.featured);
  const popularGalleries = galleries.slice(0, 4);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<string | false>('faq1');

  const handleFaqChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFF8F9', color: '#2D1822', display: 'flex', flexDirection: 'column' }}>
      
      {/* ========================================================
          HERO SECTION (Rich Luxury Rose Gradient)
      ======================================================== */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 7, md: 10 },
          pb: { xs: 8, md: 11 },
          background: 'radial-gradient(ellipse 100% 75% at 50% -10%, rgba(244, 114, 182, 0.42) 0%, rgba(251, 168, 203, 0.5) 30%, rgba(252, 215, 233, 0.75) 65%, #FFF0F5 100%), linear-gradient(180deg, #F9A8D4 0%, #F48FB1 15%, #FBCFE8 45%, #FCE7F3 75%, #FFF0F5 100%)',
          borderBottom: '1px solid #FBCFE8',
          textAlign: 'center',
          color: '#1F0A17',
        }}
      >
        {/* Subtle decorative background ambient glow circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '340px', md: '900px' },
            height: { xs: '340px', md: '560px' },
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(244, 114, 182, 0.4) 45%, rgba(255, 255, 255, 0) 75%)',
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'blur(30px)',
          }}
        />

        <Box sx={{ maxWidth: '1050px', mx: 'auto', px: 3, position: 'relative', zIndex: 1 }}>
          {/* Exclusive Platform Pill */}
          <Chip
            icon={<AutoAwesome sx={{ color: '#BE185D !important', fontSize: 16 }} />}
            label="✨ CLUB SOCIAL VIP · LUJO FETICHISTA & BOUTIQUE"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              border: '1.5px solid #F472B6',
              color: '#831843',
              fontWeight: 800,
              fontSize: { xs: 10, sm: 11 },
              letterSpacing: 0.5,
              mb: { xs: 2, sm: 3 },
              maxWidth: '100%',
              boxShadow: '0 4px 18px rgba(190, 24, 93, 0.16)',
            }}
          />

          {/* Large Hero Balloon Gold Logo */}
          <Box sx={{ mb: { xs: 2, sm: 3.5 }, display: 'flex', justifyContent: 'center' }}>
            <PantilibreLogo size="xl" showSubtitle={true} className="items-center scale-90 sm:scale-100" subtitleClassName="text-[#BE185D] font-bold tracking-wide drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]" />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.65rem', sm: '2.4rem', md: '3.1rem' },
              lineHeight: 1.22,
              color: '#1F0A17',
              maxWidth: 860,
              mx: 'auto',
              mb: { xs: 1.5, sm: 2.5 },
              letterSpacing: '-0.02em',
              textShadow: '0 2px 16px rgba(244, 114, 182, 0.25)',
            }}
          >
            El Santuario Privado del Fetiche, la Lencería y la Sensualidad
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 740,
              mx: 'auto',
              color: '#4A1D36',
              fontWeight: 500,
              lineHeight: 1.65,
              fontSize: { xs: 14, sm: 17 },
              mb: { xs: 3, sm: 5 },
              px: { xs: 1, sm: 0 },
              '& strong': {
                color: '#BE185D',
                fontWeight: 800,
              },
            }}
          >
            Conecta con vendedoras VIP verificadas, accede a sets fotográficos y videos íntimos sin censura,
            chatea en directo y adquiere prendas de colección selladas al vacío con <strong>100% de discreción bancaria</strong>.
          </Typography>

          {/* Main Auth Actions: Side-by-side on mobile, elegant on desktop */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'auto auto' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1.2, sm: 2 },
              mb: 2,
              maxWidth: { xs: '360px', sm: 'none' },
              mx: 'auto'
            }}
          >
            <Button
              onClick={() => onOpenAuth('login')}
              variant="outlined"
              size="large"
              startIcon={<Lock sx={{ color: '#BE185D', fontSize: { xs: 17, sm: 20 } }} />}
              sx={{
                width: '100%',
                bgcolor: '#FFFFFF',
                color: '#BE185D',
                border: '2px solid #F472B6',
                fontWeight: 900,
                fontSize: { xs: 13, sm: 16 },
                borderRadius: 3.5,
                px: { xs: 1.5, sm: 4.5 },
                py: { xs: 1.2, sm: 1.6 },
                boxShadow: '0 4px 16px rgba(190, 24, 93, 0.12)',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: '#FFF0F5',
                  borderColor: '#BE185D',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Iniciar Sesión
            </Button>

            <Button
              onClick={() => onOpenAuth('register')}
              variant="contained"
              size="large"
              startIcon={<AutoAwesome sx={{ color: '#FDE047 !important', fontSize: { xs: 17, sm: 20 } }} />}
              sx={{
                width: '100%',
                background: 'linear-gradient(135deg, #BE185D 0%, #E05D84 50%, #9D174D 100%)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: { xs: 13, sm: 16 },
                borderRadius: 3.5,
                px: { xs: 1.5, sm: 5 },
                py: { xs: 1.2, sm: 1.6 },
                boxShadow: '0 6px 24px rgba(190, 24, 93, 0.35)',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: 'linear-gradient(135deg, #9D174D 0%, #BE185D 50%, #831843 100%)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Registrarse VIP
            </Button>
          </Box>

          {/* Secondary Discovery CTAs: Primary prominent button + quick discovery pills */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.2,
              mb: { xs: 4, md: 6 },
              maxWidth: { xs: '360px', sm: 'none' },
              mx: 'auto'
            }}
          >
            <Button
              onClick={onExploreFeed}
              variant="contained"
              size="medium"
              endIcon={<ArrowForward />}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                color: '#FFFFFF',
                bgcolor: '#831843',
                fontWeight: 900,
                fontSize: 14,
                borderRadius: 3,
                px: 3.5,
                py: 1.2,
                boxShadow: '0 4px 16px rgba(131, 24, 67, 0.25)',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#9D174D',
                },
              }}
            >
              Explorar Muro VIP
            </Button>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'auto auto' }, gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                onClick={onExploreVIP}
                variant="outlined"
                size="medium"
                startIcon={<Crown color="#BE185D" size={17} />}
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  color: '#BE185D',
                  fontWeight: 800,
                  fontSize: { xs: 12, sm: 13 },
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  borderColor: '#FBCFE8',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    borderColor: '#E05D84',
                  },
                }}
              >
                Vendedoras
              </Button>

              <Button
                onClick={onOpenPlans}
                variant="outlined"
                size="medium"
                startIcon={<MonetizationOn sx={{ color: '#D97706', fontSize: 17 }} />}
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  px: 2,
                  py: 1,
                  color: '#854D0E',
                  bgcolor: 'rgba(255, 253, 240, 0.95)',
                  borderColor: '#FDE68A',
                  fontWeight: 800,
                  fontSize: { xs: 12, sm: 13 },
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#FEF9C3',
                    borderColor: '#F59E0B',
                  },
                }}
              >
                PantiCoins
              </Button>
            </Box>
          </Box>

          {/* 4 Pillars of Trust & Discretion Strip: 2x2 on mobile, 4 in a row on desktop */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 1.5, sm: 2 },
              textAlign: 'left',
              pt: { xs: 1, sm: 2 },
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: '#FFFFFF',
                border: '1.5px solid #FCE7F3',
                boxShadow: '0 6px 18px rgba(224, 93, 132, 0.07)',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#E05D84',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 24px rgba(224, 93, 132, 0.16)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <Security sx={{ color: '#BE185D', fontSize: 22 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 13.5 }}>
                  Discreción Bancaria
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#6B4C5D', fontSize: 12, lineHeight: 1.45, display: 'block' }}>
                Cobros neutros en tu extracto sin menciones explícitas a la temática.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: '#FFFFFF',
                border: '1.5px solid #FCE7F3',
                boxShadow: '0 6px 18px rgba(224, 93, 132, 0.07)',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#E05D84',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 24px rgba(224, 93, 132, 0.16)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <LocalShipping sx={{ color: '#BE185D', fontSize: 22 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 13.5 }}>
                  Sellado al Vacío
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#6B4C5D', fontSize: 12, lineHeight: 1.45, display: 'block' }}>
                Prendas con esencia intacta, doble empaque hermético y caja neutra.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: '#FFFFFF',
                border: '1.5px solid #FCE7F3',
                boxShadow: '0 6px 18px rgba(224, 93, 132, 0.07)',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#E05D84',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 24px rgba(224, 93, 132, 0.16)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <Verified sx={{ color: '#BE185D', fontSize: 22 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 13.5 }}>
                  Modelos Verificadas
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#6B4C5D', fontSize: 12, lineHeight: 1.45, display: 'block' }}>
                Perfiles 100% reales mayores de 18 años con verificación biométrica.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: '#FFFFFF',
                border: '1.5px solid #FCE7F3',
                boxShadow: '0 6px 18px rgba(224, 93, 132, 0.07)',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#E05D84',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 24px rgba(224, 93, 132, 0.16)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                <MarkEmailRead sx={{ color: '#BE185D', fontSize: 22 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 13.5 }}>
                  Chat & PantiCoins
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#6B4C5D', fontSize: 12, lineHeight: 1.45, display: 'block' }}>
                Mensajería privada sin dar tu número ni exponer tus redes sociales.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          SECTION: ¿CÓMO FUNCIONA PANTILIBRE? (Light Pink Gradient to White)
      ======================================================== */}
      <Box
        component="section"
        sx={{
          py: 9.5,
          background: 'linear-gradient(180deg, #FFF0F5 0%, #FCE7F3 35%, #FFF8FA 70%, #FFFFFF 100%)',
          borderBottom: '1px solid #FBCFE8',
          color: '#2D1822',
          position: 'relative',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 680, mx: 'auto', mb: 6 }}>
            <Chip
              label="PASO A PASO"
              size="small"
              sx={{
                bgcolor: '#FFF0F5',
                color: '#BE185D',
                border: '1px solid #FBCFE8',
                fontWeight: 800,
                fontSize: 11,
                mb: 1.5,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', mb: 1.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              ¿Cómo Funciona la Experiencia Pantilibre?
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B4C5D', fontSize: 15 }}>
              Una experiencia intuitiva y segura pensada para fans exigentes y creadoras exclusivas.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3.5,
              position: 'relative',
            }}
          >
            {/* Step 1 */}
            <Box
              sx={{
                p: 3.5,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1.5px solid #FCE7F3',
                boxShadow: '0 10px 25px rgba(224, 93, 132, 0.07)',
                position: 'relative',
                transition: 'all 0.25s',
                '&:hover': {
                  borderColor: '#E05D84',
                  boxShadow: '0 16px 36px rgba(224, 93, 132, 0.16)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: '#FFF0F5',
                  border: '1.5px solid #FBCFE8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#BE185D',
                  fontWeight: 900,
                  fontSize: 20,
                  mb: 2.5,
                }}
              >
                1
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822', mb: 1.5 }}>
                Explora & Filtra por Fetiches
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B4C5D', lineHeight: 1.65, fontSize: 14 }}>
                Encuentra vendedoras según tus gustos: Curvy, Teens 18+, Mature, Tacones y Pies, Lencería de seda, Látex o Cosplay. Conoce sus perfiles, tarifas y fotos previas.
              </Typography>
              <Button
                onClick={onExploreCategories}
                size="small"
                endIcon={<ArrowForward />}
                sx={{ color: '#BE185D', fontWeight: 800, mt: 2.5, p: 0, '&:hover': { color: '#9D174D' } }}
              >
                Ver categorías
              </Button>
            </Box>

            {/* Step 2 */}
            <Box
              sx={{
                p: 3.5,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1.5px solid #FCE7F3',
                boxShadow: '0 10px 25px rgba(224, 93, 132, 0.07)',
                position: 'relative',
                transition: 'all 0.25s',
                '&:hover': {
                  borderColor: '#E05D84',
                  boxShadow: '0 16px 36px rgba(224, 93, 132, 0.16)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: '#FFFDF0',
                  border: '1.5px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  fontWeight: 900,
                  fontSize: 20,
                  mb: 2.5,
                }}
              >
                2
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822', mb: 1.5 }}>
                Desbloquea Sets & Chatea en Vivo
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B4C5D', lineHeight: 1.65, fontSize: 14, '& strong': { color: '#BE185D' } }}>
                Utiliza tus <strong>PantiCoins</strong> para desbloquear galerías privadas sin censura, enviar propinas con mensaje destacado y hablar por chat privado con tus modelos favoritas.
              </Typography>
              <Button
                onClick={onOpenPlans}
                size="small"
                endIcon={<ArrowForward />}
                sx={{ color: '#D97706', fontWeight: 800, mt: 2.5, p: 0, '&:hover': { color: '#B45309' } }}
              >
                Cómo conseguir PantiCoins
              </Button>
            </Box>

            {/* Step 3 */}
            <Box
              sx={{
                p: 3.5,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1.5px solid #FCE7F3',
                boxShadow: '0 10px 25px rgba(224, 93, 132, 0.07)',
                position: 'relative',
                transition: 'all 0.25s',
                '&:hover': {
                  borderColor: '#E05D84',
                  boxShadow: '0 16px 36px rgba(224, 93, 132, 0.16)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: '#FFF0F5',
                  border: '1.5px solid #FBCFE8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#BE185D',
                  fontWeight: 900,
                  fontSize: 20,
                  mb: 2.5,
                }}
              >
                3
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822', mb: 1.5 }}>
                Recibe Prendas Selladas al Vacío
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B4C5D', lineHeight: 1.65, fontSize: 14 }}>
                Solicita pantis y medias usadas directamente a las creadoras. Cada prenda se termosella al vacío para conservar su aroma y textura, enviándose en caja neutra con código de rastreo.
              </Typography>
              <Button
                onClick={onExploreFeed}
                size="small"
                endIcon={<ArrowForward />}
                sx={{ color: '#BE185D', fontWeight: 800, mt: 2.5, p: 0, '&:hover': { color: '#9D174D' } }}
              >
                Ver muro de pedidos
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          LIVE STORIES BAR (Historias de Vendedoras)
      ======================================================== */}
      {stories && stories.length > 0 && onSelectStory && (
        <Box sx={{ py: 3.5, bgcolor: '#FFFFFF', borderBottom: '1px solid #FCE7F3' }}>
          <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                p: 1.5,
                px: 2,
                borderRadius: '8px',
                border: '1.5px solid #FCE7F3',
                bgcolor: '#FFF8FA',
                boxShadow: '0 2px 10px rgba(224, 93, 132, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Box
                  sx={{
                    p: 0.8,
                    bgcolor: '#FFF0F5',
                    borderRadius: '6px',
                    border: '1px solid #FBCFE8',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <PhotoCamera sx={{ color: '#BE185D', fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822', fontSize: 15, lineHeight: 1.2 }}>
                    Historias en Vivo de Vendedoras VIP
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9D7387', fontSize: 11 }}>
                    Contenido exclusivo efímero (24h) de tus creadoras favoritas
                  </Typography>
                </Box>
              </Box>

              <Chip
                label="EN VIVO 24H"
                size="small"
                sx={{
                  bgcolor: '#FEF08A',
                  color: '#854D0E',
                  fontWeight: 900,
                  fontSize: 10,
                  height: 22,
                  borderRadius: '4px',
                  border: '1px solid #FDE047'
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
              {stories.map(st => (
                <Box
                  key={st.id}
                  onClick={() => onSelectStory(st.id)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    width: 76,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.06)' }
                  }}
                >
                  <Box
                    sx={{
                      p: 0.35,
                      borderRadius: '50%',
                      background: st.viewed
                        ? '#E5E7EB'
                        : 'linear-gradient(135deg, #E05D84 0%, #F59E0B 50%, #BE185D 100%)',
                      boxShadow: st.viewed ? 'none' : '0 4px 14px rgba(224, 93, 132, 0.45)',
                      mb: 0.8
                    }}
                  >
                    <Avatar
                      src={st.creatorAvatar}
                      alt={st.creatorName}
                      sx={{ width: 62, height: 62, border: '3px solid #FFF' }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 11.5,
                      fontWeight: st.viewed ? 600 : 800,
                      color: st.viewed ? '#9CA3AF' : '#2D1822',
                      maxWidth: 76,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {st.creatorName.split(' ')[0]}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* ========================================================
          FEATURED VIP SELLERS (Creadoras Destacadas)
      ======================================================== */}
      <Box sx={{ py: 9, bgcolor: '#FFF8FA', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, gap: 2, mb: 5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Crown color="#D4AF37" size={26} />
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  Vendedoras VIP Más Solicitadas
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#7A5868', mt: 0.5, fontSize: 15 }}>
                Creadoras verificadas con reputación impecable, chats activos y envíos discretos garantizados.
              </Typography>
            </Box>

            <Button
              onClick={onExploreVIP}
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{
                color: '#BE185D',
                borderColor: '#FBCFE8',
                fontWeight: 800,
                borderRadius: 3,
                bgcolor: '#FFFFFF',
                '&:hover': { bgcolor: '#FFF0F5', borderColor: '#E05D84' },
              }}
            >
              Ver Todas las VIP ({creators.length})
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {featuredVip.slice(0, 4).map(creator => (
              <Card
                key={creator.id}
                elevation={0}
                sx={{
                  bgcolor: '#FFFFFF',
                  borderRadius: 4,
                  border: '1px solid #FCE7F3',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s',
                  '&:hover': {
                    borderColor: '#E05D84',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 36px rgba(224, 93, 132, 0.16)',
                  },
                }}
              >
                {/* Header Cover Banner */}
                <Box sx={{ position: 'relative', height: 140 }}>
                  <Box
                    component="img"
                    src={creator.coverImage}
                    alt={creator.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Chip
                    label={creator.badge}
                    size="small"
                    icon={<Crown size={12} color="#FFF" />}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: '#D4AF37',
                      color: '#FFF',
                      fontWeight: 900,
                      fontSize: 10,
                    }}
                  />
                  {creator.isOnline && (
                    <Chip
                      label="EN VIVO"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        bgcolor: 'rgba(34, 197, 94, 0.9)',
                        color: '#FFF',
                        fontWeight: 800,
                        fontSize: 9,
                        height: 20,
                      }}
                    />
                  )}
                </Box>

                {/* Avatar and Info Body */}
                <Box sx={{ p: 2.5, pt: 0, position: 'relative', mt: -4.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Avatar
                    src={creator.avatar}
                    alt={creator.name}
                    onClick={() => onSelectCreator(creator)}
                    sx={{
                      width: 68,
                      height: 68,
                      border: '3px solid #FFF',
                      mb: 1.5,
                      boxShadow: '0 4px 12px rgba(224, 93, 132, 0.25)',
                      cursor: 'pointer'
                    }}
                  />

                  <Box
                    onClick={() => onSelectCreator(creator)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer' }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822', lineHeight: 1.2 }}>
                      {creator.name}
                    </Typography>
                    <Verified sx={{ color: '#D4AF37', fontSize: 18 }} />
                  </Box>

                  <Typography
                    variant="caption"
                    onClick={() => onSelectCreator(creator)}
                    sx={{ color: '#7A5868', mb: 1, display: 'block', cursor: 'pointer' }}
                  >
                    @{creator.username} · {creator.location}
                  </Typography>

                  {/* Rating & reviews */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: '#D4AF37', fontSize: 14 }} />
                    <Typography variant="caption" sx={{ color: '#8A6D1E', fontWeight: 800, fontSize: 12 }}>
                      {creator.rating}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7A5868', fontSize: 11 }}>
                      ({creator.reviewCount})
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4A2A38',
                      fontSize: 12,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {creator.bio}
                  </Typography>

                  {/* Category Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, mt: 'auto' }}>
                    {creator.tags.slice(0, 3).map(tag => (
                      <Chip
                        key={tag}
                        label={`#${tag}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          bgcolor: '#FFF0F5',
                          color: '#BE185D',
                          fontWeight: 700,
                        }}
                      />
                    ))}
                  </Box>

                  {/* Pricing and Action Buttons */}
                  <Box sx={{ pt: 1.5, borderTop: '1px solid #FCE7F3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', fontSize: 10 }}>
                        Suscripción
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#8A6D1E', fontSize: 14 }}>
                        ${creator.monthlySubscriptionPrice}/mes
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Chatear">
                        <Button
                          size="small"
                          onClick={() => onOpenChatWithCreator(creator)}
                          sx={{
                            minWidth: 36,
                            p: 0.8,
                            borderRadius: 2,
                            bgcolor: '#FFF0F5',
                            color: '#BE185D',
                            '&:hover': { bgcolor: '#FCE7F3' },
                          }}
                        >
                          <ChatBubble sx={{ fontSize: 18 }} />
                        </Button>
                      </Tooltip>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => onSelectCreator(creator)}
                        sx={{
                          bgcolor: '#E05D84',
                          fontWeight: 800,
                          fontSize: 12,
                          borderRadius: 2,
                          px: 1.5,
                          '&:hover': { bgcolor: '#BE185D' },
                        }}
                      >
                        Perfil
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          POPULAR PRIVATE GALLERIES (Galerías Destacadas)
      ======================================================== */}
      <Box sx={{ py: 9, bgcolor: '#FFFFFF', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'flex-end' }, gap: 2, mb: 5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lock sx={{ color: '#D4AF37', fontSize: 24 }} />
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  Galerías Privadas Más Deseadas
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#7A5868', mt: 0.5, fontSize: 15 }}>
                Sets de fotos y videos exclusivos sin censura, desbloqueables al instante con PantiCoins.
              </Typography>
            </Box>

            <Button
              onClick={onExploreFeed}
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{
                color: '#BE185D',
                borderColor: '#FBCFE8',
                fontWeight: 800,
                borderRadius: 3,
                bgcolor: '#FFFFFF',
                '&:hover': { bgcolor: '#FFF0F5', borderColor: '#E05D84' },
              }}
            >
              Ver Muro de Galerías
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {popularGalleries.map(gallery => {
              const isUnlocked = user.unlockedGalleries.includes(gallery.id);

              return (
                <Box
                  key={gallery.id}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: '#FFF8FA',
                    border: '1px solid #FCE7F3',
                    transition: 'all 0.25s',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      borderColor: '#E05D84',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 14px 30px rgba(224, 93, 132, 0.14)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 210 }}>
                    <Box
                      component="img"
                      src={gallery.coverImage}
                      alt={gallery.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isUnlocked ? 'none' : 'blur(5px)',
                        transform: 'scale(1.05)',
                        transition: 'filter 0.3s ease',
                      }}
                    />

                    {/* Gradient Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(45, 24, 34, 0.8) 0%, rgba(45, 24, 34, 0.2) 60%, rgba(0,0,0,0) 100%)',
                      }}
                    />

                    {/* Lock / Unlocked status badge */}
                    <Chip
                      icon={isUnlocked ? <CheckCircle sx={{ color: '#22c55e !important', fontSize: 16 }} /> : <Lock sx={{ color: '#D4AF37 !important', fontSize: 16 }} />}
                      label={isUnlocked ? 'DESBLOQUEADO' : `${gallery.coinPrice} COINS`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        color: isUnlocked ? '#166534' : '#8A6D1E',
                        fontWeight: 900,
                        fontSize: 11,
                      }}
                    />

                    {/* Media Count Chip */}
                    <Chip
                      icon={<Visibility sx={{ color: '#FFF !important', fontSize: 14 }} />}
                      label={`${gallery.mediaCount} fotos`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        bgcolor: 'rgba(0, 0, 0, 0.65)',
                        color: '#FFF',
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar src={gallery.creatorAvatar} sx={{ width: 24, height: 24 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#7A5868' }}>
                        {gallery.creatorName}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822', mb: 1, lineHeight: 1.3 }}>
                      {gallery.title}
                    </Typography>

                    <Typography variant="caption" sx={{ color: '#5C3849', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {gallery.description}
                    </Typography>

                    <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #FCE7F3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Favorite sx={{ fontSize: 16, color: '#E05D84' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#4A2A38' }}>
                          {gallery.likesCount}
                        </Typography>
                      </Box>

                      {isUnlocked ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={onExploreFeed}
                          sx={{ borderRadius: 2, fontSize: 11, fontWeight: 800, color: '#22c55e', borderColor: '#bbf7d0' }}
                        >
                          Ver en Feed
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => onUnlockGallery(gallery)}
                          startIcon={<MonetizationOn sx={{ fontSize: 16 }} />}
                          sx={{
                            borderRadius: 2,
                            fontSize: 11,
                            fontWeight: 800,
                            bgcolor: '#E05D84',
                            '&:hover': { bgcolor: '#BE185D' },
                          }}
                        >
                          Desbloquear
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          THEMATIC CATEGORIES & FETISHES (8 Fetiches Exclusivos)
      ======================================================== */}
      <Box sx={{ py: 9, bgcolor: '#FFF8FA', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: 3 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 650, mx: 'auto', mb: 6 }}>
            <Chip
              label="DIRECTORIO FETICHE"
              size="small"
              sx={{ bgcolor: '#FFFDF0', border: '1px solid #F5DE98', color: '#8A6D1E', fontWeight: 800, fontSize: 11, mb: 1.5 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', mb: 1.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Explora por Fetiches & Especialidades
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 15 }}>
              Desde lencería fina y prendas usadas selladas al vacío, hasta adoración de pies, látex brillante y curvas abundantes.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
            {[
              {
                title: 'Gorditas / Curvy',
                badge: 'CURVAS REALES',
                icon: '🍑',
                desc: 'Abundancia voluptuosa, corsets apretados, caderas anchas y lencería sexy para cuerpos reales.',
              },
              {
                title: 'Teens (18+)',
                badge: 'JUVENTUD & FRESCURA',
                icon: '🌸',
                desc: 'Adultas jóvenes (18+), medias escolares, calcetines transparentes, inocencia y picardía.',
              },
              {
                title: 'Mature / MILF',
                badge: 'ELEGANCIA EXPERTA',
                icon: '🍷',
                desc: 'Mujeres maduras sofisticadas, satén vintage, medias de costura trasera y maestría en seducción.',
              },
              {
                title: 'Lencería & Medias',
                badge: 'NYLON & ENCAJE',
                icon: '✨',
                desc: 'Pantis de seda, ligueros franceses, encaje transparente y medias de cristal con brillo deslumbrante.',
              },
              {
                title: 'Pies & Tacones',
                badge: 'ADORACIÓN & ARCOS',
                icon: '👠',
                desc: 'Suelas cuidadas, pedicura en esmalte rojo, arcos pronunciados, tacones aguja y calcetas húmedas.',
              },
              {
                title: 'Cuero & Látex',
                badge: 'BRILLO & DOMINIO',
                icon: '🖤',
                desc: 'Trajes de vinilo ajustados, catsuits de goma pulidos con silicona, botas hasta el muslo y guantes.',
              },
              {
                title: 'Prendas Usadas',
                badge: 'ENVÍO AL VACÍO',
                icon: '📦',
                desc: 'Pantis y medias usadas certificadas, termoselladas al vacío para preservar su aroma y humedad original.',
              },
              {
                title: 'Cosplay & Fantasías',
                badge: 'JUEGOS DE ROL',
                icon: '🎭',
                desc: 'Disfraces de mucama, enfermera, colegiala, personajes anime y fantasías personalizadas bajo pedido.',
              },
            ].map(cat => (
              <Box
                key={cat.title}
                onClick={onExploreCategories}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #FCE7F3',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(224, 93, 132, 0.04)',
                  '&:hover': {
                    borderColor: '#E05D84',
                    bgcolor: '#FFF5F8',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 24px rgba(224, 93, 132, 0.12)',
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography sx={{ fontSize: 28 }}>{cat.icon}</Typography>
                    <Chip
                      label={cat.badge}
                      size="small"
                      sx={{
                        fontSize: 9,
                        fontWeight: 900,
                        height: 20,
                        bgcolor: '#FFF0F5',
                        color: '#BE185D',
                      }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822', mb: 1 }}>
                    {cat.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#5C3849', fontSize: 13, lineHeight: 1.5 }}>
                    {cat.desc}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2.5, color: '#BE185D', fontWeight: 800, fontSize: 12 }}>
                  <span>Explorar vendedoras</span>
                  <ArrowForward sx={{ fontSize: 14 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          DISCRETION & SAFETY GUARANTEES (Seguridad y Empaque)
      ======================================================== */}
      <Box sx={{ py: 9, bgcolor: '#FFFFFF', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ maxWidth: '1100px', mx: 'auto', px: 3 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 650, mx: 'auto', mb: 6 }}>
            <Chip
              icon={<Security sx={{ fontSize: 16, color: '#D4AF37 !important' }} />}
              label="PROTOCOLOS DE DISCRECIÓN"
              size="small"
              sx={{ bgcolor: '#FFFDF0', border: '1px solid #F5DE98', color: '#8A6D1E', fontWeight: 800, fontSize: 11, mb: 1.5 }}
            />
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', mb: 1.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Tu Privacidad es Nuestra Máxima Prioridad
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 15 }}>
              Diseñado desde cero para que disfrutes de tus gustos con total tranquilidad, anonimato y respeto.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3.5 }}>
            <Box sx={{ p: 3.5, borderRadius: 4, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
              <CreditCardOutlined sx={{ fontSize: 36, color: '#D4AF37', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822', mb: 1 }}>
                Facturación Oculta
              </Typography>
              <Typography variant="body2" sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                En tu tarjeta o cuenta bancaria nunca aparecerá la palabra 'Pantilibre' ni términos para adultos. El cobro figura bajo una denominación comercial genérica de servicios en la nube.
              </Typography>
            </Box>

            <Box sx={{ p: 3.5, borderRadius: 4, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
              <Inventory2Outlined sx={{ fontSize: 36, color: '#D4AF37', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822', mb: 1 }}>
                Empaque Neutro Certificado
              </Typography>
              <Typography variant="body2" sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                Las prendas se empaquetan en doble bolsa hermética al vacío y se introducen en cajas de cartón sin marcas ni alusiones al contenido. Nadie sabrá qué contiene el paquete.
              </Typography>
            </Box>

            <Box sx={{ p: 3.5, borderRadius: 4, bgcolor: '#FFF8FA', border: '1px solid #FCE7F3' }}>
              <ShieldOutlined sx={{ fontSize: 36, color: '#D4AF37', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1822', mb: 1 }}>
                Verificación Estricta 18+
              </Typography>
              <Typography variant="body2" sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                Todas las creadoras superan una rigurosa validación de documento de identidad oficial y prueba biométrica en video antes de poder publicar o chatear. Tolerancia cero a menores.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          COMMUNITY REVIEWS & TESTIMONIALS
      ======================================================== */}
      <Box sx={{ py: 9, bgcolor: '#FFF8FA', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', mb: 1.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Lo que Opinan Nuestros Miembros VIP
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 15 }}>
              Testimonios reales de compradores y vendedoras sobre la experiencia en Pantilibre.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3.5 }}>
            <Box sx={{ p: 3.5, borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
              <Rating value={5} readOnly size="small" sx={{ color: '#D4AF37', mb: 2 }} />
              <Typography variant="body2" sx={{ color: '#2D1822', fontStyle: 'italic', mb: 2.5, lineHeight: 1.6, fontSize: 14 }}>
                "La discreción del envío de los pantis de Madame Victoria fue impresionante. Llegó al vacío en una caja kraft normal sin ningún olor exterior. La prenda conservaba toda su esencia intacta. 10/10."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#FFF0F5', color: '#BE185D', fontWeight: 800 }}>R</Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822' }}>Roberto C.</Typography>
                  <Typography variant="caption" sx={{ color: '#7A5868' }}>Miembro Gold VIP · Madrid</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 3.5, borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
              <Rating value={5} readOnly size="small" sx={{ color: '#D4AF37', mb: 2 }} />
              <Typography variant="body2" sx={{ color: '#2D1822', fontStyle: 'italic', mb: 2.5, lineHeight: 1.6, fontSize: 14 }}>
                "Como creadora, me siento sumamente protegida. Los pagos en PantiCoins son instantáneos, no tengo que dar mi número de teléfono ni mis datos personales y los fans son muy respetuosos."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={creators[0]?.avatar} sx={{ width: 40, height: 40 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822' }}>Camila Gold</Typography>
                  <Typography variant="caption" sx={{ color: '#8A6D1E', fontWeight: 700 }}>Vendedora VIP Verificada</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 3.5, borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3' }}>
              <Rating value={5} readOnly size="small" sx={{ color: '#D4AF37', mb: 2 }} />
              <Typography variant="body2" sx={{ color: '#2D1822', fontStyle: 'italic', mb: 2.5, lineHeight: 1.6, fontSize: 14 }}>
                "El sistema de PantiCoins me permite desbloquear galerías al instante y dejar propinas sin que aparezca nada raro en mi estado de cuenta. La mejor plataforma para amantes del buen fetiche."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#FFFDF0', color: '#8A6D1E', fontWeight: 800 }}>G</Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822' }}>Guillermo M.</Typography>
                  <Typography variant="caption" sx={{ color: '#7A5868' }}>Miembro Black Diamond · CDMX</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          INTERACTIVE FAQ ACCORDION
      ======================================================== */}
      <Box sx={{ py: 9, bgcolor: '#FFFFFF', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ maxWidth: '850px', mx: 'auto', px: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Preguntas Frecuentes
            </Typography>
            <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 15 }}>
              Resolvemos tus dudas sobre seguridad, envíos, privacidad y el uso de PantiCoins.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Accordion
              expanded={expandedFaq === 'faq1'}
              onChange={handleFaqChange('faq1')}
              sx={{
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                borderRadius: '16px !important',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#E05D84' }} />}>
                <Typography sx={{ fontWeight: 800, color: '#2D1822', fontSize: 15 }}>
                  ¿Cómo aparecerán los cargos en mi extracto de tarjeta?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                <Typography sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                  Garantizamos discreción total. El cargo aparecerá registrado bajo un nombre genérico de servicios informáticos y consultoría digital. En ningún momento se mencionará 'Pantilibre', lencería ni ningún concepto para adultos.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedFaq === 'faq2'}
              onChange={handleFaqChange('faq2')}
              sx={{
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                borderRadius: '16px !important',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#E05D84' }} />}>
                <Typography sx={{ fontWeight: 800, color: '#2D1822', fontSize: 15 }}>
                  ¿Cómo se empaquetan y envían las prendas usadas?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                <Typography sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                  Cada prenda solicitada se procesa bajo el uso pactado y se sella inmediatamente en doble bolsa hermética termosellada al vacío para bloquear el aire y preservar la fragancia y textura original. Luego se introduce en un sobre o caja neutra de paquetería estándar (sin logotipos) y se entrega con código de seguimiento.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedFaq === 'faq3'}
              onChange={handleFaqChange('faq3')}
              sx={{
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                borderRadius: '16px !important',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#E05D84' }} />}>
                <Typography sx={{ fontWeight: 800, color: '#2D1822', fontSize: 15 }}>
                  ¿Qué son los PantiCoins y para qué sirven?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                <Typography sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                  Los PantiCoins son la moneda virtual de la plataforma. Te permiten desbloquear galerías fotográficas HD, pagar fotos exclusivas dentro del chat, enviar propinas a las modelos y encargar prendas sin tener que ingresar tus datos bancarios en cada transacción individual.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedFaq === 'faq4'}
              onChange={handleFaqChange('faq4')}
              sx={{
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                borderRadius: '16px !important',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#E05D84' }} />}>
                <Typography sx={{ fontWeight: 800, color: '#2D1822', fontSize: 15 }}>
                  ¿Las modelos son 100% reales y mayores de edad?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                <Typography sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                  Absolutamente sí. Aplicamos una política estricta de verificación de edad (18+). Cada creadora debe pasar un proceso de autenticación con documento de identidad gubernamental y una selfie dinámica en vivo antes de recibir la insignia verificada y poder monetizar.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expandedFaq === 'faq5'}
              onChange={handleFaqChange('faq5')}
              sx={{
                bgcolor: '#FFF8FA',
                border: '1px solid #FCE7F3',
                borderRadius: '16px !important',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#E05D84' }} />}>
                <Typography sx={{ fontWeight: 800, color: '#2D1822', fontSize: 15 }}>
                  ¿Puedo registrarme como vendedora o modelo?
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                <Typography sx={{ color: '#5C3849', fontSize: 14, lineHeight: 1.6 }}>
                  Sí. En el botón superior de perfil puedes seleccionar el rol de Creadora VIP para gestionar tu catálogo, configurar tus precios de suscripción mensual, subir tus galerías privadas y atender pedidos de prendas con las comisiones más competitivas del sector.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          FINAL CONVERSION BANNER (Soft Rose Gradient)
      ======================================================== */}
      <Box sx={{ py: 10, bgcolor: '#FFF8FA', borderBottom: '1px solid #FCE7F3' }}>
        <Box sx={{ maxWidth: '1000px', mx: 'auto', px: 3 }}>
          <Box
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 5,
              background: 'linear-gradient(135deg, #FFF0F5 0%, #FCE7F3 50%, #FBCFE8 100%)',
              border: '1px solid #F472B6',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(224, 93, 132, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <PantilibreLogo size="lg" />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', mb: 2, fontSize: { xs: '1.6rem', sm: '2.2rem' } }}>
              Descubre el Universo Pantilibre Hoy Mismo
            </Typography>

            <Typography variant="body1" sx={{ color: '#5C3849', maxWidth: 620, mx: 'auto', mb: 4, fontSize: 16 }}>
              Ingresa al muro VIP, interactúa con creadoras exclusivas y disfruta de la comunidad más sofisticada y discreta.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                onClick={() => onOpenAuth('login')}
                variant="outlined"
                size="large"
                startIcon={<Lock sx={{ color: '#BE185D' }} />}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#BE185D',
                  borderColor: '#F472B6',
                  fontWeight: 900,
                  fontSize: 15,
                  borderRadius: 3.5,
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: '#FFF0F5', borderColor: '#BE185D' },
                }}
              >
                Iniciar Sesión
              </Button>

              <Button
                onClick={() => onOpenAuth('register')}
                variant="contained"
                size="large"
                startIcon={<AutoAwesome sx={{ color: '#FDE047 !important' }} />}
                sx={{
                  background: 'linear-gradient(135deg, #BE185D 0%, #E05D84 100%)',
                  fontWeight: 900,
                  fontSize: 15,
                  borderRadius: 3.5,
                  px: 4.5,
                  py: 1.5,
                  boxShadow: '0 8px 24px -2px rgba(190, 24, 93, 0.35)',
                  '&:hover': { bgcolor: '#9D174D' },
                }}
              >
                Registrarse Gratis
              </Button>

              <Button
                onClick={onExploreFeed}
                variant="text"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  color: '#831843',
                  fontWeight: 800,
                  fontSize: 15,
                  borderRadius: 3.5,
                  px: 3.5,
                  py: 1.5,
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': { bgcolor: '#FFFFFF' },
                }}
              >
                Explorar Muro VIP
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ========================================================
          FOOTER (Discreet & Elegant)
      ======================================================== */}
      <Box sx={{ py: 5, bgcolor: '#FFFFFF', mt: 'auto' }}>
        <Box
          sx={{
            maxWidth: '1280px',
            mx: 'auto',
            px: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PantilibreLogo size="sm" />
            <Chip
              label="18+ SOLO ADULTOS"
              size="small"
              sx={{ bgcolor: '#FFF0F5', border: '1px solid #FCE7F3', color: '#BE185D', fontWeight: 900, fontSize: 10 }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, fontSize: 13, color: '#7A5868' }}>
            <Typography
              component="span"
              onClick={onExploreFeed}
              sx={{ cursor: 'pointer', '&:hover': { color: '#E05D84' }, fontWeight: 600, fontSize: 13 }}
            >
              Muro VIP
            </Typography>
            <Typography
              component="span"
              onClick={onExploreCategories}
              sx={{ cursor: 'pointer', '&:hover': { color: '#E05D84' }, fontWeight: 600, fontSize: 13 }}
            >
              Categorías
            </Typography>
            <Typography
              component="span"
              onClick={onExploreVIP}
              sx={{ cursor: 'pointer', '&:hover': { color: '#E05D84' }, fontWeight: 600, fontSize: 13 }}
            >
              Vendedoras
            </Typography>
            <Typography
              component="span"
              onClick={onOpenPlans}
              sx={{ cursor: 'pointer', '&:hover': { color: '#E05D84' }, fontWeight: 600, fontSize: 13 }}
            >
              PantiCoins
            </Typography>
            <Typography
              component="span"
              onClick={() => onOpenAuth('register')}
              sx={{ cursor: 'pointer', '&:hover': { color: '#E05D84' }, fontWeight: 600, fontSize: 13 }}
            >
              Registro & Roles
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#FCE7F3' }} />
            <Typography
              component="span"
              onClick={() => onOpenLegal('terms')}
              sx={{ cursor: 'pointer', '&:hover': { color: '#E05D84' }, fontWeight: 600, fontSize: 13 }}
            >
              Términos y Condiciones
            </Typography>
            <Typography
              component="span"
              onClick={() => onOpenLegal('privacy')}
              sx={{ cursor: 'pointer', '&:hover': { color: '#E05D84' }, fontWeight: 600, fontSize: 13 }}
            >
              Política de Privacidad
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: '#7A5868', textAlign: { xs: 'center', md: 'right' } }}>
            © 2026 Pantilibre. Plataforma para mayores de 18 años. Todos los derechos reservados.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
