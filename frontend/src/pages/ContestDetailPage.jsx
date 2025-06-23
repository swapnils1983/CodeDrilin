import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import axiosInstance from '../utils/axiosInstance';


const ContestDetailPage = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();

    const user = { _id: 'sample_user_id', username: 'Coder123' };

    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const contestStatus = (() => {
        if (!contest) return 'loading';
        const now = new Date();
        const start = new Date(contest.startTime);
        const end = new Date(contest.endTime);

        if (now < start) return 'upcoming';
        if (now >= start && now <= end) return 'ongoing';
        return 'past';
    })();

    useEffect(() => {
        const fetchContestAndCheckRegistration = async () => {
            try {
                setLoading(true);

                // Fetch contest details
                const [contestResponse, registrationResponse] = await Promise.all([
                    axiosInstance.get(`/contest/${contestId}`),
                    axiosInstance.get(`/contest/check/is-registered/${contestId}`)
                ]);

                setContest(contestResponse.data);

                // Check registration status from both sources
                const registeredFromParticipants = user && contestResponse.data.participants.includes(user._id);
                const registeredFromCheck = registrationResponse.data?.status;

                setIsRegistered(registeredFromParticipants || registeredFromCheck);
            } catch (err) {
                console.error("Failed to fetch contest details:", err);
                setError('Failed to load contest. It might not exist or an error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchContestAndCheckRegistration();
    }, [contestId]);

    const handleRegister = async () => {
        if (!user) {
            alert('Please log in to register for the contest.');
            return navigate('/login');
        }

        setIsRegistering(true);
        try {
            await axiosInstance.post(`/contest/${contestId}/register`);
            setIsRegistered(true);
        } catch (err) {
            console.error("Registration failed:", err);
            setError('Registration failed. Please try again.');
        } finally {
            setIsRegistering(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    const getStatusBadge = (status) => {
        const badgeClasses = {
            upcoming: 'badge-info',
            ongoing: 'badge-success',
            past: 'badge-ghost',
            loading: 'badge-ghost'
        };
        return (
            <span className={`badge ${badgeClasses[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-green-400"></span>
            </div>
        );
    }

    if (error || !contest) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100">
                <h2 className="text-2xl mb-4">{error || 'Contest not found.'}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/contests')}>Back to Contests</button>
            </div>
        );
    }

    // Components for Tab Content
    const OverviewTab = () => (
        <div className="space-y-6">
            <div className="card bg-gray-800 border border-gray-700">
                <div className="card-body">
                    <h3 className="text-xl font-semibold text-green-400 mb-2">Description</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{contest.description || 'No description provided.'}</p>
                </div>
            </div>
            <div className="card bg-gray-800 border border-gray-700">
                <div className="card-body">
                    <h3 className="text-xl font-semibold text-green-400 mb-4">Timeline</h3>
                    <div className="flex flex-col sm:flex-row justify-between gap-4 text-center">
                        <div>
                            <p className="text-gray-400">Starts On</p>
                            <p className="font-bold text-lg">{formatDate(contest.startTime)}</p>
                        </div>
                        <div className="text-gray-500 text-2xl self-center">→</div>
                        <div>
                            <p className="text-gray-400">Ends On</p>
                            <p className="font-bold text-lg">{formatDate(contest.endTime)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ProblemsTab = () => {
        const now = new Date();
        const startTime = new Date(contest.startTime);
        const canViewProblems = now >= startTime;

        const getProblemPoints = (difficulty) => {
            switch (difficulty?.toLowerCase()) {
                case 'hard':
                    return 10;
                case 'medium':
                    return 8;
                case 'easy':
                    return 5;
                default:
                    return 0;
            }
        };

        return (
            <div className="card bg-gray-800 border border-gray-700">
                <div className="card-body">
                    {!canViewProblems ? (
                        <p className="text-center text-gray-400 py-8">
                            Problems will be available when the contest starts on {formatDate(contest.startTime)}
                        </p>
                    ) : contest.problems?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="text-gray-300">
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Points</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contest.problems.map((problem, index) => (
                                        <tr key={problem._id} className="hover">
                                            <th>{index + 1}</th>
                                            <td className="font-medium">{problem.title}</td>
                                            <td>{getProblemPoints(problem.difficulty)}</td>
                                            <td>
                                                <Link
                                                    to={`/contest/${contestId}/problem/${problem._id}`}
                                                    className="btn btn-xs btn-outline btn-primary"
                                                >
                                                    Solve
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-8">No problems have been added to this contest yet.</p>
                    )}
                </div>
            </div>
        );
    };

    const LeaderboardTab = () => (
        <div className="card bg-gray-800 border border-gray-700">
            <div className="card-body">
                {contestStatus === 'upcoming' ? (
                    <p className="text-center text-gray-400 py-8">The leaderboard will be available after the contest starts.</p>
                ) : contest.cachedLeaderboard?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead className="text-gray-300">
                                <tr>
                                    <th>Rank</th>
                                    <th>User</th>
                                    <th>Problems Solved</th>
                                    <th>Total Time (min)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contest.cachedLeaderboard.map((entry, index) => (
                                    <tr key={entry.userId || index} className="hover">
                                        <th className="text-lg">{entry.rank}</th>
                                        <td>{entry.username}</td>
                                        <td>{entry.problemsSolved}</td>
                                        <td>{entry.totalTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-8">Leaderboard is empty or not yet calculated.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-100">{contest.title}</h1>
                            {getStatusBadge(contestStatus)}
                        </div>
                        <p className="text-gray-400">Hosted by Admin</p>
                    </div>
                    {contestStatus === 'upcoming' && (
                        isRegistered ? (
                            <button className="btn btn-success" disabled>
                                Registered
                            </button>
                        ) : (
                            <button
                                className={`btn btn-primary ${isRegistering ? 'loading' : ''}`}
                                onClick={handleRegister}
                                disabled={isRegistering}
                            >
                                {isRegistering ? 'Registering...' : 'Register Now'}
                            </button>
                        )
                    )}
                </div>

                {/* Tabs Navigation */}
                <div className="tabs tabs-boxed bg-gray-800 border border-gray-700 mb-6">
                    <button
                        className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab tab-lg ${activeTab === 'problems' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('problems')}
                    >
                        Problems
                    </button>
                    <button
                        className={`tab tab-lg ${activeTab === 'leaderboard' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('leaderboard')}
                    >
                        Leaderboard
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'problems' && <ProblemsTab />}
                    {activeTab === 'leaderboard' && <LeaderboardTab />}
                </div>
            </div>
        </div>
    );
};

export default ContestDetailPage;