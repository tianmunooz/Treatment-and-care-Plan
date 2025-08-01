import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  wrapperClassName?: string;
  Icon?: React.ElementType;
}

export const Select: React.FC<SelectProps> = ({ label, id, wrapperClassName = '', Icon, children, ...props }) => {
  const baseClasses = "mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-brand-background-strong rounded-md shadow-sm text-brand-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm appearance-none";
  
  return (
    <div className={`relative ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary">{label}</label>}
      <div className="relative mt-1">
        {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400" /></div>}
        <select
          id={id}
          className={`${baseClasses} ${Icon ? 'pl-10' : ''}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
