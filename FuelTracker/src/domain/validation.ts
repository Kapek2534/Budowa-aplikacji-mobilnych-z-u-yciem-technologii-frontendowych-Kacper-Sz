import {
  FUEL_TYPES,
  FuelType,
  Refuel,
  RefuelInput,
  Result,
  ValidationErrors,
  VehicleInput,
} from './types';
import { formatDate, formatOdometer, isValidIsoDate, parseDecimalToInt } from './units';

export const VEHICLE_NAME_MAX_LENGTH = 50;
export const ODOMETER_MAX_KM = 2_000_000;
export const VOLUME_MAX_ML = 1_000_000;
export const COST_MAX_CENTS = 10_000_000;
export const MIN_DATE = '1950-01-01';

export interface VehicleDraft {
  name: string;
  fuelType: FuelType;
}

export interface RefuelDraft {
  vehicleId: string;
  date: string;
  odometerKm: number;
  volumeMl: number;
  costCents: number;
  isFullTank: boolean;
}

function isFuelType(value: string): value is FuelType {
  return (FUEL_TYPES as readonly string[]).includes(value);
}

export function validateVehicle(input: VehicleInput): Result<VehicleDraft, VehicleInput> {
  const errors: ValidationErrors<VehicleInput> = {};
  const name = input.name.trim();

  if (name.length === 0) {
    errors.name = 'Nazwa pojazdu jest wymagana.';
  } else if (name.length > VEHICLE_NAME_MAX_LENGTH) {
    errors.name = `Nazwa może mieć maksymalnie ${VEHICLE_NAME_MAX_LENGTH} znaków.`;
  }

  if (!isFuelType(input.fuelType)) {
    errors.fuelType = 'Wybierz rodzaj paliwa.';
  }

  if (Object.keys(errors).length > 0 || !isFuelType(input.fuelType)) {
    return { ok: false, errors };
  }
  return { ok: true, value: { name, fuelType: input.fuelType } };
}

function validateAmount(
  text: string,
  scale: number,
  max: number,
  labels: { required: string; format: string; precision: string; positive: string; max: string },
): { value?: number; error?: string } {
  if (text.trim().length === 0) {
    return { error: labels.required };
  }
  const parsed = parseDecimalToInt(text, scale);
  if (!parsed.ok) {
    return { error: parsed.reason === 'precision' ? labels.precision : labels.format };
  }
  if (parsed.value <= 0) {
    return { error: labels.positive };
  }
  if (parsed.value > max) {
    return { error: labels.max };
  }
  return { value: parsed.value };
}

export function validateRefuel(
  input: RefuelInput,
  today: string,
): Result<RefuelDraft, RefuelInput> {
  const errors: ValidationErrors<RefuelInput> = {};

  if (input.vehicleId.length === 0) {
    errors.vehicleId = 'Wybierz pojazd.';
  }

  const date = input.date.trim();
  if (date.length === 0) {
    errors.date = 'Data jest wymagana.';
  } else if (!isValidIsoDate(date)) {
    errors.date = 'Podaj poprawną datę w formacie RRRR-MM-DD.';
  } else if (date > today) {
    errors.date = 'Data tankowania nie może być z przyszłości.';
  } else if (date < MIN_DATE) {
    errors.date = `Data nie może być wcześniejsza niż ${formatDate(MIN_DATE)}.`;
  }

  let odometerKm: number | undefined;
  const odometerText = input.odometerKm.trim();
  if (odometerText.length === 0) {
    errors.odometerKm = 'Stan licznika jest wymagany.';
  } else if (!/^\d+$/.test(odometerText)) {
    errors.odometerKm = 'Stan licznika musi być liczbą całkowitą km.';
  } else if (Number(odometerText) > ODOMETER_MAX_KM) {
    errors.odometerKm = `Stan licznika nie może przekraczać ${formatOdometer(ODOMETER_MAX_KM)}.`;
  } else {
    odometerKm = Number(odometerText);
  }

  const volume = validateAmount(input.liters, 3, VOLUME_MAX_ML, {
    required: 'Liczba litrów jest wymagana.',
    format: 'Podaj liczbę litrów, np. 45,32.',
    precision: 'Litry mogą mieć maksymalnie 3 miejsca po przecinku.',
    positive: 'Liczba litrów musi być większa od 0.',
    max: 'Liczba litrów nie może przekraczać 1000 l.',
  });
  if (volume.error) {
    errors.liters = volume.error;
  }

  const cost = validateAmount(input.cost, 2, COST_MAX_CENTS, {
    required: 'Koszt jest wymagany.',
    format: 'Podaj kwotę, np. 289,99.',
    precision: 'Koszt może mieć maksymalnie 2 miejsca po przecinku.',
    positive: 'Koszt musi być większy od 0.',
    max: 'Koszt nie może przekraczać 100 000 zł.',
  });
  if (cost.error) {
    errors.cost = cost.error;
  }

  if (
    Object.keys(errors).length > 0 ||
    odometerKm === undefined ||
    volume.value === undefined ||
    cost.value === undefined
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      vehicleId: input.vehicleId,
      date,
      odometerKm,
      volumeMl: volume.value,
      costCents: cost.value,
      isFullTank: input.isFullTank,
    },
  };
}

export function checkOdometerOrder(
  draft: Pick<RefuelDraft, 'date' | 'odometerKm'>,
  otherRefuels: Pick<Refuel, 'date' | 'odometerKm'>[],
): string | null {
  const earlier = otherRefuels.filter((refuel) => refuel.date < draft.date);
  const later = otherRefuels.filter((refuel) => refuel.date > draft.date);

  const highestEarlier = earlier.reduce<Pick<Refuel, 'date' | 'odometerKm'> | null>(
    (best, refuel) => (best === null || refuel.odometerKm > best.odometerKm ? refuel : best),
    null,
  );
  if (highestEarlier && draft.odometerKm < highestEarlier.odometerKm) {
    return `Przebieg nie może maleć - tankowanie z ${formatDate(highestEarlier.date)} ma ${formatOdometer(highestEarlier.odometerKm)}.`;
  }

  const lowestLater = later.reduce<Pick<Refuel, 'date' | 'odometerKm'> | null>(
    (best, refuel) => (best === null || refuel.odometerKm < best.odometerKm ? refuel : best),
    null,
  );
  if (lowestLater && draft.odometerKm > lowestLater.odometerKm) {
    return `Przebieg nie może być większy niż w późniejszym tankowaniu z ${formatDate(lowestLater.date)} (${formatOdometer(lowestLater.odometerKm)}).`;
  }

  return null;
}
