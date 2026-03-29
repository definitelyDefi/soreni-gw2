import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {
  useCharacter,
  useCharacterInventory,
  useCharacterEquipment,
  useCharacterBuilds,
  useItems,
  useItemPrices,
  useSpecializations,
  useTraits,
  useSkills,
} from '../hooks/useGW2';
import ProfessionIcon from '../components/ui/ProfessionIcon';
import GoldDisplay from '../components/ui/GoldDisplay';
import RarityBadge from '../components/ui/RarityBadge';
import Card from '../components/ui/Card';
import {
  colors,
  fontSize,
  spacing,
  radius,
  rarity as rarityColors,
  profession as profColors,
} from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLOT_SIZE = (SCREEN_WIDTH - spacing.md * 2 - spacing.xs * 5) / 6;

type Tab = 'overview' | 'inventory' | 'equipment' | 'builds' | 'maps';

const ARMOR_SLOTS = ['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots'];
const TRINKET_SLOTS = ['Backpack', 'Accessory1', 'Accessory2', 'Amulet', 'Ring1', 'Ring2'];
const WEAPON_SET_A = ['WeaponA1', 'WeaponA2'];
const WEAPON_SET_B = ['WeaponB1', 'WeaponB2'];
const AQUATIC_SLOTS = ['HelmAquatic', 'WeaponAquaticA', 'WeaponAquaticB'];

const SLOT_LABELS: Record<string, string> = {
  Helm: 'Helm',
  Shoulders: 'Shoulders',
  Coat: 'Coat',
  Gloves: 'Gloves',
  Leggings: 'Leggings',
  Boots: 'Boots',
  WeaponA1: 'Main Hand',
  WeaponA2: 'Off Hand',
  WeaponB1: 'Alt Main',
  WeaponB2: 'Alt Off',
  HelmAquatic: 'Aqua Helm',
  WeaponAquaticA: 'Aqua A',
  WeaponAquaticB: 'Aqua B',
  Backpack: 'Back',
  Accessory1: 'Acc 1',
  Accessory2: 'Acc 2',
  Amulet: 'Amulet',
  Ring1: 'Ring 1',
  Ring2: 'Ring 2',
};

const ATTRIBUTE_NAMES: Record<string, string> = {
  Power: 'Power',
  Precision: 'Prec',
  Toughness: 'Tough',
  Vitality: 'Vit',
  CritDamage: 'Ferocity',
  ConditionDamage: 'Condi',
  Expertise: 'Expertise',
  Concentration: 'Boon Dur',
  HealingPower: 'Healing',
  AgonyResistance: 'AR',
};

function Skeleton({
  width,
  height,
  style,
}: {
  width?: number | string;
  height: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);
  return (
    <Animated.View
      style={[
        {
          width: width ?? '100%',
          height,
          backgroundColor: colors.border,
          borderRadius: radius.sm,
          opacity,
        },
        style,
      ]}
    />
  );
}

