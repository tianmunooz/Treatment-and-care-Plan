
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
  Icon?: React.ElementType;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, wrapperClassName = '', Icon, list, ...props }, ref) => {
    const baseClasses = "block w-full px-3 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors sm:text-sm";
    const styleClasses = "bg-white border border-brand-background-strong text-brand-text-primary placeholder-gray-400";
    const iconColor = 'text-gray-400';
    
    return (
      <div className={wrapperClassName}>
        {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
        <div className="relative">
          {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className={`w-5 h-5 ${iconColor}`} /></div>}
          <input
            id={id}
            ref={ref}
            className={`${baseClasses} ${styleClasses} ${Icon ? 'pl-10' : ''}`}
            list={list}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';


interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
  inputClassName?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, id, wrapperClassName = '', inputClassName = '', ...props }) => {
    const baseClasses = "block w-full px-3 py-2 bg-white border border-brand-background-strong rounded-lg text-brand-text-primary placeholder-gray-400 focus:outline-none focus:border-blue-500 sm:text-sm transition-colors";

    return (
        <div className={wrapperClassName}>
            {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>}
            <textarea
                id={id}
                className={`${baseClasses} ${inputClassName}`}
                rows={3}
                {...props}
            />
        </div>
    );
};
