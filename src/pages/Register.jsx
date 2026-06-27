import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import logo from '../assets/logo.svg';

const registerSchema = zod.object({
  full_name: zod.string().min(1, 'Full signature declaration requires explicit identification.'),
  email: zod.string().min(1, 'Target configuration registration email required.').email('Provide a structurally accurate email address.'),
  password: zod.string().min(6, 'Security context password requirements mandate 6 standard characters minimum.'),
  confirm_password: zod.string().min(1, 'Confirmation string synchronization vector required.'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Verification sequence mismatch. Cryptographic keys must align.",
  path: ["confirm_password"],
});

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    try {
      const response = await apiClient.post('/register', {
        full_name: data.full_name,
        email: data.email,
        password: data.password
      });

      if (response.success && response.data) {
        const authResponse = await apiClient.post('/login', {
          email: data.email,
          password: data.password
        });
        
        if (authResponse.success && authResponse.data) {
          login(authResponse.data.access_token, authResponse.data.user_id);
          navigate('/onboarding');
        }
      } else {
        setServerError(response.message || 'Registration rejected by backend authority rules.');
      }
    } catch (err) {
      setServerError(err.message || 'Registration framework synchronization network failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-4 overflow-hidden relative select-none"
    >
      {/* 20% Opacity Premium Background Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Ultra-Compact Wide Screen Card Structure */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[560px] bg-white border border-neutral-200/60 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.02)] p-6 sm:p-8 flex flex-col relative z-10"
      >
        {/* Balanced Micro Header Row */}
        <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Draft Logo" className="w-6 h-6 object-contain" />
            <span className="text-[20px] font-bold tracking-[-0.04em] text-[#111111]">Draft</span>
          </div>
          <div className="text-right">
            <h2 className="text-[16px] font-semibold text-[#111111] tracking-tight">Create your account</h2>
            <p className="text-[12px] text-neutral-400">Start building your application</p>
          </div>
        </div>

        {/* Global Server Errors Notification Block */}
        {serverError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-2.5 bg-red-50/60 border border-red-100 rounded-[10px] flex items-start gap-2 text-[12px] text-red-600 font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.9} />
            <span>{serverError}</span>
          </motion.div>
        )}

        {/* High Efficiency 2-Column Form Layout Workflow */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
            
            {/* Column 1: Full Name */}
            <div className="space-y-1">
              <label className="block text-[13px] font-medium text-[#111111]">Full Name</label>
              <Input 
                type="text" 
                placeholder="Atharv Malve"
                autoFocus
                autoComplete="name"
                className="w-full h-[46px] px-3.5 rounded-[12px] border border-neutral-200 text-[14px] placeholder-neutral-400 bg-transparent text-[#111111] focus:border-[#111111] focus:ring-0 transition-colors duration-150"
                {...register('full_name')}
              />
              {errors.full_name?.message && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-[12px] text-red-600 mt-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={1.9} />
                  Signature mismatch
                </motion.span>
              )}
            </div>

            {/* Column 2: Email Address */}
            <div className="space-y-1">
              <label className="block text-[13px] font-medium text-[#111111]">Email Address</label>
              <Input 
                type="email" 
                placeholder="name@domain.com"
                autoComplete="email"
                className="w-full h-[46px] px-3.5 rounded-[12px] border border-neutral-200 text-[14px] placeholder-neutral-400 bg-transparent text-[#111111] focus:border-[#111111] focus:ring-0 transition-colors duration-150"
                {...register('email')}
              />
              {errors.email?.message && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-[12px] text-red-600 mt-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={1.9} />
                  Invalid email address
                </motion.span>
              )}
            </div>

            {/* Column 1: Password */}
            <div className="space-y-1">
              <label className="block text-[13px] font-medium text-[#111111]">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-[46px] px-3.5 rounded-[12px] border border-neutral-200 text-[14px] placeholder-neutral-400 bg-transparent text-[#111111] focus:border-[#111111] focus:ring-0 transition-colors duration-150"
                {...register('password')}
              />
              {errors.password?.message && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-[12px] text-red-600 mt-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={1.9} />
                  Minimum 6 characters
                </motion.span>
              )}
            </div>

            {/* Column 2: Confirm Password */}
            <div className="space-y-1">
              <label className="block text-[13px] font-medium text-[#111111]">Confirm Password</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full h-[46px] px-3.5 rounded-[12px] border border-neutral-200 text-[14px] placeholder-neutral-400 bg-transparent text-[#111111] focus:border-[#111111] focus:ring-0 transition-colors duration-150"
                {...register('confirm_password')}
              />
              {errors.confirm_password?.message && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-[12px] text-red-600 mt-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={1.9} />
                  Keys do not align
                </motion.span>
              )}
            </div>

          </div>

          {/* Minimal Terms Agreement Segment */}
          <div className="pt-1 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                required 
                type="checkbox" 
                className="w-3.5 h-3.5 rounded border-neutral-200 text-[#111111] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
              />
              <span className="text-[12px] text-neutral-500 font-normal">
                I agree to the <a href="#terms" className="text-[#111111] font-medium hover:underline">Terms</a> and <a href="#privacy" className="text-[#111111] font-medium hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Core Action Trigger Component */}
          <Button 
            type="submit" 
            isLoading={loading}
            className="w-full h-[48px] rounded-[12px] bg-[#111111] hover:bg-[#222222] active:bg-[#000000] text-white text-[14px] font-medium transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        {/* Flat Interface Redirection Navigation Footer Anchor */}
        <p className="text-center text-[13px] text-neutral-500 font-normal mt-5 pt-3 border-t border-neutral-100">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-[#111111] font-medium hover:underline transition-all duration-150 ml-0.5"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}