export default function CharacterDetailScreen({route, navigation}: any) {
  const {name} = route.params;
  const [tab, setTab] = useState<Tab>('overview');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  async function onRefresh() {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({queryKey: ['character', name]}),
      queryClient.invalidateQueries({queryKey: ['character_inventory', name]}),
      queryClient.invalidateQueries({queryKey: ['character_equipment', name]}),
      queryClient.invalidateQueries({queryKey: ['character_builds', name]}),
    ]);
    setIsRefreshing(false);
  }

  const {data: character, isLoading} = useCharacter(name);
  const {data: inventoryData, isLoading: inventoryLoading} = useCharacterInventory(name);
  const {data: equipmentTabs, isLoading: equipmentLoading} = useCharacterEquipment(name);
  const {data: buildTabs, isLoading: buildsLoading} = useCharacterBuilds(name);

  const profColor =
    profColors[character?.profession as keyof typeof profColors] ?? '#888';

  // Collect all item IDs
  const inventoryIds = useMemo(() => {
    if (!inventoryData) return [];
    return [
      ...new Set(
        inventoryData.bags
          ?.flatMap((b: any) => b?.inventory ?? [])
          .filter((i: any) => i?.id)
          .map((i: any) => i.id) ?? [],
      ),
    ] as number[];
  }, [inventoryData]);

  const equipmentIds = useMemo(() => {
    if (!equipmentTabs) return [];
    return [
      ...new Set(
        equipmentTabs.flatMap((t: any) =>
          (t?.equipment ?? []).filter((e: any) => e?.id).map((e: any) => e.id),
        ),
      ),
    ] as number[];
  }, [equipmentTabs]);

  const allIds = useMemo(
    () => [...new Set([...inventoryIds, ...equipmentIds])],
    [inventoryIds, equipmentIds],
  );
  const {data: itemDetails, isLoading: itemsLoading} = useItems(allIds);
  const {data: prices} = useItemPrices(allIds);

  const itemMap = useMemo(() => {
    const map = new Map<number, any>();
    itemDetails?.forEach(i => map.set(i.id, i));
    return map;
  }, [itemDetails]);

  const priceMap = useMemo(() => {
    const map = new Map<number, any>();
    prices?.forEach(p => map.set(p.id, p));
    return map;
  }, [prices]);

  const inventoryItems = useMemo(() => {
    if (!inventoryData) return [];
    return (
      inventoryData.bags
        ?.flatMap((b: any) => b?.inventory ?? [])
        .filter((i: any) => i?.id)
        .map((i: any) => ({
          ...i,
          item: itemMap.get(i.id),
          price: priceMap.get(i.id),
        })) ?? []
    );
  }, [inventoryData, itemMap, priceMap]);

  const totalInventoryValue = useMemo(
    () =>
      inventoryItems.reduce((sum: number, i: any) => {
        const sell = i.price?.sells?.unit_price ?? 0;
        return sum + sell * (i.count ?? 1);
      }, 0),
    [inventoryItems],
  );

  if (isLoading || !character) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {borderBottomColor: profColor}]}>
        <ProfessionIcon professionName={character.profession} size={48} />
        <View style={styles.headerInfo}>
          <Text style={styles.characterName}>{character.name}</Text>
          <Text style={[styles.profession, {color: profColor}]}>
            {character.profession}
          </Text>
          <Text style={styles.sub}>
            {character.race} • {character.gender} • Level {character.level}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statValue}>{character.deaths}</Text>
          <Text style={styles.statLabel}>Deaths</Text>
          <Text style={styles.statValue}>
            {Math.floor(character.age / 3600)}h
          </Text>
          <Text style={styles.statLabel}>Played</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabs}>
        {(['overview', 'inventory', 'equipment', 'builds', 'maps'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => {
              if (t === 'maps') {
                navigation.push('MapCompletion');
              } else {
                setTab(t);
              }
            }}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'maps' ? '🗺 Maps' : t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold}
          />
        }>
        {tab === 'overview' && (
          <OverviewTab character={character} profColor={profColor} />
        )}
        {tab === 'inventory' && (
          <InventoryTab
            items={inventoryItems}
            totalValue={totalInventoryValue}
            onSelect={setSelectedItem}
            isLoading={inventoryLoading || itemsLoading}
          />
        )}
        {tab === 'equipment' && (
          <EquipmentTab
            equipmentTabs={equipmentTabs ?? []}
            itemMap={itemMap}
            onSelect={setSelectedItem}
            isLoading={equipmentLoading || itemsLoading}
          />
        )}
        {tab === 'builds' && (
          <BuildsTab buildTabs={buildTabs} isLoading={buildsLoading} />
        )}
      </ScrollView>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </View>
  );
}

