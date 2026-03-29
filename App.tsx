import React, {useState, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar, BackHandler, ToastAndroid, ScrollView} from 'react-native';
import {useNavigationContainerRef} from '@react-navigation/native';

import DashboardScreen from './src/screens/DashboardScreen';
import CharactersScreen from './src/screens/CharactersScreen';
import CharacterDetailScreen from './src/screens/CharacterDetailScreen';
import TimersScreen from './src/screens/TimersScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import RaidsScreen from './src/screens/RaidsScreen';
import TradingPostScreen from './src/screens/TradingPostScreen';
import MapCompletionScreen from './src/screens/MapCompletionScreen';
import CraftingScreen from './src/screens/CraftingScreen';
import WvWScreen from './src/screens/WvWScreen';
import PvPScreen from './src/screens/PvPScreen';
import FractalsScreen from './src/screens/FractalsScreen';
import GuildScreen from './src/screens/GuildScreen';
import StrikesScreen from './src/screens/StrikesScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {useAppStore} from './src/store/appStore';
import {colors} from './src/constants/theme';
import {ErrorBoundary} from './src/components/ui/ErrorBoundary';

const Tab = createBottomTabNavigator();
const CharactersStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {retry: 2, refetchOnWindowFocus: false},
  },
});

function withErrorBoundary(Screen: React.ComponentType<any>) {
  return (props: any) => (
    <ErrorBoundary>
      <Screen {...props} />
    </ErrorBoundary>
  );
}

function TabIcon({emoji, focused}: {emoji: string; focused: boolean}) {
  return (
    <Text style={{fontSize: 20, opacity: focused ? 1 : 0.5}}>{emoji}</Text>
  );
}

// ─── Inner tab bar shared by Competitive and Progression ─────────────────────

function InnerTabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: {id: string; label: string}[];
  active: string;
  onChange: (id: string) => void;
}) {
  const scrollable = tabs.length > 3;
  const buttons = tabs.map(t => (
    <TouchableOpacity
      key={t.id}
      style={[
        innerStyles.btn,
        scrollable && innerStyles.btnFixed,
        active === t.id && innerStyles.btnActive,
      ]}
      onPress={() => onChange(t.id)}>
      <Text style={[innerStyles.btnText, active === t.id && innerStyles.btnTextActive]}>
        {t.label}
      </Text>
    </TouchableOpacity>
  ));

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={innerStyles.barScroll}
        contentContainerStyle={innerStyles.barScrollContent}>
        {buttons}
      </ScrollView>
    );
  }
  return <View style={innerStyles.bar}>{buttons}</View>;
}

const innerStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  barScroll: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  barScrollContent: {
    paddingHorizontal: 8,
    paddingTop: 4,
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  btnFixed: {
    flex: 0,
    minWidth: 100,
  },
  btnActive: {borderBottomColor: colors.gold},
  btnText: {fontSize: 13, color: colors.textMuted, fontWeight: '600'},
  btnTextActive: {color: colors.gold},
});

// ─── Competitive: WvW + PvP ───────────────────────────────────────────────────

const WvWContent = withErrorBoundary(WvWScreen);
const PvPContent = withErrorBoundary(PvPScreen);

function CompetitiveScreen() {
  const [tab, setTab] = useState('wvw');
  const TABS = [
    {id: 'wvw', label: '⚔️ World vs World'},
    {id: 'pvp', label: '🏆 PvP'},
  ];
  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <InnerTabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'wvw' ? <WvWContent /> : <PvPContent />}
    </View>
  );
}

// ─── Progression: Fractals + Guild ───────────────────────────────────────────

const FractalsContent = withErrorBoundary(FractalsScreen);
const GuildContent = withErrorBoundary(GuildScreen);
const StrikesContent = withErrorBoundary(StrikesScreen);
const CollectionsContent = withErrorBoundary(CollectionsScreen);

function ProgressionScreen() {
  const [tab, setTab] = useState('fractals');
  const TABS = [
    {id: 'fractals', label: '🌀 Fractals'},
    {id: 'strikes', label: '⚔️ Strikes'},
    {id: 'collections', label: '🎨 Collections'},
    {id: 'guild', label: '⚜️ Guild'},
  ];
  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <InnerTabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'fractals' && <FractalsContent />}
      {tab === 'strikes' && <StrikesContent />}
      {tab === 'collections' && <CollectionsContent />}
      {tab === 'guild' && <GuildContent />}
    </View>
  );
}

