import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [problems, setProblems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const solvedProblems = useMemo(() => new Set(user?.problemSolved || []), [user?.problemSolved]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axiosInstance.get('/problem/getAllProblem');
                setProblems(response.data);
            } catch (error) {
                console.error("Failed to fetch problems:", error);
            }
        };
        fetchProblems();
    }, []);

    const filteredProblems = useMemo(() => {
        return problems.filter(problem =>
            problem.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [problems, searchQuery]);

    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleDelete = async (problemId) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
        await axiosInstance.delete(`/problem/delete/${problemId}`);
        setProblems(prev => prev.filter(p => p._id !== problemId));
    } catch (error) {
        alert("Failed to delete problem.");
        console.error(error);
    }
};

    

    return (
        <>
        <style>
            {`
                .table-zebra tbody tr:nth-child(even) {
                    background-color: #2d3748;
                }
            `}
        </style>
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Navbar */}

            {/* Rest of the component remains the same */}
            {/* Search Bar */}
            <div className="p-6">
                <input
                    type="text"
                    placeholder="Search by title..."
                    className="input input-bordered w-full bg-gray-800 border-gray-700 text-white"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Problem Table */}
                <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700 shadow">
                    <table className="table bg-gray-800 table-zebra text-sm">
                        <thead className="text-gray-300 bg-gray-700">
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Difficulty</th>
                                <th>Tags</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.map((problem, index) => (
                                <tr key={problem._id} className="hover">
                                    <td>{index + 1}</td>
                                    <td className="text-green-400 hover:underline cursor-pointer" onClick={() => { navigate(`problem/${problem._id}`) }}>
                                        {problem.title}
                                        {solvedProblems.has(problem._id) && (
                                            <span className="ml-2 text-xs text-green-500">✓</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${problem.difficulty === 'easy' ? 'badge-success' :
                                            problem.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                                            }`}>
                                            {capitalizeFirstLetter(problem.difficulty)}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.map(tag => (
                                                <span key={tag} className="badge badge-outline text-gray-300">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        {solvedProblems.has(problem._id) ? (
                                            <span className="text-green-500">Solved</span>
                                        ) : (
                                            <span className="text-gray-500">Unsolved</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            onClick={() => handleDelete(problem._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProblems.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-500 py-4">
                                        No problems found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </div>
        </>
    );
};

export default HomePage;