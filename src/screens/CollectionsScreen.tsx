import React, {useMemo} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useMountSkins, useAccountGliders, useAccountTitles, useAccountEmotes, useAccountAchievements} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import {colors, fontSize, spacing, radius} from '../constants/theme';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_MOUNT_SKINS = 450;
const TOTAL_GLIDERS     = 180;
const TOTAL_TITLES      = 900;
const TOTAL_EMOTES      = 40;

// Dot preview limit for the recent-unlocks strip
const DOT_PREVIEW_COUNT = 20;
// Grid box count for the mount skins grid
const MOUNT_GRID_COUNT  = 30;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({value, max, color = colors.gold}: {value: number; max: number; color?: string}) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, {width: `${Math.round(pct * 100)}%` as any, backgroundColor: color}]} />
    </View>
  );
}

// A horizontal strip of small coloured dots — purely decorative flair
function UnlockDots({ids, color}: {ids: (number | string)[]; color: string}) {
  const preview = ids.slice(0, DOT_PREVIEW_COUNT);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.dotsContainer}
      style={styles.dotsScroll}>
      {preview.map((id, i) => (
        <View key={`${id}-${i}`} style={[styles.dot, {backgroundColor: color + 'bb'}]} />
      ))}
      {ids.length > DOT_PREVIEW_COUNT && (
        <Text style={styles.dotsMore}>+{ids.length - DOT_PREVIEW_COUNT}</Text>
      )}
    </ScrollView>
  );
}

