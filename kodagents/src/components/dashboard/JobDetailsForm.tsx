import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../../services/websocketService";
import { trackEvent } from "../../utils/analytics";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";

interface JobDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: "resume" | "cover_letter";
  category: string;
}

const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  isOpen,
  onClose,
  documentType,
  category,
}) => {
  const [jobDetails, setJobDetails] = useState<string>("");
  const navigate = useNavigate();
  const { needsPayment, remainingUses } = useAuth();

  const handleSubmit = (action: "optimize" | "preview") => () => {
    trackEvent(
      "Job Details",
      action === "optimize" ? "Submitted" : "Previewed",
      jobDetails ? "With Details" : "Without Details"
    );
    sendMessage({
      type: "jobDetails",
      details: jobDetails,
      category: category,
      document_type: documentType,
    });
    onClose();
    navigate("/result");
  };

  const handleJobDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDetails(e.target.value);
    if (e.target.value.length > 0) {
      trackEvent("Job Details", "Input Started");
    }
  };

  useEffect(() => {
    if (needsPayment || remainingUses.creation === 0) {
      trackEvent("Job Details", "Create Remaining Use Exhausted");
    }
  }, [needsPayment, remainingUses.creation]);

  const isDisabled = remainingUses.creation === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Tailor Your {documentType === "resume" ? "Resume" : "Cover Letter"}{" "}
            for {category}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="jobDetails"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Details (Optional)
            </label>
            <Textarea
              id="jobDetails"
              className="resize-none"
              placeholder={`Enter job description, required skills, and any other relevant details for your ${
                documentType === "resume" ? "resume" : "cover letter"
              }...`}
              rows={10}
              value={jobDetails}
              onChange={handleJobDetailsChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={handleSubmit("preview")}
            disabled={isDisabled}
          >
            Skip
          </Button>
          <Button
            className="bg-indigo-500 hover:bg-indigo-600"
            onClick={handleSubmit("optimize")}
            disabled={isDisabled}
          >
            Optimize
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsForm;
