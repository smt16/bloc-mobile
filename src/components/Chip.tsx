import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { cn, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  label: string;
  icon?: IconName;
  active?: boolean;
  tone?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

/** Pill-shaped tag / filter chip. */
export const Chip: React.FC<Props> = ({
  label,
  icon,
  active = false,
  tone,
  onPress,
  style,
  className,
}) => {
  const { colors } = useTheme();
  const accent = tone ?? colors.accent;
  const content = (
    <View
      className={cn(
        'flex-row items-center gap-xs rounded-pill border px-md py-[7px]',
        className,
      )}
      style={[
        active
          ? { backgroundColor: accent, borderColor: accent }
          : {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
        style,
      ]}
    >
      {icon ? (
        <Icon name={icon} size={14} color={active ? colors.bg : colors.textMuted} />
      ) : null}
      <Text className={cn('text-caption', active ? 'font-bold text-bg' : 'text-text-muted')}>
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
    );
  }
  return content;
};
