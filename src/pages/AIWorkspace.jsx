import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Sparkles, Terminal, BookOpen, Layers, Send } from 'lucide-react';
import { cn } from '../utils';

export default function AIWorkspace() {
  const [activeEngine, setActiveEngine] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const engines = [
    { id: 'story', title: 'Personal Narrative Synthesizer', desc: 'Parses raw experience records into multi-layered essay matrices focusing on leadership signals.', icon: BookOpen },
    { id: 'roadmap', title: 'Structural Strategy Engine', desc: 'Compiles project timeline targets based on historical elite admissions distributions.', icon: Layers },
    { id: 'portfolio', title: 'Technical Copy Analyzer', desc: 'Refines engineering writeups to align clean codebase impact metrics with academic filters.', icon: Terminal }
  ];

  const triggerExecutionLoop = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setOutput('');

    // Stream emulation matching production SSE channels
    const targetOutput = `### STRUCTURAL COMPILATION INFERENCE BLOCK\n\n1. **Signal Isolation Core:** Experience variables align with non-standard problem-solving patterns.\n2. **Refinement Vector:** Replace qualitative adjectives with deterministic metrics (e.g., latency deltas).\n3. **Conclusion Frame:** Structural proof-of-work is firmly grounded in empirical outputs.`;
    let idx = 0;
    
    const interval = setInterval(() => {
      setOutput((prev) => prev + targetOutput.charAt(idx));
      idx++;
      if (idx >= targetOutput.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 10);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-6 space-y-6">
      <PageHeader title="AI Synthesis Node" subtitle="Professional contextual extraction primitives. Optimized to filter noise from application artifacts." />

      {!activeEngine ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engines.map(eng => {
            const Icon = eng.icon;
            return (
              <div 
                key={eng.id} 
                onClick={() => setActiveEngine(eng.id)}
                className="bg-white border border-neutral-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-neutral-900 cursor-pointer transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="p-2 bg-neutral-50 border border-neutral-200 rounded w-fit"><Icon className="w-4 h-4 text-neutral-900" /></div>
                  <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">{eng.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{eng.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-900">Initialize Operational Engine →</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[500px]">
          {/* Prompt Parameters Processing View */}
          <div className="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-semibold text-neutral-900 font-mono uppercase tracking-wider">Input Parameter Stream</span>
                <button onClick={() => { setActiveEngine(null); setOutput(''); setPrompt(''); }} className="text-[11px] font-mono text-neutral-400 hover:text-neutral-900">‹ Reset Matrix View</button>
              </div>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste raw telemetry tracking code logs or narrative bullet points here..."
                className="w-full text-xs border border-neutral-200 rounded p-3 focus:outline-none focus:border-neutral-900 bg-neutral-50/50 font-mono min-h-[300px] resize-none leading-relaxed"
              />
            </div>
            <button 
              onClick={triggerExecutionLoop}
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> {isGenerating ? "Executing Transformer Inference Pipeline..." : "Generate Analysis Matrix"}
            </button>
          </div>

          {/* Compilation Output Stream Frame */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col shadow-2xl relative text-neutral-200 font-mono overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-[11px] text-neutral-500">
              <span>OUTPUT STREAM CONFIG // ACTIVE</span>
              {output && <button onClick={() => navigator.clipboard.writeText(output)} className="hover:text-white transition-colors">Copy Block</button>}
            </div>
            <div className="flex-1 text-xs leading-relaxed p-2 overflow-y-auto whitespace-pre-wrap font-mono pt-4 selection:bg-neutral-800">
              {output ? output : <span className="text-neutral-600">// Waiting for parameter transformation pipeline data execution pass...</span>}
              {isGenerating && <span className="inline-block w-1.5 h-4 bg-white ml-0.5 animate-pulse" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}