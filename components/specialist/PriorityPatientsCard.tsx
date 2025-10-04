import React, { useState, useEffect, useMemo } from 'react';
import Card from '../shared/Card';
import { Patient } from '../../types';
import { getPatients } from '../../services/apiService';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../../constants';

interface PriorityPatientsCardProps {
    onNavigate: (screen: string, params?: any) => void;
}

type PriorityReason = 'Follow-up due' | 'Low task completion' | 'Declining mood reported';

interface PriorityPatient {
    patient: Patient;
    reason: PriorityReason;
}


const PriorityPatientsCard: React.FC<PriorityPatientsCardProps> = ({ onNavigate }) => {
    const { appointments, homeworkTasks } = useAppContext();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            const data = await getPatients();
            setPatients(data);
            setIsLoading(false);
        };
        fetchPatients();
    }, []);

    const priorityPatients = useMemo((): PriorityPatient[] => {
        if (!patients.length || !appointments.length) {
            return [];
        }

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        // Calculate overall task adherence
        // In a real app, this would be per-patient, but we'll use the global mock data for this example.
        const incompleteTasks = homeworkTasks.filter(t => !t.completed).length;
        const totalTasks = homeworkTasks.length;
        const isLowAdherence = totalTasks > 0 && (incompleteTasks / totalTasks) > 0.6;


        const priorityList: PriorityPatient[] = [];

        for (const patient of patients) {
            // Reason 1: Declining Mood Trend (simulated via mock data)
            if (patient.hasNegativeMoodTrend) {
                priorityList.push({ patient, reason: 'Declining mood reported' });
                continue; // Give this the highest priority
            }

            // Reason 2: Low Task Adherence
            // This is a global check for the demo, but would be per-patient in a real app
            if (isLowAdherence && patient.id === 'p1') { // Applying to a specific mock patient
                 priorityList.push({ patient, reason: 'Low task completion' });
                 continue;
            }

            // Reason 3: Follow-up Due
            const patientAppointments = appointments.filter(a => a.patientId === patient.id);
            const hasUpcoming = patientAppointments.some(a => a.status === 'Upcoming' && new Date(a.date) >= new Date());
            
            if (hasUpcoming) continue;

            const lastCompleted = patientAppointments
                .filter(a => a.status === 'Completed')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            if (lastCompleted && new Date(lastCompleted.date) < twoWeeksAgo) {
                priorityList.push({ patient, reason: 'Follow-up due' });
            }
        }
        
        // Remove duplicates and limit to 3
        const uniquePatients = Array.from(new Map(priorityList.map(item => [item.patient.id, item])).values());
        return uniquePatients.slice(0, 3);
        
    }, [patients, appointments, homeworkTasks]);

    const getReasonStyles = (reason: PriorityReason): { icon: string, color: string } => {
        switch (reason) {
            case 'Declining mood reported': return { icon: '📉', color: 'text-red-600' };
            case 'Low task completion': return { icon: '📋', color: 'text-amber-600' };
            case 'Follow-up due': return { icon: '🗓️', color: 'text-blue-600' };
            default: return { icon: '⭐', color: 'text-gray-600' };
        }
    };

    if (isLoading) {
        return (
            <Card>
                <div className="flex items-center space-x-3">
                    <div className="text-secondary">{ICONS.brain}</div>
                    <h3 className="font-bold text-neutral">Patient Spotlight</h3>
                </div>
                <div className="h-24 flex items-center justify-center">
                    <span className="loading loading-spinner"></span>
                </div>
            </Card>
        );
    }

    if (priorityPatients.length === 0) {
        return (
             <Card>
                 <div className="flex items-center space-x-3 mb-2">
                    <div className="text-secondary">{ICONS.brain}</div>
                    <h3 className="font-bold text-neutral">Patient Spotlight</h3>
                </div>
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No patients currently need special attention. Great job!</p>
                </div>
             </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center space-x-3 mb-3">
                <div className="text-secondary">{ICONS.brain}</div>
                <h3 className="font-bold text-neutral">Patient Spotlight</h3>
            </div>
            <div className="space-y-3">
                {priorityPatients.map(({ patient, reason }) => {
                    const { icon, color } = getReasonStyles(reason);
                    return (
                        <div 
                            key={patient.id} 
                            className="flex items-center space-x-3 p-2 bg-base-200 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                            onClick={() => onNavigate('patients', { patientId: patient.id })}
                        >
                            <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-neutral">{patient.name}</p>
                                <p className={`text-xs font-bold ${color} flex items-center`}>
                                    <span className="mr-1">{icon}</span>
                                    {reason}
                                </p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    )
                })}
            </div>
        </Card>
    );
};

export default PriorityPatientsCard;