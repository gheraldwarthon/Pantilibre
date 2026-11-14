import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Avatar
} from '@mui/material';
import {
  Close,
  Check,
  MonetizationOn,
  AutoAwesome,
  Security
} from '@mui/icons-material';
import { Crown } from 'lucide-react';

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSelectPlan: (plan: 'free' | 'gold_vip' | 'black_diamond') => void;
  onBuyCoins: (coins: number, priceUsd: number) => void;
}

export const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectPlan,
  onBuyCoins
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'coins'>('plans');
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoosePlan = (plan: 'free' | 'gold_vip' | 'black_diamond', name: string) => {
    onSelectPlan(plan);
    setPurchaseSuccessMessage(`¡Plan ${name} activado con éxito!`);
    setTimeout(() => {
      setPurchaseSuccessMessage(null);
    }, 2500);
  };

  const handlePurchaseCoins = (coins: number, price: number) => {
    onBuyCoins(coins, price);
    setPurchaseSuccessMessage(`¡${coins} PantiCoins agregadas a tu saldo!`);
    setTimeout(() => {
      setPurchaseSuccessMessage(null);
    }, 2500);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 5,
            bgcolor: '#FFF8FA',
            border: '1px solid #FCE7F3',
            p: { xs: 2, sm: 3 },
            boxShadow: '0 20px 50px rgba(224, 93, 132, 0.16)',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} sx={{ color: '#7A5868' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Chip
          icon={<AutoAwesome sx={{ color: '#D4AF37 !important', fontSize: 16 }} />}
          label="MEMBRESÍAS EXCLUSIVAS & PANTICOINS"
          size="small"
          sx={{ bgcolor: '#FFFDF0', border: '1px solid #F5DE98', color: '#8A6D1E', fontWeight: 800, mb: 1.5 }}
        />
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#2D1822', fontSize: { xs: 20, sm: 26 } }}>
          Eleva tu Experiencia en Pantilibre
        </Typography>
        <Typography variant="body2" sx={{ color: '#7A5868', fontSize: 13, mt: 0.5, maxWidth: 500, mx: 'auto' }}>
          Desbloquea galerías secretas, chatea en directo con tus vendedoras favoritas y obtén descuentos en prendas usadas.
        </Typography>
      </Box>

      {/* Switch Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: 3,
            p: 0.5,
            border: '1px solid #FCE7F3',
            '& .MuiTab-root': { fontWeight: 700, borderRadius: 2.5, textTransform: 'none', px: 3 },
            '& .Mui-selected': { bgcolor: '#E05D84', color: '#FFF !important' },
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          <Tab value="plans" label="Planes de Suscripción" />
          <Tab value="coins" label="Paquetes PantiCoins" icon={<MonetizationOn sx={{ fontSize: 18 }} />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Success alert */}
      {purchaseSuccessMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3, bgcolor: '#ECFDF5', color: '#065F46' }}>
          {purchaseSuccessMessage}
        </Alert>
      )}

      {/* User status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, px: 2.5, mb: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', fontSize: 12 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#7A5868' }}>Plan Actual:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#BE185D', textTransform: 'uppercase' }}>
            {user.plan === 'free' ? 'Fan Gratuito' : user.plan === 'gold_vip' ? 'Gold VIP' : 'Black Diamond'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#7A5868' }}>Tu Saldo:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#8A6D1E' }}>
            {user.coins} Coins
          </Typography>
        </Box>
      </Box>

      {/* Plans View */}
      {activeTab === 'plans' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {/* Plan 1: Free */}
          <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1822' }}>Fan Básico</Typography>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', mb: 2 }}>Para explorar el muro libre.</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1822', mb: 2 }}>$0</Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 12, color: '#4A2A38', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check sx={{ fontSize: 16, color: '#10B981' }} /> Acceso al Muro social libre
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check sx={{ fontSize: 16, color: '#10B981' }} /> Búsqueda y filtros por categorías
                </Box>
              </Box>
            </Box>

            <Button
              fullWidth
              disabled={user.plan === 'free'}
              onClick={() => handleChoosePlan('free', 'Básico')}
              variant="outlined"
              sx={{ borderRadius: 2.5, fontWeight: 700 }}
            >
              {user.plan === 'free' ? 'Plan Actual' : 'Seleccionar Plan'}
            </Button>
          </Box>

          {/* Plan 2: Gold VIP */}
          <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#FFFDF0', border: '2px solid #D4AF37', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)' }}>
            <Chip label="RECOMENDADO" size="small" sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#D4AF37', color: '#FFF', fontWeight: 900, fontSize: 10 }} />
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#8A6D1E' }}>Miembro Gold VIP</Typography>
                <Crown color="#D4AF37" size={20} />
              </Box>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', mb: 2 }}>El pase ideal para interactuar.</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#8A6D1E', mb: 2 }}>$14.99<Typography component="span" variant="caption" sx={{ color: '#7A5868' }}>/m</Typography></Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 12, color: '#2D1822', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  <Check sx={{ fontSize: 16, color: '#D4AF37' }} /> Acceso libre a galerías secretas
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check sx={{ fontSize: 16, color: '#D4AF37' }} /> Chat en directo ilimitado
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check sx={{ fontSize: 16, color: '#D4AF37' }} /> 10% de descuento en prendas usadas
                </Box>
              </Box>
            </Box>

            <Button
              fullWidth
              disabled={user.plan === 'gold_vip'}
              onClick={() => handleChoosePlan('gold_vip', 'Gold VIP')}
              variant="contained"
              sx={{ bgcolor: '#D4AF37', color: '#2D1822', fontWeight: 900, borderRadius: 2.5, '&:hover': { bgcolor: '#B88B22' } }}
            >
              {user.plan === 'gold_vip' ? 'Plan Activo' : 'Elegir Membresía Gold'}
            </Button>
          </Box>

          {/* Plan 3: Black Diamond */}
          <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#FFFFFF', border: '1.5px solid #FBCFE8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#BE185D' }}>Black Diamond</Typography>
                <AutoAwesome sx={{ color: '#E05D84' }} />
              </Box>
              <Typography variant="caption" sx={{ color: '#7A5868', display: 'block', mb: 2 }}>Acceso total sin restricciones.</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#BE185D', mb: 2 }}>$29.99<Typography component="span" variant="caption" sx={{ color: '#7A5868' }}>/m</Typography></Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 12, color: '#4A2A38', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  <Check sx={{ fontSize: 16, color: '#E05D84' }} /> Acceso total a 100% de galerías
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check sx={{ fontSize: 16, color: '#E05D84' }} /> Prioridad máxima en chats
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check sx={{ fontSize: 16, color: '#E05D84' }} /> 25% descuento en boutique
                </Box>
              </Box>
            </Box>

            <Button
              fullWidth
              disabled={user.plan === 'black_diamond'}
              onClick={() => handleChoosePlan('black_diamond', 'Black Diamond')}
              variant="contained"
              sx={{ bgcolor: '#E05D84', color: '#FFF', fontWeight: 800, borderRadius: 2.5, '&:hover': { bgcolor: '#BE185D' } }}
            >
              {user.plan === 'black_diamond' ? 'Plan Activo' : 'Elegir Black Diamond'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Coins View */}
      {activeTab === 'coins' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {[
            { coins: 100, price: 9.99, bonus: 'Básico' },
            { coins: 250, price: 19.99, bonus: '+25 Gratis' },
            { coins: 600, price: 44.99, bonus: '+100 Gratis' },
            { coins: 1500, price: 99.99, bonus: '+350 VIP' },
          ].map(pack => (
            <Box key={pack.coins} sx={{ p: 2.5, borderRadius: 4, bgcolor: '#FFFFFF', border: '1px solid #FCE7F3', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Avatar sx={{ bgcolor: '#FFFDF0', border: '1px solid #F5DE98', color: '#D4AF37', mx: 'auto', mb: 1, width: 44, height: 44 }}>
                  <MonetizationOn />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2D1822' }}>{pack.coins} Coins</Typography>
                <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 800, display: 'block', mb: 2 }}>{pack.bonus}</Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#8A6D1E', mb: 1 }}>${pack.price}</Typography>
                <Button fullWidth onClick={() => handlePurchaseCoins(pack.coins, pack.price)} variant="contained" size="small" sx={{ bgcolor: '#E05D84', color: '#FFF', fontWeight: 700, borderRadius: 2 }}>
                  Comprar
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#7A5868', fontSize: 11 }}>
        <Security sx={{ fontSize: 15, color: '#10B981' }} />
        <span>Facturación 100% discreta en extracto bancario ("P-TECH SERVICES")</span>
      </Box>
    </Dialog>
  );
};
