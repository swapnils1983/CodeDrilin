import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axiosInstance from '../utils/axiosInstance';
import { FiCode, FiTrendingUp, FiAward, FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Ready to Practice?</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Start your journey towards mastering DSA by solving challenges today.
                    </p>
                    <Link
                        to="/problems"
                        className="group inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Browse Drills <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default HomePage;