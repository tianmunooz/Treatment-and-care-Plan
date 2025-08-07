import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { OptionDefinition } from '../../types';
import { Language } from '../../i18n';

interface MultiSelectDropdownProps {
  label: string;
  options: OptionDefinition[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  wrapperClassName?: string;
  language: Language;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  wrapperClassName = '',
  language,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionKey: string) => {
    const newSelectedOptions = selectedOptions.includes(optionKey)
      ? selectedOptions.filter(o => o !== optionKey)
      : [...selectedOptions, optionKey];
    onChange(newSelectedOptions);
  };

  const removeOption = (optionKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedOptions = selectedOptions.filter(o => o !== optionKey);
    onChange(newSelectedOptions);
  }

  const selectedOptionObjects = options.filter(opt => selectedOptions.includes(opt.key));

  return (
    <div className={`relative ${wrapperClassName}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-brand-text-secondary">{label}</label>
      <div className="relative mt-1">
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center justify-between w-full pl-3 py-2 bg-white border border-brand-background-strong rounded-md shadow-sm text-brand-text-primary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-left"
        >
          <span className="flex flex-wrap gap-1">
            {selectedOptionObjects.length > 0 ? (
              selectedOptionObjects.map(opt => (
                <span key={opt.key} className="flex items-center gap-1 bg-brand-primary text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {opt.name[language]}
                  <X onClick={(e) => removeOption(opt.key, e)} className="w-3 h-3 cursor-pointer hover:bg-black/20 rounded-full" />
                </span>
              ))
            ) : (
              <span className="text-brand-text-body">Select areas...</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-700 mr-2" />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-brand-background-strong rounded-md max-h-60 overflow-auto">
            <ul className="py-1">
              {options.map(option => (
                <li
                  key={option.key}
                  className="px-3 py-2 text-sm text-brand-text-primary cursor-pointer hover:bg-brand-background-soft flex items-center"
                  onClick={() => handleOptionClick(option.key)}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.key)}
                    readOnly
                    className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary mr-3"
                  />
                  {option.name[language]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};