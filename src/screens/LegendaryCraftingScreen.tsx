import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native';
import {useLegendaryPlan, useAllInventory, useItems} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/ui/ErrorMessage';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import {LEGENDARIES_DEDUPED} from '../data/legendaries';
import {FARMING_TIPS} from '../data/timegates';
import type {FlatMaterial, RecipeNode, LegendaryPlan} from '../api/legendary';

const SCREEN_W = Dimensions.get('window').width;

// ─── Tab types ────────────────────────────────────────────────────────────────

type PlanTab = 'shopping' | 'tree' | 'timegate' | 'summary';

// ─── Source badge config ──────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, string> = {
  craft: '#4fc3f7',
  forge: '#ce93d8',
  timegated: '#ffcc02',
  special: '#ff9966',
  buy: '#81c784',
  unknown: '#888',
};
const SOURCE_LABELS: Record<string, string> = {
  craft: 'Craft',
  forge: 'Forge',
  timegated: '⏰ Timed',
  special: '★ Special',
  buy: 'Buy/Farm',
  unknown: '?',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function copperToGold(copper: number): string {
  if (copper <= 0) return '0g';
  const g = Math.floor(copper / 10000);
  const s = Math.floor((copper % 10000) / 100);
  const c = copper % 100;
  const parts: string[] = [];
  if (g) parts.push(`${g}g`);
  if (s) parts.push(`${s}s`);
  if (c) parts.push(`${c}c`);
  return parts.join(' ') || '0c';
}

function havePercent(have: number, need: number): number {
  if (need <= 0) return 100;
  return Math.min(100, Math.round((have / need) * 100));
}

// ─── Material detail modal ────────────────────────────────────────────────────

function MaterialModal({
  mat,
  onClose,
}: {
  mat: FlatMaterial | null;
  onClose: () => void;
}) {
  if (!mat) return null;
  const tip = FARMING_TIPS[mat.itemId];
  const pct = havePercent(mat.haveTotal, mat.needed);

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.matModalRoot}>
        <View style={styles.matModalHeader}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnTxt}>✕</Text>
          </TouchableOpacity>
          {mat.icon ? (
            <Image source={{uri: mat.icon}} style={styles.matModalIcon} />
          ) : null}
          <View style={{flex: 1}}>
            <Text style={styles.matModalName}>{mat.name}</Text>
            <View style={[styles.sourceBadge, {backgroundColor: SOURCE_COLORS[mat.source] + '33', borderColor: SOURCE_COLORS[mat.source]}]}>
              <Text style={[styles.sourceBadgeTxt, {color: SOURCE_COLORS[mat.source]}]}>
                {SOURCE_LABELS[mat.source]}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.matModalBody}>
          {/* Have / Need */}
          <Card style={styles.matCard}>
            <Text style={styles.matCardTitle}>Inventory</Text>
            <View style={styles.matCardRow}>
              <View style={styles.matStat}>
                <Text style={styles.matStatVal}>{mat.haveTotal.toLocaleString()}</Text>
                <Text style={styles.matStatLbl}>Have</Text>
              </View>
              <View style={styles.matStat}>
                <Text style={styles.matStatVal}>{mat.needed.toLocaleString()}</Text>
                <Text style={styles.matStatLbl}>Need</Text>
              </View>
              <View style={styles.matStat}>
                <Text style={[styles.matStatVal, {color: mat.missing > 0 ? colors.red : colors.green}]}>
                  {mat.missing > 0 ? `-${mat.missing.toLocaleString()}` : '✓'}
                </Text>
                <Text style={styles.matStatLbl}>Missing</Text>
              </View>
            </View>
            <View style={styles.pctBar}>
              <View style={[styles.pctFill, {
                width: `${pct}%` as any,
                backgroundColor: pct === 100 ? colors.green : colors.gold,
              }]} />
            </View>
            <Text style={styles.pctTxt}>{pct}% covered</Text>
          </Card>

          {/* TP Price */}
          {mat.tpBuyPrice > 0 && (
            <Card style={styles.matCard}>
              <Text style={styles.matCardTitle}>Trading Post</Text>
              <View style={styles.matCardRow}>
                <View style={styles.matStat}>
                  <Text style={styles.matStatVal}>{copperToGold(mat.tpBuyPrice)}</Text>
                  <Text style={styles.matStatLbl}>Buy price</Text>
                </View>
                <View style={styles.matStat}>
                  <Text style={styles.matStatVal}>{copperToGold(mat.tpSellPrice)}</Text>
                  <Text style={styles.matStatLbl}>Sell price</Text>
                </View>
                {mat.missing > 0 && (
                  <View style={styles.matStat}>
                    <Text style={[styles.matStatVal, {color: colors.red}]}>
                      {copperToGold(mat.totalBuyCost)}
                    </Text>
                    <Text style={styles.matStatLbl}>Total cost</Text>
                  </View>
                )}
              </View>
            </Card>
          )}

          {/* Timegate info */}
          {mat.timegateInfo && (
            <Card style={styles.matCard}>
              <Text style={styles.matCardTitle}>⏰ Timegated</Text>
              <Text style={styles.matInfoSource}>{mat.timegateInfo.source}</Text>
              {mat.daysRequired > 0 && (
                <Text style={[styles.matInfoDays, {color: colors.gold}]}>
                  ~{mat.daysRequired} day{mat.daysRequired !== 1 ? 's' : ''} to craft {mat.missing} needed
                </Text>
              )}
              <Text style={styles.matInfoNote}>{mat.timegateInfo.farmingTip}</Text>
            </Card>
          )}

          {/* Special acquisition */}
          {mat.specialInfo && (
            <Card style={styles.matCard}>
              <Text style={styles.matCardTitle}>★ Special Acquisition</Text>
              <Text style={styles.matInfoSource}>{mat.specialInfo.source}</Text>
              <Text style={styles.matInfoNote}>{mat.specialInfo.fullNote}</Text>
            </Card>
          )}

          {/* Farming tip */}
          {tip && !mat.timegateInfo && !mat.specialInfo && (
            <Card style={styles.matCard}>
              <Text style={styles.matCardTitle}>💡 Farming Tip</Text>
              <Text style={styles.matInfoNote}>{tip.tip}</Text>
            </Card>
          )}

          {/* Wiki button */}
          <TouchableOpacity
            style={styles.wikiBtn}
            onPress={() => Linking.openURL(mat.wikiUrl)}>
            <Text style={styles.wikiBtnTxt}>📖 Open GW2 Wiki</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Shopping List ────────────────────────────────────────────────────────────

