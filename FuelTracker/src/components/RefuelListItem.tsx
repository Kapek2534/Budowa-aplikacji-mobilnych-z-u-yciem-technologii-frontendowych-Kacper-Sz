import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Refuel } from '../domain/types';
import { formatCost, formatDate, formatOdometer, formatVolume } from '../domain/units';
import { colors, MIN_TOUCH_SIZE, spacing } from './theme';

interface RefuelListItemProps {
  refuel: Refuel;
  vehicleName: string;
  onPress: () => void;
}

export function RefuelListItem({ refuel, vehicleName, onPress }: RefuelListItemProps) {
  const fullTankLabel = refuel.isFullTank ? 'do pełna' : 'częściowe';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Tankowanie ${formatDate(refuel.date)}, ${vehicleName}, ${formatVolume(refuel.volumeMl)}, ${formatCost(refuel.costCents)}, ${fullTankLabel}`}
      accessibilityHint="Otwiera szczegóły tankowania"
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <Text style={styles.date}>{formatDate(refuel.date)}</Text>
        <Text style={styles.cost}>{formatCost(refuel.costCents)}</Text>
      </View>
      <Text style={styles.vehicle}>{vehicleName}</Text>
      <View style={styles.row}>
        <Text style={styles.details}>
          {formatVolume(refuel.volumeMl)} · {formatOdometer(refuel.odometerKm)}
        </Text>
        <Text style={[styles.badge, refuel.isFullTank ? styles.badgeFull : styles.badgePartial]}>
          {fullTankLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: MIN_TOUCH_SIZE,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cost: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  vehicle: {
    fontSize: 15,
    color: colors.text,
  },
  details: {
    fontSize: 14,
    color: colors.textMuted,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  badgeFull: {
    color: colors.success,
    backgroundColor: colors.successBackground,
  },
  badgePartial: {
    color: colors.textMuted,
    backgroundColor: colors.background,
  },
});
