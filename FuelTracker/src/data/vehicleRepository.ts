import type { SQLiteDatabase } from 'expo-sqlite';

import { FuelType, Vehicle } from '../domain/types';

export interface VehicleRepository {
  findAll(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  insert(vehicle: Vehicle): Promise<void>;
}

interface VehicleRow {
  id: string;
  name: string;
  fuel_type: FuelType;
  created_at: string;
}

function toVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    name: row.name,
    fuelType: row.fuel_type,
    createdAt: row.created_at,
  };
}

export function createVehicleRepository(db: SQLiteDatabase): VehicleRepository {
  return {
    async findAll() {
      const rows = await db.getAllAsync<VehicleRow>(
        'SELECT * FROM vehicles ORDER BY name COLLATE NOCASE ASC',
      );
      return rows.map(toVehicle);
    },

    async findById(id) {
      const row = await db.getFirstAsync<VehicleRow>('SELECT * FROM vehicles WHERE id = ?', id);
      return row ? toVehicle(row) : null;
    },

    async insert(vehicle) {
      await db.runAsync(
        'INSERT INTO vehicles (id, name, fuel_type, created_at) VALUES (?, ?, ?, ?)',
        vehicle.id,
        vehicle.name,
        vehicle.fuelType,
        vehicle.createdAt,
      );
    },
  };
}
