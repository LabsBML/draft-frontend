import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValueEvent} from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Check,
  Folder,
  Sparkles,
  FileText,
  Layers,
  Activity,
  Bell,
  Clock,
  Image,
  ImageIcon,
  Award,
  BookOpen,
  Compass,
  GraduationCap,
  Sliders,
  User
} from "lucide-react";

import Logo from "../assets/logo.svg";

// --- Design System Configs & Tokens ---

const springFast = { type: "spring", stiffness: 450, damping: 32 };
const springDefault = { type: "spring", stiffness: 120, damping: 22 };
const springSlow = { type: "spring", stiffness: 80, damping: 24 };

const shadowSmooth = "shadow-[0_8px_32px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)]";
const shadowPremium = "shadow-[0_32px_64px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.01)]";

// --- Custom Procedural Brand Watermark Component ---
const BrandWatermark = ({ className = "opacity-5" }) => (
  <svg viewBox="0 0 100 100" className={`absolute pointer-events-none select-none ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20H50C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80H20V20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 50H50C58.2843 50 65 56.7157 65 65C65 73.2843 58.2843 80 50 80H20V50Z" fill="currentColor"/>
  </svg>
);

// --- Master Noise Engine ---
const GlobalNoiseOverlay = () => {
  const createSeededRandom = (seed) => {
    let s = seed;
    return () => {
      const x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };
  };

  const generateGrit = (count, color, maxOpacity, canvasSize, initialSeed) => {
    const rand = createSeededRandom(initialSeed);
    let nodes = "";
    for (let i = 0; i < count; i++) {
      const x = (rand() * canvasSize).toFixed(1);
      const y = (rand() * canvasSize).toFixed(1);
      const opacity = (rand() * maxOpacity + 0.08).toFixed(3); // Increased opacity slightly for richness
      const radius = (rand() * 0.7 + 0.3).toFixed(1);
      nodes += `%3Ccircle cx='${x}' cy='${y}' r='${radius}' fill='${color}' opacity='${opacity}'/%3E`;
    }
    return `data:image/svg+xml,%3Csvg width='${canvasSize}' height='${canvasSize}' viewBox='0 0 ${canvasSize} ${canvasSize}' xmlns='http://www.w3.org/2000/svg'%3E${nodes}%3C/svg%3E`;
  };

  const heavyDarkGrit = generateGrit(3500, '%23000000', 0.28, 140, 42);
  const intensePinkGrit = generateGrit(1800, '%23B82691', 0.42, 180, 99);
  const microLightGrit = generateGrit(2800, '%23ffffff', 0.22, 110, 77);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99] opacity-[0.18] mix-blend-normal font-inter"
      style={{
        backgroundImage: `
          url("${heavyDarkGrit}"),
          url("${intensePinkGrit}"),
          url("${microLightGrit}"),
          radial-gradient(circle at 15% 25%, rgba(0, 0, 0, 0.02), transparent 70%),
          radial-gradient(circle at 85% 15%, rgba(184, 38, 145, 0.05), transparent 60%)
        `,
        backgroundSize: "83px 83px, 149px 149px, 71px 71px, 100% 100%, 100% 100%",
        backgroundRepeat: "repeat, repeat, repeat, no-repeat, no-repeat",
      }}
    />
  );
};

// --- Custom Spring Interactive Button Component ---
const SpringButton = ({ primary, children, className = "", to, ...props }) => {
  const baseClasses = `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-[550] tracking-tight transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B82691]/40 font-inter ${
    primary
      ? "bg-black text-white hover:bg-zinc-900 border border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
      : "bg-white text-zinc-800 border border-zinc-200/80 hover:bg-zinc-50"
  } ${className}`;

  const content = (
    <motion.span
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={springFast}
      className="flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (to) {
    return <Link to={to} className={baseClasses}>{content}</Link>;
  }
  return <button {...props} className={baseClasses}>{content}</button>;
};

// ==========================================
// SECTION COMPONENTS
// ==========================================

// --- 1. HERO DASHBOARD SNIPPET ---
const HeroDashboardSnippet = () => {
  const containerRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [metricCount, setMetricCount] = useState(184);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetricCount(prev => (prev < 190 ? prev + 1 : 184));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || window.innerWidth < 1024) return;
    const box = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    setRotateX(-y * 5);
    setRotateY(x * 5);
  };

  return (
    <div className="relative w-full max-w-[580px] mx-auto lg:mr-0 group">
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#B82691]/10 to-transparent blur-[40px] opacity-40 rounded-full" />
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
        style={{ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: "preserve-3d" }}
        className={`relative w-full bg-white border border-zinc-200/80 rounded-[24px] p-5 md:p-6 flex flex-col space-y-4 transition-all duration-500 ease-out ${shadowPremium}`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ y: [-1, 1, -1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[13px] font-bold text-zinc-700"
            >
              AP
            </motion.div>
            <div>
              <h4 className="text-[14px] font-[600] text-zinc-900 tracking-tight">Alexei Price</h4>
              <p className="text-[12px] text-zinc-400 font-normal">Mountain View High • Grade 11</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative flex">
              <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-70" />
            </span>
            <span className="text-[11px] font-medium text-zinc-500 bg-zinc-50 border border-zinc-200/60 px-2.5 py-1 rounded-md">Live Sync</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5 bg-zinc-50/50 border border-zinc-200/60 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Universities Matrix</span>
              <div className="mt-2.5 space-y-1.5">
                {["Stanford", "MIT", "Caltech"].map((uni, i) => (
                  <div key={i} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-zinc-200/40 text-[12px] font-medium text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                    <span>{uni}</span>
                    <span className="text-[9px] text-[#B82691] font-semibold bg-pink-50 px-1.5 py-0.5 rounded">Target</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-medium text-zinc-400">
              <span>Core Alignment</span>
              <span className="font-semibold text-zinc-900">96%</span>
            </div>
          </div>

          <div className="sm:col-span-7 flex flex-col space-y-3">
            <motion.div 
              whileHover={{ y: -2 }}
              transition={springFast}
              className={`bg-white border border-zinc-200/60 rounded-xl p-4 relative overflow-hidden ${shadowSmooth}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active Stream</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
              </div>
              <h5 className="text-[13px] font-[600] text-zinc-900 tracking-tight">Disaster Response Drone Network</h5>
              <p className="text-[12px] text-zinc-500 mt-0.5 line-clamp-1">Autonomous path matrix generated with PyTorch.</p>
            </motion.div>

            <div className="bg-white border border-zinc-200/60 rounded-xl p-4 flex-1 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Extracurricular Log</span>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-zinc-700">FIRST Robotics Captain</span>
                  <motion.span key={metricCount} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 font-mono font-medium">{metricCount} hrs</motion.span>
                </div>
                <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${(metricCount / 220) * 100}%` }} className="h-full bg-[#B82691]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Spring physics definitions for crisp, high-end movement


// --- 2. CINEMATIC PROBLEM SECTION (SCROLL-INTERACTIVE) ---
const ProblemSection = () => {
  const [maxStep, setMaxStep] = useState(0);
  // Track layout modes: 'absolute-top' (before), 'fixed' (during scroll), 'absolute-bottom' (after)
  const [stickyMode, setStickyMode] = useState('absolute-top'); 
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const narrative = [
    { text: "Your science fair project...", type: "drive" },
    { text: "Your robotics photos...", type: "photos" },
    { text: "Your credentials & certificates...", type: "cert" },
    { text: "Your early research essays...", type: "docs" }
  ];

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 1. Determine active step over scroll tracks
    let currentStep = 0;
    if (latest < 0.22) {
      currentStep = 0;
    } else if (latest >= 0.22 && latest < 0.44) {
      currentStep = 1;
    } else if (latest >= 0.44 && latest < 0.66) {
      currentStep = 2;
    } else if (latest >= 0.66 && latest < 0.88) {
      currentStep = 3;
    } else {
      currentStep = 4; // Final locked state
    }

    // Lock forward progression only (no reverse animation when scrolling up)
    if (currentStep > maxStep) {
      setMaxStep(currentStep);
    }

    // 2. VIEWPORT PINNING CONTROL (Bypasses any parent CSS sticky bugs)
    if (latest <= 0) {
      setStickyMode('absolute-top');
    } else if (latest > 0 && latest < 1) {
      setStickyMode('fixed');
    } else {
      setStickyMode('absolute-bottom');
    }
  });

  // Helper to generate coordinates based on current scroll segment status
  const getPositionStyles = () => {
    if (stickyMode === 'absolute-top') return "absolute top-0 left-0 h-screen w-full";
    if (stickyMode === 'absolute-bottom') return "absolute bottom-0 left-0 h-screen w-full";
    return "fixed top-0 left-0 h-screen w-full"; // Locks to window viewport
  };

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[#09090B] text-white w-full">
      
      {/* This layer dynamically pins itself directly to the window viewport coordinates.
        pointer-events-none prevents the fixed overlay from stealing clicks from adjacent layout elements.
      */}
      <div className={`${getPositionStyles()} flex items-center justify-center px-6 overflow-hidden pointer-events-none`}>
        <div className="max-w-4xl mx-auto text-center relative w-full flex items-center justify-center min-h-[400px] pointer-events-auto">
          
          <AnimatePresence mode="popLayout">
            {maxStep < narrative.length ? (
              <motion.div
                key={maxStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={springDefault}
                className="w-full flex flex-col items-center justify-center space-y-12 absolute left-0 right-0 mx-auto"
              >
                <h3 className="text-2xl md:text-4xl font-normal tracking-tight text-zinc-400 max-w-xl font-sans">
                  {narrative[maxStep].text}
                </h3>
                
                <div className="relative w-full max-w-[280px] aspect-video flex items-center justify-center">
                  {narrative[maxStep].type === "drive" && (
                    <motion.div 
                      animate={{ x: [-15, 15], y: [-4, 4] }} 
                      transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} 
                      className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-3 shadow-2xl"
                    >
                      <Folder className="w-5 h-5 text-amber-500" />
                      <span className="text-[13px] font-medium text-zinc-300 select-none">Intel_ISEF_2025.zip</span>
                    </motion.div>
                  )}
                  
                  {narrative[maxStep].type === "photos" && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ rotate: i * 4 - 8, x: i * 14 - 28, y: [-2, 2, -2] }}
                          transition={{ duration: 3, delay: i * 0.15, repeat: Infinity }}
                          className="absolute w-24 aspect-square bg-zinc-800 border border-zinc-700 rounded-lg p-1.5 shadow-xl flex flex-col justify-between"
                        >
                          <div className="w-full h-[75%] bg-zinc-900 rounded-md flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-zinc-600" />
                          </div>
                          <div className="w-2/3 h-1 bg-zinc-600 rounded-xs self-start" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {narrative[maxStep].type === "cert" && (
                    <motion.div 
                      animate={{ scale: [0.97, 1.03, 0.97] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-center shadow-xl"
                    >
                      <Award className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">State Directorship Certificate</p>
                    </motion.div>
                  )}
                  
                  {narrative[maxStep].type === "docs" && (
                    <motion.div 
                      animate={{ y: [4, -4, 4] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                      className="w-32 aspect-[1/1.3] bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 space-y-2 text-left shadow-2xl"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <div className="w-2/3 h-1.5 bg-zinc-700 rounded" />
                      <div className="space-y-1 pt-1">
                        <div className="w-full h-1 bg-zinc-800 rounded" />
                        <div className="w-5/6 h-1 bg-zinc-800 rounded" />
                        <div className="w-full h-1 bg-zinc-800 rounded" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* THE LOCKED FINAL FRAME */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6 md:space-y-8 absolute left-0 right-0 mx-auto"
              >
                <motion.p 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, ...springSlow }}
                  className="text-xl md:text-2xl text-zinc-400 font-normal tracking-tight font-sans"
                >
                  Your college application isn't missing achievements.
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, ...springSlow }}
                  className="text-[36px] sm:text-[48px] md:text-[64px] font-[600] tracking-tight leading-none text-white text-balance font-display"
                >
                  It's missing <span className="text-[#B82691]">memory.</span>
                </motion.h2>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </section>
  );
};


// --- 3. VERTICAL MEMORY TIMELINE SECTION ---
const MemorySection = () => {
  const memoryNodes = [
    { title: "Complex Narrative Projects", desc: "Every functional repository, codebase iteration, and sandbox build cataloged seamlessly.", icon: Folder },
    { title: "Extracurricular Activities", desc: "Dynamic time auditing logs and verifiable responsibility metrics compiled dynamically.", icon: Activity },
    { title: "Inspirational Honors & Awards", desc: "Institutional certifications, regional trophies, and state citations preserved securely.", icon: Award },
    { title: "Pivotal Leadership Roles", desc: "Verified governance trails, club oversight matrices, and functional directorship footprints.", icon: User },
    { title: "Academic Research Modules", desc: "In-depth research publications, abstract frameworks, and technical papers consolidated.", icon: BookOpen },
    { title: "Personal Statement Essays", desc: "Comprehensive iteration mapping tracking thematic development and essay refinement.", icon: FileText }
  ];

  return (
    <section className="relative py-24 bg-white text-zinc-900 px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-zinc-100/40 pointer-events-none">
        <BrandWatermark className="w-[600px] md:w-[900px] opacity-[0.02]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center space-y-3 mb-20">
          <span className="text-[12px] font-bold tracking-widest text-[#B82691] uppercase">Unified Archive</span>
          <h2 className="text-3xl md:text-5xl font-[550] tracking-tight text-zinc-900">Construct your historical foundation.</h2>
        </div>

        <div className="relative border-l border-zinc-200/80 ml-4 md:ml-32 space-y-12">
          {memoryNodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ ...springDefault, delay: i * 0.05 }}
                className="relative pl-8 group"
              >
                <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-white border border-zinc-300 group-hover:border-[#B82691] flex items-center justify-center transition-colors duration-300">
                  <div className="w-2 h-2 rounded-full bg-zinc-200 group-hover:bg-[#B82691] transition-colors duration-300" />
                </div>
                
                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={springFast}
                  className={`bg-white border border-zinc-200/60 rounded-2xl p-5 md:p-6 transition-all duration-300 ${shadowSmooth} hover:border-zinc-300/80`}
                >
                  <div className="flex items-center gap-3 mb-2 text-[#B82691]">
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-3" />
                    <h4 className="text-[16px] font-[600] tracking-tight text-zinc-900">{node.title}</h4>
                  </div>
                  <p className="text-[13px] md:text-[14px] text-zinc-500 font-normal leading-relaxed">{node.desc}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- 4. CONNECTED WORKSPACE (VISUAL ARCHITECTURE) ---
const ConnectedWorkspace = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [pulse, setPulse] = useState(false);

  // Fallback if shadowSmooth isn't defined in your external styles scope
  const shadowSmooth = "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]";

  const triggerFlow = () => {
    if (pulse) return; // Prevent animation overlapping if clicked multiple times
    
    setPulse(true);
    setActiveStep(1); // Instantly trigger the first line sequence on click

    // Sequentially step through each downstream card connection
    setTimeout(() => setActiveStep(2), 1000);
    setTimeout(() => setActiveStep(3), 2000);
    setTimeout(() => setActiveStep(4), 3000);
    
    // Complete the loop and reset after the last line finishes drawing
    setTimeout(() => {
      setPulse(false);
      setActiveStep(0);
    }, 4500);
  };

  return (
    <section className="relative py-24 bg-zinc-50/50 border-y border-zinc-200/50 text-zinc-900 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-3 mb-16">
          <span className="text-[12px] font-bold tracking-widest text-[#B82691] uppercase">Synchronized Schema</span>
          <h2 className="text-3xl md:text-4xl font-[550] tracking-tight">The compilation architecture.</h2>
          <p className="text-[14px] text-zinc-500">Click the core project engine card below to observe automated data propagation lines mapping updates across all institutional documents instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-center">
          {/* Core Trigger Card */}
          <div className="md:col-span-4 flex justify-center">
            <motion.div
              onClick={triggerFlow}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full max-w-[280px] bg-white border-2 ${pulse ? "border-[#B82691]" : "border-zinc-200/80"} rounded-2xl p-5 cursor-pointer transition-all duration-300 text-left ${shadowSmooth}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-[#B82691]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-white bg-[#B82691] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Input Engine</span>
              </div>
              <h4 className="text-[14px] font-[600] text-zinc-900 tracking-tight">Add Robotics Captain role</h4>
              <p className="text-[12px] text-zinc-400 mt-1 font-normal">Triggers comprehensive downstream asset generation.</p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-[550] text-[#B82691]">
                <span>Click to compile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </div>

          {/* Connected Framework Path Traces */}
          <div className="md:col-span-3 hidden md:flex flex-col items-center justify-center h-full relative">
            <svg className="w-full h-48" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
              {/* Static Gray Background Reference Lines */}
              <path d="M 0 50 L 100 10 M 0 50 L 100 36 M 0 50 L 100 64 M 0 50 L 100 90" stroke="#E4E4E7" strokeWidth="1.5" />
              
              {/* Distinct Left-To-Right Animated Signal Tracks */}
              {pulse && (
                <>
                  {activeStep >= 1 && (
                    <motion.path
                      d="M 0 50 L 100 10"
                      stroke="#B82691"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                  {activeStep >= 2 && (
                    <motion.path
                      d="M 0 50 L 100 36"
                      stroke="#B82691"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                  {activeStep >= 3 && (
                    <motion.path
                      d="M 0 50 L 100 64"
                      stroke="#B82691"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                  {activeStep >= 4 && (
                    <motion.path
                      d="M 0 50 L 100 90"
                      stroke="#B82691"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                </>
              )}
            </svg>
          </div>

          {/* Structural Downstream Recipients */}
          <div className="md:col-span-5 space-y-3 w-full max-w-[360px] mx-auto md:mr-0">
            {[
              { label: "Resume Matrix Layer", act: "Added Lead Robotics Captain", step: 1 },
              { label: "Common App Data Store", act: "Auto-filled Activities Row [04]", step: 2 },
              { label: "Institutional Personal Essays", act: "Contextualized paragraph [02]", step: 3 },
              { label: "Verification Compilation Package", act: "Generated cryptographic artifact", step: 4 }
            ].map((node, index) => (
              <motion.div
                key={index}
                animate={{ 
                  scale: activeStep === node.step ? 1.02 : 1,
                  borderColor: activeStep === node.step ? "#B82691" : "rgba(228,228,231,0.8)"
                }}
                className={`bg-white border rounded-xl p-3.5 flex items-center justify-between text-left transition-all duration-300 ${shadowSmooth}`}
              >
                <div>
                  <h5 className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider">{node.label}</h5>
                  <p className="text-[13px] font-medium text-zinc-800 mt-0.5">{node.act}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-300 ${activeStep >= node.step && pulse ? "bg-emerald-500 border-transparent text-white" : "border-zinc-200 text-transparent"}`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 5. HORIZONTAL TIMELINE ---
const HorizontalTimeline = () => {
  const steps = ["Grade 9", "Explore", "Projects", "Activities", "Research", "Leadership", "Awards", "Applications", "University"];
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="relative py-24 bg-white text-zinc-900 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-3 mb-16">
          <span className="text-[12px] font-bold tracking-widest text-[#B82691] uppercase">Linear Continuum</span>
          <h2 className="text-3xl md:text-4xl font-[550] tracking-tight">Four historical years, structured.</h2>
        </div>

        {/* Swipe-friendly scroll container for small viewports, true fixed grid layout for desktop scaling */}
        <div className="relative w-full overflow-x-auto pb-6 scrollbar-none">
          <div className="min-w-[840px] relative py-8 flex justify-between items-center px-4">
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-zinc-200 pointer-events-none" />
            
            {/* Travelling Light Line Indicator */}
            <motion.div
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 h-[1.5px] w-24 bg-gradient-to-r from-transparent via-[#B82691] to-transparent pointer-events-none"
              style={{ y: "-50%" }}
            />

            {steps.map((node, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative flex flex-col items-center justify-center cursor-default group"
              >
                <motion.div
                  animate={{ 
                    scale: hoveredIdx === idx ? 1.2 : 1,
                    backgroundColor: hoveredIdx === idx ? "#B82691" : idx === 7 ? "#B82691" : "#FFFFFF",
                    borderColor: idx === 7 || hoveredIdx === idx ? "#B82691" : "#D4D4D8"
                  }}
                  transition={springFast}
                  className="w-4 h-4 rounded-full border-2 bg-white z-10 shadow-sm flex items-center justify-center"
                >
                  {idx === 7 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </motion.div>
                
                <motion.span 
                  animate={{ 
                    y: hoveredIdx === idx ? 22 : 20,
                    color: hoveredIdx === idx ? "#000000" : idx === 7 ? "#B82691" : "#71717A"
                  }}
                  className="absolute text-[12px] font-[550] whitespace-nowrap tracking-tight transition-colors duration-200"
                >
                  {node}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 6. HIGH FIDELITY DOCUMENTS DISPLAY ---
const DocumentsDisplay = () => {
  return (
    <section className="relative py-24 bg-zinc-50/50 border-y border-zinc-200/50 text-zinc-900 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-3 mb-20">
          <span className="text-[12px] font-bold tracking-widest text-[#B82691] uppercase">Material Artifacts</span>
          <h2 className="text-3xl md:text-4xl font-[550] tracking-tight">Production layouts, no mockups.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-4xl mx-auto">
          {/* Document 1: Resume */}
          <motion.div whileHover={{ y: -4 }} className={`bg-white border border-zinc-200/60 rounded-2xl p-5 flex flex-col justify-between min-h-[380px] ${shadowSmooth}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-medium border-b border-zinc-100 pb-3">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated 3 mins ago</span>
                <span className="font-bold uppercase tracking-wider text-[#B82691]">Resume Matrix</span>
              </div>
              <div className="space-y-2 text-left">
                <h4 className="text-[15px] font-[600] tracking-tight text-zinc-900">Alexei Price</h4>
                <p className="text-[11px] text-zinc-400 font-normal">Mountain View, CA • Expected Graduation May 2027</p>
                <div className="pt-2 space-y-2">
                  <div className="p-2 bg-pink-50/50 border border-pink-100 rounded-lg">
                    <p className="text-[11px] font-bold text-[#B82691] uppercase tracking-wider">Added Milestone</p>
                    <p className="text-[12px] font-medium text-zinc-800">Lead Vision Systems Captain — FIRST Robotics</p>
                  </div>
                  <div className="p-2 bg-zinc-50 border border-zinc-200/40 rounded-lg">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Target Parameters</p>
                    <p className="text-[12px] font-medium text-zinc-800">Tailored variant targeted for Stanford admissions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-zinc-400 pt-3 border-t border-zinc-100 font-normal text-left">Draft Generated Document</div>
          </motion.div>

          {/* Document 2: Common App */}
          <motion.div whileHover={{ y: -4 }} className={`bg-white border border-zinc-200/60 rounded-2xl p-5 flex flex-col justify-between min-h-[380px] ${shadowSmooth}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-medium border-b border-zinc-100 pb-3">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Auto-Synchronized</span>
                <span className="font-bold uppercase tracking-wider text-zinc-500">Common App</span>
              </div>
              <div className="space-y-3 text-left">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Field Allocations</span>
                <div className="space-y-2">
                  {["Activity Type: Science/Technology", "Position: Lead Vision Engineer", "Hours Logged: 184 Hours / Year"].map((field, idx) => (
                    <div key={idx} className="p-2.5 bg-zinc-50/60 border border-zinc-200/60 rounded-lg text-[12px] font-medium text-zinc-700">
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-center font-medium">Auto-fill verified alignment 100%</div>
          </motion.div>

          {/* Document 3: Personal Essay */}
          <motion.div whileHover={{ y: -4 }} className={`bg-white border border-zinc-200/60 rounded-2xl p-5 flex flex-col justify-between min-h-[380px] ${shadowSmooth}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] font-medium border-b border-zinc-100 pb-3">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Synthesis Active</span>
                <span className="font-bold uppercase tracking-wider text-zinc-500">Core Essay</span>
              </div>
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-[#B82691] uppercase tracking-wider block">Research Integration Improved</span>
                <p className="text-[12px] text-zinc-600 leading-relaxed italic font-normal">
                  "...by synthesizing complex matrix code frameworks directly onto our localized microcontrollers, the autonomous telemetry data loop achieved structural stability under 40ms..."
                </p>
                <div className="w-1/2 h-1.5 bg-[#B82691]/20 rounded-full overflow-hidden mt-2">
                  <div className="w-4/5 h-full bg-[#B82691]" />
                </div>
              </div>
            </div>
            <div className="text-[11px] text-zinc-400 pt-3 border-t border-zinc-100 font-normal text-left">Structural cohesion optimized</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- 7. KEYNOTE FLOATING DASHBOARD SECTION ---
const KeynoteDashboardSection = () => {
  return (
    <section className="relative py-28 bg-white text-zinc-900 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[12px] font-bold tracking-widest text-[#B82691] uppercase">Central Interface</span>
          <h2 className="text-3xl md:text-5xl font-[550] tracking-tight text-zinc-900">A command center for your academic journey.</h2>
        </div>
        
        {/* Apple Keynote Style Floating Element Canvas */}
        <div className="relative pt-8 w-full max-w-4xl mx-auto">
          <div className="absolute -inset-10 bg-radial-gradient from-zinc-100/60 to-transparent blur-2xl pointer-events-none rounded-full" />
          <div className={`relative bg-white border border-zinc-200/80 rounded-[28px] p-4 md:p-6 text-left ${shadowPremium}`}>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
                <div className="w-3 h-3 rounded-full bg-zinc-200" />
              </div>
              <div className="text-[12px] font-medium text-zinc-400 bg-zinc-50 border border-zinc-200/60 px-3 py-1 rounded-lg">trydraft.co/dashboard</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 min-h-[260px]">
              <div className="sm:col-span-3 border-r border-zinc-100 pr-2 space-y-1">
                {["Overview", "Milestones", "Academic Records", "Integrations", "Settings"].map((nav, i) => (
                  <div key={i} className={`px-3 py-2 rounded-xl text-[13px] font-[550] transition-colors ${i === 1 ? "bg-pink-50/60 text-[#B82691]" : "text-zinc-500 hover:text-zinc-900"}`}>
                    {nav}
                  </div>
                ))}
              </div>
              
              <div className="sm:col-span-9 space-y-4 pl-0 sm:pl-2">
                <div className="flex items-center justify-between bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/40">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[#B82691] animate-pulse" />
                    <span className="text-[13px] font-medium text-zinc-700">Verification check completed for regional research honors dataset</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-zinc-400">Just now</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-zinc-200/60 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Narrative Density Metrics</span>
                    <h4 className="text-2xl font-[550] text-zinc-900">84 Items</h4>
                    <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-zinc-800" /></div>
                  </div>
                  <div className="p-4 border border-zinc-200/60 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Export Readiness Status</span>
                    <h4 className="text-2xl font-[550] text-emerald-600">Optimal</h4>
                    <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden"><div className="w-full h-full bg-emerald-500" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 8. PREMIUM TESTIMONIALS ---
const TestimonialsSection = () => {
  const reviews = [
    { text: "Draft completely systematicized my historical narrative track, allowing me to build verified records over four years without losing critical source details.", author: "Marcus Vance", role: "Stanford University '29" },
    { text: "Using images or messy spreadsheets fails structural review checks. Draft forms real verified parameters out of scattered high school milestones.", author: "Evelyn Zhao", role: "MIT Admit" },
    { text: "The clean layout framework provides precise architecture. It functions exactly like high-end professional development toolkits.", author: "Devon Thorne", role: "Harvard University '29" }
  ];

  return (
    <section className="relative py-24 bg-zinc-50/50 border-t border-zinc-200/50 text-zinc-900 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-3 mb-20">
          <span className="text-[12px] font-bold tracking-widest text-[#B82691] uppercase">Admissions Proof</span>
          <h2 className="text-3xl md:text-4xl font-[550] tracking-tight">Handcrafted records, validated.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-4xl mx-auto items-stretch">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ rotate: i % 2 === 0 ? -1 : 1 }}
              whileHover={{ rotate: 0, y: -4 }}
              className={`bg-white border border-zinc-200/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${shadowSmooth} hover:shadow-lg`}
            >
              <p className="text-[14px] text-zinc-600 font-normal leading-relaxed text-left italic">"{rev.text}"</p>
              <div className="pt-4 border-t border-zinc-100 mt-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200" />
                <div className="text-left">
                  <h5 className="text-[13px] font-[600] text-zinc-900">{rev.author}</h5>
                  <p className="text-[11px] text-zinc-400 font-normal">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 9. MONOLITHIC CTA SECTION ---
const CTASection = () => {
  return (
    <section className="relative py-32 bg-white text-zinc-900 text-center px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center text-zinc-100/40 pointer-events-none">
        <BrandWatermark className="w-[500px] md:w-[720px] opacity-[0.03]" />
      </div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <h2 className="text-[32px] sm:text-[44px] md:text-[56px] font-[550] tracking-tight leading-[1.05] text-zinc-900 max-w-2xl mx-auto">
          Everything you build today becomes part of your story tomorrow.
        </h2>
        <div className="pt-4">
          <SpringButton primary to="/login" className="px-8 py-3.5 text-[15px]">
            Start Building Your Framework
          </SpringButton>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// CORE LAYOUT COMPONENT STRUCTURAL ARCHITECTURE
// ==========================================

const Landing = () => {
  useEffect(() => {
    if (window.location.hash === "#our-mission") {
      setTimeout(() => {
        document.getElementById("our-mission")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, []);

  return (
    <div className="w-full font-inter selection:bg-[#B82691]/10 selection:text-[#B82691]">
      {/* 1. HERO */}
      <section className="relative pt-[160px] pb-[100px] px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6 text-left">
            
            <motion.h1 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[40px] sm:text-[48px] md:text-[56px] font-[550] tracking-tighter leading-[1.05] text-zinc-900"
            >
              Everything you do in high school deserves to count.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[16px] md:text-[17px] font-normal text-zinc-500 leading-relaxed text-balance"
            >
              One streamlined system for every custom project, milestone achievement, deep extracurricular reflection, and award across all four years of high school.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-wrap items-center gap-3"
            >
              <SpringButton primary to="/login">Start Building</SpringButton>
              <SpringButton to="/login">Login</SpringButton>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7 w-full">
            <HeroDashboardSnippet />
          </div>
        </div>
      </section>

      {/* 2. PROBLEM */}
     <ProblemSection/>

      {/* 3. MEMORY */}
      <MemorySection />

      {/* 4. CONNECTED WORKSPACE */}
      <ConnectedWorkspace />

      {/* 5. TIMELINE */}
      <HorizontalTimeline />

      {/* 6. DOCUMENTS */}
      <DocumentsDisplay />

      {/* 7. DASHBOARD */}
      <KeynoteDashboardSection />

      {/* 8. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 9. CTA */}
      <CTASection />
    </div>
  );
};

// --- CLEAN PRICING PAGE CONTAINER ---
const PricingPage = () => {
  return (
    <div className="min-h-screen bg-white font-inter text-zinc-900 pt-32 pb-24 relative overflow-hidden">
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <span className="text-[12px] font-bold tracking-widest text-[#B82691] uppercase">Simple Options</span>
          <h2 className="text-3xl md:text-4xl font-[550] tracking-tight text-zinc-900">Transparent compensation model.</h2>
        </div>

        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          {/* Plan 1 */}
          <div className={`bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${shadowSmooth} hover:border-zinc-300`}>
            <div className="space-y-4">
              <div>
                <h4 className="text-[18px] font-bold text-zinc-900">Start Tier</h4>
                <p className="text-[12px] text-zinc-400 mt-0.5">For single builders tracking progress</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-[550] tracking-tight text-zinc-900">$5</span>
                <span className="text-[14px] text-zinc-400 font-medium">/ month</span>
              </div>
              <p className="text-[13px] text-zinc-500 leading-relaxed font-normal">Includes full access to unlimited tracking metrics, dashboard verification systems, and timeline integration blocks.</p>
            </div>
            <div className="pt-6">
              <SpringButton to="/login" className="w-full text-center">Activate Start Access</SpringButton>
            </div>
          </div>

          {/* Plan 2 */}
          <div className={`bg-white border-2 border-zinc-900 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${shadowPremium}`}>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[18px] font-bold text-zinc-900">Pro Tier</h4>
                  <p className="text-[12px] text-zinc-400 mt-0.5">Enhanced synchronization frameworks</p>
                </div>
                <span className="text-[9px] font-bold text-[#B82691] bg-pink-50 px-2 py-0.5 rounded-md uppercase">Elevated</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-[550] tracking-tight text-zinc-900">$19</span>
                <span className="text-[14px] text-zinc-400 font-medium">/ month</span>
              </div>
              <p className="text-[13px] text-zinc-500 leading-relaxed font-normal">Elevates high school metrics with automated synchronization vectors, counselor collaboration tokens, and premium mentoring system paths.</p>
            </div>
            <div className="pt-6">
              <SpringButton primary to="/login" className="w-full text-center">Activate Pro Access</SpringButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- MINIMALIST FIXED NAVIGATION BAR ---
const ElegantNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <motion.nav
      animate={{
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 1)",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        borderBottomColor: isScrolled ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0)"
      }}
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b flex items-center transition-all duration-200 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={Logo} alt="Draft Logo" className="w-4 h-4 object-contain" />
            <span className="font-bold text-[16px] tracking-tight text-zinc-900">Draft</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[13px] font-[550] text-zinc-400">
            <Link to="/#our-mission" className="hover:text-zinc-900 transition-colors">Our Mission</Link>
            <Link to="/pricing" className="hover:text-zinc-900 transition-colors">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-[13px] font-[550] text-zinc-500 hover:text-zinc-900 px-2 py-1 transition-colors">Log in</Link>
          <SpringButton primary to="/login" className="py-2 px-4 text-[12px]">Start Building</SpringButton>
        </div>
      </div>
    </motion.nav>
  );
};

// --- STARK MINIMAL DEEP BLACK FOOTER ---
const PremiumFooter = () => {
  return (
    <footer className="bg-[#000000] text-zinc-500 pt-16 pb-8 border-t border-zinc-900 overflow-hidden relative z-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-12 gap-8 pb-12 border-b border-zinc-900">
        <div className="sm:col-span-6 space-y-3 text-left">
          <div className="flex items-center gap-2 text-white">
            <img src={Logo} alt="Draft Logo" className="w-4 h-4 object-contain invert" />
            <span className="font-bold text-[16px] tracking-tight">Draft</span>
          </div>
          <p className="text-[13px] font-normal text-zinc-400 max-w-xs leading-relaxed">
            Build the student universities remember. Structural academic tracking systems built carefully for ambitious builders globally.
          </p>
        </div>
        
        <div className="sm:col-span-3 text-left space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Company Blueprint</h4>
          <ul className="space-y-1.5 text-[13px] font-medium">
            <li><Link to="/#our-mission" className="hover:text-white transition-colors">Our Mission</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Start Building</Link></li>
          </ul>
        </div>

        <div className="sm:col-span-3 text-left space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Channels</h4>
          <ul className="space-y-1.5 text-[13px] font-medium">
            <li><a href="mailto:hello@trydraft.co" className="text-[#B82691] hover:underline">hello@trydraft.co</a></li>
            <li><a href="#linkedin" className="hover:text-white transition-colors">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-medium text-zinc-700">
        <p>© Draft 2026</p>
        <p>Purely Handcrafted Framework</p>
      </div>
    </footer>
  );
};

// --- APP CORE ENTRY ROUTING ENGINE ---
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col antialiased font-inter relative bg-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;550;600;700&display=swap');
        .font-inter, .font-inter *, html, body, button {
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        /* Custom scrollbar elimination rule to keep interface sleek */
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Rich structural mesh canvas overlay layer forced on top */}
      <GlobalNoiseOverlay />
      
      <ElegantNavigation />
      
      <main className="flex-1 relative z-10 bg-transparent">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<div className="pt-40 pb-32 text-center text-xl font-[550] min-h-screen text-zinc-900">Access Interface Portal</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <PremiumFooter />
    </div>
  );
}