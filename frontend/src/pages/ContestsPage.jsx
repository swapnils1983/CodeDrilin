import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router';


const ContestsPage = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axiosInstance.get('/contest');
                const sortedData = response.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                setContests(sortedData);
            } catch (error) {
                console.error("Failed to fetch contests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const getContestStatus = (contest) => {
        const now = new Date();
        const start = new Date(contest.startTime);
        const end = new Date(contest.endTime);

        if (now < start) return 'upcoming';
        if (now >= start && now <= end) return 'ongoing';
        return 'past';
    };

    const { activeContests, pastContests } = useMemo(() => {
        const active = [];
        const past = [];

        contests.forEach(contest => {
            const status = getContestStatus(contest);
            if (status === 'past') {
                past.push(contest);
            } else {
                active.push(contest);
            }
        });

        active.sort((a, b) => {
            const statusA = getContestStatus(a);
            const statusB = getContestStatus(b);
            if (statusA === 'ongoing' && statusB !== 'ongoing') return -1;
            if (statusA !== 'ongoing' && statusB === 'ongoing') return 1;
            return new Date(a.startTime) - new Date(b.startTime);
        });


        return { activeContests: active, pastContests: past };
    }, [contests]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    const getStatusBadge = (contest) => {
        const status = getContestStatus(contest);
        const badgeClasses = {
            upcoming: 'badge-info',
            ongoing: 'badge-success',
            past: 'badge-ghost'
        };
        return (
            <span className={`badge ${badgeClasses[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const ContestCard = ({ contest }) => (
        <div className="card lg:card-side bg-gray-800 shadow-lg border border-gray-700 hover:border-green-400 transition-all duration-300 mb-4">

            <div className="card-body p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="card-title text-xl text-gray-100">{contest.title}</h2>
                            {getStatusBadge(contest)}
                            {contest.isPublished || <span className="badge badge-warning">Draft</span>}
                        </div>
                        <div className="text-gray-400 text-sm space-y-1">
                            <p><strong>Starts:</strong> {formatDate(contest.startTime)}</p>
                            <p><strong>Ends:</strong> {formatDate(contest.endTime)}</p>
                        </div>
                        <div className="flex gap-4 mt-3 text-gray-300">
                            <span>Problems: <strong>{contest.problems?.length || 0}</strong></span>
                            <span>Participants: <strong>{contest.participants?.length || 0}</strong></span>
                        </div>
                    </div>
                    <div className="card-actions items-center self-start sm:self-center">
                        <button
                            className="btn btn-primary btn-outline"
                            onClick={() => navigate(`/contest/${contest._id}`)}
                        >
                            View Contest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const ContestSection = ({ title, contestsList }) => (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold text-green-400 border-b-2 border-gray-700 pb-2 mb-6">
                {title}
            </h2>
            {contestsList.length > 0 ? (
                contestsList.map(contest => <ContestCard key={contest._id} contest={contest} />)
            ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg border border-dashed border-gray-600">
                    <p className="text-gray-500">No {title.toLowerCase()} at the moment.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-100 mb-8">Contests</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg text-green-400"></span>
                    </div>
                ) : (
                    <>
                        <ContestSection title="Ongoing & Upcoming" contestsList={activeContests} />
                        <ContestSection title="Past Contests" contestsList={pastContests} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ContestsPage;