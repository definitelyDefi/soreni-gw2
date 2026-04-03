import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {useQueryClient, useIsFetching} from '@tanstack/react-query';
import {useAppStore} from '../store/appStore';
import AccountSummary from '../components/dashboard/AccountSummary';
import ResetCountdown from '../components/dashboard/ResetCountdown';
import NextBossWidget from '../components/dashboard/NextBossWidget';
import DailyChecklist from '../components/dashboard/DailyChecklist';
import WalletHistory from '../components/dashboard/WalletHistory';
import WealthSummary from '../components/dashboard/WealthSummary';
import WizardVaultWidget from '../components/dashboard/WizardVaultWidget';
import CharactersWidget from '../components/dashboard/CharactersWidget';
import MasteryWidget from '../components/dashboard/MasteryWidget';
import TPDeliveryWidget from '../components/dashboard/TPDeliveryWidget';
import {colors, spacing} from '../constants/theme';
import type {WidgetId} from '../types';

const WIDGET_COMPONENTS: Record<WidgetId, React.ComponentType> = {
  account:         AccountSummary,
  wealth:          WealthSummary,
  reset_countdown: ResetCountdown,
  next_boss:       NextBossWidget,
  daily_checklist: DailyChecklist,
  wizard_vault:    WizardVaultWidget,
  characters:      CharactersWidget,
  mastery:         MasteryWidget,
  tp_delivery:     TPDeliveryWidget,
  wallet_history:  WalletHistory,
};

export default function DashboardScreen() {
  const {loadSettings, settings} = useAppStore();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  useEffect(() => {
    loadSettings().then(() => {
      const {settings: s} = useAppStore.getState();
      if (s.notifications) {
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

  const widgetIds = settings.dashboardWidgets ?? [];

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
      {widgetIds.map(id => {
        const Component = WIDGET_COMPONENTS[id];
        if (!Component) return null;
        return <Component key={id} />;
      })}
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
