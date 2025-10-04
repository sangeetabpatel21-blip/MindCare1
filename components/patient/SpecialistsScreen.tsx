import React, { useState, useMemo, useEffect } from 'react';
import { ICONS } from '../../constants';
import { Specialist, SpecialistFilters } from '../../types';
import Card from '../shared/Card';
import BookingRequestModal from './BookingModal';
import SpecialistDetailPage from './SpecialistDetailModal';
import { getSpecialists } from '../../services/apiService';
import { useAppContext } from '../../context/AppContext';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = '' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(fullStars)].map((_, i) => <div key={`full-${i}`} className="text-amber-400">{ICONS.star}</div>)}
            {[...Array(emptyStars)].map((_, i) => <div key={`empty-${i}`} className="text-gray-300">{ICONS.star}</div>)}
        </div>
    );
};

interface SpecialistCardProps {
    specialist: Specialist;
    onViewDetails: () => void;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist, onViewDetails }) => {
    const isAvailable = specialist.availability === 'available';
    return (
        <Card className="mb-4" onClick={onViewDetails}>
            <div className="flex space-x-4 items-center">
                <img src={specialist.avatarUrl} alt={specialist.name} className="w-16 h-16 rounded-full flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                         <h3 className="font-bold text-lg text-neutral truncate">{specialist.name}</h3>
                         <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                           {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{specialist.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <StarRating rating={specialist.avgRating} />
                        <span className="text-xs text-gray-500 truncate">({specialist.reviews.length} reviews)</span>
                    </div>
                </div>

                <div className="text-right flex-shrink-0">
                    <p className="font-bold text-xl text-primary">${specialist.sessionFee}</p>
                    <p className="text-xs text-gray-500 -mt-1">per session</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-base-200">
                {specialist.specialties.map(spec => (
                    <span key={spec} className="badge badge-sm badge-outline">{spec}</span>
                ))}
            </div>
        </Card>
    );
};


interface SpecialistsScreenProps {
    initialFilters?: Partial<SpecialistFilters>;
    onNavigate: (screen: string, params?: any) => void;
}

const SpecialistsScreen: React.FC<SpecialistsScreenProps> = ({ initialFilters, onNavigate }) => {
    const { appointments } = useAppContext();
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState<'rating' | 'price_asc' | 'price_desc' | 'experience'>('rating');
    const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingType, setBookingType] = useState<'full' | 'intro'>('full');
    
    const [view, setView] = useState<'hub' | 'list'>('hub');

    useEffect(() => {
        const fetchSpecialists = async () => {
            setIsLoading(true);
            const data = await getSpecialists();
            setSpecialists(data);
            setIsLoading(false);
        };
        fetchSpecialists();
    }, []);

    const primarySpecialist = useMemo(() => {
        if (appointments.length === 0 || specialists.length === 0) return null;
        const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const lastAppointment = sortedAppointments[0];
        return specialists.find(s => s.name === lastAppointment.specialist.name) || null;
    }, [appointments, specialists]);

    useEffect(() => {
        if (!isLoading && !primarySpecialist) {
            setView('list');
        }
    }, [isLoading, primarySpecialist]);

    const filteredAndSortedSpecialists = useMemo(() => {
        let filtered = specialists.filter(s => s.id !== primarySpecialist?.id); // Always exclude primary from the list
        
        if (searchTerm) {
            filtered = filtered.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return filtered.sort((a, b) => {
            switch (sort) {
                case 'rating': return b.avgRating - a.avgRating;
                case 'price_asc': return a.sessionFee - b.sessionFee;
                case 'price_desc': return b.sessionFee - a.sessionFee;
                case 'experience': return b.experience - a.experience;
                default: return 0;
            }
        });
    }, [searchTerm, sort, specialists, primarySpecialist]);

    const handleBookNow = (specialist: Specialist, type: 'full' | 'intro' = 'full') => {
        setSelectedSpecialist(specialist);
        setBookingType(type);
        setIsBooking(true);
    };
    
    const handleViewDetails = (specialist: Specialist) => {
        setSelectedSpecialist(specialist);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    
    // This view is for showing the detail page of a *non-primary* specialist from the list
    if (selectedSpecialist && !isBooking) {
        return <SpecialistDetailPage specialist={selectedSpecialist} onBack={() => setSelectedSpecialist(null)} onBookNow={handleBookNow} />;
    }

    // Hub View
    if (primarySpecialist && view === 'hub') {
        return (
             <>
                {isBooking && selectedSpecialist && (
                    <BookingRequestModal specialist={selectedSpecialist} onClose={() => { setIsBooking(false); setSelectedSpecialist(null); }} bookingType={bookingType} />
                )}
                <SpecialistDetailPage 
                    specialist={primarySpecialist}
                    isPrimary={true}
                    onFindOthers={() => setView('list')}
                    onBookNow={handleBookNow}
                    onNavigate={onNavigate}
                />
            </>
        );
    }
    
    // List View
    return (
        <div className="flex flex-col h-full">
            {isBooking && selectedSpecialist && (
                <BookingRequestModal specialist={selectedSpecialist} onClose={() => { setIsBooking(false); setSelectedSpecialist(null); }} bookingType={bookingType} />
            )}
            <div className="p-4 flex-shrink-0">
                {primarySpecialist && (
                     <button onClick={() => setView('hub')} className="btn btn-ghost btn-sm mb-4">
                        &larr; Back to Your Specialist
                    </button>
                )}
                <input 
                    type="text"
                    placeholder="Search specialists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="flex-grow overflow-y-auto px-4">
                {filteredAndSortedSpecialists.length > 0 ? (
                    filteredAndSortedSpecialists.map(specialist => (
                        <SpecialistCard key={specialist.id} specialist={specialist} onViewDetails={() => handleViewDetails(specialist)} />
                    ))
                ) : (
                    <div className="text-center py-10"><p className="text-gray-500">No other specialists found.</p></div>
                )}
            </div>
        </div>
    );
};

export default SpecialistsScreen;