import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, Tag, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const FeedbackItem = ({ feedback, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setIsDeleting(true);
      try {
        await onDelete(feedback.id);
      } catch (error) {
        console.error('Delete error:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'bug': return 'bg-red-100 text-red-800 border-red-200';
      case 'feature': return 'bg-green-100 text-green-800 border-green-200';
      case 'general': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'open': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCategoryLabel = (category) => {
    switch (category) {
      case 'bug': return 'Bug Report';
      case 'feature': return 'Feature Request';
      case 'general': return 'General';
      default: return category;
    }
  };

  const formatStatusLabel = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'open': return 'Open';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {feedback.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(feedback.category)}`}>
              <Tag className="w-3 h-3 mr-1" />
              {formatCategoryLabel(feedback.category)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(feedback.priority)}`}>
              {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)} Priority
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
              {getStatusIcon(feedback.status)}
              <span className="ml-1">{formatStatusLabel(feedback.status)}</span>
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(feedback)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit feedback"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete feedback"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {feedback.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Created: {formatDate(feedback.createdAt)}
        </div>
        {feedback.updatedAt !== feedback.createdAt && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Updated: {formatDate(feedback.updatedAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackItem;