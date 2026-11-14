import { supabase } from './supabaseClient';
import type {
  AppNotification,
  CategoryType,
  ChatConversation,
  Creator,
  CreatorReview,
  CreatorStory,
  Post,
  PrivateGallery,
  StoreItem,
  UserProfile
} from '../types';

export interface DbProfile {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  role: 'fan' | 'creator' | 'admin';
  plan: 'free' | 'gold_vip' | 'black_diamond';
  seller_tier: 'free' | 'vip' | null;
  photo_limit: number | null;
  coins: number;
  data_saver_mode: boolean;
  interactive_notifications: boolean;
}

export interface DbCreator extends DbProfile {
  cover_url: string;
  badge: 'VIP' | 'SUPER_VIP' | 'DIAMOND';
  is_verified: boolean;
  is_online: boolean;
  featured: boolean;
  categories: string[];
  tags: string[];
  bio: string;
  location: string;
  rating: number;
  review_count: number;
  subscribers_count: number;
  monthly_subscription_price: number;
  joined_at: string;
  social_quote: string | null;
  height: string | null;
  shoe_size: string | null;
  measurements: string | null;
  favorite_perfume: string | null;
}

export interface DbPost {
  id: string;
  creator_id: string;
  content: string;
  image_urls: string[];
  category: string;
  tags: string[];
  likes_count: number;
  coin_price: number;
  is_locked: boolean;
  created_at: string;
}

export interface DbGallery {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  cover_url: string;
  preview_images: string[];
  full_images: string[];
  media_count: number;
  coin_price: number;
  category: string;
  tags: string[];
  likes_count: number;
  created_at: string;
}

export interface DbStoreItem {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: string;
  price_coins: number;
  price_usd: number;
  image_url: string;
  days_worn: number | null;
  vacuum_sealed: boolean;
  certificate: boolean;
  in_stock: number;
  created_at: string;
}

