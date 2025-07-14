import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function DeleteProblem() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProblems = async () => {
        try {
            const res = await axiosInstance.get('/problem/getAllProblem');
            setProblems(res.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return;
        try {
            await axiosInstance.delete(`/problem/delete/${id}`);
            setProblems(problems.filter(problem => problem._id !== id));
        } catch (error) {
            console.error('Error deleting problem:', error);
            alert('Error deleting problem');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Problems
                    </h1>
                    <div className="badge badge-error gap-2">
                        Admin Mode
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                        Problem List
                    </h2>

                    {loading ? (
                        <div className="text-center text-gray-400 py-12">Loading problems...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full bg-gray-800 border border-gray-700">
                                <thead className="bg-gray-700 text-gray-300">
                                    <tr>
                                        <th>Title</th>

                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {problems.map(problem => (
                                        <tr key={problem._id} className="hover:bg-gray-750">
                                            <td className="font-medium text-white">{problem.title}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(problem._id)}
                                                    className="btn btn-xs btn-error text-white"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {problems.length === 0 && (
                                <div className="text-center text-gray-400 py-12">
                                    No problems available to delete.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeleteProblem;
