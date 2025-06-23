import React from 'react';

const EditorControls = ({
    selectedLanguage,
    handleLanguageChange,
    handleResetCode,
    handleRunCode,
    handleSubmitCode,
    isRunning,
    startCode
}) => {
    return (
        <div className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-gray-700 text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
                {startCode.map(langOpt => (
                    <option key={langOpt.language} value={langOpt.language}>
                        {langOpt.language.charAt(0).toUpperCase() + langOpt.language.slice(1)}
                    </option>
                ))}
            </select>
            <button
                onClick={handleResetCode}
                className="text-xs text-gray-400 hover:text-gray-200"
            >
                Reset Code
            </button>
        </div>
    );
};

export default EditorControls;