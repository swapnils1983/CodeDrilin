import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axiosInstance from '../utils/axiosInstance';
import { FiCode, FiTrendingUp, FiAward, FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
    const [problems, setProblems] = useState([]);
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [difficultyFilter, setDifficultyFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [problemsRes, contestsRes] = await Promise.all([
                    axiosInstance.get('/problem/all?limit=6'),
                    axiosInstance.get('/contest/all?limit=4'),
                ]);
                setProblems(problemsRes.data);
                setContests(contestsRes.data);
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

        if (now < start) return 'Upcoming';
        if (now >= start && now <= end) return 'Ongoing';
        return 'Past';
    };

    const displayedContests = contests
        .filter(c => getContestStatus(c.startTime, c.endTime) !== 'Past')
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-emerald-400 border-dashed rounded-full animate-spin"></div>
                    <p className="mt-4 text-emerald-300 text-sm font-mono tracking-widest">LOADING DRILLS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">

            <section className="relative py-32 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gray-900">
                    <div className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%]] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>
                    <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(10,132,255,0.1),rgba(255,255,255,0))]"></div>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
                            Sharpen Your Code, One Drill at a Time.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Master algorithms, solve targeted drills, and elevate your coding proficiency with our interactive platform.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/problems"
                            className="group inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
                        >
                            Start Drilling <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why CodeDrilin Section */}
            <section className="py-20 px-6 bg-gray-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold">Why CodeDrilin?</h2>
                        <p className="text-gray-400 mt-2">Everything you need to become a better programmer.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <FiCode size={32} />, title: 'Extensive Drill Library', description: 'From beginner-friendly to mind-bendingly hard, find the right challenge for your level.' },
                            { icon: <FiAward size={32} />, title: 'Live Contests', description: 'Experience the thrill of competition. Test your speed and accuracy against others.' },
                            { icon: <FiTrendingUp size={32} />, title: 'Skill Growth', description: 'Track your progress, understand your weaknesses, and watch your skills skyrocket.' }
                        ].map(feature => (
                            <div key={feature.title} className="bg-gray-800/60 p-8 rounded-2xl border border-gray-700/50 transition-all duration-300 hover:border-emerald-400/50 hover:-translate-y-2">
                                <div className="text-emerald-400 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2 text-gray-100">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Featured Drills Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight">Featured Drills</h2>
                            <p className="text-gray-400 mt-2">Targeted exercises to hone your skills.</p>
                        </div>
                        <select
                            className="select select-bordered bg-gray-800 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProblems.map(problem => (
                            <Link to={`/problem/${problem._id}`} key={problem._id} className="group block">
                                <div className="bg-gray-800 rounded-xl border border-gray-700/80 p-6 transition-all duration-300 h-full flex flex-col hover:border-emerald-400/60 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-100 group-hover:text-emerald-400 transition-colors">{problem.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                            problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-red-500/20 text-red-300'
                                            }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex-grow flex flex-wrap gap-2 items-center">
                                        {problem.tags?.slice(0, 4).map(tag => (
                                            <span key={tag} className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-6 text-emerald-400 flex items-center text-sm font-semibold">
                                        Solve Drill <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/problems" className="btn btn-outline border-gray-600 hover:border-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300 rounded-full px-8">
                            View All Drills
                        </Link>
                    </div>
                </div>
            </section>

            {/* Upcoming & Ongoing Contests Section */}
            <section className="py-20 px-6 bg-gray-800/40">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold">Test Your Mettle</h2>
                        <p className="text-gray-400 mt-2">Put your skills to the test in our live coding contests.</p>
                    </div>
                    <div className="space-y-6">
                        {displayedContests.length > 0 ? (
                            displayedContests.map(contest => {
                                const status = getContestStatus(contest.startTime, contest.endTime);
                                return (
                                    <Link to={`/contest/${contest._id}`} key={contest._id} className="group block">
                                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col md:flex-row items-center gap-6 transition-all duration-300 hover:border-emerald-400/60 hover:bg-gray-800/80">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-100">{contest.title}</h3>
                                                    <span className={`font-bold text-xs px-3 py-1 rounded-full ${status === 'Ongoing' ? 'bg-red-500/80 text-white animate-pulse' : 'bg-blue-500/80 text-white'}`}>{status}</span>
                                                </div>
                                                <p className="text-gray-400 mb-4 text-sm">{contest.description}</p>
                                                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm text-gray-300">
                                                    <span className="flex items-center gap-2">Starts: {new Date(contest.startTime).toLocaleString()}</span>
                                                    <span className="flex items-center gap-2">Duration: {Math.floor((new Date(contest.endTime) - new Date(contest.startTime)) / 3600000)} hours</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button className="btn btn-primary bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-full px-8 transition-transform group-hover:scale-105">
                                                    {status === 'Ongoing' ? 'Enter Now' : 'View Details'}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 bg-gray-800 rounded-xl border border-gray-700">
                                <FiAward size={40} className="mx-auto text-gray-500 mb-4" />
                                <h3 className="text-xl font-bold text-gray-300">No Contests Scheduled</h3>
                                <p className="text-gray-400">New competitions are posted regularly. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Welcome Back, Ready to Practice?</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Continue your journey towards mastering DSA by solving new challenges today.
                    </p>
                    <Link
                        to="/dashboard"
                        className="group inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Go to Dashboard <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default HomePage;