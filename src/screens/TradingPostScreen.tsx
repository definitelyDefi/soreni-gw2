import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import {
  useTPDelivery,
  useTPCurrentBuys,
  useTPCurrentSells,
  useTPHistoryBuys,
  useTPHistorySells,
  useItems,
  useItemPrices,
  useGemsForCoins,
  useCoinsForGems,
} from '../hooks/useGW2';
import {useAppStore} from '../store/appStore';
import GoldDisplay from '../components/ui/GoldDisplay';
import {SkeletonCard, SkeletonRow} from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';
import Card from '../components/ui/Card';
import {colors, fontSize, spacing, radius, rarity as rarityColors} from '../constants/theme';
import {formatGold, formatProfit} from '../utils/currency';
import {TPTransaction} from '../types';

type MainTab = 'delivery' | 'orders' | 'history' | 'watchlist' | 'tools';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ItemIcon({
  icon,
  rarity,
  size = 40,
}: {
  icon?: string;
  rarity?: string;
  size?: number;
}) {
  const borderColor =
    rarityColors[(rarity ?? 'Fine') as keyof typeof rarityColors] ??
    rarityColors.Fine;
  if (icon) {
    return (
      <Image
        source={{uri: icon}}
        style={[
          styles.itemIcon,
          {width: size, height: size, borderColor, borderRadius: radius.sm},
        ]}
        resizeMode="contain"
      />
    );
  }
  return (
    <View
      style={[
        styles.itemIconPlaceholder,
        {width: size, height: size, borderColor, borderRadius: radius.sm},
      ]}>
      <Text style={styles.iconQ}>?</Text>
    </View>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
}

function ProfitBadge({copper}: {copper: number}) {
  const positive = copper >= 0;
  const {gold, silver, copper: c} = formatGold(Math.abs(copper));
  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (c > 0 || parts.length === 0) parts.push(`${c}c`);
  return (
    <View
      style={[
        styles.profitBadge,
        {backgroundColor: positive ? '#1a3320' : '#331a1a'},
      ]}>
      <Text
        style={[
          styles.profitBadgeText,
          {color: positive ? colors.green : colors.red},
        ]}>
        {positive ? '+' : '-'}
        {parts.join(' ')}
      </Text>
    </View>
  );
}

// ─── Delivery Tab ─────────────────────────────────────────────────────────────

function DeliveryTab({onRefresh, refreshing}: {onRefresh: () => void; refreshing: boolean}) {
  const {data, isLoading, error, refetch} = useTPDelivery();
  const itemIds = useMemo(() => data?.items.map(i => i.id) ?? [], [data]);
  const {data: itemDetails} = useItems(itemIds);

  const itemMap = useMemo(() => {
    const m = new Map<number, any>();
    itemDetails?.forEach(i => m.set(i.id, i));
    return m;
  }, [itemDetails]);

  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <SkeletonCard style={styles.skeletonMd} />
        <SkeletonCard style={styles.skeletonSm} />
      </ScrollView>
    );
  }
  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  const pendingGold = data?.coins ?? 0;
  const pendingItems = data?.items ?? [];
  const hasDelivery = pendingGold > 0 || pendingItems.length > 0;

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.gold}
        />
      }>
      {/* Status banner */}
      {hasDelivery ? (
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>📬</Text>
          <View style={{flex: 1}}>
            <Text style={styles.alertTitle}>Items waiting for pickup!</Text>
            <Text style={styles.alertSub}>
              Log in and collect from the Trading Post.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.clearBanner}>
          <Text style={styles.clearIcon}>✅</Text>
          <Text style={styles.clearText}>Delivery box is empty. Nothing to collect.</Text>
        </View>
      )}

      {/* Pending gold */}
      {pendingGold > 0 && (
        <Card style={styles.deliveryCard} padded>
          <Text style={styles.cardLabel}>Gold waiting</Text>
          <GoldDisplay copper={pendingGold} size="lg" />
          <Text style={styles.cardHint}>
            This gold is sitting in your TP mailbox.
          </Text>
        </Card>
      )}

      {/* Pending items */}
      {pendingItems.length > 0 && (
        <Card style={styles.card} padded>
          <Text style={styles.cardTitle}>
            Items ({pendingItems.length})
          </Text>
          {pendingItems.map((slot, idx) => {
            const item = itemMap.get(slot.id);
            const rarityColor =
              rarityColors[(item?.rarity ?? 'Fine') as keyof typeof rarityColors] ??
              rarityColors.Fine;
            return (
              <View key={idx} style={styles.deliveryItemRow}>
                <ItemIcon icon={item?.icon} rarity={item?.rarity} size={40} />
                <View style={styles.itemInfo}>
                  <Text
                    style={[styles.itemName, {color: rarityColor}]}
                    numberOfLines={1}>
                    {item?.name ?? `Item #${slot.id}`}
                  </Text>
                  {item?.rarity && (
                    <Text style={styles.itemRarity}>{item.rarity}</Text>
                  )}
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>×{slot.count}</Text>
                </View>
              </View>
            );
          })}
        </Card>
      )}

      {!hasDelivery && (
        <Card style={styles.card} padded>
          <Text style={styles.emptyHint}>
            Sold items and collected gold will appear here.
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({onRefresh, refreshing}: {onRefresh: () => void; refreshing: boolean}) {
  const [subTab, setSubTab] = useState<'sells' | 'buys'>('sells');
  const {data: sells, isLoading: sellsLoading, error: sellsError, refetch: refetchSells} =
    useTPCurrentSells();
  const {data: buys, isLoading: buysLoading, error: buysError, refetch: refetchBuys} =
    useTPCurrentBuys();

  const allIds = useMemo(() => {
    const ids = new Set<number>();
    sells?.forEach(t => ids.add(t.item_id));
    buys?.forEach(t => ids.add(t.item_id));
    return [...ids];
  }, [sells, buys]);

  const {data: itemDetails} = useItems(allIds);
  const itemMap = useMemo(() => {
    const m = new Map<number, any>();
    itemDetails?.forEach(i => m.set(i.id, i));
    return m;
  }, [itemDetails]);

  const isLoading = sellsLoading || buysLoading;
  const error = sellsError || buysError;

  if (isLoading) {
    return (
      <View style={styles.tabContent}>
        <SkeletonRow style={styles.skeletonRow} />
        <SkeletonRow style={styles.skeletonRow} />
        <SkeletonRow style={styles.skeletonRow} />
      </View>
    );
  }
  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => {
          refetchSells();
          refetchBuys();
        }}
      />
    );
  }

  const orders = (subTab === 'sells' ? sells : buys) ?? [];
  const totalValue = orders.reduce((s, t) => s + t.price * t.quantity, 0);

  return (
    <View style={{flex: 1}}>
      {/* Sub-tabs */}
      <View style={styles.subTabBar}>
        {(['sells', 'buys'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.subTab, subTab === t && styles.subTabActive]}
            onPress={() => setSubTab(t)}>
            <Text
              style={[
                styles.subTabText,
                subTab === t && styles.subTabTextActive,
              ]}>
              {t === 'sells'
                ? `📤 Selling (${sells?.length ?? 0})`
                : `📥 Buying (${buys?.length ?? 0})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary row */}
      {orders.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {orders.length} active {subTab} order{orders.length !== 1 ? 's' : ''}
          </Text>
          <GoldDisplay copper={totalValue} size="sm" />
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No active {subTab} orders right now.
          </Text>
        }
        renderItem={({item}) => {
          const detail = itemMap.get(item.item_id);
          const total = item.price * item.quantity;
          return (
            <Card style={styles.txCard} padded>
              <View style={styles.txRow}>
                <ItemIcon icon={detail?.icon} rarity={detail?.rarity} size={44} />
                <View style={styles.txInfo}>
                  <Text
                    style={[
                      styles.txName,
                      {
                        color:
                          rarityColors[
                            (detail?.rarity ?? 'Fine') as keyof typeof rarityColors
                          ] ?? rarityColors.Fine,
                      },
                    ]}
                    numberOfLines={1}>
                    {detail?.name ?? `Item #${item.item_id}`}
                  </Text>
                  <Text style={styles.txMeta}>
                    ×{item.quantity} · {formatDate(item.created)}
                  </Text>
                </View>
                <View style={styles.txPriceBlock}>
                  <Text style={styles.txPriceLabel}>Each</Text>
                  <GoldDisplay copper={item.price} size="sm" />
                  <Text style={styles.txPriceLabel}>Total</Text>
                  <GoldDisplay copper={total} size="sm" />
                </View>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

interface ItemSummary {
  item_id: number;
  name: string;
  rarity: string;
  icon?: string;
  buyQty: number;
  buyCost: number;
  sellQty: number;
  sellRevenue: number;
  netProfit: number;
}

function HistoryTab({onRefresh, refreshing}: {onRefresh: () => void; refreshing: boolean}) {
  const [filter, setFilter] = useState<'all' | 'profit' | 'loss'>('all');
  const {data: histBuys, isLoading: buysLoading, error: buysError, refetch: refetchBuys} =
    useTPHistoryBuys();
  const {data: histSells, isLoading: sellsLoading, error: sellsError, refetch: refetchSells} =
    useTPHistorySells();

  const allIds = useMemo(() => {
    const ids = new Set<number>();
    histBuys?.forEach(t => ids.add(t.item_id));
    histSells?.forEach(t => ids.add(t.item_id));
    return [...ids];
  }, [histBuys, histSells]);

  const {data: itemDetails} = useItems(allIds);
  const itemMap = useMemo(() => {
    const m = new Map<number, any>();
    itemDetails?.forEach(i => m.set(i.id, i));
    return m;
  }, [itemDetails]);

  // Build per-item summary
  const summaries = useMemo((): ItemSummary[] => {
    const map = new Map<number, ItemSummary>();

    (histBuys ?? []).forEach(t => {
      const s = map.get(t.item_id) ?? {
        item_id: t.item_id,
        name: '',
        rarity: 'Fine',
        buyQty: 0,
        buyCost: 0,
        sellQty: 0,
        sellRevenue: 0,
        netProfit: 0,
      };
      s.buyQty += t.quantity;
      s.buyCost += t.price * t.quantity;
      map.set(t.item_id, s);
    });

    (histSells ?? []).forEach(t => {
      const s = map.get(t.item_id) ?? {
        item_id: t.item_id,
        name: '',
        rarity: 'Fine',
        buyQty: 0,
        buyCost: 0,
        sellQty: 0,
        sellRevenue: 0,
        netProfit: 0,
      };
      // 15% TP tax (5% listing + 10% sale)
      s.sellQty += t.quantity;
      s.sellRevenue += Math.floor(t.price * 0.85) * t.quantity;
      map.set(t.item_id, s);
    });

    return [...map.values()].map(s => {
      const item = itemMap.get(s.item_id);
      return {
        ...s,
        name: item?.name ?? `Item #${s.item_id}`,
        rarity: item?.rarity ?? 'Fine',
        icon: item?.icon,
        netProfit: s.sellRevenue - s.buyCost,
      };
    });
  }, [histBuys, histSells, itemMap]);

  const filtered = useMemo(() => {
    let list = summaries;
    if (filter === 'profit') list = list.filter(s => s.netProfit > 0);
    if (filter === 'loss') list = list.filter(s => s.netProfit < 0);
    return list.sort((a, b) => Math.abs(b.netProfit) - Math.abs(a.netProfit));
  }, [summaries, filter]);

  const totalProfit = useMemo(
    () => summaries.reduce((sum, s) => sum + s.netProfit, 0),
    [summaries],
  );
  const totalRevenue = useMemo(
    () => summaries.reduce((sum, s) => sum + s.sellRevenue, 0),
    [summaries],
  );

  const isLoading = buysLoading || sellsLoading;
  const error = buysError || sellsError;

  if (isLoading) {
    return (
      <View style={styles.tabContent}>
        <SkeletonCard style={styles.skeletonMd} />
        <SkeletonRow style={styles.skeletonRow} />
        <SkeletonRow style={styles.skeletonRow} />
        <SkeletonRow style={styles.skeletonRow} />
      </View>
    );
  }
  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => {
          refetchBuys();
          refetchSells();
        }}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      {/* Overall summary */}
      <View style={styles.histSummaryCard}>
        <View style={styles.histStat}>
          <Text style={styles.histStatLabel}>Total Revenue</Text>
          <GoldDisplay copper={totalRevenue} size="sm" />
        </View>
        <View style={styles.histStatDivider} />
        <View style={styles.histStat}>
          <Text style={styles.histStatLabel}>Net Profit</Text>
          {totalProfit !== 0 ? (
            <ProfitBadge copper={totalProfit} />
          ) : (
            <Text style={styles.histStatValueMuted}>–</Text>
          )}
        </View>
        <View style={styles.histStatDivider} />
        <View style={styles.histStat}>
          <Text style={styles.histStatLabel}>Items traded</Text>
          <Text style={styles.histStatValue}>{summaries.length}</Text>
        </View>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterRow}>
        {(['all', 'profit', 'loss'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}>
            <Text
              style={[
                styles.filterBtnText,
                filter === f && styles.filterBtnTextActive,
              ]}>
              {f === 'all' ? 'All' : f === 'profit' ? '📈 Profit' : '📉 Loss'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => String(item.item_id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transaction history found.</Text>
        }
        renderItem={({item}) => {
          const rarityColor =
            rarityColors[(item.rarity ?? 'Fine') as keyof typeof rarityColors] ??
            rarityColors.Fine;
          return (
            <Card style={styles.txCard} padded>
              <View style={styles.txRow}>
                <ItemIcon icon={item.icon} rarity={item.rarity} size={44} />
                <View style={styles.txInfo}>
                  <Text
                    style={[styles.txName, {color: rarityColor}]}
                    numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.txMetaRow}>
                    {item.buyQty > 0 && (
                      <Text style={styles.txMeta}>📥 ×{item.buyQty}</Text>
                    )}
                    {item.sellQty > 0 && (
                      <Text style={styles.txMeta}>📤 ×{item.sellQty}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.txProfitBlock}>
                  {item.buyCost > 0 && (
                    <View style={styles.txCostRow}>
                      <Text style={styles.txCostLabel}>Cost</Text>
                      <GoldDisplay copper={item.buyCost} size="sm" />
                    </View>
                  )}
                  {item.sellRevenue > 0 && (
                    <View style={styles.txCostRow}>
                      <Text style={styles.txCostLabel}>Revenue</Text>
                      <GoldDisplay copper={item.sellRevenue} size="sm" />
                    </View>
                  )}
                  {item.buyCost > 0 && item.sellRevenue > 0 && (
                    <ProfitBadge copper={item.netProfit} />
                  )}
                  {item.buyCost === 0 && item.sellRevenue > 0 && (
                    <Text style={styles.txMeta}>Sold (no buy data)</Text>
                  )}
                  {item.sellRevenue === 0 && item.buyCost > 0 && (
                    <Text style={styles.txMeta}>Bought (not sold yet)</Text>
                  )}
                </View>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}

// ─── Watchlist Tab ────────────────────────────────────────────────────────────

function WatchlistTab() {
  const {tpWatchlist, addToWatchlist, updateWatchlistItem, removeFromWatchlist} = useAppStore();
  const [searchId, setSearchId] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [buyTarget, setBuyTarget] = useState('');
  const [sellTarget, setSellTarget] = useState('');

  const watchedIds = useMemo(() => tpWatchlist.map(w => w.itemId), [tpWatchlist]);
  const {data: prices, isLoading: pricesLoading} = useItemPrices(watchedIds);
  const {data: itemDefs} = useItems(
    searchId && !isNaN(parseInt(searchId, 10)) ? [parseInt(searchId, 10)] : [],
  );

  const priceMap = useMemo(() => {
    const m = new Map<number, {buy: number; sell: number}>();
    prices?.forEach((p: any) => m.set(p.id, {buy: p.buys?.unit_price ?? 0, sell: p.sells?.unit_price ?? 0}));
    return m;
  }, [prices]);

  function startEdit(itemId: number) {
    const w = tpWatchlist.find(x => x.itemId === itemId);
    if (!w) return;
    setEditingId(itemId);
    setBuyTarget(w.targetBuyPrice ? (w.targetBuyPrice / 10000).toFixed(2) : '');
    setSellTarget(w.targetSellPrice ? (w.targetSellPrice / 10000).toFixed(2) : '');
  }

  function saveEdit(itemId: number) {
    const buy = parseFloat(buyTarget);
    const sell = parseFloat(sellTarget);
    updateWatchlistItem(itemId, {
      targetBuyPrice: !isNaN(buy) && buy > 0 ? Math.round(buy * 10000) : undefined,
      targetSellPrice: !isNaN(sell) && sell > 0 ? Math.round(sell * 10000) : undefined,
    });
    setEditingId(null);
  }

  function handleAdd() {
    const id = parseInt(searchId, 10);
    if (isNaN(id)) return;
    const def = itemDefs?.[0];
    addToWatchlist({
      itemId: id,
      itemName: def?.name ?? `Item #${id}`,
      icon: def?.icon,
      rarity: def?.rarity,
    });
    setSearchId('');
  }

  function confirmRemove(itemId: number, name: string) {
    Alert.alert('Remove from Watchlist', `Remove "${name}"?`, [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Remove', style: 'destructive', onPress: () => removeFromWatchlist(itemId)},
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Add item */}
      <Card style={styles.card} padded>
        <Text style={styles.cardTitle}>📌 Add Item to Watchlist</Text>
        <Text style={styles.toolHint}>Enter the item ID from the GW2 wiki (use the item's page URL — the number at the end).</Text>
        <View style={styles.addRow}>
          <TextInput
            style={[styles.calcInput, {flex: 1}]}
            value={searchId}
            onChangeText={setSearchId}
            placeholder="Item ID (e.g. 24615)"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.addBtn, !searchId && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!searchId}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        {itemDefs?.[0] && (
          <Text style={styles.foundItem}>Found: {itemDefs[0].name}</Text>
        )}
      </Card>

      {/* Watchlist */}
      {tpWatchlist.length === 0 ? (
        <Card style={styles.card} padded>
          <Text style={styles.emptyWatch}>No items in watchlist. Add items above to track their prices.</Text>
        </Card>
      ) : (
        tpWatchlist.map(item => {
          const live = priceMap.get(item.itemId);
          const buyAlert = item.targetBuyPrice && live && live.buy > 0 && live.buy <= item.targetBuyPrice;
          const sellAlert = item.targetSellPrice && live && live.sell > 0 && live.sell >= item.targetSellPrice;
          const isEditing = editingId === item.itemId;

          return (
            <Card key={item.itemId} style={[styles.watchCard, (buyAlert || sellAlert) && styles.watchCardAlert]} padded>
              <View style={styles.watchHeader}>
                <ItemIcon icon={item.icon} rarity={item.rarity} size={36} />
                <View style={{flex: 1}}>
                  <Text style={[styles.watchName, {color: rarityColors[(item.rarity ?? 'Fine') as keyof typeof rarityColors] ?? rarityColors.Fine}]} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                  {live ? (
                    <View style={styles.watchPricesRow}>
                      <Text style={styles.watchPriceLabel}>Buy: </Text>
                      <GoldDisplay copper={live.buy} size="sm" />
                      <Text style={[styles.watchPriceLabel, {marginLeft: spacing.sm}]}>Sell: </Text>
                      <GoldDisplay copper={live.sell} size="sm" />
                    </View>
                  ) : pricesLoading ? (
                    <Text style={styles.watchPriceLabel}>Loading…</Text>
                  ) : null}
                </View>
                <TouchableOpacity onPress={() => isEditing ? saveEdit(item.itemId) : startEdit(item.itemId)} style={styles.editBtn}>
                  <Text style={styles.editBtnText}>{isEditing ? 'Save' : '✏️'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmRemove(item.itemId, item.itemName)} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Alerts */}
              {(buyAlert || sellAlert) && (
                <View style={styles.alertRow}>
                  {buyAlert && <Text style={styles.alertText}>🔔 Buy price at/below target!</Text>}
                  {sellAlert && <Text style={styles.alertText}>🔔 Sell price at/above target!</Text>}
                </View>
              )}

              {/* Targets */}
              {isEditing ? (
                <View style={styles.targetEdit}>
                  <View style={styles.targetInputRow}>
                    <Text style={styles.targetLabel}>Alert if buy ≤ (gold)</Text>
                    <TextInput style={styles.targetInput} value={buyTarget} onChangeText={setBuyTarget} placeholder="0.00" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" />
                  </View>
                  <View style={styles.targetInputRow}>
                    <Text style={styles.targetLabel}>Alert if sell ≥ (gold)</Text>
                    <TextInput style={styles.targetInput} value={sellTarget} onChangeText={setSellTarget} placeholder="0.00" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad" />
                  </View>
                </View>
              ) : (item.targetBuyPrice || item.targetSellPrice) ? (
                <View style={styles.targetDisplay}>
                  {item.targetBuyPrice && (
                    <Text style={styles.targetDisplayText}>
                      Buy target: <Text style={{color: colors.text}}>{(item.targetBuyPrice / 10000).toFixed(2)}g</Text>
                    </Text>
                  )}
                  {item.targetSellPrice && (
                    <Text style={styles.targetDisplayText}>
                      Sell target: <Text style={{color: colors.text}}>{(item.targetSellPrice / 10000).toFixed(2)}g</Text>
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={styles.noTargetHint}>Tap ✏️ to set price alerts</Text>
              )}
            </Card>
          );
        })
      )}
    </ScrollView>
  );
}

// ─── Gem Exchange Card ────────────────────────────────────────────────────────

function GemExchangeCard() {
  const {data: gemsData, isLoading: gemsLoading} = useGemsForCoins(10000000);
  const {data: coinsData, isLoading: coinsLoading} = useCoinsForGems(400);
  const isLoading = gemsLoading || coinsLoading;

  function renderCoinsForGems(copper: number): string {
    const {gold, silver, copper: c} = formatGold(copper);
    const parts: string[] = [];
    if (gold > 0) parts.push(`${gold}g`);
    if (silver > 0) parts.push(`${silver}s`);
    if (c > 0 || parts.length === 0) parts.push(`${c}c`);
    return parts.join(' ');
  }

  return (
    <Card style={styles.card} padded>
      <View style={styles.gemExchangeHeader}>
        <Text style={styles.cardTitle}>💎 Exchange</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>Live</Text>
        </View>
      </View>
      <Text style={styles.toolHint}>
        Real-time gem/gold exchange rates from the GW2 API. Refreshes every 5 minutes.
      </Text>
      {isLoading ? (
        <Text style={styles.gemLoading}>Loading rates…</Text>
      ) : (
        <View style={styles.gemRateBlock}>
          <View style={styles.gemRateRow}>
            <Text style={styles.gemRateLabel}>💰 10g →</Text>
            <Text style={styles.gemRateValue}>
              {gemsData ? `${gemsData.quantity} gems` : '—'}
            </Text>
          </View>
          <View style={styles.gemRateRow}>
            <Text style={styles.gemRateLabel}>💎 400 gems →</Text>
            <Text style={styles.gemRateValue}>
              {coinsData ? renderCoinsForGems(coinsData.quantity) : '—'}
            </Text>
          </View>
          <View style={[styles.gemRateRow, styles.gemRateRowLast]}>
            <Text style={styles.gemRateLabel}>Rate</Text>
            <Text style={styles.gemRateValue}>
              {gemsData ? `${gemsData.coins_per_gem} copper/gem` : '—'}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}

// ─── Tools Tab ────────────────────────────────────────────────────────────────

function ToolsTab() {
  const [buyInput, setBuyInput] = useState('');
  const [sellInput, setSellInput] = useState('');

  const buyCopper = useMemo(() => {
    const n = parseFloat(buyInput);
    return isNaN(n) ? 0 : Math.round(n * 10000);
  }, [buyInput]);

  const sellCopper = useMemo(() => {
    const n = parseFloat(sellInput);
    return isNaN(n) ? 0 : Math.round(n * 10000);
  }, [sellInput]);

  const calc = useMemo(() => {
    if (sellCopper <= 0) return null;
    const listingFee = Math.ceil(sellCopper * 0.05);
    const saleTax = Math.ceil(sellCopper * 0.10);
    const totalFees = listingFee + saleTax;
    const netRevenue = sellCopper - totalFees;
    const profit = netRevenue - buyCopper;
    const roi = buyCopper > 0 ? (profit / buyCopper) * 100 : null;
    return {listingFee, saleTax, totalFees, netRevenue, profit, roi};
  }, [buyCopper, sellCopper]);

  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Flip Calculator */}
      <Card style={styles.card} padded>
        <Text style={styles.cardTitle}>🔄 Flip Calculator</Text>
        <Text style={styles.toolHint}>
          Enter prices in gold (e.g. 1.5 = 1g 50s). The TP takes 15% in fees
          (5% listing + 10% sale).
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Buy Order Price (gold)</Text>
          <TextInput
            style={styles.calcInput}
            value={buyInput}
            onChangeText={setBuyInput}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
          {buyCopper > 0 && (
            <View style={styles.inputPreview}>
              <GoldDisplay copper={buyCopper} size="sm" />
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Sell Listing Price (gold)</Text>
          <TextInput
            style={styles.calcInput}
            value={sellInput}
            onChangeText={setSellInput}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
          {sellCopper > 0 && (
            <View style={styles.inputPreview}>
              <GoldDisplay copper={sellCopper} size="sm" />
            </View>
          )}
        </View>

        {calc && (
          <View style={styles.calcResults}>
            <View style={styles.calcDivider} />

            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Listing Fee (5%)</Text>
              <GoldDisplay copper={calc.listingFee} size="sm" />
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Sale Tax (10%)</Text>
              <GoldDisplay copper={calc.saleTax} size="sm" />
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Total Fees</Text>
              <GoldDisplay copper={calc.totalFees} size="sm" />
            </View>

            <View style={styles.calcDivider} />

            <View style={styles.calcRow}>
              <Text style={styles.calcLabel}>Net Revenue</Text>
              <GoldDisplay copper={calc.netRevenue} size="sm" />
            </View>

            {buyCopper > 0 && (
              <>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Profit / Loss</Text>
                  <ProfitBadge copper={calc.profit} />
                </View>
                {calc.roi !== null && (
                  <View style={styles.calcRow}>
                    <Text style={styles.calcLabel}>ROI</Text>
                    <Text
                      style={[
                        styles.calcRoi,
                        {color: calc.roi >= 0 ? colors.green : colors.red},
                      ]}>
                      {calc.roi >= 0 ? '+' : ''}
                      {calc.roi.toFixed(1)}%
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </Card>

      {/* Gem Exchange Rate */}
      <GemExchangeCard />

      {/* TP Fee info */}
      <Card style={styles.card} padded>
        <Text style={styles.cardTitle}>ℹ️ TP Fee Reference</Text>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Listing fee</Text>
          <Text style={styles.feeValue}>5% of listing price (upfront)</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Sale fee</Text>
          <Text style={styles.feeValue}>10% of sale price (on sale)</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Total cost</Text>
          <Text style={styles.feeValue}>15% of listing price</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Net received</Text>
          <Text style={[styles.feeValue, {color: colors.green}]}>
            85% of listing price
          </Text>
        </View>
        <Text style={styles.toolHint}>
          The listing fee is non-refundable if you cancel. The 10% sale fee is
          only charged when the item actually sells.
        </Text>
      </Card>
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TradingPostScreen() {
  const {settings} = useAppStore();
  const [tab, setTab] = useState<MainTab>('delivery');
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({queryKey: ['tp_delivery']});
    await queryClient.invalidateQueries({queryKey: ['tp_current_buys']});
    await queryClient.invalidateQueries({queryKey: ['tp_current_sells']});
    await queryClient.invalidateQueries({queryKey: ['tp_history_buys']});
    await queryClient.invalidateQueries({queryKey: ['tp_history_sells']});
    setRefreshing(false);
  }, [queryClient]);

  if (!settings.apiKey) {
    return (
      <View style={styles.container}>
        <Card style={styles.noKeyCard}>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyText}>
            Go to Settings and enter your GW2 API key to use the Trading Post
            features.
          </Text>
        </Card>
      </View>
    );
  }

  const TABS: {id: MainTab; label: string}[] = [
    {id: 'delivery', label: '📬 Delivery'},
    {id: 'orders', label: '📋 Orders'},
    {id: 'history', label: '📊 History'},
    {id: 'watchlist', label: '📌 Watch'},
    {id: 'tools', label: '🔧 Tools'},
  ];

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}
            onPress={() => setTab(t.id)}>
            <Text
              style={[
                styles.tabBtnText,
                tab === t.id && styles.tabBtnTextActive,
              ]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {tab === 'delivery' && (
        <DeliveryTab onRefresh={onRefresh} refreshing={refreshing} />
      )}
      {tab === 'orders' && (
        <OrdersTab onRefresh={onRefresh} refreshing={refreshing} />
      )}
      {tab === 'history' && (
        <HistoryTab onRefresh={onRefresh} refreshing={refreshing} />
      )}
      {tab === 'watchlist' && <WatchlistTab />}
      {tab === 'tools' && <ToolsTab />}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabBtnActive: {
    borderBottomColor: colors.gold,
  },
  tabBtnText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: colors.gold,
  },

  // Sub-tabs (inside Orders)
  subTabBar: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subTabActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  subTabText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600',
  },
  subTabTextActive: {
    color: '#000',
  },

  // Content areas
  tabContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },

  // Summary row (Orders)
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },

  // Cards
  card: {
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  cardHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },

  // Delivery
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#2a1a00',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: spacing.md,
  },
  alertIcon: {
    fontSize: 28,
  },
  alertTitle: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  alertSub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  clearBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#0a1a0a',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.green,
    padding: spacing.md,
  },
  clearIcon: {
    fontSize: 24,
  },
  clearText: {
    color: colors.green,
    fontSize: fontSize.sm,
    fontWeight: '600',
    flex: 1,
  },
  deliveryCard: {
    gap: spacing.sm,
  },
  deliveryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemIcon: {
    borderWidth: 1.5,
  },
  itemIconPlaceholder: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
  },
  iconQ: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  itemRarity: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  countBadge: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  countText: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },

  // Transactions (Orders + History)
  txCard: {
    marginBottom: spacing.xs,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  txInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  txName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  txMeta: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  txMetaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  txPriceBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txPriceLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  txProfitBlock: {
    alignItems: 'flex-end',
    gap: 3,
  },
  txCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  txCostLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    minWidth: 50,
    textAlign: 'right',
  },

  // History summary
  histSummaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.md,
  },
  histStat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  histStatLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
  histStatValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  histStatValueMuted: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  histStatDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  // Filter row (History)
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterBtnText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: '#000',
  },

  // Profit badge
  profitBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  profitBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },

  // Tools
  toolHint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 18,
  },
  inputGroup: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  calcInput: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  inputPreview: {
    paddingLeft: spacing.xs,
  },
  calcResults: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  calcDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  calcRoi: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  feeLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  feeValue: {
    color: colors.text,
    fontSize: fontSize.sm,
  },

  // Skeletons
  skeletonMd: {
    height: 100,
    marginBottom: spacing.xs,
  },
  skeletonSm: {
    height: 60,
  },
  skeletonRow: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    height: 64,
  },

  // Empty
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },

  // No API key
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

  // Watchlist
  addRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  addBtn: {backgroundColor: colors.gold, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, justifyContent: 'center'},
  addBtnDisabled: {opacity: 0.4},
  addBtnText: {color: '#000', fontWeight: '700', fontSize: fontSize.sm},
  foundItem: {fontSize: fontSize.xs, color: colors.green, marginTop: 4},
  emptyWatch: {color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', paddingVertical: spacing.md},
  watchCard: {marginBottom: spacing.sm},
  watchCardAlert: {borderWidth: 1, borderColor: colors.gold},
  watchHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  watchName: {fontSize: fontSize.sm, fontWeight: '600'},
  watchPricesRow: {flexDirection: 'row', alignItems: 'center', marginTop: 2, flexWrap: 'wrap'},
  watchPriceLabel: {fontSize: fontSize.xs, color: colors.textMuted},
  editBtn: {padding: spacing.xs},
  editBtnText: {fontSize: fontSize.sm, color: colors.gold},
  removeBtn: {padding: spacing.xs},
  removeBtnText: {fontSize: fontSize.sm, color: colors.red},
  alertRow: {marginTop: spacing.xs, gap: 2},
  alertText: {fontSize: fontSize.xs, color: colors.gold, fontWeight: '600'},
  targetEdit: {marginTop: spacing.sm, gap: spacing.sm},
  targetInputRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  targetLabel: {fontSize: fontSize.xs, color: colors.textMuted, flex: 1},
  targetInput: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 6, color: colors.text, fontSize: fontSize.sm, width: 100, backgroundColor: colors.surfaceAlt},
  targetDisplay: {marginTop: spacing.xs, gap: 2},
  targetDisplayText: {fontSize: fontSize.xs, color: colors.textMuted},
  noTargetHint: {fontSize: fontSize.xs, color: colors.border, marginTop: 4},

  // Gem Exchange
  gemExchangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveBadge: {
    backgroundColor: colors.green + '22',
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  liveBadgeText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
  },
  gemLoading: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    paddingVertical: spacing.sm,
    textAlign: 'center',
  },
  gemRateBlock: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  gemRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gemRateRowLast: {
    borderBottomWidth: 0,
  },
  gemRateLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  gemRateValue: {
    color: colors.gold,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
});
