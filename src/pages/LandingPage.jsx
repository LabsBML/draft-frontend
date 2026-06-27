import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Check,
  Folder
} from "lucide-react";

import Logo from "../assets/logo.svg";

// --- Custom Styles & Design System Tokens ---
const shadowSmooth = "shadow-[0_8px_30px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)]";
const shadowHover = "hover:shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.01)]";

// --- Global Master Noise Engine ---
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
      const opacity = (rand() * maxOpacity + 0.05).toFixed(3);
      const radius = (rand() * 0.6 + 0.3).toFixed(1);
      nodes += `%3Ccircle cx='${x}' cy='${y}' r='${radius}' fill='${color}' opacity='${opacity}'/%3E`;
    }
    return `data:image/svg+xml,%3Csvg width='${canvasSize}' height='${canvasSize}' viewBox='0 0 ${canvasSize} ${canvasSize}' xmlns='http://www.w3.org/2000/svg'%3E${nodes}%3C/svg%3E`;
  };

  const heavyDarkGrit = generateGrit(3000, '%23000000', 0.25, 140, 42);
  const intensePinkGrit = generateGrit(1500, '%23B82691', 0.38, 180, 99);
  const microLightGrit = generateGrit(2500, '%23ffffff', 0.20, 110, 77);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99] opacity-[0.16] mix-blend-normal font-inter"
      style={{
        backgroundImage: `
          url("${heavyDarkGrit}"),
          url("${intensePinkGrit}"),
          url("${microLightGrit}"),
          radial-gradient(circle at 15% 25%, rgba(0, 0, 0, 0.03), transparent 65%),
          radial-gradient(circle at 85% 15%, rgba(184, 38, 145, 0.06), transparent 55%)
        `,
        backgroundSize: "83px 83px, 149px 149px, 71px 71px, 100% 100%, 100% 100%",
        backgroundRepeat: "repeat, repeat, repeat, no-repeat, no-repeat",
      }}
    />
  );
};

// --- Global Custom Spring Button Component ---
const SpringButton = ({ primary, children, className = "", to, ...props }) => {
  const baseClasses = `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[15px] font-[550] tracking-tight transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B82691]/40 font-inter ${
    primary
      ? "bg-black text-white shadow-[0_4px_14px_rgba(184,38,145,0.25)] hover:bg-zinc-800 hover:shadow-[0_6px_20px_rgba(184,38,145,0.35)]"
      : "bg-white text-slate-800 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
  } ${className}`;

  const content = (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={baseClasses}
    >
      {children}
    </motion.div>
  );

  if (to) {
    return <Link to={to} className="font-inter">{content}</Link>;
  }
  return <button {...props} className="font-inter">{content}</button>;
};

