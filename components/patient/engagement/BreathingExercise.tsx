import React, { useState, useEffect } from 'react';
import Card from '../../shared/Card';

const BreathingExercise: React.FC = () => {
    const [phase, setPhase] = useState<'start' | 'inhale' | 'hold' | 'exhale'>('start');
    const [countdown, setCountdown] = useState(0);

    const cycle = [
        { name: 'inhale', duration: 4 },
        { name: 'hold', duration: 7 },
        { name: 'exhale', duration: 8 },
    ] as const;

    useEffect(() => {
        if (phase === 'start') return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev > 1) {
                    return prev - 1;
                }
                
                // Transition to next phase
                const currentPhaseIndex = cycle.findIndex(p => p.name === phase);
                const nextPhase = cycle[(currentPhaseIndex + 1) % cycle.length];
                setPhase(nextPhase.name);
                return nextPhase.duration;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [phase, cycle]);

    const startExercise = () => {
        setPhase('inhale');
        setCountdown(4);
    };
    
    const stopExercise = () => {
        setPhase('start');
        setCountdown(0);
    }

    const getInstruction = () => {
        switch (phase) {
            case 'inhale': return 'Breathe in through your nose...';
            case 'hold': return 'Hold your breath...';
            case 'exhale': return 'Exhale completely through your mouth...';
            default: return '4-7-8 Breathing';
        }
    };
    
    const circleSize = phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100';

    return (
        <Card className="text-center">
            <h3 className="text-xl font-bold text-neutral mb-4">Mindful Breathing</h3>
            <div className="flex items-center justify-center h-64">
                <div className="relative w-48 h-48">
                    <div className={`absolute inset-0 bg-primary rounded-full transition-transform ease-in-out ${circleSize}`} style={{ transitionDuration: phase === 'inhale' ? '4s' : phase === 'exhale' ? '8s' : '1s' }}></div>
                    <div className="relative flex flex-col items-center justify-center h-full text-white">
                        <p className="text-lg font-semibold">{getInstruction()}</p>
                        {phase !== 'start' && <p className="text-5xl font-bold">{countdown}</p>}
                    </div>
                </div>
            </div>
            {phase === 'start' ? (
                <button onClick={startExercise} className="btn btn-primary mt-4">Begin Exercise</button>
            ) : (
                <button onClick={stopExercise} className="btn btn-ghost mt-4">End Session</button>
            )}
            <p className="text-xs text-gray-500 mt-4">This 4-7-8 technique can help reduce anxiety and promote calmness.</p>
        </Card>
    );
};

export default BreathingExercise;
