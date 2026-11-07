import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../components/theme';
import { DATABASE_NAME, migrateDb } from '../data/database';
import { FuelDataProvider } from '../state/FuelDataContext';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDb}>
      <FuelDataProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.primary,
            headerTitleStyle: { color: colors.text },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Tankowania' }} />
          <Stack.Screen name="refuels/new" options={{ title: 'Nowe tankowanie' }} />
          <Stack.Screen name="refuels/[id]" options={{ title: 'Szczegóły tankowania' }} />
          <Stack.Screen name="vehicles/index" options={{ title: 'Pojazdy' }} />
          <Stack.Screen name="vehicles/new" options={{ title: 'Nowy pojazd' }} />
        </Stack>
      </FuelDataProvider>
    </SQLiteProvider>
  );
}
