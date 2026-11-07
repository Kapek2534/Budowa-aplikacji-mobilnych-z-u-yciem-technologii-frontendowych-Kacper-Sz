import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/EmptyState';
import { FormField } from '../../components/FormField';
import { MessageBanner } from '../../components/MessageBanner';
import { OptionGroup } from '../../components/OptionGroup';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, MIN_TOUCH_SIZE, spacing } from '../../components/theme';
import { RefuelInput, ValidationErrors } from '../../domain/types';
import { todayIsoDate } from '../../domain/units';
import { useFuelData } from '../../state/FuelDataContext';

export default function NewRefuelScreen() {
  const router = useRouter();
  const { vehicles, addRefuel } = useFuelData();

  const [form, setForm] = useState<RefuelInput>({
    vehicleId: vehicles.length === 1 ? vehicles[0].id : '',
    date: todayIsoDate(),
    odometerKm: '',
    liters: '',
    cost: '',
    isFullTank: true,
  });
  const [errors, setErrors] = useState<ValidationErrors<RefuelInput>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (form.vehicleId === '' && vehicles.length === 1) {
      setForm((current) => ({ ...current, vehicleId: vehicles[0].id }));
    }
  }, [vehicles, form.vehicleId]);

  function update<K extends keyof RefuelInput>(field: K, value: RefuelInput[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaveError(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const result = await addRefuel(form);
    setSaving(false);
    if (result.ok) {
      router.back();
      return;
    }
    setErrors(result.errors);
    setSaveError(result.message ?? 'Popraw zaznaczone pola.');
  }

  if (vehicles.length === 0) {
    return (
      <EmptyState
        title="Brak pojazdów"
        message="Tankowanie musi być przypisane do pojazdu. Dodaj pojazd, aby kontynuować."
        actionTitle="Dodaj pojazd"
        onAction={() => router.push('/vehicles/new')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {saveError ? <MessageBanner message={saveError} type="error" /> : null}

          <OptionGroup
            label="Pojazd"
            options={vehicles.map((vehicle) => ({ value: vehicle.id, label: vehicle.name }))}
            selected={form.vehicleId}
            onSelect={(value) => update('vehicleId', value)}
            error={errors.vehicleId}
          />
          <FormField
            label="Data (RRRR-MM-DD)"
            value={form.date}
            onChangeText={(text) => update('date', text)}
            placeholder="RRRR-MM-DD"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            error={errors.date}
          />
          <FormField
            label="Stan licznika (km)"
            value={form.odometerKm}
            onChangeText={(text) => update('odometerKm', text)}
            placeholder="np. 120500"
            keyboardType="number-pad"
            maxLength={7}
            error={errors.odometerKm}
          />
          <FormField
            label="Litry"
            value={form.liters}
            onChangeText={(text) => update('liters', text)}
            placeholder="np. 45,32"
            keyboardType="decimal-pad"
            error={errors.liters}
          />
          <FormField
            label="Koszt (zł)"
            value={form.cost}
            onChangeText={(text) => update('cost', text)}
            placeholder="np. 289,99"
            keyboardType="decimal-pad"
            error={errors.cost}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Tankowanie do pełna</Text>
            <Switch
              accessibilityLabel="Tankowanie do pełna"
              value={form.isFullTank}
              onValueChange={(value) => update('isFullTank', value)}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton title="Zapisz" onPress={handleSave} loading={saving} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  switchRow: {
    minHeight: MIN_TOUCH_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text,
    flexShrink: 1,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
