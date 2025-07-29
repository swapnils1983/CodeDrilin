import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axiosInstance from '../../utils/axiosInstance';

function AdminDashboard() {
    const [contests, setContests] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchContest = async () => {
            const res = await axiosInstance.get('/contest')
            console.log(res)
            setContests(res.data)
        }
        fetchContest()
    }, [])

    const handleCreateProblem = () => {
        navigate('/admin/create-problem')
    };

    const handleDeleteProblem = (id) => {
        navigate('/admin/delete-problem')

    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                    </h1>
                    <div className="badge badge-warning gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                        </svg>
                        Admin Mode
                    </div>
                </div>

                {/* Problem Management Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                        Problem Management
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Create Problem Card */}
                        <div className="card bg-gray-800 border border-gray-700 hover:border-green-500 transition-colors">
                            <div className="card-body">
                                <h3 className="card-title text-green-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Problem
                                </h3>
                                <p className="text-gray-400">Add a new coding problem to the platform</p>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={handleCreateProblem}
                                        className="btn btn-success btn-sm text-white"
                                    >
                                        Create New
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gray-800 border border-gray-700 hover:border-red-500 transition-colors">
                            <div className="card-body">
                                <h3 className="card-title text-red-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Problem
                                </h3>
                                <p className="text-gray-400">Remove problems from the platform</p>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={() => handleDeleteProblem()}
                                        className="btn btn-error btn-sm text-white"
                                    >
                                        Delete Problem
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Create Contest Card */}
                        <div className="card bg-gray-800 border border-gray-700 hover:border-purple-500 transition-colors">
                            <div className="card-body">
                                <h3 className="card-title text-purple-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Create Contest
                                </h3>
                                <p className="text-gray-400">Organize a new coding competition</p>
                                <div className="card-actions justify-end mt-4">
                                    <Link to="/admin/create-contest" className="btn btn-success btn-sm text-white">
                                        New Contest
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Contests Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                        Recent Contests
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="table w-full bg-gray-800 border border-gray-700">
                            <thead className="bg-gray-700 text-gray-300">
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Problems</th>
                                    <th>Participants</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contests.map((contest) => {
                                    const now = new Date();
                                    const start = new Date(contest.startTime);
                                    const end = new Date(contest.endTime);
                                    const isUpcoming = start > now;

                                    return (
                                        <tr key={contest._id} className="hover:bg-gray-750">
                                            <td className="font-medium text-white">{contest.title}</td>
                                            <td>
                                                <div className="text-sm">{start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                <div className="text-xs text-gray-500">to {end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </td>
                                            <td>{contest.problems.length}</td>
                                            <td>{contest.participants.length}</td>
                                            <td>
                                                <span className={`badge ${isUpcoming ? 'badge-info' : 'badge-ghost'}`}>
                                                    {isUpcoming ? 'Upcoming' : 'Past'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    {isUpcoming && (
                                                        <button className="btn btn-xs btn-error">
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;