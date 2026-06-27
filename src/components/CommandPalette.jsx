import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Terminal, Folder, FileText, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const indexRegistry = [
    { name: 'Navigate to Overview Dashboard', path: '/dashboard', icon: Terminal },
    { name: 'Review Portfolio Projects', path: '/projects', icon: Folder },
    { name: 'Audit Activity Telemetry Log', path: '/activities', icon: FileText },
    { name: 'Inspect Milestones and Goals', path: '/goals', icon: Calendar }
  ];

  const filteredItems = indexRegistry.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black" onClick={() => setIsOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="bg-white w-full max-w-xl border border-neutral-200 shadow-2xl rounded-xl overflow-hidden flex flex-col relative z-10"
          >
            <div className="flex items-center px-4 py-3.5 border-b border-neutral-100 gap-3 bg-neutral-50/50">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search index parameters or run system commands..."
                className="w-full bg-transparent text-xs text-neutral-900 border-none focus:outline-none placeholder-neutral-400 font-mono"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-0.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => { navigate(item.path); setIsOpen(false); setQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors font-medium font-mono"
                    >
                      <Icon className="w-4 h-4 text-neutral-400 shrink-0 stroke-[1.5]" />
                      {item.name}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-neutral-400 font-mono">// No architectural parameters matches query.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}