// --- Interactive Dashboard Mockup ---
const HeroDashboard = () => {
  const containerRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    setRotateX(-y * 6);
    setRotateY(x * 6);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/3] rounded-[32px] bg-white border border-slate-200/60 p-7 md:p-8 flex flex-col space-y-6 transition-all duration-300 ease-out preserve-3d group z-10 font-inter shadow-[0_30px_70px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)]"
      style={{ transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY + 1.5}deg)` }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#B82691]/[0.02] via-transparent to-transparent pointer-events-none rounded-[32px]" />
      
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 relative z-10 font-inter">
        <div className="flex items-center gap-3.5 font-inter">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm border border-slate-200/40 font-inter">AP</div>
          <div className="font-inter">
            <h4 className="text-[15px] font-[600] text-slate-900 tracking-tight font-inter">Alexei Price</h4>
            <p className="text-[13px] text-slate-400 font-medium font-inter">Grade 11 • Mountain View High School</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-inter">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[13px] font-[550] text-slate-600 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg font-inter">Profile Active</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 flex-1 relative z-10 overflow-hidden font-inter">
        <div className={`col-span-5 bg-slate-50 border border-slate-200/50 rounded-2xl ${shadowSmooth} p-5 flex flex-col justify-between font-inter`}>
          <div className="font-inter">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase font-inter">Dream Universities</span>
            <div className="mt-3.5 space-y-2 font-inter">
              {["MIT", "Stanford", "Georgia Tech"].map((uni, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200/40 shadow-[0_2px_4px_rgba(0,0,0,0.01)] font-inter">
                  <span className="text-[13px] font-[550] text-slate-700 font-inter">{uni}</span>
                  <span className="text-[11px] font-medium text-[#B82691] bg-pink-50 px-2 py-0.5 rounded-md font-inter">Target</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200/40 flex items-center justify-between text-[13px] text-slate-500 font-medium font-inter">
            <span>Core Match Rate</span>
            <span className="font-semibold text-slate-900 font-inter">94%</span>
          </div>
        </div>

        <div className="col-span-7 flex flex-col space-y-4 font-inter">
          <div className={`bg-white border border-slate-200/60 rounded-2xl ${shadowSmooth} p-5 relative overflow-hidden transition-all duration-300 ${shadowHover} font-inter`}>
            <div className="flex justify-between items-start mb-2 font-inter">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase font-inter">Active Project</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-inter">Verified</span>
            </div>
            <h5 className="text-[14px] font-[600] text-slate-900 tracking-tight font-inter">Disaster Response Drone</h5>
            <p className="text-[13px] text-slate-500 mt-1 line-clamp-2 font-inter">Autonomous routing matrix system designed with PyTorch and computer vision APIs.</p>
            <div className="mt-3 flex gap-1.5 font-inter">
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-inter">Computer Vision</span>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-inter">PyTorch</span>
            </div>
          </div>

          <div className={`bg-white border border-slate-200/60 rounded-2xl ${shadowSmooth} p-5 flex-1 flex flex-col justify-between font-inter`}>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase font-inter">Leadership Tracker</span>
            <div className="space-y-2.5 mt-2 font-inter">
              <div className="flex items-center justify-between text-[13px] font-inter">
                <span className="font-[550] text-slate-700 font-inter">FIRST Robotics Captain</span>
                <span className="text-slate-400 font-inter">180 hrs log</span>
              </div>
              <div className="flex items-center justify-between text-[13px] font-inter">
                <span className="font-[550] text-slate-700 font-inter">Debate President</span>
                <span className="text-slate-400 font-inter">120 hrs log</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Real Scroll-Linked Production Timeline Module ---
const HighFidelityTimeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.85], ["0%", "100%"]);

  const updates = [
    { grade: "Grade 9", title: "Discover Interests & Foundations", items: ["Log initial code sandbox projects", "Join High School Robotics Club", "Establish foundational GPA matrix"] },
    { grade: "Grade 10", title: "Deepen Involvement & Leadership", items: ["Elevated to Lead Vision Programmer", "Draft early responsive portfolio architecture", "Initiate regional Hack Club network"] },
    { grade: "Grade 11", title: "Major Milestones & Standardized Assets", items: ["Complete AI Research Assistant module", "Elected Debate President", "Compile core activities dataset"] },
    { grade: "Grade 12", title: "Finalize & Export Application Suite", items: ["Generate production-ready resume", "Lock final Common App personal essay", "Seamless single-click platform export"] }
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto pl-8 pr-2 py-4 z-10 font-inter">
      <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-zinc-800 rounded-full font-inter" />
      <motion.div 
        style={{ height: lineHeight }}
        className="absolute left-0 top-2 w-[2px] bg-[#B82691] rounded-full origin-top font-inter"
      />

      <div className="space-y-12 font-inter">
        {updates.map((node, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative pl-8 group font-inter"
          >
            <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-zinc-700 group-hover:border-[#B82691] transition-colors duration-300 z-10 flex items-center justify-center font-inter">
              <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#B82691] transition-colors duration-300 font-inter" />
            </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 font-inter">
              <div className="flex items-center justify-between mb-2 font-inter">
                <span className="text-[13px] font-bold text-[#B82691] tracking-wide uppercase font-inter">{node.grade}</span>
                <span className="text-[11px] font-medium text-slate-400 font-inter">Milestone Phase</span>
              </div>
              <h4 className="text-[16px] font-[600] text-slate-900 tracking-tight mb-3 font-inter">{node.title}</h4>
              <ul className="space-y-2 font-inter">
                {node.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[13px] text-slate-500 font-medium leading-relaxed font-inter">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5 font-inter" />
                    <span className="font-inter">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Document Visual Compendium ---
const StackedDocumentsVisual = () => {
  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto flex items-center justify-center perspective-[1200px] z-10 font-inter">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#B82691]/[0.04] to-transparent blur-3xl pointer-events-none rounded-full font-inter" />
      
      {/* Background Layer */}
      <motion.div 
        animate={{ y: [-4, 4, -4], rotate: [-4, -4, -4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute w-[80%] aspect-[8.5/11] bg-white border border-slate-200/60 rounded-xl ${shadowSmooth} p-6 transform -translate-x-6 -translate-y-8 z-0 opacity-70 font-inter`}
      >
        <div className="w-1/3 h-2 bg-slate-200 rounded mb-4 font-inter" />
        <div className="space-y-2 font-inter">
          <div className="w-full h-1.5 bg-slate-100 rounded font-inter" />
          <div className="w-full h-1.5 bg-slate-100 rounded font-inter" />
          <div className="w-4/5 h-1.5 bg-slate-100 rounded font-inter" />
        </div>
      </motion.div>

      {/* Mid Layer */}
      <motion.div 
        animate={{ y: [4, -4, 4], rotate: [1, 1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className={`absolute w-[82%] aspect-[8.5/11] bg-white border border-slate-200/60 rounded-xl ${shadowSmooth} p-6 transform translate-x-4 translate-y-4 z-10 font-inter`}
      >
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4 font-inter">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-inter">Common Application</span>
          <span className="text-[9px] text-[#B82691] font-semibold bg-pink-50 px-1.5 py-0.5 rounded font-inter">v2.04</span>
        </div>
        <div className="space-y-3 font-inter">
          <div className="h-2 bg-slate-100 rounded w-1/2 font-inter" />
          <div className="h-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 p-2 flex items-center gap-2 font-inter">
            <div className="w-3 h-3 rounded-full bg-emerald-500 font-inter" />
            <div className="h-1.5 bg-slate-200 rounded w-2/3 font-inter" />
          </div>
        </div>
      </motion.div>

      {/* Foreground Layer */}
      <motion.div 
        animate={{ y: [-2, 2, -2], rotate: [-1, -1, -1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute w-[84%] aspect-[8.5/11] bg-white border border-slate-200/60 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] p-6 z-20 flex flex-col justify-between text-slate-900 font-inter"
      >
        <div className="font-inter">
          <div className="border-b border-slate-100 pb-3 mb-4 text-center font-inter">
            <h4 className="text-[14px] font-[600] tracking-tight text-slate-900 font-inter">Alexei Price</h4>
            <p className="text-[9px] text-slate-400 mt-0.5 font-inter">Mountain View, CA • Expected Graduation May 2027</p>
          </div>
          <div className="space-y-4 font-inter">
            <div className="font-inter">
              <span className="text-[9px] font-bold tracking-wider text-[#B82691] uppercase block mb-1.5 font-inter">Projects Matrix</span>
              <div className="space-y-1 font-inter">
                <div className="flex justify-between text-[11px] font-medium text-slate-700 font-inter">
                  <span className="font-inter">AI Research Assistant</span>
                  <span className="text-slate-400 font-inter">Python</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded overflow-hidden font-inter">
                  <div className="w-[85%] h-full bg-[#B82691] font-inter" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-inter">
          <span className="font-inter">Draft Verified Document</span>
          <span className="text-slate-900 font-medium font-inter">100% Core Rate</span>
        </div>
      </motion.div>
    </div>
  );
};

// --- Home Landing Architecture ---
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
      
      {/* SECTION 1: Hero */}
      <section className="relative pt-[140px] pb-[80px] px-6 bg-[#F8FAFC] font-inter">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 font-inter">
          <div className="lg:col-span-5 space-y-7 text-left font-inter">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[38px] md:text-[54px] font-[550] tracking-tighter leading-[1.1] text-slate-900 font-inter"
            >
              Build the student universities remember.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[17px] md:text-[18px] font-normal text-slate-500 leading-relaxed text-balance font-inter"
            >
              One streamlined system for every custom project, milestone achievement, deep extracurricular reflection, and award across all four years of high school.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 font-inter"
            >
              <SpringButton primary to="/login" className="px-8 py-3.5 text-[16px] font-inter">
                Start Building <ArrowRight className="w-4 h-4 ml-0.5 font-inter" />
              </SpringButton>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7 relative flex justify-center lg:justify-end font-inter">
            <div className="absolute inset-0 bg-[#B82691]/5 blur-[120px] rounded-full transform translate-x-12 translate-y-6 pointer-events-none font-inter" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl font-inter"
            >
              <HeroDashboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Profiles Showcase Matrix */}
      <section className="relative py-[100px] px-6 bg-[#09090B] font-inter">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 font-inter">
          <div className="lg:col-span-6 flex justify-center font-inter">
            <div className={`w-full max-w-xl bg-white border border-slate-200/60 rounded-[32px] p-8 ${shadowSmooth} relative overflow-hidden z-10 font-inter`}>
              <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-[#B82691]/[0.02] to-transparent pointer-events-none font-inter" />
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 font-inter">
                <div className="font-inter">
                  <h4 className="text-[15px] font-[600] text-slate-900 font-inter">Application Compilation Data</h4>
                  <p className="text-[12px] text-slate-400 font-inter">Live background sync status</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-inter">Fully Optimized</span>
              </div>
              <div className="space-y-4 font-inter">
                {[
                  { label: "AI Research Assistant", type: "Project File", size: "84 hrs logged" },
                  { label: "FIRST Robotics Captain", type: "Extracurricular Data", size: "180 hrs logged" },
                  { label: "State Debate Finalist Certificate", type: "Award Asset", size: "Verified May '26" }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/40 rounded-xl font-inter">
                    <div className="flex items-center gap-3 font-inter">
                      <Folder className="w-4 h-4 text-slate-400 font-inter" />
                      <div className="font-inter">
                        <p className="text-[13px] font-[550] text-slate-800 font-inter">{doc.label}</p>
                        <p className="text-[11px] text-slate-400 font-medium font-inter">{doc.type}</p>
                      </div>
                    </div>
                    <span className="text-[12px] text-slate-500 font-medium font-inter">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6 space-y-6 text-left font-inter">
            <span className="text-[13px] font-bold text-[#B82691] tracking-wider uppercase font-inter">Unified Aggregation</span>
            <h2 className="text-[36px] md:text-[44px] font-[550] tracking-tight text-white leading-[1.1] font-inter">Keep every milestone and achievement in one place.</h2>
            <p className="text-[17px] md:text-[18px] text-zinc-400 font-normal leading-relaxed font-inter">
              Log complex volunteer timelines, custom development logs, and leadership paths seamlessly as they occur. Draft automatically shapes your records into pristine datasets matchable by global frameworks.
            </p>
            <div className="pt-2 space-y-3 font-inter">
              {[
                "Automatic synthesis optimized for common application matrices",
                "Verified digital completion badges and dynamic timestamps",
                "Direct reference linkage to code repositories and tracking sheets"
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3 text-zinc-300 font-medium text-[15px] font-inter">
                  <div className="w-5 h-5 rounded-full bg-pink-950 flex items-center justify-center flex-shrink-0 font-inter">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B82691] font-inter" />
                  </div>
                  <span className="font-inter">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Our Mission Framework */}
      <section id="our-mission" className="py-[120px] px-6 bg-white scroll-mt-16 relative overflow-hidden font-inter">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 font-inter">
          <div className="lg:col-span-6 space-y-6 text-left font-inter">
            <span className="text-[13px] font-bold text-[#B82691] tracking-wider uppercase font-inter">Our Mission</span>
            <h2 className="text-[36px] md:text-[46px] font-[550] tracking-tight leading-[1.1] text-slate-900 text-balance font-inter"> We built Draft to remember everything.</h2>
            <div className="space-y-4 text-[17px] text-slate-500 font-normal leading-relaxed font-inter">
              <p className="font-inter">Applying to college is structural chaos. Complex passion projects live buried inside forgotten codebases. Deep research essays live disconnected across separate personal cloud folders. Lifelong high-impact community achievements fade from memory and disappear entirely by senior spring.</p>
              <p className="font-inter">Draft consolidates your high school narrative engine into a single, beautifully organized system, turning historical raw effort into verified, undeniable material records.</p>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center font-inter">
            <StackedDocumentsVisual />
          </div>
        </div>
      </section>

      {/* SECTION 4: Interactive Timeline Arena */}
      <section className="relative py-[120px] px-6 bg-[#09090B] overflow-hidden font-inter">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 font-inter">
          <div className="lg:col-span-6 order-2 lg:order-1 font-inter">
            <HighFidelityTimeline />
          </div>

          <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2 space-y-6 text-left font-inter">
            <span className="text-[13px] font-bold text-[#B82691] tracking-wider uppercase font-inter">Continuous Velocity</span>
            <h2 className="text-[36px] md:text-[44px] font-[550] tracking-tight text-white leading-[1.1] font-inter">See your high school profile develop in real time.</h2>
            <p className="text-[17px] md:text-[18px] text-zinc-400 font-normal leading-relaxed font-inter">
              Never experience the last-minute stress of your senior year application cycle. Track milestones step-by-step from early freshman explorations to ultimate programmatic application delivery hub status.
            </p>
            <div className="pt-2 font-inter">
              <Link to="/login" className="text-[15px] font-[600] text-[#B82691] hover:text-[#961f75] inline-flex items-center gap-1 transition-colors font-inter">
                Explore the timeline schema <ChevronRight className="w-4 h-4 font-inter" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Bottom CTA */}
      <section className="py-[120px] px-6 bg-[#F8FAFC] text-center relative overflow-hidden font-inter">
        <div className="max-w-2xl mx-auto space-y-6 relative z-20 font-inter">
          <h2 className="text-[42px] md:text-[54px] font-[550] tracking-tight text-slate-900 leading-[1.05] font-inter">Start building your future framework today.</h2>
          <p className="text-[17px] md:text-[18px] text-slate-500 max-w-md mx-auto font-normal leading-relaxed font-inter">Join thousands of ambitious students worldwide systematically tracking their absolute high school potential.</p>
          <div className="pt-4 font-inter">
            <SpringButton primary to="/login" className="px-10 py-3.5 text-[16px] font-inter">Try Draft for Free</SpringButton>
          </div>
        </div>
      </section>

    </div>
  );
};

// --- Clean Pricing Component Route ---
const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter text-slate-950 pt-32 pb-24 relative overflow-hidden">
      <section className="py-[60px] px-6 relative z-10 font-inter">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16 font-inter">
          <span className="text-[13px] font-bold text-[#B82691] tracking-wider uppercase font-inter">Pricing</span>
          <h2 className="text-[36px] md:text-[44px] font-[550] tracking-tight text-slate-900 font-inter">Simple, transparent options.</h2>
          <p className="text-[17px] md:text-[18px] text-slate-500 font-normal max-w-lg mx-auto font-inter">Everything you need to secure, catalog, and generate your academic application materials.</p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch font-inter">
          
          {/* Plan 1: Start */}
          <div className={`bg-white border border-slate-200/80 rounded-[32px] p-8 flex flex-col justify-between ${shadowSmooth} transition-all duration-300 ${shadowHover} z-10 font-inter`}>
            <div className="space-y-6 font-inter">
              <div className="font-inter">
                <h4 className="text-[20px] font-bold text-slate-900 font-inter">Start</h4>
                <p className="text-[13px] text-slate-400 font-medium mt-1 font-inter">For single builders tracking progress</p>
              </div>
              <div className="flex items-baseline gap-1 font-inter">
                <span className="text-[48px] font-[550] text-slate-900 tracking-tight font-inter">$5</span>
                <span className="text-[16px] text-slate-400 font-medium font-inter">/ month</span>
              </div>
              <div className="h-px bg-slate-100 font-inter" />
              <p className="text-[14px] text-slate-500 leading-relaxed font-medium font-inter"> Includes full access to unlimited tracking metrics, dashboard verification systems, timeline infrastructure nodes, and clean single-click document generation routines.</p>
            </div>
            <div className="pt-8 font-inter">
              <SpringButton to="/login" className="w-full bg-slate-50 border-slate-200/60 text-slate-800 hover:bg-slate-100 font-inter">Activate Start Account</SpringButton>
            </div>
          </div>

          {/* Plan 2: Pro */}
          <div className={`bg-white border border-slate-200/80 rounded-[32px] p-8 flex flex-col justify-between ${shadowSmooth} transition-all duration-300 ${shadowHover} z-10 font-inter`}>
            <div className="space-y-6 relative z-10 font-inter">
              <div className="flex justify-between items-start font-inter">
                <div className="font-inter">
                  <h4 className="text-[20px] font-bold text-slate-900 font-inter">Pro</h4>
                  <p className="text-[13px] text-slate-400 font-medium mt-1 font-inter">Enhanced synchronization & feedback</p>
                </div>
                <span className="text-[11px] font-bold text-[#B82691] bg-pink-50 border border-[#B82691]/20 px-2 py-0.5 rounded-md uppercase tracking-wider font-inter">Elevated</span>
              </div>
              <div className="flex items-baseline gap-1 font-inter">
                <span className="text-[48px] font-[550] text-slate-900 tracking-tight font-inter">$19</span>
                <span className="text-[16px] text-slate-400 font-medium font-inter">/ month</span>
              </div>
              <div className="h-px bg-slate-100 font-inter" />
              <p className="text-[14px] text-slate-500 leading-relaxed font-medium font-inter">Elevates student metrics with automated parent email updates, primary prioritized dashboard compilation queues, counselor export collaboration access tokens, and custom mentor review systems.</p>
            </div>
            <div className="pt-8 relative z-10 font-inter">
              <SpringButton primary to="/login" className="w-full font-inter">Activate Pro Access</SpringButton>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

// --- Navigation Bar Component ---
const ElegantNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const handleMissionScroll = () => {
    setTimeout(() => {
      document.getElementById("our-mission")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <motion.nav
      animate={{
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 1)",
        backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)",
        borderBottomColor: isScrolled ? "rgba(15, 23, 42, 0.06)" : "rgba(15, 23, 42, 0)"
      }}
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300 flex items-center bg-white font-inter"
    >
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between font-inter">
        <div className="flex items-center gap-8 font-inter">
          <Link to="/" className="flex items-center gap-2 group font-inter">
            <img src={Logo} alt="Draft Logo" className="w-5 h-5 object-contain font-inter" />
            <span className="font-bold text-[17px] tracking-tight font-inter text-slate-900">Draft</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-[14px] font-[550] text-slate-500 font-inter">
            <Link to="/#our-mission" onClick={handleMissionScroll} className="transition-colors hover:text-slate-900 font-inter">Our Mission</Link>
            <Link to="/pricing" className="transition-colors hover:text-slate-900 font-inter">Pricing</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4 font-inter">
          <Link to="/login" className="text-[14px] font-[550] px-2 py-1 transition-colors font-inter text-slate-600 hover:text-slate-900">Log in</Link>
          <SpringButton primary to="/login" className="py-2 px-4 text-[13px] font-inter">Start Building</SpringButton>
        </div>
      </div>
    </motion.nav>
  );
};

// --- Complete Locked Plain Black Footer Module ---
const PremiumFooter = () => {
  const handleMissionScroll = () => {
    setTimeout(() => {
      document.getElementById("our-mission")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <footer className="bg-[#000000] text-slate-400 pt-20 pb-10 border-t border-white/[0.04] overflow-hidden relative z-20 font-inter">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 pb-12 border-b border-white/5 font-inter">
        
        <div className="space-y-4 font-inter">
          <div className="flex items-center gap-2 text-white font-inter">
            <img src={Logo} alt="Draft Logo" className="w-5 h-5 object-contain invert font-inter" />
            <span className="font-bold text-[18px] tracking-tight font-inter">Draft</span>
          </div>
          <p className="text-[14px] font-medium text-slate-300 max-w-xs leading-relaxed font-inter">
            Build the student universities remember. Turn raw academic efforts into pristine architectural application matrices.
          </p>
        </div>

        <div className="space-y-3 font-inter">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-inter">Navigation</h4>
          <ul className="space-y-2 text-[14px] font-medium font-inter">
            <li><Link to="/#our-mission" onClick={handleMissionScroll} className="hover:text-white transition-colors font-inter">Our Mission</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors font-inter">Pricing</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors font-inter">Login</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors font-inter">Start Building</Link></li>
          </ul>
        </div>

        <div className="space-y-3 font-inter">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-inter">Contact</h4>
          <ul className="space-y-2 text-[14px] font-medium font-inter">
            <li><a href="mailto:hello@trydraft.co" className="hover:text-white text-[#B82691] transition-colors font-inter">hello@trydraft.co</a></li>
            <li><a href="#linkedin" className="hover:text-white transition-colors font-inter">LinkedIn</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] font-medium text-slate-600 font-inter">
        <p className="font-inter">© Draft 2026</p>
        <p className="text-slate-500 font-inter">Built with care for ambitious students worldwide.</p>
      </div>
    </footer>
  );
};

// --- Main App Route Layout Engine ---
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col antialiased font-inter relative bg-white">
      {/* Absolute CSS Override Rule to force Inter typography globally over parent project configs */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;550;600;700&display=swap');
        
        /* Deep force override targeting everything inside this application shell */
        .font-inter, .font-inter *, html, body, button, input, textarea, select {
          font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
        }
      `}</style>

      {/* Structural canvas grain layer forced cleanly on top */}
      <GlobalNoiseOverlay />
      
      <ElegantNavigation />
      
      <main className="flex-1 relative z-10 bg-transparent font-inter">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<div className="pt-40 pb-32 text-center text-4xl font-[550] min-h-screen bg-transparent text-slate-900 font-inter">Access Interface Platform</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <PremiumFooter />
    </div>
  );
}