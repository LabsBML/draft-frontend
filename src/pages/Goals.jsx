import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Calendar, Layers, CheckCircle2, ListFilter } from 'lucide-react';

export default function Goals() {
  const [board, setBoard] = useState({
    todo: [{ id: 1, title: 'Finalize SAT Registration Loop', priority: 'High', date: 'July 14' }],
    progress: [{ id: 2, title: 'Draft Merit Scholarship Profile Statement', priority: 'Medium', date: 'July 28' }],
    done: [{ id: 3, title: 'Secure Counselor System Endorsement Link', priority: 'High', date: 'Completed' }]
  });

  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-6 flex flex-col xl:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <PageHeader 
          title="Milestone Execution Board" 
          subtitle="Programmatic operational roadmap targets sorted by logical task status state." 
        />

        {/* Unified Processing Pipelines Kanban Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column: To Do */}
          <div className="bg-neutral-50/80 p-4 border border-neutral-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider font-mono">Backlog Queue</span><span className="text-[10px] bg-neutral-200 text-neutral-600 font-mono px-1.5 rounded-full">{board.todo.length}</span></div>
            {board.todo.map(task => (
              <div key={task.id} className="bg-white border border-neutral-200 p-3.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-neutral-400 cursor-pointer transition-colors space-y-2">
                <h4 className="text-xs font-medium text-neutral-900 leading-snug">{task.title}</h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-50">
                  <span className="text-rose-600 bg-rose-50 px-1 rounded">{task.priority}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column: In Progress */}
          <div className="bg-neutral-50/80 p-4 border border-neutral-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider font-mono">Active Run Trace</span><span className="text-[10px] bg-neutral-200 text-neutral-600 font-mono px-1.5 rounded-full">{board.progress.length}</span></div>
            {board.progress.map(task => (
              <div key={task.id} className="bg-white border border-neutral-200 p-3.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-neutral-400 cursor-pointer transition-colors space-y-2">
                <h4 className="text-xs font-medium text-neutral-900 leading-snug">{task.title}</h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-50">
                  <span className="text-amber-600 bg-amber-50 px-1 rounded">{task.priority}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column: Completed */}
          <div className="bg-neutral-50/80 p-4 border border-neutral-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider font-mono">Terminated Executions</span><span className="text-[10px] bg-neutral-200 text-neutral-600 font-mono px-1.5 rounded-full">{board.done.length}</span></div>
            {board.done.map(task => (
              <div key={task.id} className="bg-white border border-neutral-200 p-3.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.01)] opacity-75 space-y-2">
                <h4 className="text-xs font-medium text-neutral-400 line-through leading-snug">{task.title}</h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 pt-1 border-t border-neutral-50">
                  <span className="flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Core Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auxiliary Auxiliary Target Metrics Panel */}
      <div className="w-full xl:w-72 space-y-4 xl:mt-16">
        <div className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 font-mono uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-neutral-400" /> Operational Context
          </div>
          <div className="text-xs text-neutral-500 leading-normal space-y-2 pt-1">
            <p>Execution tracking follows synchronous lifecycle constraints. Drag cards into active compile channels to update aggregated pipeline dashboards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}