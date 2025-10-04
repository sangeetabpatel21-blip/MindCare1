import React, { useState } from 'react';
import { Appointment, SessionNote, SOAPNote, BIRPNote, HomeworkTask } from '../../types';
import { generateSessionNotes, generateProcessNotes } from '../../services/geminiService';
import { useAppContext } from '../../context/AppContext';

interface PostSessionWorkspaceProps {
    appointment: Appointment;
    transcript: string;
    onFinish: () => void;
}

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <ul className="steps w-full mb-6">
        <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>Review & Generate</li>
        <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>Refine Notes</li>
        <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>Set Actions</li>
    </ul>
);

const PostSessionWorkspace: React.FC<PostSessionWorkspaceProps> = ({ appointment, transcript, onFinish }) => {
    const { addOrUpdateSessionNote, addToast } = useAppContext();
    const [step, setStep] = useState(1);
    
    // Note State
    const [progressNoteFormat, setProgressNoteFormat] = useState<'SOAP' | 'BIRP'>('SOAP');
    const [progressNote, setProgressNote] = useState<Partial<SOAPNote & BIRPNote>>({});
    const [processNote, setProcessNote] = useState('');

    // Loading State
    const [isProgressLoading, setIsProgressLoading] = useState(false);
    const [isProcessLoading, setIsProcessLoading] = useState(false);
    
    // Actions State
    const [assignedTasks, setAssignedTasks] = useState<HomeworkTask[]>([]);
    const [newTaskInput, setNewTaskInput] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [followUpSuggestion, setFollowUpSuggestion] = useState('');

    // Handwritten Notes State
    const [uploadedNote, setUploadedNote] = useState<string | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const handleGenerateProgress = async () => {
        setIsProgressLoading(true);
        const result = await generateSessionNotes(transcript, progressNoteFormat);
        setProgressNote(result || {});
        addToast(result ? 'Progress notes drafted.' : 'Failed to draft progress notes.', result ? 'success' : 'error', false);
        setIsProgressLoading(false);
    };

    const handleGenerateProcess = async () => {
        setIsProcessLoading(true);
        const result = await generateProcessNotes(transcript);
        setProcessNote(result || '');
        addToast(result ? 'Process notes drafted.' : 'Failed to draft process notes.', result ? 'success' : 'error', false);
        setIsProcessLoading(false);
    };

    const handleSaveAndFinish = () => {
        const newNote: SessionNote = {
            id: `note-${appointment.id}`,
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            date: new Date().toISOString().split('T')[0],
            status: 'draft',
            transcript,
            audioUrl: appointment.audioUrl,
            progressNoteFormat,
            progressNote,
            processNote,
            assignedTasks,
            messageSent: messageInput,
            followUpSuggestion,
        };
        addOrUpdateSessionNote(newNote);
        addToast('Note draft saved!', 'success');
        onFinish();
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: return <ReviewStep />;
            case 2: return <NotesStep />;
            case 3: return <ActionsStep />;
            default: return null;
        }
    };
    
    const ReviewStep = () => (
        <div className="space-y-4 animate-fade-in">
            <div className="card bg-white shadow-md">
                <div className="card-body">
                    <h2 className="card-title text-lg">Step 1: Review Session & Generate Drafts</h2>
                    <p className="text-sm text-gray-600 mb-2">Review the full session transcript and audio, then use the AI to generate initial drafts for your notes.</p>
                    
                    {appointment.audioUrl && (
                        <div className="mb-2">
                            <h3 className="font-semibold text-sm mb-1">Session Audio</h3>
                            <audio controls src={appointment.audioUrl} className="w-full h-10" />
                        </div>
                    )}

                    <div className="p-3 bg-base-200 rounded-lg max-h-64 overflow-y-auto">
                        <h3 className="font-semibold text-sm mb-2">Session Transcript</h3>
                        <p className="text-xs whitespace-pre-wrap text-gray-700">{transcript || 'No transcript available.'}</p>
                    </div>
                     <div className="grid grid-cols-2 gap-4 mt-4">
                        <button onClick={handleGenerateProgress} className="btn btn-secondary" disabled={isProgressLoading || !transcript}>
                            {isProgressLoading ? <span className="loading loading-spinner"></span> : 'Draft Progress Note'}
                        </button>
                        <button onClick={handleGenerateProcess} className="btn btn-secondary" disabled={isProcessLoading || !transcript}>
                             {isProcessLoading ? <span className="loading loading-spinner"></span> : 'Draft Process Note'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const NotesStep = () => {
        const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files?.[0]) setUploadedNote(URL.createObjectURL(event.target.files[0]));
        };

        const handleTranscribe = () => {
            setIsTranscribing(true);
            setTimeout(() => {
                const mockTranscription = "Patient expressed feelings of being overwhelmed at work (Subjective). Patient appeared tired but was engaged (Objective).";
                setProgressNote(prev => ({ ...prev, subjective: (prev.subjective || '') + mockTranscription }));
                addToast('Handwritten notes transcribed.', 'success', false);
                setIsTranscribing(false);
            }, 1500);
        };
        
        return (
            <div className="space-y-4 animate-fade-in">
                <div className="card bg-white shadow-md">
                    <div className="card-body">
                        <h2 className="card-title text-lg">Step 2: Refine Your Notes</h2>
                        <div className="tabs tabs-boxed">
                            <button className={`tab ${progressNoteFormat === 'SOAP' ? 'tab-active' : ''}`} onClick={() => setProgressNoteFormat('SOAP')}>SOAP</button>
                            <button className={`tab ${progressNoteFormat === 'BIRP' ? 'tab-active' : ''}`} onClick={() => setProgressNoteFormat('BIRP')}>BIRP</button>
                        </div>
                        {Object.entries(progressNote).map(([key, value]) => (
                            <div key={key}>
                                <label className="label font-semibold capitalize">{key}</label>
                                <textarea value={value} onChange={e => setProgressNote({ ...progressNote, [key]: e.target.value })} className="w-full textarea textarea-bordered bg-base-100" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card bg-white shadow-md">
                    <div className="card-body">
                         <h3 className="card-title text-md">Process Notes (Private)</h3>
                         <textarea value={processNote} onChange={e => setProcessNote(e.target.value)} placeholder="Add your clinical thoughts..." className="w-full h-32 textarea textarea-bordered" />
                    </div>
                </div>
                 <div className="card bg-white shadow-md">
                    <div className="card-body">
                         <h3 className="card-title text-md">Transcribe Handwritten Notes</h3>
                         <input type="file" accept="image/*" onChange={handleFileUpload} className="file-input file-input-bordered file-input-sm w-full" />
                         {uploadedNote && (
                            <div className="mt-2">
                                <img src={uploadedNote} alt="Note" className="rounded-lg border max-h-40 w-full object-contain" />
                                <button onClick={handleTranscribe} className="btn btn-secondary w-full mt-2" disabled={isTranscribing}>
                                    {isTranscribing ? <span className="loading loading-spinner"></span> : `Transcribe & Add`}
                                </button>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        );
    };

    const ActionsStep = () => {
        const handleAddTask = () => {
            if (!newTaskInput.trim()) return;
            setAssignedTasks(prev => [...prev, { id: `task-${Date.now()}`, task: newTaskInput.trim(), completed: false, source: 'specialist' }]);
            setNewTaskInput('');
        };
        
        return (
            <div className="card bg-white shadow-md animate-fade-in">
                <div className="card-body">
                    <h2 className="card-title text-lg">Step 3: Assign Follow-up Actions</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="label font-semibold">Assign Wellness Task</label>
                            <div className="flex space-x-2">
                                <input type="text" value={newTaskInput} onChange={e => setNewTaskInput(e.target.value)} placeholder="e.g., Journal for 10 mins" className="input input-bordered w-full" />
                                <button onClick={handleAddTask} className="btn btn-primary">Add</button>
                            </div>
                            <div className="mt-2 space-y-1">
                                {assignedTasks.map(task => <p key={task.id} className="text-xs p-1 bg-blue-50 rounded">✓ {task.task}</p>)}
                            </div>
                        </div>
                         <div>
                            <label className="label font-semibold">Send Follow-up Message</label>
                            <textarea value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder={`Hi ${appointment.patientName.split(' ')[0]}, great session...`} className="w-full textarea textarea-bordered h-20" />
                        </div>
                        <div>
                            <label className="label font-semibold">Suggest Next Session</label>
                            <select value={followUpSuggestion} onChange={e => setFollowUpSuggestion(e.target.value)} className="select select-bordered w-full">
                                <option value="">No Suggestion</option>
                                <option value="in 1 week">In 1 week</option>
                                <option value="in 2 weeks">In 2 weeks</option>
                                <option value="in 1 month">In 1 month</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-base-200">
            <header className="p-4 bg-white border-b sticky top-0 z-10 text-center">
                <h1 className="text-xl font-bold text-neutral">Post-Session Workspace</h1>
                <p className="text-sm text-gray-500">For {appointment.patientName} on {appointment.date}</p>
            </header>

            <main className="flex-grow overflow-y-auto p-4">
                <Stepper currentStep={step} />
                {renderStepContent()}
            </main>
            
             <footer className="p-4 bg-white border-t sticky bottom-0 z-10 flex justify-between items-center">
                <button onClick={() => setStep(s => Math.max(1, s - 1))} className="btn btn-ghost" disabled={step === 1}>
                    Back
                </button>
                {step < 3 ? (
                    <button onClick={() => setStep(s => Math.min(3, s + 1))} className="btn btn-primary">
                        Next
                    </button>
                ) : (
                    <button onClick={handleSaveAndFinish} className="btn btn-success">
                        Save Draft & Finish
                    </button>
                )}
            </footer>
        </div>
    );
};

export default PostSessionWorkspace;