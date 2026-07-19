import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { useTheme } from '../theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export const Icon: React.FC<Props> = ({ name, size = 20, color }) => {
  const { colors } = useTheme();
  return <Ionicons name={name} size={size} color={color ?? colors.text} />;
};
