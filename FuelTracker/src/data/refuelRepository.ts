import type { SQLiteDatabase } from 'expo-sqlite';

import { Refuel } from '../domain/types';

export interface RefuelRepository {
  findAll(): Promise<Refuel[]>;
  findById(id: string): Promise<Refuel | null>;
  findByVehicle(vehicleId: string): Promise<Refuel[]>;
  insert(refuel: Refuel): Promise<void>;
}

interface RefuelRow {
  id: string;
  vehicle_id: string;
  date: string;
  odometer_km: number;
  volume_ml: number;
  cost_cents: number;
  is_full_tank: number;
  created_at: string;
}

function toRefuel(row: RefuelRow): Refuel {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    date: row.date,
    odometerKm: row.odometer_km,
    volumeMl: row.volume_ml,
    costCents: row.cost_cents,
    isFullTank: row.is_full_tank === 1,
    createdAt: row.created_at,
  };
}

const ORDER_NEWEST_FIRST = 'ORDER BY date DESC, odometer_km DESC';

export function createRefuelRepository(db: SQLiteDatabase): RefuelRepository {
  return {
    async findAll() {
      const rows = await db.getAllAsync<RefuelRow>(`SELECT * FROM refuels ${ORDER_NEWEST_FIRST}`);
      return rows.map(toRefuel);
    },

    async findById(id) {
      const row = await db.getFirstAsync<RefuelRow>('SELECT * FROM refuels WHERE id = ?', id);
      return row ? toRefuel(row) : null;
    },

    async findByVehicle(vehicleId) {
      const rows = await db.getAllAsync<RefuelRow>(
        `SELECT * FROM refuels WHERE vehicle_id = ? ${ORDER_NEWEST_FIRST}`,
        vehicleId,
      );
      return rows.map(toRefuel);
    },

    async insert(refuel) {
      await db.runAsync(
        `INSERT INTO refuels
          (id, vehicle_id, date, odometer_km, volume_ml, cost_cents, is_full_tank, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        refuel.id,
        refuel.vehicleId,
        refuel.date,
        refuel.odometerKm,
        refuel.volumeMl,
        refuel.costCents,
        refuel.isFullTank ? 1 : 0,
        refuel.createdAt,
      );
    },
  };
}
