import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plan, Phase, Treatment, IconName } from '../types';
import { PhaseSection } from './PhaseSection';
import { Button } from './common/Button';
import { PlusIcon, SparkleIcon, PackageIcon, ClockIcon, FacialIcon, SyringeIcon } from './icons';

interface PlanBuilderProps {
  plan: Plan;
  setPlan: (plan: Plan) => void;
}

const AiSuggestions = ({ onAddTreatment }: { onAddTreatment: (treatment: Partial<Treatment>) => void }) => {
  const suggestions = [
    { name: 'Add Microneedling', icon: SyringeIcon, treatment: { name: 'Microneedling', goal: 'Stimulates collagen production.', frequency: 'As discussed', price: 450, icon: 'Syringe' as IconName, week: 'TBD', keyInstructions: 'Avoid retinol 5 days prior.' }, color: 'blue' },
    { name: 'Skincare Package', icon: PackageIcon, treatment: { name: 'At-home Skincare Package', goal: 'Medical-grade products.', frequency: 'Ongoing', price: 300, icon: 'Package' as IconName, week: 'Ongoing', keyInstructions: 'Follow AM/PM routine strictly.' }, color: 'purple' },
    { name: 'Maintenance Schedule', icon: ClockIcon, treatment: { name: 'Maintenance Follow-up', goal: 'Quarterly check-in.', frequency: 'Every 3 months', price: 150, icon: 'Clock' as IconName, week: 'Ongoing', keyInstructions: 'Book in advance.' }, color: 'green' },
    { name: 'Add Hydrating Facial', icon: FacialIcon, treatment: { name: 'Hydrating Facial', goal: 'Deeply hydrates and nourishes the skin.', frequency: 'As needed', price: 200, icon: 'Facial' as IconName, week: 'TBD', keyInstructions: 'Arrive with a clean face.' }, color: 'blue' },
  ];

  const colorClasses: { [key: string]: { bg: string, text: string, button: string, iconWrapper?: string } } = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'border-brand-background-strong hover:bg-blue-50', iconWrapper: 'rounded-full' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'border-brand-background-strong hover:bg-purple-50', iconWrapper: 'rounded-md' },
    green: { bg: 'bg-green-100', text: 'text-green-600', button: 'border-brand-background-strong hover:bg-green-50', iconWrapper: 'rounded-full' },
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-brand-background-strong">
      <div className="flex items-center space-x-2">
        <SparkleIcon className="w-6 h-6 text-purple-600" />
        <h3 className="font-semibold text-lg text-brand-text-primary">AI Suggestions</h3>
      </div>
      <p className="text-sm text-brand-text-secondary mt-1">Tap to add recommended treatments or optimize your plan.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {suggestions.map((sugg) => {
          const classes = colorClasses[sugg.color] || colorClasses.blue;
          return (
            <button 
              key={sugg.name} 
              onClick={() => onAddTreatment(sugg.treatment)}
              className={`flex items-center p-2.5 text-left bg-white rounded-lg border ${classes.button} transition-colors w-full`}
            >
              <div className={`flex items-center justify-center w-8 h-8 ${classes.iconWrapper} ${classes.bg} mr-3 flex-shrink-0`}>
                  <sugg.icon className={`w-5 h-5 ${classes.text}`} />
              </div>
              <span className="text-sm font-medium text-brand-text-primary">{sugg.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
};


export const PlanBuilder: React.FC<PlanBuilderProps> = ({ plan, setPlan }) => {
  const [animatedTreatmentId, setAnimatedTreatmentId] = React.useState<string | null>(null);

  const clearAnimation = () => {
    setAnimatedTreatmentId(null);
  };

  const addPhase = () => {
    const newPhase: Phase = {
      id: uuidv4(),
      title: `Phase ${plan.phases.length + 1}`,
      treatments: [],
      controlsAndMetrics: [],
    };
    setPlan({ ...plan, phases: [...plan.phases, newPhase] });
  };

  const updatePhase = (index: number, updatedPhase: Phase) => {
    const newPhases = [...plan.phases];
    newPhases[index] = updatedPhase;
    setPlan({ ...plan, phases: newPhases });
  };

  const removePhase = (index: number) => {
    const newPhases = plan.phases.filter((_, i) => i !== index);
    setPlan({ ...plan, phases: newPhases });
  };

  const addTreatmentToPhase = (phaseId: string) => {
    const newTreatment: Treatment = {
        id: uuidv4(),
        name: '',
        goal: '',
        frequency: '',
        price: 0,
        icon: 'Syringe',
        week: '',
        keyInstructions: '',
    };
    const newPhases = plan.phases.map(p => {
        if (p.id === phaseId) {
            return { ...p, treatments: [...p.treatments, newTreatment] };
        }
        return p;
    });
    setPlan({ ...plan, phases: newPhases });
  };
  
  const handleSaveTreatment = (treatmentToSave: Treatment, targetPhaseId: string) => {
    const newPhases = [...plan.phases];
    let sourcePhaseIndex = -1;
    let treatmentIndex = -1;

    // Find the source of the treatment, if it exists
    for (let i = 0; i < newPhases.length; i++) {
        const foundIndex = newPhases[i].treatments.findIndex(t => t.id === treatmentToSave.id);
        if (foundIndex !== -1) {
            sourcePhaseIndex = i;
            treatmentIndex = foundIndex;
            break;
        }
    }

    const targetPhaseIndex = newPhases.findIndex(p => p.id === targetPhaseId);
    if (targetPhaseIndex === -1) return;

    // If treatment exists
    if (sourcePhaseIndex !== -1) {
        // If phase is the same, just update
        if (newPhases[sourcePhaseIndex].id === targetPhaseId) {
            newPhases[sourcePhaseIndex].treatments[treatmentIndex] = treatmentToSave;
        } else {
            // If phase is different, move it
            newPhases[sourcePhaseIndex].treatments.splice(treatmentIndex, 1);
            newPhases[targetPhaseIndex].treatments.push(treatmentToSave);
        }
    } else {
        // If treatment is new, add it
        newPhases[targetPhaseIndex].treatments.push(treatmentToSave);
    }

    setPlan({ ...plan, phases: newPhases });
  };
  
  const handleRemoveTreatment = (treatmentId: string, phaseId: string) => {
    const newPhases = plan.phases.map(p => {
        if (p.id === phaseId) {
            return { ...p, treatments: p.treatments.filter(t => t.id !== treatmentId) };
        }
        return p;
    });
    setPlan({ ...plan, phases: newPhases });
  };
  
  const addSuggestedTreatment = (treatmentData: Partial<Treatment>) => {
    const newTreatment: Treatment = {
      id: uuidv4(),
      name: treatmentData.name || 'New Treatment',
      goal: treatmentData.goal || '',
      frequency: treatmentData.frequency || '',
      price: treatmentData.price || 0,
      icon: treatmentData.icon || 'Syringe',
      week: treatmentData.week || '',
      keyInstructions: treatmentData.keyInstructions || '',
    };

    let newPhases = [...plan.phases];

    if (newPhases.length > 0) {
      // Add to the last phase
      const lastPhaseIndex = newPhases.length - 1;
      newPhases[lastPhaseIndex] = {
        ...newPhases[lastPhaseIndex],
        treatments: [...newPhases[lastPhaseIndex].treatments, newTreatment],
      };
    } else {
      // No phases, create one
      newPhases.push({
        id: uuidv4(),
        title: 'Phase 1',
        treatments: [newTreatment],
        controlsAndMetrics: [],
      });
    }

    setPlan({ ...plan, phases: newPhases });
    setAnimatedTreatmentId(newTreatment.id);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4">
        <div className="space-y-4">
          {plan.phases.map((phase, index) => (
            <PhaseSection
              key={phase.id}
              phase={phase}
              allPhases={plan.phases}
              updatePhase={(updated) => updatePhase(index, updated)}
              removePhase={() => removePhase(index)}
              onAddTreatment={addTreatmentToPhase}
              onSaveTreatment={handleSaveTreatment}
              onRemoveTreatment={handleRemoveTreatment}
              animatedTreatmentId={animatedTreatmentId}
              clearAnimation={clearAnimation}
            />
          ))}
        </div>

        <Button variant="ghost" onClick={addPhase} Icon={PlusIcon} className="w-full justify-center py-3 shadow-none">
          Add Phase
        </Button>
        
        <AiSuggestions onAddTreatment={addSuggestedTreatment} />
      </div>
    </div>
  );
};