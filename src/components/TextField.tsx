import React, { useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { cn, fonts, useTheme } from '../theme';
import { Icon } from './Icon';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
  containerClassName?: string;
  style?: StyleProp<ViewStyle>;
  /** Shows a show/hide toggle — use for password fields. */
  secureToggle?: boolean;
};

export const TextField: React.FC<Props> = ({
  label,
  error,
  containerClassName,
  style,
  secureToggle = false,
  secureTextEntry,
  ...inputProps
}) => {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(true);
  const isSecure = secureToggle ? hidden : secureTextEntry;

  return (
    <View className={cn('gap-sm', containerClassName)} style={style}>
      <Text
        className="uppercase text-text-subtle"
        style={{
          fontFamily: fonts.monoBold,
          fontSize: 10,
          letterSpacing: 1.6,
        }}
      >
        {label}
      </Text>
      <View
        className={cn(
          'min-h-[52px] flex-row items-center border-2 bg-surface px-md',
          error ? 'border-danger' : 'border-border-strong',
        )}
      >
        <TextInput
          {...inputProps}
          secureTextEntry={isSecure}
          placeholderTextColor={colors.textSubtle}
          className="flex-1 py-md text-body text-text"
          style={{ fontSize: 16, lineHeight: 22 }}
          autoCapitalize={inputProps.autoCapitalize ?? 'none'}
          autoCorrect={inputProps.autoCorrect ?? false}
        />
        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={8}
            onPress={() => setHidden((v) => !v)}
            className="pl-sm active:opacity-70"
          >
            <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={22} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text className="text-caption text-danger">{error}</Text>
      ) : null}
    </View>
  );
};
