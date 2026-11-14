import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortCreators,
  canAccessContent,
  unlockContent,
  calculateItemDiscount,
  getCreatorPaymentMethods,
  formatRelativeTime,
  getFeedFlankPhotos,
  type Creator,
  type UserSubscription
} from './platformLogic.ts';

const mockCreators: Creator[] = [
  {
    id: 'c1',
    name: 'Camila Gold',
    username: 'camilagold',
    avatar: '/mock/c1.jpg',
    coverImage: '/mock/cover1.jpg',
    badge: 'SUPER_VIP',
    isVerified: true,
    isOnline: true,
    categories: ['teens', 'lingerie', 'feet'],
    tags: ['medias', 'tacones', 'satin'],
    bio: 'Modelo de lencería fina y medias de seda.',
    location: 'Madrid, ES',
    rating: 4.95,
    reviewCount: 140,
    subscribersCount: 2800,
    monthlySubscriptionPrice: 15,
    postCount: 84,
    privateGalleriesCount: 12,
    featured: true,
    joinedDate: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'c2',
    name: 'Elena Curvy Velvet',
    username: 'elenacurvy',
    avatar: '/mock/c2.jpg',
    coverImage: '/mock/cover2.jpg',
    badge: 'VIP',
    isVerified: true,
    isOnline: false,
    categories: ['gorditas', 'latex'],
    tags: ['curvy', 'gordita', 'latex'],
    bio: 'Curvas peligrosas y outfits en vinilo.',
    location: 'Buenos Aires, AR',
    rating: 4.88,
    reviewCount: 95,
    subscribersCount: 1950,
    monthlySubscriptionPrice: 12,
    postCount: 52,
    privateGalleriesCount: 8,
    featured: false,
    joinedDate: '2024-03-15T00:00:00.000Z'
  },
  {
    id: 'c3',
    name: 'Madame Victoria Mature',
    username: 'victoriamature',
    avatar: '/mock/c3.jpg',
    coverImage: '/mock/cover3.jpg',
    badge: 'DIAMOND',
    isVerified: true,
    isOnline: true,
    categories: ['mature', 'used_clothes'],
    tags: ['mature', 'ropausada', 'medias'],
    bio: 'Experiencia y elegancia. Prendas exclusivas con mi aroma.',
    location: 'Ciudad de México, MX',
    rating: 4.99,
    reviewCount: 310,
    subscribersCount: 4200,
    monthlySubscriptionPrice: 20,
    postCount: 120,
    privateGalleriesCount: 22,
    featured: true,
    joinedDate: '2023-11-20T00:00:00.000Z'
  }
];

test('filters creators by category correctly', () => {
  const curvy = filterAndSortCreators(mockCreators, { category: 'gorditas' });
  assert.equal(curvy.length, 1);
  assert.equal(curvy[0].id, 'c2');

  const mature = filterAndSortCreators(mockCreators, { category: 'mature' });
  assert.equal(mature.length, 1);
  assert.equal(mature[0].id, 'c3');
});

test('filters creators by tags correctly', () => {
  const stockingFans = filterAndSortCreators(mockCreators, { tag: 'medias' });
  assert.equal(stockingFans.length, 2);
  assert.ok(stockingFans.some(c => c.id === 'c1'));
  assert.ok(stockingFans.some(c => c.id === 'c3'));
});

test('sorts creators by rating descending', () => {
  const sorted = filterAndSortCreators(mockCreators, { sortBy: 'rating' });
  assert.equal(sorted[0].id, 'c3'); // 4.99
  assert.equal(sorted[1].id, 'c1'); // 4.95
  assert.equal(sorted[2].id, 'c2'); // 4.88
});

test('canAccessContent respects lock state and subscription tier', () => {
  const freeUser: UserSubscription = { plan: 'free', coins: 50, unlockedGalleries: [] };
  const diamondUser: UserSubscription = { plan: 'black_diamond', coins: 0, unlockedGalleries: [] };

  // Free item is accessible to anyone
  assert.equal(canAccessContent(freeUser, { isLocked: false, coinPrice: 0, contentId: 'g1' }), true);

  // Locked item is not accessible to free user
  assert.equal(canAccessContent(freeUser, { isLocked: true, coinPrice: 100, contentId: 'g1' }), false);

  // Black Diamond user gets all access
  assert.equal(canAccessContent(diamondUser, { isLocked: true, coinPrice: 100, contentId: 'g1' }), true);
});

