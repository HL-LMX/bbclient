// MuiCalendar.js
import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Use the default English locale (week starts on Sunday)
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function MuiCalendar({ currentDate, onChange }) {
  // Convert currentDate to a dayjs object
  const formattedCurrentDate = dayjs(currentDate);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <DateCalendar
        value={formattedCurrentDate}
        onChange={(newValue) => onChange(newValue.toDate())}
        // Disable weekend days: Sunday (0) and Saturday (6)
        shouldDisableDate={(day) => {
          const dayOfWeek = day.day(); // Sunday: 0, Monday: 1, ... Saturday: 6
          return dayOfWeek === 0 || dayOfWeek === 6;
        }}
        renderDay={(day, selectedDate, DayComponentProps) => {
          // Highlight the current date if it matches
          if (
            dayjs(day).format('YYYY-MM-DD') === formattedCurrentDate.format('YYYY-MM-DD')
          ) {
            return <DayComponentProps.selected {...DayComponentProps} />;
          }
          return <DayComponentProps.empty {...DayComponentProps} />;
        }}
        // Removed displayWeekNumber if it was previously set
      />
    </LocalizationProvider>
  );
}
