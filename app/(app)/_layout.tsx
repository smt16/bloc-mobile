import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { TabBar } from '../../src/components/TabBar';
import { useTheme } from '../../src/theme';

export default function AppLayout() {
  const { status } = useAuth();
  const { colors } = useTheme();

  if (status === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="crews" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
