import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import { useProgressAnalytics } from '../../hooks/useProgressAnalytics';
import Card from '../shared/Card';
import { ICONS } from '../../constants';
import { useAppContext } from '../../context/AppContext';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-base-300">
                <p className="font-bold text-sm">{`Day: ${label}`}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }} className="text-xs">
                        {`${pld.name}: ${pld.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const ProgressGraph: React.FC = () => {
    const { analyticsData, alerts, isLoading } = useProgressAnalytics();
    const { user, updateUserProfile, addToast } = useAppContext();

    if (isLoading) {
        return <Card><p>Loading progress...</p></Card>;
    }
    
    const handleShareToggle = () => {
        const isSharing = !user?.isProgressShared;
        updateUserProfile({ isProgressShared: isSharing });
        addToast(isSharing ? 'Progress sharing enabled.' : 'Progress sharing disabled.', 'info', false);
    }

    const missedAppointments = analyticsData.filter(d => d.appointmentStatus === 'missed');

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-neutral">Your Progress</h3>
                    <p className="text-sm text-gray-500 mb-4">A 14-day overview of your wellness journey.</p>
                </div>
                 <div className="flex items-center space-x-2">
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={() => alert('Progress report exported!')}>
                        {ICONS.share}
                    </button>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-primary toggle-sm" 
                        checked={user?.isProgressShared || false} 
                        onChange={handleShareToggle} 
                    />
                 </div>
            </div>
             <p className={`text-xs text-right -mt-4 mb-4 ${user?.isProgressShared ? 'text-primary' : 'text-gray-400'}`}>
                {user?.isProgressShared ? 'Sharing with your specialist' : 'Share with your specialist'}
            </p>

            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <LineChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" fontSize={10} />
                        <YAxis domain={[0, 10]} fontSize={10} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Line type="monotone" dataKey="mood" stroke="hsl(var(--p))" strokeWidth={2} name="Mood" connectNulls />
                        <Line type="monotone" dataKey="tasksCompleted" stroke="hsl(var(--s))" strokeWidth={2} name="Tasks Done" />
                        <Line type="monotone" dataKey="adherenceScore" stroke="#A0AEC0" strokeWidth={2} name="Adherence Score" />
                        
                        {/* Visual flag for missed appointments */}
                        {missedAppointments.map(d => (
                             <ReferenceDot 
                                key={`missed-${d.day}`} 
                                x={d.day} 
                                y={1} // Position at the bottom
                                r={5} 
                                fill="hsl(var(--er))" 
                                stroke="white" 
                                strokeWidth={2} 
                                isFront={true} 
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
             {alerts.length > 0 && (
                <div className="mt-4 space-y-2">
                    {alerts.map((alert, index) => (
                        <div key={index} className="flex items-start space-x-2 text-amber-800 bg-amber-100 p-2 rounded-lg">
                           {ICONS.alert}
                            <p className="text-xs font-medium">{alert}</p>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default ProgressGraph;