import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar';

const difficulties = ['All', 'easy', 'medium', 'hard'];
const allTags = ['Array', 'Hash Table', 'Sliding Window', 'Binary Search', 'Divide and Conquer'];

const ProblemPage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showSolved, setShowSolved] = useState(false);
    const navigate = useNavigate();

    const solvedProblems = useMemo(() => new Set(user?.problemSolved || []), [user?.problemSolved]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get('/problem/getAllProblem');
                setProblems(response.data);
            } catch (error) {
                console.error("Failed to fetch problems:", error);
            }
            finally{
                setLoading(false)
            }
        };
        fetchProblems();
    }, []);

    const filteredProblems = useMemo(() => {
        return problems.filter(problem => {
            const matchDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
            const matchTags = selectedTags.length === 0 || selectedTags.every(tag => problem.tags.includes(tag));
            const matchSolved = !showSolved || solvedProblems.has(problem._id);
            return matchDifficulty && matchTags && matchSolved;
        });
    }, [problems, selectedDifficulty, selectedTags, showSolved, solvedProblems]);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-green-400"></span>
      </div>
    )
  }
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">


            <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="label text-gray-300 mb-1">Difficulty</label>
                        <select
                            className="select select-bordered bg-gray-800 border-gray-700 text-white"
                            value={selectedDifficulty}
                            onChange={e => setSelectedDifficulty(e.target.value)}
                        >
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>{diff}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ml-4">
                        <label className="label text-gray-300 mb-1">Status</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="toggle toggle-success"
                                checked={showSolved}
                                onChange={() => setShowSolved(!showSolved)}
                            />
                            <span className="text-gray-300">Show solved only</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700 shadow">
                    <table className="table table-zebra text-sm">
                        <thead className="text-gray-300 bg-gray-700">
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Difficulty</th>
                                <th>Tags</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.map((problem, index) => (
                                <tr key={problem._id} className="hover">
                                    <td>{index + 1}</td>
                                    <td className="text-green-400 hover:underline cursor-pointer" onClick={() => { navigate(`/problem/${problem._id}`) }}>
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
                                </tr>
                            ))}
                            {filteredProblems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-500 py-4">
                                        No problems match the selected filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
