import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import {
  requestNotificationPermission,
  scheduleTestNotification,
  scheduleAllBossNotifications,
} from '../services/notifications';
import {WORLD_BOSSES, META_EVENTS} from '../constants/worldBosses';

const CATEGORY_LABELS: Record<string, string> = {
  boss:     '🐉 World Bosses',
  core:     '⚔️ Core Tyria',
  ls1:      '📜 Living World S1',
  ls2:      '📜 Living World S2',
  ls3:      '📜 Living World S3',
  ls4:      '📜 Living World S4',
  ls5:      '❄️ Icebrood Saga',
  hot:      '🌿 Heart of Thorns',
  pof:      '🏜️ Path of Fire',
  eod:      '🐉 End of Dragons',
  soto:     '🌌 Secrets of the Obscure',
  janthir:  '🐻 Janthir Wilds',
};

// Group all events by category for display
const EVENT_GROUPS: {key: string; label: string; events: {id: string; name: string; mapName: string}[]}[] = [
  {
    key: 'boss',
    label: CATEGORY_LABELS.boss,
    events: WORLD_BOSSES,
  },
  ...Object.keys(CATEGORY_LABELS)
    .filter(k => k !== 'boss')
    .map(key => ({
      key,
      label: CATEGORY_LABELS[key],
      events: META_EVENTS.filter(e => e.category === key),
    }))
    .filter(g => g.events.length > 0),
];

export default function SettingsScreen({navigation}: any) {
  const {settings, setApiKey, setNotifications, setNotifyMinutesBefore, setNotifyEventIds} = useAppStore();
  const [keyInput, setKeyInput] = useState(settings.apiKey);
  const [saved, setSaved] = useState(false);
  const [notifPermission, setNotifPermission] = useState(false);
  const savedTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    requestNotificationPermission().then(setNotifPermission);
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const enabledSet = useMemo(() => new Set(settings.notifyEventIds), [settings.notifyEventIds]);

  async function handleSaveKey() {
    if (!keyInput.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }
    await setApiKey(keyInput.trim());
    setSaved(true);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
  }

  function handleClearKey() {
    Alert.alert('Clear API Key', 'Are you sure you want to remove your API key?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await setApiKey('');
          setKeyInput('');
        },
      },
    ]);
  }

  async function handleToggleNotifications(enabled: boolean) {
    if (enabled && !notifPermission) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
        return;
      }
      setNotifPermission(true);
    }
    await setNotifications(enabled);
  }

  function toggleEvent(id: string, on: boolean) {
    const next = on
      ? [...settings.notifyEventIds, id]
      : settings.notifyEventIds.filter(x => x !== id);
    setNotifyEventIds(next);
  }

  function toggleGroup(groupEvents: {id: string}[], allOn: boolean) {
    const groupIds = new Set(groupEvents.map(e => e.id));
    const base = settings.notifyEventIds.filter(id => !groupIds.has(id));
    const next = allOn ? base : [...base, ...groupIds];
    setNotifyEventIds(next);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Notifications ───────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.notifLink}
        onPress={() => navigation.push('Notifications')}
        activeOpacity={0.8}>
        <Text style={styles.notifLinkText}>🔔 Notifications</Text>
        <Text style={styles.notifLinkArrow}>›</Text>
      </TouchableOpacity>

      {/* ── API Key ─────────────────────────────────────────────────── */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>🔑 API Key</Text>
        <Text style={styles.hint}>Get your key at account.arena.net → Applications</Text>
        <TextInput
          style={styles.input}
          value={keyInput}
          onChangeText={setKeyInput}
          placeholder="Paste your API key here"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.savedBtn]}
            onPress={handleSaveKey}>
            <Text style={styles.saveBtnText}>{saved ? '✓ Saved' : 'Save Key'}</Text>
          </TouchableOpacity>
          {settings.apiKey ? (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearKey}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {settings.apiKey ? <Text style={styles.keyStatus}>✓ API key is set</Text> : null}
      </Card>

      {/* ── Notifications ───────────────────────────────────────────── */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>

        {!notifPermission && (
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={() => requestNotificationPermission().then(setNotifPermission)}>
            <Text style={styles.permissionBtnText}>Grant Notification Permission</Text>
          </TouchableOpacity>
        )}

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Enable Boss Alerts</Text>
          <Switch
            value={settings.notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{false: colors.border, true: colors.gold}}
            thumbColor={settings.notifications ? '#000' : colors.textMuted}
          />
        </View>

        {settings.notifications && (
          <>
            {/* Notify before */}
            <View style={styles.minutesRow}>
              <Text style={styles.rowLabel}>Notify before</Text>
              <View style={styles.minutesBtns}>
                {[5, 10, 15, 30].map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.minuteBtn, settings.notifyMinutesBefore === m && styles.minuteBtnActive]}
                    onPress={() => setNotifyMinutesBefore(m)}>
                    <Text style={[styles.minuteBtnText, settings.notifyMinutesBefore === m && styles.minuteBtnTextActive]}>
                      {m}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Per-event selection */}
            <Text style={styles.categoryTitle}>Notify for</Text>
            {EVENT_GROUPS.map(group => {
              const groupIds = group.events.map(e => e.id);
              const enabledCount = groupIds.filter(id => enabledSet.has(id)).length;
              const allOn = enabledCount === groupIds.length;
              return (
                <View key={group.key} style={styles.groupContainer}>
                  {/* Group header */}
                  <TouchableOpacity
                    style={styles.groupHeader}
                    onPress={() => toggleGroup(group.events, allOn)}
                    activeOpacity={0.7}>
                    <Text style={styles.groupLabel}>{group.label}</Text>
                    <Text style={styles.groupCount}>
                      {enabledCount}/{groupIds.length}
                    </Text>
                    <Switch
                      value={enabledCount > 0}
                      onValueChange={() => toggleGroup(group.events, allOn)}
                      trackColor={{false: colors.border, true: colors.gold}}
                      thumbColor={enabledCount > 0 ? '#000' : colors.textMuted}
                    />
                  </TouchableOpacity>
                  {/* Individual events */}
                  {group.events.map(ev => {
                    const on = enabledSet.has(ev.id);
                    return (
                      <View key={ev.id} style={styles.eventRow}>
                        <View style={styles.eventInfo}>
                          <Text style={styles.eventName}>{ev.name}</Text>
                          <Text style={styles.eventMap}>{ev.mapName}</Text>
                        </View>
                        <Switch
                          value={on}
                          onValueChange={val => toggleEvent(ev.id, val)}
                          trackColor={{false: colors.border, true: colors.gold}}
                          thumbColor={on ? '#000' : colors.textMuted}
                        />
                      </View>
                    );
                  })}
                </View>
              );
            })}

            <TouchableOpacity style={styles.scheduleBtn} onPress={scheduleAllBossNotifications}>
              <Text style={styles.scheduleBtnText}>📅 Reschedule Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.testBtn} onPress={scheduleTestNotification}>
              <Text style={styles.testBtnText}>🔔 Send Test Notification</Text>
            </TouchableOpacity>
          </>
        )}
      </Card>

      {/* ── About ──────────────────────────────────────────────────── */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>ℹ️ About</Text>
        <Text style={styles.aboutText}>Soreni v1.0.0</Text>
        <Text style={styles.aboutSub}>
          Unofficial companion app for Guild Wars 2.{'\n'}Not affiliated with ArenaNet.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  content: {padding: spacing.md, gap: spacing.md},
  card: {gap: spacing.sm},
  sectionTitle: {color: colors.gold, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.xs},
  hint: {color: colors.textMuted, fontSize: fontSize.xs},
  input: {
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.sm, color: colors.text,
    fontSize: fontSize.sm, minHeight: 60,
  },
  btnRow: {flexDirection: 'row', gap: spacing.sm},
  saveBtn: {flex: 1, backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center'},
  savedBtn: {backgroundColor: colors.green},
  saveBtnText: {color: '#000', fontSize: fontSize.sm, fontWeight: '700'},
  clearBtn: {
    backgroundColor: colors.red + '22', borderWidth: 1, borderColor: colors.red,
    borderRadius: radius.md, padding: spacing.sm, paddingHorizontal: spacing.md, alignItems: 'center',
  },
  clearBtnText: {color: colors.red, fontSize: fontSize.sm, fontWeight: '700'},
  keyStatus: {color: colors.green, fontSize: fontSize.xs},
  permissionBtn: {
    backgroundColor: colors.blue + '22', borderWidth: 1, borderColor: colors.blue,
    borderRadius: radius.md, padding: spacing.sm, alignItems: 'center',
  },
  permissionBtnText: {color: colors.blue, fontSize: fontSize.sm, fontWeight: '700'},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  rowLabel: {color: colors.text, fontSize: fontSize.sm},
  minutesRow: {gap: spacing.xs},
  minutesBtns: {flexDirection: 'row', gap: spacing.sm},
  minuteBtn: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  minuteBtnActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  minuteBtnText: {color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600'},
  minuteBtnTextActive: {color: '#000'},
  categoryTitle: {
    color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.xs,
  },
  // Groups
  groupContainer: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    overflow: 'hidden', marginTop: spacing.xs,
  },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
  },
  groupLabel: {flex: 1, color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  groupCount: {color: colors.textMuted, fontSize: fontSize.xs},
  // Individual events
  eventRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.sm, paddingVertical: 6,
    borderTopWidth: 1, borderTopColor: colors.border + '66',
  },
  eventInfo: {flex: 1},
  eventName: {color: colors.text, fontSize: fontSize.sm},
  eventMap: {color: colors.textMuted, fontSize: fontSize.xs},
  scheduleBtn: {
    backgroundColor: colors.gold + '22', borderWidth: 1, borderColor: colors.gold,
    borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', marginTop: spacing.xs,
  },
  scheduleBtnText: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  testBtn: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: spacing.sm, alignItems: 'center',
  },
  testBtnText: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  aboutText: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  aboutSub: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 18},
  notifLink: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border},
  notifLinkText: {flex: 1, color: colors.text, fontSize: fontSize.md, fontWeight: '600'},
  notifLinkArrow: {color: colors.gold, fontSize: 24, fontWeight: '300'},
});
