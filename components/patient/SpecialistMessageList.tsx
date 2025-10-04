

import React, { useState, useMemo } from 'react';
// FIX: Add MOCK_SPECIALISTS to the import to resolve a reference error.
// FIX: Corrected import path for local module.
import { MOCK_APPOINTMENTS, MOCK_CHAT_MESSAGES, MOCK_SPECIALISTS } from '../../constants';
// FIX: Corrected import path for local module.
import { Specialist } from '../../types';
import Card from '../shared/Card';
import PatientChatScreen from './PatientChatScreen';

const SpecialistMessageList: React.FC = () => {
    const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

    // In a real app, this would come from the user's data.
    // Here, we derive it from their appointments.
    const mySpecialists = useMemo(() => {
        const specialists: { [id: string]: Specialist } = {};
        MOCK_APPOINTMENTS.forEach(app => {
            // Find full specialist details from MOCK_SPECIALISTS
            const specialistDetails = MOCK_SPECIALISTS.find(s => s.name === app.specialist.name);
            if (specialistDetails && !specialists[specialistDetails.id]) {
                specialists[specialistDetails.id] = specialistDetails;
            }
        });
        return Object.values(specialists);
    }, []);

    const getUnreadCount = (specialistId: string) => {
        // This is a simple simulation
        const messages = MOCK_CHAT_MESSAGES['p1'] || []; // Assuming current user is patient 'p1'
        return messages.filter(m => m.sender === 'specialist').length % 3; // Mock logic
    };

    if (selectedSpecialist) {
        return <PatientChatScreen specialist={selectedSpecialist} onBack={() => setSelectedSpecialist(null)} />;
    }

    return (
        <div className="h-full">
            {mySpecialists.map(specialist => (
                <Card key={specialist.id} className="mb-3" onClick={() => setSelectedSpecialist(specialist)}>
                    <div className="flex items-center space-x-4">
                        <img src={specialist.avatarUrl} alt={specialist.name} className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                            <p className="font-bold text-neutral">{specialist.name}</p>
                            <p className="text-sm text-gray-500">{specialist.title}</p>
                        </div>
                        {getUnreadCount(specialist.id) > 0 && (
                            <span className="badge badge-primary">{getUnreadCount(specialist.id)}</span>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default SpecialistMessageList;