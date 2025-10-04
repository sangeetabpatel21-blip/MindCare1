import React from 'react';
import { Appointment } from '../../types';
import { ICONS } from '../../constants';

interface AppointmentRowProps {
    appointment: Appointment;
    onNavigate: (screen: string, params?: any) => void;
    onStartSession?: (appointment: Appointment) => void;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({ appointment, onNavigate, onStartSession }) => {
    const isToday = new Date(appointment.date).toDateString() === new Date().toDateString();
    
    return (
        <div className="flex items-center space-x-3 py-2 border-b border-base-200 last:border-b-0">
            <img src={`https://i.pravatar.cc/150?u=${appointment.patientId}`} alt={appointment.patientName} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <p className="text-sm font-semibold text-neutral">{appointment.patientName}</p>
                <p className="text-xs text-gray-500">{appointment.time} - {appointment.mode}</p>
            </div>
            <div className="flex space-x-2">
                {isToday && appointment.status === 'Upcoming' && onStartSession && appointment.mode === 'Online' ? (
                     <button 
                        onClick={() => onStartSession(appointment)}
                        className="btn btn-primary btn-sm flex items-center space-x-2"
                    >
                       {ICONS.video}
                       <span>Start</span>
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={() => onNavigate('patients', { patientId: appointment.patientId, initialTab: 'chat' })}
                            className="btn btn-secondary btn-xs"
                        >
                            Message
                        </button>
                        <button 
                            onClick={() => onNavigate('patients', { patientId: appointment.patientId })}
                            className="btn btn-ghost btn-xs"
                        >
                            Profile
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AppointmentRow;