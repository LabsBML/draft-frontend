import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, ExternalLink, ArrowLeft, FolderGit2, Sparkles, 
  Check, ChevronRight, Loader2, AlertCircle, X, MoreHorizontal, Trash2
} from 'lucide-react';

// ==========================================
// CONFIGURATION ARCHITECTURE
// ==========================================
const API_BASE_URL = 'https://draft-backend-0s8w.onrender.com';

// ==========================================
// REDESIGNED SUB-COMPONENTS (PROFILE DESIGN SYNC)
// ==========================================

function ProjectsHero({ onNewProjectClick, isLoading }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-0">
      <div className="space-y-1">
        <h1 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight">
          Projects
        </h1>
        <p className="text-[17px] text-neutral-500 font-normal max-w-2xl leading-relaxed">
          Everything you build tells your story. Great projects make your college application memorable.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={onNewProjectClick}
          className="h-10 px-4 text-[14px] font-medium text-white bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] rounded-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>
    </div>
  );
}

function SummaryCards({ projects, isLoading }) {
  const computedTechCount = new Set(projects.flatMap(p => p.tech || [])).size;
  const lastUpdated = projects[0]?.updated || 'Just now';

  const stats = [
    { label: 'Projects Created', value: isLoading ? '—' : projects.length },
    { label: 'Technologies Used', value: isLoading ? '—' : computedTechCount },
    { label: 'Recently Updated', value: isLoading ? '—' : lastUpdated }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-neutral-50 border border-neutral-200 rounded-md p-5 flex flex-col justify-between space-y-1"
        >
          <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 block">
            {stat.label}
          </span>
          <span className="text-neutral-900 font-semibold tracking-tight text-[28px]">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProjectCard({ project, onClick, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setConfirmDelete(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-neutral-200 hover:border-neutral-300 rounded-md p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[230px] group relative"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[17px] font-semibold text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors line-clamp-1 flex-1">
            {project.title}
          </h3>
          
          <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <span className={`h-6 px-2.5 rounded-md font-medium tracking-wide flex items-center text-[11px] uppercase ${
              project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' :
              project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200/40' :
              'bg-neutral-100 text-neutral-600 border border-neutral-200/40'
            }`}>
              {project.status || 'Draft'}
            </span>

            {/* Context Three-Dots Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-6 h-6 rounded-md hover:bg-neutral-100 border border-transparent hover:border-neutral-200 flex items-center justify-center transition-all text-neutral-400 hover:text-neutral-700"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-1 w-44 bg-white border border-neutral-200 rounded-md py-1 z-20"
                  >
                    {!confirmDelete ? (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-full text-left px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Project
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onDelete(project.id);
                          setShowMenu(false);
                          setConfirmDelete(false);
                        }}
                        className="w-full text-left px-3 py-2 text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors rounded-b-sm"
                      >
                        Really Delete?
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p className="text-[14px] text-neutral-500 font-normal line-clamp-2 leading-relaxed">
          {project.desc || project.description || 'Tell your project narrative.'}
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <div className="flex flex-wrap gap-1.5">
          {(project.tech || []).slice(0, 3).map((t, i) => (
            <span key={i} className="bg-transparent text-[#B82691] border border-[#B82691] px-2.5 h-6 rounded-md text-[13px] font-medium inline-flex items-center">
              {t}
            </span>
          ))}
          {(project.tech || []).length > 3 && (
            <span className="text-neutral-400 font-medium text-[13px] px-1 self-center">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-neutral-400 text-[13px]">
          <span className="font-normal">
            {project.updated ? `Updated ${project.updated}` : 'No recent updates'}
          </span>
          <span className="text-neutral-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            View Project <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectHealth({ project }) {
  const score = (() => {
    let pointScore = 0;
    if (project.github) pointScore += 20;
    if (project.demo) pointScore += 20;
    if (project.problem && project.solution) pointScore += 30;
    if (project.metrics && project.metrics.length > 0) pointScore += 20;
    if (project.lessons) pointScore += 10;
    return pointScore;
  })();

  return (
    <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-[15px] font-semibold text-neutral-900">Project Health</h3>
        <p className="text-[13px] text-neutral-500 font-normal leading-relaxed">
          Completeness score for application-ready presentation profiles.
        </p>
      </div>
      <div className="space-y-2">
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-[#B82691] rounded-full"
          />
        </div>
        <div className="flex justify-between text-[13px] font-medium text-neutral-500">
          <span>Progress Score</span>
          <span className="text-neutral-900 font-semibold">{score}%</span>
        </div>
      </div>
    </div>
  );
}

function ProjectChecklist({ project }) {
  const items = [
    { label: 'GitHub link added', met: !!project.github },
    { label: 'Live showcase demo added', met: !!project.demo },
    { label: 'Key performance results mapped', met: project.metrics && project.metrics.length > 0 },
    { label: 'Personal learning reflection added', met: !!project.lessons }
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-4">
      <h3 className="text-[15px] font-semibold text-neutral-900">Checklist</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-0.5">
            <span className={`text-[15px] transition-colors ${item.met ? 'text-neutral-800 font-normal' : 'text-neutral-400 font-normal'}`}>
              {item.label}
            </span>
            <div className="flex items-center justify-center">
              {item.met ? (
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center p-1">
                  <Check className="w-3 h-3 text-white stroke-[2.5]" />
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-neutral-300 mr-1.5" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions({ onActionTrigger, isGenerating }) {
  const actions = [
    { id: 'case_study', label: 'Generate Case Study', desc: 'Transform your inputs into a formatted STAR narrative.' },
    { id: 'resume_bullet', label: 'Generate Resume Bullet', desc: 'Synthesize crisp, metric-driven impact bullets.' },
    { id: 'docs', label: 'Generate Documents', desc: 'Synchronize application profiles to latest build logs.' }
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-4">
      <h3 className="text-[15px] font-semibold text-neutral-900">Quick Actions</h3>
      <div className="space-y-2.5">
        {actions.map((act) => (
          <button
            key={act.id}
            disabled={isGenerating}
            onClick={() => onActionTrigger(act.label)}
            className="w-full text-left p-4 rounded-md border border-neutral-200 bg-neutral-50/40 hover:bg-neutral-50 hover:border-neutral-300 transition-all group flex flex-col space-y-1 active:scale-[0.99] disabled:opacity-50"
          >
            <div className="w-full flex items-center justify-between text-neutral-800 group-hover:text-neutral-900 transition-colors">
              <span className="font-medium text-[14px]">{act.label}</span>
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-900" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              )}
            </div>
            <p className="text-neutral-500 font-normal leading-normal text-[13px]">{act.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function SuccessCelebration({ onClose }) {
  const confettiParticles = Array.from({ length: 35 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 140;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 4 + Math.random() * 6,
      color: i % 3 === 0 ? '#B82691' : i % 3 === 1 ? '#171717' : '#D4D4D4'
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neutral-950/20 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative flex items-center justify-center">
        {confettiParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
            animate={{ x: p.x, y: p.y, scale: [1, 0.8, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute rounded-md pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color
            }}
          />
        ))}

        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="bg-white border border-neutral-200 w-full max-w-sm rounded-md p-6 z-10 text-center space-y-4"
        >
          <div className="flex justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center"
            >
              <Check className="w-6 h-6 stroke-[2.5]" />
            </motion.div>
          </div>

          <div className="space-y-1">
            <h3 className="text-neutral-900 font-semibold tracking-tight text-[18px]">
              Your documents are ready.
            </h3>
            <p className="text-neutral-500 font-normal leading-relaxed px-2 text-[14px]">
              Everything has been updated using your latest projects and profile.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <button
              onClick={onClose}
              className="w-full h-10 px-4 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-[14px] font-medium transition-all active:scale-[0.98]"
            >
              Open Documents
            </button>
            <button
              onClick={onClose}
              className="w-full h-10 px-4 rounded-md bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-[14px] font-medium transition-all active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DocumentGenerationToast({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-md flex items-center gap-2.5 text-[14px] font-normal"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Documents updated successfully. Ready to review.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// MAIN COMPONENT EXPORT MODULE
// ==========================================
export default function Projects() {
  const [view, setView] = useState('list'); 
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isSlideInOpen, setIsSlideInOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState('Saved');
  
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [detailDeleteConfirm, setDetailDeleteConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const [formData, setFormData] = useState({
    title: '', desc: '', status: 'Draft', tech: '',
    problem: '', solution: '', lessons: '',
    github: '', demo: '', metricLabel: '', metricValue: ''
  });

  const activeProject = projects.find(p => p.id === selectedProjectId);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('cp_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        triggerToast(`Unable to load projects. Status: ${response.status}`, 'error');
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const payload = await response.json();
        if (payload.success && payload.data?.recent_projects) {
          setProjects(payload.data.recent_projects);
        } else if (Array.isArray(payload)) {
          setProjects(payload);
        }
      } else {
        triggerToast('Synchronization failed: Parsing mismatch.', 'error');
      }
    } catch (error) {
      triggerToast('Connection to server timed out.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateBuild = async () => {
    if (!formData.title.trim()) {
      setValidationError('Project Name is required.');
      setWizardStep(1);
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.desc || 'No description provided.', 
      status: formData.status,
      tech: formData.tech ? formData.tech.split(',').map(t => t.trim()) : ['General'],
      problem: formData.problem,
      solution: formData.solution,
      lessons: formData.lessons,
      metrics: formData.metricLabel ? [{ label: formData.metricLabel, value: formData.metricValue }] : [],
      github: formData.github,
      demo: formData.demo
    };

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const freshArtifact = result.data || result;
        
        setProjects([freshArtifact, ...projects]);
        setIsSlideInOpen(false);
        setFormData({
          title: '', desc: '', status: 'Draft', tech: '',
          problem: '', solution: '', lessons: '',
          github: '', demo: '', metricLabel: '', metricValue: ''
        });
        setWizardStep(1);
        setValidationError('');
        triggerToast('Project successfully created.', 'success');
      } else {
        triggerToast('Could not register your project.', 'error');
      }
    } catch (error) {
      triggerToast('Network error during project preservation.', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
        setView('list');
        setDetailDeleteConfirm(false);
        triggerToast('Project removed successfully.', 'success');
      } else {
        triggerToast('Action blocked by the server.', 'error');
      }
    } catch (error) {
      triggerToast('Network communication error occurred.', 'error');
    }
  };

  const handleDocumentGeneration = async (actionLabel) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/documents/regenerate`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setShowSuccessToast(true);
          setTimeout(() => {
            setShowSuccessToast(false);
          }, 4000);
        }, 2500);
      } else {
        triggerToast('Failed to compile updates. Please check project inputs.', 'error');
      }
    } catch (error) {
      triggerToast('Network error during portfolio synchronization.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWizardContinue = () => {
    if (wizardStep === 1 && !formData.title.trim()) {
      setValidationError('Project Name is required.');
      return;
    }
    setValidationError('');
    if (wizardStep === 4) {
      handleCreateBuild();
    } else {
      setWizardStep(wizardStep + 1);
    }
  };

  useEffect(() => {
    if (isSlideInOpen && formData.title) {
      setAutosaveStatus('Saving...');
      const timer = setTimeout(() => {
        setAutosaveStatus('Saved just now');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [formData, isSlideInOpen]);

  return (
    <div className="bg-neutral-50 min-h-screen selection:bg-neutral-200 antialiased style-inter">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .style-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
      `}} />

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-md flex items-center gap-2.5 text-[14px] font-normal"
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <SuccessCelebration onClose={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>

      <DocumentGenerationToast isVisible={showSuccessToast} />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-12 pt-0 space-y-10">
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-10"
            >
              <ProjectsHero 
                onNewProjectClick={() => setIsSlideInOpen(true)} 
                isLoading={isLoading}
              />

              <SummaryCards projects={projects} isLoading={isLoading} />

              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 min-h-[260px]">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-900 opacity-80" />
                  <div className="text-neutral-400 mt-3 text-[14px] font-normal">
                    Loading your projects...
                  </div>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-10 border border-neutral-200 rounded-md bg-white min-h-[300px] space-y-4">
                  <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-md flex items-center justify-center mx-auto text-neutral-400">
                    <FolderGit2 className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-[17px] font-medium text-neutral-900">
                      Build something you're proud of.
                    </h3>
                    <p className="text-[14px] text-neutral-500 leading-relaxed font-normal">
                      Projects are one of the strongest parts of your college application. Create your first project to get started.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsSlideInOpen(true)}
                    className="h-10 px-4 text-[14px] font-medium text-white bg-neutral-900 hover:bg-neutral-800 transition-colors rounded-md"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onDelete={(id) => handleDeleteProject(id)}
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setView('detail');
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* PROJECT COMPREHENSIVE DETAIL WORKSPACE VIEW */
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-10"
            >
              <div className="space-y-4 pb-0">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[13px]">
                  <button onClick={() => setView('list')} className="hover:text-neutral-900 flex items-center gap-1 transition-colors font-medium rounded">
                    <ArrowLeft className="w-3.5 h-3.5" /> Projects
                  </button>
                  <span>/</span>
                  <span className="text-neutral-600 truncate max-w-[200px] font-normal">{activeProject?.title}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight">
                      {activeProject?.title}
                    </h2>
                    <p className="text-[17px] text-neutral-500 font-normal max-w-2xl leading-relaxed">
                      {activeProject?.desc || activeProject?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 pt-1">
                    <button 
                      onClick={() => {
                        if (detailDeleteConfirm) {
                          handleDeleteProject(activeProject?.id);
                        } else {
                          setDetailDeleteConfirm(true);
                        }
                      }}
                      onMouseLeave={() => setDetailDeleteConfirm(false)}
                      className={`h-10 px-4 text-[14px] font-medium rounded-md transition-all ${
                        detailDeleteConfirm 
                          ? 'bg-red-600 text-white border border-transparent' 
                          : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                      }`}
                    >
                      {detailDeleteConfirm ? 'Really Delete Project?' : 'Delete Project'}
                    </button>
                    {activeProject?.github && (
                      <a 
                        href={activeProject.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="h-10 px-4 text-[14px] font-medium text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 rounded-md transition-all flex items-center gap-1.5"
                      >
                        Repository <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div className="lg:col-span-8 space-y-8">
                  
                  <div className="space-y-1.5">
                    <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Overview</h2>
                    <p className="text-[15px] text-neutral-600 leading-relaxed whitespace-pre-wrap font-normal">
                      {activeProject?.desc || activeProject?.description || "No general description configured for this project."}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">The Problem</h2>
                    <p className="text-[15px] text-neutral-600 leading-relaxed whitespace-pre-wrap font-normal">
                      {activeProject?.problem || "What challenge or bottleneck were you looking to solve? Add details here to compile your story."}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">How You Built It</h2>
                    <p className="text-[15px] text-neutral-600 leading-relaxed whitespace-pre-wrap font-normal">
                      {activeProject?.solution || "Describe your structural decisions, workflow strategies, and implementation details here."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Results</h2>
                    {activeProject?.metrics && activeProject.metrics.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeProject.metrics.map((metric, index) => (
                          <div key={index} className="bg-neutral-50 border border-neutral-200 rounded-md p-5 flex flex-col justify-between">
                            <span className="text-neutral-900 font-semibold tracking-tight text-[28px]">{metric.value}</span>
                            <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 mt-1 block">{metric.label}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-neutral-400 font-normal italic flex items-center gap-1.5 py-1 text-[14px]">
                        <AlertCircle className="w-4 h-4 text-neutral-300" /> Quantitative data fields have not been configured for this profile yet.
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">What You Learned</h2>
                    <p className="text-[15px] text-neutral-600 leading-relaxed whitespace-pre-wrap font-normal">
                      {activeProject?.lessons || "Reflect on critical failure variables, iterations, and core insights discovered during engineering execution loops."}
                    </p>
                  </div>

                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
                  {activeProject && (
                    <>
                      <ProjectHealth project={activeProject} />
                      <ProjectChecklist project={activeProject} />
                      
                      <div className="bg-white border border-neutral-200 rounded-md p-5 space-y-3">
                        <h3 className="text-[15px] font-semibold text-neutral-900">Technologies</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProject.tech && activeProject.tech.length > 0 ? (
                            activeProject.tech.map((t, idx) => (
                              <span key={idx} className="bg-transparent border border-[#B82691] text-[#B82691] px-2.5 h-7 rounded-md font-medium text-[13px] inline-flex items-center">
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-neutral-400 italic font-normal text-[14px]">No items mapped.</span>
                          )}
                        </div>
                      </div>

                      <QuickActions onActionTrigger={handleDocumentGeneration} isGenerating={isGenerating} />
                    </>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==========================================
          SLIDE-IN SIDE COMPONENT SHEET PANEL (INPUT SYNC)
          ========================================== */}
      <AnimatePresence>
        {isSlideInOpen && (
          <div className="fixed inset-0 z-50 flex justify-end style-inter">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                setIsSlideInOpen(false);
                setValidationError('');
              }}
              className="absolute inset-0 bg-neutral-950/20 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="bg-white border-l border-neutral-200 w-full max-w-md relative flex flex-col h-full z-10"
            >
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                <div className="space-y-0.5">
                  <h3 className="text-neutral-900 font-semibold tracking-tight text-[15px]">Let's create your project</h3>
                  <p className="text-neutral-400 font-normal text-[13px]">Tell us about what you built.</p>
                </div>
                <div className="text-neutral-500 font-medium bg-white border border-neutral-200 px-2.5 py-0.5 rounded-md text-[11px] uppercase tracking-wider">
                  {autosaveStatus}
                </div>
              </div>

              <div className="h-1 w-full bg-neutral-100 flex">
                <div 
                  className="h-full bg-[#B82691] transition-all duration-300" 
                  style={{ width: `${(wizardStep / 4) * 100}%` }}
                />
              </div>

              <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-white">
                {validationError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-[13px] flex items-center gap-2 font-normal">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {wizardStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">Project Name *</label>
                      <input 
                        type="text"
                        placeholder="e.g., AI Disaster Rescue Robot"
                        value={formData.title}
                        onChange={e => {
                          setFormData({ ...formData, title: e.target.value });
                          if(e.target.value.trim()) setValidationError('');
                        }}
                        className="w-full h-9 px-2.5 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">Description</label>
                      <textarea 
                        rows={3}
                        placeholder="e.g., Built an AI robot that detects people after earthquakes using computer vision."
                        value={formData.desc}
                        onChange={e => setFormData({ ...formData, desc: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all resize-none leading-relaxed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">Project Status</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="w-full h-9 px-2.5 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 transition-all text-left"
                      >
                        <option value="Draft">Drafting</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed & Live</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {wizardStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">What problem did it solve?</label>
                      <textarea 
                        rows={4}
                        placeholder="Describe the problem, friction point, or question that prompted this project."
                        value={formData.problem}
                        onChange={e => setFormData({ ...formData, problem: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all resize-none leading-relaxed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">How did you build it?</label>
                      <textarea 
                        rows={4}
                        placeholder="Explain your technical choice patterns, strategies, and deployment mechanisms."
                        value={formData.solution}
                        onChange={e => setFormData({ ...formData, solution: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </motion.div>
                )}

                {wizardStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">Technologies Used (Comma Separated)</label>
                      <input 
                        type="text"
                        placeholder="e.g., Python, OpenCV, TensorFlow"
                        value={formData.tech}
                        onChange={e => setFormData({ ...formData, tech: e.target.value })}
                        className="w-full h-9 px-2.5 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">GitHub Repository Link</label>
                      <input 
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={formData.github}
                        onChange={e => setFormData({ ...formData, github: e.target.value })}
                        className="w-full h-9 px-2.5 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">Live Demo Link</label>
                      <input 
                        type="url"
                        placeholder="https://myprojectshowcase.com"
                        value={formData.demo}
                        onChange={e => setFormData({ ...formData, demo: e.target.value })}
                        className="w-full h-9 px-2.5 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {wizardStep === 4 && (
                  <motion.div initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[15px] font-medium text-neutral-800">Metric Key Label</label>
                        <input 
                          type="text"
                          placeholder="e.g., Latency Reduction"
                          value={formData.metricLabel}
                          onChange={e => setFormData({ ...formData, metricLabel: e.target.value })}
                          className="w-full h-9 px-2.5 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[15px] font-medium text-neutral-800">Quantitative Value</label>
                        <input 
                          type="text"
                          placeholder="e.g., 94.2% or Sub-0.5ms"
                          value={formData.metricValue}
                          onChange={e => setFormData({ ...formData, metricValue: e.target.value })}
                          className="w-full h-9 px-2.5 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[15px] font-medium text-neutral-800">What did you learn?</label>
                      <textarea 
                        rows={4}
                        placeholder="What lessons or failure vectors did you discover while building this framework?"
                        value={formData.lessons}
                        onChange={e => setFormData({ ...formData, lessons: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 focus:outline-hidden rounded-md text-[13px] font-normal text-neutral-800 placeholder-neutral-400 transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValidationError('');
                    wizardStep === 1 ? setIsSlideInOpen(false) : setWizardStep(wizardStep - 1);
                  }}
                  className="h-10 px-4 text-[14px] font-medium text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {wizardStep === 1 ? 'Cancel' : 'Back'}
                </button>

                <button
                  type="button"
                  onClick={handleWizardContinue}
                  className="h-10 px-4 text-[14px] font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-all focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {wizardStep === 4 ? 'Create Project' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}