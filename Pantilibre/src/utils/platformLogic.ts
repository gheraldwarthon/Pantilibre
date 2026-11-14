/**
 * Core business & filtering logic for Pantilibre platform
 */

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  badge: 'VIP' | 'SUPER_VIP' | 'DIAMOND';
  isVerified: boolean;
  isOnline: boolean;
  categories: Array<'gorditas' | 'teens' | 'mature' | 'lingerie' | 'feet' | 'latex' | 'used_clothes' | 'cosplay'>;
  tags: string[];
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  subscribersCount: number;
  monthlySubscriptionPrice: number; // in USD or Coins
  postCount: number;
  privateGalleriesCount: number;
  featured: boolean;
  joinedDate: string; // ISO string
}

export interface Post {
  id: string;
  creatorId: string;
  content: string;
  imageUrls: string[];
  isLocked: boolean;
  coinPrice: number;
  category: 'gorditas' | 'teens' | 'mature' | 'lingerie' | 'feet' | 'latex' | 'used_clothes' | 'cosplay';
  tags: string[];
  likesCount: number;
  commentsCount: number;
  publishedAt: string; // ISO string
}

export interface UserSubscription {
  plan: 'free' | 'gold_vip' | 'black_diamond';
  coins: number;
  unlockedGalleries: string[];
}

/**
 * Filter creators based on category, tags, popularity sort, and search query
 */
export function filterAndSortCreators(
  creators: Creator[],
  filters: {
    category?: string;
    tag?: string;
    searchQuery?: string;
    sortBy?: 'popularity' | 'rating' | 'recent' | 'subscribers';
    onlyVip?: boolean;
    onlyOnline?: boolean;
  }
): Creator[] {
  let result = [...creators];

  if (filters.category && filters.category !== 'all') {
    result = result.filter(c => c.categories.includes(filters.category as any));
  }

  if (filters.tag && filters.tag !== 'all') {
    const cleanTag = filters.tag.replace('#', '').toLowerCase();
    result = result.filter(c => c.tags.some(t => t.toLowerCase() === cleanTag));
  }

  if (filters.searchQuery && filters.searchQuery.trim() !== '') {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filters.onlyVip) {
    result = result.filter(c => c.badge === 'VIP' || c.badge === 'SUPER_VIP' || c.badge === 'DIAMOND');
  }

  if (filters.onlyOnline) {
    result = result.filter(c => c.isOnline);
  }

  // Sorting
  switch (filters.sortBy) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'recent':
      result.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
      break;
    case 'subscribers':
      result.sort((a, b) => b.subscribersCount - a.subscribersCount);
      break;
    case 'popularity':
    default:
      result.sort((a, b) => {
        const scoreA = (a.subscribersCount * 2) + (a.rating * 50) + (a.featured ? 100 : 0);
        const scoreB = (b.subscribersCount * 2) + (b.rating * 50) + (b.featured ? 100 : 0);
        return scoreB - scoreA;
      });
      break;
  }

  return result;
}

/**
 * Check if a gallery or post is accessible by a user
 */
export function canAccessContent(
  user: UserSubscription,
  content: { isLocked: boolean; coinPrice: number; creatorId?: string; contentId: string }
): boolean {
  if (!content.isLocked || content.coinPrice === 0) {
    return true;
  }
  // Black diamond plan has all-access pass
  if (user.plan === 'black_diamond') {
    return true;
  }
  // User specifically bought this gallery/content
  if (user.unlockedGalleries.includes(content.contentId)) {
    return true;
  }
  return false;
}

/**
 * Handle gallery unlock purchase logic
 */
export function unlockContent(
  user: UserSubscription,
  contentId: string,
  coinPrice: number
): { success: boolean; updatedUser?: UserSubscription; error?: string } {
  if (user.unlockedGalleries.includes(contentId)) {
    return { success: true, updatedUser: user };
  }

  if (user.coins < coinPrice) {
    return {
      success: false,
      error: `Saldo insuficiente. Necesitas ${coinPrice} PantiCoins y tienes ${user.coins}.`
    };
  }

  const updatedUser: UserSubscription = {
    ...user,
    coins: user.coins - coinPrice,
    unlockedGalleries: [...user.unlockedGalleries, contentId]
  };

  return { success: true, updatedUser };
}

/**
 * Calculate user membership discount on physical items (like pantis, medias)
 */