function SubItemRow({node, inventory}: {node: RecipeNode; inventory: Map<number, number>}) {
  const have = inventory.get(node.itemId) ?? 0;
  const missing = Math.max(0, node.count - have);
  const statusColor = missing === 0 ? colors.green : have > 0 ? colors.gold : colors.red;
  const col = SOURCE_COLORS[node.source] ?? '#888';
  return (
    <View style={[styles.subItemRow, {borderLeftColor: col}]}>
      {node.icon ? (
        <Image source={{uri: node.icon}} style={styles.subItemIcon} />
      ) : (
        <View style={[styles.subItemIcon, {backgroundColor: colors.border}]} />
      )}
      <Text style={styles.subItemName} numberOfLines={1}>{node.name}</Text>
      <Text style={[styles.subItemCount, {color: statusColor}]}>
        {have}/{node.count}
      </Text>
    </View>
  );
}

function MatRow({mat, onPressMat, inventory}: {
  mat: FlatMaterial;
  onPressMat: (mat: FlatMaterial) => void;
  inventory: Map<number, number>;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!mat.recipeChildren?.length;
  const pct = havePercent(mat.haveTotal, mat.needed);
  const statusColor = mat.missing === 0 ? colors.green : mat.haveTotal > 0 ? colors.gold : colors.red;
  return (
    <View>
      <TouchableOpacity
        style={[styles.matRow, {borderLeftColor: SOURCE_COLORS[mat.source]}]}
        onPress={() => hasChildren ? setExpanded(e => !e) : onPressMat(mat)}
        onLongPress={() => onPressMat(mat)}
        activeOpacity={0.75}>
        <View style={styles.matRowLeft}>
          {mat.icon ? (
            <Image source={{uri: mat.icon}} style={styles.matRowIcon} />
          ) : (
            <View style={[styles.matRowIcon, {backgroundColor: colors.border}]} />
          )}
          <View style={styles.matRowInfo}>
            <Text style={styles.matRowName} numberOfLines={1}>{mat.name}</Text>
            <View style={styles.matRowTags}>
              <View style={[styles.sourceBadgeSm, {borderColor: SOURCE_COLORS[mat.source]}]}>
                <Text style={[styles.sourceBadgeSmTxt, {color: SOURCE_COLORS[mat.source]}]}>
                  {SOURCE_LABELS[mat.source]}
                </Text>
              </View>
              {mat.isTimegated && (
                <Text style={styles.tgTag}>⏰ {mat.daysRequired}d</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.matRowRight}>
          <Text style={[styles.matRowStatus, {color: statusColor}]}>
            {mat.haveTotal.toLocaleString()}/{mat.needed.toLocaleString()}
          </Text>
          {mat.missing > 0 && mat.tpBuyPrice > 0 && (
            <Text style={styles.matRowCost}>{copperToGold(mat.totalBuyCost)}</Text>
          )}
          <View style={styles.matRowBar}>
            <View style={[styles.matRowBarFill, {width: `${pct}%` as any, backgroundColor: statusColor}]} />
          </View>
          {hasChildren && (
            <Text style={styles.matRowExpand}>{expanded ? '▼' : '▶'}</Text>
          )}
        </View>
      </TouchableOpacity>
      {expanded && mat.recipeChildren!.map((child, i) => (
        <SubItemRow key={`${child.itemId}_${i}`} node={child} inventory={inventory} />
      ))}
    </View>
  );
}

function ShoppingList({
  materials,
  onPressMat,
  inventory,
}: {
  materials: FlatMaterial[];
  onPressMat: (mat: FlatMaterial) => void;
  inventory: Map<number, number>;
}) {
  const [search, setSearch] = useState('');

  const {missing, have} = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = q ? materials.filter(m => m.name.toLowerCase().includes(q)) : materials;
    return {
      missing: all.filter(m => m.missing > 0),
      have: all.filter(m => m.missing === 0),
    };
  }, [materials, search]);

  const totalCost = missing
    .filter(m => !m.isTimegated && !m.specialInfo)
    .reduce((s, m) => s + m.totalBuyCost, 0);

  const sections = useMemo(() => {
    const out = [];
    if (missing.length > 0) out.push({key: 'missing', title: `Still needed  (${missing.length})`, data: missing});
    if (have.length > 0) out.push({key: 'have', title: `Already have  (${have.length})`, data: have});
    return out;
  }, [missing, have]);

  return (
    <View style={{flex: 1}}>
      {/* Summary banner */}
      <View style={styles.shopBanner}>
        <Text style={styles.shopBannerTxt}>
          {missing.length === 0
            ? '✓ All materials available!'
            : `${missing.length} material${missing.length > 1 ? 's' : ''} still needed`}
        </Text>
        {totalCost > 0 && (
          <Text style={styles.shopBannerCost}>~{copperToGold(totalCost)} to buy</Text>
        )}
      </View>

      <TextInput
        style={styles.shopSearch}
        value={search}
        onChangeText={setSearch}
        placeholder="Search materials…"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <SectionList
        sections={sections}
        keyExtractor={item => String(item.itemId)}
        contentContainerStyle={styles.shopList}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={<Text style={styles.emptyTxt}>No materials to show.</Text>}
        renderSectionHeader={({section}) => (
          <View style={[
            styles.shopSectionHeader,
            {borderLeftColor: section.key === 'missing' ? colors.red : colors.green},
          ]}>
            <Text style={[
              styles.shopSectionTitle,
              {color: section.key === 'missing' ? colors.red : colors.green},
            ]}>
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({item}) => <MatRow mat={item} onPressMat={onPressMat} inventory={inventory} />}
        SectionSeparatorComponent={() => <View style={{height: spacing.xs}} />}
      />
    </View>
  );
}

// ─── Recipe Tree node ─────────────────────────────────────────────────────────

function TreeNode({
  node,
  depth,
  onPressMat,
  inventory,
}: {
  node: RecipeNode;
  depth: number;
  onPressMat: (itemId: number, name: string, icon?: string) => void;
  inventory: Map<number, number>;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = !!node.children?.length;
  const indentPx = depth * 14;
  const col = SOURCE_COLORS[node.source] ?? '#888';
  const have = inventory.get(node.itemId) ?? 0;
  const statusColor = have >= node.count ? colors.green : have > 0 ? colors.gold : colors.red;

  return (
    <View>
      <TouchableOpacity
        style={[styles.treeRow, {marginLeft: indentPx}]}
        onPress={() => hasChildren ? setExpanded(e => !e) : onPressMat(node.itemId, node.name, node.icon)}
        activeOpacity={0.75}>
        <View style={[styles.treeConnector, {backgroundColor: col}]} />
        {node.icon ? (
          <Image source={{uri: node.icon}} style={styles.treeIcon} />
        ) : (
          <View style={[styles.treeIcon, {backgroundColor: colors.border}]} />
        )}
        <View style={styles.treeInfo}>
          <Text style={styles.treeName} numberOfLines={1}>{node.name}</Text>
          <Text style={[styles.treeSource, {color: col}]}>
            {SOURCE_LABELS[node.source]}
            {node.recipeType ? ` · ${node.recipeType}` : ''}
          </Text>
        </View>
        <View style={styles.treeRight}>
          <Text style={[styles.treeHave, {color: statusColor}]}>{have}/{node.count}</Text>
          {hasChildren && (
            <Text style={styles.treeExpand}>{expanded ? '▼' : '▶'}</Text>
          )}
        </View>
      </TouchableOpacity>
      {hasChildren && expanded && node.children!.map((child, i) => (
        <TreeNode
          key={`${child.itemId}_${i}`}
          node={child}
          depth={depth + 1}
          onPressMat={onPressMat}
          inventory={inventory}
        />
      ))}
    </View>
  );
}

function RecipeTree({
  tree,
  onPressMat,
  inventory,
}: {
  tree: RecipeNode;
  onPressMat: (itemId: number, name: string, icon?: string) => void;
  inventory: Map<number, number>;
}) {
  return (
    <ScrollView contentContainerStyle={styles.treeList}>
      <TreeNode node={tree} depth={0} onPressMat={onPressMat} inventory={inventory} />
    </ScrollView>
  );
}

// ─── Timegate tab ─────────────────────────────────────────────────────────────

function TimegateTab({materials, maxDays}: {materials: FlatMaterial[]; maxDays: number}) {
  if (materials.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTxt}>No timegated materials needed.</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.tgList}>
      <Card style={styles.tgSummaryCard}>
        <Text style={styles.tgSummaryTitle}>⏰ Minimum timegate</Text>
        <Text style={styles.tgSummaryDays}>
          {maxDays} day{maxDays !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.tgSummaryNote}>
          Craft 1 (or more) timegated material per day simultaneously.{'\n'}
          You can progress multiple legendaries in parallel.
        </Text>
      </Card>

      {materials.map(mat => (
        <View key={mat.itemId} style={styles.tgRow}>
          <View style={styles.tgRowLeft}>
            {mat.icon ? (
              <Image source={{uri: mat.icon}} style={styles.tgIcon} />
            ) : (
              <View style={[styles.tgIcon, {backgroundColor: colors.border}]} />
            )}
            <View style={{flex: 1}}>
              <Text style={styles.tgName}>{mat.name}</Text>
              <Text style={styles.tgSource}>{mat.timegateInfo?.source}</Text>
            </View>
          </View>
          <View style={styles.tgRowRight}>
            <Text style={styles.tgHave}>
              {mat.haveTotal}/{mat.needed}
            </Text>
            {mat.missing > 0 ? (
              <Text style={[styles.tgDays, {color: colors.gold}]}>
                {mat.daysRequired}d
              </Text>
            ) : (
              <Text style={[styles.tgDays, {color: colors.green}]}>✓</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Summary tab ──────────────────────────────────────────────────────────────

function SummaryTab({plans, combined, totalCost, maxDays}: {
  plans: LegendaryPlan[];
  combined: FlatMaterial[];
  totalCost: number;
  maxDays: number;
}) {
  const mysticClovers = combined.find(m => m.itemId === 19675);
  const cloversMissing = mysticClovers?.missing ?? 0;
  const cloversAttempts = cloversMissing > 0 ? Math.ceil(cloversMissing / 1.3) : 0; // ~1.3 avg per attempt

  const needsWvW = combined.some(m => m.itemId === 19678 && m.missing > 0);
  const needsMapComp = combined.some(m => m.itemId === 19677 && m.missing > 0);
  const specialMats = combined.filter(m => !!m.specialInfo && m.missing > 0);

  const immediateItems = combined.filter(m => !m.isTimegated && !m.specialInfo && m.tpBuyPrice > 0 && m.missing > 0).length;

  return (
    <ScrollView contentContainerStyle={styles.summaryList}>
      {/* Overall status */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>🏆 Crafting {plans.length} Legendary{plans.length > 1 ? 's' : ''}</Text>
        {plans.map(p => (
          <View key={p.legendaryItemId} style={styles.summaryLeg}>
            {p.legendaryIcon ? (
              <Image source={{uri: p.legendaryIcon}} style={styles.summaryLegIcon} />
            ) : null}
            <Text style={styles.summaryLegName}>{p.legendaryName}</Text>
          </View>
        ))}
      </Card>

      {/* TP Cost */}
      {totalCost > 0 && (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>💰 Trading Post Cost</Text>
          <Text style={styles.summaryValue}>{copperToGold(totalCost)}</Text>
          <Text style={styles.summaryNote}>
            To instantly buy all {immediateItems} missing TP-available materials.
          </Text>
        </Card>
      )}

      {/* Timegate */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>⏰ Timegate</Text>
        {maxDays > 0 ? (
          <>
            <Text style={styles.summaryValue}>{maxDays} days minimum</Text>
            <Text style={styles.summaryNote}>
              Craft 1 of each timegated material per day. All timegates run in parallel if you craft them every day.
            </Text>
          </>
        ) : (
          <Text style={[styles.summaryNote, {color: colors.green}]}>
            ✓ No timegated materials missing.
          </Text>
        )}
      </Card>

      {/* Mystic Clovers */}
      {cloversMissing > 0 && (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>🍀 Mystic Clovers</Text>
          <Text style={styles.summaryValue}>{cloversMissing} missing</Text>
          <Text style={styles.summaryNote}>
            ~{cloversAttempts} Mystic Forge attempts needed (33% chance, avg ~1.3 clovers/attempt).{'\n'}
            Each attempt costs: 10 Ecto + 10 Obsidian Shard + 10 Philosopher's Stone + 10 T6 fine material.
          </Text>
        </Card>
      )}

      {/* Map completion */}
      {needsMapComp && (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>🗺 World Completion</Text>
          <Text style={styles.summaryNote}>
            Requires 100% core Tyria map completion (Gift of Exploration).{'\n'}
            ~15–30 hours for a new character. Check the Map Completion tab in Characters.
          </Text>
          <TouchableOpacity
            style={styles.wikiBtn}
            onPress={() => Linking.openURL('https://wiki.guildwars2.com/wiki/Gift_of_Exploration')}>
            <Text style={styles.wikiBtnTxt}>📖 Wiki: Gift of Exploration</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* WvW */}
      {needsWvW && (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>⚔️ World vs World</Text>
          <Text style={styles.summaryNote}>
            Requires completing the Gift of Battle WvW reward track.{'\n'}
            ~8–12 hours of WvW participation. Use Reward Track Potions to boost progress.
          </Text>
          <TouchableOpacity
            style={styles.wikiBtn}
            onPress={() => Linking.openURL('https://wiki.guildwars2.com/wiki/Gift_of_Battle')}>
            <Text style={styles.wikiBtnTxt}>📖 Wiki: Gift of Battle</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Other special */}
      {specialMats.filter(m => m.itemId !== 19675 && m.itemId !== 19678 && m.itemId !== 19677).map(mat => (
        <Card key={mat.itemId} style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>★ {mat.name}</Text>
          <Text style={styles.summaryNote}>{mat.specialInfo!.fullNote}</Text>
          <TouchableOpacity
            style={styles.wikiBtn}
            onPress={() => Linking.openURL(mat.wikiUrl)}>
            <Text style={styles.wikiBtnTxt}>📖 Open Wiki</Text>
          </TouchableOpacity>
        </Card>
      ))}

      {/* Time estimate */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>📅 Time Estimate</Text>
        <View style={styles.timeBreakdown}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLbl}>TP purchases:</Text>
            <Text style={styles.timeVal}>Instant</Text>
          </View>
          {maxDays > 0 && (
            <View style={styles.timeRow}>
              <Text style={styles.timeLbl}>Timegated mats:</Text>
              <Text style={[styles.timeVal, {color: colors.gold}]}>{maxDays} days</Text>
            </View>
          )}
          {cloversAttempts > 0 && (
            <View style={styles.timeRow}>
              <Text style={styles.timeLbl}>Mystic Clovers:</Text>
              <Text style={styles.timeVal}>~{cloversAttempts} Forge runs</Text>
            </View>
          )}
          {needsMapComp && (
            <View style={styles.timeRow}>
              <Text style={styles.timeLbl}>Map completion:</Text>
              <Text style={styles.timeVal}>15–30 hrs</Text>
            </View>
          )}
          {needsWvW && (
            <View style={styles.timeRow}>
              <Text style={styles.timeLbl}>WvW track:</Text>
              <Text style={styles.timeVal}>8–12 hrs</Text>
            </View>
          )}
          <View style={[styles.timeRow, styles.timeTotalRow]}>
            <Text style={styles.timeTotalLbl}>Minimum total:</Text>
            <Text style={[styles.timeTotalVal, {color: colors.gold}]}>
              {maxDays > 0 ? `${maxDays}+ days` : 'Ready to craft!'}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

// ─── Plan view (after legendaries selected) ───────────────────────────────────

function PlanView({itemIds}: {itemIds: number[]}) {
  const {data, isLoading, error, refetch} = useLegendaryPlan(itemIds);
  const {data: invData} = useAllInventory();
  const inventory = useMemo<Map<number, number>>(() => invData ?? new Map(), [invData]);
  const [planTab, setPlanTab] = useState<PlanTab>('shopping');
  const [selectedMat, setSelectedMat] = useState<FlatMaterial | null>(null);
  const [treePlanIdx, setTreePlanIdx] = useState(0);
  const safeTreeIdx = data ? Math.min(treePlanIdx, data.plans.length - 1) : 0;

  const handlePressMat = useCallback((mat: FlatMaterial) => {
    setSelectedMat(mat);
  }, []);

  const handlePressTreeItem = useCallback((id: number, name: string, _icon?: string) => {
    const mat = data?.combined.find(m => m.itemId === id);
    if (mat) {
      setSelectedMat(mat);
    } else {
      Linking.openURL(`https://wiki.guildwars2.com/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.gold} size="large" />
        <Text style={styles.loadingTxt}>
          Resolving recipe tree…{'\n'}(fetching all crafting steps)
        </Text>
      </View>
    );
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data) return null;

  const {combined, totalCost, maxDays, plans} = data;
  const missingCount = combined.filter(m => m.missing > 0).length;

  return (
    <View style={{flex: 1}}>
      {/* Plan sub-tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.planTabBar}
        contentContainerStyle={styles.planTabBarContent}>
        {(['shopping', 'tree', 'timegate', 'summary'] as PlanTab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.planTab, planTab === t && styles.planTabActive]}
            onPress={() => setPlanTab(t)}>
            <Text style={[styles.planTabTxt, planTab === t && styles.planTabTxtActive]}>
              {t === 'shopping' ? `🛒 Shopping${missingCount ? ` (${missingCount})` : ''}` :
               t === 'tree' ? '🌳 Recipe Tree' :
               t === 'timegate' ? `⏰ Timegate${maxDays > 0 ? ` (${maxDays}d)` : ''}` :
               '📋 Summary'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {planTab === 'shopping' && (
        <ShoppingList materials={combined} onPressMat={handlePressMat} inventory={inventory} />
      )}
      {planTab === 'tree' && plans.length > 0 && (
        <View style={{flex: 1}}>
          {plans.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.treePlanBar}
              contentContainerStyle={styles.treePlanBarContent}>
              {plans.map((p, i) => (
                <TouchableOpacity
                  key={p.legendaryItemId}
                  style={[styles.treePlanTab, safeTreeIdx === i && styles.treePlanTabActive]}
                  onPress={() => setTreePlanIdx(i)}>
                  {p.legendaryIcon ? (
                    <Image source={{uri: p.legendaryIcon}} style={styles.treePlanIcon} />
                  ) : null}
                  <Text style={[styles.treePlanTxt, safeTreeIdx === i && styles.treePlanTxtActive]}
                    numberOfLines={1}>
                    {p.legendaryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <RecipeTree tree={plans[safeTreeIdx].tree} onPressMat={handlePressTreeItem} inventory={inventory} />
        </View>
      )}
      {planTab === 'timegate' && (
        <TimegateTab
          materials={combined.filter(m => m.isTimegated)}
          maxDays={maxDays}
        />
      )}
      {planTab === 'summary' && (
        <SummaryTab plans={plans} combined={combined} totalCost={totalCost} maxDays={maxDays} />
      )}

      <MaterialModal mat={selectedMat} onClose={() => setSelectedMat(null)} />
    </View>
  );
}

// ─── Legendary picker ─────────────────────────────────────────────────────────

function LegendaryPicker({
  selected,
  onToggle,
}: {
  selected: Set<number>;
  onToggle: (id: number) => void;
}) {
  const [search, setSearch] = useState('');
  const [genFilter, setGenFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'weapon' | 'armor' | 'trinket' | 'back'>('all');

  // Fetch icons for all legendaries (public API — no API key needed)
  const allIds = useMemo(() => LEGENDARIES_DEDUPED.map(l => l.id), []);
  const {data: itemDetails} = useItems(allIds);
  const iconMap = useMemo(() => {
    const m = new Map<number, string>();
    itemDetails?.forEach((item: any) => { if (item?.icon) m.set(item.id, item.icon); });
    return m;
  }, [itemDetails]);

  const filtered = useMemo(() => {
    let list = LEGENDARIES_DEDUPED;
    if (typeFilter !== 'all') list = list.filter(l => l.type === typeFilter);
    if (genFilter !== 'all') list = list.filter(l => l.generation === genFilter);
    if (search.trim()) {
      list = list.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
    }
    return list;
  }, [search, genFilter, typeFilter]);

  return (
    <View style={{flex: 1}}>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search legendaries…"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genFilterScroll}
        contentContainerStyle={styles.genFilterRow}>
        {([['all', 'All Types'], ['weapon', '⚔️ Weapons'], ['armor', '🛡 Armor'], ['trinket', '💍 Trinkets'], ['back', '🎒 Back']] as [typeof typeFilter, string][]).map(([v, lbl]) => (
          <TouchableOpacity
            key={String(v)}
            style={[styles.filterPill, typeFilter === v && styles.filterPillActive]}
            onPress={() => setTypeFilter(v)}>
            <Text style={[styles.filterPillTxt, typeFilter === v && styles.filterPillTxtActive]}>
              {lbl}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genFilterScroll}
        contentContainerStyle={styles.genFilterRow}>
        {([['all', 'All Gens'], [1, 'Gen 1'], [2, 'Gen 2'], [3, 'Gen 3']] as [typeof genFilter, string][]).map(([v, lbl]) => (
          <TouchableOpacity
            key={String(v)}
            style={[styles.filterPill, genFilter === v && styles.filterPillActive]}
            onPress={() => setGenFilter(v)}>
            <Text style={[styles.filterPillTxt, genFilter === v && styles.filterPillTxtActive]}>
              {lbl}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        numColumns={GRID_COLS}
        contentContainerStyle={styles.legendaryGrid}
        columnWrapperStyle={{gap: spacing.sm}}
        ListEmptyComponent={<Text style={styles.emptyTxt}>No legendaries found.</Text>}
        renderItem={({item}) => {
          const isSelected = selected.has(item.id);
          const icon = iconMap.get(item.id);
          const subLabel = item.weaponType ?? (item.slot ? `${item.armorWeight ?? ''} ${item.slot}`.trim() : item.type);
          return (
            <TouchableOpacity
              style={[styles.legendaryCard, isSelected && styles.legendaryCardSelected]}
              onPress={() => onToggle(item.id)}
              activeOpacity={0.75}>
              {isSelected && (
                <View style={styles.legendaryCheckBadge}>
                  <Text style={styles.legendaryCheck}>✓</Text>
                </View>
              )}
              {icon ? (
                <Image source={{uri: icon}} style={styles.legendaryIcon} resizeMode="contain" />
              ) : (
                <View style={styles.legendaryIconPlaceholder} />
              )}
              <Text style={styles.legendaryWeapon} numberOfLines={1}>{subLabel}</Text>
              <Text style={styles.legendaryName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.legendaryGen} numberOfLines={1}>
                {item.armorSet ? item.armorSet : `Gen ${item.generation}`}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function LegendaryCraftingScreen() {
  const {settings} = useAppStore();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [mainTab, setMainTab] = useState<'select' | 'plan'>('select');
  const {isLoading: invLoading} = useAllInventory();

  const toggle = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectedArray = useMemo(() => [...selectedIds], [selectedIds]);

  if (!settings.apiKey) {
    return (
      <View style={styles.container}>
        <Card style={styles.noKeyCard}>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyTxt}>
            Add your GW2 API key in Settings to use the legendary crafting planner.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header tabs */}
      <View style={styles.mainTabs}>
        <TouchableOpacity
          style={[styles.mainTab, mainTab === 'select' && styles.mainTabActive]}
          onPress={() => setMainTab('select')}>
          <Text style={[styles.mainTabTxt, mainTab === 'select' && styles.mainTabTxtActive]}>
            💎 Select
            {selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mainTab,
            mainTab === 'plan' && styles.mainTabActive,
            selectedIds.size === 0 && styles.mainTabDisabled,
          ]}
          onPress={() => selectedIds.size > 0 && setMainTab('plan')}>
          <Text style={[
            styles.mainTabTxt,
            mainTab === 'plan' && styles.mainTabTxtActive,
            selectedIds.size === 0 && styles.mainTabTxtDisabled,
          ]}>
            📋 Plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inventory loading note */}
      {invLoading && (
        <View style={styles.invLoadingBanner}>
          <ActivityIndicator color={colors.gold} size="small" />
          <Text style={styles.invLoadingTxt}>
            Loading your inventory from all characters…
          </Text>
        </View>
      )}

      {mainTab === 'select' ? (
        <View style={{flex: 1}}>
          <LegendaryPicker selected={selectedIds} onToggle={toggle} />
          {selectedIds.size > 0 && (
            <TouchableOpacity
              style={styles.planBtn}
              onPress={() => setMainTab('plan')}>
              <Text style={styles.planBtnTxt}>
                📋 Plan {selectedIds.size} Legendary{selectedIds.size > 1 ? 's' : ''} →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        selectedArray.length > 0 ? (
          <PlanView itemIds={selectedArray} />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyTxt}>Select at least one legendary first.</Text>
          </View>
        )
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GRID_COLS = 4;
const CARD_W = (SCREEN_W - spacing.md * 2 - spacing.sm * (GRID_COLS - 1)) / GRID_COLS;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  centered: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl},

  noKeyCard: {margin: spacing.md, alignItems: 'center', gap: spacing.sm},
  noKeyTitle: {color: colors.gold, fontSize: fontSize.lg, fontWeight: '700'},
  noKeyTxt: {color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center'},

  // main tabs
  mainTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.xs,
    gap: spacing.xs,
  },
  mainTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainTabActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  mainTabDisabled: {opacity: 0.4},
  mainTabTxt: {color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '700'},
  mainTabTxtActive: {color: '#000'},
  mainTabTxtDisabled: {color: colors.textMuted},

  invLoadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  invLoadingTxt: {color: colors.textMuted, fontSize: fontSize.xs},

  // legendary picker
  search: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
  },
  genFilterScroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: 48,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  genFilterRow: {
    height: 48,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    alignItems: 'center',
  },
  filterPill: {
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  filterPillTxt: {color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600'},
  filterPillTxtActive: {color: '#000'},

  legendaryGrid: {padding: spacing.md, gap: spacing.sm},
  legendaryCard: {
    width: CARD_W,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    paddingTop: spacing.sm,
    position: 'relative',
  },
  legendaryCardSelected: {borderColor: colors.gold, backgroundColor: colors.gold + '18'},
  legendaryCheckBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  legendaryCheck: {color: '#fff', fontSize: 10, fontWeight: '800'},
  legendaryIcon: {
    width: CARD_W - spacing.sm * 2,
    height: CARD_W - spacing.sm * 2,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.bg,
  },
  legendaryIconPlaceholder: {
    width: CARD_W - spacing.sm * 2,
    height: CARD_W - spacing.sm * 2,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.border,
  },
  legendaryWeapon: {color: colors.textMuted, fontSize: 9, fontWeight: '600', marginBottom: 1},
  legendaryName: {color: colors.text, fontSize: 10, fontWeight: '700', marginBottom: 2},
  legendaryGen: {color: colors.gold, fontSize: 9},

  planBtn: {
    margin: spacing.md,
    backgroundColor: colors.gold,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  planBtnTxt: {color: '#000', fontSize: fontSize.md, fontWeight: '800'},

  // plan sub-tabs
  planTabBar: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  planTabBarContent: {padding: spacing.xs, gap: spacing.xs},
  planTab: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planTabActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  planTabTxt: {color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600'},
  planTabTxtActive: {color: '#000'},

  loadingTxt: {color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', lineHeight: 22, marginTop: spacing.sm},
  emptyTxt: {color: colors.textMuted, fontSize: fontSize.md, textAlign: 'center', padding: spacing.xl},

  // shopping list
  shopBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shopBannerTxt: {color: colors.text, fontSize: fontSize.sm, fontWeight: '700'},
  shopBannerCost: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  shopControls: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shopSearch: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shopSectionHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderLeftWidth: 3,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
  },
  shopSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  shopList: {padding: spacing.sm, gap: spacing.sm},

  matRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  matRowLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1},
  matRowIcon: {width: 44, height: 44, borderRadius: radius.md},
  matRowInfo: {flex: 1},
  matRowName: {color: colors.text, fontSize: fontSize.md, fontWeight: '600'},
  matRowTags: {flexDirection: 'row', gap: spacing.xs, marginTop: 4, alignItems: 'center'},
  matRowRight: {alignItems: 'flex-end', gap: 4, minWidth: 90},
  matRowStatus: {fontSize: fontSize.md, fontWeight: '700'},
  matRowCost: {color: colors.textMuted, fontSize: fontSize.sm},
  matRowBar: {width: 70, height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden'},
  matRowBarFill: {height: '100%', borderRadius: 2},
  matRowExpand: {color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2},

  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.md + 14,
    borderLeftWidth: 3,
    marginLeft: spacing.sm,
    marginTop: 2,
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  subItemIcon: {width: 28, height: 28, borderRadius: radius.sm},
  subItemName: {flex: 1, color: colors.text, fontSize: fontSize.sm},
  subItemCount: {fontSize: fontSize.sm, fontWeight: '700'},

  sourceBadge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  sourceBadgeTxt: {fontSize: fontSize.xs, fontWeight: '700'},
  sourceBadgeSm: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sourceBadgeSmTxt: {fontSize: fontSize.xs, fontWeight: '700'},
  tgTag: {color: colors.gold, fontSize: fontSize.xs, fontWeight: '700'},

  // recipe tree
  treePlanBar: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  treePlanBarContent: {padding: spacing.xs, gap: spacing.xs},
  treePlanTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  treePlanTabActive: {backgroundColor: colors.gold + '22', borderColor: colors.gold},
  treePlanIcon: {width: 20, height: 20, borderRadius: 3},
  treePlanTxt: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', maxWidth: 120},
  treePlanTxtActive: {color: colors.gold},
  treeList: {padding: spacing.sm},
  treeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: spacing.sm,
  },
  treeConnector: {width: 3, height: 24, borderRadius: 2},
  treeIcon: {width: 28, height: 28, borderRadius: radius.sm},
  treeInfo: {flex: 1},
  treeName: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  treeSource: {fontSize: fontSize.xs},
  treeRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  treeHave: {fontSize: fontSize.sm, fontWeight: '700', minWidth: 50, textAlign: 'right'},
  treeExpand: {color: colors.textMuted, fontSize: fontSize.xs, width: 14},

  // timegate tab
  tgList: {padding: spacing.md, gap: spacing.sm},
  tgSummaryCard: {padding: spacing.md, gap: spacing.xs, alignItems: 'center'},
  tgSummaryTitle: {color: colors.textMuted, fontSize: fontSize.sm},
  tgSummaryDays: {color: colors.gold, fontSize: fontSize.xxl, fontWeight: '800'},
  tgSummaryNote: {color: colors.textMuted, fontSize: fontSize.xs, textAlign: 'center'},
  tgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  tgRowLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1},
  tgIcon: {width: 32, height: 32, borderRadius: radius.sm},
  tgName: {color: colors.text, fontSize: fontSize.sm, fontWeight: '700'},
  tgSource: {color: colors.textMuted, fontSize: fontSize.xs},
  tgRowRight: {alignItems: 'flex-end'},
  tgHave: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  tgDays: {fontSize: fontSize.sm, fontWeight: '800'},

  // summary tab
  summaryList: {padding: spacing.md, gap: spacing.md},
  summaryCard: {gap: spacing.sm},
  summaryCardTitle: {color: colors.gold, fontSize: fontSize.md, fontWeight: '800'},
  summaryValue: {color: colors.text, fontSize: fontSize.xl, fontWeight: '800'},
  summaryNote: {color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 20},
  summaryLeg: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4},
  summaryLegIcon: {width: 28, height: 28, borderRadius: 4},
  summaryLegName: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},

  timeBreakdown: {gap: spacing.xs},
  timeRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  timeLbl: {color: colors.textMuted, fontSize: fontSize.sm},
  timeVal: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  timeTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  timeTotalLbl: {color: colors.text, fontSize: fontSize.sm, fontWeight: '700'},
  timeTotalVal: {fontSize: fontSize.md, fontWeight: '800'},

  // material detail modal
  matModalRoot: {flex: 1, backgroundColor: colors.bg},
  matModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  matModalIcon: {width: 44, height: 44, borderRadius: radius.sm},
  matModalName: {color: colors.text, fontSize: fontSize.lg, fontWeight: '800', flex: 1},
  matModalBody: {padding: spacing.md, gap: spacing.md},
  matCard: {gap: spacing.sm},
  matCardTitle: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
  matCardRow: {flexDirection: 'row', gap: spacing.md},
  matStat: {flex: 1, alignItems: 'center'},
  matStatVal: {color: colors.text, fontSize: fontSize.lg, fontWeight: '800'},
  matStatLbl: {color: colors.textMuted, fontSize: fontSize.xs},
  pctBar: {height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden'},
  pctFill: {height: '100%', borderRadius: 2},
  pctTxt: {color: colors.textMuted, fontSize: fontSize.xs, textAlign: 'right'},
  matInfoSource: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '600'},
  matInfoDays: {fontSize: fontSize.md, fontWeight: '700'},
  matInfoNote: {color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 20},

  closeBtn: {
    width: 34, height: 34, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.border, borderRadius: radius.md,
  },
  closeBtnTxt: {color: colors.text, fontSize: fontSize.md, fontWeight: '700'},

  wikiBtn: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  wikiBtnTxt: {color: colors.gold, fontSize: fontSize.sm, fontWeight: '700'},
});
