import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const userData = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(removeUser());
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-800 text-xl">AI Support Copilot</span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            {/* Avatar circle with first letter */}
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-base font-medium">
              {userData?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {/* Username – larger font */}
            <span className="text-gray-800 font-medium text-base hidden sm:inline cursor-default">
              {userData?.user?.name || 'User'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 transition-colors p-1"
            aria-label="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;