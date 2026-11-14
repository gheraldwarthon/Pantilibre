import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  Chip,
  Switch,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Diamond as DiamondIcon,
  WorkspacePremium as PremiumIcon,
  PhotoCamera as PhotoIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import type { SellerTier } from '../types';
import { fetchAdminSellers, fetchAllProfiles, updateSellerControl, type AdminSellerRow, type DbProfile } from '../services/dataService';

interface AdminPanelProps {
  onBack: () => void;
}

const tierChip = (tier: SellerTier | null | undefined) => {
  if (!tier) return <Chip label="Fan / Sin tienda" size="small" sx={{ bgcolor: '#F3F4F6', color: '#6B7280', fontWeight: 800, fontSize: 10, height: 22 }} />;
  if (tier === 'vip') return <Chip label="VIP" size="small" sx={{ bgcolor: '#D4AF37', color: '#2D1822', fontWeight: 900, fontSize: 10, height: 22 }} />;
  return <Chip label="FREE" size="small" sx={{ bgcolor: '#FFF0F5', color: '#BE185D', fontWeight: 900, fontSize: 10, height: 22 }} />;
};

const badgeChip = (badge: string) => {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    VIP: { label: 'VIP', bg: '#FEF3C7', fg: '#92400E' },
    SUPER_VIP: { label: 'SUPER VIP', bg: '#FDE68A', fg: '#78350F' },
    DIAMOND: { label: 'DIAMOND', bg: '#E0F2FE', fg: '#075985' }
  };
  const cfg = map[badge] || map.VIP;
  return <Chip icon={<DiamondIcon sx={{ fontSize: 12, color: `${cfg.fg} !important` }} />} label={cfg.label} size="small" sx={{ bgcolor: cfg.bg, color: cfg.fg, fontWeight: 900, fontSize: 10, height: 22 }} />;
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [sellers, setSellers] = useState<AdminSellerRow[]>([]);
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);
  const [limitDrafts, setLimitDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sellerRows, profileRows] = await Promise.all([fetchAdminSellers(), fetchAllProfiles()]);
      setSellers(sellerRows);
      setProfiles(profileRows);
      const drafts: Record<string, string> = {};
      sellerRows.forEach(r => {
        if (r.profile.seller_tier) drafts[r.profile.id] = r.profile.photo_limit === null ? '' : String(r.profile.photo_limit);
      });
      setLimitDrafts(drafts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleChangeTier = async (profileId: string, current: SellerTier | null, next: SellerTier) => {
    try {
      await updateSellerControl(profileId, { sellerTier: next });
      setSellers(prev =>
        prev.map(r => (r.profile.id === profileId ? { ...r, profile: { ...r.profile, seller_tier: next } } : r))
      );
      setProfiles(prev => prev.map(p => (p.id === profileId ? { ...p, seller_tier: next } : p)));
      setToast({ msg: current === next ? 'Sin cambios' : next === 'vip' ? 'Vendedora promovida a VIP' : 'Vendedora cambiada a plan FREE', severity: 'success' });
    } catch (err) {
      setToast({ msg: err instanceof Error ? err.message : 'Error al actualizar', severity: 'error' });
    }
  };

  const handleToggleVerified = async (profileId: string, current: boolean) => {
    try {
      await updateSellerControl(profileId, { isVerified: !current });
      setSellers(prev => prev.map(r => (r.profile.id === profileId && r.creator ? { ...r, creator: { ...r.creator, is_verified: !current } } : r)));
      setToast({ msg: !current ? 'Vendedora verificada' : 'Verificación retirada', severity: 'success' });
    } catch (err) {
      setToast({ msg: err instanceof Error ? err.message : 'Error al actualizar', severity: 'error' });
    }
  };

  const handleToggleFeatured = async (profileId: string, current: boolean) => {
    try {
      await updateSellerControl(profileId, { featured: !current });
      setSellers(prev => prev.map(r => (r.profile.id === profileId && r.creator ? { ...r, creator: { ...r.creator, featured: !current } } : r)));
      setToast({ msg: !current ? 'Vendedora destacada en la portada' : 'Destacado retirado', severity: 'success' });
    } catch (err) {
      setToast({ msg: err instanceof Error ? err.message : 'Error al actualizar', severity: 'error' });
    }
  };

  const handleChangeBadge = async (profileId: string, badge: 'VIP' | 'SUPER_VIP' | 'DIAMOND') => {
    try {
      await updateSellerControl(profileId, { badge });
      setSellers(prev => prev.map(r => (r.profile.id === profileId && r.creator ? { ...r, creator: { ...r.creator, badge } } : r)));
      setToast({ msg: `Insignia actualizada a ${badge.replace('_', ' ')}`, severity: 'success' });
    } catch (err) {
      setToast({ msg: err instanceof Error ? err.message : 'Error al actualizar', severity: 'error' });
    }
  };

  const handleSaveLimit = async (profileId: string) => {
    const raw = (limitDrafts[profileId] ?? '').trim();
    const parsed = raw === '' ? null : Number(raw);
    if (parsed !== null && (!Number.isFinite(parsed) || parsed < 0)) {
      setToast({ msg: 'Introduce un número válido (vacío = ilimitado)', severity: 'error' });
      return;
    }
    try {
      await updateSellerControl(profileId, { photoLimit: parsed });
      setSellers(prev => prev.map(r => (r.profile.id === profileId ? { ...r, profile: { ...r.profile, photo_limit: parsed } } : r)));
      setToast({ msg: parsed === null ? 'Límite de fotos: ilimitado' : `Límite de fotos fijado en ${parsed} por día`, severity: 'success' });
    } catch (err) {
      setToast({ msg: err instanceof Error ? err.message : 'Error al actualizar', severity: 'error' });
    }
  };

  const filteredSellers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sellers;
    return sellers.filter(r =>
      r.profile.name.toLowerCase().includes(q) ||
      r.profile.username.toLowerCase().includes(q)
    );
  }, [sellers, search]);

  const vipCount = profiles.filter(p => p.seller_tier === 'vip').length;
  const freeCount = profiles.filter(p => p.seller_tier === 'free').length;
  const fanCount = profiles.filter(p => p.role === 'fan').length;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1.2, borderRadius: 3, bgcolor: '#FFF0F5', color: '#BE185D', display: 'flex' }}>
            <AdminIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#2D1822', lineHeight: 1.2 }}>
              Centro de Control
            </Typography>
            <Typography variant="caption" sx={{ color: '#7A5868', fontWeight: 600 }}>
              Decide quién es vendedora VIP o FREE, sus límites de fotos, verificación y destacados
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => void load()} sx={{ borderRadius: 3, fontWeight: 700 }}>
            Actualizar
          </Button>
          <Button variant="contained" onClick={onBack} sx={{ borderRadius: 3, fontWeight: 700 }}>
            Volver a la app
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          { label: 'Vendedoras VIP', value: vipCount, color: '#D4AF37' },
          { label: 'Vendedoras FREE', value: freeCount, color: '#BE185D' },
          { label: 'Fans registrados', value: fanCount, color: '#E05D84' },
          { label: 'Total cuentas', value: profiles.length, color: '#2D1822' }
        ].map(stat => (
          <Card key={stat.label} elevation={0} sx={{ p: 2, borderRadius: 4, border: '1.5px solid #FCE7F3', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#7A5868', fontWeight: 700, display: 'block' }}>{stat.label}</Typography>
            <Typography sx={{ fontWeight: 900, fontSize: 28, color: stat.color }}>{stat.value}</Typography>
          </Card>
        ))}
      </Box>

      <Card elevation={0} sx={{ borderRadius: 4, border: '1.5px solid #FCE7F3', overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: 13 } }}>
            <Tab label={`Vendedoras (${filteredSellers.length})`} />
            <Tab label={`Todas las cuentas (${profiles.length})`} />
          </Tabs>
          <TextField
            size="small"
            placeholder="Buscar por nombre o usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 280 }, bgcolor: '#FFF', '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </Box>
        <Divider sx={{ mt: 1.5 }} />

        {loading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography sx={{ color: '#7A5868', fontWeight: 600 }}>Cargando cuentas...</Typography>
          </Box>
        ) : tab === 0 ? (
          <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 640 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['Vendedora', 'Nivel', 'Insignia', 'Límite de fotos / día', 'Verificada', 'Destacada'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 900, color: '#2D1822', bgcolor: '#FFF8FA', fontSize: 12 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSellers.map(row => (
                  <TableRow key={row.profile.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={row.profile.avatar_url} sx={{ width: 36, height: 36, border: '2px solid #FBCFE8' }} />
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#2D1822' }}>{row.profile.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 700 }}>@{row.profile.username}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.profile.seller_tier === 'vip' ? 'Pasar a plan FREE' : 'Promover a vendedora VIP'}>
                        <Switch
                          checked={row.profile.seller_tier === 'vip'}
                          onChange={e => void handleChangeTier(row.profile.id, row.profile.seller_tier, e.target.checked ? 'vip' : 'free')}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#D4AF37' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#D4AF37' }
                          }}
                        />
                      </Tooltip>
                      {tierChip(row.profile.seller_tier)}
                    </TableCell>
                    <TableCell>
                      {row.creator && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {(['VIP', 'SUPER_VIP', 'DIAMOND'] as const).map(b => (
                            <Tooltip key={b} title={`Marcar como ${b.replace('_', ' ')}`}>
                              <IconButton size="small" onClick={() => void handleChangeBadge(row.profile.id, b)}
                                sx={{ color: row.creator!.badge === b ? '#D4AF37' : '#D1D5DB' }}>
                                <PremiumIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.profile.seller_tier ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <TextField
                            size="small"
                            value={limitDrafts[row.profile.id] ?? ''}
                            onChange={e => setLimitDrafts(prev => ({ ...prev, [row.profile.id]: e.target.value }))}
                            placeholder="∞"
                            type="number"
                            sx={{ width: 76, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } }}
                          />
                          <IconButton size="small" onClick={() => void handleSaveLimit(row.profile.id)} sx={{ color: '#BE185D' }}>
                            <PhotoIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <Typography variant="caption" sx={{ color: '#9D7387', fontSize: 10, maxWidth: 90 }}>
                            {row.profile.photo_limit === null ? 'Ilimitado' : `Máx ${row.profile.photo_limit}/día`}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => void handleToggleVerified(row.profile.id, Boolean(row.creator?.is_verified))}
                        sx={{ color: row.creator?.is_verified ? '#059669' : '#D1D5DB' }}>
                        <VerifiedIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => void handleToggleFeatured(row.profile.id, Boolean(row.creator?.featured))}
                        sx={{ color: row.creator?.featured ? '#D4AF37' : '#D1D5DB' }}>
                        {row.creator?.featured ? <StarIcon sx={{ fontSize: 20 }} /> : <StarBorderIcon sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 640 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['Usuario', 'Usuario (@)', 'Rol', 'Membresía', 'Nivel tienda', 'Coins'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 900, color: '#2D1822', bgcolor: '#FFF8FA', fontSize: 12 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles
                  .filter(p => {
                    const q = search.trim().toLowerCase();
                    return !q || p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q);
                  })
                  .map(p => (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={p.avatar_url} sx={{ width: 30, height: 30 }} />
                          <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#2D1822' }}>{p.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: '#BE185D', fontWeight: 700 }}>@{p.username}</Typography></TableCell>
                      <TableCell>
                        <Chip label={p.role === 'admin' ? 'Admin' : p.role === 'creator' ? 'Vendedora' : 'Fan'} size="small"
                          sx={{ bgcolor: p.role === 'admin' ? '#FEE2E2' : '#FFF0F5', color: p.role === 'admin' ? '#991B1B' : '#BE185D', fontWeight: 800, fontSize: 10, height: 20 }} />
                      </TableCell>
                      <TableCell><Typography variant="caption" sx={{ fontWeight: 700 }}>{p.plan.toUpperCase()}</Typography></TableCell>
                      <TableCell>{tierChip(p.seller_tier)}</TableCell>
                      <TableCell><Typography sx={{ fontWeight: 800, fontSize: 13, color: '#8A6D1E' }}>{p.coins}</Typography></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast?.severity || 'success'} onClose={() => setToast(null)} sx={{ borderRadius: 3, fontWeight: 700 }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};
