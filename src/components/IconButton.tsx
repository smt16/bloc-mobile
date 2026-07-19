import React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { cn, useTheme } from '../theme';
import { Icon, type IconName } from './Icon';

type Props = {
  name: IconName;
  onPress?: () => void;
  size?: number;
  color?: string;
  badge?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

export const IconButton: React.FC<Props> = ({
  name,
  onPress,
  size = 20,
  color,
  badge = false,
  style,
  className,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={style}
      className={cn(
        'h-[42px] w-[42px] items-center justify-center rounded-md border-2 border-border-strong bg-surface active:opacity-60',
        className,
      )}
    >
      <Icon name={name} size={size} color={color ?? colors.text} />
      {badge ? (
        <View className="absolute right-[8px] top-[8px] h-2 w-2 rounded-sm border-[1.5px] border-surface bg-accent" />
      ) : null}
    </Pressable>
  );
};
