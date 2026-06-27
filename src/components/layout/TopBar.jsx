import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract user details with safe defaults fallback[cite: 2]
  const fullName = user?.name || user?.fullName || 'Atharv Malve';
  const email = user?.email || 'atharv@example.com';
  const role = user?.role || 'College Applicant';
  
  // Dynamic initials generation
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Handle click outside to close the dropdown menu smoothly
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard accessible ESC key close trigger
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header 
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="sticky top-0 right-0 left-0 bg-white/72 backdrop-blur-xl border-b border-neutral-200/60 h-[64px] z-30 px-4 lg:px-6 flex items-center justify-between lg:justify-end"
    >
      {/* Mobile Burger Navigation Controls Menu Button[cite: 2] */}
      <button 
        onClick={onMenuClick}
        className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg lg:hidden transition-colors duration-180 ease-out"
      >
        <Menu className="w-5 h-5" strokeWidth={1.9} />
      </button>

      {/* Right Side Utility Controls Panel[cite: 2] */}
      <div className="flex items-center gap-4">
        
        {/* Unified Premium Profile Component Interactive Anchor */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-[12px] hover:bg-neutral-100 transition-all duration-200 ease-out cursor-pointer text-left focus:outline-none select-none"
          >
            {/* Soft Shadowed Fluid Gradient Avatar Indicator Node */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B82691] to-[#D946EF] flex items-center justify-center text-white text-[14px] font-semibold shadow-[0_2px_8px_rgba(184,38,145,0.15)] flex-shrink-0">
              {initials}
            </div>
            
            {/* Textual Profile Metadata Description */}
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-[15px] font-medium text-neutral-900 leading-tight">
                {fullName}
              </span>
              <span className="text-[13px] font-normal text-neutral-500 leading-none mt-0.5">
                {role}
              </span>
            </div>

            <ChevronDown className="w-[16px] h-[16px] text-neutral-500 ml-0.5 hidden sm:block" strokeWidth={1.9} />
          </button>

          {/* Elegant Floating Mac-inspired Context Dropdown Menu Window */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[220px] bg-white/90 backdrop-blur-md border border-neutral-200/80 rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] py-1.5 z-40 animate-in fade-in slide-in-from-top-1.5 duration-180 ease-out">
              {/* Profile Context Title Overview Block Header */}
              <div className="px-4 py-2.5 flex flex-col">
                <span className="text-[14px] font-medium text-neutral-900 truncate">{fullName}</span>
                <span className="text-[12px] font-normal text-neutral-500 truncate mt-0.5">{email}</span>
              </div>

              <div className="h-px bg-neutral-200/60 my-1" />

              {/* Profile Route Navigation Link Element */}
              <NavLink 
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 transition-colors duration-180 ease-out"
              >
                View Profile
              </NavLink>

              <div className="h-px bg-neutral-200/60 my-1" />

              {/* Secure Authentication Drop Session Terminate Controls */}
              <button 
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[14px] font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-180 ease-out"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};