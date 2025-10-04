import React from 'react';
import Card from '../shared/Card';
import { ICONS } from '../../constants';
import { Appointment } from '../../types';
import { useAppContext } from '../../context/AppContext';
import PriorityPatientsCard from './PriorityPatientsCard';

interface SpecialistDashboardProps {
    onNavigate: (screen: string, params?: any) => void;
    onStartSession: (appointment: Appointment, consent: boolean) => void;
}

const UpNextCard: React.FC<{ appointment: Appointment, onStart: () => void }> = ({ appointment, onStart }) => {
    const isReady = true; // Placeholder for time-check logic

    return (
        <Card className="bg-gradient-to-br from-secondary to-purple-600 text-white shadow-lg">
            <h2 className="text-xl font-bold">Up Next</h2>
            <div className="flex items-start space-x-4 mt-3">
                <img src={`https://i.pravatar.cc/150?u=${appointment.patientId}`} alt={appointment.patientName} className="w-16 h-16 rounded-full border-2 border-white/50" />
                <div className="flex-1">
                    <p className="font-bold text-lg">{appointment.patientName}</p>
                    <p className="text-sm opacity-90">{appointment.time} - {appointment.mode} Session</p>
                </div>
            </div>
            {isReady && appointment.mode === 'Online' && (
                 <button onClick={onStart} className="w-full btn bg-white text-secondary border-none hover:bg-gray-200 mt-4">
                    {ICONS.video}
                    <span className="ml-2">Start Session Now</span>
                </button>
            )}
        </Card>
    );
};


const ActionCenterCard: React.FC<{ onNavigate: SpecialistDashboardProps['onNavigate'] }> = ({ onNavigate }) => (
    <Card>
        <h3 className="font-bold text-neutral mb-3">Action Center</h3>
        <div className="space-y-3">
            <div 
                className="flex items-center justify-between p-3 bg-amber-50 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => onNavigate('requests')}
            >
                <div className="flex items-center space-x-3">
                    <div className="text-amber-500">{ICONS.bell}</div>
                    <p className="font-semibold text-amber-800">Pending Requests</p>
                </div>
                <span className="font-bold text-lg text-amber-800">3</span>
            </div>
            <div 
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => onNavigate('patients', { initialTab: 'chat' })}
            >
                <div className="flex items-center space-x-3">
                    <div className="text-blue-500">{ICONS.messages}</div>
                    <p className="font-semibold text-blue-800">Unread Messages</p>
                </div>
                 <span className="font-bold text-lg text-blue-800">5</span>
            </div>
        </div>
    </Card>
);

const TodaysScheduleCard: React.FC<{ appointments: Appointment[], onNavigate: (screen: string, params?: any) => void }> = ({ appointments, onNavigate }) => (
    <Card>
        <h3 className="font-bold text-neutral mb-2">Today's Schedule</h3>
        {appointments.length > 0 ? (
            <div className="space-y-2">
                {appointments.map(app => (
                     <div key={app.id} className="flex items-center space-x-3 p-2 bg-base-200 rounded-lg">
                        <span className="font-semibold text-sm text-secondary w-16">{app.time}</span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-neutral">{app.patientName}</p>
                            <p className="text-xs text-gray-500">{app.mode}</p>
                        </div>
                        <button onClick={() => onNavigate('patients', { patientId: app.patientId })} className="btn btn-ghost btn-xs">
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-6">
                <p className="text-sm text-gray-500">No other appointments scheduled for today.</p>
            </div>
        )}
    </Card>
);

const SpecialistDashboard: React.FC<SpecialistDashboardProps> = ({ onNavigate, onStartSession }) => {
    const { appointments } = useAppContext();
    const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Upcoming');
    
    // Find the next upcoming appointment for today
    const nextAppointment = todayAppointments
        .sort((a, b) => a.time.localeCompare(b.time))
        .find(a => true); // In a real app, you'd check against current time

    const remainingAppointments = todayAppointments.filter(a => a.id !== nextAppointment?.id);

    return (
        <div className="p-4 space-y-4">
            <div className="text-left">
                <h2 className="text-2xl font-bold text-neutral">Welcome back, Dr. Sharma!</h2>
                <p className="text-gray-500">Let's get your day started.</p>
            </div>
            
            {/* 1. Action Center */}
            <ActionCenterCard onNavigate={onNavigate} />

            {/* 2. Up Next */}
            {nextAppointment && (
                <UpNextCard 
                    appointment={nextAppointment} 
                    onStart={() => onStartSession(nextAppointment, true)} 
                />
            )}
            
            {/* 3. Today's Schedule */}
            <TodaysScheduleCard appointments={remainingAppointments} onNavigate={onNavigate} />

            {/* 4. Patient Spotlight */}
            <PriorityPatientsCard onNavigate={onNavigate} />

        </div>
    );
};

export default SpecialistDashboard;
