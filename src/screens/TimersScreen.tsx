import React, {useState} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {useTimers, BossTimer} from '../hooks/useTimers';
import {EXPANSION_LABELS, MetaCategory} from '../constants/worldBosses';
import {MetaStage} from '../types';
import {colors, fontSize, spacing, radius} from '../constants/theme';

type Tab = 'bosses' | 'meta';

const STAGE_COLORS = {
  preparation: colors.textMuted,
  event: colors.blue,
  boss: colors.red,
  reward: colors.gold,
};

function StageBar({
  stages,
  secondsInto,
}: {
  stages: MetaStage[];
  secondsInto: number;
}) {
  const totalDuration = stages.reduce((s, stage) => s + stage.duration, 0);
  let elapsed = 0;
  let currentStageIndex = 0;
  let secondsIntoStage = secondsInto;

  for (let i = 0; i < stages.length; i++) {
    if (secondsIntoStage < stages[i].duration * 60) {
      currentStageIndex = i;
      break;
    }
    secondsIntoStage -= stages[i].duration * 60;
    elapsed += stages[i].duration;
  }

  const currentStage = stages[currentStageIndex];
  const stageProgress = currentStage
    ? (secondsIntoStage / (currentStage.duration * 60)) * 100
    : 0;
  const minsLeft = currentStage
    ? Math.ceil((currentStage.duration * 60 - secondsIntoStage) / 60)
    : 0;

  return (
    <View style={stageStyles.container}>
      <View style={stageStyles.bar}>
        {stages.map((stage, i) => (
          <View
            key={i}
            style={[
              stageStyles.segment,
              {
                flex: stage.duration,
                backgroundColor:
                  i < currentStageIndex
                    ? STAGE_COLORS[stage.type] + '44'
                    : i === currentStageIndex
                    ? STAGE_COLORS[stage.type]
                    : colors.border,
              },
            ]}
          />
        ))}
      </View>
      <View style={stageStyles.info}>
        <Text
          style={[
            stageStyles.stageName,
            {color: STAGE_COLORS[currentStage?.type ?? 'preparation']},
          ]}>
          {currentStage?.name ?? ''}
        </Text>
        <Text style={stageStyles.stageTime}>{minsLeft}m left</Text>
      </View>
      <View style={stageStyles.stages}>
        {stages.map((stage, i) => (
          <View
            key={i}
            style={[
              stageStyles.stageChip,
              i === currentStageIndex && {
                borderColor: STAGE_COLORS[stage.type],
                backgroundColor: STAGE_COLORS[stage.type] + '22',
              },
            ]}>
            <Text
              style={[
                stageStyles.stageChipText,
                {
                  color:
                    i === currentStageIndex
                      ? STAGE_COLORS[stage.type]
                      : colors.textMuted,
                },
              ]}>
              {stage.name} ({stage.duration}m)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function BossRow({timer, onPress}: {timer: BossTimer; onPress: () => void}) {
  const urgency =
    !timer.isActive && timer.secondsUntil <= 300
      ? 'urgent'
      : !timer.isActive && timer.secondsUntil <= 900
      ? 'soon'
      : 'normal';

  const accentColor = timer.isActive
    ? colors.green
    : urgency === 'urgent'
    ? colors.red
    : urgency === 'soon'
    ? colors.gold
    : colors.border;

  const timeColor = timer.isActive
    ? colors.green
    : urgency === 'urgent'
    ? colors.red
    : urgency === 'soon'
    ? colors.gold
    : colors.textMuted;

  return (
    <TouchableOpacity
      style={[styles.row, {borderLeftColor: accentColor}]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.rowLeft}>
        <Text style={styles.bossName}>{timer.boss.name}</Text>
        <Text style={styles.mapName}>{timer.boss.mapName}</Text>
        <Text style={styles.timeRange}>
          {timer.startTime} – {timer.endTime}
        </Text>
        {timer.isActive && (timer.boss as any).stages && (
          <Text style={styles.stageHint}>Tap to see stages</Text>
        )}
      </View>
      <View style={styles.rowRight}>
        {timer.isActive ? (
          <View style={styles.activeContainer}>
            <View style={styles.activeDot} />
            <View>
              <Text style={styles.activeLabel}>ACTIVE</Text>
              <Text style={[styles.countdown, {color: colors.green}]}>
                {Math.floor(timer.secondsRemaining / 60)}:
                {(timer.secondsRemaining % 60).toString().padStart(2, '0')} left
              </Text>
            </View>
          </View>
        ) : (
          <Text style={[styles.countdown, {color: timeColor}]}>
            {timer.countdown}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function MetaDetailModal({
  timer,
  onClose,
}: {
  timer: BossTimer | null;
  onClose: () => void;
}) {
  if (!timer) return null;
  const stages = (timer.boss as any).stages as MetaStage[] | undefined;
  const secondsInto = timer.isActive
    ? timer.boss.duration * 60 - timer.secondsRemaining
    : 0;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.header}>
            <View>
              <Text style={modalStyles.title}>{timer.boss.name}</Text>
              <Text style={modalStyles.map}>{timer.boss.mapName}</Text>
            </View>
            {timer.isActive ? (
              <View style={modalStyles.activePill}>
                <Text style={modalStyles.activePillText}>ACTIVE</Text>
              </View>
            ) : (
              <Text style={modalStyles.countdown}>{timer.countdown}</Text>
            )}
          </View>

          {timer.isActive && stages && (
            <StageBar stages={stages} secondsInto={secondsInto} />
          )}

          {stages && !timer.isActive && (
            <View style={modalStyles.stageList}>
              <Text style={modalStyles.stageListTitle}>Stages</Text>
              {stages.map((stage, i) => (
                <View key={i} style={modalStyles.stageItem}>
                  <View
                    style={[
                      modalStyles.stageDot,
                      {backgroundColor: STAGE_COLORS[stage.type]},
                    ]}
                  />
                  <Text style={modalStyles.stageName}>{stage.name}</Text>
                  <Text style={modalStyles.stageDur}>{stage.duration}m</Text>
                </View>
              ))}
            </View>
          )}

          {(timer.boss as any).waypoint && (
            <View style={modalStyles.waypoint}>
              <Text style={modalStyles.waypointLabel}>Waypoint</Text>
              <Text style={modalStyles.waypointCode}>
                {(timer.boss as any).waypoint}
              </Text>
            </View>
          )}

          <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
            <Text style={modalStyles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function TimersScreen() {
  const [tab, setTab] = useState<Tab>('bosses');
  const [expandFilter, setExpandFilter] = useState<MetaCategory | 'all'>('all');
  const [selectedTimer, setSelectedTimer] = useState<BossTimer | null>(null);

  const allTimers = useTimers('all');
  const bossTimers = allTimers.filter(t => t.type === 'boss');
  const metaTimers = allTimers.filter(t => t.type === 'meta');

  const filteredMeta =
    expandFilter === 'all'
      ? metaTimers
      : metaTimers.filter(t => t.category === expandFilter);

  const activeBosses = bossTimers.filter(t => t.isActive);
  const upcomingBosses = bossTimers.filter(t => !t.isActive);
  const activeMetas = filteredMeta.filter(t => t.isActive);
  const upcomingMetas = filteredMeta.filter(t => !t.isActive);

  const bossSections = [
    ...(activeBosses.length > 0
      ? [{title: '🟢 Active', data: activeBosses}]
      : []),
    {title: '⏱ Upcoming', data: upcomingBosses},
  ];

  // Group upcoming metas by expansion
  const metaByExpansion = new Map<string, BossTimer[]>();
  for (const timer of upcomingMetas) {
    const cat = timer.category ?? 'core';
    if (!metaByExpansion.has(cat)) metaByExpansion.set(cat, []);
    metaByExpansion.get(cat)!.push(timer);
  }

  const metaSections = [
    ...(activeMetas.length > 0
      ? [{title: '🟢 Active', data: activeMetas}]
      : []),
    ...Array.from(metaByExpansion.entries()).map(([cat, data]) => ({
      title: EXPANSION_LABELS[cat] ?? cat,
      data,
    })),
  ];

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, tab === 'bosses' && styles.tabActive]}
          onPress={() => setTab('bosses')}>
          <Text
            style={[styles.tabText, tab === 'bosses' && styles.tabTextActive]}>
            🐉 World Bosses
          </Text>
          {activeBosses.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeBosses.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'meta' && styles.tabActive]}
          onPress={() => setTab('meta')}>
          <Text
            style={[styles.tabText, tab === 'meta' && styles.tabTextActive]}>
            🗺 Meta Events
          </Text>
          {activeMetas.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeMetas.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Meta expansion filter */}
      {tab === 'meta' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
          contentContainerStyle={styles.filterBarContent}>
          {(
            [
              'all',
              'core',
              'ls1',
              'ls2',
              'ls3',
              'ls4',
              'ls5',
              'hot',
              'pof',
              'eod',
              'soto',
              'janthir',
            ] as const
          ).map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                expandFilter === cat && styles.filterChipActive,
              ]}
              onPress={() => setExpandFilter(cat)}>
              <Text
                style={[
                  styles.filterChipText,
                  expandFilter === cat && styles.filterChipTextActive,
                ]}>
                {cat === 'all' ? 'All' : EXPANSION_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <SectionList
        sections={tab === 'bosses' ? bossSections : metaSections}
        keyExtractor={(item, index) => `${item.boss.id}_${index}`}
        renderItem={({item}) => (
          <BossRow timer={item} onPress={() => setSelectedTimer(item)} />
        )}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
      />

      <MetaDetailModal
        timer={selectedTimer}
        onClose={() => setSelectedTimer(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000',
  },
  badge: {
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  filterBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 60,
  },
  filterBarContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    height: 36,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.gold + '33',
    borderColor: colors.gold,
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.gold,
  },
  list: {
    padding: spacing.md,
  },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  bossName: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  mapName: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  timeRange: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  stageHint: {
    color: colors.gold,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  activeLabel: {
    color: colors.green,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  countdown: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});

const stageStyles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  segment: {
    height: '100%',
    borderRadius: 2,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  stageTime: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  stages: {
    gap: 4,
  },
  stageChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  stageChipText: {
    fontSize: fontSize.xs,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  map: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  activePill: {
    backgroundColor: colors.green + '22',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  activePillText: {
    color: colors.green,
    fontSize: fontSize.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  countdown: {
    color: colors.gold,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  stageList: {
    gap: spacing.sm,
  },
  stageListTitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageName: {
    color: colors.text,
    fontSize: fontSize.sm,
    flex: 1,
  },
  stageDur: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  waypoint: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 4,
  },
  waypointLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  waypointCode: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  closeBtn: {
    backgroundColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  closeBtnText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
