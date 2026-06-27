import React from 'react';

export const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-[#111827] tracking-tight">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full bg-white border ${error ? 'border-[#EF4444]' : 'border-[#E5E7EB]'} rounded-md px-3 py-2 text-[15px] text-[#111827] placeholder-[#6B7280] focus-ring`}
        {...props}
      />
      {error && (
        <span className="text-[13px] text-[#EF4444] font-normal tracking-tight">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';