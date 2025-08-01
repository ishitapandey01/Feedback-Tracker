import React, { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import AIAssistant from './components/AIAssistant';
import { MessageSquare, Bot, Filter } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('feedback');
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: ''
  });

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/feedback`);
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedback(data);
      setError('');
    } catch (err) {
      setError('Failed to load feedback. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFeedback = async (feedbackData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (!response.ok) throw new Error('Failed to create feedback');
      
      const newFeedback = await response.json();
      setFeedback(prev => [newFeedback, ...prev]);
      setError('');
    } catch (err) {
      setError('Failed to create feedback. Please try again.');
      console.error('Create error:', err);
    }
  };

  const updateFeedback = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update feedback');
      
      const updatedFeedback = await response.json();
      setFeedback(prev => prev.map(item => 
        item.id === id ? updatedFeedback : item
      ));
      setEditingFeedback(null);
      setError('');
    } catch (err) {
      setError('Failed to update feedback. Please try again.');
      console.error('Update error:', err);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete feedback');
      
      setFeedback(prev => prev.filter(item => item.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete feedback. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    return (!filters.category || item.category === filters.category) &&
           (!filters.priority || item.priority === filters.priority) &&
           (!filters.status || item.status === filters.status);
  });

  const clearFilters = () => {
    setFilters({ category: '', priority: '', status: '' });
  };

  const hasActiveFilters = filters.category || filters.priority || filters.status;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI-Powered Feedback Tracker
          </h1>
          <p className="text-gray-600">
            Manage feedback efficiently with AI assistance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'feedback'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback Management
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'ai'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        {activeTab === 'feedback' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <FeedbackForm
                onSubmit={editingFeedback ? updateFeedback : createFeedback}
                editingFeedback={editingFeedback}
                onCancel={() => setEditingFeedback(null)}
              />
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="general">General</option>
                  </select>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading feedback...</p>
                </div>
              ) : (
                <FeedbackList
                  feedback={filteredFeedback}
                  onEdit={setEditingFeedback}
                  onDelete={deleteFeedback}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <AIAssistant apiBaseUrl={API_BASE_URL} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;