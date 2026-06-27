import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-5 mb-6"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">{title}</h1>
        <p className="text-sm text-neutral-500">{subtitle}</p>
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </motion.div>
  );
}