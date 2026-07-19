import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { fonts } from '../theme';

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export const SectionHeader: React.FC<Props> = ({ title, action, onAction }) => (
  <View className="mb-md flex-row items-center justify-between">
    <Text
      className="uppercase text-text"
      style={{
        fontFamily: fonts.display,
        fontSize: 24,
        letterSpacing: 1,
        lineHeight: 26,
      }}
    >
      {title}
    </Text>
    {action ? (
      <Pressable onPress={onAction} hitSlop={8} className="active:opacity-70">
        <Text
          className="uppercase text-accent"
          style={{
            fontFamily: fonts.monoBold,
            fontSize: 11,
            letterSpacing: 1.2,
          }}
        >
          {action}
        </Text>
      </Pressable>
    ) : null}
  </View>
);
