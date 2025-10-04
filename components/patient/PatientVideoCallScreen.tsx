import React, { useState, useEffect } from 'react';
import { Appointment } from '../../types';
import { ICONS } from '../../constants';

interface PatientVideoCallScreenProps {
    appointment: Appointment;
    onEndCall: () => void;
    initialConsent: boolean;
}

const PatientVideoCallScreen: React.FC<PatientVideoCallScreenProps> = ({ appointment, onEndCall, initialConsent }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [aiScribeEnabled, setAiScribeEnabled] = useState(initialConsent);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleToggleAiScribe = () => {
        // In a real app, this would send an event to the specialist's view.
        // Here we just toggle the local state for the patient's UI.
        setAiScribeEnabled(prev => !prev);
    };

    return (
        <div className="fixed inset-0 bg-gray-800 text-white flex flex-col z-50">
            {/* AI Scribe Status Banner */}
            <div className={`p-2 text-center text-sm font-semibold transition-colors ${aiScribeEnabled ? 'bg-green-600' : 'bg-gray-600'}`}>
                {aiScribeEnabled ? 'AI Scribe is Active' : 'AI Scribe is Disabled'}
            </div>

            <div className="flex-grow flex items-center justify-center p-2 relative">
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center relative">
                    <img src={appointment.specialist.avatarUrl} alt={appointment.specialist.name} className="w-32 h-32 rounded-full" />
                    <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">{appointment.specialist.name}</span>
                </div>
                <div className="absolute top-4 right-4 w-40 h-32 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-white">
                     <img src={appointment.specialist.avatarUrl.replace('s1', 'p1')} alt="You" className="w-16 h-16 rounded-full" />
                </div>
            </div>

            <div className="bg-gray-900 bg-opacity-80 p-4 flex justify-between items-center">
                <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>

                <div className="flex items-center space-x-2">
                    <button onClick={handleToggleAiScribe} className={`btn btn-sm ${aiScribeEnabled ? 'btn-warning' : 'btn-success'}`}>
                        {aiScribeEnabled ? 'Disable AI Scribe' : 'Enable AI Scribe'}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'}`}>
                        {ICONS.mic}
                    </button>
                    <button onClick={() => setIsCamOff(!isCamOff)} className={`p-3 rounded-full ${isCamOff ? 'bg-red-500' : 'bg-gray-700'}`}>
                        {ICONS.video}
                    </button>
                </div>

                <button onClick={onEndCall} className="btn btn-error">
                    Leave Call
                </button>
            </div>
        </div>
    );
};

export default PatientVideoCallScreen;