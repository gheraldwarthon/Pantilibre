import test from 'node:test';
import assert from 'node:assert/strict';
import { getOptimizedImageUrl } from './imageOptimizer.ts';
import type { AppNotification } from '../types/index.ts';

test('getOptimizedImageUrl preserves original URL when dataSaver is false', () => {
  const highResUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80';
  const result = getOptimizedImageUrl(highResUrl, false, 'feed');
  assert.equal(result, highResUrl);
});

test('getOptimizedImageUrl substitutes compressed thumbnail parameters when dataSaver is true', () => {
  const highResUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80';
  
  // Feed preset: compressed to w=380, q=35
  const feedResult = getOptimizedImageUrl(highResUrl, true, 'feed');
  assert.ok(feedResult.includes('w=380'));
  assert.ok(feedResult.includes('q=35'));

  // Avatar preset: compressed to w=96, q=40
  const avatarResult = getOptimizedImageUrl(highResUrl, true, 'avatar');
  assert.ok(avatarResult.includes('w=96'));
  assert.ok(avatarResult.includes('q=40'));

  // Card preset: compressed to w=280, q=35
  const cardResult = getOptimizedImageUrl(highResUrl, true, 'card');
  assert.ok(cardResult.includes('w=280'));
  assert.ok(cardResult.includes('q=35'));

  // Cover preset: compressed to w=460, q=40
  const coverResult = getOptimizedImageUrl(highResUrl, true, 'cover');
  assert.ok(coverResult.includes('w=460'));
  assert.ok(coverResult.includes('q=40'));
});

test('handles non-unsplash and null/undefined URLs gracefully', () => {
  assert.equal(getOptimizedImageUrl(null, true), '');
  assert.equal(getOptimizedImageUrl(undefined, true), '');
  assert.equal(getOptimizedImageUrl('/local/image.png', true), '/local/image.png');
});

test('interactive notifications state controls toast display while keeping notification history', () => {
  const sampleNotification: AppNotification = {
    id: 'n_1',
    type: 'story',
    creatorId: 'cr_1',
    creatorName: 'Camila Gold',
    creatorUsername: 'camilagold',
    creatorAvatar: '/avatar.jpg',
    creatorBadge: 'SUPER_VIP',
    title: 'Nueva historia',
    message: 'Backstage exclusivo',
    timeAgo: 'Justo ahora',
    createdAt: Date.now(),
    read: false
  };

  const notificationsList: AppNotification[] = [];

  // Helper simulating the notification reception logic
  const handleIncomingNotification = (
    notif: AppNotification,
    interactiveEnabled: boolean
  ) => {
    notificationsList.unshift(notif);
    const activeToast = interactiveEnabled ? notif : null;
    return activeToast;
  };

  // When interactive notifications are ON
  const toastWhenOn = handleIncomingNotification(sampleNotification, true);
  assert.ok(toastWhenOn !== null);
  assert.equal(toastWhenOn.id, 'n_1');
  assert.equal(notificationsList.length, 1);

  // When interactive notifications are OFF
  const sampleNotification2 = { ...sampleNotification, id: 'n_2' };
  const toastWhenOff = handleIncomingNotification(sampleNotification2, false);
  assert.equal(toastWhenOff, null);
  assert.equal(notificationsList.length, 2);
  assert.equal(notificationsList[0].id, 'n_2');
});
