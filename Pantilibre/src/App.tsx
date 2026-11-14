import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Snackbar, Alert, Box } from '@mui/material';
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

import {
  INITIAL_USER,
  CREATORS,
  PRIVATE_GALLERIES,
  POSTS,
  STORE_ITEMS,
  INITIAL_CONVERSATIONS,
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS
} from './data/mockData';

import {
  Creator,
  Post,
  PrivateGallery,
  StoreItem,
  ChatConversation,
  UserProfile,
  CreatorStory,
  AppNotification
} from './types';

import { unlockContent } from './utils/platformLogic';

export default function App() {
  // Navigation & Views - Starts on the luxury light landing page
  const [currentTab, setCurrentTab] = useState<'landing' | 'feed' | 'categories' | 'vip' | 'chat' | 'profile'>('landing');
  const [viewedCreator, setViewedCreator] = useState<Creator | null>(CREATORS[0]);
  const [previousTab, setPreviousTab] = useState<'landing' | 'feed' | 'categories' | 'vip' | 'chat'>('landing');

  // Core Data State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [creators, setCreators] = useState<Creator[]>(CREATORS);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [galleries, setGalleries] = useState<PrivateGallery[]>(PRIVATE_GALLERIES);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(STORE_ITEMS);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string>('chat_1');

  // Modals & Overlays
  const [isPlansModalOpen, setIsPlansModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'settings' | 'profile' | 'switch'>('switch');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register' = 'login', tab: 'settings' | 'profile' | 'switch' = 'switch') => {
    setAuthModalTab(tab);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Stories & Real-time Notifications State
  const [stories, setStories] = useState<CreatorStory[]>(INITIAL_STORIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeStoryId, setActiveStoryId] = useState<string | undefined>(undefined);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<HTMLElement | null>(null);
  const [activeRealTimeToast, setActiveRealTimeToast] = useState<AppNotification | null>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleSelectStory = (storyId: string) => {
    setActiveStoryId(storyId);
    setIsStoryModalOpen(true);
  };

  const handleMarkStoryViewed = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Todas las notificaciones marcadas como leídas', 'info');
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSelectNotificationTarget = (notification: AppNotification) => {
    if (notification.type === 'story') {
      if (notification.targetId) {
        handleSelectStory(notification.targetId);
      } else {
        const creatorStory = stories.find(s => s.creatorId === notification.creatorId);
        if (creatorStory) handleSelectStory(creatorStory.id);
      }
    } else {
      const targetCreator = creators.find(c => c.id === notification.creatorId);
      if (targetCreator) {
        handleOpenProfilePage(targetCreator);
      }
    }
  };

  // Real-Time Notification & Story Generator for Favorite Creators
  const triggerNotificationFromFavoriteCreator = (forceType?: 'story' | 'post', specificCreatorId?: string) => {
    let chosenCreator: Creator | undefined;
    if (specificCreatorId) {
      chosenCreator = creators.find(c => c.id === specificCreatorId);
    }
    if (!chosenCreator) {
      const favoriteIds = user.favoriteCreatorIds || user.followingCreatorIds;
      const favoriteCreators = creators.filter(c => favoriteIds.includes(c.id));
      const pool = favoriteCreators.length > 0 ? favoriteCreators : creators;
      chosenCreator = pool[Math.floor(Math.random() * pool.length)];
    }

    const storyTemplates = [
      {
        caption: 'Backstage en el tocador: probándome mis nuevas medias de red y stilettos antes de la sesión privada... ✨👠 ¿Les gusta el brillo?',
        media: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
      },
      {
        caption: 'Acabo de preparar un nuevo paquete al vacío con mi perfume favorito. Sellado al 100% y listo para viajar 📦💋',
        media: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80'
      },
      {
        caption: 'Sesión con tacones de 12cm... Los arcos de mis pies quedaron exhaustos pero perfectos 😉👠 ¿Quién quiere foto dedicada al DM?',
        media: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80'
      },
      {
        caption: 'Ajustándome el corset ceñido... Curvas al milímetro para mis suscriptores VIP 🔥🖤',
        media: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
      }
    ];

    const postTemplates = [
      {
        content: 'Acabo de subir una nueva sesión exclusiva al feed. Medias de seda de 10 deniers y liga dorada... Espero sus comentarios amores ✨💋',
        media: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'
      },
      {
        content: 'Disponibles 2 nuevas prendas usadas en mi armario exclusivo. Doble empaque hermético termosellado al vacío y tarjeta manuscrita 💌👠',
        media: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80'
      }
    ];

    const isStory = forceType ? forceType === 'story' : Math.random() > 0.45;

    if (isStory) {
      const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
      const newStoryId = `st_${Date.now()}`;
      const newStory: CreatorStory = {
        id: newStoryId,
        creatorId: chosenCreator.id,
        creatorName: chosenCreator.name,
        creatorUsername: chosenCreator.username,
        creatorAvatar: chosenCreator.avatar,
        creatorBadge: chosenCreator.badge,
        mediaUrl: template.media,
        caption: template.caption,
        timestamp: 'Justo ahora',
        createdAt: Date.now(),
        viewed: false
      };

      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: 'story',
        creatorId: chosenCreator.id,
        creatorName: chosenCreator.name,
        creatorUsername: chosenCreator.username,
        creatorAvatar: chosenCreator.avatar,
        creatorBadge: chosenCreator.badge,
        title: `¡${chosenCreator.name} publicó una historia!`,
        message: `${chosenCreator.name}: "${template.caption.slice(0, 75)}..." 📸`,
        mediaPreviewUrl: template.media,
        timeAgo: 'Justo ahora',
        createdAt: Date.now(),
        read: false,
        targetId: newStoryId,
        targetTab: 'profile'
      };

      setStories(prev => [newStory, ...prev]);
      setNotifications(prev => [newNotif, ...prev]);
      if (Boolean(user.interactiveNotifications)) {
        setActiveRealTimeToast(newNotif);
      }
    } else {
      const template = postTemplates[Math.floor(Math.random() * postTemplates.length)];
      const newPostId = `post_${Date.now()}`;
      const newPost: Post = {
        id: newPostId,
        creatorId: chosenCreator.id,
        creatorName: chosenCreator.name,
        creatorUsername: chosenCreator.username,
        creatorAvatar: chosenCreator.avatar,
        creatorBadge: chosenCreator.badge,
        isVerified: true,
        content: template.content,
        imageUrls: [template.media],
        isLocked: false,
        coinPrice: 0,
        category: chosenCreator.categories[0] || 'lingerie',
        tags: chosenCreator.tags,
        likesCount: 1,
        isLikedByUser: false,
        comments: [],
        publishedAt: 'Justo ahora'
      };

      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: 'post',
        creatorId: chosenCreator.id,
        creatorName: chosenCreator.name,
        creatorUsername: chosenCreator.username,
        creatorAvatar: chosenCreator.avatar,
        creatorBadge: chosenCreator.badge,
        title: `Nuevo contenido de ${chosenCreator.name}`,
        message: `${chosenCreator.name} subió una nueva publicación: "${template.content.slice(0, 70)}..." ✨`,
        mediaPreviewUrl: template.media,
        timeAgo: 'Justo ahora',
        createdAt: Date.now(),
        read: false,
        targetId: newPostId,
        targetTab: 'feed'
      };

      setPosts(prev => [newPost, ...prev]);
      setNotifications(prev => [newNotif, ...prev]);
      if (Boolean(user.interactiveNotifications)) {
        setActiveRealTimeToast(newNotif);
      }
    }
  };

  // Periodic automatic simulated real-time update (every 45s)
  useEffect(() => {
    const timer = setInterval(() => {
      triggerNotificationFromFavoriteCreator();
    }, 45000);

    return () => clearInterval(timer);
  }, [user.followingCreatorIds, user.favoriteCreatorIds, creators]);

  // Toggle favorite / notification alert subscription for a creator
  const handleToggleFavorite = (creator: Creator) => {
    const favoriteIds = user.favoriteCreatorIds || user.followingCreatorIds;
    const isFav = favoriteIds.includes(creator.id);
    const updatedFavorites = isFav
      ? favoriteIds.filter(id => id !== creator.id)
      : [...favoriteIds, creator.id];

    setUser(prev => ({
      ...prev,
      favoriteCreatorIds: updatedFavorites,
      followingCreatorIds: isFav
        ? prev.followingCreatorIds.filter(id => id !== creator.id)
        : prev.followingCreatorIds.includes(creator.id)
        ? prev.followingCreatorIds
        : [...prev.followingCreatorIds, creator.id]
    }));

    if (isFav) {
      showToast(`Avisos desactivados para ${creator.name}`, 'info');
    } else {
      showToast(`¡Avisos en vivo activados para ${creator.name}! Te notificaremos cuando suba nuevo contenido o historias ✨`, 'success');
    }
  };

  // Toggle Data Saver Mode (Modo Ahorro para conexiones lentas)
  const handleToggleDataSaver = () => {
    setUser(prev => {
      const nextMode = !prev.dataSaverMode;
      showToast(
        nextMode
          ? '📶 Modo Ahorro activado: usando thumbnails comprimidos para conexiones lentas.'
          : '✨ Modo Alta Resolución (HD) restablecido.',
        'info'
      );
      return { ...prev, dataSaverMode: nextMode };
    });
  };

  // Toggle Interactive Notifications (Avisos flotantes en pantalla)
  const handleToggleInteractiveNotifications = () => {
    setUser(prev => {
      const nextMode = !Boolean(prev.interactiveNotifications);
      if (!nextMode) {
        setActiveRealTimeToast(null);
        showToast('🔕 Avisos flotantes desactivados: no aparecerán ventanas emergentes en pantalla.', 'info');
      } else {
        showToast('🔔 Avisos flotantes activados: recibirás notificaciones interactivas en tiempo real.', 'success');
      }
      return { ...prev, interactiveNotifications: nextMode };
    });
  };

  // Full-Page Profile Navigation
  const handleOpenProfilePage = (creator: Creator) => {
    if (currentTab !== 'profile') {
      setPreviousTab(currentTab);
    }
    setViewedCreator(creator);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProfile = () => {
    setCurrentTab(previousTab || 'feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Snackbar Toast
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Like a post
  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByUser;
          return {
            ...p,
            isLikedByUser: isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  // Add a comment to a post
  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `cm_${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      createdAt: 'Justo ahora',
      isVip: user.plan !== 'free'
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );
    showToast('Comentario añadido.', 'info');
  };

  // Send tip to a creator
  const handleSendTip = (
    creatorId: string,
    creatorName: string,
    amount: number,
    message: string
  ) => {
    if (user.coins < amount) {
      showToast('Saldo insuficiente de PantiCoins.', 'warning');
      setIsPlansModalOpen(true);
      return;
    }

    setUser(prev => ({ ...prev, coins: prev.coins - amount }));
    showToast(`¡Propina de ${amount} PantiCoins enviada a ${creatorName}!`);

    setConversations(prev =>
      prev.map(c => {
        if (c.creatorId === creatorId) {
          return {
            ...c,
            lastMessage: `Propina de ${amount} Coins enviada`,
            lastMessageTime: 'Ahora',
            messages: [
              ...c.messages,
              {
                id: `m_tip_${Date.now()}`,
                sender: 'user',
                text: message || `Propina de ${amount} PantiCoins`,
                timestamp: 'Ahora',
                isTip: true,
                tipAmount: amount
              }
            ]
          };
        }
        return c;
      })
    );
  };

  // Unlock private gallery
  const handleUnlockGallery = (gallery: PrivateGallery) => {
    const res = unlockContent(user, gallery.id, gallery.coinPrice);
    if (!res.success) {
      showToast(res.error || 'Saldo insuficiente', 'warning');
      setIsPlansModalOpen(true);
      return;
    }

    if (res.updatedUser) {
      setUser(prev => ({
        ...prev,
        coins: res.updatedUser!.coins,
        unlockedGalleries: res.updatedUser!.unlockedGalleries
      }));
    }

    showToast(`¡Galería "${gallery.title}" desbloqueada con éxito!`);
  };

  // Buy store item
  const handleBuyStoreItem = (item: StoreItem) => {
    if (user.coins < item.priceCoins) {
      showToast('Saldo insuficiente para adquirir esta prenda.', 'warning');
      setIsPlansModalOpen(true);
      return;
    }

    setUser(prev => ({ ...prev, coins: prev.coins - item.priceCoins }));
    setStoreItems(prev =>
      prev.map(i => (i.id === item.id ? { ...i, inStock: Math.max(0, i.inStock - 1) } : i))
    );
    showToast('¡Prenda adquirida! Se preparará el empaque al vacío con máxima discreción.');
  };

  // Subscribe directly to a creator
  const handleSubscribeCreator = (creator: Creator) => {
    if (!user.followingCreatorIds.includes(creator.id)) {
      setUser(prev => ({
        ...prev,
        followingCreatorIds: [...prev.followingCreatorIds, creator.id]
      }));
    }
    showToast(`¡Te has suscrito al club VIP de ${creator.name}!`);
  };

  // Chat: send user message & simulate response
  const handleSendMessage = (chatId: string, text: string) => {
    const newMessage = {
      id: `m_user_${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: 'Ahora'
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Ahora',
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    setTimeout(() => {
      const activeConv = conversations.find(c => c.id === chatId);
      let replyText = 'Me encanta cuando me escribes... Cuéntame más.';

      if (activeConv?.creatorName.includes('Camila')) {
        replyText =
          '¡Hola amor! Justo me estaba ajustando las medias de seda. ¿Te gusta cómo se ven con tacón fino?';
      } else if (activeConv?.creatorName.includes('Victoria')) {
        replyText =
          'Querido, recibí tu mensaje. Mis prendas reservadas ya están selladas con mi fragancia.';
      } else if (activeConv?.creatorName.includes('Elena')) {
        replyText =
          '¡Hola rey! Estaba terminando una sesión con catsuit de vinilo... Mis curvas te mandan saludos.';
      } else if (activeConv?.creatorName.includes('Luna')) {
        replyText =
          'Hoy caminé 8 horas con tacones cerrados... ¿Quieres que te mande una foto exclusiva de mis suelas?';
      }

      setConversations(prev =>
        prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: 'Ahora',
              messages: [
                ...c.messages,
                {
                  id: `m_creator_${Date.now()}`,
                  sender: 'creator',
                  text: replyText,
                  timestamp: 'Ahora'
                }
              ]
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  // Chat: send inline tip
  const handleSendTipInChat = (chatId: string, amount: number) => {
    if (user.coins < amount) {
      showToast('Saldo insuficiente', 'warning');
      setIsPlansModalOpen(true);
      return;
    }

    setUser(prev => ({ ...prev, coins: prev.coins - amount }));
    showToast(`¡Propina de ${amount} Coins enviada en el chat!`);

    setConversations(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: `Propina de ${amount} Coins`,
            lastMessageTime: 'Ahora',
            messages: [
              ...c.messages,
              {
                id: `m_tip_${Date.now()}`,
                sender: 'user',
                text: `Propina enviada con dedicatoria`,
                timestamp: 'Ahora',
                isTip: true,
                tipAmount: amount
              }
            ]
          };
        }
        return c;
      })
    );
  };

  // Chat: unlock locked photo
  const handleUnlockChatPhoto = (chatId: string, messageId: string, price: number) => {
    if (user.coins < price) {
      showToast(`Necesitas ${price} Coins para desbloquear esta foto privada.`, 'warning');
      setIsPlansModalOpen(true);
      return;
    }

    setUser(prev => ({ ...prev, coins: prev.coins - price }));
    showToast('¡Foto privada desbloqueada en tu chat!');

    setConversations(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId ? { ...m, isPhotoLocked: false } : m
            )
          };
        }
        return c;
      })
    );
  };

  // Open Chat directly with a creator
  const handleOpenChatWithCreator = (creator: Creator) => {
    const existingConv = conversations.find(c => c.creatorId === creator.id);
    if (existingConv) {
      setActiveChatId(existingConv.id);
    } else {
      const newConv: ChatConversation = {
        id: `chat_${Date.now()}`,
        creatorId: creator.id,
        creatorName: creator.name,
        creatorUsername: creator.username,
        creatorAvatar: creator.avatar,
        creatorBadge: creator.badge,
        isOnline: creator.isOnline,
        lastMessage: 'Conversación iniciada',
        lastMessageTime: 'Ahora',
        unreadCount: 0,
        messages: [
          {
            id: `m_welcome_${Date.now()}`,
            sender: 'creator',
            text: `¡Hola! Me alegra que me escribas. Cuéntame qué fetiches o qué fotos te gustaría ver.`,
            timestamp: 'Ahora'
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveChatId(newConv.id);
    }
    setCurrentTab('chat');
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#FFF8F9', color: '#2D1822', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation Bar in Material UI */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={user}
          unreadCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={e => setNotificationsAnchorEl(e.currentTarget)}
          onOpenPlans={() => setIsPlansModalOpen(true)}
          onOpenAuth={() => handleOpenAuth('login', 'switch')}
          onOpenProfile={() => handleOpenAuth('login', 'profile')}
          onToggleDataSaver={handleToggleDataSaver}
        />

        {/* View Router */}
        <Box component="main" sx={{ flex: 1, pb: { xs: '72px', md: 0 } }}>
          {currentTab === 'landing' && (
            <LandingPageView
              creators={creators}
              galleries={galleries}
              user={user}
              stories={stories}
              onSelectStory={handleSelectStory}
              onExploreFeed={() => setCurrentTab('feed')}
              onExploreCategories={() => setCurrentTab('categories')}
              onExploreVIP={() => setCurrentTab('vip')}
              onSelectCreator={c => handleOpenProfilePage(c)}
              onOpenChatWithCreator={handleOpenChatWithCreator}
              onUnlockGallery={handleUnlockGallery}
              onOpenPlans={() => setIsPlansModalOpen(true)}
              onOpenAuth={(mode) => handleOpenAuth(mode || 'login', 'switch')}
            />
          )}

          {currentTab === 'feed' && (
            <FeedSection
              posts={posts}
              user={user}
              creators={creators}
              stories={stories}
              onSelectStory={handleSelectStory}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onSendTip={handleSendTip}
              onSelectCreator={c => handleOpenProfilePage(c)}
              onOpenPlans={() => setIsPlansModalOpen(true)}
              onOpenChatWithCreator={handleOpenChatWithCreator}
              onToggleDataSaver={handleToggleDataSaver}
              onToggleFavorite={handleToggleFavorite}
              onToggleInteractiveNotifications={handleToggleInteractiveNotifications}
            />
          )}

          {currentTab === 'vip' && (
            <Box>
              {/* VIP Sellers Horizontal Carousel */}
              <VIPBannerCarousel
                creators={creators}
                onSelectCreator={c => handleOpenProfilePage(c)}
                onOpenChatWithCreator={handleOpenChatWithCreator}
                onViewAllVIP={() => setCurrentTab('categories')}
              />

              {/* Private Galleries Section */}
              <PrivateGalleriesSection
                galleries={galleries}
                user={user}
                onUnlockGallery={handleUnlockGallery}
                onOpenPlans={() => setIsPlansModalOpen(true)}
              />

              {/* Social Feed */}
              <FeedSection
                posts={posts}
                user={user}
                creators={creators}
                stories={stories}
                onSelectStory={handleSelectStory}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onSendTip={handleSendTip}
                onSelectCreator={c => handleOpenProfilePage(c)}
                onOpenPlans={() => setIsPlansModalOpen(true)}
                onOpenChatWithCreator={handleOpenChatWithCreator}
                onToggleDataSaver={handleToggleDataSaver}
                onToggleFavorite={handleToggleFavorite}
                onToggleInteractiveNotifications={handleToggleInteractiveNotifications}
              />
            </Box>
          )}

          {currentTab === 'categories' && (
            <CategoriesView
              creators={creators}
              user={user}
              onSelectCreator={c => handleOpenProfilePage(c)}
              onOpenChatWithCreator={handleOpenChatWithCreator}
            />
          )}

          {currentTab === 'chat' && (
            <LiveChatView
              conversations={conversations}
              activeChatId={activeChatId}
              onSelectChat={id => setActiveChatId(id)}
              user={user}
              onSendMessage={handleSendMessage}
              onSendTipInChat={handleSendTipInChat}
              onUnlockChatPhoto={handleUnlockChatPhoto}
              onOpenPlans={() => setIsPlansModalOpen(true)}
            />
          )}

          {currentTab === 'profile' && viewedCreator && (
            <CreatorProfileView
              creator={viewedCreator}
              user={user}
              posts={posts}
              galleries={galleries}
              storeItems={storeItems}
              allCreators={creators}
              stories={stories}
              onSelectStory={handleSelectStory}
              onToggleFavorite={handleToggleFavorite}
              onTriggerNotificationForCreator={(crId, type) => triggerNotificationFromFavoriteCreator(type, crId)}
              onBack={handleBackFromProfile}
              onSelectCreator={handleOpenProfilePage}
              onOpenChat={handleOpenChatWithCreator}
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

        {/* Mobile Fixed Bottom Navigation Bar (Visible only on xs/sm mobile viewports) */}
        <MobileBottomNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          unreadChatCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenPlans={() => setIsPlansModalOpen(true)}
        />

        {/* Modals & Live Overlays */}
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
          onTriggerSimulatedNotification={(type?: 'story' | 'post') => triggerNotificationFromFavoriteCreator(type)}
          interactiveNotifications={Boolean(user.interactiveNotifications)}
          onToggleInteractiveNotifications={handleToggleInteractiveNotifications}
        />

        <StoryViewerModal
          stories={stories}
          initialStoryId={activeStoryId}
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
          onMarkViewed={handleMarkStoryViewed}
          onOpenChatWithCreator={(creatorId, initialMsg) => {
            const cr = creators.find(c => c.id === creatorId);
            if (cr) {
              handleOpenChatWithCreator(cr);
              if (initialMsg) {
                setTimeout(() => {
                  const activeConv = conversations.find(c => c.creatorId === creatorId);
                  if (activeConv) handleSendMessage(activeConv.id, initialMsg);
                }, 300);
              }
            }
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

        <RealTimeNotificationToast
          notification={activeRealTimeToast}
          onClose={() => setActiveRealTimeToast(null)}
          onOpenTarget={handleSelectNotificationTarget}
        />

        <SubscriptionPlansModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
          user={user}
          onSelectPlan={plan => {
            setUser(prev => ({ ...prev, plan }));
            showToast(`Membresía actualizada a ${plan.toUpperCase()}`);
          }}
          onBuyCoins={(coins, price) => {
            setUser(prev => ({ ...prev, coins: prev.coins + coins }));
            showToast(`¡Has adquirido ${coins} PantiCoins!`);
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={user}
          initialTab={authModalTab}
          initialAuthMode={authModalMode}
          onLoginAs={newUser => {
            setUser(newUser);
            showToast(`Sesión iniciada como ${newUser.name}`);
          }}
          onToggleDataSaver={handleToggleDataSaver}
          onToggleInteractiveNotifications={handleToggleInteractiveNotifications}
        />

        {/* Global Toast Snackbar */}
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
