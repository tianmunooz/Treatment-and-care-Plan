import React from 'react';
import { PlanTemplate } from '../types';
import { Button } from './common/Button';
import { PlusIcon } from './icons';
import { Language, TranslationKey } from '../i18n';

interface TemplateCardProps {
  template: PlanTemplate;
  onSelect: (template: PlanTemplate) => void;
  isSuggested?: boolean;
  language: Language;
  t: (key: TranslationKey) => string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, isSuggested = false, language, t }) => {
  const title = template.title[language] || template.title.en;
  const notes = template.notes[language] || template.notes.en;

  if (template.id === 'blank-plan') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(JSON.parse(JSON.stringify(template)))}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(JSON.parse(JSON.stringify(template)))}
        className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-background-strong p-6 transition-colors hover:border-brand-primary hover:bg-brand-background-soft cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-background-medium">
            <PlusIcon className="h-6 w-6 text-brand-primary" />
          </div>
          <p className="text-xl font-semibold text-brand-text-primary">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-brand-background-strong bg-white shadow-sm transition-transform hover:scale-105">
      {isSuggested && (
        <div className="absolute top-2 right-2 z-10 rounded-full bg-brand-primary px-2 py-1 text-xs font-bold text-white">
          {t('aiSuggestion')}
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <p className="text-xl font-semibold text-brand-text-primary">{title}</p>
          <p className="mt-3 text-base text-brand-text-secondary">{notes}</p>
        </div>
        <div className="mt-6">
          <Button
            onClick={() => onSelect(JSON.parse(JSON.stringify(template)))}
            className="w-full"
            variant={isSuggested ? 'primary' : 'secondary'}
          >
            {t('selectTemplate')}
          </Button>
        </div>
      </div>
    </div>
  );
};