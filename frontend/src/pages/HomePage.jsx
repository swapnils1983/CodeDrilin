import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axiosInstance from '../utils/axiosInstance';

const HomePage = () => {
    const [problems, setProblems] = useState([]);
    const [contests, setContests] = useState([]);
    const [stats, setStats] = useState({ users: 100, problems: 100, submissions: 100 });
    const [loading, setLoading] = useState(true);
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [activeStat, setActiveStat] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [problemsRes, contestsRes, statsRes] = await Promise.all([
                    axiosInstance.get('/problem/all?limit=6'),
                    axiosInstance.get('/contest/all?limit=3'),
                    // axiosInstance.get('/stats')
                ]);
                setProblems(problemsRes.data);
                setContests(contestsRes.data);
                setStats(statsRes.data);

                const interval = setInterval(() => {
                    setActiveStat(prev => (prev + 1) % 3);
                }, 3000);
                return () => clearInterval(interval);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProblems = difficultyFilter === 'all'
        ? problems
        : problems.filter(problem => problem.difficulty.toLowerCase() === difficultyFilter);

    const getContestStatus = (startTime, endTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return 'upcoming';
        if (now >= start && now <= end) return 'ongoing';
        return 'past';
    };

    const getStatusBadge = (status) => {
        const badgeClasses = {
            upcoming: 'bg-blue-500/20 text-blue-400',
            ongoing: 'bg-green-500/20 text-green-400',
            past: 'bg-gray-500/20 text-gray-400'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClasses[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-green-400 border-dashed rounded-full animate-spin"></div>
                    <p className="mt-4 text-green-300 text-sm font-mono">Loading Platform...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-80"></div>
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                        Code Arena
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Master algorithms, compete in coding contests, and level up your development skills with our interactive platform.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/problems"
                            className="btn btn-primary btn-lg px-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 border-none hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/20"
                        >
                            Start Practicing
                        </Link>
                        <Link
                            to="/contests"
                            className="btn btn-outline btn-lg px-8 rounded-full text-gray-100 border-gray-500 hover:border-green-400 hover:text-green-400 transition-all duration-300"
                        >
                            View Contests
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6 bg-gray-800/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { value: stats.users, label: 'Active Coders', icon: '👨‍💻' },
                            { value: stats.problems, label: 'Coding Problems', icon: '🧩' },
                            { value: stats.submissions, label: 'Submissions', icon: '🚀' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-xl transition-all duration-500 ${activeStat === index ? 'bg-gray-700/80 shadow-lg scale-[1.02]' : 'bg-gray-700/50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{stat.icon}</div>
                                    <div>
                                        <h3 className="text-4xl font-bold text-green-400 mb-1">
                                            {stat.value}+
                                        </h3>
                                        <p className="text-gray-300">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Problems */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                                    Featured Challenges
                                </span>
                            </h2>
                            <p className="text-gray-400">Curated problems to sharpen your skills</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <select
                                className="select select-bordered bg-gray-800 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                            >
                                <option value="all">All Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <Link
                                to="/problems"
                                className="btn btn-outline border-gray-700 hover:border-green-400 hover:text-green-400 rounded-full"
                            >
                                View All
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProblems.map((problem, index) => (
                            <div
                                key={problem._id}
                                className="group card bg-gray-800 border border-gray-700 hover:border-green-400 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="card-body relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                                    <div className="flex justify-between items-start mt-2">
                                        <Link
                                            to={`/problem/${problem._id}`}
                                            className="card-title text-lg hover:underline hover:text-green-400 transition-colors"
                                        >
                                            {problem.title}
                                        </Link>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                            problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {problem.tags?.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="badge badge-outline border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400 transition-colors"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="card-actions justify-end mt-6">
                                        <Link
                                            to={`/problem/${problem._id}`}
                                            className="btn btn-sm btn-primary rounded-full bg-gradient-to-r from-green-500 to-emerald-600 border-none hover:from-green-600 hover:to-emerald-700 transition-all"
                                        >
                                            Solve Challenge
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Contests */}
            <section className="py-16 px-6 bg-gray-800/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                                    Upcoming Battles
                                </span>
                            </h2>
                            <p className="text-gray-400">Test your skills against other coders</p>
                        </div>
                        <Link
                            to="/contests"
                            className="btn btn-outline border-gray-700 hover:border-green-400 hover:text-green-400 rounded-full"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {contests.filter(c => getContestStatus(c.startTime, c.endTime) === 'upcoming').map(contest => (
                            <div
                                key={contest._id}
                                className="card bg-gray-800 border border-gray-700 hover:border-green-400 transition-all duration-300 group overflow-hidden"
                            >
                                <div className="card-body p-0">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="p-6 flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Link
                                                    to={`/contest/${contest._id}`}
                                                    className="card-title text-xl hover:underline hover:text-green-400 transition-colors"
                                                >
                                                    {contest.title}
                                                </Link>
                                                {getStatusBadge(getContestStatus(contest.startTime, contest.endTime))}
                                            </div>
                                            <p className="text-gray-400 mb-4">{contest.description}</p>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span>Starts: {new Date(contest.startTime).toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span>Duration: {Math.floor((new Date(contest.endTime) - new Date(contest.startTime)) / (1000 * 60 * 60))} hours</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 border-t md:border-t-0 md:border-l border-gray-700 flex items-center justify-center bg-gray-800/50 group-hover:bg-gray-800/70 transition-colors">
                                            <Link
                                                to={`/contest/${contest._id}`}
                                                className="btn btn-primary rounded-full bg-gradient-to-r from-green-500 to-emerald-600 border-none hover:from-green-600 hover:to-emerald-700 px-8 transition-all transform hover:-translate-y-1"
                                            >
                                                Register Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block px-4 py-2 mb-6 bg-gray-800 rounded-full border border-gray-700 text-green-400">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                            </svg>
                            What are you waiting for?
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Join <span className="text-green-400">Thousands</span> of Developers Today
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Level up your coding skills with our interactive platform, community support, and real-world challenges.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="btn btn-primary btn-lg px-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 border-none hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/30"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/problems"
                            className="btn btn-outline btn-lg px-8 rounded-full text-gray-100 border-gray-400 hover:border-green-400 hover:text-green-400 transition-all duration-300"
                        >
                            Browse Challenges
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;