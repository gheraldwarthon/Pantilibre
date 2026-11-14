export type CategoryType =
  | 'gorditas'
  | 'teens'
  | 'mature'
  | 'lingerie'
  | 'feet'
  | 'latex'
  | 'used_clothes'
  | 'cosplay';

export type PaymentMethodType =
  | 'yape'
  | 'plin'
  | 'transfer'
  | 'paypal'
  | 'binance'
  | 'card'
  | 'bizum'
  | 'panticoins';

export interface CreatorPaymentMethod {
  id: string;
  type: PaymentMethodType;
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

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  badge: 'VIP' | 'SUPER_VIP' | 'DIAMOND';
  isVerified: boolean;
  isOnline: boolean;
  categories: CategoryType[];
  tags: string[];
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  subscribersCount: number;
  monthlySubscriptionPrice: number;
  postCount: number;
  privateGalleriesCount: number;
  featured: boolean;
  joinedDate: string;
  socialQuote?: string;
  height?: string;
  shoeSize?: string;
  measurements?: string;
  favoritePerfume?: string;
  ordersShippedCount?: number;
  responseTimeMinutes?: number;
  discreetShippingScore?: number;
  paymentMethods?: CreatorPaymentMethod[];
}

export interface CreatorReview {
  id: string;
  creatorId: string;
  buyerName: string;
  buyerAvatar: string;
  isVipBuyer: boolean;
  rating: number;
  date: string;
  itemPurchased: string;
  comment: string;
  verifiedPurchase: boolean;
  likesCount?: number;
}

export interface PrivateGallery {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorBadge: string;
  title: string;
  description: string;
  coverImage: string;
  previewImages: string[];
  fullImages: string[];
  mediaCount: number;
  videoDuration?: string;
  coinPrice: number;
  requiredPlan?: 'gold_vip' | 'black_diamond';
  category: CategoryType;
  tags: string[];
  isLocked: boolean;
  likesCount: number;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  isVip?: boolean;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorBadge: 'VIP' | 'SUPER_VIP' | 'DIAMOND';
  isVerified: boolean;
  content: string;
  imageUrls: string[];
  isLocked: boolean;
  coinPrice: number;
  category: CategoryType;
  tags: string[];
  likesCount: number;
  isLikedByUser?: boolean;
  comments: Comment[];
  publishedAt: string;
  hasAudioNote?: boolean;
}

export interface StoreItem {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  category: 'used_clothes' | 'custom_media' | 'perfumed_souvenir';
  priceCoins: number;
  priceUsd: number;
  image: string;
  daysWorn?: number;
  vacuumSealed: boolean;
  certificateOfAuthenticity: boolean;
  inStock: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'creator';
  text: string;
  timestamp: string;
  isPhoto?: boolean;
  photoUrl?: string;
  isPhotoLocked?: boolean;
  photoPrice?: number;
  isAudio?: boolean;
  audioDuration?: string;
  isTip?: boolean;
  tipAmount?: number;
}

export interface ChatConversation {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorBadge: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'fan' | 'creator';
  plan: 'free' | 'gold_vip' | 'black_diamond';
  coins: number;
  unlockedGalleries: string[];
  savedPosts: string[];
  followingCreatorIds: string[];
  favoriteCreatorIds?: string[];
  dataSaverMode?: boolean;
  interactiveNotifications?: boolean;
}

export interface CreatorStory {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorBadge: 'VIP' | 'SUPER_VIP' | 'DIAMOND';
  mediaUrl: string;
  caption: string;
  timestamp: string;
  createdAt: number;
  viewed: boolean;
  isExclusiveVip?: boolean;
}

export interface AppNotification {
  id: string;
  type: 'story' | 'post' | 'gallery' | 'store_item' | 'tip_thanks';
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorBadge: 'VIP' | 'SUPER_VIP' | 'DIAMOND';
  title: string;
  message: string;
  mediaPreviewUrl?: string;
  timeAgo: string;
  createdAt: number;
  read: boolean;
  targetId?: string;
  targetTab?: 'profile' | 'feed' | 'chat';
}