interface CollectionCardProps {
  emoji: string;
  title: string;
  unlocked: number;
  total: number;
  ids: (number | string)[];
  color: string;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

function CollectionCard({emoji, title, unlocked, total, ids, color, isLoading, isError, onRetry}: CollectionCardProps) {
  const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <Card style={styles.collectionCard} padded>
      <View style={styles.collectionHeader}>
        <Text style={styles.collectionEmoji}>{emoji}</Text>
        <Text style={styles.collectionTitle}>{title}</Text>
        {isLoading && <ActivityIndicator size="small" color={color} style={styles.cardLoader} />}
      </View>

      {isError ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>Could not load data.</Text>
          {onRetry && (
            <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
              <Text style={styles.retryTxt}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : isLoading ? null : (
        <>
          <View style={styles.countRow}>
            <Text style={[styles.countNumber, {color}]}>{unlocked.toLocaleString()}</Text>
            <Text style={styles.countLabel}> unlocked</Text>
            <Text style={styles.countOf}>/ ~{total.toLocaleString()} est.</Text>
            <View style={[styles.pctBadge, {borderColor: color + '66', backgroundColor: color + '18'}]}>
              <Text style={[styles.pctText, {color}]}>{pct}%</Text>
            </View>
          </View>
          <ProgressBar value={unlocked} max={total} color={color} />
          {ids.length > 0 && (
            <UnlockDots ids={ids} color={color} />
          )}
        </>
      )}
    </Card>
  );
}

// Grid of small boxes: gold = unlocked, grey = locked (first 30 slots shown)
function MountSkinGrid({unlockedIds}: {unlockedIds: number[]}) {
  const unlockedSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);

  // Build a stable 30-slot grid using the first 30 numeric IDs from the
  // unlocked list padded with locked placeholders up to MOUNT_GRID_COUNT.
  const sortedUnlocked = useMemo(() => [...unlockedIds].sort((a, b) => a - b), [unlockedIds]);
  const gridSlots: Array<{id: number; unlocked: boolean}> = useMemo(() => {
    const slots: Array<{id: number; unlocked: boolean}> = [];
    // Take the first MOUNT_GRID_COUNT unlocked IDs for the "unlocked" boxes
    for (let i = 0; i < MOUNT_GRID_COUNT; i++) {
      if (i < sortedUnlocked.length) {
        slots.push({id: sortedUnlocked[i], unlocked: true});
      } else {
        slots.push({id: -(i + 1), unlocked: false});
      }
    }
    return slots;
  }, [sortedUnlocked]);

  return (
    <View style={styles.mountGrid}>
      {gridSlots.map((slot, i) => (
        <View
          key={`${slot.id}-${i}`}
          style={[
            styles.mountBox,
            slot.unlocked
              ? styles.mountBoxUnlocked
              : styles.mountBoxLocked,
          ]}
        />
      ))}
    </View>
  );
}

// ─── AP Summary helper ────────────────────────────────────────────────────────

function APSummary({data, isLoading}: {data: any[] | undefined; isLoading: boolean}) {
  const totalAP = useMemo(() => {
    if (!data) {return 0;}
    return data.reduce((sum: number, a: any) => sum + (a.current ?? 0), 0);
  }, [data]);

  return (
    <View style={styles.apRow}>
      <Text style={styles.apLabel}>Achievement Points (AP)</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.gold} />
      ) : (
        <Text style={styles.apValue}>{totalAP.toLocaleString()}</Text>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CollectionsScreen() {
  const {settings} = useAppStore();

  const {data: mountSkins,  isLoading: mountLoading,  isError: mountError,   refetch: refetchMounts}   = useMountSkins();
  const {data: gliders,     isLoading: glidersLoading, isError: glidersError, refetch: refetchGliders}  = useAccountGliders();
  const {data: titles,      isLoading: titlesLoading,  isError: titlesError,  refetch: refetchTitles}   = useAccountTitles();
  const {data: emotes,      isLoading: emotesLoading,  isError: emotesError,  refetch: refetchEmotes}   = useAccountEmotes();
  const {data: achievements, isLoading: apLoading}                            = useAccountAchievements();

  // Counts (fall back to 0 when undefined)
  const mountCount   = mountSkins?.length  ?? 0;
  const gliderCount  = gliders?.length     ?? 0;
  const titleCount   = titles?.length      ?? 0;
  const emoteCount   = emotes?.length      ?? 0;

  // Overall completion % across all categories (only count categories that have loaded)
  const overallPct = useMemo(() => {
    const categories: Array<{unlocked: number; total: number; loaded: boolean}> = [
      {unlocked: mountCount,  total: TOTAL_MOUNT_SKINS, loaded: !mountLoading && !mountError},
      {unlocked: gliderCount, total: TOTAL_GLIDERS,     loaded: !glidersLoading && !glidersError},
      {unlocked: titleCount,  total: TOTAL_TITLES,      loaded: !titlesLoading && !titlesError},
      {unlocked: emoteCount,  total: TOTAL_EMOTES,      loaded: !emotesLoading && !emotesError},
    ];
    const loaded = categories.filter(c => c.loaded);
    if (loaded.length === 0) {return null;}
    const totalUnlocked = loaded.reduce((s, c) => s + c.unlocked, 0);
    const totalPossible = loaded.reduce((s, c) => s + c.total, 0);
    return totalPossible > 0 ? Math.round((totalUnlocked / totalPossible) * 100) : 0;
  }, [mountCount, gliderCount, titleCount, emoteCount, mountLoading, glidersLoading, titlesLoading, emotesLoading, mountError, glidersError, titlesError, emotesError]);

  const anyLoading = mountLoading || glidersLoading || titlesLoading || emotesLoading;

  // ── No API key guard ────────────────────────────────────────────────────────
  if (!settings.apiKey) {
    return (
      <View style={styles.center}>
        <Card style={styles.noKeyCard} padded>
          <Text style={styles.noKeyTitle}>No API Key Set</Text>
          <Text style={styles.noKeyText}>
            Go to Settings to enter your GW2 API key and unlock collection tracking.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Header summary card ─────────────────────────────────────────────── */}
      <Card style={styles.headerCard} padded>
        <Text style={styles.headerLabel}>YOUR COLLECTION</Text>
        {anyLoading && overallPct === null ? (
          <ActivityIndicator size="large" color={colors.gold} style={styles.headerLoader} />
        ) : (
          <>
            <View style={styles.headerPctRow}>
              <Text style={styles.headerPct}>
                {overallPct !== null ? `${overallPct}%` : '—'}
              </Text>
              <Text style={styles.headerPctSub}>overall completion</Text>
            </View>
            <ProgressBar value={mountCount + gliderCount + titleCount + emoteCount} max={TOTAL_MOUNT_SKINS + TOTAL_GLIDERS + TOTAL_TITLES + TOTAL_EMOTES} color={colors.gold} />
            <View style={styles.headerStatsRow}>
              <View style={styles.headerStat}>
                <Text style={styles.headerStatNum}>{mountCount}</Text>
                <Text style={styles.headerStatLbl}>Mounts</Text>
              </View>
              <View style={styles.headerStatDivider} />
              <View style={styles.headerStat}>
                <Text style={styles.headerStatNum}>{gliderCount}</Text>
                <Text style={styles.headerStatLbl}>Gliders</Text>
              </View>
              <View style={styles.headerStatDivider} />
              <View style={styles.headerStat}>
                <Text style={styles.headerStatNum}>{titleCount}</Text>
                <Text style={styles.headerStatLbl}>Titles</Text>
              </View>
              <View style={styles.headerStatDivider} />
              <View style={styles.headerStat}>
                <Text style={styles.headerStatNum}>{emoteCount}</Text>
                <Text style={styles.headerStatLbl}>Emotes</Text>
              </View>
            </View>
            <APSummary data={achievements} isLoading={apLoading} />
          </>
        )}
      </Card>

      {/* ── Collection cards ────────────────────────────────────────────────── */}
      <CollectionCard
        emoji="🐴"
        title="Mount Skins"
        unlocked={mountCount}
        total={TOTAL_MOUNT_SKINS}
        ids={mountSkins ?? []}
        color={colors.gold}
        isLoading={mountLoading}
        isError={mountError}
        onRetry={() => refetchMounts()}
      />

      <CollectionCard
        emoji="🪁"
        title="Gliders"
        unlocked={gliderCount}
        total={TOTAL_GLIDERS}
        ids={gliders ?? []}
        color={colors.blue}
        isLoading={glidersLoading}
        isError={glidersError}
        onRetry={() => refetchGliders()}
      />

      <CollectionCard
        emoji="👑"
        title="Titles"
        unlocked={titleCount}
        total={TOTAL_TITLES}
        ids={titles ?? []}
        color="#c8972b"
        isLoading={titlesLoading}
        isError={titlesError}
        onRetry={() => refetchTitles()}
      />

      <CollectionCard
        emoji="🎭"
        title="Emotes"
        unlocked={emoteCount}
        total={TOTAL_EMOTES}
        ids={emotes ?? []}
        color={colors.green}
        isLoading={emotesLoading}
        isError={emotesError}
        onRetry={() => refetchEmotes()}
      />

      {/* ── Mount skins grid ─────────────────────────────────────────────────── */}
      <Card style={styles.mountGridCard} padded>
        <Text style={styles.sectionTitle}>🐴 Mount Skins — Recent Unlocks</Text>
        <Text style={styles.gridSubtitle}>
          Your {Math.min(mountCount, MOUNT_GRID_COUNT)} most recent unlocks (by ID)
        </Text>
        {mountLoading ? (
          <ActivityIndicator color={colors.gold} style={styles.loader} />
        ) : mountError ? (
          <View style={styles.errorRow}>
            <Text style={styles.errorText}>Could not load mount skin data.</Text>
            <TouchableOpacity onPress={() => refetchMounts()} style={styles.retryBtn}>
              <Text style={styles.retryTxt}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <MountSkinGrid unlockedIds={mountSkins ?? []} />
            <Text style={styles.mountGridCount}>
              {mountCount} unlocked · ~{TOTAL_MOUNT_SKINS} estimated total
            </Text>
          </>
        )}
      </Card>

      {/* ── Footer note ─────────────────────────────────────────────────────── */}
      <Text style={styles.footerNote}>
        Counts are based on current API data. Some categories may show partial results.
      </Text>

    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },

  // No API key
  noKeyCard: {
    maxWidth: 320,
  },
  noKeyTitle: {
    fontSize: fontSize.lg,
    color: colors.gold,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  noKeyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },

  // Header summary card
  headerCard: {
    marginBottom: spacing.md,
  },
  headerLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  headerLoader: {
    marginVertical: spacing.lg,
  },
  headerPctRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerPct: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.gold,
  },
  headerPctSub: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  headerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  headerStat: {
    flex: 1,
    alignItems: 'center',
  },
  headerStatNum: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  headerStatLbl: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },

  // AP row inside header
  apRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  apLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  apValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.gold,
  },

  // Progress bar
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Collection cards
  collectionCard: {
    marginBottom: spacing.md,
  },
  collectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  collectionEmoji: {
    fontSize: 20,
  },
  collectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  cardLoader: {
    marginLeft: spacing.xs,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginBottom: 2,
  },
  countNumber: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  countLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  countOf: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    flex: 1,
  },
  pctBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  pctText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },

  // Unlock dots strip
  dotsScroll: {
    marginTop: spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  dotsMore: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: 4,
  },

  // Mount skins grid card
  mountGridCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  gridSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  loader: {
    marginVertical: spacing.md,
  },
  mountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.xs,
  },
  mountBox: {
    width: 18,
    height: 18,
    borderRadius: radius.sm,
  },
  mountBoxUnlocked: {
    backgroundColor: colors.gold,
  },
  mountBoxLocked: {
    backgroundColor: colors.border,
  },
  mountGridCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  // Error state
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
    flex: 1,
  },
  retryBtn: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  retryTxt: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },

  // Footer
  footerNote: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
});
