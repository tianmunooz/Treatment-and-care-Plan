import React from 'react';
import { Phase, Treatment, Definitions } from '../types';
import { TreatmentItem } from './TreatmentItem';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { PlusIcon, TrashIcon } from './icons';
import { Language } from '../i18n';

interface PhaseSectionProps {
  phase: Phase;
  updatePhase: (updatedPhase: Phase) => void;
  removePhase: () => void;
  onAddTreatment: (phaseId: string) => void;
  onSaveTreatment: (treatment: Treatment, phaseId: string) => void;
  onRemoveTreatment: (treatmentId: string, phaseId: string) => void;
  animatedTreatmentId: string | null;
  clearAnimation: () => void;
  onMoveTreatment: (treatmentId: string, sourcePhaseId: string, targetPhaseId: string, targetTreatmentId: string | null) => void;
  definitions: Definitions;
  language: Language;
  setActivePhaseId: (id: string | null) => void;
}

export const PhaseSection: React.FC<PhaseSectionProps> = ({ 
  phase, 
  updatePhase, 
  removePhase, 
  onAddTreatment,
  onSaveTreatment,
  onRemoveTreatment,
  animatedTreatmentId,
  clearAnimation,
  onMoveTreatment,
  definitions,
  language,
  setActivePhaseId,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handlePhaseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePhase({ ...phase, title: e.target.value });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
    }
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const sourceTreatmentId = e.dataTransfer.getData('treatmentId');
    const sourcePhaseId = e.dataTransfer.getData('phaseId');

    if (!sourceTreatmentId || !sourcePhaseId) return;

    const targetElement = e.target as HTMLElement;
    const dropTargetItem = targetElement.closest('[data-treatment-id]');
    const targetTreatmentId = dropTargetItem ? dropTargetItem.getAttribute('data-treatment-id') : null;
    
    if (sourceTreatmentId === targetTreatmentId) return;

    onMoveTreatment(sourceTreatmentId, sourcePhaseId, phase.id, targetTreatmentId);
  };

  return (
      <div 
        onFocusCapture={() => setActivePhaseId(phase.id)}
        className={`p-6 bg-white rounded-2xl shadow-sm border ${isDragOver ? 'border-2 border-dashed border-brand-primary' : 'border-brand-background-strong'} transition-all`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
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
              onSave={onSaveTreatment}
              onRemove={onRemoveTreatment}
              animatedTreatmentId={animatedTreatmentId}
              clearAnimation={clearAnimation}
              definitions={definitions}
              language={language}
            />
          ))}
          {phase.treatments.length === 0 && (
            <div onClick={() => onAddTreatment(phase.id)} className="text-center py-8 text-sm text-brand-text-body border border-dashed border-brand-strong rounded-lg cursor-pointer hover:border-brand-primary hover:text-brand-primary transition-colors">
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