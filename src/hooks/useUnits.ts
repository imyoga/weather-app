import { useContext } from 'react';
import { UnitsContext } from '../context/UnitsContextTypes';
import type { UnitsContextType } from '../context/UnitsContextTypes';

export const useUnits = (): UnitsContextType => {
  const context = useContext(UnitsContext);
  
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  
  return context;
}; 