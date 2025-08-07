

import React from 'react';
import { PlanTemplate, Definitions, Language } from '../types';
import { Button } from './common/Button';
import { TranslationKey } from '../i18n';
import { SyringeIcon, PackageIcon, ClockIcon, FacialIcon, VialIcon } from './icons';

const iconMap: { [key: string]: React.ElementType } = {
    Syringe: SyringeIcon,
    Package: PackageIcon,
    Clock: ClockIcon,
    Facial: FacialIcon,
    Vial: VialIcon
};

export const TemplatePreview: React.FC<{
  template: PlanTemplate;
  onSelect: () => void;
  definitions: Definitions;
  language: Language;
  t: (key: TranslationKey) => string;
}> = ({ template, onSelect, definitions, language, t }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-brand-background-strong p-6 sm:p-8 max-w-3xl mx-auto text-left">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-brand-text-primary">{template.title[language]}</h3>
          <p className="text-md text-brand-text-secondary mt-1">{template.notes[language]}</p>
        </div>
        <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white whitespace-nowrap shadow-sm">
          {t('aiSuggestion')}
        </span>
      </div>
      <div className="space-y-6 mt-6 max-h-[50vh] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
        {template.phases.map((phase, index) => (
          <div key={phase.id}>
            <div className="flex items-center mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary-dark text-white font-bold mr-3 flex-shrink-0">
                    {index + 1}
                </div>
                <h4 className="font-semibold text-lg text-brand-text-primary">{phase.title || `Phase ${index + 1}`}</h4>
            </div>
            
            <div className="space-y-2 pl-6 border-l-2 border-brand-background-medium ml-4">
                {phase.treatments.map(treatment => {
                    const def = definitions.categories[treatment.categoryKey]?.items.find(i => i.key === treatment.treatmentKey);
                    const name = def ? def.name[language] : 'Unknown Treatment';
                    const Icon = iconMap[treatment.icon] || SyringeIcon;
                    return (
                        <div key={treatment.id} className="flex items-start p-3 bg-brand-background-soft rounded-lg">
                            <Icon className="w-5 h-5 text-brand-primary mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-brand-text-primary">{name}</p>
                                <p className="text-sm text-brand-text-body">{treatment.goal}</p>
                            </div>
                        </div>
                    );
                })}
                {phase.treatments.length === 0 && <p className="text-sm text-brand-text-body pl-3">No treatments in this phase.</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-brand-background-strong pt-6">
        <Button
          onClick={onSelect}
          className="w-full py-3 text-base"
          variant="primary"
        >
          {t('selectTemplate')}
        </Button>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C5CCD9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8C95A4;
        }
      `}</style>
    </div>
  );
};