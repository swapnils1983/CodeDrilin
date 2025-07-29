import React from 'react';

const OutputPanel = ({
    output,
    handleRunCode,
    handleSubmitCode
}) => {
    return (
        <div className="h-1/3 flex flex-col border-t border-gray-700 bg-gray-800">
            <div className="flex px-2 border-b border-gray-700">
                <div className="px-3 py-2 text-xs font-medium text-green-400 border-b-2 border-green-400">
                    Test Results
                </div>
            </div>
            <div className="flex-1 p-3 overflow-y-auto text-xs">
                {output.type === 'running' && <p className="text-yellow-400">{output.message}</p>}

                {output.details && output.details.length > 0 && (
                    <div className="space-y-2">
                        {output.message && (
                            <p className={`font-semibold ${output.type === 'success' ? 'text-green-400' : output.type === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {output.message}
                            </p>
                        )}
                        {output.details.map((result, idx) => (
                            <div key={result.id || idx} className={`p-2 rounded ${result.passed ? 'bg-green-800/30' : 'bg-red-800/30'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                        {result.name}
                                    </span>
                                    {result.runtime && (
                                        <span className="text-gray-400 text-xs">
                                            {result.runtime}{result.memory ? `, ${result.memory}` : ''}
                                        </span>
                                    )}
                                </div>
                                {!result.passed && result.input && (
                                    <div className="mt-1 text-gray-300">
                                        <p>Input: <code className="text-yellow-300 whitespace-pre-wrap">{result.input}</code></p>
                                        {result.expectedOutput && <p>Expected: <code className="text-green-300">{result.expectedOutput}</code></p>}
                                        {result.actualOutput && <p>Got: <code className="text-red-300">{result.actualOutput}</code></p>}
                                        {result.explanation && <p className="text-xs text-gray-400 mt-1">Explanation: {result.explanation}</p>}
                                    </div>
                                )}
                                {!result.passed && result.details && (
                                    <div className="mt-1">
                                        <pre className="text-red-300 whitespace-pre-wrap">{result.details}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {output.type !== 'running' && (!output.details || output.details.length === 0) && (
                    <p className="text-gray-400">Run or submit your code to see results</p>
                )}
            </div>
            <div className="p-2 flex justify-end space-x-3 border-t border-gray-700">
                <button
                    onClick={handleRunCode}
                    disabled={output.type === 'running'}
                    className="px-4 py-1.5 text-sm font-medium bg-gray-600 hover:bg-gray-500 rounded text-gray-100 disabled:opacity-50"
                >
                    Run
                </button>
                <button
                    onClick={handleSubmitCode}
                    disabled={output.type === 'running'}
                    className="px-4 py-1.5 text-sm font-medium bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-50"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default OutputPanel;