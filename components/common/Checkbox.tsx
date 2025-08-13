import React from 'react';
import { CheckIcon } from '../icons';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, ...props }) => {
  return (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        className="sr-only" // Hide default browser checkbox
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
          checked
            ? 'bg-brand-primary border-brand-primary'
            : 'bg-white border-brand-background-strong group-hover:border-brand-primary'
        }`}
      >
        {checked && <CheckIcon className="w-3 h-3 text-white" />}
      </div>
      <span className="ml-2 text-sm text-brand-text-secondary">{label}</span>
    </label>
  );
};
