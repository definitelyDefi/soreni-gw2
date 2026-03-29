import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  TimestampTrigger,
  RepeatFrequency,
} from '@notifee/react-native';
import {WORLD_BOSSES, META_EVENTS} from '../constants/worldBosses';
import {useAppStore} from '../store/appStore';

const CHANNEL_ID = 'gw2_bosses';

export async function createNotificationChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'World Boss & Meta Alerts',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
    vibration: true,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

export async function cancelAllNotifications() {
  await notifee.cancelAllNotifications();
}

export async function scheduleAllBossNotifications() {
  const {settings} = useAppStore.getState();
  if (!settings.notifications) return;

  await cancelAllNotifications();
  await createNotificationChannel();

  const minutesBefore = settings.notifyMinutesBefore;
  const enabledIds = new Set(settings.notifyEventIds);

  const allEvents = [
    ...WORLD_BOSSES,
    ...META_EVENTS,
  ];

  const now = Date.now();
  const midnightUTC = new Date();
  midnightUTC.setUTCHours(0, 0, 0, 0);
  const midnightMs = midnightUTC.getTime();

  const scheduled: Promise<string>[] = [];

  for (const event of allEvents) {
    if (!enabledIds.has(event.id)) continue;

    for (const spawnMinute of event.schedule) {
      // Compute notification fire time relative to today's UTC midnight
      const spawnMs = midnightMs + spawnMinute * 60 * 1000;
      const notifyMs = spawnMs - minutesBefore * 60 * 1000;
      // If notification time has already passed today, push to tomorrow
      const triggerTimestamp = notifyMs <= now ? notifyMs + 24 * 60 * 60 * 1000 : notifyMs;

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTimestamp,
        repeatFrequency: RepeatFrequency.DAILY,
      };

      scheduled.push(
        notifee.createTriggerNotification(
          {
            id: `${event.id}_${spawnMinute}`,
            title: `⚔️ ${event.name} in ${minutesBefore}m`,
            body: event.mapName,
            android: {
              channelId: CHANNEL_ID,
              importance: AndroidImportance.HIGH,
              pressAction: {id: 'default'},
              smallIcon: 'ic_launcher',
            },
          },
          trigger,
        ),
      );
    }
  }

  await Promise.allSettled(scheduled);
  console.log(`Scheduled ${scheduled.length} notifications`);
}

export async function scheduleTestNotification() {
  await createNotificationChannel();
  await notifee.createTriggerNotification(
    {
      title: '⚔️ Test Notification',
      body: 'Soreni notifications are working!',
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        pressAction: {id: 'default'},
        smallIcon: 'ic_launcher',
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 3000,
    },
  );
}
