import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plan, Phase, Treatment, IconName, Definitions } from '../types';
import { PhaseSection } from './PhaseSection';
import { Button } from './common/Button';
import { PlusIcon, SparkleIcon, PackageIcon, ClockIcon, FacialIcon, SyringeIcon, WrenchIcon } from './icons';
import { Language, TranslationKey, getTranslator } from '../i18n';
import { PatientInfoPanel } from './PatientInfoPanel';
import { ContraindicationsPanel } from './ContraindicationsPanel';

interface PlanBuilderProps {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  language: Language;
  definitions: Definitions;
  t: (key: TranslationKey) => string;
  setActivePhaseId: (id: string | null) => void;
}

const AiSuggestions = ({ onAddTreatment, language, t }: { onAddTreatment: (treatment: Partial<Treatment>) => void, language: Language, t: (key: TranslationKey) => string }) => {
  const suggestions = [
    { name: 'Add Microneedling', icon: SyringeIcon, treatment: { categoryKey: 'facials-peels', treatmentKey: 'microneedling', goal: 'Stimulates collagen production.', frequency: 'as-needed', price: 450, icon: 'Syringe' as IconName, week: 'tbd', keyInstructions: 'Avoid retinol 5 days prior.', targetArea: ['full-face'] }, color: 'blue' },
    { name: 'Skincare Package', icon: PackageIcon, treatment: { categoryKey: 'skincare-medications', treatmentKey: 'medical-grade-vitamin-c-serum', goal: 'Medical-grade products for home.', frequency: 'daily', price: 150, icon: 'Package' as IconName, week: 'ongoing', keyInstructions: 'Follow AM/PM routine strictly.' }, color: 'purple' },
    { name: 'Maintenance Schedule', icon: ClockIcon, treatment: { categoryKey: 'consultations', treatmentKey: 'follow-up-consultation', goal: 'Quarterly check-in.', frequency: 'every-3-4-months', price: 100, icon: 'Clock' as IconName, week: 'ongoing', keyInstructions: 'Book in advance.' }, color: 'green' },
    { name: 'Add Hydrating Facial', icon: FacialIcon, treatment: { categoryKey: 'facials-peels', treatmentKey: 'hydrafacial-md', goal: 'Deeply hydrates and nourishes the skin.', frequency: 'as-needed', price: 250, icon: 'Facial' as IconName, week: 'tbd', keyInstructions: 'Arrive with a clean face.' }, color: 'blue' },
  ];

  const colorClasses: { [key: string]: { bg: string, text: string, button: string, iconWrapper?: string } } = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', button: 'border-brand-background-strong hover:bg-blue-50', iconWrapper: 'rounded-full' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', button: 'border-brand-background-strong hover:bg-purple-50', iconWrapper: 'rounded-md' },
    green: { bg: 'bg-green-100', text: 'text-green-600', button: 'border-brand-background-strong hover:bg-green-50', iconWrapper: 'rounded-full' },
  }

  return (
    <div id="tutorial-ai-suggestions-builder" className="p-6 bg-white rounded-2xl shadow-sm border border-brand-background-strong mt-6">
      <div className="flex items-center space-x-2">
        <SparkleIcon className="w-6 h-6 text-purple-600" />
        <h3 className="font-semibold text-lg text-brand-text-primary">{t('aiSuggestionsTitle')}</h3>
      </div>
      <p className="text-sm text-brand-text-secondary mt-1">{t('aiSuggestionsSubtitle')}</p>
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


export const PlanBuilder: React.FC<PlanBuilderProps> = ({ plan, setPlan, language, definitions, t, setActivePhaseId }) => {
  const [animatedTreatmentId, setAnimatedTreatmentId] = React.useState<string | null>(null);

  const clearAnimation = () => {
    setAnimatedTreatmentId(null);
  };

  const addPhase = () => {
    const nextPhaseIndex = plan.phases.length;
    const phaseTitles = definitions.options.phaseTitles || [];
    const newTitle = phaseTitles[nextPhaseIndex]?.name[language] || `Phase ${nextPhaseIndex + 1}`;

    const newPhase: Phase = {
      id: uuidv4(),
      title: newTitle,
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
        categoryKey: '',
        treatmentKey: '',
        goal: '',
        frequency: '',
        price: 0,
        icon: 'Syringe',
        week: '',
        keyInstructions: '',
        discount: 0,
        targetArea: [],
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

    for (let i = 0; i < newPhases.length; i++) {
        const foundIndex = newPhases[i].treatments.findIndex(t => t.id === treatmentToSave.id);
        if (foundIndex !== -1) {
            sourcePhaseIndex = i;
            treatmentIndex = foundIndex;
            break;
        }
    }
    
    const targetPhaseIndex = sourcePhaseIndex;

    if (sourcePhaseIndex !== -1) {
        newPhases[sourcePhaseIndex].treatments[treatmentIndex] = treatmentToSave;
    } else {
        const newTreatmentTargetPhaseIndex = newPhases.findIndex(p => p.id === targetPhaseId);
        if (newTreatmentTargetPhaseIndex !== -1) {
            newPhases[newTreatmentTargetPhaseIndex].treatments.push(treatmentToSave);
        }
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

  const handleMoveTreatment = (treatmentId: string, sourcePhaseId: string, targetPhaseId: string, targetTreatmentId: string | null) => {
    const newPhases = [...plan.phases];
    const sourcePhaseIndex = newPhases.findIndex(p => p.id === sourcePhaseId);
    const targetPhaseIndex = newPhases.findIndex(p => p.id === targetPhaseId);

    if (sourcePhaseIndex === -1 || targetPhaseIndex === -1) {
        return;
    }

    const sourcePhase = newPhases[sourcePhaseIndex];
    const treatmentIndex = sourcePhase.treatments.findIndex(t => t.id === treatmentId);

    if (treatmentIndex === -1) {
        return;
    }

    const [movedTreatment] = sourcePhase.treatments.splice(treatmentIndex, 1);
    const targetPhase = newPhases[targetPhaseIndex];

    if (targetTreatmentId) {
        const targetTreatmentIndex = targetPhase.treatments.findIndex(t => t.id === targetTreatmentId);
        if (targetTreatmentIndex !== -1) {
            targetPhase.treatments.splice(targetTreatmentIndex, 0, movedTreatment);
        } else {
            targetPhase.treatments.push(movedTreatment);
        }
    } else {
        targetPhase.treatments.push(movedTreatment);
    }
    setPlan({ ...plan, phases: newPhases });
  };
  
  const addSuggestedTreatment = (treatmentData: Partial<Treatment>) => {
    const newTreatment: Treatment = {
      id: uuidv4(),
      treatmentKey: treatmentData.treatmentKey || 'new-treatment',
      categoryKey: treatmentData.categoryKey || '',
      goal: treatmentData.goal || '',
      frequency: treatmentData.frequency || '',
      price: treatmentData.price || 0,
      icon: treatmentData.icon || 'Syringe',
      week: treatmentData.week || '',
      keyInstructions: treatmentData.keyInstructions || '',
      discount: treatmentData.discount || 0,
      targetArea: treatmentData.targetArea || [],
      units: treatmentData.units,
      dosage: treatmentData.dosage,
      application: treatmentData.application,
      intensity: treatmentData.intensity,
    };

    let newPhases = [...plan.phases];

    if (newPhases.length > 0) {
      const lastPhaseIndex = newPhases.length - 1;
      newPhases[lastPhaseIndex] = {
        ...newPhases[lastPhaseIndex],
        treatments: [...newPhases[lastPhaseIndex].treatments, newTreatment],
      };
    } else {
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
      <PatientInfoPanel plan={plan} setPlan={setPlan} />
      <ContraindicationsPanel plan={plan} setPlan={setPlan} />
      <div id="tutorial-phases-container" className="mt-4">
          {plan.phases.map((phase, index) => (
            <React.Fragment key={phase.id}>
              {index > 0 && (
                <div className="flex items-center justify-center my-2">
                  <div className="inline-flex flex-col items-center">
                    <div className="h-8 w-px flex-shrink-0 bg-brand-background-strong" />
                    <button
                      type="button"
                      className="my-2 flex-shrink-0 rounded-full bg-brand-background-medium px-4 py-1 text-xs font-semibold text-brand-text-secondary transition-colors hover:bg-brand-background-strong"
                    >
                      {t('nextPhase')}
                    </button>
                    <div className="h-8 w-px flex-shrink-0 bg-brand-background-strong" />
                  </div>
                </div>
              )}
              <PhaseSection
                phase={phase}
                updatePhase={(updated) => updatePhase(index, updated)}
                removePhase={() => removePhase(index)}
                onAddTreatment={addTreatmentToPhase}
                onSaveTreatment={handleSaveTreatment}
                onRemoveTreatment={handleRemoveTreatment}
                animatedTreatmentId={animatedTreatmentId}
                clearAnimation={clearAnimation}
                onMoveTreatment={handleMoveTreatment}
                definitions={definitions}
                language={language}
                setActivePhaseId={setActivePhaseId}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6">
          <Button id="tutorial-add-phase" variant="ghost" onClick={addPhase} Icon={PlusIcon} className="w-full justify-center py-3 shadow-none border-dashed hover:border-solid border-brand-background-strong text-brand-text-primary">
            Add Phase
          </Button>
        </div>
        
        <AiSuggestions onAddTreatment={addSuggestedTreatment} language={language} t={t} />
    </div>
  );
};