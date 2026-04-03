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
import TradingPostScreen from './src/screens/TradingPostScreen';
import MapCompletionScreen from './src/screens/MapCompletionScreen';
import CraftingScreen from './src/screens/CraftingScreen';
import LegendaryCraftingScreen from './src/screens/LegendaryCraftingScreen';
import WvWScreen from './src/screens/WvWScreen';
import PvPScreen from './src/screens/PvPScreen';
import FractalsScreen from './src/screens/FractalsScreen';
import StrikesScreen from './src/screens/StrikesScreen';
import CollectionsScreen from './src/screens/CollectionsScreen';
import GuildScreen from './src/screens/GuildScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import GuidesScreen from './src/screens/GuidesScreen';
import GuideDetailScreen from './src/screens/GuideDetailScreen';
import {useAppStore} from './src/store/appStore';
import {colors} from './src/constants/theme';
import {ErrorBoundary} from './src/components/ui/ErrorBoundary';

const Tab = createBottomTabNavigator();
const CharactersStack = createNativeStackNavigator();
const ToolsStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const GuidesStack = createNativeStackNavigator();

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

// ─── Tools: vertical nav list + sub-screens ──────────────────────────────────

const GuildContent       = withErrorBoundary(GuildScreen);
const TradingPostContent = withErrorBoundary(TradingPostScreen);
const WvWContent         = withErrorBoundary(WvWScreen);
const PvPContent         = withErrorBoundary(PvPScreen);
const FractalsContent    = withErrorBoundary(FractalsScreen);
const StrikesContent     = withErrorBoundary(StrikesScreen);
const CollectionsContent = withErrorBoundary(CollectionsScreen);

type ToolId = 'characters' | 'tradingpost' | 'guides' | 'wvw' | 'pvp' | 'fractals' | 'strikes' | 'collections' | 'guild';

interface ToolEntry {
  id: ToolId;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

const TOOLS: ToolEntry[] = [
  {id: 'characters',  emoji: '🧙', label: 'Characters',    description: 'Gear, builds, inventory & crafting',  color: '#ce93d8'},
  {id: 'tradingpost', emoji: '💹', label: 'Trading Post',  description: 'Prices, watchlist & buy/sell orders', color: '#81c784'},
  {id: 'guides',      emoji: '📖', label: 'Guides',        description: 'Game mechanics, economy & more',      color: '#4fc3f7'},
  {id: 'wvw',         emoji: '⚔️', label: 'World vs World', description: 'Scores, objectives & rankings',      color: '#ef5350'},
  {id: 'pvp',         emoji: '🏆', label: 'PvP',           description: 'Ranked stats & seasons',             color: '#ffa726'},
  {id: 'fractals',    emoji: '🌀', label: 'Fractals',      description: 'Daily fractals & build resources',   color: '#26c6da'},
  {id: 'strikes',     emoji: '⚡', label: 'Strike Missions', description: 'Weekly strike clears',             color: '#ffca28'},
  {id: 'collections', emoji: '🎨', label: 'Collections',   description: 'Skins, minis & wardrobe',            color: '#ab47bc'},
  {id: 'guild',       emoji: '⚜️', label: 'Guild',         description: 'Treasury, log & members',           color: '#c8972b'},
];

function ToolsScreen() {
  const [active, setActive] = useState<ToolId | null>(null);

  if (active !== null) {
    const tool = TOOLS.find(t => t.id === active)!;
    return (
      <View style={{flex: 1, backgroundColor: colors.bg}}>
        {/* Sub-screen header */}
        <View style={toolStyles.subHeader}>
          <TouchableOpacity style={toolStyles.backBtn} onPress={() => setActive(null)}>
            <Text style={toolStyles.backArrow}>‹</Text>
            <Text style={toolStyles.backLabel}>Tools</Text>
          </TouchableOpacity>
          <Text style={[toolStyles.subTitle, {color: tool.color}]}>
            {tool.emoji} {tool.label}
          </Text>
          <View style={{width: 64}} />
        </View>
        <View style={{flex: 1}}>
          {active === 'characters'  && <SCharactersInner />}
          {active === 'tradingpost' && <TradingPostContent />}
          {active === 'guides'      && <SGuidesInner />}
          {active === 'wvw'         && <WvWContent />}
          {active === 'pvp'         && <PvPContent />}
          {active === 'fractals'    && <FractalsContent />}
          {active === 'strikes'     && <StrikesContent />}
          {active === 'collections' && <CollectionsContent />}
          {active === 'guild'       && <GuildContent />}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.bg}} contentContainerStyle={toolStyles.listContent}>
      <Text style={toolStyles.listTitle}>Tools</Text>
      {TOOLS.map((tool, i) => (
        <TouchableOpacity
          key={tool.id}
          style={[toolStyles.row, i === TOOLS.length - 1 && toolStyles.rowLast]}
          onPress={() => setActive(tool.id)}
          activeOpacity={0.7}>
          <View style={[toolStyles.iconWrap, {backgroundColor: tool.color + '18', borderColor: tool.color + '44'}]}>
            <Text style={toolStyles.iconEmoji}>{tool.emoji}</Text>
          </View>
          <View style={toolStyles.rowInfo}>
            <Text style={toolStyles.rowLabel}>{tool.label}</Text>
            <Text style={toolStyles.rowDesc}>{tool.description}</Text>
          </View>
          <Text style={[toolStyles.rowArrow, {color: tool.color}]}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const toolStyles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 8,
  },
  listTitle: {
    color: '#c8972b',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12121e',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a40',
    padding: 14,
    gap: 14,
  },
  rowLast: {},
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: {fontSize: 24},
  rowInfo: {flex: 1, gap: 2},
  rowLabel: {color: '#e8e0d0', fontSize: 15, fontWeight: '700'},
  rowDesc:  {color: '#6a6070', fontSize: 12, lineHeight: 17},
  rowArrow: {fontSize: 26, fontWeight: '300', lineHeight: 30},
  // sub-screen header
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0d0d15',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a40',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    width: 64,
  },
  backArrow: {color: '#c8972b', fontSize: 26, lineHeight: 28, fontWeight: '300'},
  backLabel: {color: '#c8972b', fontSize: 14, fontWeight: '600'},
  subTitle:  {fontSize: 15, fontWeight: '700'},
});

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
    </CharactersStack.Navigator>
  );
}

// ─── Guides stack ────────────────────────────────────────────────────────────

function GuidesNavigator() {
  return (
    <GuidesStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.bg},
        headerTitleStyle: {color: '#e8e0d0', fontWeight: '700'},
        headerTintColor: '#c8972b',
      }}>
      <GuidesStack.Screen
        name="GuidesList"
        component={GuidesScreen}
        options={{title: '📖 Guides'}}
      />
      <GuidesStack.Screen
        name="GuideDetail"
        component={GuideDetailScreen}
        options={({route}: any) => ({
          title: route.params?.guideId
            ? (require('./src/constants/guides').GUIDES.find((g: any) => g.id === route.params.guideId)?.title ?? 'Guide')
            : 'Guide',
        })}
      />
    </GuidesStack.Navigator>
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
const SCharactersInner = withErrorBoundary(CharactersNavigator);
const SGuidesInner = withErrorBoundary(GuidesNavigator);
const SLegendary = withErrorBoundary(LegendaryCraftingScreen);
const STimers = withErrorBoundary(TimersScreen);
const STools = withErrorBoundary(ToolsScreen);
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
              name="Legendary"
              component={SLegendary}
              options={{
                headerTitle: '💎 Legendary Crafting',
                tabBarIcon: ({focused}) => <TabIcon emoji="💎" focused={focused} />,
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
              name="Tools"
              component={STools}
              options={{
                headerTitle: '🔧 Tools',
                tabBarIcon: ({focused}) => <TabIcon emoji="🔧" focused={focused} />,
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
