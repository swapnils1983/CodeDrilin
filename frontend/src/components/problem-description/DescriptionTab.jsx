import React from 'react';

const DescriptionTab = ({ description, visibleTestCases }) => {
    return (
        <>
            <p className="text-gray-300 leading-relaxed">{description}</p>
            <div className="mt-6">
                {visibleTestCases.map((tc, index) => (
                    <div key={tc._id || index} className="mb-4">
                        <h3 className="font-semibold text-gray-200 mb-1">Example {index + 1}:</h3>
                        <div className="bg-gray-800 p-3 rounded">
                            <p className="font-mono text-xs">
                                <strong>Input:</strong> <span className="text-yellow-300 whitespace-pre">{tc.input}</span>
                            </p>
                            <p className="font-mono text-xs">
                                <strong>Output:</strong> <span className="text-green-300">{tc.output}</span>
                            </p>
                            {tc.explanation && (
                                <p className="text-xs mt-1">
                                    <strong>Explanation:</strong> {tc.explanation}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DescriptionTab;