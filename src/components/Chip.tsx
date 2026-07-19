import React from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { cn, fonts, useTheme } from '../theme';
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

/** Sticker-shaped tag / filter chip — hard corners, thick border. */
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
        'flex-row items-center gap-xs rounded-sm border-2 px-md py-[6px]',
        className,
      )}
      style={[
        active
          ? { backgroundColor: accent, borderColor: colors.text }
          : {
              backgroundColor: colors.surface,
              borderColor: colors.borderStrong,
            },
        style,
      ]}
    >
      {icon ? (
        <Icon name={icon} size={14} color={active ? colors.accentText : colors.textMuted} />
      ) : null}
      <Text
        className={cn('uppercase', active ? 'text-accent-text' : 'text-text-muted')}
        style={{
          fontFamily: fonts.monoBold,
          fontSize: 11,
          letterSpacing: 1,
        }}
      >
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
