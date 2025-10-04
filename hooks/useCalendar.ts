import { useMemo } from 'react';

export const useCalendar = (date: Date) => {
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = date.getFullYear();
    const month = date.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    // Adjust firstDay to be 0 for Sunday, 1 for Monday etc.
    const firstDay = getFirstDayOfMonth(year, month);

    const calendarGrid = useMemo(() => {
        const grid: (number | null)[][] = [];
        let dayCounter = 1;
        
        for (let i = 0; i < 6; i++) { // Max 6 weeks in a month view
            const week: (number | null)[] = [];
            if (dayCounter > daysInMonth) break; // Stop if we've filled all days

            for (let j = 0; j < 7; j++) {
                // If it's the first week and the day is before the start day, or if we've passed the last day of the month
                if ((i === 0 && j < firstDay) || dayCounter > daysInMonth) {
                    week.push(null);
                } else {
                    week.push(dayCounter);
                    dayCounter++;
                }
            }
            grid.push(week);
        }
        return grid;
    }, [year, month, daysInMonth, firstDay]);
    
    return { calendarGrid, year, month };
};
