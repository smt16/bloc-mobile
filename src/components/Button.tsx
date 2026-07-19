import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { cn, useTheme } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

type Props = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  testID?: string;
};

const sizeClass: Record<Size, string> = {
  md: 'min-h-[48px] px-xl py-md',
  lg: 'min-h-[56px] px-2xl py-lg',
};

const variantContainer: Record<Variant, string> = {
  primary: 'bg-accent active:opacity-85',
  secondary: 'bg-surface border border-border-strong active:bg-surface-muted',
  ghost: 'bg-transparent active:opacity-70',
};

const variantLabel: Record<Variant, string> = {
  primary: 'text-accent-text',
  secondary: 'text-text',
  ghost: 'text-text-muted',
};

export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leading,
  trailing,
  style,
  className,
  testID,
}) => {
  const { colors } = useTheme();
  const isInactive = disabled || loading;

  const spinnerColor =
    variant === 'primary'
      ? colors.accentText
      : variant === 'secondary'
        ? colors.text
        : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      onPress={isInactive ? undefined : onPress}
      testID={testID}
      style={style}
      className={cn(
        'flex-row items-center justify-center rounded-pill',
        sizeClass[size],
        variantContainer[variant],
        isInactive && 'opacity-50',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <View className="flex-row items-center gap-sm">
          {leading ? <View className="items-center justify-center">{leading}</View> : null}
          <Text className={cn('text-body-strong', variantLabel[variant])} numberOfLines={1}>
            {label}
          </Text>
          {trailing ? <View className="items-center justify-center">{trailing}</View> : null}
        </View>
      )}
    </Pressable>
  );
};
