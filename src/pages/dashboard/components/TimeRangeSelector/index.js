// src/pages/dashboard/components/TimeRangeSelector/index.js
import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { TIME_RANGES } from '../../constants/dashboardConstants';

const TimeRangeSelector = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (range) => {
    onChange(range);
    handleClose();
  };

  return (
    <>
      <Button 
        startIcon={<CalendarMonth />}
        variant="outlined"
        onClick={handleClick}
        size="small"
      >
        {value}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {TIME_RANGES.map((range) => (
          <MenuItem 
            key={range.value}
            onClick={() => handleSelect(range.value)}
            selected={value === range.value}
          >
            {range.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TimeRangeSelector;