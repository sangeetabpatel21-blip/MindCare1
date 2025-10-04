

import React from 'react';
import ProgressGraph from '../patient/ProgressGraph';
// FIX: Corrected import path for local module.
import { Patient } from '../../types';

interface PatientProgressViewProps {
    patient: Patient;
}

const PatientProgressView: React.FC<PatientProgressViewProps> = ({ patient }) => {
    return (
        <div className="p-4">
            <h3 className="text-lg font-bold text-neutral mb-4">Progress Analytics for {patient.name}</h3>
            {/* The ProgressGraph component uses mock data internally via a hook, so it doesn't need props */}
            <ProgressGraph />
        </div>
    );
};

export default PatientProgressView;