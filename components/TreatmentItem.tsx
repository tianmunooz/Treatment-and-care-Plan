import React, { useState, useEffect } from 'react';
import { Treatment, Phase, IconName } from '../types';
import { Input, TextArea } from './common/Input';
import { Select } from './common/Select';
import { Button } from './common/Button';
import { TrashIcon, DragHandleIcon, CalendarIcon, EditIcon, CheckIcon, CancelIcon, SyringeIcon } from './icons';
import { TREATMENT_ICONS } from '../constants';

interface TreatmentItemProps {
  treatment: Treatment;
  phaseId: string;
  allPhases: Phase[];
  onSave: (treatment: Treatment, phaseId: string) => void;
  onRemove: (treatmentId: string, phaseId: string) => void;
  animatedTreatmentId: string | null;
  clearAnimation: () => void;
}

export const TreatmentItem: React.FC<TreatmentItemProps> = ({ treatment, phaseId, allPhases, onSave, onRemove, animatedTreatmentId, clearAnimation }) => {
  const [isEditing, setIsEditing] = useState(() => !treatment.name);
  const [formState, setFormState] = useState<Treatment>(treatment);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(phaseId);

  const isAnimated = treatment.id === animatedTreatmentId;

  useEffect(() => {
    if (isAnimated) {
      const timer = setTimeout(() => {
        clearAnimation();
      }, 2000); // Duration matches the aurora-glow animation

      return () => clearTimeout(timer);
    }
  }, [isAnimated, clearAnimation]);

  useEffect(() => {
    if (!isEditing) {
      setFormState(treatment);
      setSelectedPhaseId(phaseId);
    }
  }, [treatment, phaseId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    }));
  };
  
  const handleSave = () => {
    if (formState.name) { // Only save if there's a name
        onSave(formState, selectedPhaseId);
        setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    if (!treatment.name) {
      onRemove(treatment.id, phaseId);
    } else {
      setFormState(treatment);
      setSelectedPhaseId(phaseId);
      setIsEditing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const CurrentIcon = TREATMENT_ICONS[treatment.icon]?.icon || SyringeIcon;

  if (isEditing) {
    return (
      <div className="p-4 bg-white rounded-lg border-2 border-brand-primary space-y-4 relative ring-4 ring-brand-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <Input 
                label="Treatment Name"
                name="name" 
                value={formState.name} 
                onChange={handleChange} 
                placeholder="e.g., CoolSculpting"
                wrapperClassName="md:col-span-1"
            />
             <Select
                label="Phase"
                name="phase"
                value={selectedPhaseId}
                onChange={(e) => setSelectedPhaseId(e.target.value)}
                wrapperClassName="md:col-span-1"
            >
                {allPhases.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </Select>
            <TextArea
                label="Goal"
                name="goal"
                value={formState.goal}
                onChange={handleChange}
                placeholder="e.g., In-depth consultation and skin assessment..."
                rows={2}
                wrapperClassName="md:col-span-2"
            />
             <TextArea
                label="Key Instructions"
                name="keyInstructions"
                value={formState.keyInstructions}
                onChange={handleChange}
                placeholder="e.g., Avoid sun exposure 48h..."
                rows={2}
                wrapperClassName="md:col-span-2"
            />
            <Input 
                label="Price ($)"
                name="price"
                type="number"
                value={formState.price}
                onChange={handleChange}
                placeholder="150"
                wrapperClassName="md:col-span-1"
            />
            <Input 
                label="Week"
                name="week"
                value={formState.week}
                onChange={handleChange}
                placeholder="e.g., Week 1"
                wrapperClassName="md:col-span-1"
            />
            <Input 
                label="Frequency"
                name="frequency"
                value={formState.frequency}
                onChange={handleChange}
                placeholder="e.g., Month 1"
                wrapperClassName="md:col-span-1"
                Icon={CalendarIcon}
            />
            <Select
                label="Icon"
                name="icon"
                value={formState.icon}
                onChange={handleChange}
                wrapperClassName="md:col-span-1"
            >
                {Object.entries(TREATMENT_ICONS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </Select>
        </div>
        
        <div className="flex justify-end items-center space-x-2 pt-2 border-t border-brand-background-soft mt-4">
            <Button variant="ghost" onClick={handleCancel} Icon={CancelIcon} className="text-brand-text-secondary">Cancel</Button>
            <Button variant="secondary" onClick={handleSave} Icon={CheckIcon} className="!bg-brand-primary !text-white hover:!bg-brand-primary-dark">Save</Button>
        </div>
      </div>
    );
  }

  const cardContent = (
    <div className="flex items-start space-x-3">
        <button className="text-brand-text-body cursor-grab pt-1 focus:outline-none">
          <DragHandleIcon className="w-5 h-5" />
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <CurrentIcon className="w-5 h-5 text-brand-primary" />
              <p className="text-brand-text-primary font-semibold">{treatment.name || "Untitled Treatment"}</p>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-blue-50 transition-colors group/button"
                aria-label="Edit treatment"
              >
                <EditIcon className="h-4 w-4 text-brand-text-secondary group-hover/button:text-brand-primary transition-colors" />
              </button>
              <button
                onClick={() => onRemove(treatment.id, phaseId)}
                className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-red-50 transition-colors group/button"
                aria-label="Remove treatment"
              >
                <TrashIcon className="h-4 w-4 text-brand-text-secondary group-hover/button:text-brand-error transition-colors" />
              </button>
            </div>
          </div>

          <div className="pl-8 mt-1">
            <p className="text-brand-text-secondary text-sm">{treatment.goal}</p>
            <div className="flex justify-between items-end mt-2">
              <div className="flex items-center text-sm text-brand-text-secondary">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{treatment.frequency}</span>
              </div>
              <p className="font-semibold text-md text-brand-text-primary">
                {formatCurrency(treatment.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
  );

  if (isAnimated) {
    return (
       <div className="relative p-0.5 rounded-lg group overflow-hidden">
        <div 
          className="absolute inset-0 bg-aurora-gradient bg-300 animate-gradient-shift animate-aurora-glow"
        ></div>
        <div className="relative bg-white rounded-[7px] p-4">
            {cardContent}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg border border-brand-background-medium group`}>
      {cardContent}
    </div>
  );
};