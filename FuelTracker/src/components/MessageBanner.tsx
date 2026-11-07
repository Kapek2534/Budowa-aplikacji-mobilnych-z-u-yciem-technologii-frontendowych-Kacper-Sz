import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from './theme';

interface MessageBannerProps {
  message: string;
  type: 'error' | 'success';
}

export function MessageBanner({ message, type }: MessageBannerProps) {
  const isError = type === 'error';
  return (
    <View
      style={[styles.banner, isError ? styles.error : styles.success]}
      accessibilityRole={isError ? 'alert' : 'summary'}
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.text, { color: isError ? colors.error : colors.success }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  error: {
    backgroundColor: colors.errorBackground,
  },
  success: {
    backgroundColor: colors.successBackground,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
});
