import React, { useState, useMemo } from 'react';
import { Specialist, Review } from '../../types';
import { ICONS } from '../../constants';
import Card from '../shared/Card';
import { useAppContext } from '../../context/AppContext';

interface SpecialistDetailPageProps {
    specialist: Specialist;
    onBookNow: (specialist: Specialist, type: 'full' | 'intro') => void;
    onBack?: () => void;
    isPrimary?: boolean;
    onFindOthers?: () => void;
    onNavigate?: (screen: string, params?: any) => void;
}

type ProfileTab = 'about' | 'credentials' | 'reviews';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = '' }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(fullStars)].map((_, i) => <div key={`full-${i}`} className="text-amber-400">{ICONS.star}</div>)}
            {[...Array(emptyStars)].map((_, i) => <div key={`empty-${i}`} className="text-gray-300">{ICONS.star}</div>)}
        </div>
    );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="p-4 bg-base-200 rounded-lg">
        <div className="flex justify-between items-center">
            <div>
                <p className="font-semibold text-sm">{review.patientName}</p>
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
            </div>
            <StarRating rating={review.rating} />
        </div>
        <p className="text-sm text-gray-700 mt-2 italic">"{review.comment}"</p>
    </div>
);


const AboutTab: React.FC<{ specialist: Specialist }> = ({ specialist }) => (
    <Card>
        <h3 className="font-bold text-lg text-neutral mb-2">Professional Statement</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{specialist.professionalStatement}</p>
        <div className="divider"></div>
        <h3 className="font-bold text-lg text-neutral mb-2">My Therapeutic Approach</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{specialist.approach}</p>
        {specialist.modes.includes('In-person') && specialist.location && (
            <>
                <div className="divider"></div>
                <h3 className="font-bold text-lg text-neutral mb-2">Location</h3>
                <div className="flex items-start space-x-3">
                    <div className="text-primary mt-1">{ICONS.mapPin}</div>
                    <p className="text-sm text-gray-700">{specialist.location}</p>
                </div>
            </>
        )}
    </Card>
);

const CredentialsTab: React.FC<{ specialist: Specialist }> = ({ specialist }) => (
    <Card>
        <h3 className="font-bold text-lg text-neutral mb-3">Education</h3>
        <ul className="space-y-3 mb-4">
            {specialist.education.map((edu, i) => (
                <li key={i} className="flex items-start space-x-3">
                    <div className="text-primary mt-1">{ICONS.education}</div>
                    <div>
                        <p className="font-semibold text-neutral">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution} {edu.year && `(${edu.year})`}</p>
                    </div>
                </li>
            ))}
        </ul>
        <div className="divider"></div>
        <h3 className="font-bold text-lg text-neutral my-3">Certifications & Licenses</h3>
        <ul className="space-y-3">
             {specialist.certifications.map((cert, i) => (
                <li key={i} className="flex items-center space-x-3">
                    <div className="text-success">{ICONS.certificate}</div>
                    <p className="text-sm text-gray-700">{cert}</p>
                </li>
             ))}
        </ul>
    </Card>
);

const ReviewsTab: React.FC<{ specialist: Specialist }> = ({ specialist }) => (
    <>
        {specialist.reviews.length > 0 ? (
            <div className="space-y-3">
                {specialist.reviews.map(review => <ReviewCard key={review.id} review={review} />)}
            </div>
        ) : (
            <div className="text-center py-10">
                <p className="text-gray-500 text-sm">No reviews yet for {specialist.name}.</p>
            </div>
        )}
    </>
);


