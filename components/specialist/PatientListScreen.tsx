



import React, { useState, useMemo, useEffect } from 'react';
// REMOVED: No longer importing mock data directly
import { ICONS } from '../../constants';
import Card from '../shared/Card';
// FIX: Corrected import path for local module.
import { Patient } from '../../types';
import PatientDetailScreen from './PatientDetailScreen';
// NEW: Import the API service
import { getPatients } from '../../services/apiService';

const PatientListCard: React.FC<{ patient: Patient, onClick: () => void }> = ({ patient, onClick }) => (
    <Card className="mb-3" onClick={onClick}>
        <div className="flex items-center space-x-4">
            <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <p className="font-bold text-neutral">{patient.name}</p>
                    {patient.unreadMessages && patient.unreadMessages > 0 && (
                         <span className="badge badge-secondary badge-sm">{patient.unreadMessages}</span>
                    )}
                </div>
                <p className="text-sm text-gray-500">Last Session: {patient.lastSession}</p>
                {patient.nextAppointment && <p className="text-xs font-semibold text-primary mt-1">Next: {patient.nextAppointment}</p>}
                {/* NEW: Display patient tags */}
                {patient.tags && patient.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {patient.tags.map(tag => (
                            <span key={tag} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{tag}</span>
                        ))}
                    </div>
                )}
            </div>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
    </Card>
);

type SortOption = 'name' | 'lastContacted' | 'nextAppointment';
type DetailTab = 'overview' | 'progress' | 'plan' | 'chat' | 'notes';

interface PatientListScreenProps {
    initialPatientId?: string;
    initialTab?: string;
}

const PatientListScreen: React.FC<PatientListScreenProps> = ({ initialPatientId, initialTab }) => {
    // NEW: State for patients list and loading status
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState<SortOption>('name');
    const [tagFilter, setTagFilter] = useState<string>('All');

    // NEW: Fetch patients on component mount
    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            const data = await getPatients();
            setPatients(data);
            setIsLoading(false);
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        if (initialPatientId && patients.length > 0) {
            const patientToSelect = patients.find(p => p.id === initialPatientId);
            if (patientToSelect) {
                setSelectedPatient(patientToSelect);
            }
        } else {
            setSelectedPatient(null);
        }
    }, [initialPatientId, patients]);

    const allTags = useMemo(() => ['All', ...Array.from(new Set(patients.flatMap(p => p.tags || [])))], [patients]);

    const filteredAndSortedPatients = useMemo(() => {
        return patients
            .filter(patient => 
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(patient => {
                if (tagFilter === 'All') return true;
                return patient.tags?.includes(tagFilter);
            })
            .sort((a, b) => {
                switch (sort) {
                    case 'lastContacted':
                        return new Date(b.lastSession).getTime() - new Date(a.lastSession).getTime();
                    case 'nextAppointment':
                        if (!a.nextAppointment) return 1;
                        if (!b.nextAppointment) return -1;
                        return new Date(a.nextAppointment).getTime() - new Date(b.nextAppointment).getTime();
                    case 'name':
                    default:
                        return a.name.localeCompare(b.name);
                }
            });
    }, [searchTerm, sort, tagFilter, patients]);

    if (selectedPatient) {
        return <PatientDetailScreen 
                    patient={selectedPatient} 
                    onBack={() => setSelectedPatient(null)} 
                    initialTab={initialPatientId === selectedPatient.id ? (initialTab as DetailTab) : undefined}
                />;
    }

    const renderContent = () => {
        if (isLoading) {
             return (
                <div className="flex justify-center items-center py-20">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            );
        }
        if (filteredAndSortedPatients.length > 0) {
            return filteredAndSortedPatients.map(patient => (
                <PatientListCard key={patient.id} patient={patient} onClick={() => setSelectedPatient(patient)} />
            ));
        }
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No patients found.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <input 
                type="text"
                placeholder="Search patients by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 mb-4 bg-white border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
             <div className="flex flex-wrap gap-2 mb-4">
                <select className="select select-bordered select-sm" value={sort} onChange={e => setSort(e.target.value as SortOption)}>
                    <option value="name">Sort by Name</option>
                    <option value="lastContacted">Sort by Last Contact</option>
                    <option value="nextAppointment">Sort by Next Appointment</option>
                </select>
                <select className="select select-bordered select-sm" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
                    {allTags.map(tag => <option key={tag} value={tag}>{tag === 'All' ? 'All Tags' : tag}</option>)}
                </select>
            </div>

            {renderContent()}
        </div>
    );
};

export default PatientListScreen;