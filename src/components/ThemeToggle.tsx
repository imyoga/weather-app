import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Brightness4 as LightModeIcon, Brightness7 as DarkModeIcon } from '@mui/icons-material';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Box>
      <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
        <IconButton
          onClick={toggleTheme}
          color="primary"
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}; 