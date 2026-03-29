import React, {useMemo} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useAppStore} from '../store/appStore';
import {WORLD_BOSSES, META_EVENTS} from '../constants/worldBosses';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import {scheduleAllBossNotifications} from '../services/notifications';

interface UpcomingNotif {
  id: string;
  eventName: string;
  mapName: string;
  notifyAtMs: number;  // absolute ms timestamp
  spawnAtMs: number;
  minutesBefore: number;
  type: 'boss' | 'meta';
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m} UTC`;
}

function formatCountdown(ms: number): string {
  const diff = ms - Date.now();
  if (diff <= 0) return 'Now';
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const min = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `in ${h}h ${min}m`;
  return `in ${min}m`;
}

function buildUpcomingNotifs(
  enabledIds: Set<string>,
  minutesBefore: number,
): UpcomingNotif[] {
  const now = Date.now();
  const windowEnd = now + 24 * 60 * 60 * 1000; // next 24 hours

  const midnight = new Date();
  midnight.setUTCHours(0, 0, 0, 0);
  const midnightMs = midnight.getTime();

  const allEvents = [
    ...WORLD_BOSSES.map(e => ({...e, type: 'boss' as const})),
    ...META_EVENTS.map(e => ({...e, type: 'meta' as const})),
  ];

  const results: UpcomingNotif[] = [];

  for (const event of allEvents) {
    if (!enabledIds.has(event.id)) continue;

    for (const spawnMinute of event.schedule) {
      const spawnMs = midnightMs + spawnMinute * 60 * 1000;
      const notifyAtMs = spawnMs - minutesBefore * 60 * 1000;

      // Check today and tomorrow
      for (let day = 0; day <= 1; day++) {
        const adjustedNotify = notifyAtMs + day * 86400000;
        const adjustedSpawn = spawnMs + day * 86400000;

        if (adjustedNotify >= now && adjustedNotify <= windowEnd) {
          results.push({
            id: `${event.id}_${spawnMinute}_${day}`,
            eventName: event.name,
            mapName: event.mapName,
            notifyAtMs: adjustedNotify,
            spawnAtMs: adjustedSpawn,
            minutesBefore,
            type: event.type,
          });
        }
      }
    }
  }

  results.sort((a, b) => a.notifyAtMs - b.notifyAtMs);
  return results;
}

function sectionize(notifs: UpcomingNotif[]): {title: string; data: UpcomingNotif[]}[] {
  const groups = new Map<string, UpcomingNotif[]>();

  for (const n of notifs) {
    const d = new Date(n.notifyAtMs);
    const label =
      d.toDateString() === new Date().toDateString() ? 'Today' : 'Tomorrow';
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(n);
  }

  return Array.from(groups.entries()).map(([title, data]) => ({title, data}));
}

function NotifRow({item}: {item: UpcomingNotif}) {
  const isSoon = item.notifyAtMs - Date.now() < 15 * 60 * 1000;
  const typeColor = item.type === 'boss' ? colors.red : colors.blue;

  return (
    <View style={styles.row}>
      <View style={[styles.typeBar, {backgroundColor: typeColor}]} />
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <Text style={[styles.countdown, isSoon && styles.countdownSoon]}>
            {formatCountdown(item.notifyAtMs)}
          </Text>
        </View>
        <View style={styles.rowBottom}>
          <Text style={styles.mapName}>{item.mapName}</Text>
          <Text style={styles.notifyTime}>
            🔔 {formatTime(item.notifyAtMs)}
          </Text>
        </View>
        <Text style={styles.spawnTime}>
          ⚔️ Spawns {formatTime(item.spawnAtMs)} ({item.minutesBefore}m after alert)
        </Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const {settings} = useAppStore();

  const enabledSet = useMemo(
    () => new Set(settings.notifyEventIds),
    [settings.notifyEventIds],
  );

  const sections = useMemo(() => {
    if (!settings.notifications) return [];
    const notifs = buildUpcomingNotifs(enabledSet, settings.notifyMinutesBefore);
    return sectionize(notifs);
  }, [settings.notifications, enabledSet, settings.notifyMinutesBefore]);

  if (!settings.notifications) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🔕</Text>
        <Text style={styles.emptyTitle}>Notifications Disabled</Text>
        <Text style={styles.emptyText}>
          Enable boss alerts in Settings to see your upcoming notification schedule.
        </Text>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🔔</Text>
        <Text style={styles.emptyTitle}>No Events Selected</Text>
        <Text style={styles.emptyText}>
          Go to Settings → Notifications and select which events to be notified about.
        </Text>
      </View>
    );
  }

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={item => item.id}
      renderItem={({item}) => <NotifRow item={item} />}
      renderSectionHeader={({section}) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionCount}>{section.data.length} alerts</Text>
        </View>
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerText}>
            🔔 Alerting {settings.notifyMinutesBefore}m before — {enabledSet.size} events enabled
          </Text>
          <TouchableOpacity
            style={styles.rescheduleBtn}
            onPress={scheduleAllBossNotifications}
            activeOpacity={0.8}>
            <Text style={styles.rescheduleTxt}>📅 Reschedule</Text>
          </TouchableOpacity>
        </View>
      }
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  content: {paddingBottom: spacing.xl},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {color: colors.textMuted, fontSize: fontSize.xs, flex: 1},
  rescheduleBtn: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  rescheduleTxt: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCount: {color: colors.textMuted, fontSize: fontSize.xs},
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  typeBar: {width: 3},
  rowBody: {flex: 1, padding: spacing.sm, gap: 2},
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventName: {color: colors.text, fontSize: fontSize.sm, fontWeight: '700', flex: 1},
  countdown: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600'},
  countdownSoon: {color: colors.gold},
  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapName: {color: colors.textMuted, fontSize: fontSize.xs},
  notifyTime: {color: colors.text, fontSize: fontSize.xs, fontWeight: '600'},
  spawnTime: {color: colors.textMuted, fontSize: fontSize.xs},
  empty: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyIcon: {fontSize: 40},
  emptyTitle: {color: colors.gold, fontSize: fontSize.lg, fontWeight: '700'},
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
