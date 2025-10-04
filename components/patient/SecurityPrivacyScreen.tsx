import React from 'react';
import Card from '../shared/Card';
import { useAppContext } from '../../context/AppContext';

interface SecurityPrivacyScreenProps {
    onNavigate: (screen: string) => void;
}

const SecurityPrivacyScreen: React.FC<SecurityPrivacyScreenProps> = ({ onNavigate }) => {
    const { user, addToast } = useAppContext();

    if (!user) return null;

    const handleRequestDeletion = () => {
        addToast("Your data deletion request has been submitted.", "success");
    };
    
    const SecurityInfoRow: React.FC<{ label: string, status: string, statusColor: string, description: string }> = ({ label, status, statusColor, description }) => (
        <div className="p-3 bg-base-200 rounded-lg">
            <div className="flex justify-between items-center">
                <span className="font-semibold">{label}</span>
                <span className={`font-bold text-sm ${statusColor}`}>{status}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
    );

    return (
        <div className="p-4 space-y-4">
             <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
                <h2 className="font-bold">Your Trust is Our Priority</h2>
                <p className="text-sm mt-1">We are committed to protecting your privacy and giving you control over your data. All sensitive data is encrypted both in transit and at rest.</p>
            </div>

            <Card>
                <h3 className="font-bold text-neutral mb-3">Data Sharing Overview</h3>
                <div className="space-y-3">
                    <SecurityInfoRow 
                        label="Progress Graph"
                        status={user.isProgressShared ? 'Shared' : 'Private'}
                        statusColor={user.isProgressShared ? 'text-success' : 'text-error'}
                        description="Your wellness analytics. Can be shared with your primary specialist to inform your care."
                    />
                    <SecurityInfoRow 
                        label="Journal Entries"
                        status="Private"
                        statusColor="text-success"
                        description="Your journal is for your eyes only and is never shared with anyone, including specialists."
                    />
                    <SecurityInfoRow 
                        label="AI Chat History"
                        status="Private"
                        statusColor="text-success"
                        description="Conversations with the AI are confidential and used only to improve your experience."
                    />
                     <SecurityInfoRow 
                        label="Session Transcripts"
                        status="Shared (with consent)"
                        statusColor="text-warning"
                        description="Transcripts are only generated with your consent and shared securely with your specialist."
                    />
                </div>
            </Card>

             <Card>
                <h3 className="font-bold text-neutral mb-3">Manage Your Data</h3>
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">You have the right to manage your personal information.</p>
                    <button className="btn btn-outline btn-sm w-full">View Session Data History</button>
                    <button onClick={handleRequestDeletion} className="btn btn-outline btn-error btn-sm w-full">Request Data Deletion</button>
                </div>
            </Card>

            <div className="text-center">
                 <button className="btn btn-link">View Full Privacy Policy</button>
            </div>
        </div>
    );
};

export default SecurityPrivacyScreen;