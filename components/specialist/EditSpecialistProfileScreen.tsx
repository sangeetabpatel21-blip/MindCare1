import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Specialist } from '../../types';

interface EditSpecialistProfileScreenProps {
    onBack: () => void;
}

const EditSpecialistProfileScreen: React.FC<EditSpecialistProfileScreenProps> = ({ onBack }) => {
    const { specialist, updateSpecialistProfile } = useAppContext();
    const [formData, setFormData] = useState<Partial<Specialist>>(specialist || {});

    if (!specialist) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateSpecialistProfile(formData);
        onBack();
    };

    return (
        <div className="flex flex-col h-full bg-base-100">
             <header className="p-4 bg-white border-b sticky top-0 z-10 text-center">
                <h1 className="text-xl font-bold text-neutral">Edit My Profile</h1>
            </header>

            <div className="p-4 space-y-4 flex-grow overflow-y-auto">

                <div className="card bg-white shadow">
                    <div className="card-body">
                        <h3 className="card-title">Professional Overview</h3>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Full Name</span></label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Title</span></label>
                            <input type="text" name="title" placeholder="e.g., Clinical Psychologist, PhD" value={formData.title || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Practice Location (for In-Person sessions)</span></label>
                            <input type="text" name="location" placeholder="e.g., 123 Wellness Ave, Suite 101, City" value={formData.location || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Short Bio (for cards)</span></label>
                            <textarea name="about" value={formData.about || ''} onChange={handleChange} className="textarea textarea-bordered h-24" placeholder="A brief one-paragraph introduction."></textarea>
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Professional Statement</span></label>
                            <textarea name="professionalStatement" value={formData.professionalStatement || ''} onChange={handleChange} className="textarea textarea-bordered h-32" placeholder="A more detailed statement about your practice and philosophy."></textarea>
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Therapeutic Approach</span></label>
                            <textarea name="approach" value={formData.approach || ''} onChange={handleChange} className="textarea textarea-bordered h-32" placeholder="Describe your primary therapeutic methods and approach."></textarea>
                        </div>
                    </div>
                </div>
                 <div className="card bg-white shadow">
                    <div className="card-body">
                        <h3 className="card-title">Credentials</h3>
                        {/* Education would require more complex state management for adding/removing entries. For this mock, we'll make it a simple textarea. */}
                         <div className="form-control">
                            <label className="label"><span className="label-text">Education</span></label>
                            <textarea name="education" value={formData.education?.map(e => `${e.degree}, ${e.institution}`).join('\n') || ''} className="textarea textarea-bordered h-24" placeholder="Enter one degree per line, e.g., PhD in Psychology, University of Delhi" />
                            <label className="label-text-alt mt-1">This is a simplified view. A full implementation would allow adding/removing degrees.</label>
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Certifications & Licenses</span></label>
                            <textarea name="certifications" value={formData.certifications?.join('\n') || ''} onChange={handleChange} className="textarea textarea-bordered h-24" placeholder="Enter one certification per line."></textarea>
                        </div>
                    </div>
                </div>

            </div>

            <div className="p-4 bg-white border-t sticky bottom-0 z-10 flex space-x-2">
                <button onClick={onBack} className="btn btn-ghost flex-1">
                    Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary flex-1">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditSpecialistProfileScreen;