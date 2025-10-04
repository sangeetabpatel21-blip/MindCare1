import React, { useState } from 'react';
// FIX: Corrected import path for local module.
import { Specialist } from '../../types';
import Card from '../shared/Card';
// FIX: Corrected import path for local module.
import { useAppContext } from '../../context/AppContext';

interface BookingRequestModalProps {
    specialist: Specialist;
    onClose: () => void;
    bookingType: 'full' | 'intro';
}

type BookingStep = 'selection' | 'specific_time' | 'immediate';

const BookingRequestModal: React.FC<BookingRequestModalProps> = ({ specialist, onClose, bookingType }) => {
    const { sendAppointmentRequest } = useAppContext();
    const [step, setStep] = useState<BookingStep>('selection');

    // State for specific time request
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('10:00');
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    // State for immediate request
    const [immediateMode, setImmediateMode] = useState<'Online' | 'In-person'>(specialist.modes[0]);
    const [location, setLocation] = useState('');


    const handleSendRequest = (type: 'immediate' | 'specific_time' | 'next_available' | 'introductory') => {
        let requestDetails: any = { specialist, type };

        if (type === 'specific_time') {
            requestDetails.requestedDate = selectedDate;
            requestDetails.requestedTime = selectedTime;
            requestDetails.requestedMode = specialist.modes.includes('Online') ? 'Online' : 'In-person';
        } else if (type === 'immediate') {
            requestDetails.requestedMode = immediateMode;
            if (immediateMode === 'In-person') {
                requestDetails.location = location;
            }
        } else if (type === 'introductory') {
             // For simplicity, let's auto-request the next available time for intros
            requestDetails.type = 'next_available'; 
            // In a real app, you might have a separate flow for scheduling this
        }
        
        sendAppointmentRequest(requestDetails);
        onClose();
    };
    
    const renderSelectionStep = () => (
        <>
            <h2 className="text-xl font-bold text-neutral text-center mb-4">Request a Session</h2>
            <div className="space-y-3">
                <button onClick={() => setStep('immediate')} className="w-full text-left p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                    <h3 className="font-bold text-error">Immediate Session</h3>
                    <p className="text-sm text-gray-600">For urgent matters. The specialist will be notified immediately.</p>
                </button>
                 <button onClick={() => setStep('specific_time')} className="w-full text-left p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                    <h3 className="font-bold text-neutral">Request Specific Time</h3>
                    <p className="text-sm text-gray-600">Propose a date and time that works for you.</p>
                </button>
                 <button onClick={() => handleSendRequest('next_available')} className="w-full text-left p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                    <h3 className="font-bold text-neutral">Request Next Available</h3>
                    <p className="text-sm text-gray-600">Ask for the specialist's next open appointment slot.</p>
                </button>
            </div>
             <button onClick={onClose} className="btn btn-ghost w-full mt-4">Cancel</button>
        </>
    );

    const renderSpecificTimeStep = () => (
        <>
            <h2 className="text-xl font-bold text-neutral mb-4">Request a Specific Time</h2>
            <div className="space-y-4">
                <div>
                    <label className="label"><span className="label-text">Select a Date</span></label>
                    <input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={e => setSelectedDate(e.target.value)} className="input input-bordered w-full" />
                </div>
                <div>
                    <label className="label"><span className="label-text">Select a Time Slot</span></label>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => (
                            <button key={time} onClick={() => setSelectedTime(time)} className={`btn btn-sm ${selectedTime === time ? 'btn-primary' : 'btn-outline'}`}>{time}</button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex space-x-2">
                <button onClick={() => setStep('selection')} className="btn btn-ghost flex-1">Back</button>
                <button onClick={() => handleSendRequest('specific_time')} className="btn btn-primary flex-1">Send Request</button>
            </div>
        </>
    );

    const renderImmediateStep = () => (
         <>
            <h2 className="text-xl font-bold text-neutral mb-4">Immediate Session Request</h2>
            <div className="space-y-4">
                <div>
                    <label className="label"><span className="label-text">Consultation Mode</span></label>
                    <div className="flex gap-2">
                        {specialist.modes.map(mode => (
                            <button key={mode} onClick={() => setImmediateMode(mode as any)} className={`btn btn-sm flex-1 ${immediateMode === mode ? 'btn-primary' : 'btn-outline'}`}>{mode}</button>
                        ))}
                    </div>
                </div>
                {immediateMode === 'In-person' && (
                    <div>
                        <label className="label"><span className="label-text">Preferred Location/Area</span></label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Downtown area, or specific address" className="input input-bordered w-full" />
                    </div>
                )}
            </div>
            <div className="mt-6 flex space-x-2">
                <button onClick={() => setStep('selection')} className="btn btn-ghost flex-1">Back</button>
                <button onClick={() => handleSendRequest('immediate')} className="btn btn-error flex-1">Send Urgent Request</button>
            </div>
        </>
    );
    
    const renderIntroStep = () => (
         <>
            <h2 className="text-xl font-bold text-neutral text-center mb-2">Book 15-Min Intro</h2>
            <p className="text-sm text-center text-gray-600 mb-4">
                This is a brief, complimentary chat to see if you and {specialist.name.split(' ')[0]} are a good fit.
            </p>
            <div className="space-y-3">
                 <button onClick={() => handleSendRequest('introductory')} className="w-full btn btn-primary">
                    Request an Intro Session
                </button>
                 <button onClick={onClose} className="w-full btn btn-ghost">
                    Cancel
                </button>
            </div>
        </>
    )

    const renderStep = () => {
        if (bookingType === 'intro') {
            return renderIntroStep();
        }
        switch (step) {
            case 'specific_time': return renderSpecificTimeStep();
            case 'immediate': return renderImmediateStep();
            case 'selection':
            default:
                return renderSelectionStep();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                        <img src={specialist.avatarUrl} alt={specialist.name} className="w-8 h-8 rounded-full" />
                        <span className="font-semibold">{specialist.name}</span>
                    </div>
                    {step === 'selection' && bookingType === 'full' && <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">✕</button>}
                </div>
                <div className="divider my-1"></div>
                {renderStep()}
            </Card>
        </div>
    );
};

export default BookingRequestModal;