export interface DbStory {
  id: string;
  creator_id: string;
  media_url: string;
  caption: string;
  is_exclusive_vip: boolean;
  created_at: string;
}

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Justo ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Hace ${days} d`;
  const months = Math.floor(days / 30);
  return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
};

export function mapCreator(db: DbCreator, extra?: Partial<Creator>): Creator {
  return {
    id: db.id,
    name: db.name,
    username: db.username,
    avatar: db.avatar_url,
    coverImage: db.cover_url,
    badge: db.badge,
    isVerified: db.is_verified,
    isOnline: db.is_online,
    categories: (db.categories as CategoryType[]) || [],
    tags: db.tags || [],
    bio: db.bio || '',
    location: db.location || '',
    rating: Number(db.rating) || 5,
    reviewCount: db.review_count || 0,
    subscribersCount: db.subscribers_count || 0,
    monthlySubscriptionPrice: Number(db.monthly_subscription_price) || 0,
    postCount: 0,
    privateGalleriesCount: 0,
    featured: db.featured,
    joinedDate: db.joined_at,
    socialQuote: db.social_quote || undefined,
    height: db.height || undefined,
    shoeSize: db.shoe_size || undefined,
    measurements: db.measurements || undefined,
    favoritePerfume: db.favorite_perfume || undefined,
    ...extra
  };
}

export function mapProfileToUser(db: DbProfile): UserProfile {
  return {
    id: db.id,
    name: db.name,
    username: db.username,
    avatar: db.avatar_url,
    role: db.role,
    plan: db.plan,
    coins: db.coins,
    unlockedGalleries: [],
    savedPosts: [],
    followingCreatorIds: [],
    favoriteCreatorIds: [],
    dataSaverMode: db.data_saver_mode,
    interactiveNotifications: db.interactive_notifications,
    sellerTier: db.seller_tier || undefined,
    photoLimit: db.photo_limit
  };
}

export function mapPost(db: DbPost, creator: Creator, liked: boolean): Post {
  return {
    id: db.id,
    creatorId: db.creator_id,
    creatorName: creator.name,
    creatorUsername: creator.username,
    creatorAvatar: creator.avatar,
    creatorBadge: creator.badge,
    isVerified: creator.isVerified,
    content: db.content,
    imageUrls: db.image_urls,
    isLocked: db.is_locked,
    coinPrice: Number(db.coin_price),
    category: (db.category as CategoryType) || 'lingerie',
    tags: db.tags,
    likesCount: db.likes_count,
    isLikedByUser: liked,
    comments: [],
    publishedAt: timeAgo(db.created_at)
  };
}

export function mapGallery(db: DbGallery, creator: Creator): PrivateGallery {
  return {
    id: db.id,
    creatorId: db.creator_id,
    creatorName: creator.name,
    creatorAvatar: creator.avatar,
    creatorBadge: creator.badge,
    title: db.title,
    description: db.description,
    coverImage: db.cover_url,
    previewImages: db.preview_images,
    fullImages: db.full_images,
    mediaCount: db.media_count,
    coinPrice: Number(db.coin_price),
    category: (db.category as CategoryType) || 'lingerie',
    tags: db.tags,
    isLocked: true,
    likesCount: db.likes_count
  };
}

export function mapStoreItem(db: DbStoreItem, creator: Creator): StoreItem {
  return {
    id: db.id,
    creatorId: db.creator_id,
    creatorName: creator.name,
    title: db.title,
    description: db.description,
    category: db.category as StoreItem['category'],
    priceCoins: Number(db.price_coins),
    priceUsd: Number(db.price_usd),
    image: db.image_url,
    daysWorn: db.days_worn || undefined,
    vacuumSealed: db.vacuum_sealed,
    certificateOfAuthenticity: db.certificate,
    inStock: db.in_stock
  };
}

export function mapStory(db: DbStory, creator: Creator): CreatorStory {
  return {
    id: db.id,
    creatorId: db.creator_id,
    creatorName: creator.name,
    creatorUsername: creator.username,
    creatorAvatar: creator.avatar,
    creatorBadge: creator.badge,
    mediaUrl: db.media_url,
    caption: db.caption,
    timestamp: timeAgo(db.created_at),
    createdAt: new Date(db.created_at).getTime(),
    viewed: false,
    isExclusiveVip: db.is_exclusive_vip
  };
}

export function mapNotification(db: {
  id: string; type: string; creator_id: string | null; title: string; message: string;
  media_url: string | null; target_id: string | null; target_tab: string | null;
  is_read: boolean; created_at: string;
}, creator?: Creator): AppNotification {
  return {
    id: db.id,
    type: (db.type as AppNotification['type']) || 'post',
    creatorId: db.creator_id || '',
    creatorName: creator?.name || 'Pantilibre',
    creatorUsername: creator?.username || 'pantilibre',
    creatorAvatar: creator?.avatar || '/assets/images/LOGO_PANTILIBRE_1.png',
    creatorBadge: creator?.badge || 'VIP',
    title: db.title,
    message: db.message,
    mediaPreviewUrl: db.media_url || undefined,
    timeAgo: timeAgo(db.created_at),
    createdAt: new Date(db.created_at).getTime(),
    read: db.is_read,
    targetId: db.target_id || undefined,
    targetTab: (db.target_tab as AppNotification['targetTab']) || 'feed'
  };
}

export async function fetchCreators(): Promise<Creator[]> {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .order('featured', { ascending: false })
    .order('subscribers_count', { ascending: false });
  if (error) throw error;
  return (data as unknown as DbCreator[]).map(row => mapCreator(row));
}

export async function fetchFeed(): Promise<{ posts: Post[]; creators: Creator[] }> {
  const [{ data: postsData, error: postsError }, { data: creatorsData, error: creatorsError }] = await Promise.all([
    supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(50),
    supabase.from('creators').select('*')
  ]);
  if (postsError) throw postsError;
  if (creatorsError) throw creatorsError;

  const creators = (creatorsData as unknown as DbCreator[]).map(c => mapCreator(c));
  const creatorMap = new Map(creators.map(c => [c.id, c]));

  let likedIds = new Set<string>();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id);
    likedIds = new Set((likes || []).map(l => l.post_id));
  }

  const posts = (postsData as unknown as DbPost[])
    .filter(p => creatorMap.has(p.creator_id))
    .map(p => mapPost(p, creatorMap.get(p.creator_id)!, likedIds.has(p.id)));
  return { posts, creators };
}

export async function fetchGalleries(): Promise<PrivateGallery[]> {
  const [{ data, error }, { data: unlocked, error: unlockError }] = await Promise.all([
    supabase.from('galleries').select('*').order('created_at', { ascending: false }),
    supabase.from('gallery_unlocks').select('gallery_id')
  ]);
  if (error) throw error;
  const creatorsRes = await supabase.from('creators').select('*');
  if (creatorsRes.error) throw creatorsRes.error;
  const creatorMap = new Map((creatorsRes.data as unknown as DbCreator[]).map(c => [c.id, mapCreator(c)]));
  const unlockedSet = new Set((unlocked || []).map(u => u.gallery_id));
  return (data as unknown as DbGallery[])
    .filter(g => creatorMap.has(g.creator_id))
    .map(g => {
      const gallery = mapGallery(g, creatorMap.get(g.creator_id)!);
      gallery.isLocked = !unlockedSet.has(g.id);
      return gallery;
    });
}

export async function fetchStoreItems(): Promise<StoreItem[]> {
  const [{ data, error }, creatorsRes] = await Promise.all([
    supabase.from('store_items').select('*').order('created_at', { ascending: false }),
    supabase.from('creators').select('*')
  ]);
  if (error) throw error;
  const creatorMap = new Map((creatorsRes.data as unknown as DbCreator[]).map(c => [c.id, mapCreator(c)]));
  return (data as unknown as DbStoreItem[])
    .filter(i => creatorMap.has(i.creator_id))
    .map(i => mapStoreItem(i, creatorMap.get(i.creator_id)!));
}

export interface DbCreatorReview {
  id: string;
  creator_id: string;
  buyer_name: string;
  buyer_avatar: string;
  is_vip_buyer: boolean;
  rating: number;
  item_purchased: string;
  comment: string;
  verified_purchase: boolean;
  likes_count: number;
  created_at: string;
}

export function mapCreatorReview(db: DbCreatorReview): CreatorReview {
  return {
    id: db.id,
    creatorId: db.creator_id,
    buyerName: db.buyer_name,
    buyerAvatar: db.buyer_avatar,
    isVipBuyer: db.is_vip_buyer,
    rating: Number(db.rating) || 5,
    date: timeAgo(db.created_at),
    itemPurchased: db.item_purchased,
    comment: db.comment,
    verifiedPurchase: db.verified_purchase,
    likesCount: db.likes_count
  };
}

export async function fetchCreatorReviews(creatorId: string): Promise<CreatorReview[]> {
  const { data, error } = await supabase
    .from('creator_reviews')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data as unknown as DbCreatorReview[]).map(mapCreatorReview);
}

export async function fetchStories(): Promise<CreatorStory[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [{ data, error }, creatorsRes] = await Promise.all([
    supabase.from('stories').select('*').gte('created_at', since).order('created_at', { ascending: false }),
    supabase.from('creators').select('*')
  ]);
  if (error) throw error;
  const creatorMap = new Map((creatorsRes.data as unknown as DbCreator[]).map(c => [c.id, mapCreator(c)]));
  return (data as unknown as DbStory[])
    .filter(s => creatorMap.has(s.creator_id))
    .map(s => mapStory(s, creatorMap.get(s.creator_id)!));
}

export async function fetchMyNotifications(): Promise<AppNotification[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  const creatorIds = [...new Set((data as unknown as { creator_id: string | null }[]).map(n => n.creator_id).filter(Boolean))] as string[];
  const creatorsRes = creatorIds.length
    ? await supabase.from('creators').select('*').in('id', creatorIds)
    : { data: [], error: null };
  if (creatorsRes.error) throw creatorsRes.error;
  const creatorMap = new Map(((creatorsRes.data || []) as unknown as DbCreator[]).map(c => [c.id, mapCreator(c)]));
  return (data as unknown as Parameters<typeof mapNotification>[0][]).map(n =>
    mapNotification(n, n.creator_id ? creatorMap.get(n.creator_id) : undefined)
  );
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Perfil no encontrado');
  const profile = data as unknown as DbProfile;
  const mapped = mapProfileToUser(profile);
  const [subsRes, unlocksRes, likesRes] = await Promise.all([
    supabase.from('subscriptions').select('creator_id').eq('user_id', user.id),
    supabase.from('gallery_unlocks').select('gallery_id').eq('user_id', user.id),
    supabase.from('post_likes').select('post_id').eq('user_id', user.id)
  ]);
  mapped.followingCreatorIds = (subsRes.data || []).map(s => s.creator_id);
  mapped.favoriteCreatorIds = mapped.followingCreatorIds;
  mapped.unlockedGalleries = (unlocksRes.data || []).map(u => u.gallery_id);
  mapped.savedPosts = (likesRes.data || []).map(l => l.post_id);
  return mapped;
}

export async function fetchConversations(creators: Creator[]): Promise<ChatConversation[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: convs, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`fan_id.eq.${user.id},creator_id.eq.${user.id}`);
  if (error) throw error;
  if (!convs || convs.length === 0) return [];

  const convIds = convs.map(c => c.id);
  const { data: msgs, error: msgsError } = await supabase
    .from('messages')
    .select('*')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: true });
  if (msgsError) throw msgsError;

  return convs.map((conv: { id: string; fan_id: string; creator_id: string; created_at: string }) => {
    const creator = creators.find(c => c.id === conv.creator_id);
    const convMsgs = (msgs || []).filter(m => m.conversation_id === conv.id);
    const last = convMsgs[convMsgs.length - 1];
    return {
      id: conv.id,
      creatorId: conv.creator_id,
      creatorName: creator?.name || 'Vendedora',
      creatorUsername: creator?.username || '',
      creatorAvatar: creator?.avatar || '',
      creatorBadge: creator?.badge || 'VIP',
      isOnline: creator?.isOnline || false,
      lastMessage: last ? (last.is_tip ? `Propina de ${last.tip_amount} Coins` : last.text) : 'Conversación iniciada',
      lastMessageTime: last ? timeAgo(last.created_at) : timeAgo(conv.created_at),
      unreadCount: 0,
      messages: convMsgs.map(m => ({
        id: m.id,
        sender: m.sender_id === user.id ? ('user' as const) : ('creator' as const),
        text: m.text,
        timestamp: timeAgo(m.created_at),
        isPhoto: Boolean(m.photo_url),
        photoUrl: m.photo_url || undefined,
        isPhotoLocked: m.is_photo_locked || undefined,
        photoPrice: m.photo_price ? Number(m.photo_price) : undefined,
        isAudio: m.is_audio || undefined,
        audioDuration: m.audio_duration || undefined,
        isTip: m.is_tip || undefined,
        tipAmount: m.tip_amount ? Number(m.tip_amount) : undefined
      }))
    };
  });
}

export async function getOrCreateConversation(creatorId: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Inicia sesión para chatear');
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('fan_id', user.id)
    .eq('creator_id', creatorId)
    .maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await supabase
    .from('conversations')
    .insert({ fan_id: user.id, creator_id: creatorId })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function sendMessage(conversationId: string, senderId: string, text: string): Promise<void> {
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    text
  });
  if (error) throw error;
}

export interface AdminSellerRow {
  profile: DbProfile;
  creator: DbCreator | null;
}

export async function fetchAdminSellers(): Promise<AdminSellerRow[]> {
  const { data, error } = await supabase
    .from('creators')
    .select('*, profiles!inner(id, username, name, avatar_url, role, plan, seller_tier, photo_limit, coins)');
  if (error) throw error;
  return (data as unknown as Array<DbCreator & { profiles: DbProfile }>).map(row => ({
    creator: row,
    profile: (row as unknown as { profiles: DbProfile }).profiles
  }));
}

export async function updateSellerControl(
  profileId: string,
  changes: { sellerTier?: 'free' | 'vip' | null; photoLimit?: number | null; badge?: 'VIP' | 'SUPER_VIP' | 'DIAMOND'; isVerified?: boolean; featured?: boolean }
): Promise<void> {
  if (changes.sellerTier !== undefined || changes.photoLimit !== undefined) {
    const update: Record<string, unknown> = {};
    if (changes.sellerTier !== undefined) update.seller_tier = changes.sellerTier;
    if (changes.photoLimit !== undefined) update.photo_limit = changes.photoLimit;
    const { error } = await supabase.from('profiles').update(update).eq('id', profileId);
    if (error) throw error;
  }
  const creatorChanges: Record<string, unknown> = {};
  if (changes.badge !== undefined) creatorChanges.badge = changes.badge;
  if (changes.isVerified !== undefined) creatorChanges.is_verified = changes.isVerified;
  if (changes.featured !== undefined) creatorChanges.featured = changes.featured;
  if (Object.keys(creatorChanges).length > 0) {
    const { error } = await supabase.from('creators').update(creatorChanges).eq('id', profileId);
    if (error) throw error;
  }
}

export async function fetchAllProfiles(): Promise<DbProfile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as DbProfile[];
}
