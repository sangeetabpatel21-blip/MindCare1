import React from 'react';
import Card from '../../shared/Card';

const forumTopics = [
    { id: 'anxiety', name: 'Anxiety', description: 'Share experiences and coping strategies.', icon: '😟' },
    { id: 'depression', name: 'Depression', description: 'A place for support on tough days.', icon: '😔' },
    { id: 'relationships', name: 'Relationships', description: 'Discuss challenges with partners, family, and friends.', icon: '🤝' },
    { id: 'work-stress', name: 'Work Stress', description: 'Navigate workplace challenges.', icon: '💼' }
];

const PeerForums: React.FC = () => {
    // This is a mock component, so we won't implement post viewing logic.
    // It just demonstrates the available forums.

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral">Peer Support Forums</h3>
            <p className="text-sm text-gray-600">Connect with others who understand. Share your story and find support in a safe, anonymous space. Please be respectful and supportive.</p>
            
            <div className="space-y-3">
                {forumTopics.map(topic => (
                    <Card key={topic.id} className="cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <span className="text-3xl">{topic.icon}</span>
                            <div className="flex-1">
                                <h4 className="font-bold text-neutral">{topic.name}</h4>
                                <p className="text-sm text-gray-500">{topic.description}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </Card>
                ))}
            </div>
             <div className="text-center p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <p className="text-sm">Peer forums are for support and not a substitute for professional medical advice. If you are in crisis, please use the SOS button.</p>
            </div>
        </div>
    );
};

export default PeerForums;