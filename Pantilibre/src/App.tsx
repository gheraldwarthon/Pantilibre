import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, CssBaseline, Snackbar, Alert, Box, CircularProgress } from '@mui/material';
import { muiTheme } from './theme/muiTheme';

import { Navbar } from './components/Navbar';
import { VIPBannerCarousel } from './components/VIPBannerCarousel';
import { PrivateGalleriesSection } from './components/PrivateGalleriesSection';
import { FeedSection } from './components/FeedSection';
import { CategoriesView } from './components/CategoriesView';
import { CreatorProfileView } from './components/CreatorProfileView';
import { LiveChatView } from './components/LiveChatView';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { AuthModal } from './components/AuthModal';
import { LandingPageView } from './components/LandingPageView';
import { StoryViewerModal } from './components/StoryViewerModal';
import { NotificationsCenter } from './components/NotificationsCenter';
import { RealTimeNotificationToast } from './components/RealTimeNotificationToast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminPanel } from './components/AdminPanel';
import { PostComposerModal } from './components/PostComposerModal';

import {
  fetchCreators,
  fetchFeed,
  fetchGalleries,
  fetchStoreItems,
  fetchStories,
  fetchMyNotifications,
  fetchConversations,
  getOrCreateConversation,
  sendMessage as sendDbMessage
} from './services/dataService';
import { restoreSession, signOut } from './services/authService';
import { supabase } from './services/supabaseClient';

import type {
  Creator,
  Post,
  PrivateGallery,
  StoreItem,
  ChatConversation,
  UserProfile,
  CreatorStory,
  AppNotification
} from './types';

