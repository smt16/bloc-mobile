import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { fonts, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  title?: string;
  variant?: 'back' | 'close';
  right?: React.ReactNode;
};

export const NavHeader: React.FC<Props> = ({ title, variant = 'back', right }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const icon: IconName = variant === 'close' ? 'close' : 'chevron-back';

  return (
    <View className="flex-row items-center gap-md py-sm">
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/(app)'))}
        className="h-[42px] w-[42px] items-center justify-center rounded-md border-2 border-border-strong bg-surface active:opacity-60"
        hitSlop={8}
      >
        <Icon name={icon} size={22} color={colors.text} />
      </Pressable>
      {title ? (
        <Text
          className="flex-1 uppercase text-text"
          style={{
            fontFamily: fonts.display,
            fontSize: 24,
            letterSpacing: 1,
            lineHeight: 26,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : (
        <View className="flex-1" />
      )}
      <View className="min-w-[42px] items-end">{right}</View>
    </View>
  );
};
