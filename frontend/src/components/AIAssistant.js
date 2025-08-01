import React, { useState } from 'react';
import { Bot, Send, MessageCircle, Lightbulb } from 'lucide-react';

const AIAssistant = ({ apiBaseUrl }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const suggestedQuestions = [
    "What are the best practices for managing customer feedback?",
    "How should I prioritize bug reports vs feature requests?",
    "What's the most effective way to communicate feedback status to users?",
    "How can I categorize feedback to improve our product development process?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion('');
    setError('');
    setIsLoading(true);

    // Add user question to conversation
    const newConversation = [
      ...conversation,
      { type: 'user', content: userQuestion, timestamp: new Date() }
    ];
    setConversation(newConversation);

    try {
      const response = await fetch(`${apiBaseUrl}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }
     


      // Add AI response to conversation
      setConversation(prev => [
        ...prev,
        { type: 'ai', content: data.answer, timestamp: new Date() }
      ]);
    } catch (err) {
      setError(err.message);
      console.error('AI API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion) => {
    setQuestion(suggestedQuestion);
  };

  const clearConversation = () => {
    setConversation([]);
    setError('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-gray-600 text-sm">
                Ask questions about feedback management, get insights, or general help
              </p>
            </div>
          </div>
          {conversation.length > 0 && (
            <button
              onClick={clearConversation}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="p-6">
        {conversation.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start a conversation with AI
            </h3>
            <p className="text-gray-600 mb-6">
              Ask any question about feedback management or get general assistance
            </p>
            
            {/* Suggested Questions */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center mb-4">
                <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Suggested questions:</span>
              </div>
              <div className="grid gap-2">
                {suggestedQuestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(suggestion)}
                    className="text-left p-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start">
                    {message.type === 'ai' && (
                      <Bot className="w-4 h-4 mt-1 mr-2 text-blue-500" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <Bot className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything about feedback management..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center font-medium"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ask AI
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;