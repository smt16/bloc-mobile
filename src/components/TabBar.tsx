import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts, gradients, radius, shadows, spacing, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

/**
 * Minimal structural subset of react-navigation's BottomTabBarProps — only the
 * fields this custom bar reads. Avoids a fragile deep import into expo-router.
 */
type TabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

const TAB_META: Record<string, { label: string; icon: IconName; activeIcon: IconName }> = {
  index: { label: 'Feed', icon: 'home-outline', activeIcon: 'home' },
  explore: { label: 'Explore', icon: 'compass-outline', activeIcon: 'compass' },
  crews: { label: 'Crews', icon: 'people-outline', activeIcon: 'people' },
  profile: { label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
};

/**
 * Custom bottom tab bar with a raised "Log" action in the center —
 * square sticker FAB instead of soft lifestyle orb.
 */
export const TabBar: React.FC<TabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();

  const routes = state.routes.filter((r) => TAB_META[r.name]);
  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const renderTab = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return null;
    const index = state.routes.findIndex((r) => r.key === route.key);
    const focused = state.index === index;
    const meta = TAB_META[route.name];

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable key={route.key} onPress={onPress} style={styles.tab}>
        <Icon
          name={focused ? meta.activeIcon : meta.icon}
          size={23}
          color={focused ? colors.accent : colors.textSubtle}
        />
        <Text
          style={[
            styles.label,
            { color: focused ? colors.accent : colors.textSubtle },
          ]}
        >
          {meta.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: insets.bottom || spacing.md,
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.borderStrong,
        },
      ]}
    >
      <View style={styles.bar}>
        {left.map((r) => renderTab(r.name))}
        <View style={styles.centerSlot} />
        {right.map((r) => renderTab(r.name))}
      </View>

      <Pressable
        onPress={() => router.push('/log')}
        style={({ pressed }) => [styles.fabWrap, pressed && styles.fabPressed]}
      >
        <LinearGradient
          colors={[...gradients.ember]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.fab,
            {
              borderColor: colors.text,
              backgroundColor: colors.accent,
            },
          ]}
        >
          <Icon name="add" size={28} color={colors.accentText} />
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 2,
    paddingTop: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
  },
  centerSlot: {
    width: 72,
  },
  label: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  fabWrap: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    borderRadius: radius.md,
    ...shadows.floating,
  },
  fabPressed: {
    transform: [{ scale: 0.94 }, { translateX: 1 }, { translateY: 1 }],
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
});
