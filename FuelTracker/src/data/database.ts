import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'fueltracker.db';

const MIGRATIONS: string[] = [
  `
  CREATE TABLE vehicles (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'lpg')),
    created_at TEXT NOT NULL
  );

  CREATE TABLE refuels (
    id TEXT PRIMARY KEY NOT NULL,
    vehicle_id TEXT NOT NULL REFERENCES vehicles (id) ON DELETE RESTRICT,
    date TEXT NOT NULL,
    odometer_km INTEGER NOT NULL CHECK (odometer_km >= 0),
    volume_ml INTEGER NOT NULL CHECK (volume_ml > 0),
    cost_cents INTEGER NOT NULL CHECK (cost_cents > 0),
    is_full_tank INTEGER NOT NULL CHECK (is_full_tank IN (0, 1)),
    created_at TEXT NOT NULL
  );

  CREATE INDEX idx_refuels_vehicle_date ON refuels (vehicle_id, date);
  `,
];

export async function migrateDb(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = row?.user_version ?? 0;

  for (let version = currentVersion; version < MIGRATIONS.length; version++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[version]);
      await db.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
  }
}
