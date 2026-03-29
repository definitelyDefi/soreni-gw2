import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  useMaps,
  useAchievementCategories,
  useAccountAchievements,
  useContinentMapDetail,
  useAchievementDefs,
} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/ui/ErrorMessage';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import type {
  GW2MapBasic,
  MapObjective,
  AccountAchievement,
  AchievementDef,
} from '../api/maps';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;
const MARKER = 11; // marker diameter in dp

// ─── Objective metadata ───────────────────────────────────────────────────────

type ObjFilter = 'all' | 'waypoint' | 'poi' | 'vista' | 'task' | 'hero';

const OBJ_COLOR: Record<string, string> = {
  waypoint: '#2196F3',
  poi: '#FFA726',
  vista: '#66BB6A',
  task: '#EF5350',
  hero: '#AB47BC',
};

const OBJ_LABEL: Record<string, string> = {
  waypoint: '⬡ WP',
  poi: '◆ POI',
  vista: '▲ Vista',
  task: '♥ Heart',
  hero: '★ Hero',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildCompletedIds(
  achDef: AchievementDef | undefined,
  acctAch: AccountAchievement | undefined,
): Set<number> {
  const ids = new Set<number>();
  if (!achDef?.bits || !acctAch?.bits) return ids;
  acctAch.bits.forEach(bitIdx => {
    const bit = achDef.bits![bitIdx];
    if (bit?.id != null) ids.add(bit.id);
  });
  return ids;
}

// ─── Map Detail Modal ─────────────────────────────────────────────────────────

interface DetailProps {
  map: GW2MapBasic | null;
  achievementId: number | undefined;
  acctAch: AccountAchievement | undefined;
  onClose: () => void;
}

function MapDetailModal({map, achievementId, acctAch, onClose}: DetailProps) {
  const [filter, setFilter] = useState<ObjFilter>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedObj, setSelectedObj] = useState<MapObjective | null>(null);

  const {data: mapDetail, isLoading: detailLoading} = useContinentMapDetail(
    map?.continent_id ?? 1,
    map?.default_floor ?? 1,
    map?.region_id ?? 1,
    map?.id ?? 0,
  );

  const {data: achDefs, isLoading: achLoading} = useAchievementDefs(
    achievementId ? [achievementId] : [],
  );

  const achDef = achDefs?.[0];
  const completedIds = useMemo(
    () => buildCompletedIds(achDef, acctAch),
    [achDef, acctAch],
  );

  const filtered = useMemo(() => {
    if (!mapDetail) return [];
    return filter === 'all'
      ? mapDetail.objectives
      : mapDetail.objectives.filter(o => o.type === filter);
  }, [mapDetail, filter]);

  // Per-type counts
  const typeCounts = useMemo(() => {
    if (!mapDetail) return {} as Record<string, {total: number; done: number}>;
    const c: Record<string, {total: number; done: number}> = {};
    for (const obj of mapDetail.objectives) {
      if (!c[obj.type]) c[obj.type] = {total: 0, done: 0};
      c[obj.type].total++;
      if (completedIds.has(Number(obj.id))) c[obj.type].done++;
    }
    return c;
  }, [mapDetail, completedIds]);

  // Map display dimensions (fit width, preserve aspect ratio)
  const mapDims = useMemo(() => {
    if (!mapDetail?.continent_rect) return {w: SCREEN_W, h: SCREEN_W};
    const [[x1, y1], [x2, y2]] = mapDetail.continent_rect;
    const mw = x2 - x1;
    const mh = y2 - y1;
    const scale = SCREEN_W / mw;
    return {w: SCREEN_W, h: Math.round(mh * scale), x1, y1, mw, mh};
  }, [mapDetail]);

  function coordToScreen(coord: [number, number]) {
    const {x1, y1, mw, mh} = mapDims as any;
    return {
      sx: ((coord[0] - x1) / mw) * mapDims.w,
      sy: ((coord[1] - y1) / mh) * mapDims.h,
    };
  }

  const isLoading = detailLoading || achLoading;

  if (!map) return null;

  const completionText = acctAch
    ? acctAch.done
      ? '✓ Complete'
      : `${acctAch.current ?? 0} / ${acctAch.max ?? '?'}`
    : null;

  return (
    <Modal
      visible={!!map}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        {/* ── Header ── */}
        <View style={styles.modalHeader}>
          <View style={styles.modalTitleRow}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {map.name}
              </Text>
              <Text style={styles.modalSub}>
                Lv {map.min_level}–{map.max_level} · {map.region_name}
              </Text>
            </View>
            {completionText && (
              <Text
                style={[
                  styles.completionText,
                  {color: acctAch?.done ? colors.green : colors.gold},
                ]}>
                {completionText}
              </Text>
            )}
          </View>

          {/* Overall progress bar */}
          {acctAch && !acctAch.done && (
            <View style={styles.overallBar}>
              <View
                style={[
                  styles.overallBarFill,
                  {
                    width: `${Math.round(
                      ((acctAch.current ?? 0) / (acctAch.max ?? 1)) * 100,
                    )}%` as any,
                  },
                ]}
              />
            </View>
          )}

          {/* Per-type stats */}
          {!isLoading && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeStatsRow}>
              {Object.entries(typeCounts).map(([type, cnt]) => (
                <View
                  key={type}
                  style={[
                    styles.typeStatBox,
                    {borderColor: OBJ_COLOR[type] ?? colors.border},
                  ]}>
                  <Text
                    style={[
                      styles.typeStatLabel,
                      {color: OBJ_COLOR[type]},
                    ]}>
                    {OBJ_LABEL[type] ?? type}
                  </Text>
                  <Text style={styles.typeStatValue}>
                    {cnt.done}/{cnt.total}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator color={colors.gold} size="large" />
            <Text style={styles.loaderText}>Loading map data…</Text>
          </View>
        ) : !mapDetail ? (
          <View style={styles.loaderBox}>
            <Text style={styles.loaderText}>Map data unavailable.</Text>
          </View>
        ) : (
          <>
            {/* ── Controls ── */}
            <View style={styles.controls}>
              <View style={styles.viewToggleRow}>
                {(['map', 'list'] as const).map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.viewToggleBtn,
                      viewMode === m && styles.viewToggleBtnActive,
                    ]}
                    onPress={() => {
                      setViewMode(m);
                      setSelectedObj(null);
                    }}>
                    <Text
                      style={[
                        styles.viewToggleTxt,
                        viewMode === m && styles.viewToggleTxtActive,
                      ]}>
                      {m === 'map' ? '🗺 Map' : '📋 List'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}>
                {(['all', 'waypoint', 'poi', 'vista', 'task', 'hero'] as ObjFilter[]).map(
                  f => (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.filterPill,
                        filter === f && styles.filterPillActive,
                      ]}
                      onPress={() => setFilter(f)}>
                      <Text
                        style={[
                          styles.filterPillTxt,
                          filter === f && styles.filterPillTxtActive,
                        ]}>
                        {f === 'all' ? 'All' : OBJ_LABEL[f]}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>
            </View>

            {viewMode === 'map' ? (
              /* ── Interactive marker map ── */
              <View style={styles.mapWrapper}>
                <ScrollView
                  style={styles.mapScroll}
                  contentContainerStyle={{height: mapDims.h}}
                  showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      width: mapDims.w,
                      height: mapDims.h,
                      backgroundColor: '#07111e',
                    }}>
                    {/* Grid lines for orientation */}
                    {[0.25, 0.5, 0.75].map(frac => (
                      <React.Fragment key={frac}>
                        <View
                          style={{
                            position: 'absolute',
                            left: mapDims.w * frac,
                            top: 0,
                            width: 1,
                            height: mapDims.h,
                            backgroundColor: '#ffffff08',
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: mapDims.h * frac,
                            width: mapDims.w,
                            height: 1,
                            backgroundColor: '#ffffff08',
                          }}
                        />
                      </React.Fragment>
                    ))}

                    {/* Objective markers */}
                    {filtered.map((obj, idx) => {
                      const {sx, sy} = coordToScreen(obj.coord);
                      const done = completedIds.has(Number(obj.id));
                      const col = OBJ_COLOR[obj.type] ?? '#aaa';
                      const isSelected = selectedObj?.id === obj.id;
                      return (
                        <TouchableOpacity
                          key={`${obj.id}_${idx}`}
                          onPress={() =>
                            setSelectedObj(isSelected ? null : obj)
                          }
                          style={[
                            styles.marker,
                            {
                              left: sx - MARKER / 2,
                              top: sy - MARKER / 2,
                              backgroundColor: done ? col : 'transparent',
                              borderColor: col,
                              opacity: done ? 1 : 0.4,
                              transform: isSelected ? [{scale: 1.8}] : [],
                            },
                          ]}
                        />
                      );
                    })}
                  </View>
                </ScrollView>

                {/* Legend */}
                <View style={styles.legend}>
                  {Object.entries(OBJ_COLOR).map(([type, col]) => (
                    <View key={type} style={styles.legendItem}>
                      <View
                        style={[styles.legendDot, {backgroundColor: col}]}
                      />
                      <Text style={styles.legendTxt}>{type}</Text>
                    </View>
                  ))}
                </View>

                {/* Tap tooltip */}
                {selectedObj && (
                  <TouchableOpacity
                    style={styles.tooltip}
                    onPress={() => setSelectedObj(null)}
                    activeOpacity={1}>
                    <View
                      style={[
                        styles.tooltipDot,
                        {
                          backgroundColor:
                            OBJ_COLOR[selectedObj.type] ?? colors.border,
                        },
                      ]}
                    />
                    <View style={{flex: 1}}>
                      <Text style={styles.tooltipName} numberOfLines={1}>
                        {selectedObj.name || OBJ_LABEL[selectedObj.type]}
                      </Text>
                      <Text style={styles.tooltipType}>
                        {OBJ_LABEL[selectedObj.type] ?? selectedObj.type}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.tooltipStatus,
                        {
                          color: completedIds.has(Number(selectedObj.id))
                            ? colors.green
                            : colors.textMuted,
                        },
                      ]}>
                      {completedIds.has(Number(selectedObj.id))
                        ? '✓ Done'
                        : '○ Missing'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              /* ── List view ── */
              <FlatList
                data={filtered}
                keyExtractor={(item, i) => `${item.id}_${i}`}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <Text style={styles.emptyTxt}>No objectives.</Text>
                }
                renderItem={({item}) => {
                  const done = completedIds.has(Number(item.id));
                  const col = OBJ_COLOR[item.type] ?? colors.textMuted;
                  return (
                    <View
                      style={[styles.objRow, {borderLeftColor: col}]}>
                      <View
                        style={[
                          styles.objDot,
                          {
                            backgroundColor: done ? col : 'transparent',
                            borderColor: col,
                          },
                        ]}
                      />
                      <View style={{flex: 1}}>
                        <Text style={styles.objName}>
                          {item.name || OBJ_LABEL[item.type] || item.type}
                        </Text>
                        <Text style={[styles.objType, {color: col}]}>
                          {OBJ_LABEL[item.type] ?? item.type}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.objStatus,
                          {color: done ? colors.green : colors.textMuted},
                        ]}>
                        {done ? '✓' : '○'}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function MapCompletionScreen() {
  const {settings} = useAppStore();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedMap, setSelectedMap] = useState<GW2MapBasic | null>(null);

  const {data: maps, isLoading: mapsLoading, error: mapsError, refetch} =
    useMaps();
  const {data: categories, isLoading: catsLoading} =
    useAchievementCategories();
  const {data: accountAchs, isLoading: achsLoading} =
    useAccountAchievements();

  // Group maps by region, sorted by level
  const mapsByRegion = useMemo(() => {
    if (!maps) return {} as Record<string, GW2MapBasic[]>;
    const g: Record<string, GW2MapBasic[]> = {};
    for (const m of maps) {
      if (!g[m.region_name]) g[m.region_name] = [];
      g[m.region_name].push(m);
    }
    for (const r of Object.keys(g)) {
      g[r].sort((a, b) => a.min_level - b.min_level);
    }
    return g;
  }, [maps]);

  const regions = useMemo(
    () => Object.keys(mapsByRegion).sort(),
    [mapsByRegion],
  );

  // map name → achievementId  (matched by name from categories)
  const mapToAchId = useMemo(() => {
    if (!maps || !categories) return new Map<number, number>();
    const nameIndex = new Map(maps.map(m => [m.name.toLowerCase(), m.id]));
    const result = new Map<number, number>();
    for (const cat of categories) {
      const mapId = nameIndex.get(cat.name.toLowerCase());
      if (mapId != null && cat.achievements.length > 0) {
        result.set(mapId, cat.achievements[0]);
      }
    }
    return result;
  }, [maps, categories]);

  // achievementId → account achievement progress
  const achProgress = useMemo(() => {
    if (!accountAchs) return new Map<number, AccountAchievement>();
    return new Map(accountAchs.map(a => [a.id, a]));
  }, [accountAchs]);

  const currentRegion =
    selectedRegion ?? (regions.length > 0 ? regions[0] : null);

  const displayMaps = useMemo(() => {
    if (!currentRegion) return [];
    const list = mapsByRegion[currentRegion] ?? [];
    if (!search.trim()) return list;
    return list.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [currentRegion, mapsByRegion, search]);

  // Overall account stats (across all tracked maps)
  const overallStats = useMemo(() => {
    let done = 0;
    let total = 0;
    for (const [, achId] of mapToAchId) {
      const ach = achProgress.get(achId);
      if (ach) {
        total++;
        if (ach.done) done++;
      }
    }
    return {done, total};
  }, [mapToAchId, achProgress]);

  const isLoading = mapsLoading || catsLoading || achsLoading;

  const selectedAchId = selectedMap
    ? mapToAchId.get(selectedMap.id)
    : undefined;
  const selectedAch = selectedAchId
    ? achProgress.get(selectedAchId)
    : undefined;

  const onClose = useCallback(() => setSelectedMap(null), []);

  if (!settings.apiKey) {
    return (
      <View style={styles.container}>
        <Card style={styles.noKeyCard}>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyText}>
            Add your GW2 API key in Settings to view map completion.
          </Text>
        </Card>
      </View>
    );
  }

  if (mapsError) {
    return <ErrorMessage error={mapsError} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      {/* Account-wide note + overall progress */}
      <View style={styles.topBanner}>
        <Text style={styles.bannerNote}>
          ℹ️ Tracked account-wide by the GW2 API
        </Text>
        {overallStats.total > 0 && (
          <Text style={styles.bannerStat}>
            {overallStats.done}/{overallStats.total} maps complete
          </Text>
        )}
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search maps…"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isLoading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator color={colors.gold} size="large" />
          <Text style={styles.loaderText}>
            Loading maps &amp; achievements…{'\n'}(first load may take a
            moment)
          </Text>
        </View>
      ) : (
        <>
          {/* Region tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.regionScroll}
            contentContainerStyle={styles.regionRow}>
            {regions.map(r => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.regionPill,
                  currentRegion === r && styles.regionPillActive,
                ]}
                onPress={() => setSelectedRegion(r)}>
                <Text
                  style={[
                    styles.regionPillTxt,
                    currentRegion === r && styles.regionPillTxtActive,
                  ]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Map list */}
          <FlatList
            data={displayMaps}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.mapList}
            ListEmptyComponent={
              <Text style={styles.emptyTxt}>No maps found.</Text>
            }
            renderItem={({item}) => {
              const achId = mapToAchId.get(item.id);
              const ach = achId ? achProgress.get(achId) : undefined;
              const pct =
                ach?.max ? (ach.current ?? 0) / ach.max : null;

              return (
                <TouchableOpacity
                  style={styles.mapCard}
                  onPress={() => setSelectedMap(item)}
                  activeOpacity={0.75}>
                  <View style={styles.mapCardRow}>
                    <View style={{flex: 1}}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapSub}>
                        Lv {item.min_level}–{item.max_level}
                      </Text>
                    </View>
                    {ach ? (
                      ach.done ? (
                        <Text style={styles.mapDone}>✓</Text>
                      ) : (
                        <Text style={styles.mapProgress}>
                          {ach.current ?? 0}/{ach.max ?? '?'}
                        </Text>
                      )
                    ) : (
                      <Text style={styles.mapUnknown}>–</Text>
                    )}
                  </View>
                  {pct !== null && (
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.round(pct * 100)}%` as any,
                            backgroundColor: ach?.done
                              ? colors.green
                              : colors.gold,
                          },
                        ]}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      <MapDetailModal
        map={selectedMap}
        achievementId={selectedAchId}
        acctAch={selectedAch}
        onClose={onClose}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},

  // top banner
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bannerNote: {color: colors.textMuted, fontSize: fontSize.xs},
  bannerStat: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },

  // search
  search: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
  },

  // loader
  loaderBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  loaderText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },

  // region tabs
  regionScroll: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  regionRow: {padding: spacing.sm, gap: spacing.xs},
  regionPill: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  regionPillActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  regionPillTxt: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  regionPillTxtActive: {color: '#000'},

  // map list
  mapList: {padding: spacing.sm, gap: spacing.xs},
  mapCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  mapCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapName: {color: colors.text, fontSize: fontSize.sm, fontWeight: '700'},
  mapSub: {color: colors.textMuted, fontSize: fontSize.xs},
  mapDone: {color: colors.green, fontSize: fontSize.lg, fontWeight: '800'},
  mapProgress: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  mapUnknown: {color: colors.textMuted, fontSize: fontSize.sm},
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', borderRadius: 2},

  emptyTxt: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    padding: spacing.xl,
  },

  noKeyCard: {margin: spacing.md, alignItems: 'center', gap: spacing.sm},
  noKeyTitle: {color: colors.gold, fontSize: fontSize.lg, fontWeight: '700'},
  noKeyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },

  // ── Modal ──────────────────────────────────────────────────────────────────
  modalRoot: {flex: 1, backgroundColor: colors.bg},

  modalHeader: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closeBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    borderRadius: radius.md,
  },
  closeBtnText: {color: colors.text, fontSize: fontSize.md, fontWeight: '700'},
  modalTitle: {color: colors.text, fontSize: fontSize.lg, fontWeight: '800'},
  modalSub: {color: colors.textMuted, fontSize: fontSize.xs},
  completionText: {fontSize: fontSize.sm, fontWeight: '800'},

  overallBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  overallBarFill: {height: '100%', backgroundColor: colors.gold, borderRadius: 2},

  typeStatsRow: {gap: spacing.xs},
  typeStatBox: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    gap: 2,
    minWidth: 64,
  },
  typeStatLabel: {fontSize: fontSize.xs, fontWeight: '700'},
  typeStatValue: {color: colors.text, fontSize: fontSize.sm, fontWeight: '800'},

  // controls bar
  controls: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  viewToggleRow: {flexDirection: 'row', gap: spacing.sm},
  viewToggleBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewToggleBtnActive: {
    backgroundColor: colors.gold + '22',
    borderColor: colors.gold,
  },
  viewToggleTxt: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  viewToggleTxtActive: {color: colors.gold},

  filterRow: {gap: spacing.xs},
  filterPill: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  filterPillTxt: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  filterPillTxtActive: {color: '#000'},

  // interactive map
  mapWrapper: {flex: 1, position: 'relative'},
  mapScroll: {flex: 1},
  marker: {
    position: 'absolute',
    width: MARKER,
    height: MARKER,
    borderRadius: MARKER / 2,
    borderWidth: 1.5,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface + 'DD',
    padding: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: 4},
  legendDot: {width: 8, height: 8, borderRadius: 4},
  legendTxt: {color: colors.textMuted, fontSize: fontSize.xs},
  tooltip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface + 'F2',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  tooltipDot: {width: 14, height: 14, borderRadius: 7},
  tooltipName: {color: colors.text, fontSize: fontSize.sm, fontWeight: '700'},
  tooltipType: {color: colors.textMuted, fontSize: fontSize.xs},
  tooltipStatus: {fontSize: fontSize.sm, fontWeight: '700'},

  // list view
  listContent: {padding: spacing.md, gap: spacing.xs},
  objRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    padding: spacing.sm,
  },
  objDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  objName: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  objType: {fontSize: fontSize.xs},
  objStatus: {fontSize: fontSize.md, fontWeight: '800'},
});
