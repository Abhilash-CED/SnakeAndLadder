"use client";
import React, { useEffect, useState } from "react";
import adminService from "@/src/services/adminService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Gamepad2, Globe, Dices, ChartBar } from "lucide-react";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await adminService.getAnalytics();
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

                <div className="bg-[#124f46] border border-[#2d6a5f] rounded-lg p-6 text-center shadow-lg">
                    <h1 className="text-4xl font-bold text-yellow-400 flex items-center justify-center gap-3">
                        <span className="text-3xl">🛡️</span> ADMIN DASHBOARD
                    </h1>
                    <p className="text-slate-300 mt-2">Game Analytics & System Overview</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<Users className="w-8 h-8" />} title="TOTAL USERS" value={data.overview.totalUsers} color="bg-blue-500/20" />
                    <StatCard icon={<Gamepad2 className="w-8 h-8" />} title="GAMES PLAYED" value={data.overview.totalGames} color="bg-purple-500/20" />
                    <StatCard icon={<Globe className="w-8 h-8" />} title="ACTIVE REGIONS" value={data.overview.activeRegions} color="bg-green-500/20" />
                    <StatCard icon={<Dices className="w-8 h-8" />} title="AVG MOVES/WIN" value={data.movement.avg_moves_win} color="bg-red-500/20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                    <Card title="Movement Patterns" icon={<ChartBar className="w-6 h-6 text-green-400" />}>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <MovementCard icon={"🐍"} label="Snakes Hit" value={data.movement.total_snakes} />
                            <MovementCard icon={"🪜"} label="Ladders Climbed" value={data.movement.total_ladders} />
                        </div>
                    </Card>
                </div>

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