import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useCharacters} from '../hooks/useGW2';
import CharacterCard from '../components/characters/CharacterCard';
import {colors, fontSize, spacing, radius} from '../constants/theme';
import {useAppStore} from '../store/appStore';
import Card from '../components/ui/Card';
import {Skeleton, SkeletonCard} from '../components/ui/Skeleton';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function CharactersScreen({navigation}: any) {
  const {settings} = useAppStore();
  const {data: characters, isLoading, error, refetch} = useCharacters();

  if (!settings.apiKey) {
    return (
      <View style={styles.container}>
        <Card style={styles.noKeyCard}>
          <Text style={styles.noKeyTitle}>🔑 No API Key Set</Text>
          <Text style={styles.noKeyText}>
            Go to Settings and enter your Guild Wars 2 API key to see your
            characters.
          </Text>
        </Card>
      </View>
    );
  }

  if (isLoading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}>
        <Skeleton width="30%" height={12} style={{marginBottom: 16}} />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </ScrollView>
    );
  }
  // Add after isLoading block:
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ErrorMessage error={error} onRetry={refetch} />
      </View>
    );
  }
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={characters ?? []}
      keyExtractor={item => item.name}
      renderItem={({item}) => (
        <CharacterCard
          character={item}
          onPress={() =>
            navigation.navigate('CharacterDetail', {name: item.name})
          }
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={colors.gold}
        />
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No characters found</Text>
        </View>
      }
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.header}>
            {characters?.length ?? 0} Characters
          </Text>
          <View style={styles.btnGrid}>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => navigation.push('MapCompletion')}
              activeOpacity={0.8}>
              <Text style={styles.mapBtnText}>🗺 Map Completion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => navigation.push('Inventory')}
              activeOpacity={0.8}>
              <Text style={styles.mapBtnText}>🎒 Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => navigation.push('Crafting')}
              activeOpacity={0.8}>
              <Text style={styles.mapBtnText}>⚒️ Crafting</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => navigation.push('Guides')}
              activeOpacity={0.8}>
              <Text style={styles.mapBtnText}>📖 Guides & KP</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.md,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  listHeader: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  btnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  mapBtn: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.gold + '22',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  mapBtnText: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '700',
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
