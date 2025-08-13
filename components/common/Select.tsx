
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  wrapperClassName?: string;
  Icon?: React.ElementType;
}

export const Select: React.FC<SelectProps> = ({ label, id, wrapperClassName = '', Icon, children, ...props }) => {
  const baseClasses = "block w-full pl-3 pr-10 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors sm:text-sm appearance-none";
  const styleClasses = "bg-white border border-brand-background-strong text-brand-text-primary";
  const iconColor = 'text-gray-400';
  const chevronColor = 'text-gray-700';

  return (
    <div className={`relative ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
      <div className="relative">
        {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className={`w-5 h-5 ${iconColor}`} /></div>}
        <select
          id={id}
          className={`${baseClasses} ${styleClasses} ${Icon ? 'pl-10' : ''}`}
          {...props}
        >
          {children}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${chevronColor}`}>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
