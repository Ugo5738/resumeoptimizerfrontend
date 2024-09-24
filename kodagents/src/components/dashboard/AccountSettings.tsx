import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AccountSettings: React.FC = () => {
  const { user, updateUserInfo, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isGoogleUser = user?.auth_provider === "google";

  const handleEmailChange = async () => {
    try {
      await updateUserInfo({ email: newEmail });
      alert("Email updated successfully");
    } catch (error) {
      alert("Failed to update email");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      alert("Password changed successfully");
    } catch (error) {
      alert("Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteAccount();
        navigate("/login");
      } catch (error) {
        alert("Failed to delete account");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Language Settings</h2>
        <p className="text-gray-600 mb-4">
          Select the language to be used in the ResumeGuru web app.
        </p>
        <Select defaultValue="en-US">
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            {/* Add more language options */}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Redemption Code</h2>
        <p className="text-gray-600 mb-4">Redeem your redemption code</p>
        <div className="flex space-x-2">
          <Input
            placeholder="Insert your redemption code here"
            className="flex-grow"
          />
          <Button variant="secondary">Apply</Button>
        </div>
      </div>
      
      {!isGoogleUser && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Change Email</h2>
          <p className="text-gray-600 mb-4">
            Your current email address is {user?.email}.
            {/* Your current email address is {user?.email}. (Signed in with
            google.com) */}
          </p>
          <div className="flex space-x-2">
            <Input
              placeholder="New email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-grow"
            />
            <Button variant="secondary" onClick={handleEmailChange}>
              Change Email
            </Button>
          </div>
        </div>
      )}

      {!isGoogleUser && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button variant="secondary" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </div>
        </div>
      )}

      {isGoogleUser && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <p className="text-gray-600 mb-4">
            You are signed in with Google ({user?.email}). Email and password changes are not available for Google accounts.
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-4">
          Permanently delete your account and all your resumes.
        </p>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
