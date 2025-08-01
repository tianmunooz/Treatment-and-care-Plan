import React, { useState } from 'react';
import { PlanTemplate } from '../types';
import { PLAN_TEMPLATES } from '../constants';
import { geminiService } from '../services/geminiService';
import { TextArea } from './common/Input';
import { TemplateCard } from './TemplateCard';
import { PlusIcon, MicrophoneIcon, SparkleIcon } from './icons';

interface TemplateSelectorProps {
  onSelectTemplate: (template: PlanTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [consultNotes, setConsultNotes] = useState('');
  const [suggestedTemplate, setSuggestedTemplate] = useState<PlanTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestion = async () => {
    if (!consultNotes.trim()) return;
    setIsLoading(true);
    setSuggestedTemplate(null);
    try {
      const suggestion = await geminiService.suggestTemplate(consultNotes);
      setSuggestedTemplate(suggestion);
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingTemplates = PLAN_TEMPLATES.filter(
    (t) => t.title !== suggestedTemplate?.title
  );

  return (
    <>
      {/* AI Suggestion Section */}
      <div className="bg-white py-16 sm:py-20 border-b border-brand-background-strong">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-text-primary">Get an AI-Powered Suggestion</h2>
          <p className="mt-4 text-lg text-brand-text-secondary">
            Describe the patient's goals and let our AI create a starting plan for you.
          </p>
          
          <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col space-y-3 shadow-md border border-brand-background-strong">
                  <TextArea
                      value={consultNotes}
                      onChange={(e) => setConsultNotes(e.target.value)}
                      placeholder="e.g., 'Patient wants to reduce forehead wrinkles and improve overall skin texture for a more youthful look...'"
                      rows={3}
                      inputClassName="bg-transparent border-0 focus:ring-0 text-brand-text-primary placeholder-brand-text-secondary resize-none p-1 text-base sm:text-lg !mt-0"
                  />
                  <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                          <button className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-brand-background-soft text-brand-text-secondary transition-colors">
                              <PlusIcon className="w-5 h-5" />
                          </button>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                          <button className="p-2 rounded-lg hover:bg-brand-background-soft text-brand-text-secondary transition-colors">
                              <MicrophoneIcon className="w-5 h-5" />
                          </button>
                          <button 
                              onClick={handleGetSuggestion} 
                              disabled={isLoading || !consultNotes.trim()} 
                              className="p-2 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white disabled:opacity-50 disabled:bg-brand-secondary disabled:cursor-not-allowed transition-colors"
                          >
                              <SparkleIcon className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
          
          {isLoading && <div className="mt-6 text-center text-brand-text-secondary animate-pulse">Analyzing...</div>}
          
          {suggestedTemplate && !isLoading && (
            <div className="mt-10 max-w-xl mx-auto animate-fade-in">
              <TemplateCard template={suggestedTemplate} onSelect={onSelectTemplate} isSuggested />
            </div>
          )}
        </div>
      </div>

      {/* Template Library Section */}
      <div className="bg-brand-background-soft py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-brand-text-primary mb-8">Or, Start from a Template</h3>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {remainingTemplates.map((template) => (
                <TemplateCard key={template.title} template={template} onSelect={onSelectTemplate} />
              ))}
            </div>
        </div>
      </div>
    </>
  );
};