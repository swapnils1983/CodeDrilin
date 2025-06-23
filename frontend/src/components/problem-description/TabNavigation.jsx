import React from 'react';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="flex border-b border-t border-gray-700 px-2">
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;