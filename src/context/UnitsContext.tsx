import React, { useState, useEffect } from 'react';
import { UnitsContext, UNIT_LABELS } from './UnitsContextTypes';
import type { UnitSystem } from './UnitsContextTypes';

interface UnitsProviderProps {
  children: React.ReactNode;
}

export const UnitsProvider: React.FC<UnitsProviderProps> = ({ children }) => {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    // Check if user has a stored preference
    const stored = localStorage.getItem('unitSystem');
    if (stored && ['metric', 'imperial', 'standard'].includes(stored)) {
      return stored as UnitSystem;
    }
    // Default to metric system
    return 'metric';
  });

  useEffect(() => {
    localStorage.setItem('unitSystem', unitSystem);
  }, [unitSystem]);

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system);
  };

  const labels = UNIT_LABELS[unitSystem];

  return (
    <UnitsContext.Provider value={{ unitSystem, setUnitSystem, labels }}>
      {children}
    </UnitsContext.Provider>
  );
}; 