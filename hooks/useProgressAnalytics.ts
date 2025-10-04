import { useState, useEffect } from 'react';

// This is a mock hook to simulate fetching and processing patient progress data.
export const useProgressAnalytics = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<string[]>([]);

    useEffect(() => {
        const generateMockData = () => {
            const data = [];
            let lastMood = 5;
            let adherence = 8;
            for (let i = 1; i <= 14; i++) {
                // Simulate mood fluctuations
                lastMood += Math.random() * 2 - 1;
                lastMood = Math.max(2, Math.min(9, lastMood));

                // Simulate task completion
                const tasksCompleted = Math.floor(Math.random() * 3);

                // Simulate adherence score
                adherence += Math.random() * 1.5 - 0.75;
                adherence = Math.max(3, Math.min(10, adherence));

                data.push({
                    day: i,
                    mood: parseFloat(lastMood.toFixed(1)),
                    tasksCompleted: tasksCompleted,
                    adherenceScore: parseFloat(adherence.toFixed(1)),
                    appointmentStatus: i === 7 ? 'missed' : null,
                });
            }
            return data;
        };
        
        const generateAlerts = (data: any[]) => {
            const newAlerts = [];
            const avgMood = data.reduce((acc, d) => acc + d.mood, 0) / data.length;
            if (avgMood < 4) {
                newAlerts.push("Patient's average mood has been consistently low over the past 14 days.");
            }
            if (data.some(d => d.appointmentStatus === 'missed')) {
                newAlerts.push("A recent appointment was missed, which may impact adherence.");
            }
            return newAlerts;
        }

        // Simulate API call
        setTimeout(() => {
            const data = generateMockData();
            const generatedAlerts = generateAlerts(data);
            setAnalyticsData(data);
            setAlerts(generatedAlerts);
            setIsLoading(false);
        }, 1000);

    }, []);

    return { analyticsData, alerts, isLoading };
};
