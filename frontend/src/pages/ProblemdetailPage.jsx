import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosInstance from '../utils/axiosInstance';
import ProblemHeader from '../components/problem-description/ProblemHeader';
import TabNavigation from '../components/problem-description/TabNavigation';
import DescriptionTab from '../components/problem-description/DescriptionTab';
import SolutionsTab from '../components/problem-description/SolutionsTab';
import AiHelpTab from '../components/problem-description/AiHelpTab';
import EditorControls from '../components/problem-description/EditorControls';
import OutputPanel from '../components/problem-description/OutputPanel';
import SubmissionsTab from '../components/problem-description/SubmissionsTab';

const ProblemdetailPage = () => {
    const [activeLeftTab, setActiveLeftTab] = useState('description');
    const [selectedLanguage, setSelectedLanguage] = useState('c++');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState({ type: '', message: '', details: [] });
    const [activeOutputTab, setActiveOutputTab] = useState('testResults');
    const [problemData, setProblemData] = useState(null);
    const [loading, setLoading] = useState(true);


    const { id } = useParams();

    useEffect(() => {
        const fetchProblemDetail = async () => {
            try {
                const res = await axiosInstance.get(`problem/problemById/${id}`);
                setProblemData(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching problem:", error);
                setLoading(false);
            }
        };
        fetchProblemDetail();
    }, [id]);

    useEffect(() => {
        if (problemData) {
            const initialCode = problemData.startCode.find(lang => lang.language === selectedLanguage)?.initialCode || '';
            setCode(initialCode);
        }
    }, [selectedLanguage, problemData]);

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
    };

    const handleResetCode = () => {
        const initialCode = problemData.startCode.find(lang => lang.language === selectedLanguage)?.initialCode || '';
        setCode(initialCode);
    };

    const handleRunCode = async () => {
        setOutput({ type: 'running', message: 'Running test cases...', details: [] });
        setActiveOutputTab('testResults');

        try {
            const response = await axiosInstance.post(`submission/run/${id}`, {
                language: selectedLanguage,
                code: code
            });

            const formattedResults = response.data.map((result, index) => ({
                id: result.token || `tc${index}`,
                name: `Test Case ${index + 1}`,
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
        setOutput({ type: 'running', message: 'Submitting solution...', details: [] });
        setActiveOutputTab('console');

        try {
            const response = await axiosInstance.post(`submission/submit/${id}`, {
                language: selectedLanguage,
                code: code
            });

            const data = response.data;
            const testCasesPassed = data.testCasesPassed;
            const totalTestCases = data.testCasesTotal;
            const passedAll = testCasesPassed === totalTestCases;

            setOutput({
                type: passedAll ? 'success' : 'error',
                message: passedAll ? 'Accepted' : 'Wrong Answer',
                details: [
                    {
                        name: 'Overall Result',
                        passed: passedAll,
                        runtime: `${data.runtime || 0}ms`,
                        memory: `${data.memory || 0}KB`,
                        testCasesPassed,
                        totalTestCases,
                        status: data.status || 'Unknown'
                    }
                ]
            });

        } catch (error) {
            console.error("Error submitting code:", error);
            setOutput({
                type: 'error',
                message: error.response?.data?.message || 'Failed to submit code',
                details: error.response?.data?.compile_output ?
                    [{ name: 'Compilation Error', details: error.response.data.compile_output }] : []
            });
        }
    };

    const getLanguageForMonaco = (lang) => {
        if (lang === 'c++') return 'cpp';
        if (lang === 'python3') return 'python';
        return lang;
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">Loading...</div>;
    if (!problemData) return <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">Problem not found</div>;

    const leftTabs = ['description', 'submissions', 'solutions', 'ai help'];

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane */}
                <div className="w-1/2 flex flex-col border-r border-gray-700 overflow-y-auto">
                    <ProblemHeader
                        title={problemData.title}
                        difficulty={problemData.difficulty}
                        isContestProblem={problemData.isContestProblem}
                        tags={problemData.tags}
                    />

                    <TabNavigation
                        tabs={leftTabs}
                        activeTab={activeLeftTab}
                        setActiveTab={setActiveLeftTab}
                    />

                    <div className="flex-1 p-4 overflow-y-auto prose prose-sm prose-invert max-w-none">
                        {activeLeftTab === 'description' && (
                            <DescriptionTab
                                description={problemData.description}
                                visibleTestCases={problemData.visibleTestCases}
                            />
                        )}

                        {activeLeftTab === 'submissions' && (
                            <SubmissionsTab id={problemData._id} />
                        )}

                        {activeLeftTab === 'solutions' && (
                            <SolutionsTab
                                referenceSolution={problemData.referenceSolution}
                                selectedLanguage={selectedLanguage}
                                setSelectedLanguage={setSelectedLanguage}
                            />
                        )}

                        {activeLeftTab === 'ai help' && (
                            <AiHelpTab
                                problemData={problemData}
                            />
                        )}
                    </div>
                </div>

                {/* Right Pane - Code Editor and Output */}
                <div className="w-1/2 flex flex-col">
                    <EditorControls
                        selectedLanguage={selectedLanguage}
                        handleLanguageChange={handleLanguageChange}
                        handleResetCode={handleResetCode}
                        startCode={problemData.startCode}
                    />

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

                    <OutputPanel
                        activeOutputTab={activeOutputTab}
                        setActiveOutputTab={setActiveOutputTab}
                        output={output}
                        handleRunCode={handleRunCode}
                        handleSubmitCode={handleSubmitCode}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProblemdetailPage;