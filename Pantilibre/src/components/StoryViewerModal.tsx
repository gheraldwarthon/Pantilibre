import React, { useState, useEffect } from 'react';
import { CreatorStory, Creator } from '../types';
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Tooltip
} from '@mui/material';
import {
  Close,
  ChevronLeft,
  ChevronRight,
  Favorite,
  MonetizationOn,
  ChatBubble,
  Verified
} from '@mui/icons-material';
import { Crown, Flame, Sparkles } from 'lucide-react';

interface StoryViewerModalProps {
  stories: CreatorStory[];
  initialStoryId?: string;
  isOpen: boolean;
  onClose: () => void;
  onMarkViewed: (storyId: string) => void;
  onOpenChatWithCreator: (creatorId: string, initialMessage?: string) => void;
  onOpenTipDialog: (creatorId: string) => void;
  onOpenCreatorProfile: (creatorId: string) => void;
  allCreators: Creator[];
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryId,
  isOpen,
  onClose,
  onMarkViewed,
  onOpenChatWithCreator,
  onOpenTipDialog,
  onOpenCreatorProfile,
  allCreators
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [reacted, setReacted] = useState(false);

  // Set initial story index when opened
  useEffect(() => {
    if (initialStoryId && stories.length > 0) {
      const idx = stories.findIndex(s => s.id === initialStoryId);
      if (idx !== -1) setCurrentIndex(idx);
    } else {
      setCurrentIndex(0);
    }
    setProgress(0);
  }, [initialStoryId, isOpen, stories]);

  const currentStory = stories[currentIndex];

  // Mark current story as viewed
  useEffect(() => {
    if (currentStory && isOpen) {
      onMarkViewed(currentStory.id);
    }
  }, [currentStory, isOpen]);

  // Story progress timer (5 seconds per story)
  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Go to next story or close
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // 50 ticks * 100ms = 5000ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentIndex, stories.length, currentStory, onClose]);

  if (!currentStory) return null;

