import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Paper,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { searchLocations } from '../services/weatherApi';
import type { LocationSearchResult } from '../types/weather';

interface SearchBarProps {
  onLocationSelect: (location: LocationSearchResult) => void;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, disabled = false }) => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        try {
          const results = await searchLocations(query);
          setOptions(results);
        } catch (error) {
          console.error('Search error:', error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setOptions([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleLocationSelect = (_event: React.SyntheticEvent<Element, Event>, newValue: LocationSearchResult | null) => {
    if (newValue) {
      onLocationSelect(newValue);
      setQuery('');
      setOptions([]);
    }
  };

  return (
    <Autocomplete
      sx={{ width: '100%', maxWidth: 600 }}
      options={options}
      getOptionLabel={(option) => option.formatted}
      loading={loading}
      disabled={disabled}
      noOptionsText={query.length <= 2 ? "Type at least 3 characters to search" : "No locations found"}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for a city, state, or country..."
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <LocationIcon sx={{ color: 'text.secondary', mr: 2 }} />
          <Box>
            <Typography variant="body1">
              {option.city ? `${option.city}, ` : ''}
              {option.state ? `${option.state}, ` : ''}
              {option.country}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {option.formatted}
            </Typography>
          </Box>
        </Box>
      )}
      PaperComponent={(props) => (
        <Paper {...props} elevation={3} sx={{ mt: 1 }} />
      )}
      inputValue={query}
      onInputChange={(_event, newInputValue) => {
        setQuery(newInputValue);
      }}
      onChange={handleLocationSelect}
      clearOnBlur
      clearOnEscape
    />
  );
}; 