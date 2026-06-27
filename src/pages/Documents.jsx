import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronDown, Loader2 } from 'lucide-react';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'https://draft-backend-0s8w.onrender.com' 
  : 'https://draft-backend-0s8w.onrender.com';

export default function Documents() {
  const [activeTab, setActiveTab] = useState('Resume'); // 'Resume' | 'College Application' | 'Both'
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('cp_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCoreData = async () => {
      setIsLoading(true);
      try {
        const headers = getAuthHeaders();
        
        const [profileRes, activitiesRes, projectsRes, dashboardRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`, { method: 'GET', headers }),
          fetch(`${API_BASE_URL}/activities`, { method: 'GET', headers }),
          fetch(`${API_BASE_URL}/projects`, { method: 'GET', headers }),
          fetch(`${API_BASE_URL}/dashboard`, { method: 'GET', headers })
        ]);

        let profileData = null;
        if (profileRes.ok) {
          const resData = await profileRes.json();
          profileData = resData.data || resData;
          setProfile(profileData);
        }
        if (activitiesRes.ok) {
          const resData = await activitiesRes.json();
          setActivities(resData.data || resData || []);
        }
        if (projectsRes.ok) {
          const resData = await projectsRes.json();
          setProjects(resData.data || resData || []);
        }
        if (dashboardRes.ok) {
          const resData = await dashboardRes.json();
          const dashData = resData.data || resData;
          if (dashData?.user) {
            setUser(dashData.user);
          }
        }

        if (profileData) {
          try {
            const aiRes = await fetch(`${API_BASE_URL}/ai`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ feature: 'story' })
            });
            if (aiRes.ok) {
              const aiData = await aiRes.json();
              if (aiData && typeof aiData === 'object' && aiData.summary) {
                setSummary(aiData.summary);
              } else if (typeof aiData === 'string') {
                setSummary(aiData);
              } else {
                setSummary(aiData.narrative || aiData.story || aiData.content || aiData.text || '');
              }
            }
          } catch (aiErr) {
            console.error('Summary synchronization bypassed:', aiErr);
          }
        }

      } catch (error) {
        console.error('Error unifying document records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoreData();
  }, []);

  const safeText = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      return safeText(val.narrative || val.story || val.content || val.data || val.text || val.description || Object.values(val)[0]);
    }
    return String(val);
  };

  const parseCommaTags = (dataField) => {
    if (!dataField) return [];
    if (Array.isArray(dataField)) return dataField.map(safeText);
    const textStr = safeText(dataField);
    return textStr.split(',').map(item => item.trim()).filter(Boolean);
  };

  const fullNameDisplay = useMemo(() => {
    return safeText(user?.full_name || profile?.full_name || 'Student Applicant');
  }, [user, profile]);

  const mergedSkills = useMemo(() => {
    const skillsSet = new Set();
    if (profile?.skills) {
      parseCommaTags(profile.skills).forEach(s => skillsSet.add(s));
    }
    if (Array.isArray(projects)) {
      projects.forEach(proj => {
        if (proj.technologies) {
          parseCommaTags(proj.technologies).forEach(t => skillsSet.add(t));
        }
      });
    }
    return Array.from(skillsSet);
  }, [profile, projects]);

  const localFallbackSummary = useMemo(() => {
    if (safeText(summary)) return safeText(summary);
    if (!profile) return '';
    const targetMajor = safeText(profile.intended_major || profile.major || 'their chosen fields of interest');
    return `An ambitious student specializing in ${targetMajor}, dedicated to demonstrating exceptional performance across projects, community leadership roles, and targeted research targets at top-tier institutional parameters.`;
  }, [summary, profile]);

  const topProjects = useMemo(() => {
    return Array.isArray(projects) ? projects.slice(0, 3) : [];
  }, [projects]);

  const handleExportPdf = (targetTab) => {
    setActiveTab(targetTab);
    setExportMenuOpen(false);
    // Slight padding allows the layout state to shift and layout calculations to complete
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 font-sans antialiased text-neutral-900 selection:bg-[#B82691]/10 selection:text-neutral-900 style-custom-fonts">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body, .font-sans, .style-custom-fonts {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        h1, h2, h3, .font-display {
          font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
          tracking-tight;
        }
        
        @media print {
          body { background: #FFFFFF !important; color: #111111 !important; }
          .no-print { display: none !important; }
          .print-container { padding: 0 !important; margin: 0 !important; max-width: 100% !important; box-shadow: none !important; border: none !important; }
          .page-break { page-break-before: always !important; }
          
          /* Override Framer Motion style opacity shifts during system print processing */
          div, p, span, h1, h2, h3, section {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            animation: none !important;
          }
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none'/%3e%3cfilter id='noise'%3e%3cfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.01' pointer-events='none'/%3e%3c/svg%3e");
        }
      `}</style>

      <div className="bg-noise fixed inset-0 pointer-events-none z-50" />

      {/* OUTER PADDING & SPACING SYNCHRONIZED WITH PROFILE.JSX */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-12 pt-0">
        
        {/* HERO SECTION DESIGN ALIGNED WITH PROFILE.JSX */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-neutral-200/80 pt-0 pb-6 mb-6">
          <div className="space-y-1">
            <h1 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight font-display">My Documents</h1>
            <p className="text-[17px] text-neutral-500 font-normal max-w-2xl leading-relaxed">
              Academic profiles and extracurricular logs compiled into admissions-ready studio portfolios.
            </p>
          </div>
          
          
        </div>

        {/* CONTROLS */}
        <div className="no-print flex items-center border-b border-neutral-200/60 pb-4 mb-6">
          <div className="bg-neutral-200/60 p-1 rounded-lg flex items-center relative gap-1">
            {[
              { id: 'Resume', label: 'Resume' },
              { id: 'College Application', label: 'College Application' },
              { id: 'Both', label: 'All Documents' }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 text-[13px] font-medium transition-all relative z-10 rounded-md cursor-pointer ${
                    isSelected ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="activeWorkspaceTab"
                      className="absolute inset-0 bg-white rounded-md -z-10 shadow-xs border border-black/5"
                      transition={{ type: 'tween', duration: 0.12 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* LOADING HANDLER */}
        {isLoading ? (
          <div className="no-print flex flex-col items-center justify-center py-36 bg-white border border-neutral-200 rounded-md shadow-xs">
            <Loader2 className="w-5 h-5 text-neutral-400 animate-spin mb-2.5" />
            <span className="text-[13px] text-neutral-500 font-medium tracking-tight">Assembling layout layers...</span>
          </div>
        ) : !profile && !user ? (
          <div className="no-print flex flex-col items-center justify-center text-center py-28 px-6 bg-white border border-neutral-200 rounded-md shadow-xs">
            <p className="text-[14px] font-medium text-neutral-900 tracking-tight">
              Complete your profile to create your first document.
            </p>
          </div>
        ) : (
          
          /* DOCUMENT FRAME STUDIO EMBED */
          <div className="w-full print-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="w-full bg-white border border-neutral-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)] rounded-md p-6 sm:p-16 min-h-[1050px] overflow-y-auto print-container"
              >
                
                {/* ======================================================== */}
                {/* RESUME TEMPLATE ARCHITECTURE                             */}
                {/* ======================================================== */}
                {(activeTab === 'Resume' || activeTab === 'Both') && (
                  <div className="text-[14px] leading-[1.7] text-neutral-800">
                    
                    {/* Primary Identifier Metadata Block */}
                    <div className="text-center space-y-1 pb-6">
                      <h2 className="text-[34px] font-bold tracking-tight text-neutral-900 leading-none mb-2 font-display">
                        {fullNameDisplay}
                      </h2>
                      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[13px] text-neutral-500">
                        {user?.email && <span>{safeText(user.email)}</span>}
                        {profile?.phone && (
                          <>
                            <span className="opacity-50">|</span>
                            <span>{safeText(profile.phone)}</span>
                          </>
                        )}
                        {profile?.school && (
                          <>
                            <span className="opacity-50">|</span>
                            <span>{safeText(profile.school)}</span>
                          </>
                        )}
                        {(profile?.city || profile?.country) && (
                          <>
                            <span className="opacity-50">|</span>
                            <span>{[safeText(profile.city), safeText(profile.country)].filter(Boolean).join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Section: Professional Summary */}
                    {localFallbackSummary && (
                      <div className="mt-6">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Professional Summary</h3>
                        <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                        <p className="text-neutral-800 text-justify text-[14px]">{localFallbackSummary}</p>
                      </div>
                    )}

                    {/* Section: Education Summary Matrix */}
                    <div className="mt-8">
                      <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Education</h3>
                      <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-semibold text-neutral-900 text-[15px]">{safeText(profile?.school) || 'Academic Institution'}</span>
                            {profile?.graduation_year && <span className="text-neutral-500 text-[14px]"> — Class of {safeText(profile.graduation_year)}</span>}
                          </div>
                          {profile?.grade && <span className="text-neutral-500 text-[14px]">{safeText(profile.grade)}th Grade</span>}
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-neutral-800 pt-1">
                          {(profile?.GPA || profile?.gpa) && (
                            <div>
                              <span className="text-neutral-500 mr-1.5 font-medium">GPA:</span>
                              <span className="font-normal">{safeText(profile.GPA || profile.gpa)}</span>
                            </div>
                          )}
                          {(profile?.SAT || profile?.sat) && (
                            <div>
                              <span className="text-neutral-500 mr-1.5 font-medium">SAT:</span>
                              <span className="font-normal">{safeText(profile.SAT || profile.sat)}</span>
                            </div>
                          )}
                          {(profile?.ACT || profile?.act) && (
                            <div>
                              <span className="text-neutral-500 mr-1.5 font-medium">ACT:</span>
                              <span className="font-normal">{safeText(profile.ACT || profile.act)}</span>
                            </div>
                          )}
                          {profile?.class_rank && (
                            <div>
                              <span className="text-neutral-500 mr-1.5 font-medium">Class Rank:</span>
                              <span className="font-normal">{safeText(profile.class_rank)}</span>
                            </div>
                          )}
                          {(profile?.intended_major || profile?.major) && (
                            <div>
                              <span className="text-neutral-500 mr-1.5 font-medium">Intended Major:</span>
                              <span className="font-normal">{safeText(profile.intended_major || profile.major)}</span>
                            </div>
                          )}
                        </div>

                        {(profile?.aps || profile?.ap_courses || profile?.ib_courses || profile?.honors_courses || profile?.coursework || profile?.current_courses) && (
                          <div className="text-[14px] pt-1">
                            <span className="text-neutral-500 block font-medium text-[12px] uppercase tracking-wider mb-0.5">Relevant Coursework</span>
                            <p className="text-neutral-600 leading-relaxed">
                              {[profile.aps, profile.coursework, profile.ap_courses, profile.ib_courses, profile.honors_courses, profile.current_courses]
                                .map(safeText)
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section: Automatically Merged Skills */}
                    {mergedSkills.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Technical Competencies</h3>
                        <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                        <p className="text-neutral-800 text-[14px] leading-relaxed">
                          {mergedSkills.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Section: Top 3 Core Projects */}
                    {topProjects.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Key Projects</h3>
                        <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                        
                        <div className="space-y-5">
                          {topProjects.map((proj, idx) => (
                            <div key={proj.id || idx} className="space-y-1">
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-neutral-900 text-[15px]">{safeText(proj.title)}</span>
                                <span className="text-neutral-500 text-[13px] font-normal">{safeText(proj.duration) || 'Portfolio Project'}</span>
                              </div>
                              
                              {proj.technologies && (
                                <div className="text-[13px] text-[#B82691] font-medium tracking-wide">
                                  {parseCommaTags(proj.technologies).join(' · ')}
                                </div>
                              )}

                              <p className="text-neutral-600 text-[14px] text-justify pt-0.5 leading-relaxed">{safeText(proj.description)}</p>
                              
                              {(proj.problem || proj.solution || proj.impact || proj.lessons) && (
                                <div className="space-y-1 pt-1 text-[13px] text-neutral-600 border-l border-neutral-200 pl-3.5 ml-0.5">
                                  {proj.problem && <div><span className="text-neutral-900 font-medium">Challenge:</span> {safeText(proj.problem)}</div>}
                                  {proj.solution && <div><span className="text-neutral-900 font-medium">Solution:</span> {safeText(proj.solution)}</div>}
                                  {proj.impact && <div><span className="text-neutral-900 font-medium">Impact Matrix:</span> {safeText(proj.impact)}</div>}
                                  {proj.lessons && <div><span className="text-neutral-900 font-medium">Takeaway:</span> {safeText(proj.lessons)}</div>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Activities and Leadership Profile */}
                    {activities.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Activities & Leadership</h3>
                        <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                        
                        <div className="space-y-5">
                          {activities.map((act, idx) => (
                            <div key={act.id || idx} className="space-y-1">
                              <div className="flex justify-between items-baseline">
                                <div>
                                  <span className="font-semibold text-neutral-900 text-[15px]">{safeText(act.leadership_role || act.title) || 'Participant'}</span>
                                  {act.organization && <span className="text-neutral-500 font-normal text-[14px]">, {safeText(act.organization)}</span>}
                                </div>
                                <div className="text-neutral-500 text-[13px]">
                                  {[safeText(act.start_date), safeText(act.end_date)].filter(Boolean).join(' — ') || 'Active Status'}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-3 text-[13px] text-neutral-500 font-medium tracking-wide">
                                {act.category && <span className="capitalize text-[#B82691]">{safeText(act.category)} Segment</span>}
                                {act.weekly_hours && (
                                  <>
                                    <span className="opacity-40">•</span>
                                    <span>{safeText(act.weekly_hours)} Hours/Week</span>
                                  </>
                                )}
                              </div>

                              {act.description && <p className="text-neutral-600 text-[14px] text-justify pt-0.5 leading-relaxed">{safeText(act.description)}</p>}
                              {act.achievements && (
                                <p className="text-neutral-500 text-[13px] pl-3.5 border-l border-neutral-200 italic ml-0.5">
                                  Milestone achieved: {safeText(act.achievements)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Strengths and Traits */}
                    {profile?.strengths && (
                      <div className="mt-8">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Core Strengths</h3>
                        <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                        <p className="text-neutral-600 text-[14px] text-justify leading-relaxed">
                          {parseCommaTags(profile.strengths).join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Section: Personal Alignment Interests */}
                    {profile?.interests && (
                      <div className="mt-8">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Interests</h3>
                        <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                        <p className="text-neutral-600 text-[14px] leading-relaxed">
                          {parseCommaTags(profile.interests).join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Section: Academic Distinctions/Awards */}
                    {profile?.awards && (
                      <div className="mt-8">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase mb-2">Honors & Distinctions</h3>
                        <div className="h-[1px] bg-neutral-200 w-full mb-3" />
                        <p className="text-neutral-600 text-[14px] text-justify leading-relaxed">
                          {safeText(profile.awards)}
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* DYNAMIC COMBINED SEPARATOR */}
                {activeTab === 'Both' && (
                  <div className="my-16 border-t border-dashed border-neutral-200 pt-16 no-print page-break" />
                )}

                {/* ======================================================== */}
                {/* COLLEGE APPLICATION SUMMARY DOSSIER                      */}
                {/* ======================================================== */}
                {(activeTab === 'College Application' || activeTab === 'Both') && (
                  <div className="text-[14px] leading-[1.7] text-neutral-800 relative">
                    {/* Guarantees that the application portfolio takes a crisp new page boundary on print when exporting both */}
                    <div className="hidden print:block page-break" />
                    
                    {/* Packaging Framework Identification Head */}
                    <div className="border-b border-neutral-900 pb-4 mb-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block mb-1">Institutional Admission Profile</span>
                        <h2 className="text-[34px] font-bold tracking-tight text-neutral-900 leading-tight font-display">{fullNameDisplay}</h2>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[13px] text-neutral-500 block">Cycle Baseline: {safeText(profile?.graduation_year) || '2026'}</span>
                        {profile?.dream_university && (
                          <span className="text-[14px] font-bold text-[#B82691] block tracking-tight font-display">{safeText(profile.dream_university)}</span>
                        )}
                      </div>
                    </div>

                    {/* Two Column Grid Structure for Identity and Academic Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-start">
                      
                      {/* Identity Parameters */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-200 pb-1">
                          Applicant Profile
                        </h3>
                        <div className="space-y-2.5">
                          {fullNameDisplay && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Legal Name</span>
                              <span className="text-neutral-900 col-span-2 font-normal">{fullNameDisplay}</span>
                            </div>
                          )}
                          {user?.email && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Contact Email</span>
                              <span className="text-neutral-900 col-span-2">{safeText(user.email)}</span>
                            </div>
                          )}
                          {profile?.phone && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Phone Line</span>
                              <span className="text-neutral-900 col-span-2">{safeText(profile.phone)}</span>
                            </div>
                          )}
                          {(profile?.city || profile?.country) && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Location</span>
                              <span className="text-neutral-900 col-span-2">{[safeText(profile.city), safeText(profile.country)].filter(Boolean).join(', ')}</span>
                            </div>
                          )}
                          {profile?.languages && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Languages</span>
                              <span className="text-neutral-900 col-span-2">{parseCommaTags(profile.languages).join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Academic Core Parameters */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-200 pb-1">
                          Academic Information
                        </h3>
                        <div className="space-y-2.5">
                          {profile?.school && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Institution</span>
                              <span className="text-neutral-900 col-span-2 font-normal text-right md:text-left">{safeText(profile.school)}</span>
                            </div>
                          )}
                          {profile?.grade && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Current Grade</span>
                              <span className="text-neutral-900 col-span-2">{safeText(profile.grade)}th Grade</span>
                            </div>
                          )}
                          {(profile?.GPA || profile?.gpa) && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Cumulative GPA</span>
                              <span className="text-neutral-900 col-span-2 font-bold text-[#B82691] font-display">{safeText(profile.GPA || profile.gpa)}</span>
                            </div>
                          )}
                          {profile?.class_rank && (
                            <div className="grid grid-cols-3 text-[14px] items-baseline">
                              <span className="text-neutral-500 font-medium text-[13px]">Class Rank</span>
                              <span className="text-neutral-900 col-span-2">{safeText(profile.class_rank)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Standardized Testing Metrics */}
                    {(profile?.SAT || profile?.sat || profile?.ACT || profile?.act) && (
                      <div className="mt-8 space-y-4">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-200 pb-1">
                          Testing Records
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {(profile?.SAT || profile?.sat) && (
                            <div>
                              <span className="text-neutral-500 block text-[12px] font-medium">SAT Standardized Score</span>
                              <span className="font-bold text-neutral-900 text-[15px] font-display">{safeText(profile.SAT || profile.sat)}</span>
                            </div>
                          )}
                          {(profile?.ACT || profile?.act) && (
                            <div>
                              <span className="text-neutral-500 block text-[12px] font-medium">ACT Standardized Score</span>
                              <span className="font-bold text-neutral-900 text-[15px] font-display">{safeText(profile.ACT || profile.act)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Core Trajectory Directives */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-t border-b border-neutral-200">
                      <div>
                        <span className="text-neutral-500 font-medium block uppercase tracking-wider text-[11px] mb-0.5">Concentration Targets</span>
                        <span className="font-medium text-neutral-900 text-[14px]">{safeText(profile?.intended_major || profile?.major) || 'General Focus Track'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-medium block uppercase tracking-wider text-[11px] mb-0.5">Primary Target University</span>
                        <span className="font-medium text-neutral-900 text-[14px]">{safeText(profile?.dream_university) || 'Unspecified Parameters'}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 font-medium block uppercase tracking-wider text-[11px] mb-0.5">Identified Strength Factor</span>
                        <span className="font-normal text-neutral-600 text-[14px] block truncate">{safeText(profile?.strengths ? parseCommaTags(profile.strengths).join(', ') : 'Not Annotated')}</span>
                      </div>
                    </div>

                    {/* Personal Statement Narrative Layer */}
                    {localFallbackSummary && (
                      <div className="mt-8 space-y-2">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase border-b border-neutral-200 pb-1">Application Summary Narrative</h3>
                        <p className="text-neutral-600 text-justify text-[14px] leading-[1.7] font-normal pt-1">
                          {localFallbackSummary}
                        </p>
                      </div>
                    )}

                    {/* Structured Curriculum Breakdown */}
                    {(profile?.aps || profile?.coursework || profile?.ap_courses || profile?.ib_courses || profile?.honors_courses || profile?.current_courses) && (
                      <div className="mt-8 space-y-4">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-200 pb-1">Academic Rigor Parameters</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-[14px]">
                          {(profile?.aps || profile?.ap_courses) && (
                            <div>
                              <span className="font-medium text-neutral-500 text-[12px] block mb-0.5">Advanced Placement (AP) Modules</span>
                              <span className="text-neutral-900 text-[14px] leading-relaxed">{safeText(profile.aps || profile.ap_courses)}</span>
                            </div>
                          )}
                          {profile?.ib_courses && (
                            <div>
                              <span className="font-medium text-neutral-500 text-[12px] block mb-0.5">International Baccalaureate (IB) Streams</span>
                              <span className="text-neutral-900 text-[14px] leading-relaxed">{safeText(profile.ib_courses)}</span>
                            </div>
                          )}
                          {profile?.honors_courses && (
                            <div>
                              <span className="font-medium text-neutral-500 text-[12px] block mb-0.5">Honors Pathways</span>
                              <span className="text-neutral-900 text-[14px] leading-relaxed">{safeText(profile.honors_courses)}</span>
                            </div>
                          )}
                          {(profile?.coursework || profile?.current_courses) && (
                            <div>
                              <span className="font-medium text-neutral-500 text-[12px] block mb-0.5">Other Core Academic Inclusions</span>
                              <span className="text-neutral-900 text-[14px] leading-relaxed">{[profile.coursework, profile.current_courses].filter(Boolean).map(safeText).join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Top Portfolio Projects Record Blocks */}
                    {topProjects.length > 0 && (
                      <div className="mt-8 space-y-4 page-break">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-200 pb-1">
                          Core Portfolio Records (Top 3)
                        </h3>
                        <div className="space-y-6">
                          {topProjects.map((proj, idx) => (
                            <div key={proj.id || idx} className="space-y-2 border-b border-neutral-100 pb-4 last:border-b-0">
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-neutral-900 text-[15px]">{safeText(proj.title)}</span>
                                <span className="text-neutral-500 text-[13px]">{safeText(proj.duration) || 'Verified Portfolio Asset'}</span>
                              </div>
                              <p className="text-neutral-600 text-[14px] text-justify leading-relaxed">{safeText(proj.description)}</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-1.5 text-[14px] text-neutral-600">
                                {proj.technologies && (
                                  <div className="sm:col-span-2">
                                    <span className="text-neutral-900 font-medium text-[12px] block mb-0.5">System Technology Parameters:</span> 
                                    <span className="text-[14px] text-[#B82691] font-medium">{parseCommaTags(proj.technologies).join(', ')}</span>
                                  </div>
                                )}
                                {proj.problem && <div className="sm:col-span-2"><span className="text-neutral-900 font-medium text-[12px] block mb-0.5">Target Problem Statement:</span> {safeText(proj.problem)}</div>}
                                {proj.solution && <div className="sm:col-span-2"><span className="text-neutral-900 font-medium text-[12px] block mb-0.5">Engineered Execution Path:</span> {safeText(proj.solution)}</div>}
                                {proj.impact && <div className="sm:col-span-2"><span className="text-neutral-900 font-medium text-[12px] block mb-0.5">Measurable Outcome / Impact:</span> {safeText(proj.impact)}</div>}
                                {proj.lessons && <div className="sm:col-span-2"><span className="text-neutral-900 font-medium text-[12px] block mb-0.5">Iterative Lessons Extracted:</span> {safeText(proj.lessons)}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comprehensive Extracurricular Index logs */}
                    {activities.length > 0 && (
                      <div className="mt-8 space-y-4">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-200 pb-1">
                          Extracurricular & Leadership Matrices
                        </h3>
                        <div className="space-y-6">
                          {activities.map((act, idx) => (
                            <div key={act.id || idx} className="space-y-1.5 text-justify">
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-neutral-900 text-[15px]">{safeText(act.leadership_role || act.title) || 'Contributor'}</span>
                                <span className="text-neutral-500 text-[13px]">{[safeText(act.start_date), safeText(act.end_date)].filter(Boolean).join(' — ')}</span>
                              </div>
                              <div className="text-[13px] font-medium text-neutral-500 tracking-wide">
                                {act.organization && <span>{safeText(act.organization)}</span>}
                                {act.category && <span> • <span className="capitalize text-[#B82691]">{safeText(act.category)} Track</span></span>}
                                {(act.weekly_hours || act.weeks_per_year) && (
                                  <span> • {safeText(act.weekly_hours) || 0} hrs/wk, {safeText(act.weeks_per_year) || 0} wks/yr</span>
                                )}
                              </div>
                              {act.description && <p className="text-neutral-600 text-[14px] pt-0.5 leading-relaxed">{safeText(act.description)}</p>}
                              {act.achievements && <p className="text-neutral-500 text-[13px] italic pl-3.5 border-l border-neutral-200">Milestone Matrix: {safeText(act.achievements)}</p>}
                              {act.reflection && <p className="text-neutral-600 text-[13px] bg-neutral-50 p-2.5 rounded-sm">Structural Reflection: {safeText(act.reflection)}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* System Parameters Additional Info Profile */}
                    {(profile?.awards || profile?.interests || profile?.weaknesses) && (
                      <div className="mt-8 space-y-4 pt-2">
                        <h3 className="text-[11px] font-bold tracking-wider text-neutral-900 uppercase border-b border-neutral-200 pb-1">
                          Additional Information
                        </h3>
                        <div className="space-y-4 text-[14px]">
                          {profile?.awards && (
                            <div className="space-y-0.5">
                              <span className="font-medium text-neutral-900 text-[12px] block uppercase tracking-wider">Academic Distinctions & Awards</span>
                              <p className="text-neutral-600 text-justify leading-relaxed">{safeText(profile.awards)}</p>
                            </div>
                          )}
                          {profile?.interests && (
                            <div className="space-y-0.5">
                              <span className="font-medium text-neutral-900 text-[12px] block uppercase tracking-wider">Exploratory Parameters & Interests</span>
                              <p className="text-neutral-600 leading-relaxed">{parseCommaTags(profile.interests).join(', ')}</p>
                            </div>
                          )}
                          {profile?.weaknesses && (
                            <div className="space-y-0.5">
                              <span className="font-medium text-neutral-900 text-[12px] block uppercase tracking-wider">Identified Areas For Iteration / Development</span>
                              <p className="text-neutral-600 text-justify leading-relaxed">{parseCommaTags(profile.weaknesses).join(', ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}