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
  ActivityIndicator,
} from 'react-native';
import {useAppStore} from '../store/appStore';
import {ALL_DAILY_CATEGORIES, ALL_WEEKLY_CATEGORIES, DailyCategory, WeeklyCategory, WIDGET_CATALOG, DEFAULT_WIDGETS, WidgetId} from '../types';
import Card from '../components/ui/Card';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import {
  requestNotificationPermission,
  checkNotificationPermission,
  scheduleTestNotification,
  scheduleAllBossNotifications,
} from '../services/notifications';
import {getAccount} from '../api/account';
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

// GW2 API keys are 72 characters: 8-4-4-4-20-4-4-4-20 hex groups separated by dashes
// Example: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX
const GW2_KEY_REGEX = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{20}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{20}$/;

type KeyStatus = 'idle' | 'validating' | 'valid' | 'invalid_format' | 'invalid_key' | 'network_error';

export default function SettingsScreen({navigation}: any) {
  const {settings, setApiKey, setNotifications, setNotifyMinutesBefore, setNotifyEventIds, setDailyCategories, setWeeklyCategories, setDashboardWidgets} = useAppStore();
  const [keyInput, setKeyInput] = useState(settings.apiKey);
  const [keyStatus, setKeyStatus] = useState<KeyStatus>('idle');
  const [notifPermission, setNotifPermission] = useState(false);
  const savedTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check current OS permission state on every mount — don't rely on stored state
    checkNotificationPermission().then(setNotifPermission);
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const enabledSet = useMemo(() => new Set(settings.notifyEventIds), [settings.notifyEventIds]);

  async function handleSaveKey() {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter an API key.');
      return;
    }
    if (!GW2_KEY_REGEX.test(trimmed)) {
      setKeyStatus('invalid_format');
      return;
    }
    setKeyStatus('validating');
    try {
      // Temporarily set the key so the API client picks it up for the test call
      await setApiKey(trimmed);
      await getAccount();
      setKeyStatus('valid');
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setKeyStatus('idle'), 3000);
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setKeyStatus('invalid_key');
        await setApiKey(''); // clear invalid key from store
      } else {
        // Network error — key format is fine, save it anyway
        setKeyStatus('network_error');
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setKeyStatus('idle'), 3000);
      }
    }
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
        Alert.alert('Permission Required', 'Please enable notifications in your device settings to use boss alerts.');
        // Do NOT call setNotifications(true) — OS denied permission
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
            style={[
              styles.saveBtn,
              keyStatus === 'valid' && styles.savedBtn,
              keyStatus === 'invalid_key' || keyStatus === 'invalid_format' ? styles.errorBtn : undefined,
            ]}
            onPress={handleSaveKey}
            disabled={keyStatus === 'validating'}>
            {keyStatus === 'validating' ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.saveBtnText}>
                {keyStatus === 'valid' ? '✓ Valid Key' : keyStatus === 'invalid_key' ? '✗ Invalid Key' : keyStatus === 'invalid_format' ? '✗ Bad Format' : keyStatus === 'network_error' ? '⚠ Saved (offline)' : 'Save & Test Key'}
              </Text>
            )}
          </TouchableOpacity>
          {settings.apiKey ? (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearKey}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {keyStatus === 'invalid_format' && (
          <Text style={styles.keyError}>Key must be in GW2 format: xxxxxxxx-xxxx-xxxx-xxxx-…</Text>
        )}
        {keyStatus === 'invalid_key' && (
          <Text style={styles.keyError}>Key rejected by GW2 API — check you copied it correctly.</Text>
        )}
        {keyStatus === 'network_error' && (
          <Text style={styles.keyWarning}>⚠ Could not verify key (no network). Key saved — will be tested on next data load.</Text>
        )}
        {keyStatus === 'valid' && (
          <Text style={styles.keyStatusGood}>✓ API key verified successfully</Text>
        )}
        {keyStatus === 'idle' && settings.apiKey ? (
          <Text style={styles.keyStatusGood}>✓ API key is set</Text>
        ) : null}
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
          <View style={{flex: 1}}>
            <Text style={styles.rowLabel}>Enable Boss Alerts</Text>
            {!notifPermission && settings.notifications && (
              <Text style={styles.keyWarning}>Notifications disabled in device settings</Text>
            )}
          </View>
          <Switch
            value={settings.notifications && notifPermission}
            onValueChange={handleToggleNotifications}
            trackColor={{false: colors.border, true: colors.gold}}
            thumbColor={settings.notifications && notifPermission ? '#000' : colors.textMuted}
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

      {/* ── Daily Categories ───────────────────────────────────────── */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>📜 Daily Achievement Categories</Text>
        <Text style={styles.hint}>Choose which categories show in the daily checklist.</Text>
        {ALL_DAILY_CATEGORIES.map(cat => {
          const labels: Record<DailyCategory, string> = {
            pve:      '⚔️  PvE',
            pvp:      '🗡  PvP',
            wvw:      '🏰  WvW',
            fractals: '🌀  Fractals',
            special:  '⭐  Special / Bonus',
          };
          const enabled = (settings.dailyCategories ?? ALL_DAILY_CATEGORIES).includes(cat);
          return (
            <View key={cat} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{labels[cat]}</Text>
              <Switch
                value={enabled}
                onValueChange={val => {
                  const current = settings.dailyCategories ?? ALL_DAILY_CATEGORIES;
                  const next = val ? [...current, cat] : current.filter(c => c !== cat);
                  setDailyCategories(next);
                }}
                trackColor={{false: colors.border, true: colors.gold + '88'}}
                thumbColor={enabled ? colors.gold : colors.textMuted}
              />
            </View>
          );
        })}
      </Card>

      {/* ── Weekly Categories ──────────────────────────────────────── */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>📅 Weekly Achievement Categories</Text>
        <Text style={styles.hint}>Choose which categories show in the weekly checklist. "Special" includes expansion weeklies (EoD, SotO, Janthir).</Text>
        {ALL_WEEKLY_CATEGORIES.map(cat => {
          const labels: Record<WeeklyCategory, string> = {
            pve:      '⚔️  PvE',
            pvp:      '🗡  PvP',
            wvw:      '🏰  WvW',
            fractals: '🌀  Fractals',
            special:  '⭐  Expansion (EoD / SotO / Janthir)',
          };
          const enabled = (settings.weeklyCategories ?? ALL_WEEKLY_CATEGORIES).includes(cat);
          return (
            <View key={cat} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{labels[cat]}</Text>
              <Switch
                value={enabled}
                onValueChange={val => {
                  const current = settings.weeklyCategories ?? ALL_WEEKLY_CATEGORIES;
                  const next = val ? [...current, cat] : current.filter(c => c !== cat);
                  setWeeklyCategories(next);
                }}
                trackColor={{false: colors.border, true: colors.gold + '88'}}
                thumbColor={enabled ? colors.gold : colors.textMuted}
              />
            </View>
          );
        })}
      </Card>

      {/* ── Dashboard Widgets ─────────────────────────────────────── */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>🏠 Dashboard Widgets</Text>
        <Text style={styles.hint}>Toggle widgets on/off and reorder them with the arrows.</Text>

        {WIDGET_CATALOG.map(widget => {
          const activeWidgets: WidgetId[] = settings.dashboardWidgets ?? DEFAULT_WIDGETS;
          const idx = activeWidgets.indexOf(widget.id);
          const isEnabled = idx !== -1;

          function toggleWidget() {
            if (isEnabled) {
              setDashboardWidgets(activeWidgets.filter(w => w !== widget.id));
            } else {
              setDashboardWidgets([...activeWidgets, widget.id]);
            }
          }

          function moveUp() {
            if (idx <= 0) return;
            const next = [...activeWidgets];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            setDashboardWidgets(next);
          }

          function moveDown() {
            if (idx === -1 || idx >= activeWidgets.length - 1) return;
            const next = [...activeWidgets];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            setDashboardWidgets(next);
          }

          return (
            <View key={widget.id} style={styles.widgetRow}>
              <Text style={styles.widgetEmoji}>{widget.emoji}</Text>
              <View style={styles.widgetInfo}>
                <Text style={[styles.widgetLabel, !isEnabled && styles.widgetLabelOff]}>
                  {widget.label}
                </Text>
                {widget.requiresApiKey && !settings.apiKey && (
                  <Text style={styles.widgetApiHint}>Requires API key</Text>
                )}
              </View>
              {isEnabled && (
                <View style={styles.widgetArrows}>
                  <TouchableOpacity
                    style={[styles.arrowBtn, idx === 0 && styles.arrowBtnDisabled]}
                    onPress={moveUp}
                    disabled={idx === 0}
                    hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                    <Text style={[styles.arrowTxt, idx === 0 && styles.arrowTxtDisabled]}>▲</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.arrowBtn, idx >= activeWidgets.length - 1 && styles.arrowBtnDisabled]}
                    onPress={moveDown}
                    disabled={idx >= activeWidgets.length - 1}
                    hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                    <Text style={[styles.arrowTxt, idx >= activeWidgets.length - 1 && styles.arrowTxtDisabled]}>▼</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Switch
                value={isEnabled}
                onValueChange={toggleWidget}
                trackColor={{false: colors.border, true: colors.gold + '88'}}
                thumbColor={isEnabled ? colors.gold : colors.textMuted}
              />
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.resetWidgetsBtn}
          onPress={() => setDashboardWidgets([...DEFAULT_WIDGETS])}>
          <Text style={styles.resetWidgetsTxt}>↺ Reset to Default</Text>
        </TouchableOpacity>
      </Card>

      {/* ── About ──────────────────────────────────────────────────── */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>ℹ️ About</Text>
        <Text style={styles.aboutText}>Soreni v1.0.0</Text>
        <Text style={styles.aboutSub}>
          Unofficial companion app for Guild Wars 2.{'\n'}Not affiliated with ArenaNet.
        </Text>

        <Text style={styles.sourceTitle}>📚 Guide Sources</Text>
        <Text style={styles.sourceIntro}>
          In-app guides are compiled from the following community resources:
        </Text>

        {[
          {label: 'GW2 Wiki',              url: 'wiki.guildwars2.com',          note: 'Official community wiki — mechanics, items, lore'},
          {label: 'Snowcrows',             url: 'snowcrows.com',                note: 'Meta raid & strike builds, DPS benchmarks'},
          {label: 'Fast Farming Community',url: 'fast.farming-community.eu',    note: 'Speed-clearing, farm builds, profit routes'},
          {label: 'MetaBattle',            url: 'metabattle.com',               note: 'Builds for all game modes'},
          {label: 'Hardstuck',             url: 'hardstuck.gg',                 note: 'Beginner guides, tier lists, build search'},
          {label: 'GW2Efficiency',         url: 'gw2efficiency.com',            note: 'Account stats, crafting calculators, TP tools'},
          {label: 'killproof.me',          url: 'killproof.me',                 note: 'Raid kill proof tracking'},
          {label: 'dps.report',            url: 'dps.report',                   note: 'arcdps log uploads & analysis'},
          {label: 'FidoKorn Farming Guide',url: 'guildwars2.com (forum)',       note: 'Russian GW2 farming guide by FidoKorn.3764 — primary economy source'},
        ].map(src => (
          <View key={src.url} style={styles.sourceRow}>
            <Text style={styles.sourceLabel}>{src.label}</Text>
            <Text style={styles.sourceUrl}>{src.url}</Text>
            <Text style={styles.sourceNote}>{src.note}</Text>
          </View>
        ))}

        <Text style={styles.sourceDisclaimer}>
          All trademarks are property of their respective owners. Guide content is for informational purposes only and may not reflect the latest game patches.
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
  keyStatusGood: {color: colors.green, fontSize: fontSize.xs},
  keyError: {color: colors.red, fontSize: fontSize.xs, lineHeight: 16},
  keyWarning: {color: '#ff9800', fontSize: fontSize.xs, lineHeight: 16},
  errorBtn: {backgroundColor: colors.red},
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
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  toggleLabel: {color: colors.text, fontSize: fontSize.sm},
  aboutText: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  aboutSub: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 18},
  sourceTitle: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.xs},
  sourceIntro: {color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.sm},
  sourceRow: {paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border + '44'},
  sourceLabel: {color: colors.text, fontSize: fontSize.xs, fontWeight: '700'},
  sourceUrl: {color: colors.blue, fontSize: fontSize.xs},
  sourceNote: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 16},
  sourceDisclaimer: {color: colors.textMuted, fontSize: 10, lineHeight: 15, marginTop: spacing.sm, fontStyle: 'italic'},
  notifLink: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border},
  notifLinkText: {flex: 1, color: colors.text, fontSize: fontSize.md, fontWeight: '600'},
  notifLinkArrow: {color: colors.gold, fontSize: 24, fontWeight: '300'},
  // widget rows
  widgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  widgetEmoji: {fontSize: 18, width: 26, textAlign: 'center'},
  widgetInfo: {flex: 1},
  widgetLabel: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  widgetLabelOff: {color: colors.textMuted},
  widgetApiHint: {color: colors.textMuted, fontSize: fontSize.xs},
  widgetArrows: {flexDirection: 'row', gap: 2},
  arrowBtn: {
    width: 28, height: 28,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  arrowBtnDisabled: {opacity: 0.3},
  arrowTxt: {color: colors.text, fontSize: 11, fontWeight: '700'},
  arrowTxtDisabled: {color: colors.textMuted},
  resetWidgetsBtn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  resetWidgetsTxt: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600'},
});
