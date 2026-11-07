export type DecimalParseResult =
  | { ok: true; value: number }
  | { ok: false; reason: 'format' | 'precision' };

const DECIMAL_PATTERN = /^(\d{1,9})(?:[.,](\d+))?$/;

export function parseDecimalToInt(text: string, scale: number): DecimalParseResult {
  const match = DECIMAL_PATTERN.exec(text.trim());
  if (!match) {
    return { ok: false, reason: 'format' };
  }
  const [, whole, fraction = ''] = match;
  if (fraction.length > scale) {
    return { ok: false, reason: 'precision' };
  }
  const value = Number(whole) * 10 ** scale + Number(fraction.padEnd(scale, '0') || '0');
  return { ok: true, value };
}

export function formatIntAsDecimal(value: number, scale: number, minFractionDigits = 2): string {
  const factor = 10 ** scale;
  const whole = Math.floor(value / factor);
  let fraction = String(value % factor).padStart(scale, '0');
  while (fraction.length > minFractionDigits && fraction.endsWith('0')) {
    fraction = fraction.slice(0, -1);
  }
  return fraction.length > 0 ? `${whole},${fraction}` : String(whole);
}

export function formatCost(costCents: number): string {
  return `${formatIntAsDecimal(costCents, 2)} zł`;
}

export function formatVolume(volumeMl: number): string {
  return `${formatIntAsDecimal(volumeMl, 3)} l`;
}

export function formatOdometer(odometerKm: number): string {
  return `${odometerKm.toLocaleString('pl-PL')} km`;
}

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidIsoDate(text: string): boolean {
  const match = ISO_DATE_PATTERN.exec(text);
  if (!match) {
    return false;
  }
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function todayIsoDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}
