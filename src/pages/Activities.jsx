import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, ExternalLink, ArrowLeft, Sparkles, Search, 
  Calendar, Clock, Check, Trash2, Edit3, Loader2, 
  FileText, Star, ShieldCheck, ChevronRight, MoreHorizontal, X
} from 'lucide-react';

// ==========================================
// CONFIGURATION ARCHITECTURE
// ==========================================
const API_BASE_URL = 'https://draft-backend-0s8w.onrender.com';

const CATEGORIES = [
  'All',
  'Leadership',
  'Research'
];

const getAuthHeaders = () => {
  const token = localStorage.getItem('cp_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ==========================================
// REUSABLE PREMIUM SUB-COMPONENTS
// ==========================================

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-md p-4 space-y-3 transition-all duration-200">
      <h3 className="text-[17px] font-semibold text-neutral-900 tracking-tight">
        {title}
      </h3>
      <div className="text-[15px] text-neutral-600 leading-relaxed font-normal">
        {children}
      </div>
    </div>
  );
}

function AppleCircularProgress({ percentage }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
      <svg className="w-14 h-14 transform -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#F5F5F7"
          strokeWidth="3.5"
          fill="transparent"
          className="rounded-md"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#B82691"
          strokeWidth="3.5"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <span className="absolute text-[13px] font-semibold text-neutral-800">{percentage}%</span>
    </div>
  );
}

