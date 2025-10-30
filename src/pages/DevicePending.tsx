import React from 'react';
import { Shield, Clock } from 'lucide-react';
import { useAuth } from '../context/auth';

const DevicePending: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Device Verification Pending
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hello, {user?.firstName} {user?.lastName}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Awaiting Device Verification
          </h3>
          
          <p className="text-gray-600 mb-6">
            Your device is currently pending verification by our administration team. 
            This is a security measure to protect your account. You will be able to 
            access your account once your device has been verified.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You will receive a notification once your device is verified. 
              This process typically takes 1-2 business days.
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevicePending;