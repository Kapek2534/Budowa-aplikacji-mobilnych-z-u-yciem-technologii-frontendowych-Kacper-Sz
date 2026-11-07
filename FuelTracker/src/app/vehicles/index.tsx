import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, spacing } from '../../components/theme';
import { FUEL_TYPE_LABELS } from '../../domain/types';
import { useFuelData } from '../../state/FuelDataContext';

function refuelCountLabel(count: number): string {
  if (count === 1) {
    return '1 tankowanie';
  }
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} tankowania`;
  }
  return `${count} tankowań`;
}

export default function VehicleListScreen() {
  const router = useRouter();
  const { vehicles, refuels } = useFuelData();

  const refuelCounts = useMemo(() => {
    const counts = new Map<string, number>();
    refuels.forEach((refuel) => counts.set(refuel.vehicleId, (counts.get(refuel.vehicleId) ?? 0) + 1));
    return counts;
  }, [refuels]);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <FlatList
        data={vehicles}
        keyExtractor={(vehicle) => vehicle.id}
        contentContainerStyle={[styles.list, vehicles.length === 0 && styles.listEmpty]}
        ListEmptyComponent={
          <EmptyState title="Brak pojazdów" message="Dodaj pierwszy pojazd, aby zapisywać tankowania." />
        }
        renderItem={({ item }) => (
          <View
            style={styles.item}
            accessible
            accessibilityLabel={`${item.name}, ${FUEL_TYPE_LABELS[item.fuelType]}, ${refuelCountLabel(refuelCounts.get(item.id) ?? 0)}`}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              {FUEL_TYPE_LABELS[item.fuelType]} · {refuelCountLabel(refuelCounts.get(item.id) ?? 0)}
            </Text>
          </View>
        )}
      />
      <View style={styles.footer}>
        <PrimaryButton title="Dodaj pojazd" onPress={() => router.push('/vehicles/new')} />
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
  item: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  details: {
    fontSize: 14,
    color: colors.textMuted,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
