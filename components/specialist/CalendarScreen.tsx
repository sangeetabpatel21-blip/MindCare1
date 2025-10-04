import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for local module.
import { MOCK_APPOINTMENTS } from '../../constants';
import { useCalendar } from '../../hooks/useCalendar';
// FIX: Corrected import path for local module.
import { Appointment } from '../../types';
import Card from '../shared/Card';
import AppointmentRow from './AppointmentRow';

interface CalendarScreenProps {
    onNavigate?: (screen: string, params?: any) => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ onNavigate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { calendarGrid, year, month } = useCalendar(currentDate);
    const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getMonth() === month ? new Date().getDate() : null);

    const appointmentsByDay = useMemo(() => MOCK_APPOINTMENTS.reduce((acc, app) => {
        const date = new Date(app.date + 'T00:00:00Z');
        if (date.getFullYear() === year && date.getMonth() === month) {
            const day = date.getUTCDate();
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(app);
        }
        return acc;
    }, {} as Record<number, Appointment[]>), [year, month]);

    const selectedDayAppointments = useMemo(() => {
        if (!selectedDay) return [];
        return appointmentsByDay[selectedDay] || [];
    }, [selectedDay, appointmentsByDay]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDay(null);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePrevMonth} className="btn btn-ghost btn-circle btn-sm">&lt;</button>
                        <h2 className="text-lg font-bold">
                            {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
                        </h2>
                        <button onClick={handleNextMonth} className="btn btn-ghost btn-circle btn-sm">&gt;</button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarGrid.flat().map((day, index) => (
                            <button 
                                key={index}
                                onClick={() => day && setSelectedDay(day)}
                                disabled={!day}
                                className={`h-20 border rounded-lg p-1 text-xs overflow-hidden transition-colors text-left ${day ? 'hover:bg-primary-light' : 'bg-base-200'} ${selectedDay === day ? 'ring-2 ring-primary bg-primary-light' : ''}`}
                            >
                                {day && (
                                    <>
                                        <span className={`font-bold inline-block text-center w-full ${isToday(day) ? 'bg-secondary text-white rounded-full' : ''}`}>{day}</span>
                                        <div className="mt-1 space-y-0.5 overflow-y-auto max-h-12">
                                            {appointmentsByDay[day]?.map(app => (
                                                <div key={app.id} className="bg-primary text-white rounded px-1 text-[10px] truncate" title={`${app.time} - ${app.patientName}`}>
                                                    {app.time}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </button>
                        ))}
                    </div>
                </Card>

                {selectedDay && (
                    <Card>
                        <h3 className="font-bold text-neutral mb-2">
                            Schedule for {new Date(year, month, selectedDay).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </h3>
                        {selectedDayAppointments.length > 0 && onNavigate ? (
                            selectedDayAppointments.map(app => (
                                <AppointmentRow key={app.id} appointment={app} onNavigate={onNavigate} />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled for this day.</p>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CalendarScreen;