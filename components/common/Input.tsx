import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
  Icon?: React.ElementType;
}

export const Input: React.FC<InputProps> = ({ label, id, wrapperClassName = '', Icon, ...props }) => {
  const baseClasses = "block w-full px-3 py-2 bg-white border border-brand-background-strong rounded-md shadow-sm text-brand-text-primary placeholder-brand-text-body focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";
  
  return (
    <div className={wrapperClassName}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary">{label}</label>}
      <div className="relative mt-1">
        {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="w-5 h-5 text-gray-400" /></div>}
        <input
          id={id}
          className={`${baseClasses} ${Icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
  inputClassName?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, id, wrapperClassName = '', inputClassName = '', ...props }) => {
    const baseClasses = "mt-1 block w-full px-3 py-2 bg-white border border-brand-background-strong rounded-md shadow-sm text-brand-text-primary placeholder-brand-text-body focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";

    return (
        <div className={wrapperClassName}>
            {label && <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary">{label}</label>}
            <textarea
                id={id}
                className={`${baseClasses} ${inputClassName}`}
                rows={3}
                {...props}
            />
        </div>
    );
};