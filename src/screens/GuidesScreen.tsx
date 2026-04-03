import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SectionList,
} from 'react-native';
import {GUIDES, GUIDE_CATEGORIES, Guide, GuideCategory} from '../constants/guides';
import {colors, fontSize, spacing, radius} from '../constants/theme';

const DIFFICULTY_COLORS = {
  beginner:     '#4caf50',
  intermediate: '#ff9800',
  advanced:     '#f44336',
};
const DIFFICULTY_LABELS = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};
const DIFFICULTY_ICONS = {
  beginner:     '🌱',
  intermediate: '⚡',
  advanced:     '💀',
};

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | null;

interface Section {
  category: GuideCategory;
  data: Guide[];
}

export default function GuidesScreen({navigation}: any) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>(null);

  const isFiltered = search.trim().length > 0 || activeCategory !== null || activeDifficulty !== null;

  const filtered = useMemo(() => {
    let result = GUIDES;
    if (activeCategory) result = result.filter(g => g.categoryId === activeCategory);
    if (activeDifficulty) result = result.filter(g => g.difficulty === activeDifficulty);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        g =>
          g.title.toLowerCase().includes(q) ||
          g.summary.toLowerCase().includes(q) ||
          g.categoryId.toLowerCase().includes(q),
      );
    }
    return result;
  }, [search, activeCategory, activeDifficulty]);

  const sections = useMemo<Section[]>(() => {
    if (isFiltered) return [];
    return GUIDE_CATEGORIES
      .map(cat => ({
        category: cat,
        data: GUIDES.filter(g => g.categoryId === cat.id),
      }))
      .filter(s => s.data.length > 0);
  }, [isFiltered]);

  const navigate = useCallback(
    (id: string) => navigation.push('GuideDetail', {guideId: id}),
    [navigation],
  );

  const renderCard = useCallback(
    ({item}: {item: Guide}) => <GuideCard guide={item} onPress={navigate} />,
    [navigate],
  );

  const renderSectionHeader = useCallback(
    ({section}: {section: Section}) => (
      <View style={[styles.sectionHeader, {borderLeftColor: section.category.color}]}>
        <Text style={styles.sectionHeaderIcon}>{section.category.icon}</Text>
        <Text style={[styles.sectionHeaderLabel, {color: section.category.color}]}>
          {section.category.label}
        </Text>
        <View style={[styles.sectionCountBadge, {backgroundColor: section.category.color + '22', borderColor: section.category.color + '55'}]}>
          <Text style={[styles.sectionCount, {color: section.category.color}]}>{section.data.length}</Text>
        </View>
      </View>
    ),
    [],
  );

  const clearAll = () => {
    setSearch('');
    setActiveCategory(null);
    setActiveDifficulty(null);
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search guides..."
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn} hitSlop={{top:8,bottom:8,left:8,right:8}}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catBar}
        contentContainerStyle={styles.catBarContent}>
        <CategoryChip
          label="All"
          icon="📚"
          color={colors.gold}
          count={GUIDES.length}
          active={!activeCategory}
          onPress={() => setActiveCategory(null)}
        />
        {GUIDE_CATEGORIES.map(cat => {
          const count = GUIDES.filter(g => g.categoryId === cat.id).length;
          return (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              color={cat.color}
              count={count}
              active={activeCategory === cat.id}
              onPress={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            />
          );
        })}
      </ScrollView>

      {/* Difficulty filter */}
      <View style={styles.diffRow}>
        <Text style={styles.diffLabel}>Level:</Text>
        {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
          <TouchableOpacity
            key={d!}
            style={[
              styles.diffChip,
              activeDifficulty === d && {
                backgroundColor: DIFFICULTY_COLORS[d!] + '22',
                borderColor: DIFFICULTY_COLORS[d!],
              },
            ]}
            onPress={() => setActiveDifficulty(activeDifficulty === d ? null : d)}>
            <Text style={[
              styles.diffChipText,
              activeDifficulty === d && {color: DIFFICULTY_COLORS[d!]},
            ]}>
              {DIFFICULTY_ICONS[d!]} {DIFFICULTY_LABELS[d!]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results bar */}
      {isFiltered && (
        <View style={styles.resultsRow}>
          <Text style={styles.resultsText}>
            {filtered.length} guide{filtered.length !== 1 ? 's' : ''} found
          </Text>
          <TouchableOpacity onPress={clearAll} style={styles.clearFiltersBtn}>
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Guide list — grouped when unfiltered, flat when filtered */}
      {isFiltered ? (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState />}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={renderCard}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CategoryChip({
  label, icon, color, count, active, onPress,
}: {
  label: string; icon: string; color: string; count: number;
  active: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.catChip,
        active && {backgroundColor: color + '22', borderColor: color},
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.catChipText, active && {color}]}>
        {icon}
        {active ? ` ${label}` : ''}
      </Text>
      {active && (
        <View style={[styles.catCountBadge, {backgroundColor: color}]}>
          <Text style={styles.catCountText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function GuideCard({guide, onPress}: {guide: Guide; onPress: (id: string) => void}) {
  const cat = GUIDE_CATEGORIES.find(c => c.id === guide.categoryId);
  const diffColor = DIFFICULTY_COLORS[guide.difficulty];
  return (
    <TouchableOpacity
      style={[styles.card, {borderLeftColor: cat?.color ?? colors.border}]}
      activeOpacity={0.75}
      onPress={() => onPress(guide.id)}>
      <View style={styles.cardInner}>
        {/* Icon */}
        <View style={[styles.cardIconWrap, {backgroundColor: (cat?.color ?? colors.gold) + '18'}]}>
          <Text style={styles.cardIcon}>{guide.icon}</Text>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          {cat && (
            <Text style={[styles.cardCategory, {color: cat.color}]}>
              {cat.label}
            </Text>
          )}
          <Text style={styles.cardTitle} numberOfLines={2}>{guide.title}</Text>
          <Text style={styles.cardSummary} numberOfLines={2}>{guide.summary}</Text>

          <View style={styles.cardFooter}>
            <View style={[styles.diffBadge, {backgroundColor: diffColor + '20', borderColor: diffColor + '60'}]}>
              <Text style={[styles.diffText, {color: diffColor}]}>
                {DIFFICULTY_ICONS[guide.difficulty]} {DIFFICULTY_LABELS[guide.difficulty]}
              </Text>
            </View>
            <Text style={styles.readTime}>{guide.readTime} min</Text>
          </View>
        </View>

        {/* Arrow */}
        <Text style={styles.cardArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>No guides found</Text>
      <Text style={styles.emptySubText}>Try a different search or remove filters</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  searchIcon: {fontSize: 16, marginRight: spacing.xs, opacity: 0.6},
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    paddingVertical: 0,
  },
  clearBtn: {padding: spacing.xs},
  clearBtnText: {color: colors.textMuted, fontSize: fontSize.sm},

  // Category bar
  catBar: {flexGrow: 0, flexShrink: 0},
  catBarContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  catChipText: {color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600'},
  catCountBadge: {
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  catCountText: {color: '#000', fontSize: 10, fontWeight: '800'},

  // Difficulty filter
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  diffLabel: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', marginRight: 2},
  diffChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  diffChipText: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600'},

  // Results bar
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultsText: {color: colors.textMuted, fontSize: fontSize.xs},
  clearFiltersBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold + '55',
  },
  clearFiltersText: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},

  // List
  list: {paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.xs},

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    borderLeftWidth: 3,
    paddingLeft: spacing.sm,
  },
  sectionHeaderIcon: {fontSize: 16},
  sectionHeaderLabel: {fontSize: fontSize.md, fontWeight: '800', flex: 1, letterSpacing: 0.3},
  sectionCountBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
  },
  sectionCount: {fontSize: fontSize.xs, fontWeight: '800'},

  // Guide card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {fontSize: 24},
  cardBody: {flex: 1, gap: 2},
  cardCategory: {fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5},
  cardTitle: {color: colors.text, fontSize: fontSize.md, fontWeight: '700', lineHeight: 20},
  cardSummary: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 16, marginTop: 1},
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  diffText: {fontSize: 10, fontWeight: '700'},
  readTime: {color: colors.textMuted, fontSize: 10},
  cardArrow: {color: colors.textMuted, fontSize: 20, flexShrink: 0, paddingLeft: spacing.xs},

  // Empty state
  empty: {alignItems: 'center', paddingVertical: spacing.xl * 2},
  emptyIcon: {fontSize: 40, marginBottom: spacing.md, opacity: 0.4},
  emptyText: {color: colors.text, fontSize: fontSize.md, fontWeight: '700'},
  emptySubText: {color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs},
});
