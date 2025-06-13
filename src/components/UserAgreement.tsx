import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserAgreementProps {
  onAccept: () => void;
  onReject?: () => void;
}

const UserAgreement: React.FC<UserAgreementProps> = ({ onAccept, onReject }) => {
  const navigate = useNavigate();
  
  const handleReject = onReject || (() => navigate('/'));
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Agreement</h2>
      <div className="prose max-w-none mb-6 text-gray-700">
        <p className="mb-4">
          Welcome to ShiftSync! Before you proceed, please read and accept our User Agreement and Privacy Policy.
        </p>
        
        <h3 className="text-lg font-semibold mt-4 mb-2">1. Terms of Service</h3>
        <p className="mb-4">
          By using ShiftSync, you agree to use the service in compliance with all applicable laws and regulations. 
          You are responsible for maintaining the confidentiality of your account information.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">2. Privacy Policy</h3>
        <p className="mb-4">
          We respect your privacy and are committed to protecting your personal information. 
          Your data will be used in accordance with our Privacy Policy.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">3. Data Usage</h3>
        <p className="mb-4">
          We collect and process your data to provide and improve our services. 
          We will never sell your personal information to third parties.
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-blue-700">
            By clicking "I Agree", you acknowledge that you have read and agree to be bound by our 
            Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleReject}
          className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Disagree
        </button>
        <button
          type="button"
          onClick={onAccept}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          I Agree
        </button>
      </div>
    </div>
  );
};

export default UserAgreement;
