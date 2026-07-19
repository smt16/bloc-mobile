import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export const SectionHeader: React.FC<Props> = ({ title, action, onAction }) => (
  <View className="mb-md flex-row items-center justify-between">
    <Text className="text-h2 text-text">{title}</Text>
    {action ? (
      <Pressable onPress={onAction} hitSlop={8} className="active:opacity-70">
        <Text className="text-caption text-accent">{action}</Text>
      </Pressable>
    ) : null}
  </View>
);