const SpecialistDetailPage: React.FC<SpecialistDetailPageProps> = ({ specialist, onBack, onBookNow, isPrimary, onFindOthers, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('about');
    const { user, updateUserProfile, addToast, appointments, lastSessionSummary } = useAppContext();

    const handleShareToggle = () => {
        const isSharing = !user?.isProgressShared;
        updateUserProfile({ isProgressShared: isSharing });
        addToast(isSharing ? `Progress sharing enabled with ${specialist.name}.` : 'Progress sharing disabled.', 'info', false);
    };

    const lastCompletedSession = useMemo(() => {
        if (!specialist) return null;
        return appointments
            .filter(app => app.specialist.name === specialist.name && app.status === 'Completed')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        [0];
    }, [appointments, specialist]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'credentials':
                return <CredentialsTab specialist={specialist} />;
            case 'reviews':
                return <ReviewsTab specialist={specialist} />;
            case 'about':
            default:
                return <AboutTab specialist={specialist} />;
        }
    }

    return (
        <div className="flex flex-col h-full bg-base-100">
            {/* Header */}
            <div className="p-2 bg-white border-b flex items-center space-x-2 sticky top-0 z-10">
                {isPrimary ? (
                    <h2 className="text-lg font-bold text-neutral ml-2">Your Specialist</h2>
                ) : (
                    <>
                        <button onClick={onBack} className="btn btn-ghost btn-sm btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="text-lg font-bold text-neutral">Specialist Profile</h2>
                    </>
                )}
            </div>

            <div className="flex-grow overflow-y-auto pb-24">
                {/* Profile Hero Section */}
                <div className="p-4 bg-white text-center border-b">
                    <div className="avatar mx-auto">
                        <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                           <img src={specialist.avatarUrl} alt={specialist.name} />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-neutral mt-3">{specialist.name}</h1>
                    <p className="text-sm text-gray-500">{specialist.title}</p>
                    <div className="flex items-center justify-center space-x-2 mt-1">
                        <StarRating rating={specialist.avgRating} />
                        <span className="text-xs text-gray-500 font-semibold">{specialist.avgRating.toFixed(1)} ({specialist.reviews.length} reviews)</span>
                    </div>
                     <div className="flex flex-wrap gap-2 justify-center mt-3">
                        {specialist.specialties.map(spec => (
                            <span key={spec} className="badge badge-lg badge-outline badge-secondary">{spec}</span>
                        ))}
                    </div>
                </div>
                
                {/* Key Stats */}
                <div className="p-4">
                     <div className="grid grid-cols-3 gap-3 text-center bg-white p-3 rounded-xl shadow-sm">
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Experience</p>
                            <p className="text-sm font-bold text-neutral">{specialist.experience} years</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Languages</p>
                            <p className="text-sm font-bold text-neutral">{specialist.languages.join(', ')}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Avg. Plan</p>
                            <p className="text-sm font-bold text-neutral">{specialist.avgSessions}</p>
                        </div>
                    </div>
                </div>

                {/* Action section for primary specialist */}
                {isPrimary && (
                    <div className="px-4">
                        <Card>
                            <h3 className="card-title text-base">Your Connection</h3>
                            <div className="space-y-3 mt-2">
                                <div className="form-control">
                                    <label className="label cursor-pointer p-0">
                                        <span className="label-text font-semibold">Share Progress Graph</span>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-secondary"
                                            checked={user?.isProgressShared || false}
                                            onChange={handleShareToggle}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-500">Allows {specialist.name.split(' ')[0]} to view your progress analytics.</p>
                                </div>
                                <div className="flex space-x-2 pt-3 border-t">
                                    <button onClick={() => onNavigate!('direct-chat', { specialist })} className="btn btn-secondary flex-1">
                                        {ICONS.messages} <span className="ml-2">Message</span>
                                    </button>
                                    <button onClick={() => onBookNow(specialist, 'full')} className="btn btn-primary flex-1">
                                        {ICONS.calendar} <span className="ml-2">Book Again</span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Last Session Recap */}
                {isPrimary && lastCompletedSession && (
                    <div className="px-4 mt-4">
                        <Card>
                            <h3 className="card-title text-base">Last Session Recap</h3>
                            <p className="text-xs text-gray-500 mb-3">
                                from {new Date(lastCompletedSession.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            <ul className="space-y-2">
                                {lastSessionSummary.summary.map((point, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                                       <span className="text-primary mt-1">&bull;</span>
                                       <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                )}


                {/* Tab Navigation */}
                <div className="tabs tabs-boxed mx-4 bg-base-100 mt-4">
                    <button onClick={() => setActiveTab('about')} className={`tab tab-lg flex-1 ${activeTab === 'about' ? 'tab-active' : ''}`}>About</button>
                    <button onClick={() => setActiveTab('credentials')} className={`tab tab-lg flex-1 ${activeTab === 'credentials' ? 'tab-active' : ''}`}>Credentials</button>
                    <button onClick={() => setActiveTab('reviews')} className={`tab tab-lg flex-1 ${activeTab === 'reviews' ? 'tab-active' : ''}`}>Reviews</button>
                </div>
                
                {/* Tab Content */}
                <div className="p-4">
                    {renderTabContent()}
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t bg-white sticky bottom-0 z-10">
                {isPrimary ? (
                     <button onClick={onFindOthers} className="btn btn-outline btn-primary w-full">
                        Find Other Specialists
                    </button>
                ) : (
                    <div className="space-y-2">
                        <button 
                            onClick={() => onBookNow(specialist, 'full')} 
                            className="btn btn-primary w-full"
                            disabled={specialist.availability === 'unavailable'}
                        >
                            {specialist.availability === 'available' ? `Book Full Session ($${specialist.sessionFee})` : 'Currently Unavailable'}
                        </button>
                        <button 
                            onClick={() => onBookNow(specialist, 'intro')}
                            className="btn btn-secondary btn-outline w-full"
                             disabled={specialist.availability === 'unavailable'}
                        >
                           Book 15-Min Intro (Free)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecialistDetailPage;