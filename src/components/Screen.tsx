import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
  style?: StyleProp<ViewStyle>;
};

export const Screen: React.FC<Props> = ({
  children,
  scroll = false,
  padded = true,
  edges = ['top', 'left', 'right', 'bottom'],
  contentContainerStyle,
  scrollViewProps,
  style,
}) => {
  const innerStyle: ViewStyle = padded ? styles.padded : styles.unpadded;

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
          contentContainerStyle={[innerStyle, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[innerStyle, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  padded: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  unpadded: {
    flexGrow: 1,
  },
});
