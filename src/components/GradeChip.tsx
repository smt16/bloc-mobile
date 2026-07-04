import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { gradeColor, radius, spacing, typography } from '../theme';

type Props = {
  grade: string;
  size?: 'sm' | 'md' | 'lg';
};

/** Color-coded climbing grade badge (V-scale). */
export const GradeChip: React.FC<Props> = ({ grade, size = 'md' }) => {
  const color = gradeColor(grade);
  const dims = sizeMap[size];

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: `${color}26`,
          borderColor: `${color}55`,
          paddingHorizontal: dims.px,
          paddingVertical: dims.py,
          borderRadius: dims.radius,
        },
      ]}
    >
      <Text style={[styles.text, { color, fontSize: dims.font }]}>{grade}</Text>
    </View>
  );
};

const sizeMap = {
  sm: { px: 8, py: 2, font: 12, radius: radius.sm },
  md: { px: spacing.md, py: 4, font: 14, radius: radius.pill },
  lg: { px: spacing.lg, py: 8, font: 20, radius: radius.md },
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    ...typography.bodyStrong,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