export default function Activities() {
  const queryClient = useQueryClient();
  const [view, setView] = useState('list');
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [wizardStep, setWizardStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState('Saved');
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [errors, setErrors] = useState({});

  const menuRef = useRef(null);

  const [formData, setFormData] = useState({
    id: null, title: '', category: '', organization: '', leadership_role: '',
    description: '', start_date: '', end_date: '', weekly_hours: '',
    achievements: '', skills: '', reflection: '', evidence_link: ''
  });

  const triggerToast = (msg, type = 'info') => {
    setToast({ msg, type });
    if (type !== 'loading') {
      setTimeout(() => setToast(null), 3500);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear errors when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setErrors({});
    }
  }, [isModalOpen]);

  // ==========================================
  // TANSTACK QUERY HOOKS
  // ==========================================
  
  const { data: activitiesRaw = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to synchronize activities array.');
      const res = await response.json();
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    }
  });

  const activities = Array.isArray(activitiesRaw) ? activitiesRaw : [];

  const executeDocumentRegeneration = async () => {
    triggerToast('Updating documents with latest activities...', 'loading');
    const response = await fetch(`${API_BASE_URL}/documents/regenerate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Document structural compilation pipeline failed.');
    
    const payload = await response.json();
    if (payload.success) {
      setShowCelebration(true);
      triggerToast('Documents updated successfully.', 'success');
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      return payload.message || 'System files updated.';
    } else {
      throw new Error(payload.message || 'Pipeline rejected telemetry data.');
    }
  };

  const createMutation = useMutation({
    mutationFn: async (newActivity) => {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newActivity)
      });
      if (!response.ok) throw new Error('Database refused activity registration.');
      return response.json();
    },
    onSuccess: async () => {
      try {
        await executeDocumentRegeneration();
      } catch (err) {
        triggerToast(err.message || 'Error occurred during auto-regeneration layout.', 'error');
      }
    },
    onError: (error) => {
      triggerToast(error.message || 'System fault executing registration.', 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedActivity) => {
      const response = await fetch(`${API_BASE_URL}/activities/${updatedActivity.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedActivity)
      });
      if (!response.ok) throw new Error('Database mutation target rejected frame.');
      return response.json();
    },
    onSuccess: async () => {
      try {
        await executeDocumentRegeneration();
      } catch (err) {
        triggerToast(err.message || 'Error occurred during auto-regeneration layout.', 'error');
      }
    },
    onError: (error) => {
      triggerToast(error.message || 'System fault executing modification.', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Database tracking array block purge execution.');
      return response.json();
    },
    onSuccess: async () => {
      try {
        await executeDocumentRegeneration();
      } catch (err) {
        triggerToast(err.message || 'Error occurred during auto-regeneration layout.', 'error');
      }
    },
    onError: (error) => {
      triggerToast(error.message || 'System fault executing context deletion.', 'error');
    }
  });

  // ==========================================
  // OPERATIONAL CONTROLLERS & MEMOS
  // ==========================================
  const activeActivity = activities.find(a => a.id === selectedActivityId);

  const openCreateWizard = () => {
    setModalMode('create');
    setFormData({
      id: null, title: '', category: '', organization: '', leadership_role: '',
      description: '', start_date: '', end_date: '', weekly_hours: '',
      achievements: '', skills: '', reflection: '', evidence_link: ''
    });
    setErrors({});
    setWizardStep(1);
    setIsModalOpen(true);
  };

  const openEditWizard = (activity) => {
    setModalMode('edit');
    setFormData({ ...activity });
    setErrors({});
    setWizardStep(1);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (id) => {
    if (confirm('Are you sure you want to remove this activity permanently?')) {
      deleteMutation.mutate(id);
      if (selectedActivityId === id) setView('list');
    }
  };

  const handleNextStep = () => {
    const newErrors = {};
    if (wizardStep === 1) {
      if (!formData.title || !formData.title.trim()) {
        newErrors.title = 'Activity Name is required.';
      }
      if (!formData.category) {
        newErrors.category = 'Category is required.';
      }
    }
    if (wizardStep === 2) {
      if (formData.weekly_hours !== '' && formData.weekly_hours !== null) {
        const hoursNum = Number(formData.weekly_hours);
        if (isNaN(hoursNum) || hoursNum < 0 || hoursNum > 168) {
          newErrors.weekly_hours = 'Weekly hours commitment must be between 0 and 168 hours.';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerToast(Object.values(newErrors)[0], 'error');
      return;
    }

    setErrors({});
    setWizardStep(wizardStep + 1);
  };

  const handleFormSubmission = () => {
    const newErrors = {};
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Activity Name is required.';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }
    
    let hoursNum = formData.weekly_hours ? Number(formData.weekly_hours) : 0;
    if (isNaN(hoursNum) || hoursNum < 0 || hoursNum > 168) {
      newErrors.weekly_hours = 'Weekly hours commitment must be between 0 and 168 hours.';
    }

    if (formData.evidence_link) {
      try {
        new URL(formData.evidence_link);
      } catch (_) {
        newErrors.evidence_link = 'Please enter a valid URL.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerToast(Object.values(newErrors)[0], 'error');
      return;
    }

    setErrors({});
    const payload = {
      ...formData,
      title: formData.title.trim(),
      weekly_hours: hoursNum
    };

    if (modalMode === 'create') {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen && formData.title) {
      setAutosaveStatus('Saving...');
      const timer = setTimeout(() => {
        setAutosaveStatus('Saved just now');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [formData, isModalOpen]);

  const filteredActivities = activities.filter(act => {
    const titleVal = act.title || '';
    const orgVal = act.organization || '';
    const descVal = act.description || '';
    
    const matchesSearch = titleVal.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          orgVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          descVal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalWeeklyIntensity = activities.reduce((acc, curr) => acc + (Number(curr.weekly_hours) || 0), 0);
  const totalLeadershipRoles = activities.filter(a => a.leadership_role).length;
  
  const formattedLatestUpdate = useMemo(() => {
    if (activities.length === 0) return 'None';
    return 'Just now';
  }, [activities]);

  const isGlobalMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Score Calculation for Selected Activity
  const activeActivityScore = useMemo(() => {
    if (!activeActivity) return 0;
    let score = 0;
    if (activeActivity.title && activeActivity.category) score += 20;
    if (activeActivity.organization && activeActivity.leadership_role) score += 20;
    if (activeActivity.description) score += 20;
    if (activeActivity.achievements) score += 20;
    if (activeActivity.reflection) score += 10;
    if (activeActivity.evidence_link || activeActivity.skills) score += 10;
    return score;
  }, [activeActivity]);

  return (
    <div className="bg-[#FAF9FB] min-h-screen selection:bg-black/10 antialiased style-inter text-neutral-900 pb-16 pt-0">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .style-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        .apple-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .card-hover:hover { border-color: #000000; background-color: #FFFFFF; }
      `}} />

      {/* TOAST NOTIFIER CANVAS */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-md border border-neutral-800 flex items-center gap-3 text-[14px] font-normal"
          >
            {toast.type === 'loading' ? (
              <Loader2 className="w-4 h-4 text-black animate-spin shrink-0" />
            ) : toast.type === 'error' ? (
              <div className="w-2 h-2 rounded-full bg-red-400" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-black" />
            )}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ELEGANT CELEBRATION MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 apple-blur bg-white/40">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white border border-neutral-200 w-full max-w-md rounded-md p-8 text-center space-y-6 relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-neutral-100 text-black rounded-md flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Your documents are ready.</h2>
                <p className="text-[15px] text-neutral-500 leading-relaxed px-2">
                  Everything has been updated with your latest activities.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={() => setShowCelebration(false)}
                  className="w-full h-11 px-4 text-[15px] font-medium text-white bg-black hover:bg-neutral-800 rounded-md transition-all focus:outline-none"
                >
                  Open Documents
                </button>
                <button 
                  onClick={() => setShowCelebration(false)}
                  className="w-full h-11 px-4 text-[15px] font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-md transition-all"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1240px] mx-auto px-6 md:px-10 pt-0 space-y-10">
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="space-y-10"
            >
              {/* HERO HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-1">
                  <h1 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight">
                    Activities
                  </h1>
                  <p className="text-[17px] text-neutral-500 font-normal max-w-2xl leading-relaxed">
                    Everything you've done outside the classroom matters. Leadership, volunteering, competitions and research all help tell your story.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={openCreateWizard}
                    disabled={isGlobalMutating || isLoading}
                    className="h-10 px-4 text-[14px] font-medium text-white bg-black hover:bg-neutral-800 rounded-md transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" /> Add Activity
                  </button>
                </div>
              </div>

              {/* PREMIUM METRICS SUMMARY HUD */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Activities', value: isLoading ? '...' : activities.length },
                  { label: 'Leadership Roles', value: isLoading ? '...' : totalLeadershipRoles },
                  { label: 'Hours / Week', value: isLoading ? '...' : `${totalWeeklyIntensity}h` },
                  { label: 'Latest Update', value: isGlobalMutating ? 'Updating...' : formattedLatestUpdate }
                ].map((card, idx) => (
                  <div key={idx} className="bg-white border border-neutral-200 rounded-md p-4 space-y-1 transition-all">
                    <span className="text-[13px] font-medium text-neutral-400 block">{card.label}</span>
                    <span className="text-[24px] font-semibold text-neutral-900 tracking-tight block">
                      {card.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* FLOATING SEARCH AND SEGMENTED CATEGORY CONTROL */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white/70 border border-neutral-200 p-2 rounded-md">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 bg-neutral-50/50 border border-neutral-200 focus:border-neutral-400 rounded-md pl-8 pr-3 text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all"
                    />
                  </div>
                  
                  {/* Segmented control navigation bar */}
                  <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto no-scrollbar py-0.5 px-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`h-8 px-3 text-[13px] font-medium rounded-md transition-all whitespace-nowrap ${
                          selectedCategory === cat 
                            ? 'border border-[#B82691] text-[#B82691] bg-transparent' 
                            : 'border border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* MAIN DATA DEPLOYMENT LAYOUT */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white border border-neutral-200 rounded-md p-4 h-52 animate-pulse" />
                  ))}
                </div>
              ) : filteredActivities.length === 0 ? (
                /* EMPTY STATE CARD CONTAINER */
                <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-neutral-200 rounded-md min-h-[380px] space-y-5">
                  <div className="w-14 h-14 bg-neutral-50 border border-neutral-100 rounded-md flex items-center justify-center text-neutral-400 shadow-2xs">
                    <Sparkles className="w-6 h-6 stroke-[1.5] text-black" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="text-[17px] font-semibold text-neutral-900">Your story starts here.</h3>
                    <p className="text-[15px] text-neutral-500 leading-relaxed">
                      Leadership, volunteering and extracurricular activities help colleges understand who you are beyond grades.
                    </p>
                  </div>
                  <button 
                    onClick={openCreateWizard}
                    className="h-10 px-4 text-[14px] font-medium text-white bg-black hover:bg-neutral-800 rounded-md transition-all"
                  >
                    Add Your First Activity
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActivities.map(activity => (
                    <div 
                      key={activity.id}
                      onClick={() => {
                        setSelectedActivityId(activity.id);
                        setView('detail');
                      }}
                      className="bg-white border border-neutral-200 rounded-md p-4 flex flex-col justify-between space-y-4 cursor-pointer card-hover transition-all duration-200 relative group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <h3 className="text-[17px] font-semibold text-neutral-900 tracking-tight leading-snug group-hover:text-black transition-colors line-clamp-1 pr-6">
                              {activity.title}
                            </h3>
                            <p className="text-[14px] font-medium text-neutral-500 line-clamp-1">
                              {activity.leadership_role ? `${activity.leadership_role} • ` : ''}{activity.organization}
                            </p>
                          </div>
                          
                          {/* THREE DOTS MENU DROPDOWN SYSTEM */}
                          <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === activity.id ? null : activity.id)}
                              className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            <AnimatePresence>
                              {activeMenuId === activity.id && (
                                <motion.div
                                  ref={menuRef}
                                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 mt-1 w-36 bg-white border border-neutral-200 rounded-md py-1 z-20 overflow-hidden"
                                >
                                  <button
                                    onClick={() => {
                                      openEditWizard(activity);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit Record
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteTrigger(activity.id);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-neutral-100"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <p className="text-[14px] text-neutral-500 line-clamp-2 leading-relaxed font-normal pt-1">
                          {activity.description || 'No impact narrative provided yet.'}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-neutral-100">
                        <div className="flex flex-wrap gap-1">
                          {activity.skills ? activity.skills.split(',').map((s, idx) => (
                            <span key={idx} className="text-[13px] font-normal bg-neutral-50 border border-neutral-200 text-neutral-600 px-2 py-0.5 rounded-md">
                              {s.trim()}
                            </span>
                          )) : (
                            <span className="text-[13px] text-neutral-400 font-normal italic">Skills unmapped</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[13px] text-neutral-400 font-normal pt-1" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2 text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" /> {activity.weekly_hours}h/wk
                            </span>
                          </div>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border bg-neutral-50 text-neutral-500 border-neutral-200 shrink-0">
                            {activity.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* DETAILED WORKSPACE CORE VIEW */
            <motion.div 
              key="detail" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="space-y-6"
            >
              {/* BREADCRUMB ROUTER ANCHOR */}
              <div className="space-y-4 border-b border-neutral-200 pb-6">
                <div className="flex items-center gap-1.5 text-[13px] text-neutral-400 font-normal">
                  <button onClick={() => setView('list')} className="hover:text-neutral-900 flex items-center gap-1 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Activities
                  </button>
                  <ChevronRight className="w-3 h-3 text-neutral-300" />
                  <span className="text-neutral-600 truncate max-w-[240px]">{activeActivity?.title}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight">{activeActivity?.title}</h2>
                      <span className="text-[13px] font-medium px-2.5 py-0.5 rounded-md border bg-neutral-50 text-neutral-600 border-neutral-200/60">{activeActivity?.category}</span>
                    </div>
                    <p className="text-[17px] text-neutral-500 font-normal leading-relaxed max-w-3xl">
                      {activeActivity?.leadership_role ? `${activeActivity.leadership_role} at ` : ''}{activeActivity?.organization}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-2">
                    <button 
                      onClick={() => handleDeleteTrigger(activeActivity?.id)}
                      disabled={isGlobalMutating}
                      className="h-10 px-4 text-[14px] font-medium text-neutral-500 hover:text-red-600 border border-neutral-200 rounded-md transition-all bg-white"
                    >
                      Remove Completely
                    </button>
                    <button 
                      onClick={() => openEditWizard(activeActivity)}
                      disabled={isGlobalMutating}
                      className="h-10 px-4 text-[14px] font-medium text-white bg-black hover:bg-neutral-800 rounded-md transition-all"
                    >
                      Modify Record
                    </button>
                  </div>
                </div>
              </div>

              {/* SPLIT LAYOUT SIDEBAR CONTEXT CHANNELS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* PRIMARY DETAILS CORE FRAMEWORK */}
                <div className="lg:col-span-8 space-y-6">
                  <SectionCard title="Overview">
                    <p className="whitespace-pre-wrap leading-relaxed">{activeActivity?.description || "No core summary narrative provided for this item."}</p>
                  </SectionCard>

                  <SectionCard title="Impact & Achievements">
                    <p className="whitespace-pre-wrap leading-relaxed">{activeActivity?.achievements || "No specific metrics or milestones recorded yet."}</p>
                  </SectionCard>

                  <SectionCard title="Reflection">
                    <p className="whitespace-pre-wrap leading-relaxed">{activeActivity?.reflection || "No qualitative student reflection attached."}</p>
                  </SectionCard>

                  {activeActivity?.evidence_link && (
                    <SectionCard title="Evidence Link">
                      <a 
                        href={activeActivity.evidence_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[14px] font-medium text-black hover:underline inline-flex items-center gap-1.5"
                      >
                        Verify Material Record <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </SectionCard>
                  )}
                </div>

                {/* PREMIUM SIDEBAR BLOCK ACTIONS */}
                <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
                  {/* Card 1: Activity Score Ring Checklist */}
                  <div className="bg-white border border-neutral-200 rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-3">
                      <div className="space-y-0.5">
                        <h4 className="text-[15px] font-semibold text-neutral-900">Activity Score</h4>
                        <p className="text-[13px] text-neutral-400">Profile completeness check</p>
                      </div>
                      <AppleCircularProgress percentage={activeActivityScore} />
                    </div>
                    
                    <div className="space-y-2.5">
                      {[
                        { key: 'Description', met: !!activeActivity?.description },
                        { key: 'Achievements', met: !!activeActivity?.achievements },
                        { key: 'Reflection', met: !!activeActivity?.reflection },
                        { key: 'Evidence Reference', met: !!activeActivity?.evidence_link || !!activeActivity?.skills }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[14px]">
                          <span className="text-neutral-600">{item.key}</span>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${item.met ? 'bg-emerald-500 text-white' : 'bg-neutral-100 text-neutral-300'}`}>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Timeline Data Context */}
                  <div className="bg-white border border-neutral-200 rounded-md p-4 space-y-3.5">
                    <h4 className="text-[15px] font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Timeline Summary</h4>
                    <div className="space-y-2 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Start Date</span>
                        <span className="text-neutral-700 font-medium">{activeActivity?.start_date || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">End Date</span>
                        <span className="text-neutral-700 font-medium">{activeActivity?.end_date || 'Present'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Weekly Commitment</span>
                        <span className="text-neutral-700 font-semibold text-black">{activeActivity?.weekly_hours || 0} Hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Skills Pill Grid Container */}
                  <div className="bg-white border border-neutral-200 rounded-md p-4 space-y-3">
                    <h4 className="text-[15px] font-semibold text-neutral-900 border-b border-neutral-100 pb-2">Mapped Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeActivity?.skills ? activeActivity.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="text-[13px] font-normal bg-neutral-50 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-md">
                          {skill.trim()}
                        </span>
                      )) : (
                        <span className="text-[13px] text-neutral-400 italic">No skills flagged yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Quick System Actions Layer Container */}
                  <div className="bg-neutral-900 text-white rounded-md p-4 space-y-3">
                    <h4 className="text-[14px] font-semibold tracking-tight text-neutral-100">Quick Tools</h4>
                    <div className="flex flex-col gap-1.5 text-[13px]">
                      <button 
                        onClick={() => openEditWizard(activeActivity)}
                        className="w-full text-left py-2 px-3 hover:bg-white/10 rounded-md transition-colors flex items-center justify-between"
                      >
                        <span>Improve Description</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                      <button 
                        onClick={() => openEditWizard(activeActivity)}
                        className="w-full text-left py-2 px-3 hover:bg-white/10 rounded-md transition-colors flex items-center justify-between"
                      >
                        <span>Generate Resume Bullet</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==========================================
          SLIDE-IN RIGHT ACTIVITY COMPONENT PANEL
          ========================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Smooth backdrop overlay anchor */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/20 apple-blur"
            />
            
            {/* Sliding Panel Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white border-l border-neutral-200 w-full max-w-xl relative flex flex-col h-full z-10"
            >
              {/* HEADER CONTAINER */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="space-y-1">
                  <h3 className="text-[24px] font-semibold tracking-tight text-neutral-900">
                    Tell us about your activity.
                  </h3>
                  <p className="text-[14px] text-neutral-400">
                    We'll use this to strengthen your documents and applications.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2.5 shrink-0 self-start">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="text-[11px] font-medium text-neutral-400 bg-white border border-neutral-200 px-2.5 py-1 rounded-md">
                    {autosaveStatus}
                  </div>
                </div>
              </div>

              {/* ACTION PROGRESS HORIZONTAL GAUGING LINE */}
              <div className="h-1 w-full bg-neutral-100 flex">
                <div 
                  className="h-full bg-[#B82691] transition-all duration-300 ease-out" 
                  style={{ width: `${(wizardStep / 4) * 100}%` }}
                />
              </div>

              {/* SCROLLABLE FORM WIZARD STAGE */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                
                {/* STEP 1: INITIAL COMPONENT IDENTIFIER VALUES */}
                {wizardStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800 block">Activity Name *</label>
                      <input 
                        type="text"
                        placeholder="e.g. FIRST Robotics"
                        value={formData.title}
                        onChange={e => {
                          setFormData({ ...formData, title: e.target.value });
                          if (errors.title) setErrors({ ...errors, title: null });
                        }}
                        className={`w-full h-10 border ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-400'} rounded-md px-3 text-[14px] placeholder-neutral-300 focus:outline-none transition-all`}
                      />
                      {errors.title && <p className="text-[12px] text-red-500 mt-0.5">{errors.title}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800 block">Category *</label>
                      <select
                        value={formData.category}
                        onChange={e => {
                          setFormData({ ...formData, category: e.target.value });
                          if (errors.category) setErrors({ ...errors, category: null });
                        }}
                        className={`w-full h-10 border ${errors.category ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-400'} rounded-md px-2 text-[14px] bg-white text-neutral-800 placeholder-neutral-300 focus:outline-none transition-all`}
                      >
                        <option value="">Select category...</option>
                        {CATEGORIES.filter(c => c !== 'All').map((cat, i) => (
                          <option key={i} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-[12px] text-red-500 mt-0.5">{errors.category}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[15px] font-medium text-neutral-800 block">Organization</label>
                        <input 
                          type="text"
                          placeholder="e.g. Robotics Inc."
                          value={formData.organization}
                          onChange={e => setFormData({ ...formData, organization: e.target.value })}
                          className="w-full h-10 border border-neutral-200 focus:border-neutral-400 rounded-md px-3 text-[14px] placeholder-neutral-300 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[15px] font-medium text-neutral-800 block">Role</label>
                        <input 
                          type="text"
                          placeholder="e.g. Team Captain"
                          value={formData.leadership_role}
                          onChange={e => setFormData({ ...formData, leadership_role: e.target.value })}
                          className="w-full h-10 border border-neutral-200 focus:border-neutral-400 rounded-md px-3 text-[14px] placeholder-neutral-300 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: TIMELINE METRICS & INTENSITY SCOPING */}
                {wizardStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[15px] font-medium text-neutral-800 block">Start Date</label>
                        <input 
                          type="date"
                          value={formData.start_date}
                          onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                          className="w-full h-10 border border-neutral-200 focus:border-neutral-400 rounded-md px-3 text-[14px] text-neutral-800 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[15px] font-medium text-neutral-800 block">End Date</label>
                        <input 
                          type="date"
                          value={formData.end_date}
                          onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                          className="w-full h-10 border border-neutral-200 focus:border-neutral-400 rounded-md px-3 text-[14px] text-neutral-800 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[15px] font-medium text-neutral-800 block">Hours/Week (0-168)</label>
                        <input 
                          type="number"
                          min="0"
                          max="168"
                          placeholder="42"
                          value={formData.weekly_hours}
                          onChange={e => {
                            const val = e.target.value === '' ? '' : Math.min(168, Math.max(0, Number(e.target.value)));
                            setFormData({ ...formData, weekly_hours: val });
                            if (errors.weekly_hours) setErrors({ ...errors, weekly_hours: null });
                          }}
                          className={`w-full h-10 border ${errors.weekly_hours ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-400'} rounded-md px-3 text-[14px] placeholder-neutral-300 focus:outline-none transition-all`}
                        />
                        {errors.weekly_hours && <p className="text-[12px] text-red-500 mt-0.5">{errors.weekly_hours}</p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800 block">Description</label>
                      <textarea 
                        rows={4}
                        placeholder="Led a team of students building autonomous robots."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 border border-neutral-200 focus:border-neutral-400 rounded-md text-[14px] placeholder-neutral-300 focus:outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: MILESTONE DELIVERABLES & ACQUIRED SKILLS */}
                {wizardStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800 block">Achievements</label>
                      <textarea 
                        rows={4}
                        placeholder="Won regional championship."
                        value={formData.achievements}
                        onChange={e => setFormData({ ...formData, achievements: e.target.value })}
                        className="w-full p-3 border border-neutral-200 focus:border-neutral-400 rounded-md text-[14px] placeholder-neutral-300 focus:outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800 block">Skills (Comma Separated)</label>
                      <input 
                        type="text"
                        placeholder="Leadership, Python, CAD"
                        value={formData.skills}
                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        className="w-full h-10 border border-neutral-200 focus:border-neutral-400 rounded-md px-3 text-[14px] placeholder-neutral-300 focus:outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: INTROSPECTIVE REFLECTION & VERIFICATION LINK */}
                {wizardStep === 4 && (
                  <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800 block">Reflection</label>
                      <textarea 
                        rows={4}
                        placeholder="What did you learn from this experience?"
                        value={formData.reflection}
                        onChange={e => setFormData({ ...formData, reflection: e.target.value })}
                        className="w-full p-3 border border-neutral-200 focus:border-neutral-400 rounded-md text-[14px] placeholder-neutral-300 focus:outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800 block">Evidence URL Link</label>
                      <input 
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.evidence_link}
                        onChange={e => {
                          setFormData({ ...formData, evidence_link: e.target.value });
                          if (errors.evidence_link) setErrors({ ...errors, evidence_link: null });
                        }}
                        className={`w-full h-10 border ${errors.evidence_link ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-neutral-400'} rounded-md px-3 text-[14px] placeholder-neutral-300 focus:outline-none transition-all`}
                      />
                      {errors.evidence_link && <p className="text-[12px] text-red-500 mt-0.5">{errors.evidence_link}</p>}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* MODAL ACTION CONTROLS FOOTER */}
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => wizardStep === 1 ? setIsModalOpen(false) : setWizardStep(wizardStep - 1)}
                  className="h-10 px-4 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200 rounded-md transition-all"
                >
                  {wizardStep === 1 ? 'Cancel' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={() => wizardStep === 4 ? handleFormSubmission() : handleNextStep()}
                  className="h-10 px-5 text-[14px] font-medium text-white bg-black hover:bg-neutral-800 rounded-md transition-all"
                >
                  {wizardStep === 4 ? 'Save Experience' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}