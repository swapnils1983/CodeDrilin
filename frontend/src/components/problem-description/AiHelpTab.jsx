import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axiosInstance from '../../utils/axiosInstance';

const AiHelpTab = ({ problemData }) => {
    const [aiInput, setAiInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiMessages, setAiMessages] = useState([
        { role: 'model', parts: [{ text: "How can I assist you with this challenge?" }] },
    ]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages, isAiLoading]);

    const handleSendAiMessage = async () => {
        if (!aiInput.trim() || isAiLoading) return;

        const userMessage = { role: 'user', parts: [{ text: aiInput }] };
        const newMessages = [...aiMessages, userMessage];

        setAiMessages(newMessages);
        setAiInput('');
        setIsAiLoading(true);

        try {
            const response = await axiosInstance.post('/ai/chat', {
                title: problemData.title,
                description: problemData.description,
                testCases: problemData.visibleTestCases,
                startCode: problemData.startCode,
                messages: newMessages
            });

            const aiResponse = { role: 'model', parts: [{ text: response.data.message }] };
            setAiMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error getting AI response:", error);
            const errorMessage = { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again.' }] };
            setAiMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-4">
                {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-700 ml-auto' : 'bg-gray-800'}`}>
                        <p className={`font-medium mb-1 ${msg.role === 'user' ? 'text-green-400' : 'text-blue-400'}`}>
                            {msg.role === 'user' ? 'You' : 'AI Assistant'}
                        </p>
                        {msg.parts.map((part, i) => (
                            <div key={i} className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <pre className="bg-gray-950 p-3 my-2 rounded-md overflow-x-auto"><code className={`text-sm ${className}`} {...props}>{children}</code></pre>
                                            ) : (
                                                <code className="bg-gray-700 rounded-sm px-1 py-0.5 text-green-300" {...props}>{children}</code>
                                            );
                                        }
                                    }}
                                >
                                    {part.text}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                ))}


                {isAiLoading && (
                    <div className="max-w-xl p-3 rounded-lg bg-gray-800">
                        <p className="text-blue-400 font-medium mb-2">AI Assistant</p>
                        <div className="flex space-x-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            <div className="border-t border-gray-700 p-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask the AI for help..."
                        className="flex-1 bg-gray-700 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                    />
                    <button
                        onClick={handleSendAiMessage}
                        disabled={isAiLoading || !aiInput.trim()}
                        className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiHelpTab;