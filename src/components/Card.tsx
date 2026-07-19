import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { cn, shadows } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  className?: string;
  /** Hard-offset print shadow — use for interactive / featured cards. */
  raised?: boolean;
};

export const Card: React.FC<Props> = ({
  children,
  style,
  padded = true,
  className,
  raised = false,
}) => {
  return (
    <View
      className={cn(
        'rounded-md border-2 border-border-strong bg-surface',
        padded && 'p-lg',
        className,
      )}
      style={[raised ? shadows.card : undefined, style]}
    >
      {children}
    </View>
  );
};
