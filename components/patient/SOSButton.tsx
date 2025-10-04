// FIX: This file was missing its content. The component has been implemented to display an SOS button and a corresponding modal with emergency resources, resolving the "not a module" error in PatientApp.tsx.

import React from 'react';

interface SOSButtonProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

const SOSModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral mt-4">Immediate Help</h2>
            <p className="text-gray-700 my-3">
                If you are in a crisis or any other person may be in danger, please don't use this app. These resources can provide you with immediate help.
            </p>
            <div className="text-left space-y-3 my-4">
                <a href="tel:14416" className="block w-full text-center p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                    Call Tele MANAS (14416)
                </a>
                <a href="tel:988" className="block w-full text-center p-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">
                    Call 988 Crisis &amp; Suicide Lifeline
                </a>
                <a href="sms:741741" className="block w-full text-center p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                    Text HOME to 741741
                </a>
            </div>
             <p className="text-xs text-gray-500 mt-4 italic">
                Note: We are planning to integrate with Tele MANAS in the future for better and more direct service.
            </p>
            <button onClick={onClose} className="w-full bg-base-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-base-300 transition-colors mt-4">
                I Understand
            </button>
        </div>
    </div>
);

/**
 * A critical safety component that provides a button to open an SOS modal.
 * The modal contains links to immediate help resources.
 * State for modal visibility is managed by the parent component.
 */
export const SOSButton: React.FC<SOSButtonProps> = ({ isModalOpen, setIsModalOpen }) => {
    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-error btn-sm btn-circle animate-pulse">
                <span className="font-bold">SOS</span>
            </button>
            {isModalOpen && <SOSModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};