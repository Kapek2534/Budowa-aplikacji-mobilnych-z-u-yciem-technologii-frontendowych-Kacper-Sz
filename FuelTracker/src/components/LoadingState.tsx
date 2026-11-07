import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { EmptyState } from './EmptyState';
import { colors } from './theme';

interface LoadingStateProps {
  status: 'loading' | 'error';
  onRetry: () => void;
}

export function LoadingState({ status, onRetry }: LoadingStateProps) {
  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Wczytywanie" />
      </View>
    );
  }
  return (
    <EmptyState
      title="Nie udało się wczytać danych"
      message="Wystąpił błąd odczytu z pamięci urządzenia."
      actionTitle="Spróbuj ponownie"
      onAction={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