test('unlockContent deducts coins and grants access', () => {
  const user: UserSubscription = { plan: 'free', coins: 150, unlockedGalleries: [] };
  const result = unlockContent(user, 'gal_exclusive_1', 100);

  assert.equal(result.success, true);
  assert.equal(result.updatedUser?.coins, 50);
  assert.ok(result.updatedUser?.unlockedGalleries.includes('gal_exclusive_1'));

  // Fails when not enough coins
  const poorUser: UserSubscription = { plan: 'free', coins: 20, unlockedGalleries: [] };
  const failResult = unlockContent(poorUser, 'gal_exclusive_1', 100);
  assert.equal(failResult.success, false);
  assert.ok(failResult.error?.includes('Saldo insuficiente'));
});

test('calculateItemDiscount applies correct membership perks', () => {
  assert.deepEqual(calculateItemDiscount(100, 'free'), { discountPercent: 0, finalPrice: 100 });
  assert.deepEqual(calculateItemDiscount(100, 'gold_vip'), { discountPercent: 10, finalPrice: 90 });
  assert.deepEqual(calculateItemDiscount(100, 'black_diamond'), { discountPercent: 25, finalPrice: 75 });
});

test('getCreatorPaymentMethods returns Yape, Plin, Transferencia, PayPal and Binance', () => {
  const methods = getCreatorPaymentMethods(mockCreators[0]);
  assert.ok(methods.length >= 5);
  
  const types = methods.map(m => m.type);
  assert.ok(types.includes('yape'), 'Includes Yape');
  assert.ok(types.includes('plin'), 'Includes Plin');
  assert.ok(types.includes('transfer'), 'Includes Transferencia Bancaria');
  assert.ok(types.includes('paypal'), 'Includes PayPal');
  assert.ok(types.includes('binance'), 'Includes Binance Pay');

  // Verify custom methods override defaults when provided
  const custom = getCreatorPaymentMethods({
    ...mockCreators[0],
    paymentMethods: [
      {
        id: 'cust_1',
        type: 'yape',
        title: 'Mi Yape Personal',
        identifier: '999888777'
      }
    ]
  });
  assert.equal(custom.length, 1);
  assert.equal(custom[0].identifier, '999888777');
});

test('formatRelativeTime returns readable friendly strings on mobile', () => {
  assert.equal(formatRelativeTime(''), 'Reciente');
  assert.equal(formatRelativeTime('Ayer'), 'Ayer');
  assert.equal(formatRelativeTime('Hace 2 horas'), 'Hace 2 horas');
  assert.equal(formatRelativeTime('12:40 PM'), '12:40 PM');

  // ISO string dates
  const formatted = formatRelativeTime('2024-10-15T18:30:00Z');
  assert.ok(typeof formatted === 'string' && formatted.length > 0);
  assert.ok(!formatted.includes('T18:30'), 'Removes ugly ISO time formatting');
});

test('getFeedFlankPhotos returns 20 VIP and 20 New Seller photos properly ordered', () => {
  const { vipPhotos, newSellerPhotos } = getFeedFlankPhotos(mockCreators, 20);
  assert.equal(vipPhotos.length, 20);
  assert.equal(newSellerPhotos.length, 20);

  // First VIP photo should be DIAMOND tier (c3), followed by SUPER_VIP (c1), then VIP (c2)
  assert.equal(vipPhotos[0].creator.id, 'c3');
  assert.equal(vipPhotos[0].group, 'vip');
  assert.equal(vipPhotos[1].creator.id, 'c1');
  assert.equal(vipPhotos[2].creator.id, 'c2');

  // First New Seller photo should be the most recent joinedDate (c2: 2024-03-15)
  assert.equal(newSellerPhotos[0].creator.id, 'c2');
  assert.equal(newSellerPhotos[0].group, 'new');
  assert.equal(newSellerPhotos[1].creator.id, 'c1');
  assert.equal(newSellerPhotos[2].creator.id, 'c3');

  // Empty creators input returns empty arrays safely
  const empty = getFeedFlankPhotos([], 20);
  assert.deepEqual(empty, { vipPhotos: [], newSellerPhotos: [] });
});


