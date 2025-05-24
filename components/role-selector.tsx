'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { switchRole } from '@/lib/redux/features/auth-slice';

export default function RoleSelector() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const handleRoleChange = (role: 'superAdmin' | 'merchantAdmin') => {
    dispatch(switchRole(role));
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Demo Mode</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Switch roles to see the difference between Super Admin and Merchant Admin views.
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => handleRoleChange('superAdmin')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              user?.role === 'superAdmin'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-50'
            }`}
          >
            Super Admin
          </button>
          <button
            onClick={() => handleRoleChange('merchantAdmin')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              user?.role === 'merchantAdmin'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-yellow-700 border border-yellow-300 hover:bg-yellow-50'
            }`}
          >
            Merchant Admin
          </button>
        </div>
      </div>
    </div>
  );
}