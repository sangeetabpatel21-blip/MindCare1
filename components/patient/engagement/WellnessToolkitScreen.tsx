import React, { useState } from 'react';
import Card from '../../shared/Card';
import BreathingExercise from './BreathingExercise';
import { ICONS } from '../../../constants';

type Tool = 'breathing' | 'meditation' | 'riddle';

// FIX: Define placeholder components with capitalized names as required by React/JSX.
const MeditationPlaceholder: React.FC = () => <div className="text-center p-4">Coming soon!</div>;
const RiddlePlaceholder: React.FC = () => <div className="text-center p-4">Coming soon!</div>;


interface ToolInfo {
    id: Tool;
    title: string;
    description: string;
    icon: React.ReactNode;
    component: React.ComponentType;
    disabled?: boolean;
}

const tools: ToolInfo[] = [
    {
        id: 'breathing',
        title: 'Breathing Exercise',
        description: 'A guided 4-7-8 breathing technique to calm your mind.',
        icon: <span className="text-4xl">🌬️</span>,
        component: BreathingExercise,
    },
    {
        id: 'meditation',
        title: 'Guided Meditation',
        description: 'Listen to a short, guided meditation for focus and relaxation.',
        icon: <span className="text-4xl">🧘</span>,
        component: MeditationPlaceholder,
        disabled: true,
    },
    {
        id: 'riddle',
        title: 'Mindful Riddle',
        description: 'Solve a riddle to gently engage your mind and shift focus.',
        icon: <span className="text-4xl">🤔</span>,
        component: RiddlePlaceholder,
        disabled: true,
    },
];

const ToolCard: React.FC<{ tool: ToolInfo, onSelect: () => void }> = ({ tool, onSelect }) => (
    <Card 
        className={`text-center ${tool.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={tool.disabled ? undefined : onSelect}
    >
        <div className="mb-2">{tool.icon}</div>
        <h3 className="font-bold text-neutral">{tool.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
    </Card>
);

const WellnessToolkitScreen: React.FC = () => {
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

    const ActiveToolComponent = tools.find(t => t.id === selectedTool)?.component;

    if (selectedTool && ActiveToolComponent) {
        return (
            <div>
                <button onClick={() => setSelectedTool(null)} className="btn btn-ghost btn-sm mb-4">
                    &larr; Back to Toolkit
                </button>
                <ActiveToolComponent />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral">Wellness Toolkit</h2>
            <p className="text-gray-600">Explore these exercises to support your well-being.</p>
            {tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} onSelect={() => setSelectedTool(tool.id)} />
            ))}
        </div>
    );
};

export default WellnessToolkitScreen;