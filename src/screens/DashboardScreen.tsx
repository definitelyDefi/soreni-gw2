import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {useQueryClient, useIsFetching} from '@tanstack/react-query';
import {useAppStore} from '../store/appStore';
import AccountSummary from '../components/dashboard/AccountSummary';
import ResetCountdown from '../components/dashboard/ResetCountdown';
import NextBossWidget from '../components/dashboard/NextBossWidget';
import DailyChecklist from '../components/dashboard/DailyChecklist';
import WalletHistory from '../components/dashboard/WalletHistory';
import {colors, spacing} from '../constants/theme';

export default function DashboardScreen() {
  const {loadSettings} = useAppStore();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  useEffect(() => {
    loadSettings().then(() => {
      const {settings} = useAppStore.getState();
      if (settings.notifications) {
        import('../services/notifications').then(
          ({scheduleAllBossNotifications}) => {
            scheduleAllBossNotifications();
          },
        );
      }
    });
  }, [loadSettings]);

  function onRefresh() {
    queryClient.invalidateQueries();
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isFetching > 0}
          onRefresh={onRefresh}
          tintColor={colors.gold}
        />
      }>
      <AccountSummary />
      <WalletHistory />
      <ResetCountdown />
      <NextBossWidget />
      <DailyChecklist />
    </ScrollView>
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
});
