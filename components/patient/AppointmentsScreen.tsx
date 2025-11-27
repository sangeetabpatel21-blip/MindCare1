import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for local module.
import { MOCK_APPOINTMENTS } from '../../constants';
import Card from '../shared/Card';
// FIX: Corrected import path for local module.
import { Appointment } from '../../types';
import ReviewModal from './ReviewModal';
// FIX: Corrected import path for local module.
import { useAppContext } from '../../context/AppContext';

interface AppointmentCardProps {
    appointment: Appointment;
    onReview: () => void;
    onPay: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onReview, onPay }) => {
    
    const getStatusStyles = () => {
        switch (appointment.status) {
            case 'Upcoming':
                return { badge: 'bg-green-100 text-green-800', opacity: '' };
            case 'Pending Payment':
                return { badge: 'bg-amber-100 text-amber-800', opacity: '' };
            case 'Request Sent':
                return { badge: 'bg-blue-100 text-blue-800', opacity: 'opacity-80' };
            case 'Completed':
                 return { badge: 'bg-gray-200 text-gray-600', opacity: 'opacity-60' };
            default:
                return { badge: 'bg-gray-200 text-gray-600', opacity: 'opacity-60' };
        }
    };
    
    const { badge, opacity } = getStatusStyles();

    return (
        <Card className={`mb-4 ${opacity}`}>
            <div className="flex items-center space-x-4">
                <img src={appointment.specialist.avatarUrl} alt={appointment.specialist.name} className="w-12 h-12 rounded-full" style={{objectFit: 'cover'}} />
                <div className="flex-1">
                    <p className="font-bold text-neutral">{appointment.specialist.name}</p>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                     {appointment.status === 'Completed' && (
                        <button onClick={onReview} className="btn btn-xs btn-outline btn-primary mt-2">Leave a Review</button>
                    )}
                    {appointment.status === 'Pending Payment' && (
                        <button onClick={onPay} className="btn btn-xs btn-primary mt-2">Pay to Confirm</button>
                    )}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badge}`}>
                    {appointment.status}
                </span>
            </div>
        </Card>
    );
};

const AppointmentsScreen: React.FC = () => {
    const { appointments, confirmAppointmentByPayment } = useAppContext();
    const [reviewingAppointment, setReviewingAppointment] = useState<Appointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Simulate loading delay or listen real async fetch:
    useEffect(() => {
        if(appointments.length > 0) {
            setIsLoading(false);
        }
    }, [appointments]);

    // Sort all appointments and requests together by date
    const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const pendingAppointments = sortedAppointments.filter(a => a.status === 'Pending Payment' || a.status === 'Request Sent');
    const upcomingAppointments = sortedAppointments.filter(a => a.status === 'Upcoming');
    const pastAppointments = sortedAppointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'Request Declined');
    
    const handlePay = (appointmentId: string) => {
        confirmAppointmentByPayment(appointmentId);
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '350px', width: '100%' }}>
                <Skeleton height={120} count={3} style={{ marginBottom: 10 }} />
            </div>
        );
    }

    return (
        <div className="p-4">
            {reviewingAppointment && (
                <ReviewModal
                    appointment={reviewingAppointment}
                    onClose={() => setReviewingAppointment(null)}
                />
            )}

            {pendingAppointments.length > 0 && (
                <>
                    <h3 className="text-lg font-bold text-neutral mb-2">Pending</h3>
                    {pendingAppointments.map(app => (
                        <AppointmentCard key={app.id} appointment={app} onReview={() => {}} onPay={() => handlePay(app.id)} />
                    ))}
                </>
            )}

            <h3 className="text-lg font-bold text-neutral mt-6 mb-2">Upcoming</h3>
            {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => <AppointmentCard key={app.id} appointment={app} onReview={() => setReviewingAppointment(app)} onPay={() => handlePay(app.id)} />)
            ) : (
                <p className="text-gray-500 text-sm">No upcoming appointments.</p>
            )}

            <h3 className="text-lg font-bold text-neutral mt-6 mb-2">Past</h3>
             {pastAppointments.length > 0 ? (
                pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} onReview={() => setReviewingAppointment(app)} onPay={() => {}} />)
            ) : (
                <p className="text-gray-500 text-sm">No past appointments.</p>
            )}
        </div>
    );
};

export default AppointmentsScreen;
