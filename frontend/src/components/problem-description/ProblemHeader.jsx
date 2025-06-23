import React from 'react';

const ProblemHeader = ({ title, difficulty, isContestProblem, tags }) => {
    return (
        <div className="p-4 space-y-3">
            <h1 className="text-2xl font-semibold text-gray-50">{title}</h1>
            <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${difficulty === 'easy' ? 'bg-green-700 text-green-100' : difficulty === 'medium' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-700 text-red-100'}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                {isContestProblem && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-purple-100">
                        Contest Problem
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300">{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default ProblemHeader;