  const currentCreator = allCreators.find(c => c.id === currentStory.creatorId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(i => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendQuickReply = () => {
    if (!quickMessage.trim()) return;
    onOpenChatWithCreator(
      currentStory.creatorId,
      `Respondiendo a tu historia: "${currentStory.caption.slice(0, 40)}..."\n\n${quickMessage}`
    );
    setQuickMessage('');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#0B030A',
            borderRadius: { xs: 0, sm: 4 },
            overflow: 'hidden',
            maxHeight: '92vh',
            height: 720,
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            border: '1px solid rgba(224, 93, 132, 0.3)'
          }
        }
      }}
    >
      {/* ========================================================
          PROGRESS BARS AT TOP
      ======================================================== */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 12,
          right: 12,
          display: 'flex',
          gap: 0.8,
          zIndex: 20
        }}
      >
        {stories.map((s, idx) => (
          <Box
            key={s.id}
            sx={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                height: '100%',
                bgcolor: '#FFF',
                width:
                  idx < currentIndex
                    ? '100%'
                    : idx === currentIndex
                    ? `${progress}%`
                    : '0%',
                transition: idx === currentIndex ? 'width 0.1s linear' : 'none'
              }}
            />
          </Box>
        ))}
      </Box>

      {/* ========================================================
          TOP BAR: CREATOR INFO & ACTIONS
      ======================================================== */}
      <Box
        sx={{
          position: 'absolute',
          top: 22,
          left: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20
        }}
      >
        <Box
          onClick={() => {
            onClose();
            onOpenCreatorProfile(currentStory.creatorId);
          }}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }}
        >
          <Avatar
            src={currentStory.creatorAvatar}
            alt={currentStory.creatorName}
            sx={{
              width: 38,
              height: 38,
              border: '2px solid #E05D84',
              boxShadow: '0 2px 10px rgba(224,93,132,0.5)'
            }}
          />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFF', fontSize: 13 }}>
                {currentStory.creatorName}
              </Typography>
              <Verified sx={{ fontSize: 15, color: '#FDE047' }} />
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 0.8,
                  py: 0.1,
                  borderRadius: 1,
                  bgcolor: '#E05D84',
                  color: '#FFF',
                  fontSize: 9,
                  fontWeight: 900
                }}
              >
                {currentStory.creatorBadge}
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
              {currentStory.timestamp}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#FFF',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ========================================================
          STORY MEDIA BACKDROP
      ======================================================== */}
      <Box
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          bgcolor: '#0B030A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <Box
          component="img"
          src={currentStory.mediaUrl}
          alt="Story content"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Ambient vignette gradients */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.85) 100%)'
          }}
        />

        {/* Left / Right click zones for story navigation */}
        <Box
          onClick={e => {
            e.stopPropagation();
            handlePrev();
          }}
          sx={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '25%',
            width: '35%',
            zIndex: 10
          }}
        />
        <Box
          onClick={e => {
            e.stopPropagation();
            handleNext();
          }}
          sx={{
            position: 'absolute',
            right: 0,
            top: '20%',
            bottom: '25%',
            width: '35%',
            zIndex: 10
          }}
        />

        {/* Navigation arrows for desktop */}
        {currentIndex > 0 && (
          <IconButton
            onClick={e => {
              e.stopPropagation();
              handlePrev();
            }}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#FFF',
              zIndex: 15,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        {currentIndex < stories.length - 1 && (
          <IconButton
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#FFF',
              zIndex: 15,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </Box>

      {/* ========================================================
          BOTTOM: CAPTION & DIRECT INTERACTIONS
      ======================================================== */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          pb: 2.5,
          zIndex: 25,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0) 100%)'
        }}
      >
        {/* Caption */}
        <Typography
          variant="body2"
          sx={{
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.5,
            mb: 1.8,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {currentStory.caption}
        </Typography>

        {/* Quick Reactions & Send Tip */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Button
            size="small"
            onClick={() => setReacted(prev => !prev)}
            startIcon={<Favorite sx={{ color: reacted ? '#E11D48' : '#FFF' }} />}
            sx={{
              bgcolor: reacted ? 'rgba(225, 29, 72, 0.25)' : 'rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 12,
              backdropFilter: 'blur(6px)',
              textTransform: 'none',
              px: 1.5
            }}
          >
            {reacted ? '¡Te gustó!' : 'Me gusta'}
          </Button>

          <Button
            size="small"
            onClick={() => {
              onClose();
              onOpenTipDialog(currentStory.creatorId);
            }}
            startIcon={<MonetizationOn sx={{ color: '#FDE047' }} />}
            sx={{
              bgcolor: 'rgba(234, 179, 8, 0.2)',
              color: '#FDE047',
              borderRadius: 3,
              fontWeight: 800,
              fontSize: 12,
              backdropFilter: 'blur(6px)',
              textTransform: 'none',
              px: 1.5,
              border: '1px solid rgba(253, 224, 71, 0.3)'
            }}
          >
            Propina
          </Button>

          <Button
            size="small"
            onClick={() => {
              onClose();
              if (currentCreator) onOpenCreatorProfile(currentCreator.id);
            }}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFF',
              borderRadius: 3,
              fontWeight: 700,
              fontSize: 12,
              backdropFilter: 'blur(6px)',
              textTransform: 'none',
              ml: 'auto'
            }}
          >
            Ver Perfil
          </Button>
        </Box>

        {/* Reply in DM Input */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Responder historia al DM privado..."
            value={quickMessage}
            onChange={e => setQuickMessage(e.target.value)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSendQuickReply();
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFF',
                fontSize: 13,
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
                '&:hover fieldset': { borderColor: '#E05D84' },
                '&.Mui-focused fieldset': { borderColor: '#E05D84' }
              },
              '& input::placeholder': { color: 'rgba(255, 255, 255, 0.65)' }
            }}
          />
          <IconButton
            onClick={handleSendQuickReply}
            disabled={!quickMessage.trim()}
            sx={{
              bgcolor: quickMessage.trim() ? '#E05D84' : 'rgba(255,255,255,0.1)',
              color: '#FFF',
              '&:hover': { bgcolor: '#BE185D' }
            }}
          >
            <ChatBubble sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  );
};