export function calculateItemDiscount(basePrice: number, plan: UserSubscription['plan']): {
  discountPercent: number;
  finalPrice: number;
} {
  let discountPercent = 0;
  if (plan === 'gold_vip') {
    discountPercent = 10;
  } else if (plan === 'black_diamond') {
    discountPercent = 25;
  }

  const finalPrice = Math.round((basePrice * (1 - discountPercent / 100)) * 100) / 100;
  return { discountPercent, finalPrice };
}

export interface CreatorPaymentMethod {
  id: string;
  type: 'yape' | 'plin' | 'transfer' | 'paypal' | 'binance' | 'card' | 'bizum' | 'panticoins';
  title: string;
  badge?: string;
  accountHolder?: string;
  accountNumber?: string;
  identifier?: string;
  bankName?: string;
  currencies?: string[];
  instructions?: string;
  isInstant?: boolean;
  minAmount?: string;
  color?: string;
}

/**
 * Returns available payment methods for a creator (Yape, Plin, Transferencia, PayPal, Binance, PantiCoins)
 */
export function getCreatorPaymentMethods(creator: {
  id: string;
  name: string;
  username: string;
  location?: string;
  paymentMethods?: CreatorPaymentMethod[];
}): CreatorPaymentMethod[] {
  if (creator.paymentMethods && creator.paymentMethods.length > 0) {
    return creator.paymentMethods;
  }

  const initials = creator.name.split(' ').map(n => n[0]).join('. ');
  const safeName = `${creator.name.split(' ')[0]} ${initials} (Verificada)`;

  return [
    {
      id: `${creator.id}_yape`,
      type: 'yape',
      title: 'Yape Móvil',
      badge: 'Inmediato · Perú & LatAm',
      accountHolder: safeName,
      identifier: '984 219 750',
      currencies: ['PEN S/.', 'Equivalente USD'],
      instructions: 'Yapea directamente al número de la creadora o escanea su QR. Envía la captura por el chat privado para activar tu orden al instante.',
      isInstant: true,
      minAmount: 'S/ 20.00',
      color: '#742284'
    },
    {
      id: `${creator.id}_plin`,
      type: 'plin',
      title: 'Plin (Interbank / BBVA / Scotiabank)',
      badge: 'Transferencia Rápida',
      accountHolder: safeName,
      identifier: '984 219 750',
      bankName: 'Interbank / BBVA / Scotiabank',
      currencies: ['PEN S/.'],
      instructions: 'Transfiere por Plin sin comisiones desde cualquier banco afiliado. Notifica por chat con el código de operación.',
      isInstant: true,
      minAmount: 'S/ 20.00',
      color: '#00B4D8'
    },
    {
      id: `${creator.id}_transfer`,
      type: 'transfer',
      title: 'Transferencia Bancaria Directa',
      badge: 'BCP / BBVA / Interbank / SPEI',
      accountHolder: safeName,
      accountNumber: '194-9842104-0-48',
      identifier: 'CCI: 002-194-009842104048-91',
      bankName: 'Banco de Crédito BCP / BBVA',
      currencies: ['PEN S/.', 'USD $'],
      instructions: 'Transferencias directas e interbancarias. Concepto neutro sugerido: "Servicios digitales" o "Asesoría personal".',
      isInstant: true,
      color: '#0A3B72'
    },
    {
      id: `${creator.id}_paypal`,
      type: 'paypal',
      title: 'PayPal Internacional',
      badge: 'Protección Comprador VIP',
      accountHolder: `@${creator.username}`,
      identifier: `paypal.me/${creator.username.toLowerCase()}`,
      currencies: ['USD $', 'EUR €', 'Global'],
      instructions: 'Envía tu pago en USD o EUR mediante PayPal. Acepta tarjetas internacionales Visa, Mastercard y American Express con protección cifrada.',
      isInstant: true,
      minAmount: '$10.00 USD',
      color: '#003087'
    },
    {
      id: `${creator.id}_binance`,
      type: 'binance',
      title: 'Binance Pay & Cripto (USDT)',
      badge: '100% Anónimo & Cero Rastro',
      accountHolder: 'Binance VIP ID',
      identifier: 'Pay ID: 492019482',
      accountNumber: 'Red TRC20: TLx7K9QpM4...j8F2aP9',
      currencies: ['USDT', 'BUSD', 'BTC'],
      instructions: 'El método más discreto y privado. Transferencia instantánea sin datos bancarios personales ni comisiones de red usando Binance Pay.',
      isInstant: true,
      color: '#F0B90B'
    },
    {
      id: `${creator.id}_panticoins`,
      type: 'panticoins',
      title: 'Saldo PantiCoins Pantilibre',
      badge: 'Moneda Oficial de la Plataforma',
      accountHolder: `${creator.name} (Billetera VIP)`,
      identifier: `ID: ${creator.id}`,
      currencies: ['PantiCoins (🪙)'],
      instructions: 'Usa tus PantiCoins cargados en tu cuenta para desbloquear galerías, pagar propinas o encargar prendas usadas con 1 clic y discreción bancaria garantizada.',
      isInstant: true,
      color: '#BE185D'
    }
  ];
}

