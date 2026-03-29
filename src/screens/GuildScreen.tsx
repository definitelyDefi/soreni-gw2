import React, {useState, useMemo} from 'react';
import {
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  useAccount,
  useGuild,
  useGuildTreasury,
  useGuildLog,
  useGuildMembers,
  useItems,
} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/ui/ErrorMessage';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import {GuildLogEntry} from '../api/guild';

type GuildTab = 'overview' | 'treasury' | 'log' | 'members';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function logTypeIcon(type: string): string {
  switch (type) {
    case 'joined': return '👋';
    case 'invited': return '📨';
    case 'kick': return '🚫';
    case 'rank_change': return '🔺';
    case 'treasury': return '💎';
    case 'stash': return '📦';
    case 'motd': return '📝';
    case 'upgrade': return '⚒️';
    default: return '📋';
  }
}

function logDescription(entry: GuildLogEntry): string {
  switch (entry.type) {
    case 'joined':
      return `${entry.user} joined the guild`;
    case 'invited':
      return `${entry.invited_by} invited ${entry.user}`;
    case 'kick':
      return `${entry.kicked_by} kicked ${entry.user}`;
    case 'rank_change':
      return `${entry.changed_by} changed ${entry.user}: ${entry.old_rank} → ${entry.new_rank}`;
    case 'treasury':
      return `${entry.user} deposited ${entry.count}× item #${entry.item_id}`;
    case 'stash': {
      const op = entry.operation === 'deposit' ? 'deposited' : 'withdrew';
      if (entry.item_id) return `${entry.user} ${op} ${entry.count}× item #${entry.item_id}`;
      if (entry.coins) return `${entry.user} ${op} ${(entry.coins / 10000).toFixed(2)}g`;
      return `${entry.user} accessed stash`;
    }
    case 'motd':
      return `${entry.user} updated MOTD`;
    case 'upgrade':
      return `${entry.user} interacted with upgrade #${entry.upgrade_id}`;
    default:
      return `${entry.user ?? 'Unknown'} — ${entry.type}`;
  }
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({guildId}: {guildId: string}) {
  const {data: guild, isLoading, error, refetch} = useGuild(guildId);

  if (isLoading) return <ActivityIndicator color={colors.gold} style={styles.loader} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!guild) return null;

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Header */}
      <Card style={styles.card} padded>
        <View style={styles.guildHeader}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>[{guild.tag}]</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.guildName}>{guild.name}</Text>
            {guild.level !== undefined && (
              <Text style={styles.guildLevel}>Guild Level {guild.level}</Text>
            )}
          </View>
        </View>
        {guild.motd ? (
          <View style={styles.motdBox}>
            <Text style={styles.motdLabel}>Message of the Day</Text>
            <Text style={styles.motdText}>{guild.motd}</Text>
          </View>
        ) : null}
      </Card>

      {/* Stats */}
      <Card style={styles.card} padded>
        <Text style={styles.cardTitle}>Stats</Text>
        {guild.member_count !== undefined && (
          <StatRow label="Members" value={`${guild.member_count}${guild.member_capacity ? `/${guild.member_capacity}` : ''}`} />
        )}
        {guild.influence !== undefined && (
          <StatRow label="Influence" value={guild.influence.toLocaleString()} />
        )}
        {guild.aetherium !== undefined && (
          <StatRow label="Aetherium" value={guild.aetherium.toLocaleString()} />
        )}
        {guild.favor !== undefined && (
          <StatRow label="Favor" value={guild.favor.toLocaleString()} />
        )}
      </Card>
    </ScrollView>
  );
}

function StatRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// ─── Treasury Tab ─────────────────────────────────────────────────────────────

function TreasuryTab({guildId}: {guildId: string}) {
  const {data: treasury, isLoading, error, refetch} = useGuildTreasury(guildId);

  const itemIds = useMemo(() => treasury?.map(t => t.item_id) ?? [], [treasury]);
  const {data: itemDefs} = useItems(itemIds);
  const itemMap = useMemo(() => {
    const m = new Map<number, any>();
    itemDefs?.forEach(i => m.set(i.id, i));
    return m;
  }, [itemDefs]);

  if (isLoading) return <ActivityIndicator color={colors.gold} style={styles.loader} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!treasury || treasury.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Treasury is empty.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={treasury}
      keyExtractor={t => String(t.item_id)}
      contentContainerStyle={styles.tabContent}
      renderItem={({item}) => {
        const def = itemMap.get(item.item_id);
        const needed = item.needed_by.reduce((s, n) => s + n.count, 0);
        const pct = needed > 0 ? Math.min(1, item.count / needed) : 1;
        return (
          <Card style={styles.treasuryCard} padded>
            <View style={styles.treasuryRow}>
              <View style={{flex: 1}}>
                <Text style={styles.treasuryName} numberOfLines={1}>
                  {def?.name ?? `Item #${item.item_id}`}
                </Text>
                <Text style={styles.treasurySub}>
                  {item.count.toLocaleString()} / {needed.toLocaleString()} needed
                </Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, {width: `${pct * 100}%` as any, backgroundColor: pct >= 1 ? colors.green : colors.gold}]} />
                </View>
              </View>
              <View style={styles.treasuryCount}>
                <Text style={[styles.treasuryCountNum, {color: pct >= 1 ? colors.green : colors.text}]}>
                  {item.count.toLocaleString()}
                </Text>
                {pct >= 1 && <Text style={styles.doneCheck}>✓</Text>}
              </View>
            </View>
            {item.needed_by.length > 0 && (
              <Text style={styles.treasuryNeeds}>
                Needed by: {item.needed_by.map(n => `upgrade #${n.upgrade_id} (×${n.count})`).join(', ')}
              </Text>
            )}
          </Card>
        );
      }}
    />
  );
}

