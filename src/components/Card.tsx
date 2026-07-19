import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { cn } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  className?: string;
};

export const Card: React.FC<Props> = ({
  children,
  style,
  padded = true,
  className,
}) => {
  return (
    <View
      className={cn(
        'rounded-lg border border-border bg-surface',
        padded && 'p-lg',
        className,
      )}
      style={style}
    >
      {children}
    </View>
  );
};
