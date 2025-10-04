


import React, { useState } from 'react';
// FIX: Corrected import path for local module.
import { Appointment } from '../../types';
import Card from '../shared/Card';
// FIX: Corrected import path for local module.
import { useAppContext } from '../../context/AppContext';
// FIX: Corrected import path for local module.
import { ICONS } from '../../constants';

interface ReviewModalProps {
    appointment: Appointment;
    onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ appointment, onClose }) => {
    const { addToast } = useAppContext();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        if (rating === 0) {
            addToast('Please select a rating.', 'error');
            return;
        }
        // In a real app, this would be submitted to a backend.
        console.log({
            specialist: appointment.specialist.name,
            rating,
            comment
        });
        addToast('Thank you for your feedback!', 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neutral">Leave a Review</h2>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">✕</button>
                </div>

                <p className="text-sm text-gray-600 mb-4">How was your session with <span className="font-semibold">{appointment.specialist.name}</span> on {new Date(appointment.date + 'T00:00:00Z').toLocaleDateString()}?</p>

                <div className="space-y-4">
                    <div>
                        <label className="label"><span className="label-text font-semibold">Your Rating</span></label>
                        <div className="flex space-x-1" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    className="text-3xl transition-colors"
                                >
                                    <span className={(hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-300'}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                         <label className="label"><span className="label-text font-semibold">Your Comments (Optional)</span></label>
                         <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full h-24 textarea textarea-bordered"
                         />
                    </div>
                </div>

                <div className="mt-6 flex space-x-2">
                    <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
                    <button onClick={handleSubmit} className="btn btn-primary flex-1">Submit Review</button>
                </div>

            </Card>
        </div>
    );
};

export default ReviewModal;