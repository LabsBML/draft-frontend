import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, AlertCircle, X, ArrowRight
} from 'lucide-react';

const API_BASE_URL = 'https://draft-backend-0s8w.onrender.com';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cp_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// --- Custom Polished Reminders-Style Tag Input ---
function AppleTagInput({ value = '', onChange, isEditMode, placeholder }) {
  const [inputValue, setInputValue] = useState('');
  const tags = useMemo(() => {
    return value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !tags.includes(trimmed)) {
        const newTags = [...tags, trimmed];
        onChange(newTags.join(', '));
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    onChange(newTags.join(', '));
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center min-h-[38px] px-1">
      {tags.map((tag, idx) => (
        <span 
          key={idx} 
          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-[13px] font-normal bg-neutral-100 text-neutral-800 transition-all border border-neutral-200/40"
        >
          {tag}
          {isEditMode && (
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors focus:outline-none focus:ring-1 focus:ring-black"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </span>
      ))}
      {isEditMode && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : "Add next..."}
          className="flex-1 min-w-[140px] h-7 bg-transparent text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none border-b border-transparent focus:border-[#B82691] transition-colors px-1"
        />
      )}
      {!isEditMode && tags.length === 0 && (
        <span className="text-[14px] text-neutral-400 font-normal pl-1">Not added yet.</span>
      )}
    </div>
  );
}

// --- Loading State Reflection ---
function ProfileSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-12 pt-0 space-y-8 animate-pulse style-inter">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-1/3">
          <div className="h-8 bg-neutral-200 rounded-md" />
          <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
        </div>
        <div className="h-10 w-28 bg-neutral-200 rounded-md" />
      </div>
      <div className="h-24 bg-neutral-100 rounded-md" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-3">
              <div className="h-6 bg-neutral-200 rounded-md w-1/4" />
              <div className="h-20 bg-white border border-neutral-200 rounded-md" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-4 h-56 bg-white border border-neutral-200 rounded-md" />
      </div>
    </div>
  );
}

