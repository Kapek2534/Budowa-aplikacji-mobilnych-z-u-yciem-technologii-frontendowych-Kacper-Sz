import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { colors, spacing } from '../../components/theme';
import { FUEL_TYPE_LABELS } from '../../domain/types';
import { formatCost, formatDate, formatOdometer, formatVolume } from '../../domain/units';
import { useFuelData } from '../../state/FuelDataContext';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function RefuelDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refuels, vehicles } = useFuelData();

  const refuel = refuels.find((item) => item.id === id);
  if (!refuel) {
    return (
      <EmptyState
        title="Nie znaleziono tankowania"
        message="Ten rekord nie istnieje lub został usunięty."
        actionTitle="Wróć do listy"
        onAction={() => router.back()}
      />
    );
  }

  const vehicle = vehicles.find((item) => item.id === refuel.vehicleId);
  const pricePerLiterCents = Math.round((refuel.costCents * 1000) / refuel.volumeMl);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <DetailRow
          label="Pojazd"
          value={vehicle ? `${vehicle.name} (${FUEL_TYPE_LABELS[vehicle.fuelType]})` : 'Nieznany pojazd'}
        />
        <DetailRow label="Data" value={formatDate(refuel.date)} />
        <DetailRow label="Stan licznika" value={formatOdometer(refuel.odometerKm)} />
        <DetailRow label="Litry" value={formatVolume(refuel.volumeMl)} />
        <DetailRow label="Koszt" value={formatCost(refuel.costCents)} />
        <DetailRow label="Cena za litr" value={`${formatCost(pricePerLiterCents)}/l`} />
        <DetailRow label="Do pełna" value={refuel.isFullTank ? 'Tak' : 'Nie'} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  label: {
    fontSize: 15,
    color: colors.textMuted,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
});
