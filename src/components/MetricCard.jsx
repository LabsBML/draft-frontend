import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../utils';

export default function MetricCard({ label, value, trend, trendType = 'positive' }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white border border-neutral-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
    >
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-3xl font-semibold text-neutral-900 tracking-tight">{value}</span>
        {trend && (
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full",
            trendType === 'positive' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          )}>
            {trendType === 'positive' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}