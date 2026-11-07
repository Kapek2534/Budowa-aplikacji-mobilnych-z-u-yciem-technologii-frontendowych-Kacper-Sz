export const FUEL_TYPES = ['petrol', 'diesel', 'lpg'] as const;

export type FuelType = (typeof FUEL_TYPES)[number];

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  petrol: 'Benzyna',
  diesel: 'Diesel',
  lpg: 'LPG',
};

export interface Vehicle {
  id: string;
  name: string;
  fuelType: FuelType;
  createdAt: string;
}

export interface Refuel {
  id: string;
  vehicleId: string;
  date: string;
  odometerKm: number;
  volumeMl: number;
  costCents: number;
  isFullTank: boolean;
  createdAt: string;
}

export interface VehicleInput {
  name: string;
  fuelType: string;
}

export interface RefuelInput {
  vehicleId: string;
  date: string;
  odometerKm: string;
  liters: string;
  cost: string;
  isFullTank: boolean;
}

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type Result<TValue, TInput> =
  | { ok: true; value: TValue }
  | { ok: false; errors: ValidationErrors<TInput> };