export default function Profile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Live Server Data Sync Mechanics
  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/dashboard`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Could not fetch dashboard metrics.');
      const payload = await response.json();
      return payload.data || payload;
    }
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/profile`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Could not fetch student record registry.');
      const payload = await response.json();
      return payload.data || payload;
    }
  });

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      graduation_year: null, school: '', grade: null, GPA: null, SAT: null, ACT: null,
      intended_major: '', dream_university: '', strengths: '', weaknesses: '', interests: '',
      coursework: '', aps: ''
    }
  });

  useEffect(() => {
    if (profileQuery.data) {
      reset(profileQuery.data);
    }
  }, [profileQuery.data, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year, 10) : null,
        school: formData.school || '',
        grade: formData.grade ? parseInt(formData.grade, 10) : null,
        GPA: formData.GPA ? parseFloat(formData.GPA) : null,
        SAT: formData.SAT ? parseInt(formData.SAT, 10) : null,
        ACT: formData.ACT ? parseInt(formData.ACT, 10) : null,
        intended_major: formData.intended_major || '',
        dream_university: formData.dream_university || '',
        strengths: formData.strengths || '',
        weaknesses: formData.weaknesses || '',
        interests: formData.interests || '',
        coursework: formData.coursework || '',
        aps: formData.aps || ''
      };

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Profile save failed.');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      triggerToast('Profile changes saved smoothly.', 'success');
      setIsEditMode(false);
    },
    onError: () => {
      triggerToast('We ran into an error saving your profile data.', 'error');
    }
  });

  const dashboard = useMemo(() => dashboardQuery.data || {}, [dashboardQuery.data]);
  const profile = useMemo(() => profileQuery.data || {}, [profileQuery.data]);
  const user = useMemo(() => dashboard.user || {}, [dashboard.user]);
  const completionValue = useMemo(() => dashboard.profile_completion ?? 0, [dashboard.profile_completion]);

  // Dynamic Focus Recommendation Engine
  const activeRecommendation = useMemo(() => {
    if (!profile.SAT && !profile.ACT) {
      return { text: "Add your SAT or ACT score.", field: "Academic Information" };
    }
    if (!profile.coursework) {
      return { text: "Complete your coursework profile layout.", field: "Academic Information" };
    }
    if (!profile.dream_university) {
      return { text: "Pinpoint your dream university destination.", field: "College Goals" };
    }
    return { text: "Add another personal activity update.", field: "Profile Snapshot" };
  }, [profile]);

  if (dashboardQuery.isLoading || profileQuery.isLoading) {
    return <ProfileSkeleton />;
  }

  if (dashboardQuery.isError || profileQuery.isError) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 style-inter">
        <div className="bg-white border border-neutral-200 rounded-md p-8 max-w-md w-full text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
            <AlertCircle className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-[17px] font-medium text-neutral-900">Something went wrong</h3>
            <p className="text-[13px] text-neutral-500 leading-relaxed">We couldn't securely load your student profile framework. Let's try reloading.</p>
          </div>
          <button 
            onClick={() => { dashboardQuery.refetch(); profileQuery.refetch(); }}
            className="w-full text-center px-4 py-2.5 text-[15px] font-medium text-white bg-[#B82691] hover:opacity-90 transition-opacity rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          >
            Try connection again
          </button>
        </div>
      </div>
    );
  }

  const handleCancelEdit = () => {
    reset(profile);
    setIsEditMode(false);
  };

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="bg-neutral-50 min-h-screen selection:bg-[#B82691]/10 antialiased style-inter">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .style-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important; }
      `}} />
      
      {/* Toast Alert Canvas */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center gap-2.5 text-[14px] font-normal"
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

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[1280px] mx-auto px-6 md:px-10 pb-12 pt-0 space-y-10">
        
        {/* --- Hero Section --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-0">
          <div className="space-y-1">
            <h1 className="text-[34px] font-semibold tracking-tight text-neutral-900 leading-tight">
              Profile
            </h1>
            <p className="text-[17px] text-neutral-500 font-normal max-w-2xl leading-relaxed">
              Everything here helps us personalize your projects, documents and college applications.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {!isEditMode ? (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="h-10 px-4 text-[14px] font-medium text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 rounded-md transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-1 focus:ring-black"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-2 focus:outline-none focus:ring-1 focus:ring-black rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="h-10 px-4 text-[14px] font-medium text-white bg-black hover:opacity-90 disabled:opacity-50 rounded-md transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- Vivid Pink Solid Color Profile Completion Card --- */}
        <div className="bg-[#B82691] text-white rounded-md p-5 space-y-4 shadow-[0_2px_8px_rgba(184,38,145,0.15)]">
          <div className="flex items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-white/75 block">Profile System</span>
              <p className="text-[14px] text-white/90 font-normal max-w-xl leading-normal">
                You're almost there. Complete your SAT score and coursework to unlock better document generation.
              </p>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end justify-center">
              <span className="text-[44px] font-bold tracking-tight leading-none">
                {completionValue}%
              </span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-white/75 mt-1 block">
                Completed
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/25 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionValue}%` }}
            />
          </div>
        </div>

        {/* --- Split Layout Channels --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Group: Personal Information */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Personal Information</h2>
                <p className="text-[15px] text-neutral-500">Basic details about you.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">Full Name</label>
                  <div className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-md text-[14px] font-normal text-neutral-400 flex items-center select-none">
                    {user.full_name ?? 'Sarah'}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">Email Address</label>
                  <div className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 rounded-md text-[14px] font-normal text-neutral-400 flex items-center select-none">
                    {user.email ?? 'sarah@draft.edu'}
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[15px] font-medium text-neutral-800">School</label>
                  <input
                    type="text"
                    disabled={!isEditMode}
                    {...register('school')}
                    placeholder="Mountain View High School"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">Grade</label>
                  <input
                    type="number"
                    disabled={!isEditMode}
                    {...register('grade')}
                    placeholder="11"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">Graduation Year</label>
                  <input
                    type="number"
                    disabled={!isEditMode}
                    {...register('graduation_year')}
                    placeholder="2027"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Group: Academic Information */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Academic Information</h2>
                <p className="text-[15px] text-neutral-500">Tell us about your studies.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!isEditMode}
                    {...register('GPA')}
                    placeholder="3.92"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">SAT</label>
                  <input
                    type="number"
                    disabled={!isEditMode}
                    {...register('SAT')}
                    placeholder="1520"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">ACT</label>
                  <input
                    type="number"
                    disabled={!isEditMode}
                    {...register('ACT')}
                    placeholder="34"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-[15px] font-medium text-neutral-800">Coursework</label>
                  {!isEditMode ? (
                    <div className="w-full min-h-[64px] p-3 bg-neutral-50 border border-neutral-200 rounded-md text-[14px] text-neutral-800 whitespace-pre-wrap leading-relaxed">
                      {profile.coursework || "No coursework added yet."}
                    </div>
                  ) : (
                    <textarea
                      rows={2}
                      {...register('coursework')}
                      placeholder="List your current advanced high school courses..."
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all resize-none leading-relaxed"
                    />
                  )}
                </div>
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-[15px] font-medium text-neutral-800">AP / IB / Honors</label>
                  {!isEditMode ? (
                    <div className="w-full min-h-[64px] p-3 bg-neutral-50 border border-neutral-200 rounded-md text-[14px] text-neutral-800 whitespace-pre-wrap leading-relaxed">
                      {profile.aps || "No coursework added yet."}
                    </div>
                  ) : (
                    <textarea
                      rows={2}
                      {...register('aps')}
                      placeholder="AP Calculus BC, AP Chemistry, IB English Literature HL..."
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all resize-none leading-relaxed"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Group: College Goals */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">College Goals</h2>
                <p className="text-[15px] text-neutral-500">Help us personalize recommendations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">Dream University</label>
                  <input
                    type="text"
                    disabled={!isEditMode}
                    {...register('dream_university')}
                    placeholder="Stanford University"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[15px] font-medium text-neutral-800">Intended Major</label>
                  <input
                    type="text"
                    disabled={!isEditMode}
                    {...register('intended_major')}
                    placeholder="Computer Science"
                    className="w-full h-10 px-3 bg-neutral-50 border border-neutral-200 disabled:text-neutral-400 rounded-md text-[14px] font-normal text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#B82691] focus:ring-1 focus:ring-[#B82691]/20 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Group: Interests */}
            <div className="space-y-3">
              <div className="space-y-0.5">
                <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Interests</h2>
                <p className="text-[15px] text-neutral-500">Add your interests.</p>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <Controller
                  name="interests"
                  control={control}
                  render={({ field }) => (
                    <AppleTagInput
                      value={field.value}
                      onChange={field.onChange}
                      isEditMode={isEditMode}
                      placeholder="Type interest and press Enter..."
                    />
                  )}
                />
              </div>
            </div>

            {/* Group: Strengths */}
            <div className="space-y-3">
              <div className="space-y-0.5">
                <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Strengths</h2>
                <p className="text-[15px] text-neutral-500">Help us understand your strengths.</p>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <Controller
                  name="strengths"
                  control={control}
                  render={({ field }) => (
                    <AppleTagInput
                      value={field.value}
                      onChange={field.onChange}
                      isEditMode={isEditMode}
                      placeholder="Type strength and press Enter..."
                    />
                  )}
                />
              </div>
            </div>

            {/* Group: Areas to Improve */}
            <div className="space-y-3">
              <div className="space-y-0.5">
                <h2 className="text-[24px] font-semibold tracking-tight text-neutral-900">Areas to Improve</h2>
                <p className="text-[15px] text-neutral-500">These help us suggest projects and activities that strengthen your application.</p>
              </div>
              <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <Controller
                  name="weaknesses"
                  control={control}
                  render={({ field }) => (
                    <AppleTagInput
                      value={field.value}
                      onChange={field.onChange}
                      isEditMode={isEditMode}
                      placeholder="Type focus area and press Enter..."
                    />
                  )}
                />
              </div>
            </div>

          </div>

          {/* --- Right Sidebar Column Panel Architecture --- */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            
            {/* Snapshot Block Container */}
            <div className="bg-white border border-neutral-200 rounded-md p-5 shadow-[0_1px_4px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-[15px] font-semibold text-neutral-900">Application Snapshot</h3>
              <div className="space-y-3">
                {[
                  { name: "Projects", completed: (dashboard.projects_count > 0), path: "/" },
                  { name: "Activities", completed: (dashboard.activities_count > 0), path: "/" },
                  { name: "Documents", completed: (!!dashboard.documents), path: "/" },
                  { name: "Profile", completed: (completionValue === 100), path: "/profile" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="flex items-center justify-between group cursor-pointer py-0.5"
                  >
                    <span className="text-[15px] text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      {item.name}
                    </span>
                    <div className="flex items-center justify-center">
                      {item.completed ? (
                        <div className="w-4.5 h-4.5 rounded-full bg-emerald-500 flex items-center justify-center p-1">
                          <Check className="w-3 h-3 text-white stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-neutral-300 mr-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Action Suggestion Core Layout */}
            <div className="bg-white border border-neutral-200 rounded-md p-5 shadow-[0_1px_4px_rgba(0,0,0,0.01)] space-y-3.5">
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-semibold text-neutral-900">Next Step</h3>
                <span className="text-[13px] text-[#B82691] font-medium block">
                  Optimizing {activeRecommendation.field}
                </span>
              </div>
              <p className="text-[15px] text-neutral-600 leading-normal font-normal">
                {activeRecommendation.text}
              </p>
              <button 
                type="button"
                onClick={() => {
                  setIsEditMode(true);
                  window.scrollTo({ top: 160, behavior: 'smooth' });
                }}
                className="w-full h-10 px-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md flex items-center justify-between text-[14px] font-medium text-neutral-800 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-1 focus:ring-black"
              >
                <span>Update metrics</span>
                <ArrowRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

          </div>

        </div>

      </form>
    </div>
  );
}