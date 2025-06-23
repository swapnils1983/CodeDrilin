import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router';
import axiosInstance from '../utils/axiosInstance';

const ContestProblemPage = () => {
    const [activeLeftTab, setActiveLeftTab] = useState('description');
    const [selectedLanguage, setSelectedLanguage] = useState('c++');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState({ type: '', message: '', details: [] });
    const [activeOutputTab, setActiveOutputTab] = useState('testResults');
    const [problemData, setProblemData] = useState(null);
    const [contestData, setContestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
    const [lastSubmissionTime, setLastSubmissionTime] = useState(null);
    const navigate = useNavigate();

    const { contestId, problemId } = useParams();

    useEffect(() => {
        const fetchContestProblem = async () => {
            try {
                setLoading(true);
                const contestRes = await axiosInstance.get(`/contest/${contestId}`);
                setContestData(contestRes.data);

                const problemRes = await axiosInstance.get(`problem/problemById/${problemId}`);
                setProblemData(problemRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching contest problem:", error);
                setLoading(false);
                navigate(`/contest/${contestId}`);
            }
        };
        fetchContestProblem();
    }, [contestId, problemId, navigate]);

    useEffect(() => {
        if (problemData) {
            const initialCode = problemData.startCode.find(lang => lang.language === selectedLanguage)?.initialCode || '';
            setCode(initialCode);
        }
    }, [selectedLanguage, problemData]);

    useEffect(() => {
        if (contestData) {
            const interval = setInterval(() => {
                const now = new Date();
                const endTime = new Date(contestData.endTime);
                const timeDiff = endTime - now;

                if (timeDiff <= 0) {
                    clearInterval(interval);
                    setTimeLeft('Contest Ended');
                    return;
                }

                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [contestData]);

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    const handleRunCode = async () => {
        setOutput({ type: 'running', message: 'Running sample test cases...', details: [] });
        setActiveOutputTab('testResults');

        try {
            const response = await axiosInstance.post(`contest/${contestId}/run/${problemId}`, {
                language: selectedLanguage,
                code: code
            });

            const formattedResults = response.data.map((result, index) => ({
                id: result.token || `tc${index}`,
                name: `Sample Test Case ${index + 1}`,
                input: result.stdin,
                expectedOutput: result.expected_output,
                actualOutput: result.stdout,
                passed: result.status_id === 3,
                runtime: `${result.time || 0} ms`,
                memory: `${result.memory || 0} KB`,
                status: result.status?.description || '',
                explanation: problemData.visibleTestCases[index]?.explanation || ''
            }));

            const allPassed = formattedResults.every(r => r.passed);
            setOutput({
                type: allPassed ? 'success' : 'error',
                message: allPassed ? 'All sample tests passed!' : 'Some sample tests failed.',
                details: formattedResults
            });
        } catch (error) {
            console.error("Error running code:", error);
            setOutput({
                type: 'error',
                message: error.response?.data?.message || 'Failed to run code',
                details: error.response?.data?.compile_output ?
                    [{ name: 'Compilation Error', details: error.response.data.compile_output }] : []
            });
        }
    };

    const handleSubmitCode = async () => {
        setIsSubmitting(true);
        setOutput({ type: 'running', message: 'Submitting to contest...', details: [] });
        setActiveOutputTab('console');

        try {
            const response = await axiosInstance.post(`contest/${contestId}/submit/${problemId}`, {
                language: selectedLanguage,
                code: code
            });

            const data = response.data;
            setLastSubmissionTime(new Date());

            setOutput({
                type: data.status === 'Accepted' ? 'success' : 'error',
                message: data.status || 'Submission received',
                details: [
                    {
                        name: 'Contest Submission',
                        passed: data.status === 'Accepted',
                        runtime: `${data.runtime || 0}ms`,
                        memory: `${data.memory || 0}KB`,
                        testCasesPassed: data.testCasesPassed,
                        totalTestCases: data.testCasesTotal,
                        submissionId: data.submissionId
                    }
                ]
            });

            setShowSubmitConfirmation(true);

        } catch (error) {
            console.error("Error submitting code:", error);
            setOutput({
                type: 'error',
                message: error.response?.data?.message || 'Failed to submit code',
                details: error.response?.data?.compile_output ?
                    [{ name: 'Compilation Error', details: error.response.data.compile_output }] : []
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getLanguageForMonaco = (lang) => {
        if (lang === 'c++') return 'cpp';
        if (lang === 'python3') return 'python';
        return lang;
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">Loading...</div>;
    if (!problemData || !contestData) return <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">Problem not found</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            {/* Contest Header */}
            <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">{contestData.name}</h2>
                    <p className="text-xs text-gray-400">Problem: {problemData.title}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="bg-gray-700 px-3 py-1 rounded">
                        <span className="text-yellow-400 font-medium">{timeLeft}</span>
                    </div>
                    <button
                        onClick={() => navigate(`/contest/${contestId}`)}
                        className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                    >
                        Back to Contest
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane */}
                <div className="w-1/2 flex flex-col border-r border-gray-700 overflow-y-auto">
                    <div className="p-4 space-y-3">
                        <h1 className="text-2xl font-semibold text-gray-50">{problemData.title}</h1>
                        <div className="flex items-center space-x-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${problemData.difficulty === 'easy' ? 'bg-green-700 text-green-100' : problemData.difficulty === 'medium' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-700 text-red-100'}`}>
                                {problemData?.difficulty?.charAt(0).toUpperCase() + problemData?.difficulty?.slice(1)}
                            </span>
                            <span className="text-xs text-gray-400">
                                Time Limit: {problemData.timeLimit}ms | Memory Limit: {problemData.memoryLimit}MB
                            </span>
                        </div>
                    </div>

                    <div className="flex border-b border-t border-gray-700 px-2">
                        {['description', 'test cases'].map(tab => (
                            <button
                                key={tab}
                                className={`px-3 py-2 text-sm font-medium ${activeLeftTab === tab ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-200'}`}
                                onClick={() => setActiveLeftTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto prose prose-sm prose-invert max-w-none">
                        {activeLeftTab === 'description' && (
                            <>
                                <p className="text-gray-300 leading-relaxed">{problemData.description}</p>
                                <div className="mt-6">
                                    {problemData?.visibleTestCases?.slice(0, 1).map((tc, index) => (
                                        <div key={tc._id || index} className="mb-4">
                                            <h3 className="font-semibold text-gray-200 mb-1">Example {index + 1}:</h3>
                                            <div className="bg-gray-800 p-3 rounded">
                                                <p className="font-mono text-xs"><strong>Input:</strong> <span className="text-yellow-300 whitespace-pre">{tc.input}</span></p>
                                                <p className="font-mono text-xs"><strong>Output:</strong> <span className="text-green-300">{tc.output}</span></p>
                                                {tc.explanation && <p className="text-xs mt-1"><strong>Explanation:</strong> {tc.explanation}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeLeftTab === 'test cases' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-200">Sample Test Cases</h3>
                                {problemData.visibleTestCases.map((tc, index) => (
                                    <div key={tc._id || index}>
                                        <h3 className="font-semibold text-gray-200 mb-1">Sample {index + 1}:</h3>
                                        <div className="bg-gray-800 p-3 rounded">
                                            <p className="font-mono text-xs"><strong>Input:</strong> <pre className="text-yellow-300 whitespace-pre-wrap bg-transparent p-0">{tc.input}</pre></p>
                                            <p className="font-mono text-xs"><strong>Output:</strong> <pre className="text-green-300 whitespace-pre-wrap bg-transparent p-0">{tc.output}</pre></p>
                                            {tc.explanation && <p className="text-xs mt-1"><strong>Explanation:</strong> {tc.explanation}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane - Code Editor and Output */}
                <div className="w-1/2 flex flex-col">
                    {/* Language Selector and Editor Controls */}
                    <div className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                        <select
                            value={selectedLanguage}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-gray-700 text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            {problemData?.startCode?.map(langOpt => (
                                <option key={langOpt.language} value={langOpt.language}>
                                    {langOpt.language.charAt(0).toUpperCase() + langOpt.language.slice(1)}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                const initialCode = problemData.startCode.find(lang => lang.language === selectedLanguage)?.initialCode || '';
                                setCode(initialCode);
                            }}
                            className="text-xs text-gray-400 hover:text-gray-200"
                        >
                            Reset Code
                        </button>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={getLanguageForMonaco(selectedLanguage)}
                            theme="vs-dark"
                            value={code}
                            onChange={value => setCode(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Console/Output Area */}
                    <div className="h-1/3 flex flex-col border-t border-gray-700 bg-gray-800">
                        <div className="flex px-2 border-b border-gray-700">
                            {['testResults', 'console'].map(tab => (
                                <button
                                    key={tab}
                                    className={`px-3 py-2 text-xs font-medium ${activeOutputTab === tab ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-200'}`}
                                    onClick={() => setActiveOutputTab(tab)}
                                >
                                    {tab === 'testResults' ? 'Test Results' : 'Console'}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto text-xs">
                            {output.type === 'running' && <p className="text-yellow-400">{output.message}</p>}

                            {activeOutputTab === 'testResults' && output.details && output.details.length > 0 && (
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
                                                <span className="text-gray-400 text-xs">{result.runtime}, {result.memory}</span>
                                            </div>
                                            {!result.passed && result.input && (
                                                <div className="mt-1 text-gray-300">
                                                    <p>Input: <code className="text-yellow-300 whitespace-pre-wrap">{result.input}</code></p>
                                                    <p>Expected: <code className="text-green-300">{result.expectedOutput}</code></p>
                                                    <p>Got: <code className="text-red-300">{result.actualOutput}</code></p>
                                                    {result.explanation && <p className="text-xs text-gray-400 mt-1">Explanation: {result.explanation}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeOutputTab === 'console' && (
                                <>
                                    {output.message && output.details && output.details.length > 0 && output.details[0].name === 'Contest Submission' && (
                                        <div className="mb-2">
                                            <p className={`font-semibold ${output.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                                {output.message}
                                            </p>
                                            {output.details[0].submissionId && (
                                                <p className="text-gray-300 text-xs">
                                                    Submission ID: {output.details[0].submissionId}
                                                </p>
                                            )}
                                            <p className="text-gray-300 text-xs">
                                                {output.details[0].testCasesPassed !== undefined &&
                                                    `Test Cases: ${output.details[0].testCasesPassed}/${output.details[0].totalTestCases} passed`}
                                            </p>
                                            <p className="text-gray-300 text-xs">
                                                Runtime: {output.details[0].runtime}, Memory: {output.details[0].memory}
                                            </p>
                                            {lastSubmissionTime && (
                                                <p className="text-gray-400 text-xs mt-1">
                                                    Submitted at: {lastSubmissionTime.toLocaleTimeString()}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <pre className="whitespace-pre-wrap text-gray-300">
                                        {output.type !== 'running' && !output.details?.some(d => d.name?.includes('Test Case')) && output.message ?
                                            (output.details && output.details[0]?.runtime ? `${output.message}` : output.message)
                                            : (output.type === 'running' ? output.message : "Contest submission results will appear here...")}
                                    </pre>
                                </>
                            )}
                        </div>
                        <div className="p-2 flex justify-end space-x-3 border-t border-gray-700">
                            <button
                                onClick={handleRunCode}
                                disabled={output.type === 'running' || isSubmitting}
                                className="px-4 py-1.5 text-sm font-medium bg-gray-600 hover:bg-gray-500 rounded text-gray-100 disabled:opacity-50"
                            >
                                Run Samples
                            </button>
                            <button
                                onClick={handleSubmitCode}
                                disabled={output.type === 'running' || isSubmitting}
                                className="px-4 py-1.5 text-sm font-medium bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit to Contest'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Confirmation Modal */}
            {showSubmitConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">Submission Successful</h3>
                        <p className="text-gray-300 mb-4">
                            Your solution has been submitted to the contest. You can view your submissions on the contest page.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => navigate(`/contest/${contestId}/submissions`)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white"
                            >
                                View Submissions
                            </button>
                            <button
                                onClick={() => setShowSubmitConfirmation(false)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
                            >
                                Continue Coding
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContestProblemPage;