import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Folder, 
  FileText, 
  Rocket, 
  Medal, 
  User, 
  AlertCircle
} from 'lucide-react';
import apiClient from '../services/api'; 

// --- Helper Functions ---
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

// --- Sub-Components ---

function DashboardHero({ user }) {
  const firstName = user?.full_name?.split(' ')[0] || 'Sarah';
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const timeBased = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    
    const options = [
      timeBased,
      'Welcome back',
      'Good to see you again',
      'Great to see you',
      'Hello'
    ];
    
    return options[Math.floor(Math.random() * options.length)];
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-1 pt-4"
    >
      <h1 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight">
        {greeting}, {firstName}.
      </h1>
      <p className="text-[17px] text-neutral-500 font-normal max-w-2xl leading-relaxed">
        Every project, activity and essay you add helps strengthen your college application. You're building your application one step at a time.
      </p>
    </motion.div>
  );
}

function ProgressOverview({ profileCompletion, projectsCount, activitiesCount }) {
  const navigate = useNavigate();

  const items = [
    {
      title: "Profile",
      subtitle: `${profileCompletion ?? 0}% complete`,
      icon: <User className="w-5 h-5 text-neutral-600 stroke-[1.5]" />,
      path: "/profile"
    },
    {
      title: "Projects",
      subtitle: `${projectsCount ?? 0} added`,
      icon: <Folder className="w-5 h-5 text-neutral-600 stroke-[1.5]" />,
      path: "/projects"
    },
    {
      title: "Activities",
      subtitle: `${activitiesCount ?? 0} completed`,
      icon: <Medal className="w-5 h-5 text-neutral-600 stroke-[1.5]" />,
      path: "/activities"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {items.map((item, index) => (
        <div 
          key={index} 
          onClick={() => navigate(item.path)}
          className="bg-white border border-neutral-200 rounded-md p-5 flex items-center gap-4 cursor-pointer hover:bg-neutral-50 transition-colors duration-200"
        >
          <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-neutral-50 border border-neutral-200/60 rounded-md">
            {item.icon}
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[15px] font-medium text-neutral-900">{item.title}</h4>
            <p className="text-[13px] text-[#B82691] font-medium">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function ApplicationBuilder({ projectsCount, activitiesCount, profileCompletion }) {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Projects",
      description: "Build things that show your skills.",
      statusText: `${projectsCount ?? 0} projects added.`,
      icon: <Rocket className="w-5 h-5 text-[#B82691] stroke-[1.5]" />,
      actionText: "Continue",
      path: "/projects"
    },
    {
      title: "Activities",
      description: "Show leadership and involvement outside class.",
      statusText: `${activitiesCount ?? 0} activities added.`,
      icon: <Medal className="w-5 h-5 text-[#B82691] stroke-[1.5]" />,
      actionText: "Continue",
      path: "/activities"
    },
    {
      title: "Profile",
      description: "Complete your academic information.",
      statusText: profileCompletion === 100 ? "Profile finished." : "Missing information.",
      icon: <User className="w-5 h-5 text-[#B82691] stroke-[1.5]" />,
      actionText: profileCompletion === 100 ? "Review" : "Finish",
      path: "/profile"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-[24px] font-medium tracking-tight text-neutral-900">Application Builder</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(card.path)}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white border border-neutral-200/80 rounded-md p-5 flex flex-col justify-between min-h-[200px] cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-neutral-50 border border-neutral-200/60 rounded-md flex items-center justify-center">
                {card.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-[20px] font-medium tracking-tight text-neutral-900">{card.title}</h3>
                <p className="text-[15px] text-neutral-500 font-normal leading-normal">{card.description}</p>
              </div>
            </div>
            
            <div className="pt-3 flex items-center justify-between border-t border-neutral-100 mt-3">
              <span className="text-[13px] font-normal text-neutral-400">{card.statusText}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.path);
                }}
                className="text-[14px] font-medium text-[#B82691] hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                {card.actionText} <span className="text-[12px]">→</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DocumentStatus({ documentsData }) {
  const navigate = useNavigate();
  if (!documentsData) return null;

  const docs = [
    { key: 'resume', name: 'Resume', defaultStatus: 'Fresh', fallbackUpdate: 'Updated today' },
    { key: 'common_app', name: 'Common App Framework', defaultStatus: 'Stale', fallbackUpdate: 'Needs sync' },
    { key: 'essays', name: 'Essays', defaultStatus: 'Fresh', fallbackUpdate: 'Updated today' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-medium tracking-tight text-neutral-900">Documents</h2>
        <button 
          onClick={() => navigate('/documents')}
          className="px-4 h-10 text-[14px] font-medium text-white bg-[#B82691] hover:opacity-90 transition-opacity rounded-md shadow-sm cursor-pointer"
        >
          Generate Documents
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {docs.map((doc, idx) => {
          const systemDoc = documentsData[doc.key];
          const isStale = systemDoc?.status ? systemDoc.status === 'stale' : doc.defaultStatus === 'Stale';
          const updateLabel = systemDoc?.last_updated ? `Updated ${formatDate(systemDoc.last_updated)}` : doc.fallbackUpdate;

          return (
            <div 
              key={idx}
              onClick={() => navigate('/documents')}
              className="bg-white border border-neutral-200/80 rounded-md p-5 flex flex-col justify-between min-h-[150px] cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <FileText className="w-4 h-4 text-neutral-400 stroke-[1.5]" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isStale ? 'bg-[#B82691]' : 'bg-emerald-500'}`} />
                    <span className="text-[13px] text-neutral-500 font-normal">
                      {isStale ? 'Needs Update' : 'Updated Today'}
                    </span>
                  </div>
                </div>
                <h3 className="text-[20px] font-medium text-neutral-900 pt-1 tracking-tight">{doc.name}</h3>
                <p className="text-[13px] text-neutral-400 font-normal">{updateLabel}</p>
              </div>

              <div className="flex items-center gap-4 pt-3 mt-1 border-t border-neutral-100">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/documents');
                  }}
                  className="text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Open
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/documents');
                  }}
                  className="text-[13px] font-medium text-[#B82691] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main Container Component ---

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiClient.get("/dashboard")
  });

  const dashboard = useMemo(() => {
    if (!data) return null;
    return data.data?.success !== undefined ? data.data.data : data.data;
  }, [data]);

  if (isError || (data && dashboard?.success === false)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 select-none style-inter">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .style-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        `}} />
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 rounded-md p-6 max-w-md w-full text-center space-y-5 shadow-sm"
        >
          <div className="w-10 h-10 bg-neutral-50 border border-neutral-100 rounded-md flex items-center justify-center mx-auto text-neutral-400">
            <AlertCircle className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[15px] font-medium text-neutral-900">Unable to load dashboard</h3>
            <p className="text-[13px] text-neutral-500 leading-relaxed font-normal">The application dashboard layer experienced a loading delay. Please retry sync.</p>
          </div>
          <button 
            onClick={() => refetch()}
            className="w-full text-center px-4 py-2.5 text-[14px] font-medium text-white bg-[#B82691] hover:opacity-90 transition-opacity rounded-md cursor-pointer"
          >
            Try again
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-12 pt-0 space-y-12 bg-neutral-50 min-h-screen select-none style-inter">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .style-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
        `}} />
        <div className="space-y-2 pt-4">
          <div className="h-10 bg-neutral-200 rounded-md w-1/3 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded-md w-1/2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white border border-neutral-200 rounded-md animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-52 bg-white border border-neutral-200 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen selection:bg-[#B82691]/10 antialiased style-inter pb-12">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .style-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
      `}} />
      
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-0 space-y-10">
        
        {/* Identity Context */}
        <DashboardHero user={dashboard?.user} />

        {/* Isolated Metric Summary Matrix */}
        <ProgressOverview 
          profileCompletion={dashboard?.profile_completion}
          projectsCount={dashboard?.projects_count}
          activitiesCount={dashboard?.activities_count}
        />

        {/* Workspace Operations Canvas */}
        <ApplicationBuilder 
          projectsCount={dashboard?.projects_count}
          activitiesCount={dashboard?.activities_count}
          profileCompletion={dashboard?.profile_completion}
        />

        {/* Documentation Stream */}
        <DocumentStatus documentsData={dashboard?.documents} />

      </div>
    </div>
  );
}