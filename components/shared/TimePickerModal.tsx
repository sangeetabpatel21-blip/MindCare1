import React, { useState } from 'react';

interface TimePickerModalProps {
    onClose: () => void;
    onSet: (time: string) => void;
    initialTime?: string;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ onClose, onSet, initialTime = '09:00' }) => {
    const [selectedTime, setSelectedTime] = useState(initialTime);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-xs">
                <h3 className="font-bold text-center mb-4">Set Reminder Time</h3>
                <div className="flex justify-center">
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="input input-bordered w-full"
                    />
                </div>
                <div className="mt-4 flex space-x-2">
                    <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
                    <button onClick={() => onSet(selectedTime)} className="btn btn-primary flex-1">Set</button>
                </div>
            </div>
        </div>
    );
};

export default TimePickerModal;