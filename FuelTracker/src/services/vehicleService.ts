import { randomUUID } from 'expo-crypto';

import type { VehicleRepository } from '../data/vehicleRepository';
import { Result, Vehicle, VehicleInput } from '../domain/types';
import { validateVehicle } from '../domain/validation';

export async function createVehicle(
  vehicles: VehicleRepository,
  input: VehicleInput,
): Promise<Result<Vehicle, VehicleInput>> {
  const validation = validateVehicle(input);
  if (!validation.ok) {
    return validation;
  }

  const vehicle: Vehicle = {
    id: randomUUID(),
    ...validation.value,
    createdAt: new Date().toISOString(),
  };
  await vehicles.insert(vehicle);
  return { ok: true, value: vehicle };
}
