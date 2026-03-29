import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import {useBank, useMaterials, useItems, useItemPrices} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import GoldDisplay from '../components/ui/GoldDisplay';
import RarityBadge from '../components/ui/RarityBadge';
import {SkeletonGrid} from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import Card from '../components/ui/Card';
import {
  colors,
  fontSize,
  spacing,
  radius,
  rarity as rarityColors,
} from '../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLS = 6;
const SLOT_SIZE =
  (SCREEN_WIDTH - spacing.md * 2 - spacing.xs * (COLS - 1)) / COLS;

type Tab = 'bank' | 'materials';

interface InventoryItem {
  id: number;
  count: number;
  name: string;
  rarity: string;
  type: string;
  icon?: string;
  sellPrice: number;
  buyPrice: number;
  totalValue: number;
}

export default function InventoryScreen() {
  const [tab, setTab] = useState<Tab>('bank');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const {settings} = useAppStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: bank,
    isLoading: bankLoading,
    error: bankError,
    refetch: refetchBank,
  } = useBank();
  const {
    data: materials,
    isLoading: materialsLoading,
    error: materialsError,
    refetch: refetchMaterials,
  } = useMaterials();

  async function onRefresh() {
    setIsRefreshing(true);
    await Promise.all([refetchBank(), refetchMaterials()]);
    setIsRefreshing(false);
  }

  const error = tab === 'bank' ? bankError : materialsError;
  const refetch = tab === 'bank' ? refetchBank : refetchMaterials;

  const rawItems = tab === 'bank' ? bank : materials;
  const isLoading = tab === 'bank' ? bankLoading : materialsLoading;

  const itemIds = useMemo(() => {
    if (!rawItems) return [];
    return [
      ...new Set(rawItems.filter((i: any) => i && i.id).map((i: any) => i.id)),
    ] as number[];
  }, [rawItems]);

  const {data: itemDetails} = useItems(itemIds);
  const {data: prices} = useItemPrices(itemIds);

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

  const inventoryItems: InventoryItem[] = useMemo(() => {
    if (!rawItems) return [];
    return rawItems
      .filter((i: any) => i && i.id)
      .map((i: any) => {
        const item = itemMap.get(i.id);
        const price = priceMap.get(i.id);
        const sellPrice = price?.sells?.unit_price ?? 0;
        const buyPrice = price?.buys?.unit_price ?? 0;
        return {
          id: i.id,
          count: i.count ?? 1,
          name: item?.name ?? `Item #${i.id}`,
          rarity: item?.rarity ?? 'Basic',
          type: item?.type ?? '',
          icon: item?.icon,
          sellPrice,
          buyPrice,
          totalValue: sellPrice * (i.count ?? 1),
        };
      })
      .filter(
        (i: InventoryItem) =>
          search === '' || i.name.toLowerCase().includes(search.toLowerCase()),
      );
  }, [rawItems, itemMap, priceMap, search]);

  const totalValue = useMemo(
    () => inventoryItems.reduce((sum, i) => sum + i.totalValue, 0),
    [inventoryItems],
  );

  if (!settings.apiKey) {
    return (
      <View style={styles.container}>
        <Card style={styles.noKeyCard}>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyText}>
            Go to Settings and enter your API key.
          </Text>
        </Card>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.tabs}>
            {(['bank', 'materials'] as Tab[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, tab === t && styles.tabActive]}
                onPress={() => setTab(t)}>
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                  {t === 'bank' ? '🏦 Bank' : '🧱 Materials'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ErrorMessage error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabs}>
          {(['bank', 'materials'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'bank' ? '🏦 Bank' : '🧱 Materials'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total value:</Text>
          <GoldDisplay copper={totalValue} size="sm" />
        </View>
      </View>

      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search items..."
        placeholderTextColor={colors.textMuted}
      />

      {isLoading ? (
        <SkeletonGrid count={30} />
      ) : (
        <FlatList
          data={inventoryItems}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          numColumns={COLS}
          renderItem={({item}) => (
            <ItemSlot item={item} onPress={() => setSelected(item)} />
          )}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={styles.empty}>No items found</Text>}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.gold}
            />
          }
        />
      )}

      <ItemModal item={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

function ItemSlot({item, onPress}: {item: InventoryItem; onPress: () => void}) {
  const borderColor =
    rarityColors[item.rarity as keyof typeof rarityColors] ?? rarityColors.Fine;

  return (
    <TouchableOpacity
      style={[styles.slot, {borderColor}]}
      onPress={onPress}
      activeOpacity={0.7}>
      {item.icon ? (
        <Image
          source={{uri: item.icon}}
          style={styles.icon}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.iconPlaceholder}>
          <Text style={styles.iconPlaceholderText}>?</Text>
        </View>
      )}
      {item.count > 1 && (
        <Text style={styles.count}>
          {item.count > 999 ? '999+' : item.count}
        </Text>
      )}
      {item.sellPrice > 0 && <View style={styles.valueDot} />}
    </TouchableOpacity>
  );
}

function ItemModal({
  item,
  onClose,
}: {
  item: InventoryItem | null;
  onClose: () => void;
}) {
  if (!item) return null;
  const borderColor =
    rarityColors[item.rarity as keyof typeof rarityColors] ?? rarityColors.Fine;

  return (
    <Modal
      visible={!!item}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={[styles.modal, {borderColor}]}>
          <View style={styles.modalHeader}>
            {item.icon && (
              <Image
                source={{uri: item.icon}}
                style={styles.modalIcon}
                resizeMode="contain"
              />
            )}
            <View style={styles.modalTitleBlock}>
              <Text style={[styles.modalName, {color: borderColor}]}>
                {item.name}
              </Text>
              <RarityBadge rarityName={item.rarity} size="sm" />
            </View>
          </View>

          {item.type ? <Text style={styles.modalType}>{item.type}</Text> : null}

          <View style={styles.modalDivider} />

          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Count</Text>
            <Text style={styles.modalValue}>×{item.count}</Text>
          </View>

          {item.sellPrice > 0 && (
            <>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Sell price</Text>
                <GoldDisplay copper={item.sellPrice} size="sm" />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Buy price</Text>
                <GoldDisplay copper={item.buyPrice} size="sm" />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Total value</Text>
                <GoldDisplay copper={item.totalValue} size="sm" />
              </View>
            </>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  search: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  grid: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  row: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
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
  icon: {
    width: SLOT_SIZE - 4,
    height: SLOT_SIZE - 4,
  },
  iconPlaceholder: {
    width: SLOT_SIZE - 4,
    height: SLOT_SIZE - 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  iconPlaceholderText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  count: {
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
  valueDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  empty: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
  },
  modalTitleBlock: {
    flex: 1,
    gap: 4,
  },
  modalName: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  modalType: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  modalValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  closeBtnText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  noKeyCard: {
    margin: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  noKeyTitle: {
    color: colors.gold,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  noKeyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
