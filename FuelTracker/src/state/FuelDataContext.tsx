import { useSQLiteContext } from 'expo-sqlite';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createRefuelRepository } from '../data/refuelRepository';
import { createVehicleRepository } from '../data/vehicleRepository';
import { Refuel, RefuelInput, ValidationErrors, Vehicle, VehicleInput } from '../domain/types';
import { createRefuel } from '../services/refuelService';
import { createVehicle } from '../services/vehicleService';

export type SaveResult<TInput> =
  | { ok: true; id: string }
  | { ok: false; errors: ValidationErrors<TInput>; message?: string };

type LoadStatus = 'loading' | 'ready' | 'error';

interface FuelDataContextValue {
  vehicles: Vehicle[];
  refuels: Refuel[];
  status: LoadStatus;
  notice: string | null;
  clearNotice: () => void;
  reload: () => Promise<void>;
  addVehicle: (input: VehicleInput) => Promise<SaveResult<VehicleInput>>;
  addRefuel: (input: RefuelInput) => Promise<SaveResult<RefuelInput>>;
}

const FuelDataContext = createContext<FuelDataContextValue | null>(null);

const SAVE_ERROR_MESSAGE = 'Nie udało się zapisać danych. Spróbuj ponownie.';

export function FuelDataProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const repositories = useMemo(
    () => ({
      vehicles: createVehicleRepository(db),
      refuels: createRefuelRepository(db),
    }),
    [db],
  );

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refuels, setRefuels] = useState<Refuel[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [notice, setNotice] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [loadedVehicles, loadedRefuels] = await Promise.all([
        repositories.vehicles.findAll(),
        repositories.refuels.findAll(),
      ]);
      setVehicles(loadedVehicles);
      setRefuels(loadedRefuels);
      setStatus('ready');
    } catch (error) {
      console.error('Failed to load data', error);
      setStatus('error');
    }
  }, [repositories]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addVehicle = useCallback(
    async (input: VehicleInput): Promise<SaveResult<VehicleInput>> => {
      try {
        const result = await createVehicle(repositories.vehicles, input);
        if (!result.ok) {
          return result;
        }
        await reload();
        setNotice(`Dodano pojazd „${result.value.name}”.`);
        return { ok: true, id: result.value.id };
      } catch (error) {
        console.error('Failed to save vehicle', error);
        return { ok: false, errors: {}, message: SAVE_ERROR_MESSAGE };
      }
    },
    [repositories, reload],
  );

  const addRefuel = useCallback(
    async (input: RefuelInput): Promise<SaveResult<RefuelInput>> => {
      try {
        const result = await createRefuel(repositories, input);
        if (!result.ok) {
          return result;
        }
        await reload();
        setNotice('Zapisano tankowanie.');
        return { ok: true, id: result.value.id };
      } catch (error) {
        console.error('Failed to save refuel', error);
        return { ok: false, errors: {}, message: SAVE_ERROR_MESSAGE };
      }
    },
    [repositories, reload],
  );

  const clearNotice = useCallback(() => setNotice(null), []);

  const value = useMemo(
    () => ({ vehicles, refuels, status, notice, clearNotice, reload, addVehicle, addRefuel }),
    [vehicles, refuels, status, notice, clearNotice, reload, addVehicle, addRefuel],
  );

  return <FuelDataContext.Provider value={value}>{children}</FuelDataContext.Provider>;
}

export function useFuelData(): FuelDataContextValue {
  const context = useContext(FuelDataContext);
  if (!context) {
    throw new Error('useFuelData must be used inside FuelDataProvider');
  }
  return context;
}