// ─── Log Tab ──────────────────────────────────────────────────────────────────

function LogTab({guildId}: {guildId: string}) {
  const {data: log, isLoading, error, refetch} = useGuildLog(guildId);

  if (isLoading) return <ActivityIndicator color={colors.gold} style={styles.loader} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!log || log.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No log entries.</Text>
      </View>
    );
  }

  const sorted = [...log].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <FlatList
      data={sorted}
      keyExtractor={e => String(e.id)}
      contentContainerStyle={styles.tabContent}
      renderItem={({item}) => (
        <View style={styles.logEntry}>
          <Text style={styles.logIcon}>{logTypeIcon(item.type)}</Text>
          <View style={{flex: 1}}>
            <Text style={styles.logDesc} numberOfLines={2}>{logDescription(item)}</Text>
            <Text style={styles.logTime}>{formatDate(item.time)}</Text>
          </View>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.logSep} />}
    />
  );
}

// ─── Members Tab ──────────────────────────────────────────────────────────────

function MembersTab({guildId}: {guildId: string}) {
  const {data: members, isLoading, error, refetch} = useGuildMembers(guildId);
  const [sortBy, setSortBy] = useState<'name' | 'rank' | 'joined'>('joined');

  const sorted = useMemo(() => {
    if (!members) return [];
    return [...members].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rank') return a.rank.localeCompare(b.rank);
      return new Date(b.joined).getTime() - new Date(a.joined).getTime();
    });
  }, [members, sortBy]);

  if (isLoading) return <ActivityIndicator color={colors.gold} style={styles.loader} />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  return (
    <View style={{flex: 1}}>
      <View style={styles.sortBar}>
        {(['name', 'rank', 'joined'] as const).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
            onPress={() => setSortBy(s)}>
            <Text style={[styles.sortBtnText, sortBy === s && styles.sortBtnTextActive]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.memberCount}>{members?.length ?? 0} members</Text>
      </View>
      <FlatList
        data={sorted}
        keyExtractor={m => m.name}
        contentContainerStyle={styles.tabContent}
        renderItem={({item}) => (
          <View style={styles.memberRow}>
            <View style={{flex: 1}}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRank}>{item.rank}</Text>
            </View>
            <Text style={styles.memberJoined}>
              {new Date(item.joined).toLocaleDateString(undefined, {month: 'short', year: 'numeric'})}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.logSep} />}
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function GuildScreen() {
  const {settings} = useAppStore();
  const [tab, setTab] = useState<GuildTab>('overview');
  const {data: account, isLoading: acctLoading} = useAccount();
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);

  const guildIds = account?.guilds ?? [];
  const activeGuildId = selectedGuildId ?? guildIds[0] ?? null;

  const TABS: {id: GuildTab; label: string}[] = [
    {id: 'overview', label: '🏰 Info'},
    {id: 'treasury', label: '💎 Treasury'},
    {id: 'log', label: '📋 Log'},
    {id: 'members', label: '👥 Members'},
  ];

  if (!settings.apiKey) {
    return (
      <View style={styles.center}>
        <Card style={styles.noKeyCard} padded>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyText}>Go to Settings to enter your GW2 API key.</Text>
        </Card>
      </View>
    );
  }

  if (acctLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  if (!guildIds.length) {
    return (
      <View style={styles.center}>
        <Card style={styles.noKeyCard} padded>
          <Text style={styles.noKeyTitle}>⚜️ No Guilds</Text>
          <Text style={styles.noKeyText}>Your account is not a member of any guild.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Guild selector (if multiple guilds) */}
      {guildIds.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.guildSelectorWrap} contentContainerStyle={styles.guildSelectorContent}>
          {guildIds.map(id => (
            <TouchableOpacity
              key={id}
              style={[styles.guildChip, activeGuildId === id && styles.guildChipActive]}
              onPress={() => setSelectedGuildId(id)}>
              <GuildChipLabel guildId={id} active={activeGuildId === id} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}
            onPress={() => setTab(t.id)}>
            <Text style={[styles.tabBtnText, tab === t.id && styles.tabBtnTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeGuildId ? (
        <>
          {tab === 'overview' && <OverviewTab guildId={activeGuildId} />}
          {tab === 'treasury' && <TreasuryTab guildId={activeGuildId} />}
          {tab === 'log' && <LogTab guildId={activeGuildId} />}
          {tab === 'members' && <MembersTab guildId={activeGuildId} />}
        </>
      ) : null}
    </View>
  );
}

function GuildChipLabel({guildId, active}: {guildId: string; active: boolean}) {
  const {data: guild} = useGuild(guildId);
  return (
    <Text style={[styles.guildChipText, active && styles.guildChipTextActive]}>
      {guild ? `[${guild.tag}] ${guild.name}` : guildId.slice(0, 8) + '…'}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  center: {flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: spacing.md},
  noKeyCard: {maxWidth: 320},
  noKeyTitle: {fontSize: fontSize.lg, color: colors.gold, fontWeight: '700', marginBottom: spacing.sm},
  noKeyText: {fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20},
  loader: {marginVertical: spacing.xl},
  emptyWrap: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl},
  emptyText: {color: colors.textMuted, fontSize: fontSize.sm},

  // Guild selector
  guildSelectorWrap: {maxHeight: 48, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border},
  guildSelectorContent: {padding: spacing.sm, gap: spacing.sm},
  guildChip: {paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border},
  guildChipActive: {borderColor: colors.gold, backgroundColor: colors.gold + '22'},
  guildChipText: {fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600'},
  guildChipTextActive: {color: colors.gold},

  // Tab bar
  tabBar: {flexDirection: 'row', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.sm, paddingTop: spacing.sm, gap: 2},
  tabBtn: {flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1},
  tabBtnActive: {borderBottomColor: colors.gold},
  tabBtnText: {fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600'},
  tabBtnTextActive: {color: colors.gold},

  // Content
  tabContent: {padding: spacing.md},
  card: {marginBottom: spacing.md},
  cardTitle: {fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},

  // Guild overview
  guildHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md},
  tagBadge: {backgroundColor: colors.gold + '22', borderWidth: 1, borderColor: colors.gold, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  tagText: {color: colors.gold, fontSize: fontSize.lg, fontWeight: '700'},
  guildName: {fontSize: fontSize.lg, color: colors.text, fontWeight: '700'},
  guildLevel: {fontSize: fontSize.sm, color: colors.textMuted},
  motdBox: {borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm},
  motdLabel: {fontSize: fontSize.xs, color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5},
  motdText: {fontSize: fontSize.sm, color: colors.text, lineHeight: 20},

  // Stat rows
  statRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border},
  statLabel: {fontSize: fontSize.sm, color: colors.textMuted},
  statValue: {fontSize: fontSize.sm, color: colors.text, fontWeight: '600'},

  // Treasury
  treasuryCard: {marginBottom: spacing.sm},
  treasuryRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  treasuryName: {fontSize: fontSize.sm, color: colors.text, fontWeight: '600'},
  treasurySub: {fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2},
  treasuryCount: {alignItems: 'flex-end'},
  treasuryCountNum: {fontSize: fontSize.md, fontWeight: '700'},
  doneCheck: {fontSize: fontSize.sm, color: colors.green},
  treasuryNeeds: {fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4},
  progressTrack: {height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden', marginTop: 4},
  progressFill: {height: '100%', borderRadius: 2},

  // Log
  logEntry: {flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  logIcon: {fontSize: 18},
  logDesc: {fontSize: fontSize.sm, color: colors.text, lineHeight: 20},
  logTime: {fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2},
  logSep: {height: 1, backgroundColor: colors.border},

  // Members
  sortBar: {flexDirection: 'row', backgroundColor: colors.surface, padding: spacing.sm, gap: spacing.sm, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border},
  sortBtn: {paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border},
  sortBtnActive: {borderColor: colors.gold, backgroundColor: colors.gold + '22'},
  sortBtnText: {fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '600'},
  sortBtnTextActive: {color: colors.gold},
  memberCount: {flex: 1, textAlign: 'right', fontSize: fontSize.xs, color: colors.textMuted},
  memberRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  memberName: {fontSize: fontSize.sm, color: colors.text, fontWeight: '600'},
  memberRank: {fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2},
  memberJoined: {fontSize: fontSize.xs, color: colors.textMuted},
});
