import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import {
  Speed as UnitsIcon,
  Thermostat as MetricIcon,
  Straighten as ImperialIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { useUnits } from '../hooks/useUnits';
import type { UnitSystem } from '../context/UnitsContextTypes';
import { UNIT_SYSTEM_NAMES } from '../context/UnitsContextTypes';

const getUnitIcon = (unitSystem: UnitSystem) => {
  switch (unitSystem) {
    case 'metric':
      return <MetricIcon />;
    case 'imperial':
      return <ImperialIcon />;
    case 'standard':
      return <ScienceIcon />;
    default:
      return <MetricIcon />;
  }
};

const getUnitDescription = (unitSystem: UnitSystem) => {
  switch (unitSystem) {
    case 'metric':
      return 'Celsius, km/h, km';
    case 'imperial':
      return 'Fahrenheit, mph, miles';
    case 'standard':
      return 'Kelvin, m/s, km';
    default:
      return 'Celsius, km/h, km';
  }
};

export const UnitsToggle: React.FC = () => {
  const { unitSystem, setUnitSystem } = useUnits();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnitChange = (newUnitSystem: UnitSystem) => {
    setUnitSystem(newUnitSystem);
    handleClose();
  };

  const unitSystems: UnitSystem[] = ['metric', 'imperial', 'standard'];

  return (
    <>
      <Tooltip title="Change unit system">
        <IconButton
          onClick={handleClick}
          color="primary"
          aria-controls={open ? 'units-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <UnitsIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        id="units-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'units-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {unitSystems.map((system) => (
          <MenuItem
            key={system}
            onClick={() => handleUnitChange(system)}
            selected={system === unitSystem}
          >
            <ListItemIcon>
              {getUnitIcon(system)}
            </ListItemIcon>
            <ListItemText>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {UNIT_SYSTEM_NAMES[system]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getUnitDescription(system)}
                </Typography>
              </Box>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}; 