"use client";
import React, { useEffect, useState } from "react";
import adminService from "@/src/services/adminService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Gamepad2, Globe, Dices, ChartBar } from "lucide-react";

const SnakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-green-400">
        <path d="M11 17C8.39278 17 6.11902 15.6263 4.85331 13.5521L6.56237 12.5088C7.49242 14.0329 9.13009 15 11 15C13.7614 15 16 12.7614 16 10C16 8.9463 15.6926 7.96431 15.1607 7.13276L16.8473 6.0538C17.5737 7.18952 18 8.54319 18 10C18 13.866 14.866 17 11 17ZM11 3C9.08965 3 7.45176 3.96709 6.52184 5.49132L4.81286 4.44812C6.07858 2.37373 8.35232 1 10.9594 1H11.0406C13.6477 1 15.9214 2.37373 17.1871 4.44812L15.4782 5.49132C14.5482 3.96709 12.9104 3 11 3Z" />
    </svg>
);

const LadderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-yellow-600">
        <path d="M6 2H18V22H6V2ZM8 4V7H16V4H8ZM8 9V12H16V9H8ZM8 14V17H16V14H8ZM8 19V20H16V19H8Z" />
    </svg>
);

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                // Simulate API call for demonstration. In production, use adminService.getAnalytics();
                const res = {
                    overview: { totalUsers: 7, totalGames: 51, activeRegions: 2, avg_moves_win: 33 },
                    movement: { total_snakes: 47, total_ladders: 43, avg_moves_win: 33 },
                    regions: { International: 6, Asia: 1 },
                    loginsByDay: { '1/16': 6, '1/17': 0, '1/18': 0, '1/19': 0, '1/20': 0, '1/21': 1, '1/22': 1 },
                };
                setData(res);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#0b3d34] text-white">Loading...</div>;
    }

    const loginChart = Object.entries(data.loginsByDay).map(([date, value]) => ({
        date,
        logins: value,
    }));

    return (
        <div className="min-h-screen bg-[#0b3d34] p-8 text-white">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-[#124f46] border border-[#2d6a5f] rounded-lg p-6 text-center shadow-lg">
                    <h1 className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-3">
                        <span className="text-3xl">🛡️</span> ADMIN DASHBOARD
                    </h1>
                    <p className="text-slate-300 mt-2">Game Analytics & System Overview</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<Users className="w-8 h-8" />} title="TOTAL USERS" value={data.overview.totalUsers} color="bg-blue-500/20" />
                    <StatCard icon={<Gamepad2 className="w-8 h-8" />} title="GAMES PLAYED" value={data.overview.totalGames} color="bg-purple-500/20" />
                    <StatCard icon={<Globe className="w-8 h-8" />} title="ACTIVE REGIONS" value={data.overview.activeRegions} color="bg-green-500/20" />
                    <StatCard icon={<Dices className="w-8 h-8" />} title="AVG MOVES/WIN" value={data.movement.avg_moves_win} color="bg-red-500/20" />
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Regional Distribution */}
                    <Card title="Regional Distribution" icon={<Globe className="w-6 h-6 text-blue-400" />}>
                        <div className="space-y-4 pt-4">
                            {Object.entries(data.regions).map(([region, count]) => (
                                <div key={region} className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium text-slate-300">
                                        <span>{region}</span>
                                        <span className="text-yellow-400">{count}</span>
                                    </div>
                                    <div className="w-full h-3 bg-[#0e4942] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                            style={{ width: `${(count / data.overview.totalUsers) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Movement Patterns */}
                    <Card title="Movement Patterns" icon={<ChartBar className="w-6 h-6 text-green-400" />}>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <MovementCard icon={"🐍"} label="Snakes Hit" value={data.movement.total_snakes} />
                            <MovementCard icon={"🪜"} label="Ladders Climbed" value={data.movement.total_ladders} />
                        </div>
                    </Card>
                </div>

                {/* Login Trends */}
                <Card title="Login Trends (Last 7 Days)" icon={<ChartBar className="w-6 h-6 text-blue-400" />}>
                    <div className="w-full h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={loginChart}>
                                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#124f46', borderColor: '#2d6a5f', color: '#fff' }}
                                    itemStyle={{ color: '#fbbf24' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="logins" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color }) {
    return (
        <div className="bg-[#124f46] border border-[#2d6a5f] rounded-xl p-5 flex items-center shadow-md">
            <div className={`p-3 rounded-lg ${color} mr-4 text-white`}>
                {icon}
            </div>
            <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</div>
                <div className="text-3xl font-extrabold text-white mt-1">{value}</div>
            </div>
        </div>
    );
}

function Card({ title, icon, children }) {
    return (
        <div className="bg-[#124f46] border border-[#2d6a5f] rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                {icon} <span>{title}</span>
            </h2>
            {children}
        </div>
    );
}

function MovementCard({ icon, label, value }) {
    return (
        <div className="bg-[#0e4942] border border-[#2d6a5f] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="mb-3 w-10 h-10 text-4xl">{icon}</div>
            <div className="text-sm font-bold text-slate-300 uppercase">{label}</div>
            <div className="text-4xl font-extrabold text-white mt-2">{value}</div>
        </div>
    );
}