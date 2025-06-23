import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const SolutionsTab = ({ referenceSolution, selectedLanguage, setSelectedLanguage }) => {
    const [showReferenceSolution, setShowReferenceSolution] = useState(false);

    const getLanguageForMonaco = (lang) => {
        if (lang === 'c++') return 'cpp';
        if (lang === 'python3') return 'python';
        return lang;
    };

    const showReferenceSolutionCode = () => {
        const solution = referenceSolution.find(sol => sol.language === selectedLanguage);
        return solution ? solution.completeCode : 'No reference solution available for this language';
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-200">Reference Solutions</h3>
                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-gray-700 text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                    {referenceSolution.map(sol => (
                        <option key={sol.language} value={sol.language}>
                            {sol.language.charAt(0).toUpperCase() + sol.language.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            {showReferenceSolution ? (
                <div className="bg-gray-800 rounded p-2">
                    <Editor
                        height="400px"
                        language={getLanguageForMonaco(selectedLanguage)}
                        theme="vs-dark"
                        value={showReferenceSolutionCode()}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: 'on',
                            scrollBeyondLastLine: false,
                        }}
                    />
                    <button
                        onClick={() => setShowReferenceSolution(false)}
                        className="mt-2 text-sm text-gray-400 hover:text-gray-200"
                    >
                        Hide Solution
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowReferenceSolution(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded"
                >
                    Show Reference Solution
                </button>
            )}
        </div>
    );
};

export default SolutionsTab;