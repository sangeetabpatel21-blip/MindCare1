import React from 'react';
import Card from '../shared/Card';
// FIX: Corrected import path for local module.
import { useAppContext } from '../../context/AppContext';
// FIX: Corrected import path for local module.
import { AppointmentRequest } from '../../types';

const RequestCard: React.FC<{ request: AppointmentRequest }> = ({ request }) => {
    const { acceptRequest, declineRequest } = useAppContext();

    const getRequestDetails = () => {
        switch (request.type) {
            case 'immediate':
                return (
                    <>
                        <p className="font-bold text-error">IMMEDIATE Request</p>
                        <p className="text-sm">Mode: {request.requestedMode}</p>
                        {request.location && <p className="text-sm">Location: {request.location}</p>}
                    </>
                );
            case 'specific_time':
                return (
                    <>
                        <p className="font-bold">Specific Time Request</p>
                        <p className="text-sm">Date: {request.requestedDate}</p>
                        <p className="text-sm">Time: {request.requestedTime}</p>
                    </>
                );
            case 'next_available':
                return (
                    <>
                        <p className="font-bold">Next Available Slot</p>
                        <p className="text-sm">Patient is flexible.</p>
                    </>
                );
             case 'introductory':
                 return (
                    <>
                        <p className="font-bold text-secondary">15-Min Intro Request</p>
                        <p className="text-sm">Patient is requesting a brief introductory call.</p>
                    </>
                );
        }
    };

    return (
        <Card className="mb-4">
            <div className="flex items-start space-x-4">
                <img src={request.patient.avatarUrl} alt={request.patient.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <p className="font-semibold text-neutral">{request.patient.name}</p>
                    <div className="text-gray-600">{getRequestDetails()}</div>
                </div>
            </div>

            {request.status === 'pending' ? (
                <div className="mt-4 flex space-x-2 justify-end">
                    <button onClick={() => declineRequest(request.id)} className="btn btn-ghost btn-sm">Decline</button>
                    <button onClick={() => acceptRequest(request.id)} className="btn btn-primary btn-sm">Accept</button>
                </div>
            ) : (
                <div className="mt-4 text-right">
                    {request.status === 'accepted' && <span className="font-semibold text-sm text-success">Accepted - Awaiting Client Confirmation</span>}
                    {request.status === 'declined' && <span className="font-semibold text-sm text-error">Declined</span>}
                </div>
            )}
        </Card>
    );
};

interface RequestsScreenProps {
    onBack: () => void;
}


const RequestsScreen: React.FC<RequestsScreenProps> = ({ onBack }) => {
    const { appointmentRequests } = useAppContext();
    const pendingRequests = appointmentRequests.filter(r => r.status === 'pending');
    const pastRequests = appointmentRequests.filter(r => r.status !== 'pending');

    return (
        <div className="p-4">
             <button onClick={onBack} className="btn btn-ghost btn-sm mb-4">
                &larr; Back to Dashboard
            </button>
            <h2 className="text-xl font-bold text-neutral mb-4">Pending Appointment Requests</h2>
            {pendingRequests.length > 0 ? (
                pendingRequests.map(req => <RequestCard key={req.id} request={req} />)
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No pending requests.</p>
                </div>
            )}

            {pastRequests.length > 0 && (
                <>
                    <div className="divider mt-8">Handled Requests</div>
                    {pastRequests.map(req => <RequestCard key={req.id} request={req} />)}
                </>
            )}
        </div>
    );
};

export default RequestsScreen;