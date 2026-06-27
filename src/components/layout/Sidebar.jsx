import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FolderGit2, Medal, FileText, ArrowUpRight, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

export const Sidebar = ({ isOpen, toggleMobileOpen }) => {
  // Retaining context to ensure zero architectural breakages
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Activities', path: '/activities', icon: Medal },
    { name: 'Documents', path: '/documents', icon: FileText },
  ];

  const linkClass = ({ isActive }) => `
    flex items-center gap-[12px] px-3 h-[44px] rounded-[10px] text-[15px] font-medium transition-all duration-200 ease-out cursor-pointer
    ${isActive 
      ? 'bg-[#B82691]/[0.08] text-[#B82691]' 
      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70'}
  `;

  return (
    <>
      {/* Mobile structural background overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/10 backdrop-blur-sm z-40 lg:hidden" 
          onClick={toggleMobileOpen}
        />
      )}

      {/* Redesigned Sidebar Container — Strictly enforcing Inter font styling fallback */}
      <aside 
        style={{ fontFamily: "'Inter', sans-serif" }}
        className={`
          fixed top-0 bottom-0 left-0 w-[260px] bg-white border-r border-neutral-200/70 z-50
          flex flex-col justify-between transition-transform duration-200 ease-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        
        {/* Top Branding & Navigation */}
        <div className="flex flex-col flex-1">
          {/* Logo Alignment */}
          <div className="pt-[28px] px-6 mb-[32px] flex items-center gap-[12px]">
            <img src={logo} alt="Draft Logo" className="w-[20px] h-[20px] object-contain" />
            <span className="text-[20px] font-semibold tracking-tight text-neutral-900">Draft</span>
          </div>

          {/* Nav Items List */}
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={linkClass}
                  onClick={() => toggleMobileOpen && toggleMobileOpen()}
                >
                  <Icon className="w-[18px] h-[18px] transition-colors duration-200 ease-out" strokeWidth={1.9} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Premium Action Block (Anchored completely to the bottom) */}
        <div className="p-[24px]">
          <NavLink
            to="/pricing"
            onClick={() => toggleMobileOpen && toggleMobileOpen()}
            className="group block w-full border border-[#B82691] bg-transparent rounded-[14px] p-[16px] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(184,38,145,0.03)]"
          >
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-[16px] h-[16px] text-[#B82691]" strokeWidth={1.9} />
                <h3 className="text-[15px] font-semibold text-neutral-900">Upgrade to Pro</h3>
              </div>
              <p className="text-[13px] font-normal text-neutral-500 leading-normal">
                Unlock unlimited AI generations and premium college tools.
              </p>
            </div>
            
            <div className="flex items-center justify-between w-full h-[36px] px-4 rounded-lg border border-[#B82691] text-[#B82691] text-[13px] font-medium transition-all duration-200 ease-out group-hover:bg-[#B82691] group-hover:text-white">
              <span>View Plans</span>
              <ArrowUpRight className="w-[16px] h-[16px] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.9} />
            </div>
          </NavLink>
        </div>

      </aside>
    </>
  );
};