import React, { useState, useMemo } from 'react';
import { Patient, Appointment, SessionNote } from '../../types';
import { ICONS, MOCK_LAST_SESSION_SUMMARY, MOCK_APPOINTMENTS } from '../../constants';
import Card from '../shared/Card';
import PatientProgressView from './PatientProgressView';
import WellnessPlanManager from './WellnessPlanManager';
import SpecialistMessagingScreen from './SpecialistMessagingScreen';
import SessionNotesList from './SessionNotesList';
import NoteEditorScreen from './NoteEditorScreen'; 

type DetailTab = 'overview' | 'progress' | 'plan' | 'chat' | 'notes';

interface PatientDetailScreenProps {
    patient: Patient;
    onBack: () => void;
    initialTab?: DetailTab;
}

const PatientDetailScreen: React.FC<PatientDetailScreenProps> = ({ patient, onBack, initialTab }) => {
    const [activeTab, setActiveTab] = useState<DetailTab>(initialTab || 'overview');
    const [editingNote, setEditingNote] = useState<SessionNote | null>(null);

    const handleSelectNote = (note: SessionNote) => {
        setEditingNote(note);
    };

    const handleCloseNoteEditor = () => {
        setEditingNote(null);
    };

    if (editingNote) {
        return <NoteEditorScreen note={editingNote} onBack={handleCloseNoteEditor} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'progress':
                return <PatientProgressView patient={patient} />;
            case 'plan':
                return <WellnessPlanManager patient={patient} />;
            case 'chat':
                return <SpecialistMessagingScreen patient={patient} />;
            case 'notes':
                return <SessionNotesList patient={patient} onSelectNote={handleSelectNote} />;
            case 'overview':
            default:
                return <OverviewTab patient={patient} />;
        }
    };

    const tabs: {id: DetailTab, label: string}[] = [
        {id: 'overview', label: 'Overview'},
        {id: 'progress', label: 'Progress'},
        {id: 'plan', label: 'Plan'},
        {id: 'chat', label: 'Chat'},
        {id: 'notes', label: 'Notes'},
    ]

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 bg-white border-b flex items-center space-x-3 sticky top-0 z-10">
                <button onClick={onBack} className="btn btn-ghost btn-sm btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full" />
                <div>
                    <h2 className="text-lg font-bold text-neutral">{patient.name}</h2>
                    <p className="text-xs text-gray-500">Next Appointment: {patient.nextAppointment || 'N/A'}</p>
                </div>
            </div>

            <div className="tabs tabs-boxed bg-base-200 mx-4 mt-4">
                {tabs.map(tab => (
                    <button key={tab.id} className={`tab flex-1 ${activeTab === tab.id ? 'tab-active !bg-secondary text-white' : ''}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
                ))}
            </div>


            <div className="flex-grow overflow-y-auto">
                 {renderContent()}
            </div>
        </div>
    );
};


const OverviewTab: React.FC<{ patient: Patient }> = ({ patient }) => {
    const lastAnalyzedSession = useMemo(() => {
        return MOCK_APPOINTMENTS
            .filter(app => app.patientId === patient.id && app.status === 'Completed' && app.analysis)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        [0];
    }, [patient.id]);

    return (
    <div className="p-4 space-y-4">
        <Card>
            <h3 className="font-bold text-neutral mb-2">Patient Details</h3>
            <div className="text-sm space-y-1">
                <p><strong>Last Session:</strong> {patient.lastSession}</p>
                <p><strong>Next Appointment:</strong> {patient.nextAppointment || 'Not Scheduled'}</p>
            </div>
            {patient.tags && patient.tags.length > 0 && (
                 <div className="mt-3">
                    <h4 className="font-semibold text-sm mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {patient.tags.map(tag => (
                            <span key={tag} className="badge badge-accent badge-outline">{tag}</span>
                        ))}
                    </div>
                </div>
            )}
        </Card>
        
        {lastAnalyzedSession && lastAnalyzedSession.analysis && (
             <Card>
                <div className="flex items-center space-x-2 mb-3">
                    <div className="text-secondary">{ICONS.brain}</div>
                    <h3 className="font-bold text-neutral">Last Session AI Insights</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                     <div>
                        <span className="font-semibold">Sentiment:</span>
                        <span className="ml-2 badge badge-info badge-outline">{lastAnalyzedSession.analysis.sentiment}</span>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">Key Themes:</p>
                        <div className="flex flex-wrap gap-2">
                            {lastAnalyzedSession.analysis.keyThemes.map(theme => (
                                <span key={theme} className="badge badge-ghost">{theme}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        )}

        <Card>
            <h3 className="font-bold text-neutral mb-2">Last Session Summary</h3>
            <p className="text-xs text-gray-500 mb-3">from {MOCK_LAST_SESSION_SUMMARY.date}</p>
             <ul className="space-y-2">
                {MOCK_LAST_SESSION_SUMMARY.summary.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                       <span className="text-secondary mt-1">&bull;</span>
                       <span>{point}</span>
                    </li>
                ))}
            </ul>
        </Card>
    </div>
    );
};


export default PatientDetailScreen;