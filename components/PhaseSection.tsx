import React from 'react';
import { Phase, Treatment } from '../types';
import { TreatmentItem } from './TreatmentItem';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { PlusIcon, TrashIcon } from './icons';

interface PhaseSectionProps {
  phase: Phase;
  allPhases: Phase[];
  updatePhase: (updatedPhase: Phase) => void;
  removePhase: () => void;
  onAddTreatment: (phaseId: string) => void;
  onSaveTreatment: (treatment: Treatment, phaseId: string) => void;
  onRemoveTreatment: (treatmentId: string, phaseId: string) => void;
  animatedTreatmentId: string | null;
  clearAnimation: () => void;
}

export const PhaseSection: React.FC<PhaseSectionProps> = ({ 
  phase, 
  allPhases,
  updatePhase, 
  removePhase, 
  onAddTreatment,
  onSaveTreatment,
  onRemoveTreatment,
  animatedTreatmentId,
  clearAnimation
}) => {
  const handlePhaseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePhase({ ...phase, title: e.target.value });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-brand-background-strong">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-grow mr-4">
            <Input 
              value={phase.title} 
              onChange={handlePhaseTitleChange} 
              placeholder="Phase Title" 
              className="text-lg font-semibold !p-0 border-0 shadow-none focus:ring-0 bg-transparent text-brand-text-primary w-full"
            />
        </div>
        <div className="flex-shrink-0">
             <Button variant="ghost" onClick={removePhase} className="!p-2 text-brand-text-secondary hover:text-brand-error hover:bg-red-50" aria-label="Delete phase">
                <TrashIcon className="h-5 w-5" />
            </Button>
        </div>
      </div>
      <div className="space-y-3">
        {phase.treatments.map((treatment) => (
          <TreatmentItem
            key={treatment.id}
            treatment={treatment}
            phaseId={phase.id}
            allPhases={allPhases}
            onSave={onSaveTreatment}
            onRemove={onRemoveTreatment}
            animatedTreatmentId={animatedTreatmentId}
            clearAnimation={clearAnimation}
          />
        ))}
        {phase.treatments.length === 0 && (
          <div onClick={() => onAddTreatment(phase.id)} className="text-center py-8 text-sm text-brand-text-body border border-dashed border-brand-background-strong rounded-lg cursor-pointer hover:border-brand-primary hover:text-brand-primary transition-colors">
            <p>This phase has no treatments yet.</p>
            <p className="mt-1">Click to add a treatment.</p>
          </div>
        )}
      </div>

      {phase.treatments.length > 0 && (
        <div className="mt-4">
           <Button variant="secondary" onClick={() => onAddTreatment(phase.id)} Icon={PlusIcon} className="w-full justify-center py-2.5">
            Add Treatment
          </Button>
        </div>
      )}
    </div>
  );
};