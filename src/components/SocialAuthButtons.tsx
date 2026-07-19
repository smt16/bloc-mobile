import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Button } from './Button';
import { Icon } from './Icon';
import { fonts } from '../theme';

type Props = {
  onGoogle: () => void;
  onApple?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Social sign-in row — Google everywhere, Apple on iOS only.
 * Hard sticker borders to match the dirtbag system (not soft lifestyle pills).
 */
export const SocialAuthButtons: React.FC<Props> = ({
  onGoogle,
  onApple,
  loading = false,
  disabled = false,
}) => {
  const showApple = Platform.OS === 'ios' && onApple;

  return (
    <View className="gap-md">
      <View className="flex-row items-center gap-md">
        <View className="h-px flex-1 bg-border" />
        <Text
          className="uppercase text-text-subtle"
          style={{
            fontFamily: fonts.monoBold,
            fontSize: 10,
            letterSpacing: 1.8,
          }}
        >
          Or
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <View className={showApple ? 'flex-row gap-md' : undefined}>
        <View className={showApple ? 'flex-1' : undefined}>
          <Button
            label="Google"
            variant="secondary"
            onPress={onGoogle}
            loading={loading}
            disabled={disabled}
            leading={<GoogleGlyph />}
          />
        </View>
        {showApple ? (
          <View className="flex-1">
            <Button
              label="Apple"
              variant="secondary"
              onPress={onApple}
              loading={loading}
              disabled={disabled}
              leading={<Icon name="logo-apple" size={20} />}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

/** Simple multicolor-ish G mark using Ionicons logo-google. */
const GoogleGlyph: React.FC = () => <Icon name="logo-google" size={18} />;

type AuthFooterLinkProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

export const AuthFooterLink: React.FC<AuthFooterLinkProps> = ({
  prompt,
  actionLabel,
  onPress,
}) => (
  <Pressable
    accessibilityRole="link"
    onPress={onPress}
    className="items-center py-sm active:opacity-70"
  >
    <Text className="text-center text-body text-text-muted">
      {prompt}{' '}
      <Text
        className="text-accent"
        style={{ fontFamily: fonts.monoBold, letterSpacing: 0.4 }}
      >
        {actionLabel}
      </Text>
    </Text>
  </Pressable>
);
