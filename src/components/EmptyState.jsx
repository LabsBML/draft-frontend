import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50 min-h-[360px]"
    >
      {Icon && <Icon className="w-8 h-8 text-neutral-400 stroke-[1.5]" />}
      <h3 className="mt-4 text-sm font-medium text-neutral-900">{title}</h3>
      <p className="mt-1.5 text-xs text-neutral-500 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}