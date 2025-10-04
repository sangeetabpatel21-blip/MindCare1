import React, { useState } from 'react';
import { SessionNote, SOAPNote, BIRPNote } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface NoteEditorScreenProps {
    note: SessionNote;
    onBack: () => void;
}

const NoteEditorScreen: React.FC<NoteEditorScreenProps> = ({ note, onBack }) => {
    const { addOrUpdateSessionNote, addToast } = useAppContext();

    const [progressNote, setProgressNote] = useState<Partial<SOAPNote & BIRPNote>>(note.progressNote);
    const [processNote, setProcessNote] = useState(note.processNote);
    const [status, setStatus] = useState(note.status);

    const handleSaveChanges = () => {
        const updatedNote: SessionNote = {
            ...note,
            progressNote,
            processNote,
            status,
        };
        addOrUpdateSessionNote(updatedNote);
        addToast('Note updated successfully!', 'success');
        onBack();
    };

    const hasActions = note.assignedTasks?.length || note.messageSent || note.followUpSuggestion;

    return (
        <div className="flex flex-col h-full bg-base-200">
            <header className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-neutral">Edit Session Note</h1>
                    <p className="text-sm text-gray-500">Session Date: {note.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={onBack} className="btn btn-ghost">Back</button>
                    <button onClick={handleSaveChanges} className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </header>

             <main className="flex-grow overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column: Context & Actions */}
                <div className="space-y-4">
                    <div className="card bg-white shadow-md">
                        <div className="card-body">
                            <h2 className="card-title text-lg">Session Context</h2>
                            <p className="text-sm text-gray-600 max-h-96 overflow-y-auto p-2 bg-base-100 rounded-lg whitespace-pre-wrap">{note.transcript || 'No transcript available.'}</p>
                        </div>
                    </div>
                     {hasActions && (
                        <div className="card bg-white shadow-md">
                            <div className="card-body">
                                <h2 className="card-title text-lg">Post-Session Actions Taken</h2>
                                <div className="space-y-3 text-sm">
                                    {note.assignedTasks && note.assignedTasks.length > 0 && (
                                        <div>
                                            <p className="font-semibold">Assigned Tasks:</p>
                                            <ul className="list-disc list-inside">
                                                {note.assignedTasks.map(task => <li key={task.id}>{task.task}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {note.messageSent && (
                                        <div>
                                            <p className="font-semibold">Message Sent:</p>
                                            <p className="p-2 bg-base-100 rounded text-gray-600 italic">"{note.messageSent}"</p>
                                        </div>
                                    )}
                                    {note.followUpSuggestion && (
                                        <div>
                                            <p className="font-semibold">Follow-up Suggestion:</p>
                                            <p>{note.followUpSuggestion}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Notes */}
                <div className="space-y-4">
                     <div className="card bg-white shadow-md">
                        <div className="card-body">
                             <div className="flex items-center justify-between mb-2">
                                <h2 className="card-title text-lg">Progress Notes ({note.progressNoteFormat})</h2>
                                <div className="form-control">
                                    <label className="label cursor-pointer space-x-2">
                                        <span className="label-text">Mark as Final</span> 
                                        <input type="checkbox" className="toggle toggle-success" checked={status === 'finalized'} onChange={(e) => setStatus(e.target.checked ? 'finalized' : 'draft')} />
                                    </label>
                                </div>
                            </div>
                            
                             <div className="mt-4 space-y-4">
                                {Object.entries(progressNote).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="label font-semibold capitalize">{key}</label>
                                        <textarea
                                            value={value as string}
                                            onChange={(e) => setProgressNote({ ...progressNote, [key]: e.target.value })}
                                            className="w-full textarea textarea-bordered bg-base-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="card bg-white shadow-md">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="card-title text-lg">Process Notes (Private)</h2>
                            </div>
                            <textarea
                                value={processNote}
                                onChange={(e) => setProcessNote(e.target.value)}
                                placeholder="Add your clinical thoughts, hypotheses, and reflections here..."
                                className="w-full h-40 textarea textarea-bordered"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NoteEditorScreen;