import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { MessageBanner } from '../components/MessageBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { RefuelListItem } from '../components/RefuelListItem';
import { colors, MIN_TOUCH_SIZE, spacing } from '../components/theme';
import { useFuelData } from '../state/FuelDataContext';

const NOTICE_DURATION_MS = 3000;

export default function RefuelListScreen() {
  const router = useRouter();
  const { vehicles, refuels, status, notice, clearNotice, reload } = useFuelData();

  const vehicleNames = useMemo(
    () => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle.name])),
    [vehicles],
  );

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timeout = setTimeout(clearNotice, NOTICE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [notice, clearNotice]);

  const header = (
    <Stack.Screen
      options={{
        headerRight: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Pojazdy"
            accessibilityHint="Otwiera listę pojazdów"
            onPress={() => router.push('/vehicles')}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Pojazdy</Text>
          </Pressable>
        ),
      }}
    />
  );

  if (status !== 'ready') {
    return (
      <>
        {header}
        <LoadingState status={status} onRetry={reload} />
      </>
    );
  }

  if (vehicles.length === 0) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        {header}
        <EmptyState
          title="Witaj w FuelTracker"
          message="Aby zapisywać tankowania, najpierw dodaj swój pojazd."
          actionTitle="Dodaj pojazd"
          onAction={() => router.push('/vehicles/new')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      {header}
      <FlatList
        data={refuels}
        keyExtractor={(refuel) => refuel.id}
        contentContainerStyle={[styles.list, refuels.length === 0 && styles.listEmpty]}
        ListHeaderComponent={notice ? <MessageBanner message={notice} type="success" /> : undefined}
        ListEmptyComponent={
          <EmptyState
            title="Brak tankowań"
            message="Nie masz jeszcze żadnych zapisanych tankowań. Dodaj pierwsze, aby zacząć śledzić spalanie."
          />
        }
        renderItem={({ item }) => (
          <RefuelListItem
            refuel={item}
            vehicleName={vehicleNames.get(item.vehicleId) ?? 'Nieznany pojazd'}
            onPress={() => router.push({ pathname: '/refuels/[id]', params: { id: item.id } })}
          />
        )}
      />
      <View style={styles.footer}>
        <PrimaryButton title="Dodaj tankowanie" onPress={() => router.push('/refuels/new')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  listEmpty: {
    flexGrow: 1,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerButton: {
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  headerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