type Tab = 'landing' | 'feed' | 'categories' | 'vip' | 'chat' | 'profile' | 'admin';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('landing');
  const [viewedCreator, setViewedCreator] = useState<Creator | null>(null);
  const [previousTab, setPreviousTab] = useState<Tab>('landing');

  const [bootLoading, setBootLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [galleries, setGalleries] = useState<PrivateGallery[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [stories, setStories] = useState<CreatorStory[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Modals & overlays
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'account'>('login');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<HTMLElement | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' | 'error' }>({
    open: false, message: '', severity: 'success'
  });
  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') =>
    setSnackbar({ open: true, message, severity });

  // ============ BOOT: restore session + load catalog ============
  const loadCatalog = useCallback(async () => {
    try {
      const [creatorsData, feedData, galleriesData, storeData, storiesData] = await Promise.all([
        fetchCreators(),
        fetchFeed(),
        fetchGalleries(),
        fetchStoreItems(),
        fetchStories()
      ]);
      setCreators(creatorsData);
      setPosts(feedData.posts);
      setGalleries(galleriesData);
      setStoreItems(storeData);
      setStories(storiesData);
      if (creatorsData.length > 0 && !viewedCreator) setViewedCreator(creatorsData[0]);
    } catch (err) {
      showToast(err instanceof Error ? `Error cargando contenido: ${err.message}` : 'Error cargando contenido', 'error');
    }
  }, [viewedCreator]);

  const loadUserData = useCallback(async (u: UserProfile) => {
    try {
      const [notifs, convs] = await Promise.all([
        fetchMyNotifications(),
        fetchConversations(creators.length ? creators : await fetchCreators())
      ]);
      setNotifications(notifs);
      setConversations(convs);
      if (convs.length > 0) setActiveChatId(prev => prev || convs[0].id);
    } catch (err) {
      showToast(err instanceof Error ? `Error cargando tus datos: ${err.message}` : 'Error cargando tus datos', 'error');
    }
  }, [creators]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const restored = await restoreSession();
        if (mounted) setUser(restored);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setBootLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadUserData(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Keep profile fresh on auth changes
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!session?.user) {
          setUser(null);
          setNotifications([]);
          setConversations([]);
        }
      })();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogin = (u: UserProfile) => {
    setUser(u);
    showToast(u.role === 'admin' ? 'Sesión de administrador iniciada' : `¡Bienvenid@, ${u.name}!`);
    if (u.role === 'admin') setCurrentTab('admin');
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setNotifications([]);
    setConversations([]);
    setCurrentTab('landing');
    showToast('Sesión cerrada', 'info');
  };

  const requireAuth = (action: () => void) => {
    if (!user) {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast('Inicia sesión para continuar', 'info');
      return;
    }
    action();
  };

  const handleOpenAuth = (tab: 'login' | 'register' | 'account' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // ============ Stories ============
  const handleSelectStory = (storyId: string) => {
    setActiveStoryId(storyId);
    setIsStoryModalOpen(true);
  };

  // ============ Navigation ============
  const handleOpenProfilePage = (creator: Creator) => {
    if (currentTab !== 'profile') setPreviousTab(currentTab);
    setViewedCreator(creator);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProfile = () => {
    setCurrentTab(previousTab === 'profile' ? 'feed' : previousTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============ Notifications ============
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notificaciones marcadas como leídas', 'info');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSelectNotificationTarget = (notification: AppNotification) => {
    const targetCreator = creators.find(c => c.id === notification.creatorId);
    if (targetCreator) handleOpenProfilePage(targetCreator);
  };

  // ============ Interactions ============
  const handleToggleFavorite = (creator: Creator) => {
    if (!user) return requireAuth(() => undefined);
    const favoriteIds = user.favoriteCreatorIds || [];
    const isFav = favoriteIds.includes(creator.id);
    const updatedFavorites = isFav ? favoriteIds.filter(id => id !== creator.id) : [...favoriteIds, creator.id];
    setUser(prev => (prev ? { ...prev, favoriteCreatorIds: updatedFavorites, followingCreatorIds: updatedFavorites } : prev));
    showToast(
      isFav ? `Avisos desactivados para ${creator.name}` : `¡Avisos en vivo activados para ${creator.name}!`,
      isFav ? 'info' : 'success'
    );
  };

  const handleLikePost = (postId: string) => {
    if (!user) return requireAuth(() => undefined);
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByUser;
          return { ...p, isLikedByUser: isLiked, likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1 };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!user) return requireAuth(() => undefined);
    setPosts(prev =>
      prev.map(p => (p.id === postId
        ? { ...p, comments: [...p.comments, { id: `cm_${Date.now()}`, userName: user.name, userAvatar: user.avatar, text, createdAt: 'Justo ahora', isVip: user.plan !== 'free' }] }
        : p))
    );
    showToast('Comentario añadido.', 'info');
  };

  const handleUnlockGallery = async (gallery: PrivateGallery) => {
    if (!user) return requireAuth(() => undefined);
    if (user.coins < gallery.coinPrice) {
      showToast('Saldo insuficiente de PantiCoins.', 'warning');
      setIsPlansModalOpen(true);
      return;
    }
    try {
      const { error: unlockError } = await supabase.from('gallery_unlocks').insert({
        user_id: user.id,
        gallery_id: gallery.id
      });
      if (unlockError) throw unlockError;
      setUser(prev => (prev ? {
        ...prev,
        coins: prev.coins - gallery.coinPrice,
        unlockedGalleries: [...prev.unlockedGalleries, gallery.id]
      } : prev));
      setGalleries(prev => prev.map(g => (g.id === gallery.id ? { ...g, isLocked: false } : g)));
      showToast(`¡Galería "${gallery.title}" desbloqueada con éxito!`);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        setGalleries(prev => prev.map(g => (g.id === gallery.id ? { ...g, isLocked: false } : g)));
      } else {
        showToast(err instanceof Error ? 'No se pudo desbloquear la galería' : 'Error', 'error');
      }
    }
  };

  const handleBuyStoreItem = (item: StoreItem) => {
    if (!user) return requireAuth(() => undefined);
    if (user.coins < item.priceCoins) {
      showToast('Saldo insuficiente para adquirir esta prenda.', 'warning');
      setIsPlansModalOpen(true);
      return;
    }
    setUser(prev => (prev ? { ...prev, coins: prev.coins - item.priceCoins } : prev));
    setStoreItems(prev => prev.map(i => (i.id === item.id ? { ...i, inStock: Math.max(0, i.inStock - 1) } : i)));
    showToast('¡Prenda adquirida! Se preparará el empaque al vacío con máxima discreción.');
  };

  const handleSubscribeCreator = async (creator: Creator) => {
    if (!user) return requireAuth(() => undefined);
    const isFollowing = user.followingCreatorIds.includes(creator.id);
    try {
      if (isFollowing) {
        await supabase.from('subscriptions').delete()
          .eq('user_id', user.id).eq('creator_id', creator.id);
        setUser(prev => (prev ? {
          ...prev,
          followingCreatorIds: prev.followingCreatorIds.filter(id => id !== creator.id),
          favoriteCreatorIds: (prev.favoriteCreatorIds || []).filter(id => id !== creator.id)
        } : prev));
        showToast(`Suscripción cancelada a ${creator.name}`, 'info');
      } else {
        await supabase.from('subscriptions').insert({ user_id: user.id, creator_id: creator.id });
        setUser(prev => (prev ? {
          ...prev,
          followingCreatorIds: [...prev.followingCreatorIds, creator.id],
          favoriteCreatorIds: [...(prev.favoriteCreatorIds || []), creator.id]
        } : prev));
        showToast(`¡Te has suscrito al club VIP de ${creator.name}!`);
      }
    } catch (err) {
      showToast(err instanceof Error ? 'No se pudo actualizar la suscripción' : 'Error', 'error');
    }
  };

  // ============ Chat ============
  const handleOpenChatWithCreator = async (creator: Creator) => {
    if (!user) {
      requireAuth(() => undefined);
      return;
    }
    try {
      const convId = await getOrCreateConversation(creator.id);
      const existing = conversations.find(c => c.id === convId);
      if (!existing) {
        const newConv: ChatConversation = {
          id: convId,
          creatorId: creator.id,
          creatorName: creator.name,
          creatorUsername: creator.username,
          creatorAvatar: creator.avatar,
          creatorBadge: creator.badge,
          isOnline: creator.isOnline,
          lastMessage: 'Conversación iniciada',
          lastMessageTime: 'Ahora',
          unreadCount: 0,
          messages: []
        };
        setConversations(prev => [newConv, ...prev]);
      }
      setActiveChatId(convId);
      setCurrentTab('chat');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No se pudo abrir el chat', 'error');
    }
  };

  const handleSendMessage = async (chatId: string, text: string) => {
    if (!user) return;
    try {
      await sendDbMessage(chatId, user.id, text);
      setConversations(prev =>
        prev.map(c => (c.id === chatId
          ? { ...c, lastMessage: text, lastMessageTime: 'Ahora', messages: [...c.messages, { id: `m_${Date.now()}`, sender: 'user' as const, text, timestamp: 'Ahora' }] }
          : c))
      );
    } catch (err) {
      showToast(err instanceof Error ? 'No se pudo enviar el mensaje' : 'Error', 'error');
    }
  };

  const handleSendTip = (creatorId: string, creatorName: string, amount: number, _message: string) => {
    void _message;
    if (!user) return requireAuth(() => undefined);
    if (user.coins < amount) {
      showToast('Saldo insuficiente de PantiCoins.', 'warning');
      setIsPlansModalOpen(true);
      return;
    }
    setUser(prev => (prev ? { ...prev, coins: prev.coins - amount } : prev));
    showToast(`¡Propina de ${amount} PantiCoins enviada a ${creatorName}!`);
  };

  const handleSendTipInChat = (chatId: string, amount: number) => {
    if (!user) return requireAuth(() => undefined);
    if (user.coins < amount) {
      showToast('Saldo insuficiente', 'warning');
      setIsPlansModalOpen(true);
      return;
    }
    setUser(prev => (prev ? { ...prev, coins: prev.coins - amount } : prev));
    const tipText = `Propina de ${amount} Coins enviada`;
    setConversations(prev =>
      prev.map(c => (c.id === chatId
        ? { ...c, lastMessage: tipText, lastMessageTime: 'Ahora', messages: [...c.messages, { id: `m_tip_${Date.now()}`, sender: 'user' as const, text: tipText, timestamp: 'Ahora', isTip: true, tipAmount: amount }] }
        : c))
    );
    showToast(tipText);
  };

  const handleUnlockChatPhoto = (chatId: string, messageId: string, price: number) => {
    if (!user) return requireAuth(() => undefined);
    if (user.coins < price) {
      showToast(`Necesitas ${price} Coins para desbloquear esta foto privada.`, 'warning');
      setIsPlansModalOpen(true);
      return;
    }
    setUser(prev => (prev ? { ...prev, coins: prev.coins - price } : prev));
    setConversations(prev =>
      prev.map(c => (c.id === chatId ? { ...c, messages: c.messages.map(m => (m.id === messageId ? { ...m, isPhotoLocked: false } : m)) } : c))
    );
    showToast('¡Foto privada desbloqueada en tu chat!');
  };

  // ============ Data saver ============
  const handleToggleDataSaver = () => {
    setUser(prev => {
      if (!prev) return prev;
      const nextMode = !prev.dataSaverMode;
      showToast(nextMode ? 'Modo Ahorro activado: imágenes comprimidas.' : 'Modo Alta Resolución restablecido.', 'info');
      return { ...prev, dataSaverMode: nextMode };
    });
  };

  const handleToggleInteractiveNotifications = () => {
    setUser(prev => {
      if (!prev) return prev;
      const nextMode = !Boolean(prev.interactiveNotifications);
      showToast(nextMode ? 'Avisos flotantes activados.' : 'Avisos flotantes desactivados.', 'info');
      return { ...prev, interactiveNotifications: nextMode };
    });
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // ============ Boot splash ============
  if (bootLoading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#FFF8F9', gap: 3 }}>
          <img src="/assets/images/LOGO_PANTILIBRE_1.png" alt="Pantilibre" style={{ height: 72, objectFit: 'contain' }} />
          <CircularProgress size={28} sx={{ color: '#E05D84' }} />
        </Box>
      </ThemeProvider>
    );
  }

  const activeUser: UserProfile = user ?? {
    id: '', name: 'Invitad@', username: 'invitado', avatar: '/assets/images/LOGO_PANTILIBRE_1.png',
    role: 'fan', plan: 'free', coins: 0, unlockedGalleries: [], savedPosts: [],
    followingCreatorIds: [], favoriteCreatorIds: [], dataSaverMode: false, interactiveNotifications: false
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#FFF8F9', color: '#2D1822', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          currentTab={currentTab as never}
          setCurrentTab={t => setCurrentTab(t as Tab)}
          user={activeUser}
          unreadCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={e => setNotificationsAnchorEl(e.currentTarget)}
          onOpenPlans={() => setIsPlansModalOpen(true)}
          onOpenAuth={() => handleOpenAuth(user ? 'account' : 'login')}
          onOpenProfile={() => handleOpenAuth(user ? 'account' : 'login')}
          onToggleDataSaver={handleToggleDataSaver}
          onOpenAdmin={user?.role === 'admin' ? () => setCurrentTab('admin') : undefined}
          onOpenComposer={user?.sellerTier ? () => setIsComposerOpen(true) : undefined}
          onLogout={() => void handleLogout()}
        />

        <Box component="main" sx={{ flex: 1, pb: { xs: '72px', md: 0 } }}>
          {currentTab === 'admin' && user?.role === 'admin' && (
            <AdminPanel onBack={() => setCurrentTab('landing')} />
          )}

          {currentTab === 'landing' && (
            <LandingPageView
              creators={creators}
              galleries={galleries}
              user={activeUser}
              stories={stories}
              onSelectStory={handleSelectStory}
              onExploreFeed={() => setCurrentTab('feed')}
              onExploreCategories={() => setCurrentTab('categories')}
              onExploreVIP={() => setCurrentTab('vip')}
              onSelectCreator={handleOpenProfilePage}
              onOpenChatWithCreator={c => void handleOpenChatWithCreator(c)}
              onUnlockGallery={handleUnlockGallery}
              onOpenPlans={() => setIsPlansModalOpen(true)}
              onOpenAuth={mode => { setAuthModalTab(mode === 'register' ? 'register' : 'login'); setIsAuthModalOpen(true); }}
            />
          )}

          {currentTab === 'feed' && (
            <FeedSection
              posts={posts}
              user={activeUser}
              creators={creators}
              stories={stories}
              onSelectStory={handleSelectStory}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onSendTip={handleSendTip}
              onSelectCreator={handleOpenProfilePage}
              onOpenPlans={() => setIsPlansModalOpen(true)}
              onOpenChatWithCreator={c => void handleOpenChatWithCreator(c)}
              onToggleDataSaver={handleToggleDataSaver}
              onToggleFavorite={handleToggleFavorite}
              onToggleInteractiveNotifications={handleToggleInteractiveNotifications}
            />
          )}

          {currentTab === 'vip' && (
            <Box>
              <VIPBannerCarousel
                creators={creators}
                onSelectCreator={handleOpenProfilePage}
                onOpenChatWithCreator={c => void handleOpenChatWithCreator(c)}
                onViewAllVIP={() => setCurrentTab('categories')}
              />
              <PrivateGalleriesSection
                galleries={galleries}
                user={activeUser}
                onUnlockGallery={handleUnlockGallery}
                onOpenPlans={() => setIsPlansModalOpen(true)}
              />
              <FeedSection
                posts={posts}
                user={activeUser}
                creators={creators}
                stories={stories}
                onSelectStory={handleSelectStory}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onSendTip={handleSendTip}
                onSelectCreator={handleOpenProfilePage}
                onOpenPlans={() => setIsPlansModalOpen(true)}
                onOpenChatWithCreator={c => void handleOpenChatWithCreator(c)}
                onToggleDataSaver={handleToggleDataSaver}
                onToggleFavorite={handleToggleFavorite}
                onToggleInteractiveNotifications={handleToggleInteractiveNotifications}
              />
            </Box>
          )}

          {currentTab === 'categories' && (
            <CategoriesView
              creators={creators}
              user={activeUser}
              onSelectCreator={handleOpenProfilePage}
              onOpenChatWithCreator={c => void handleOpenChatWithCreator(c)}
            />
          )}

          {currentTab === 'chat' && (
            <LiveChatView
              conversations={conversations}
              activeChatId={activeChatId}
              onSelectChat={id => setActiveChatId(id)}
              user={activeUser}
              onSendMessage={(id, text) => void handleSendMessage(id, text)}
              onSendTipInChat={handleSendTipInChat}
              onUnlockChatPhoto={handleUnlockChatPhoto}
              onOpenPlans={() => setIsPlansModalOpen(true)}
            />
          )}

          {currentTab === 'profile' && viewedCreator && (
            <CreatorProfileView
              creator={viewedCreator}
              user={activeUser}
              posts={posts}
              galleries={galleries}
              storeItems={storeItems}
              allCreators={creators}
              stories={stories}
              onSelectStory={handleSelectStory}
              onToggleFavorite={handleToggleFavorite}
              onTriggerNotificationForCreator={() => undefined}
              onBack={handleBackFromProfile}
              onSelectCreator={handleOpenProfilePage}
              onOpenChat={c => void handleOpenChatWithCreator(c)}
              onSendTip={handleSendTip}
              onUnlockGallery={handleUnlockGallery}
              onBuyStoreItem={handleBuyStoreItem}
              onSubscribeCreator={handleSubscribeCreator}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onOpenPlans={() => setIsPlansModalOpen(true)}
              showToast={showToast}
            />
          )}
        </Box>

        <MobileBottomNav
          currentTab={currentTab as never}
          setCurrentTab={t => setCurrentTab(t as Tab)}
          unreadChatCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenPlans={() => setIsPlansModalOpen(true)}
        />

        <NotificationsCenter
          anchorEl={notificationsAnchorEl}
          isOpen={Boolean(notificationsAnchorEl)}
          onClose={() => setNotificationsAnchorEl(null)}
          notifications={notifications}
          stories={stories}
          unreadCount={unreadNotificationsCount}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          onMarkAsRead={handleMarkNotificationRead}
          onDeleteNotification={handleDeleteNotification}
          onSelectStory={handleSelectStory}
          onSelectNotificationTarget={handleSelectNotificationTarget}
          onTriggerSimulatedNotification={() => undefined}
          interactiveNotifications={Boolean(activeUser.interactiveNotifications)}
          onToggleInteractiveNotifications={handleToggleInteractiveNotifications}
        />

        <StoryViewerModal
          stories={stories}
          initialStoryId={activeStoryId || undefined}
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
          onMarkViewed={storyId => setStories(prev => prev.map(s => (s.id === storyId ? { ...s, viewed: true } : s)))}
          onOpenChatWithCreator={(creatorId) => {
            const cr = creators.find(c => c.id === creatorId);
            if (cr) void handleOpenChatWithCreator(cr);
          }}
          onOpenTipDialog={creatorId => {
            const cr = creators.find(c => c.id === creatorId);
            if (cr) handleOpenProfilePage(cr);
          }}
          onOpenCreatorProfile={creatorId => {
            const cr = creators.find(c => c.id === creatorId);
            if (cr) handleOpenProfilePage(cr);
          }}
          allCreators={creators}
        />

        <SubscriptionPlansModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
          user={activeUser}
          onSelectPlan={plan => {
            setUser(prev => (prev ? { ...prev, plan } : prev));
            showToast(`Membresía actualizada a ${plan.toUpperCase()}`);
          }}
          onBuyCoins={(coins) => {
            setUser(prev => (prev ? { ...prev, coins: prev.coins + coins } : prev));
            showToast(`¡Has adquirido ${coins} PantiCoins!`);
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={user}
          initialTab={authModalTab}
          onLoginAs={handleLogin}
          onLogout={() => void handleLogout()}
        />

        <PostComposerModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          user={activeUser}
          onPublished={msg => { showToast(msg); void loadCatalog(); }}
          onError={msg => showToast(msg, 'error')}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
