import React, { useState } from 'react';
import Card from '../shared/Card';
import { ICONS } from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { Appointment } from '../../types';
import PatientVideoCallScreen from './PatientVideoCallScreen';

const AIConsentModal: React.FC<{ onDecide: (consent: boolean) => void }> = ({ onDecide }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
        <Card className="w-full max-w-sm">
            <h2 className="text-xl font-bold text-neutral text-center mb-3">AI Scribe Feature</h2>
            <p className="text-sm text-gray-600 mb-4">
                To help your specialist, our AI can transcribe your session. This transcript is confidential and used solely to assist in generating accurate session notes.
            </p>
            <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-start space-x-2"><span className="text-success mt-1">✓</span><span>Secure &amp; Confidential</span></li>
                <li className="flex items-start space-x-2"><span className="text-success mt-1">✓</span><span>Helps your specialist focus on you, not note-taking</span></li>
                <li className="flex items-start space-x-2"><span className="text-success mt-1">✓</span><span>You can enable or disable it at any time during the call</span></li>
            </ul>
            <div className="flex space-x-2">
                <button onClick={() => onDecide(false)} className="btn btn-ghost flex-1">Decline</button>
                <button onClick={() => onDecide(true)} className="btn btn-primary flex-1">Agree &amp; Join</button>
            </div>
        </Card>
    </div>
);


const NextAppointmentCard: React.FC = () => {
    const { appointments } = useAppContext();
    const [isJoiningCall, setIsJoiningCall] = useState(false);
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);

    const nextAppointment = React.useMemo(() => {
        const upcoming = appointments
            .filter(a => a.status === 'Upcoming' && new Date(a.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return upcoming[0] || null;
    }, [appointments]);

    const handleJoinClick = () => {
        setShowConsentModal(true);
    };

    const handleConsentDecision = (consent: boolean) => {
        setConsentGiven(consent);
        setShowConsentModal(false);
        setIsJoiningCall(true);
    };
    
    const handleEndCall = () => {
        setIsJoiningCall(false);
    };

    if (isJoiningCall && nextAppointment) {
        return <PatientVideoCallScreen appointment={nextAppointment} onEndCall={handleEndCall} initialConsent={consentGiven} />;
    }

    if (!nextAppointment) {
        return (
            <Card>
                <div className="flex items-center space-x-3">
                    <div className="text-primary">{ICONS.calendar}</div>
                    <div>
                        <h3 className="font-bold text-neutral">No Upcoming Appointments</h3>
                        <p className="text-sm text-gray-500">You can find and book a session with a specialist.</p>
                    </div>
                </div>
            </Card>
        );
    }

    const isToday = new Date(nextAppointment.date).toDateString() === new Date().toDateString();

    return (
        <>
            {showConsentModal && <AIConsentModal onDecide={handleConsentDecision} />}
            <Card>
                <h3 className="font-bold text-neutral mb-3">Your Next Appointment</h3>
                <div className="flex items-start space-x-4">
                    <img src={nextAppointment.specialist.avatarUrl} alt={nextAppointment.specialist.name} className="w-14 h-14 rounded-full" />
                    <div className="flex-1">
                        <p className="font-semibold text-neutral">{nextAppointment.specialist.name}</p>
                        <p className="text-sm text-gray-600">{new Date(nextAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm text-gray-600">{nextAppointment.time}</p>
                        <div className={`mt-2 flex items-center space-x-2 text-sm font-medium ${nextAppointment.mode === 'Online' ? 'text-blue-600' : 'text-purple-600'}`}>
                            {nextAppointment.mode === 'Online' ? ICONS.video : ICONS.mapPin}
                            <span>{nextAppointment.mode} Session</span>
                        </div>
                    </div>
                </div>
                {isToday && nextAppointment.mode === 'Online' && (
                    <button onClick={handleJoinClick} className="w-full btn btn-primary mt-4">
                        Join Video Call
                    </button>
                )}
            </Card>
        </>
    );
};

export default NextAppointmentCard;