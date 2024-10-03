import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosConfig";

interface FeedbackFormProps {
}

interface FeedbackData {
  subject: string;
  body: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    subject: '',
    body: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.post('api/user-engagement/feedback/', feedbackData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFeedbackData({ subject: '', body: '' });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <svg className="mx-auto h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="mt-3 text-lg font-medium text-gray-900">Feedback Submitted Successfully!</h2>
        <p className="mt-2 text-sm text-gray-500">Thank you for your valuable feedback.</p>
        <div className="mt-4">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Another Feedback
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Head over to your Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Provide Feedback</h2>
      <div className="mb-4">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject:
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={feedbackData.subject}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter the subject of your feedback"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Feedback:
        </label>
        <textarea
          id="body"
          name="body"
          value={feedbackData.body}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Please provide your detailed feedback here"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;