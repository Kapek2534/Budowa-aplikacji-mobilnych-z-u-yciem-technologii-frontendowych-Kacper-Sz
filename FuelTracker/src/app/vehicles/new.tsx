import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '../../components/FormField';
import { MessageBanner } from '../../components/MessageBanner';
import { OptionGroup } from '../../components/OptionGroup';
import { PrimaryButton } from '../../components/PrimaryButton';
import { colors, spacing } from '../../components/theme';
import { FUEL_TYPE_LABELS, FUEL_TYPES, ValidationErrors, VehicleInput } from '../../domain/types';
import { VEHICLE_NAME_MAX_LENGTH } from '../../domain/validation';
import { useFuelData } from '../../state/FuelDataContext';

const FUEL_TYPE_OPTIONS = FUEL_TYPES.map((fuelType) => ({
  value: fuelType,
  label: FUEL_TYPE_LABELS[fuelType],
}));

export default function NewVehicleScreen() {
  const router = useRouter();
  const { addVehicle } = useFuelData();

  const [form, setForm] = useState<VehicleInput>({ name: '', fuelType: '' });
  const [errors, setErrors] = useState<ValidationErrors<VehicleInput>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: keyof VehicleInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaveError(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const result = await addVehicle(form);
    setSaving(false);
    if (result.ok) {
      router.back();
      return;
    }
    setErrors(result.errors);
    setSaveError(result.message ?? 'Popraw zaznaczone pola.');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {saveError ? <MessageBanner message={saveError} type="error" /> : null}
          <FormField
            label="Nazwa pojazdu"
            value={form.name}
            onChangeText={(text) => update('name', text)}
            placeholder="np. Skoda Octavia"
            maxLength={VEHICLE_NAME_MAX_LENGTH}
            autoCapitalize="words"
            error={errors.name}
          />
          <OptionGroup
            label="Rodzaj paliwa"
            options={FUEL_TYPE_OPTIONS}
            selected={form.fuelType}
            onSelect={(value) => update('fuelType', value)}
            error={errors.fuelType}
          />
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
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
