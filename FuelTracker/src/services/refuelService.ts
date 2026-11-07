import { randomUUID } from 'expo-crypto';

import type { RefuelRepository } from '../data/refuelRepository';
import type { VehicleRepository } from '../data/vehicleRepository';
import { Refuel, RefuelInput, Result } from '../domain/types';
import { todayIsoDate } from '../domain/units';
import { checkOdometerOrder, validateRefuel } from '../domain/validation';

export interface RefuelServiceDeps {
  vehicles: VehicleRepository;
  refuels: RefuelRepository;
}

export async function createRefuel(
  { vehicles, refuels }: RefuelServiceDeps,
  input: RefuelInput,
  today: string = todayIsoDate(),
): Promise<Result<Refuel, RefuelInput>> {
  const validation = validateRefuel(input, today);
  if (!validation.ok) {
    return validation;
  }
  const draft = validation.value;

  const vehicle = await vehicles.findById(draft.vehicleId);
  if (!vehicle) {
    return { ok: false, errors: { vehicleId: 'Wybrany pojazd nie istnieje.' } };
  }

  const odometerError = checkOdometerOrder(draft, await refuels.findByVehicle(draft.vehicleId));
  if (odometerError) {
    return { ok: false, errors: { odometerKm: odometerError } };
  }

  const refuel: Refuel = {
    id: randomUUID(),
    ...draft,
    createdAt: new Date().toISOString(),
  };
  await refuels.insert(refuel);
  return { ok: true, value: refuel };
}