/**
 * Format date/time strings into compact, friendly Spanish representations for mobile & feeds
 */
export function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Reciente';
  const trimmed = dateStr.trim();
  if (
    trimmed.startsWith('Hace') ||
    trimmed.startsWith('Ayer') ||
    trimmed.startsWith('Hoy') ||
    trimmed.startsWith('Justo') ||
    trimmed.includes('min') ||
    trimmed.includes('PM') ||
    trimmed.includes('AM')
  ) {
    return trimmed;
  }

  try {
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return trimmed;
    
    // Fixed reference or relative to now
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (diffMs < 0) return 'Justo ahora';

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return 'Justo ahora';
    if (diffMinutes < 60) return `Hace ${diffMinutes}m`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays}d`;

    // Return readable short date (e.g. "15 oct")
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  } catch {
    return 'Reciente';
  }
}

export interface FeedFlankPhotoItem<T extends Creator = Creator> {
  id: string;
  creator: T;
  imageUrl: string;
  group: 'vip' | 'new';
}

const VIP_BADGE_RANK: Record<Creator['badge'], number> = {
  DIAMOND: 3,
  SUPER_VIP: 2,
  VIP: 1
};

function expandCreatorPhotos<T extends Creator>(
  orderedCreators: T[],
  count: number,
  group: 'vip' | 'new'
): FeedFlankPhotoItem<T>[] {
  if (orderedCreators.length === 0 || count <= 0) {
    return [];
  }

  const items: FeedFlankPhotoItem<T>[] = [];
  const primaryCount = Math.min(orderedCreators.length, count);

  for (let i = 0; i < primaryCount; i++) {
    const creator = orderedCreators[i];
    const imageUrl = creator.avatar || creator.coverImage;
    items.push({
      id: `${group}_${creator.id}_0_${i}`,
      creator,
      imageUrl,
      group
    });
  }

  // If fewer creators than requested slots, expand cleanly using secondary/cover photography
  let pass = 1;
  while (items.length < count) {
    for (let i = 0; i < orderedCreators.length && items.length < count; i++) {
      const creator = orderedCreators[i];
      const imageUrl = pass % 2 === 1
        ? (creator.coverImage || creator.avatar)
        : (creator.avatar || creator.coverImage);
      items.push({
        id: `${group}_${creator.id}_${pass}_${items.length}`,
        creator,
        imageUrl,
        group
      });
    }
    pass++;
  }

  return items;
}

/**
 * Selects 20 VIP seller photos (sorted by tier & popularity) and 20 New seller photos
 * (sorted by most recent joinedDate) for the left and right flanks of the main feed.
 */
export function getFeedFlankPhotos<T extends Creator>(
  creators: T[],
  countPerSide: number = 20
): {
  vipPhotos: FeedFlankPhotoItem<T>[];
  newSellerPhotos: FeedFlankPhotoItem<T>[];
} {
  if (!creators || creators.length === 0 || countPerSide <= 0) {
    return { vipPhotos: [], newSellerPhotos: [] };
  }

  const vipSorted = [...creators].sort((a, b) => {
    const tierDiff = (VIP_BADGE_RANK[b.badge] || 0) - (VIP_BADGE_RANK[a.badge] || 0);
    if (tierDiff !== 0) return tierDiff;
    const subDiff = b.subscribersCount - a.subscribersCount;
    if (subDiff !== 0) return subDiff;
    return b.rating - a.rating;
  });

  const newSorted = [...creators].sort((a, b) => {
    const timeA = new Date(a.joinedDate).getTime() || 0;
    const timeB = new Date(b.joinedDate).getTime() || 0;
    if (timeB !== timeA) return timeB - timeA;
    return b.postCount - a.postCount;
  });

  return {
    vipPhotos: expandCreatorPhotos(vipSorted, countPerSide, 'vip'),
    newSellerPhotos: expandCreatorPhotos(newSorted, countPerSide, 'new')
  };
}


