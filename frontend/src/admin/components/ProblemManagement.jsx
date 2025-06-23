import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axiosInstance from '../../utils/axiosInstance';

const ProblemManagement = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axiosInstance.get('/problem/getAllProblem');
                setProblems(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch problems:", error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Filter problems based on search term
    const filteredProblems = problems.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem._id.includes(searchTerm)
    );

    // Placeholder functions for actions
    const handleEditProblem = (problemId) => {
        console.log(`Edit problem with ID: ${problemId}`);
        // Navigate to edit page: navigate(`/admin/edit-problem/${problemId}`)
    };

    const handleDeleteProblem = (problemId) => {
        console.log(`Delete problem with ID: ${problemId}`);
        // Add delete confirmation and API call
    };

    const handleChangeStatus = (problemId, currentStatus) => {
        console.log(`Toggle status for problem ${problemId} from ${currentStatus} to ${!currentStatus}`);
        // Add API call to update status
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg text-green-400"></span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
                <div className="alert alert-error max-w-2xl mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error loading problems: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header and Create Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Problem Management
                    </h1>
                    <Link to="/admin/create-problem" className="btn btn-success text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Problem
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="label text-gray-300">Search Problems</label>
                            <input
                                type="text"
                                placeholder="Search by title or ID..."
                                className="input input-bordered w-full bg-gray-700 border-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label text-gray-300">Filter by</label>
                            <select className="select select-bordered bg-gray-700 border-gray-600 w-full">
                                <option disabled selected>Select filter</option>
                                <option>All Problems</option>
                                <option>Active Only</option>
                                <option>Easy Difficulty</option>
                                <option>Medium Difficulty</option>
                                <option>Hard Difficulty</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Problems Table */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead className="bg-gray-700 text-gray-300">
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Difficulty</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProblems.length > 0 ? (
                                    filteredProblems.map((problem) => (
                                        <tr key={problem._id} className="hover:bg-gray-750">
                                            <td className="text-gray-400 font-mono text-sm">{problem._id.slice(-6)}</td>
                                            <td>
                                                <div className="font-medium text-white">{problem.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {problem.tags.join(', ')}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${problem.difficulty === 'easy' ? 'badge-success' :
                                                    problem.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                                                    }`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td>
                                                <label className="cursor-pointer label">
                                                    <input
                                                        type="checkbox"
                                                        className="toggle toggle-success"
                                                        checked={problem.isActive || false}
                                                        onChange={() => handleChangeStatus(problem._id, problem.isActive)}
                                                    />
                                                </label>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditProblem(problem._id)}
                                                        className="btn btn-xs btn-primary"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProblem(problem._id)}
                                                        className="btn btn-xs btn-error"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-500">
                                            {searchTerm ? 'No problems match your search' : 'No problems found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination (placeholder) */}
                <div className="flex justify-center mt-6">
                    <div className="join">
                        <button className="join-item btn btn-sm bg-gray-800 border-gray-700">«</button>
                        <button className="join-item btn btn-sm bg-gray-800 border-gray-700">1</button>
                        <button className="join-item btn btn-sm bg-gray-800 border-gray-700">2</button>
                        <button className="join-item btn btn-sm bg-gray-800 border-gray-700">3</button>
                        <button className="join-item btn btn-sm bg-gray-800 border-gray-700">»</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemManagement;