import { createContext } from 'react';

export type UnitSystem = 'metric' | 'imperial' | 'standard';

export interface UnitLabels {
  temperature: string;
  windSpeed: string;
  pressure: string;
  visibility: string;
  precipitation: string;
}

export interface UnitsContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  labels: UnitLabels;
}

export const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

export const UNIT_LABELS: Record<UnitSystem, UnitLabels> = {
  metric: {
    temperature: '°C',
    windSpeed: 'km/h',
    pressure: 'hPa',
    visibility: 'km',
    precipitation: 'mm'
  },
  imperial: {
    temperature: '°F',
    windSpeed: 'mph',
    pressure: 'hPa',
    visibility: 'mi',
    precipitation: 'in'
  },
  standard: {
    temperature: 'K',
    windSpeed: 'm/s',
    pressure: 'hPa',
    visibility: 'km',
    precipitation: 'mm'
  }
};

export const UNIT_SYSTEM_NAMES: Record<UnitSystem, string> = {
  metric: 'Metric',
  imperial: 'Imperial',
  standard: 'Scientific'
}; 