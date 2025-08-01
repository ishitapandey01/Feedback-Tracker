import React from 'react';
import FeedbackItem from './FeedbackItem';
import { MessageSquare } from 'lucide-react';

const FeedbackList = ({ feedback, onEdit, onDelete }) => {
  if (feedback.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
        <p className="text-gray-600">
          No feedback matches your current filters. Try adjusting the filters or create your first feedback entry.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Feedback ({feedback.length})
        </h2>
      </div>
      
      <div className="space-y-4">
        {feedback.map((feedbackItem) => (
          <FeedbackItem
            key={feedbackItem.id}
            feedback={feedbackItem}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;