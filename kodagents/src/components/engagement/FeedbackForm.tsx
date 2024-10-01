import React, { useState } from 'react';
import axiosInstance from "../../utils/axiosConfig";

interface FeedbackFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
}

interface FeedbackData {
  subject: string;
  body: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmitSuccess, onSubmitError }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    subject: '',
    body: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      setFeedbackData({ subject: '', body: '' });
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      onSubmitError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={feedbackData.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="body">Feedback:</label>
        <textarea
          id="body"
          name="body"
          value={feedbackData.body}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;