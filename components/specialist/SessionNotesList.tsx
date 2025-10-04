import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import { SessionNote, Patient } from '../../types';

interface SessionNotesListProps {
    patient: Patient;
    onSelectNote: (note: SessionNote) => void;
}

const SessionNotesList: React.FC<SessionNotesListProps> = ({ patient, onSelectNote }) => {
    const { sessionNotes } = useAppContext();
    const patientNotes = sessionNotes
        .filter(note => note.patientId === patient.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-lg font-bold text-neutral">Session Notes</h3>
            {patientNotes.length > 0 ? (
                patientNotes.map(note => (
                    <Card key={note.id} onClick={() => onSelectNote(note)}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold">{note.progressNoteFormat} Note</h4>
                                <p className="text-xs text-gray-500">{note.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`badge ${note.status === 'draft' ? 'badge-warning' : 'badge-success'}`}>{note.status}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No session notes found for this patient.</p>
                    <p className="text-sm text-gray-400 mt-2">Notes will appear here after you complete a session.</p>
                </div>
            )}
        </div>
    );
};

export default SessionNotesList;