function OverviewTab({
  character,
  profColor,
}: {
  character: any;
  profColor: string;
}) {
  return (
    <View style={styles.overviewContainer}>
      {/* Crafting */}
      {character.crafting?.length > 0 && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>⚒️ Crafting Disciplines</Text>
          <View style={styles.craftingGrid}>
            {character.crafting.map((c: any) => (
              <View
                key={c.discipline}
                style={[
                  styles.craftItem,
                  !c.active && styles.craftItemInactive,
                ]}>
                <Text
                  style={[
                    styles.craftName,
                    !c.active && {color: colors.textMuted},
                  ]}>
                  {c.discipline}
                </Text>
                <Text
                  style={[
                    styles.craftRating,
                    {color: c.active ? colors.gold : colors.textMuted},
                  ]}>
                  {c.rating}
                </Text>
                {!c.active && (
                  <Text style={styles.craftInactiveTag}>inactive</Text>
                )}
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Backstory */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>📊 Character Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Total Deaths</Text>
          <Text style={styles.statRowValue}>{character.deaths}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Time Played</Text>
          <Text style={styles.statRowValue}>
            {Math.floor(character.age / 3600)}h{' '}
            {Math.floor((character.age % 3600) / 60)}m
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Created</Text>
          <Text style={styles.statRowValue}>
            {new Date(character.created).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Commander</Text>
          <Text style={styles.statRowValue}>
            {character.commander ? '✓ Yes' : '✗ No'}
          </Text>
        </View>
      </Card>
    </View>
  );
}

function InventoryTab({
  items,
  totalValue,
  onSelect,
  isLoading,
}: {
  items: any[];
  totalValue: number;
  onSelect: (item: any) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <View>
        <View style={styles.inventoryHeader}>
          <Skeleton width={80} height={13} />
          <Skeleton width={110} height={13} />
        </View>
        <View style={styles.grid}>
          {Array.from({length: 24}).map((_, i) => (
            <Skeleton key={i} width={SLOT_SIZE} height={SLOT_SIZE} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.inventoryHeader}>
        <Text style={styles.inventoryCount}>{items.length} items</Text>
        <View style={styles.inventoryValue}>
          <Text style={styles.inventoryValueLabel}>Value: </Text>
          <GoldDisplay copper={totalValue} size="sm" />
        </View>
      </View>
      <View style={styles.grid}>
        {items.map((item, index) => {
          const borderColor =
            rarityColors[item.item?.rarity as keyof typeof rarityColors] ??
            colors.border;
          return (
            <TouchableOpacity
              key={`${item.id}_${index}`}
              style={[styles.slot, {borderColor}]}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}>
              {item.item?.icon ? (
                <Image
                  source={{uri: item.item.icon}}
                  style={styles.slotIcon}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.slotPlaceholder}>
                  <Text style={styles.slotPlaceholderText}>?</Text>
                </View>
              )}
              {item.count > 1 && (
                <Text style={styles.slotCount}>
                  {item.count > 999 ? '999+' : item.count}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function EquipmentTab({
  equipmentTabs,
  itemMap,
  onSelect,
  isLoading,
}: {
  equipmentTabs: any[];
  itemMap: Map<number, any>;
  onSelect: (item: any) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <View style={eq.container}>
        <Card style={eq.gridCard}>
          <View style={eq.gridRow}>
            {[0, 1].map(col => (
              <View key={col} style={eq.column}>
                <Skeleton height={12} style={{marginBottom: 6}} />
                {Array.from({length: 6}).map((_, i) => (
                  <View key={i} style={eq.slotCell}>
                    <Skeleton width={EQ_ICON} height={EQ_ICON} />
                    <Skeleton height={10} style={{flex: 1}} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Card>
        <Card style={eq.sectionCard}>
          <Skeleton height={12} width={70} />
          <View style={eq.weaponsGrid}>
            {[0, 1].map(col => (
              <View key={col} style={eq.weaponSet}>
                <Skeleton height={10} width={40} />
                {Array.from({length: 2}).map((_, i) => (
                  <View key={i} style={eq.slotCell}>
                    <Skeleton width={EQ_ICON} height={EQ_ICON} />
                    <Skeleton height={10} style={{flex: 1}} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Card>
        <Card style={eq.sectionCard}>
          <Skeleton height={12} width={60} />
          <View style={eq.aquaticRow}>
            {Array.from({length: 3}).map((_, i) => (
              <View key={i} style={eq.slotCell}>
                <Skeleton width={EQ_ICON} height={EQ_ICON} />
                <Skeleton height={10} width={50} />
              </View>
            ))}
          </View>
        </Card>
      </View>
    );
  }
  const [selectedTab, setSelectedTab] = useState(() => {
    const idx = equipmentTabs.findIndex((t: any) => t.is_active);
    return idx >= 0 ? idx : 0;
  });

  const currentTab = equipmentTabs[selectedTab];
  const slotMap = useMemo(() => {
    const map = new Map<string, any>();
    (currentTab?.equipment ?? []).forEach((e: any) => {
      map.set(e.slot, {...e, item: itemMap.get(e.id)});
    });
    return map;
  }, [currentTab, itemMap]);

  function renderSlot(slot: string) {
    const equipped = slotMap.get(slot);
    const item = equipped?.item;
    const borderColor = item
      ? rarityColors[item.rarity as keyof typeof rarityColors] ?? colors.border
      : colors.border;
    return (
      <TouchableOpacity
        key={slot}
        style={eq.slotCell}
        onPress={() => equipped && onSelect(equipped)}
        activeOpacity={equipped ? 0.7 : 1}>
        <View style={[eq.slotIcon, {borderColor}]}>
          {item?.icon ? (
            <Image
              source={{uri: item.icon}}
              style={eq.slotIconImg}
              resizeMode="contain"
            />
          ) : (
            <Text style={eq.slotEmpty}>—</Text>
          )}
        </View>
        <Text style={eq.slotLabel} numberOfLines={1}>
          {SLOT_LABELS[slot]}
        </Text>
      </TouchableOpacity>
    );
  }

  if (!equipmentTabs || equipmentTabs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No equipment data</Text>
      </View>
    );
  }

  return (
    <View style={eq.container}>
      {/* Tab switcher */}
      {equipmentTabs.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={eq.tabBar}>
          {equipmentTabs.map((t: any, i: number) => (
            <TouchableOpacity
              key={t.tab}
              style={[eq.tabBtn, selectedTab === i && eq.tabBtnActive]}
              onPress={() => setSelectedTab(i)}>
              <Text
                style={[
                  eq.tabBtnText,
                  selectedTab === i && eq.tabBtnTextActive,
                ]}>
                {t.name || `Tab ${t.tab}`}
              </Text>
              {t.is_active && <View style={eq.activeDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Armor + Trinkets grid */}
      <Card style={eq.gridCard}>
        <View style={eq.gridRow}>
          <View style={eq.column}>
            <Text style={eq.columnLabel}>Armor</Text>
            {ARMOR_SLOTS.map(renderSlot)}
          </View>
          <View style={eq.columnDivider} />
          <View style={eq.column}>
            <Text style={eq.columnLabel}>Trinkets</Text>
            {TRINKET_SLOTS.map(renderSlot)}
          </View>
        </View>
      </Card>

      {/* Weapons */}
      <Card style={eq.sectionCard}>
        <Text style={eq.columnLabel}>Weapons</Text>
        <View style={eq.weaponsGrid}>
          <View style={eq.weaponSet}>
            <Text style={eq.weaponSetLabel}>Set A</Text>
            {WEAPON_SET_A.map(renderSlot)}
          </View>
          <View style={eq.columnDivider} />
          <View style={eq.weaponSet}>
            <Text style={eq.weaponSetLabel}>Set B</Text>
            {WEAPON_SET_B.map(renderSlot)}
          </View>
        </View>
      </Card>

      {/* Aquatic */}
      <Card style={eq.sectionCard}>
        <Text style={eq.columnLabel}>Aquatic</Text>
        <View style={eq.aquaticRow}>
          {AQUATIC_SLOTS.map(renderSlot)}
        </View>
      </Card>
    </View>
  );
}

const EQ_ICON = 50;

const eq = StyleSheet.create({
  container: {gap: spacing.md},
  tabBar: {gap: spacing.xs, paddingBottom: spacing.xs},
  tabBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabBtnActive: {borderColor: colors.gold, backgroundColor: colors.gold + '22'},
  tabBtnText: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600'},
  tabBtnTextActive: {color: colors.gold},
  activeDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green},
  gridCard: {padding: spacing.sm},
  sectionCard: {padding: spacing.sm, gap: spacing.sm},
  gridRow: {flexDirection: 'row', gap: spacing.sm},
  column: {flex: 1, gap: spacing.xs},
  columnLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 2,
  },
  columnDivider: {width: 1, backgroundColor: colors.border, marginVertical: 4},
  slotCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 2,
  },
  slotIcon: {
    width: EQ_ICON,
    height: EQ_ICON,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  slotIconImg: {width: EQ_ICON - 4, height: EQ_ICON - 4},
  slotEmpty: {color: colors.border, fontSize: fontSize.md},
  slotLabel: {color: colors.textMuted, fontSize: 10, flex: 1},
  weaponsGrid: {flexDirection: 'row', gap: spacing.sm},
  weaponSet: {flex: 1, gap: spacing.xs},
  weaponSetLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  aquaticRow: {flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap'},
});

function BuildsTab({buildTabs, isLoading}: {buildTabs: any[]; isLoading: boolean}) {
  const specIds = useMemo(() => {
    const ids: number[] = [];
    buildTabs?.forEach(t =>
      t.build?.specializations?.forEach(
        (s: any) => s?.id && ids.push(s.id),
      ),
    );
    return [...new Set(ids)];
  }, [buildTabs]);

  const traitIds = useMemo(() => {
    const ids: number[] = [];
    buildTabs?.forEach(t =>
      t.build?.specializations?.forEach((s: any) =>
        s?.traits?.filter(Boolean).forEach((id: number) => ids.push(id)),
      ),
    );
    return [...new Set(ids)];
  }, [buildTabs]);

  const skillIds = useMemo(() => {
    const ids: number[] = [];
    buildTabs?.forEach(t => {
      const sk = t.build?.skills;
      if (!sk) return;
      if (sk.heal) ids.push(sk.heal);
      sk.utilities?.filter(Boolean).forEach((id: number) => ids.push(id));
      if (sk.elite) ids.push(sk.elite);
    });
    return [...new Set(ids)];
  }, [buildTabs]);

  const {data: specsData} = useSpecializations(specIds);
  const {data: traitsData} = useTraits(traitIds);
  const {data: skillsData} = useSkills(skillIds);

  const specMap = useMemo(() => {
    const map = new Map<number, any>();
    specsData?.forEach((s: any) => map.set(s.id, s));
    return map;
  }, [specsData]);

  const traitMap = useMemo(() => {
    const map = new Map<number, any>();
    traitsData?.forEach((t: any) => map.set(t.id, t));
    return map;
  }, [traitsData]);

  const skillMap = useMemo(() => {
    const map = new Map<number, any>();
    skillsData?.forEach((s: any) => map.set(s.id, s));
    return map;
  }, [skillsData]);

  if (isLoading) {
    return (
      <View style={bs.container}>
        {Array.from({length: 3}).map((_, i) => (
          <Card key={i} style={[bs.card, {padding: spacing.md, gap: spacing.md}]}>
            <Skeleton height={16} width={140} />
            {Array.from({length: 3}).map((__, j) => (
              <Skeleton key={j} height={110} />
            ))}
            <View style={{flexDirection: 'row', gap: spacing.xs}}>
              {Array.from({length: 5}).map((__, j) => (
                <Skeleton key={j} width={44} height={44} />
              ))}
            </View>
          </Card>
        ))}
      </View>
    );
  }

  if (!buildTabs || buildTabs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No build data available</Text>
      </View>
    );
  }

  return (
    <View style={bs.container}>
      {buildTabs.map((tab: any) => {
        const build = tab.build;
        const sk = build?.skills;
        const skillsList: {id: number; label: string}[] = sk
          ? [
              {id: sk.heal, label: 'Heal'},
              ...(sk.utilities ?? [])
                .filter(Boolean)
                .map((id: number, i: number) => ({id, label: `Util ${i + 1}`})),
              {id: sk.elite, label: 'Elite'},
            ].filter(s => s.id)
          : [];

        return (
          <Card key={tab.tab} style={bs.card}>
            <View style={bs.header}>
              <Text style={bs.buildName} numberOfLines={1}>
                {build?.name || `Build ${tab.tab}`}
              </Text>
              {tab.is_active && (
                <View style={bs.activeBadge}>
                  <Text style={bs.activeBadgeText}>ACTIVE</Text>
                </View>
              )}
            </View>

            {build && (
              <>
                {/* Specializations */}
                {build.specializations?.filter((s: any) => s?.id).length >
                  0 && (
                  <View style={bs.section}>
                    <Text style={bs.sectionLabel}>Specializations</Text>
                    {build.specializations
                      .filter((s: any) => s?.id)
                      .map((spec: any) => {
                        const specData = specMap.get(spec.id);
                        const chosenTraits = (spec.traits ?? [])
                          .filter(Boolean)
                          .map((id: number) => traitMap.get(id));
                        return (
                          <View key={spec.id} style={bs.specBlock}>
                            <ImageBackground
                              source={
                                specData?.background
                                  ? {uri: specData.background}
                                  : undefined
                              }
                              style={bs.specBg}
                              imageStyle={bs.specBgImage}>
                              <View style={bs.specOverlay}>
                                <View style={bs.specHeader}>
                                  {specData?.icon ? (
                                    <Image
                                      source={{uri: specData.icon}}
                                      style={bs.specIcon}
                                    />
                                  ) : null}
                                  <Text style={bs.specName} numberOfLines={1}>
                                    {specData?.name ?? `Spec ${spec.id}`}
                                  </Text>
                                  {specData?.elite && (
                                    <View style={bs.eliteTag}>
                                      <Text style={bs.eliteTagText}>ELITE</Text>
                                    </View>
                                  )}
                                </View>
                                <View style={bs.traitsRow}>
                                  {chosenTraits.map(
                                    (trait: any, i: number) => (
                                      <View key={i} style={bs.traitBox}>
                                        {trait?.icon ? (
                                          <Image
                                            source={{uri: trait.icon}}
                                            style={bs.traitIcon}
                                          />
                                        ) : (
                                          <View style={bs.traitIconEmpty} />
                                        )}
                                        <Text
                                          style={bs.traitName}
                                          numberOfLines={2}>
                                          {trait?.name ?? ''}
                                        </Text>
                                      </View>
                                    ),
                                  )}
                                </View>
                              </View>
                            </ImageBackground>
                          </View>
                        );
                      })}
                  </View>
                )}

                {/* Skills */}
                {skillsList.length > 0 && (
                  <View style={bs.skillsSection}>
                    <Text style={bs.sectionLabel}>Skills</Text>
                    <View style={bs.skillsRow}>
                      {skillsList.map(({id, label}, i) => {
                        const skill = skillMap.get(id);
                        return (
                          <View key={i} style={bs.skillBox}>
                            {skill?.icon ? (
                              <Image
                                source={{uri: skill.icon}}
                                style={bs.skillIcon}
                                resizeMode="contain"
                              />
                            ) : (
                              <View style={bs.skillIconEmpty} />
                            )}
                            <Text style={bs.skillName} numberOfLines={2}>
                              {skill?.name ?? label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </>
            )}
          </Card>
        );
      })}
    </View>
  );
}

const bs = StyleSheet.create({
  container: {gap: spacing.md},
  card: {gap: 0, padding: 0, overflow: 'hidden'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  buildName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  activeBadgeText: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '800',
  },
  section: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  specBlock: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  specBg: {minHeight: 110},
  specBgImage: {opacity: 0.45},
  specOverlay: {
    flex: 1,
    backgroundColor: '#00000090',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  specHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  specIcon: {width: 28, height: 28},
  specName: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '700',
    flex: 1,
    textShadowColor: '#000',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  eliteTag: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  eliteTagText: {color: '#000', fontSize: 9, fontWeight: '800'},
  traitsRow: {flexDirection: 'row', gap: spacing.sm},
  traitBox: {flex: 1, alignItems: 'center', gap: 4},
  traitIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: '#ffffff44',
  },
  traitIconEmpty: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: '#ffffff18',
  },
  traitName: {
    color: '#ffffffcc',
    fontSize: 9,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  skillsSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  skillsRow: {flexDirection: 'row', gap: spacing.xs},
  skillBox: {flex: 1, alignItems: 'center', gap: 3},
  skillIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  skillIconEmpty: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  skillName: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
  },
});

function ItemModal({item, onClose}: {item: any; onClose: () => void}) {
  if (!item) return null;
  const itemData = item.item ?? item;
  const borderColor =
    rarityColors[itemData?.rarity as keyof typeof rarityColors] ??
    colors.border;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={[styles.modal, {borderColor}]}>
          <View style={styles.modalHeader}>
            {itemData?.icon && (
              <Image
                source={{uri: itemData.icon}}
                style={styles.modalIcon}
                resizeMode="contain"
              />
            )}
            <View style={styles.modalTitleBlock}>
              <Text
                style={[styles.modalName, {color: borderColor}]}
                numberOfLines={2}>
                {itemData?.name ?? `Item #${item.id}`}
              </Text>
              {itemData?.rarity && (
                <RarityBadge rarityName={itemData.rarity} size="sm" />
              )}
            </View>
          </View>

          {itemData?.description ? (
            <Text style={styles.modalDesc} numberOfLines={3}>
              {itemData.description}
            </Text>
          ) : null}

          <View style={styles.modalDivider} />

          {item.count && (
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Count</Text>
              <Text style={styles.modalValue}>×{item.count}</Text>
            </View>
          )}

          {item.slot && (
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Slot</Text>
              <Text style={styles.modalValue}>
                {SLOT_LABELS[item.slot] ?? item.slot}
              </Text>
            </View>
          )}

          {item.stats?.attributes &&
            Object.entries(item.stats.attributes).map(([key, val]) => (
              <View key={key} style={styles.modalRow}>
                <Text style={styles.modalLabel}>
                  {ATTRIBUTE_NAMES[key] ?? key}
                </Text>
                <Text style={[styles.modalValue, {color: colors.green}]}>
                  +{val as number}
                </Text>
              </View>
            ))}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyText: {color: colors.textMuted, fontSize: fontSize.md},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
  },
  headerInfo: {flex: 1, gap: 2},
  characterName: {color: colors.text, fontSize: fontSize.lg, fontWeight: '800'},
  profession: {fontSize: fontSize.sm, fontWeight: '600'},
  sub: {color: colors.textMuted, fontSize: fontSize.xs},
  stats: {alignItems: 'center', gap: 2},
  statValue: {color: colors.gold, fontSize: fontSize.md, fontWeight: '800'},
  statLabel: {color: colors.textMuted, fontSize: fontSize.xs},
  tabsScroll: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabs: {
    flexDirection: 'row',
    padding: spacing.xs,
    gap: spacing.xs,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 72,
  },
  tabActive: {backgroundColor: colors.gold, borderColor: colors.gold},
  tabText: {color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600'},
  tabTextActive: {color: '#000'},
  content: {padding: spacing.md, gap: spacing.md},
  overviewContainer: {gap: spacing.md},
  card: {gap: spacing.sm},
  cardTitle: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  craftingGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  craftItem: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minWidth: 80,
  },
  craftItemInactive: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  craftName: {color: colors.text, fontSize: fontSize.xs, fontWeight: '600'},
  craftRating: {fontSize: fontSize.md, fontWeight: '800'},
  craftInactiveTag: {color: colors.textMuted, fontSize: 9},
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statRowLabel: {color: colors.textMuted, fontSize: fontSize.sm},
  statRowValue: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inventoryCount: {color: colors.textMuted, fontSize: fontSize.sm},
  inventoryValue: {flexDirection: 'row', alignItems: 'center'},
  inventoryValueLabel: {color: colors.textMuted, fontSize: fontSize.sm},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs},
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  slotIcon: {width: SLOT_SIZE - 4, height: SLOT_SIZE - 4},
  slotPlaceholder: {
    width: SLOT_SIZE - 4,
    height: SLOT_SIZE - 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  slotPlaceholderText: {color: colors.textMuted, fontSize: fontSize.md},
  slotCount: {
    position: 'absolute',
    bottom: 1,
    right: 2,
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  equipmentContainer: {gap: spacing.sm},
  equipSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  equipIcon: {
    width: 44,
    height: 44,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  equipIconImage: {width: 40, height: 40},
  equipInfo: {flex: 1},
  equipSlotLabel: {color: colors.textMuted, fontSize: fontSize.xs},
  equipItemName: {fontSize: fontSize.sm, fontWeight: '600'},
  equipEmpty: {color: colors.textMuted, fontSize: fontSize.xs},
  equipStats: {alignItems: 'flex-end', gap: 2},
  equipStat: {color: colors.green, fontSize: 10},
  buildsContainer: {gap: spacing.md},
  buildCard: {gap: spacing.sm},
  buildHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buildTitle: {color: colors.text, fontSize: fontSize.md, fontWeight: '700'},
  activeBuildBadge: {
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  activeBuildText: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '800',
  },
  buildSection: {gap: spacing.xs},
  buildSectionTitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  specRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  specId: {color: colors.text, fontSize: fontSize.xs, width: 50},
  traitRow: {flexDirection: 'row', gap: spacing.xs},
  traitChip: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  traitId: {color: colors.textMuted, fontSize: 10},
  skillsRow: {flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap'},
  skillChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.xs,
    alignItems: 'center',
    minWidth: 44,
  },
  skillLabel: {color: colors.textMuted, fontSize: 9},
  skillId: {color: colors.text, fontSize: fontSize.xs, fontWeight: '600'},
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing.md,
    width: '100%',
    gap: spacing.sm,
  },
  modalHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  modalIcon: {width: 56, height: 56, borderRadius: radius.sm},
  modalTitleBlock: {flex: 1, gap: 4},
  modalName: {fontSize: fontSize.md, fontWeight: '700'},
  modalDesc: {color: colors.textMuted, fontSize: fontSize.xs, lineHeight: 16},
  modalDivider: {height: 1, backgroundColor: colors.border},
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {color: colors.textMuted, fontSize: fontSize.sm},
  modalValue: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
  closeBtn: {
    backgroundColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  closeBtnText: {color: colors.text, fontSize: fontSize.sm, fontWeight: '600'},
});
