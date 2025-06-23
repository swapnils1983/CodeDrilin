import React from 'react';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const SubmissionsTab = ({ id }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = async () => {
        try {
            const res = await axiosInstance.get(`/submission/get-submissions/${id}`);
            setSubmissions(res.data.reverse());
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [id]);

    if (loading) {
        return <div className="text-gray-300">Loading submissions...</div>;
    }

    if (!submissions.length) {
        return <div className="text-gray-300">No submissions found</div>;
    }

    return (
        <div className="overflow-x-auto">
            <h3 className="font-semibold text-gray-200 mb-4">Your Submissions</h3>
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 border-b border-gray-700">
                    <tr>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Language</th>
                        <th className="px-4 py-3">Runtime</th>
                        <th className="px-4 py-3">Memory</th>
                        <th className="px-4 py-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission) => (
                        <tr key={submission._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${submission.status === 'accepted'
                                    ? 'bg-green-900 text-green-300'
                                    : 'bg-red-900 text-red-300'
                                    }`}>
                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-300">{submission.language}</td>
                            <td className="px-4 py-3 text-gray-300">{submission.runtime} ms</td>
                            <td className="px-4 py-3 text-gray-300">{submission.memory} KB</td>
                            <td className="px-4 py-3 text-gray-400">
                                {new Date(submission.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubmissionsTab;