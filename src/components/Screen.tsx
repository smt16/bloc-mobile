import React from 'react';
import {
  ScrollView,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { cn } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentContainerClassName?: string;
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'contentContainerClassName'>;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

export const Screen: React.FC<Props> = ({
  children,
  scroll = false,
  padded = true,
  edges = ['top', 'left', 'right', 'bottom'],
  contentContainerStyle,
  contentContainerClassName,
  scrollViewProps,
  style,
  className,
}) => {
  const innerClassName = cn(
    scroll ? 'grow' : 'flex-1',
    padded && 'px-xl py-lg',
    contentContainerClassName,
  );

  return (
    <SafeAreaView className={cn('flex-1 bg-bg', className)} style={style} edges={edges}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
          contentContainerClassName={innerClassName}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={innerClassName} style={contentContainerStyle}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};