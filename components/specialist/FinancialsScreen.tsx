import React, { useState } from 'react';
import Card from '../shared/Card';
import { ICONS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext';

interface FinancialsScreenProps {
    onBack?: () => void; // Made optional
}

const PayoutSettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addToast } = useAppContext();
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        addToast("Payout information updated!", "success");
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleUpdate}>
                    <h3 className="font-bold text-lg mb-4">Manage Payouts</h3>
                    <div className="space-y-4">
                         <div className="form-control">
                            <label className="label"><span className="label-text">Account Holder Name</span></label>
                            <input type="text" defaultValue="Dr. Anjali Sharma" className="input input-bordered w-full" required />
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Bank Account Number</span></label>
                            <input type="text" defaultValue="************1234" className="input input-bordered w-full" required />
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">IFSC Code</span></label>
                            <input type="text" defaultValue="HDFC0000521" className="input input-bordered w-full" required />
                        </div>
                    </div>
                    <div className="mt-6 flex space-x-2">
                        <button type="button" onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
                        <button type="submit" className="btn btn-primary flex-1">Update Details</button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

const revenueData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 2800 },
    { month: 'Mar', revenue: 3500 },
    { month: 'Apr', revenue: 3200 },
    { month: 'May', revenue: 4100 },
    { month: 'Jun', revenue: 4500 },
];

const transactionData = [
    { id: 't1', patient: 'Rohan P.', date: '2024-07-15', amount: 150 },
    { id: 't2', patient: 'Priya K.', date: '2024-07-14', amount: 120 },
    { id: 't3', patient: 'Aarav M.', date: '2024-07-12', amount: 150 },
];

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-base-200 p-4 rounded-lg text-center">
        <div className="text-primary mx-auto w-8 h-8 mb-2">{icon}</div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-neutral truncate">{value}</p>
    </div>
);

const FinancialsScreen: React.FC<FinancialsScreenProps> = ({ onBack }) => {
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    return (
        <div className="flex flex-col h-full bg-base-100">
            {isPayoutModalOpen && <PayoutSettingsModal onClose={() => setIsPayoutModalOpen(false)} />}
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <StatCard icon={ICONS.tag} label="Total Revenue" value="$16,500" />
                    <StatCard icon={ICONS.briefcase} label="Total Sessions" value="247" />
                    <StatCard icon={ICONS.users} label="Patients Helped" value="14" />
                </div>

                <Card>
                    <h3 className="font-bold text-neutral mb-4">Revenue Analytics (Last 6 Months)</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" fontSize={12} />
                                <YAxis fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip cursor={{fill: 'rgba(113, 128, 150, 0.1)'}}/>
                                <Bar dataKey="revenue" fill="hsl(var(--p))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="font-bold text-neutral mb-3">Payout Settings</h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-base-200 rounded-lg">
                            <p className="text-sm font-semibold">Bank Details</p>
                            <p className="text-xs text-gray-600">Main Payout Account</p>
                            <p className="font-mono text-neutral mt-1">**** **** **** 1234</p>
                        </div>
                        <div>
                             <label className="label-text font-semibold">Payout Schedule</label>
                             <select className="select select-bordered select-sm w-full mt-1">
                                <option>Weekly (Every Friday)</option>
                                <option>Bi-Weekly</option>
                                <option>Monthly (1st of Month)</option>
                            </select>
                        </div>
                        <button onClick={() => setIsPayoutModalOpen(true)} className="btn btn-secondary btn-sm w-full">Manage Payouts</button>
                    </div>
                </Card>

                <Card>
                     <h3 className="font-bold text-neutral mb-3">Recent Transactions</h3>
                     <div className="space-y-2">
                        {transactionData.map(tx => (
                            <div key={tx.id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                                <div>
                                    <p className="text-sm font-semibold">{tx.patient}</p>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                                <p className="font-semibold text-success">+${tx.amount.toFixed(2)}</p>
                            </div>
                        ))}
                     </div>
                </Card>

                <Card>
                    <h3 className="font-bold text-neutral mb-3">My Reviews</h3>
                    <div className="flex items-center justify-between">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-amber-500">4.9</p>
                            <p className="text-xs text-gray-500">Average Rating</p>
                        </div>
                        <button className="btn btn-outline btn-primary">View All Reviews</button>
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default FinancialsScreen;