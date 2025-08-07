

import React, { useState } from 'react';
import { Definitions, PlanTemplate } from '../types';
import { geminiService } from '../services/geminiService';
import { TextArea } from './common/Input';
import { TemplateCard } from './TemplateCard';
import { TemplatePreview } from './TemplatePreview';
import { PlusIcon, MicrophoneIcon, ArrowUpIcon, FileTextIcon } from './icons';
import { Language, TranslationKey } from '../i18n';

interface TemplateSelectorProps {
  onSelectTemplate: (template: PlanTemplate, patientData?: { name: string; age: number; sex: string }) => void;
  language: Language;
  definitions: Definitions;
  t: (key: TranslationKey) => string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate, language, definitions, t }) => {
  const [consultNotes, setConsultNotes] = useState('');
  const [suggestedTemplate, setSuggestedTemplate] = useState<PlanTemplate | null>(null);
  const [suggestedPatientData, setSuggestedPatientData] = useState<{ name: string, age: number, sex: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleGeneratePlan = async () => {
    if (!consultNotes.trim()) return;
    setIsLoading(true);
    setError(null);
    setSuggestedTemplate(null);
    setSuggestedPatientData(null);
    try {
      const { template: suggestion, patientData } = await geminiService.generatePlanFromNotes(consultNotes, definitions);
      setSuggestedTemplate(suggestion);
      if (patientData && patientData.name) {
          setSuggestedPatientData(patientData);
      }
    } catch (err) {
      console.error("Failed to get AI suggestion:", err);
      setError("We couldn't generate a plan. Please try again or check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const remainingTemplates = definitions.planTemplates.filter(
    (t) => t.id !== suggestedTemplate?.id
  );
  
  const templateCategories = definitions.options.templateCategories || [];

  const filteredTemplates = remainingTemplates.filter(template => {
    if (template.id === 'blank-plan') return false; // Handled separately
    if (selectedCategory === 'all') return true;
    return template.categoryKey === selectedCategory;
  });

  const blankTemplate = remainingTemplates.find(t => t.id === 'blank-plan');

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Suggestion Section */}
        <div
          id="tutorial-ai-suggestion"
          className="relative pt-12 pb-24 sm:pt-16 sm:pb-32"
        >
          <div className="relative mx-auto max-w-5xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-primary">{t('aiSuggestionTitle')}</h2>
            <p className="mt-4 text-base sm:text-lg text-brand-text-secondary">
              {t('aiSuggestionSubtitle')}
            </p>
            
            <div className="mt-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl p-4 flex flex-col space-y-4 border border-brand-background-strong">
                    <TextArea
                        value={consultNotes}
                        onChange={(e) => setConsultNotes(e.target.value)}
                        placeholder="Describe patient concerns... e.g., 'Jane D., 42, forehead lines & cheek sun spots.'"
                        rows={4}
                        inputClassName="bg-transparent border-none rounded-xl focus:ring-0 resize-none p-4 text-base sm:text-lg !mt-0 shadow-none"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                             <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-brand-background-strong text-brand-text-secondary hover:bg-brand-background-soft transition-colors">
                                <PlusIcon className="w-5 h-5" />
                            </button>
                            <button className="flex items-center justify-center text-sm font-medium w-9 h-9 sm:w-auto sm:h-auto sm:gap-2 sm:px-4 sm:py-2 rounded-full bg-white border border-brand-background-strong text-brand-text-secondary hover:bg-brand-background-soft transition-colors">
                                <FileTextIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Import Transcript</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-brand-background-strong text-brand-text-secondary hover:bg-brand-background-soft transition-colors">
                                <MicrophoneIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleGeneratePlan} 
                                disabled={isLoading || !consultNotes.trim()} 
                                className="w-10 h-10 rounded-full bg-brand-background-medium hover:bg-brand-background-strong text-brand-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                aria-label="Generate plan"
                            >
                               {isLoading ? 
                                    <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div> :
                                    <ArrowUpIcon className="w-5 h-5" />
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {isLoading && <div className="mt-6 text-center text-brand-text-secondary animate-pulse">{t('analyzing')}</div>}
            
            {error && <div className="mt-6 text-center text-red-600">{error}</div>}

            {suggestedTemplate && !isLoading && (
              <div className="mt-10 animate-fade-in">
                <TemplatePreview
                  template={suggestedTemplate}
                  onSelect={() => onSelectTemplate(suggestedTemplate, suggestedPatientData || undefined)}
                  definitions={definitions}
                  language={language}
                  t={t}
                />
              </div>
            )}
          </div>
        </div>

        {/* Template Library Section */}
        <div id="tutorial-template-library" className="bg-white rounded-2xl shadow-md p-8 sm:p-12 mb-20">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-brand-text-primary mb-2">{t('orStartFromTemplate')}</h3>
              </div>
              <div className="flex justify-center flex-wrap gap-2 mb-8">
                  <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out border ${
                          selectedCategory === 'all'
                              ? 'bg-brand-primary text-white border-brand-primary'
                              : 'bg-white text-brand-text-secondary border-brand-background-strong hover:border-brand-primary hover:text-brand-primary'
                      }`}
                  >
                      All
                  </button>
                  {templateCategories.map(category => (
                      <button
                          key={category.key}
                          onClick={() => setSelectedCategory(category.key)}
                          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out border ${
                              selectedCategory === category.key
                                  ? 'bg-brand-primary text-white border-brand-primary'
                                  : 'bg-white text-brand-text-secondary border-brand-background-strong hover:border-brand-primary hover:text-brand-primary'
                          }`}
                      >
                          {category.name[language]}
                      </button>
                  ))}
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                {blankTemplate && (
                  <TemplateCard key={blankTemplate.id} template={blankTemplate} onSelect={(t) => onSelectTemplate(t)} language={language} t={t} />
                )}
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} onSelect={(t) => onSelectTemplate(t)} language={language} t={t} />
                ))}
              </div>
        </div>
      </div>
    </div>
  );
};