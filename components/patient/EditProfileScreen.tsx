import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Patient } from '../../types';
import { ICONS } from '../../constants';

interface EditProfileScreenProps {
    onNavigate: (screen: string) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onNavigate }) => {
    const { user, updateUserProfile } = useAppContext();
    const [formData, setFormData] = useState<Partial<Patient>>(user || {});

    if (!user) {
        return null; // Or a loading/error state
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateUserProfile(formData);
        onNavigate('profile');
    };

    return (
        <div className="flex flex-col h-full bg-base-100">
            <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                <div className="card bg-white shadow">
                    <div className="card-body">
                        <h3 className="card-title">Anonymity & Privacy</h3>
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">
                                    Enable Anonymity Mode
                                    <p className="text-xs text-gray-500">Replaces your photo with a generic avatar.</p>
                                </span> 
                                <input 
                                    type="checkbox" 
                                    className="toggle toggle-primary" 
                                    checked={formData.isAnonymous || false}
                                    onChange={(e) => setFormData(prev => ({...prev, isAnonymous: e.target.checked}))}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card bg-white shadow">
                    <div className="card-body">
                        <h3 className="card-title">Personal Information</h3>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name</span></label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Age</span></label>
                                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="input input-bordered w-full" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Gender</span></label>
                                <select name="gender" value={formData.gender || ''} onChange={handleChange} className="select select-bordered w-full">
                                    <option value="">Select...</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Non-binary</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Location</span></label>
                            <input type="text" name="location" placeholder="e.g., City, Country" value={formData.location || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">About Me</span></label>
                            <textarea name="about" value={formData.about || ''} onChange={handleChange} className="textarea textarea-bordered h-24" placeholder="Share a little about yourself..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="card bg-white shadow">
                    <div className="card-body">
                        <h3 className="card-title">Background (Optional)</h3>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Education</span></label>
                            <input type="text" name="education" value={formData.education || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Profession</span></label>
                            <input type="text" name="profession" value={formData.profession || ''} onChange={handleChange} className="input input-bordered w-full" />
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Hobbies</span></label>
                            <textarea name="hobbies" value={formData.hobbies || ''} onChange={handleChange} className="textarea textarea-bordered h-24" placeholder="What do you enjoy doing?"></textarea>
                        </div>
                    </div>
                </div>
                
                 <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
                    Sharing more details can help us and your specialist provide a more personalized and effective experience for you. All information is optional and confidential.
                </div>
            </div>

            <div className="p-4 bg-white border-t sticky bottom-0 z-10 flex space-x-2">
                <button onClick={() => onNavigate('profile')} className="btn btn-ghost flex-1">
                    Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary flex-1">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditProfileScreen;