import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation, UserProfile } from '../types';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import {
  Send,
  MonetizationOn,
  Verified,
  Lock,
  DoneAll,
  Security,
  Close,
  ArrowBack
} from '@mui/icons-material';

interface LiveChatViewProps {
  conversations: ChatConversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  user: UserProfile;
  onSendMessage: (chatId: string, text: string) => void;
  onSendTipInChat: (chatId: string, amount: number) => void;
  onUnlockChatPhoto: (chatId: string, messageId: string, price: number) => void;
  onOpenPlans: () => void;
}

export const LiveChatView: React.FC<LiveChatViewProps> = ({
  conversations,
  activeChatId,
  onSelectChat,
  user,
  onSendMessage,
  onSendTipInChat,
  onUnlockChatPhoto,
  onOpenPlans
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTipPicker, setShowTipPicker] = useState(false);
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find(c => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    if (activeChatId) {
      setMobilePane('chat');
    }
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim() || !activeConversation) return;
    const textToSend = inputText.trim();
    setInputText('');

    onSendMessage(activeConversation.id, textToSend);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2200);
  };

  const handleSendTip = (amount: number) => {
    if (!activeConversation) return;
    onSendTipInChat(activeConversation.id, amount);
    setShowTipPicker(false);
  };

  if (!activeConversation) {
    return (
      <Box sx={{ maxWidth: '960px', mx: 'auto', p: 4, textAlign: 'center', color: '#7A5868', borderRadius: 0 }}>
        No hay conversaciones activas.
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', sm: '760px', md: '920px', lg: '980px' },
        mx: 'auto',
        px: { xs: 1, sm: 2 },
        py: { xs: 1, sm: 2 },
        height: { xs: 'calc(100vh - 130px)', sm: '580px', md: '620px' },
        maxHeight: { sm: 'calc(100vh - 100px)' },
        minHeight: { xs: 380, sm: 480 },
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: 'flex',
          borderRadius: 0,
          overflow: 'hidden',
          border: '1.5px solid #FCE7F3',
          bgcolor: '#FFFFFF',
          boxShadow: '0 4px 20px -4px rgba(224, 93, 132, 0.08)',
          height: '100%'
        }}
      >
        {/* Left Conversations Sidebar - Bordes Rectos */}
        <Box
          sx={{
            width: { xs: '100%', sm: 250, md: 280 },
            borderRight: '1.5px solid #FCE7F3',
            bgcolor: '#FFF8FA',
            display: { xs: mobilePane === 'list' ? 'flex' : 'none', sm: 'flex' },
            flexDirection: 'column',
            flexShrink: 0,
            height: '100%',
            borderRadius: 0
          }}
        >
          {/* Sidebar Header */}
          <Box
            sx={{
              p: 1.2,
              px: 1.5,
              borderBottom: '1px solid #FCE7F3',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 0
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 13 }}>
                Mensajes
              </Typography>
              <Chip
                label="EN VIVO"
                size="small"
                sx={{
                  bgcolor: '#FFFDF0',
                  border: '1px solid #F5DE98',
                  color: '#8A6D1E',
                  fontWeight: 900,
                  fontSize: 8.5,
                  height: 16,
                  borderRadius: 0
                }}
              />
            </Box>

            <Chip
              icon={<MonetizationOn sx={{ color: '#D4AF37 !important', fontSize: 14 }} />}
              label={`${user.coins} C`}
              onClick={onOpenPlans}
              clickable
              size="small"
              sx={{ bgcolor: '#FFFBEB', color: '#8A6D1E', fontWeight: 800, height: 22, fontSize: 11, borderRadius: 0, border: '1px solid #FDE68A' }}
            />
          </Box>

          {/* Conversations List */}
          <List sx={{ p: 0, flex: 1, overflowY: 'auto', borderRadius: 0 }}>
            {conversations.map(conv => {
              const isSelected = conv.id === activeConversation.id;

              return (
                <ListItem key={conv.id} disablePadding sx={{ borderBottom: '1px solid #FFF0F5', borderRadius: 0 }}>
                  <ListItemButton
                    onClick={() => {
                      onSelectChat(conv.id);
                      setMobilePane('chat');
                    }}
                    selected={isSelected}
                    sx={{
                      p: 1,
                      px: 1.4,
                      borderRadius: 0,
                      bgcolor: isSelected ? '#FFF0F5' : 'transparent',
                      borderLeft: isSelected ? '4px solid #E05D84' : '4px solid transparent',
                      '&.Mui-selected': { bgcolor: '#FFF0F5' },
                      '&:hover': { bgcolor: '#FFF3F7' }
                    }}
                  >
                    <ListItemAvatar sx={{ position: 'relative', minWidth: 46 }}>
                      <Avatar src={conv.creatorAvatar} sx={{ width: 36, height: 36, border: '1.5px solid #F5DE98', borderRadius: 0 }} />
                      {conv.isOnline && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 12,
                            width: 8,
                            height: 8,
                            bgcolor: '#10B981',
                            borderRadius: 0,
                            border: '1px solid #FFF'
                          }}
                        />
                      )}
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 800,
                              color: '#2D1822',
                              fontSize: 12.5,
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {conv.creatorName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9D7387', fontSize: 9.5, ml: 0.5 }}>
                            {conv.lastMessageTime}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#7A5868',
                            fontSize: 10.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            mt: 0.2
                          }}
                        >
                          {conv.lastMessage}
                        </Typography>
                      }
                    />

                    {conv.unreadCount > 0 && (
                      <Chip
                        label={conv.unreadCount}
                        size="small"
                        sx={{
                          bgcolor: '#E11D48',
                          color: '#FFF',
                          height: 16,
                          minWidth: 16,
                          fontSize: 9.5,
                          fontWeight: 900,
                          ml: 0.8,
                          borderRadius: 0
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Right Active Conversation Window - Bordes Rectos */}
        <Box
          sx={{
            flex: 1,
            display: { xs: mobilePane === 'chat' ? 'flex' : 'none', sm: 'flex' },
            flexDirection: 'column',
            bgcolor: '#FFFFFF',
            minWidth: 0,
            height: '100%',
            borderRadius: 0
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1,
              px: { xs: 1.2, sm: 2 },
              borderBottom: '1.5px solid #FCE7F3',
              bgcolor: '#FFFDFE',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 48,
              borderRadius: 0
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setMobilePane('list')}
                sx={{
                  display: { xs: 'inline-flex', sm: 'none' },
                  color: '#BE185D',
                  p: 0.6,
                  mr: 0.2,
                  bgcolor: '#FFF0F5',
                  border: '1px solid #FBCFE8',
                  borderRadius: 0
                }}
                aria-label="Volver a la bandeja"
              >
                <ArrowBack sx={{ fontSize: 16 }} />
              </IconButton>

              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={activeConversation.creatorAvatar}
                  sx={{ width: 34, height: 34, border: '1.5px solid #E05D84', borderRadius: 0 }}
                />
                {activeConversation.isOnline && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 8,
                      height: 8,
                      bgcolor: '#10B981',
                      borderRadius: 0,
                      border: '1px solid #FFF'
                    }}
                  />
                )}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'nowrap' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1822', fontSize: 13, lineHeight: 1.2 }}>
                    {activeConversation.creatorName}
                  </Typography>
                  <Verified sx={{ color: '#D4AF37', fontSize: 14 }} />
                  <Chip
                    label={activeConversation.creatorBadge}
                    size="small"
                    sx={{
                      bgcolor: '#FFFDF0',
                      border: '1px solid #F5DE98',
                      color: '#8A6D1E',
                      height: 15,
                      fontSize: 8,
                      fontWeight: 800,
                      display: { xs: 'none', md: 'flex' },
                      borderRadius: 0
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, fontSize: 10, display: 'block', lineHeight: 1.1 }}>
                  ● En línea ahora
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={() => setShowTipPicker(!showTipPicker)}
              variant="contained"
              size="small"
              startIcon={<MonetizationOn sx={{ color: '#D4AF37 !important', fontSize: 14 }} />}
              sx={{
                bgcolor: '#FFFDF0',
                border: '1px solid #F5DE98',
                color: '#8A6D1E',
                fontWeight: 800,
                borderRadius: 0,
                fontSize: 11.5,
                px: 1.2,
                py: 0.35,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#FEF3C7', boxShadow: 'none' }
              }}
            >
              Propina
            </Button>
          </Box>

          {/* Quick Tip Popover - Recto */}
          {showTipPicker && (
            <Box
              sx={{
                bgcolor: '#FFF0F5',
                p: 0.8,
                px: 2,
                borderBottom: '1px solid #FBCFE8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 0
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#BE185D', fontSize: 11 }}>
                Enviar PantiCoins:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                {[20, 50, 100].map(amt => (
                  <Button
                    key={amt}
                    onClick={() => handleSendTip(amt)}
                    disabled={user.coins < amt}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 0,
                      borderColor: '#F5DE98',
                      bgcolor: '#FFFFFF',
                      color: '#8A6D1E',
                      fontWeight: 800,
                      fontSize: 10.5,
                      py: 0.2,
                      px: 0.8,
                      minWidth: 44
                    }}
                  >
                    +{amt} C
                  </Button>
                ))}
                <IconButton size="small" onClick={() => setShowTipPicker(false)} sx={{ p: 0.4, borderRadius: 0 }}>
                  <Close sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Messages Scroll Area - Bordes Rectos */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 1.2, sm: 1.8 },
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
              bgcolor: '#FFF8FA',
              borderRadius: 0
            }}
          >
            <Box sx={{ textAlign: 'center', my: 0.4 }}>
              <Chip
                icon={<Security sx={{ fontSize: 12 }} />}
                label="Cifrado seguro y privado"
                size="small"
                sx={{
                  bgcolor: '#FFFFFF',
                  border: '1px solid #FCE7F3',
                  color: '#7A5868',
                  fontSize: 10,
                  height: 20,
                  borderRadius: 0
                }}
              />
            </Box>

            {activeConversation.messages.map(msg => {
              const isMe = msg.sender === 'user';

              return (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: { xs: '88%', sm: '76%' }
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.2,
                      px: 1.5,
                      borderRadius: 0,
                      bgcolor: isMe ? '#E05D84' : '#FFFFFF',
                      color: isMe ? '#FFFFFF' : '#2D1822',
                      border: isMe ? '1px solid #BE185D' : '1px solid #FCE7F3',
                      boxShadow: '0 1px 4px rgba(224, 93, 132, 0.05)'
                    }}
                  >
                    {msg.isTip ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#8A6D1E' }}>
                        <Avatar sx={{ bgcolor: '#FFFDF0', border: '1px solid #F5DE98', width: 28, height: 28, borderRadius: 0 }}>
                          <MonetizationOn sx={{ color: '#D4AF37', fontSize: 16 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: 12, color: isMe ? '#FFF' : '#8A6D1E' }}>
                            ¡Propina de {msg.tipAmount} Coins enviada!
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.9, fontSize: 10 }}>
                            Gracias por apoyar mi contenido VIP.
                          </Typography>
                        </Box>
                      </Box>
                    ) : msg.isPhoto ? (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.8, fontSize: 12.5 }}>{msg.text}</Typography>
                        <Box sx={{ position: 'relative', borderRadius: 0, overflow: 'hidden', bgcolor: '#FFF0F5', maxWidth: 220, border: '1px solid #FCE7F3' }}>
                          <Box
                            component="img"
                            src={msg.photoUrl}
                            alt="Foto del chat"
                            sx={{
                              width: '100%',
                              height: 160,
                              objectFit: 'cover',
                              filter: msg.isPhotoLocked ? 'blur(10px) brightness(0.85)' : 'none'
                            }}
                          />
                          {msg.isPhotoLocked && (
                            <Box
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 1.5
                              }}
                            >
                              <Lock sx={{ color: '#D4AF37', fontSize: 26, mb: 0.8 }} />
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#FFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)', mb: 1, fontSize: 10 }}>
                                Foto Privada en Tocador
                              </Typography>
                              <Button
                                onClick={() => onUnlockChatPhoto(activeConversation.id, msg.id, msg.photoPrice || 50)}
                                variant="contained"
                                size="small"
                                sx={{ bgcolor: '#E05D84', color: '#FFF', fontWeight: 800, fontSize: 10, borderRadius: 0, py: 0.3, px: 1.2 }}
                              >
                                Desbloquear ({msg.photoPrice || 50} C)
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ fontSize: 12.5, lineHeight: 1.45 }}>
                        {msg.text}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.4, mt: 0.4, opacity: 0.75, fontSize: 9.5 }}>
                      <span>{msg.timestamp}</span>
                      {isMe && <DoneAll sx={{ fontSize: 12 }} />}
                    </Box>
                  </Paper>
                </Box>
              );
            })}

            {isTyping && (
              <Chip
                label={`${activeConversation.creatorName} está escribiendo...`}
                size="small"
                sx={{ alignSelf: 'flex-start', bgcolor: '#FFF0F5', color: '#BE185D', fontWeight: 600, border: '1px solid #FBCFE8', height: 20, fontSize: 10, borderRadius: 0 }}
              />
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Bar - Bordes Rectos */}
          <Box
            sx={{
              p: 1,
              px: { xs: 1.2, sm: 1.8 },
              borderTop: '1.5px solid #FCE7F3',
              bgcolor: '#FFFFFF',
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              borderRadius: 0
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={`Mensaje a ${activeConversation.creatorName}...`}
              sx={{
                bgcolor: '#FFF8FA',
                borderRadius: 0,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  fontSize: 12.5,
                  py: 0.2,
                  '& fieldset': { borderColor: '#FCE7F3', borderRadius: 0 },
                  '&.Mui-focused fieldset': { borderColor: '#E05D84', borderRadius: 0 }
                }
              }}
            />

            <Button
              onClick={handleSend}
              disabled={!inputText.trim()}
              variant="contained"
              sx={{
                bgcolor: '#E05D84',
                color: '#FFFFFF',
                borderRadius: 0,
                minWidth: 38,
                height: 36,
                px: 1.2,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#BE185D', boxShadow: 'none' }
              }}
            >
              <Send sx={{ fontSize: 16 }} />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