// ─── Characters stack (includes Crafting) ────────────────────────────────────

function CharactersNavigator() {
  return (
    <CharactersStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.bg},
        headerTitleStyle: {color: '#e8e0d0', fontWeight: '700'},
        headerTintColor: '#c8972b',
      }}>
      <CharactersStack.Screen
        name="CharactersList"
        component={CharactersScreen}
        options={{headerShown: false}}
      />
      <CharactersStack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={({route}: any) => ({title: route.params?.name ?? 'Character'})}
      />
      <CharactersStack.Screen
        name="MapCompletion"
        component={MapCompletionScreen}
        options={{title: '🗺 Map Completion'}}
      />
      <CharactersStack.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{title: '🎒 Inventory'}}
      />
      <CharactersStack.Screen
        name="Crafting"
        component={CraftingScreen}
        options={{title: '⚒️ Crafting'}}
      />
      <CharactersStack.Screen
        name="Guides"
        component={RaidsScreen}
        options={{title: '📖 Guides & KP Lookup'}}
      />
    </CharactersStack.Navigator>
  );
}

// ─── Settings stack (includes Notifications) ─────────────────────────────────

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.bg},
        headerTitleStyle: {color: '#e8e0d0', fontWeight: '700'},
        headerTintColor: '#c8972b',
      }}>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{headerShown: false}}
      />
      <SettingsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{title: '🔔 Notifications'}}
      />
    </SettingsStack.Navigator>
  );
}

// ─── Wrapped screens ─────────────────────────────────────────────────────────

const SDashboard = withErrorBoundary(DashboardScreen);
const SCharacters = withErrorBoundary(CharactersNavigator);
const STimers = withErrorBoundary(TimersScreen);
const SCompetitive = withErrorBoundary(CompetitiveScreen);
const SProgression = withErrorBoundary(ProgressionScreen);
const STradingPost = withErrorBoundary(TradingPostScreen);
const SSettings = withErrorBoundary(SettingsNavigator);

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const {loadSettings} = useAppStore();
  const navigationRef = useNavigationContainerRef();
  const lastBackPressed = useRef<number>(0);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigationRef.canGoBack()) {
          navigationRef.goBack();
          return true;
        }
        const now = Date.now();
        if (now - lastBackPressed.current < 2000) {
          BackHandler.exitApp();
          return true;
        }
        lastBackPressed.current = now;
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" translucent={false} />
      <QueryClientProvider client={queryClient}>
        <NavigationContainer ref={navigationRef}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: '#0d0d15',
                borderTopColor: '#2a2a40',
                borderTopWidth: 1,
                height: 60,
                paddingBottom: 8,
              },
              tabBarActiveTintColor: '#c8972b',
              tabBarInactiveTintColor: '#6a6070',
              tabBarLabelStyle: {fontSize: 10, fontWeight: '600'},
              headerStyle: {backgroundColor: '#0a0a0f'},
              headerTitleStyle: {color: '#e8e0d0', fontWeight: '700'},
              headerTintColor: '#c8972b',
            }}>
            <Tab.Screen
              name="Dashboard"
              component={SDashboard}
              options={{
                headerTitle: '⚔️ Soreni',
                tabBarIcon: ({focused}) => <TabIcon emoji="🏠" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Characters"
              component={SCharacters}
              options={{
                headerShown: false,
                tabBarIcon: ({focused}) => <TabIcon emoji="🧙" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Timers"
              component={STimers}
              options={{
                tabBarIcon: ({focused}) => <TabIcon emoji="⏱️" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Competitive"
              component={SCompetitive}
              options={{
                headerTitle: '⚔️ Competitive',
                tabBarIcon: ({focused}) => <TabIcon emoji="⚔️" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Progression"
              component={SProgression}
              options={{
                headerTitle: '🌀 Progression',
                tabBarIcon: ({focused}) => <TabIcon emoji="🌀" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="TradingPost"
              component={STradingPost}
              options={{
                headerTitle: '💹 Trading Post',
                tabBarIcon: ({focused}) => <TabIcon emoji="💹" focused={focused} />,
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SSettings}
              options={{
                headerShown: false,
                tabBarIcon: ({focused}) => <TabIcon emoji="⚙️" focused={focused} />,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
