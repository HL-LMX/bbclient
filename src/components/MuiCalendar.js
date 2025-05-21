// src/components/MuiCalendar.js

import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

/**
 * MuiCalendar: Material UI calendar for date selection (weekdays only).
 * Props:
 *  - currentDate: Date object representing the selected date
 *  - onChange: function called with a new Date when user changes selection
 */
export default function MuiCalendar({ currentDate, onChange }) {
    // Convert currentDate to a dayjs object
    const formattedCurrentDate = dayjs(currentDate);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <DateCalendar
                value={formattedCurrentDate}
                onChange={newValue => onChange(newValue.toDate())}
                // Disable weekend days: Sunday (0) and Saturday (6)
                shouldDisableDate={day => {
                    const dayOfWeek = day.day();
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
            />
        </LocalizationProvider>
    );
}
