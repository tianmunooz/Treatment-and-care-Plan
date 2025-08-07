

import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plan, PlanTemplate, Language, Definitions, Phase, Treatment, Translatable } from './types';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { PlanBuilder } from './components/PlanBuilder';
import { PlanPreview } from './components/PlanPreview';
import { AdminPage } from './components/AdminPage';
import { Tutorial } from './components/Tutorial';
import { generatePdf } from './services/pdfService';
import { definitionService } from './services/definitionsService';
import { getTranslator, TranslationKey } from './i18n';
import { Button } from './components/common/Button';
import { EyeIcon, CancelIcon, MessageCircleIcon, DownloadIcon } from './components/icons';

type View = 'main' | 'admin';
type TutorialType = 'main' | 'admin' | 'plan-builder' | null;

const mainTutorialSteps = [
    {
        element: '#tutorial-ai-suggestion',
        titleKey: 'tutorialAiTitle' as TranslationKey,
        textKey: 'tutorialAiText' as TranslationKey,
        position: 'bottom' as const,
    },
    {
        element: '#tutorial-template-library',
        titleKey: 'tutorialTemplatesTitle' as TranslationKey,
        textKey: 'tutorialTemplatesText' as TranslationKey,
        position: 'top' as const,
    },
    {
        element: '#tutorial-admin-button',
        titleKey: 'tutorialAdminTitle' as TranslationKey,
        textKey: 'tutorialAdminText' as TranslationKey,
        position: 'bottom' as const,
    },
];

const adminTutorialSteps = [
    { element: '#admin-nav-general', titleKey: 'tutorialAdminNavGeneralTitle' as TranslationKey, textKey: 'tutorialAdminNavGeneralText' as TranslationKey, position: 'bottom' as const },
    { element: '#admin-nav-templates', titleKey: 'tutorialAdminNavTemplatesTitle' as TranslationKey, textKey: 'tutorialAdminNavTemplatesText' as TranslationKey, position: 'bottom' as const },
    { element: '#admin-nav-treatments', titleKey: 'tutorialAdminNavServicesTitle' as TranslationKey, textKey: 'tutorialAdminNavServicesText' as TranslationKey, position: 'bottom' as const },
    { element: '#admin-nav-options', titleKey: 'tutorialAdminNavOptionsTitle' as TranslationKey, textKey: 'tutorialAdminNavOptionsText' as TranslationKey, position: 'bottom' as const },
    { element: '#admin-lang-switcher', titleKey: 'tutorialAdminLangTitle' as TranslationKey, textKey: 'tutorialAdminLangText' as TranslationKey, position: 'bottom' as const },
    { element: '#admin-save-button', titleKey: 'tutorialAdminSaveTitle' as TranslationKey, textKey: 'tutorialAdminSaveText' as TranslationKey, position: 'bottom' as const },
];

const planBuilderTutorialSteps = [
    {
        element: '#tutorial-patient-info',
        titleKey: 'tutorialPlanPatientTitle' as TranslationKey,
        textKey: 'tutorialPlanPatientText' as TranslationKey,
        position: 'right' as const,
    },
    {
        element: '#tutorial-contraindications',
        titleKey: 'tutorialPlanContraindicationsTitle' as TranslationKey,
        textKey: 'tutorialPlanContraindicationsText' as TranslationKey,
        position: 'right' as const,
    },
    {
        element: '#tutorial-phases-container',
        titleKey: 'tutorialPlanPhasesTitle' as TranslationKey,
        textKey: 'tutorialPlanPhasesText' as TranslationKey,
        position: 'right' as const,
    },
    {
        element: '#tutorial-ai-suggestions-builder',
        titleKey: 'tutorialPlanAiTitle' as TranslationKey,
        textKey: 'tutorialPlanAiText' as TranslationKey,
        position: 'top' as const,
    },
    {
        element: '#tutorial-add-phase',
        titleKey: 'tutorialPlanAddPhaseTitle' as TranslationKey,
        textKey: 'tutorialPlanAddPhaseText' as TranslationKey,
        position: 'top' as const,
    },
    {
        element: '#tutorial-header-actions',
        titleKey: 'tutorialPlanActionsTitle' as TranslationKey,
        textKey: 'tutorialPlanActionsText' as TranslationKey,
        position: 'bottom' as const,
    },
    {
        element: '#tutorial-finalize-button',
        titleKey: 'tutorialPlanFinalizeTitle' as TranslationKey,
        textKey: 'tutorialPlanFinalizeText' as TranslationKey,
        position: 'bottom' as const,
    },
];

const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<View>('main');
  const [definitions, setDefinitions] = useState<Definitions>(definitionService.loadDefinitions());
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [activeTutorial, setActiveTutorial] = useState<TutorialType>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const previewRef = React.useRef<HTMLDivElement>(null);
  const t = useMemo(() => getTranslator(language), [language]);

  const startTutorial = (type: TutorialType) => {
    if (type === 'main') {
        setCurrentPlan(null);
        setView('main');
    } else if (type === 'admin') {
        setCurrentPlan(null);
        setView('admin');
    } else if (type === 'plan-builder') {
        if (!currentPlan) {
            // Can't start plan tutorial without a plan, fall back.
            endTutorial();
            return;
        }
    }
    setTutorialStep(0);
    setActiveTutorial(type);
  };

  const endTutorial = () => {
    setActiveTutorial(null);
  };

  const handleSelectTemplate = (template: PlanTemplate, patientData?: { name: string; age: number; sex: string }) => {
    // Deep copy template to avoid mutation issues
    const newPlanData = JSON.parse(JSON.stringify(template));

    // Hydrate treatments, ensuring contraindications is always a string
    const newPhases = newPlanData.phases.map((phase: Phase) => ({
        ...phase,
        treatments: phase.treatments.map((treatment: Treatment) => {
            let finalContraindications: string | undefined;

            // Case 1: It's an object from an AI-generated template. Convert to string.
            if (typeof treatment.contraindications === 'object' && treatment.contraindications !== null) {
                const contraTranslatable = treatment.contraindications as any as Translatable;
                finalContraindications = contraTranslatable[language] || contraTranslatable.en;
            } 
            // Case 2: It's already a valid string. Keep it.
            else if (typeof treatment.contraindications === 'string') {
                finalContraindications = treatment.contraindications;
            } 
            // Case 3: It's missing. Try to populate from definitions.
            else {
                const def = definitions.categories[treatment.categoryKey]?.items.find(i => i.key === treatment.treatmentKey);
                if (def?.defaults.contraindications) {
                    finalContraindications = def.defaults.contraindications[language] || def.defaults.contraindications.en;
                }
            }
            
            return { ...treatment, contraindications: finalContraindications };
        }),
    }));

    const newPlan: Plan = {
      ...newPlanData,
      id: uuidv4(),
      title: template.title[language], // Use translated title for the plan instance
      notes: template.notes[language], // Use translated notes for the plan instance
      phases: newPhases,
      // Populate practice and provider info from the central definitions
      practice: { ...definitions.practiceInfo },
      provider: definitions.practiceInfo.provider,
      patient: {
        name: patientData?.name || 'Sarah Johnson',
        age: patientData?.age || 34,
        sex: patientData?.sex || 'Female',
      },
      date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
      providerVerified: true,
      contraindications: {
        medications: 'None reported',
        allergies: 'Penicillin',
        medicalHistory: 'None',
        previousTreatments: 'Botox (6 months ago)',
      },
    };
    setCurrentPlan(newPlan);
  };

  const handleCreateBlankPlan = () => {
    const blankTemplate = definitions.planTemplates.find(t => t.id === 'blank-plan');
    if (blankTemplate) {
      handleSelectTemplate(blankTemplate);
    } else {
      console.error("Blank plan template not found.");
      alert("Error: The blank plan template is missing from the definitions.");
    }
  };
  
  const handleBackToTemplates = () => {
    setCurrentPlan(null);
    setActivePhaseId(null);
  };

  const handleDownloadPdf = async () => {
    // On mobile, the preview might be hidden when the button is clicked from the header.
    // To ensure the content is available, we can briefly show it.
    // However, the best approach is to have the download button inside the preview context.
    // For desktop, this will work fine. For mobile, the button is added inside the preview overlay.
    if (previewRef.current && currentPlan) {
      const fileName = `${currentPlan.patient.name}-Treatment-Plan`;
      await generatePdf(previewRef.current, fileName);
    } else {
        alert("Preview content is not available to generate PDF.");
    }
  };
  
  const handleSaveDefinitions = (newDefinitions: Definitions) => {
    definitionService.saveDefinitions(newDefinitions);
    setDefinitions(definitionService.loadDefinitions()); // Reload to ensure clean state
    alert("Settings saved successfully!");
  }
  
  const handleResetDefinitions = () => {
    if(window.confirm("Are you sure you want to reset all definitions to their default values? This cannot be undone.")){
      const defaultDefs = definitionService.resetDefinitions();
      setDefinitions(defaultDefs);
      alert("Settings have been reset to default.");
    }
  }

  const renderContent = () => {
    if (view === 'admin') {
      return <AdminPage 
                definitions={definitions} 
                onSave={handleSaveDefinitions} 
                onReset={handleResetDefinitions} 
                language={language}
                onStartTutorial={() => startTutorial('admin')}
              />;
    }
    
    if (!currentPlan) {
      return <TemplateSelector onSelectTemplate={handleSelectTemplate} definitions={definitions} language={language} t={t} />;
    }

    return (
       <div className="relative h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* Plan Builder */}
          <div className="lg:col-span-5 h-full overflow-y-auto bg-brand-background-soft">
            <PlanBuilder 
              plan={currentPlan} 
              setPlan={setCurrentPlan} 
              language={language} 
              definitions={definitions}
              t={t} 
              setActivePhaseId={setActivePhaseId}
            />
          </div>
          {/* Plan Preview (Desktop) */}
          <div className="hidden lg:block lg:col-span-7 h-full overflow-y-auto bg-brand-background-medium border-l border-brand-background-strong">
            <PlanPreview 
              plan={currentPlan} 
              previewRef={previewRef} 
              language={language} 
              definitions={definitions}
              t={t}
              activePhaseId={activePhaseId}
            />
          </div>
        </div>

        {/* Mobile Preview Overlay */}
        {isPreviewVisible && (
             <div className="lg:hidden fixed inset-0 z-50 bg-brand-background-medium overflow-y-auto">
                <PlanPreview 
                    plan={currentPlan} 
                    previewRef={previewRef} 
                    language={language} 
                    definitions={definitions}
                    t={t}
                    activePhaseId={activePhaseId}
                />
                 <div className="!fixed top-4 right-4 z-[60] flex flex-col gap-3">
                    <Button 
                        variant="secondary"
                        onClick={() => setIsPreviewVisible(false)} 
                        className="!p-3 rounded-full shadow-lg bg-white/80 backdrop-blur-sm"
                        aria-label="Close preview"
                    >
                        <CancelIcon className="w-6 h-6 text-brand-text-primary" />
                    </Button>
                     <Button 
                        variant="secondary"
                        onClick={handleDownloadPdf} 
                        className="!p-3 rounded-full shadow-lg bg-white/80 backdrop-blur-sm"
                        aria-label={t('pdf')}
                    >
                        <DownloadIcon className="w-6 h-6 text-brand-text-primary" />
                    </Button>
                </div>
             </div>
        )}

        {/* Floating Action Button to show preview on mobile */}
        {!isPreviewVisible && (
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <Button 
                    variant="secondary"
                    onClick={() => setIsPreviewVisible(true)} 
                    Icon={EyeIcon} 
                    className="rounded-full !px-6 !py-3 shadow-xl bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-300"
                >
                    {t('patientView')}
                </Button>
            </div>
        )}
      </div>
    );
  };
  
  const tutorialSteps = 
    activeTutorial === 'main' ? mainTutorialSteps :
    activeTutorial === 'admin' ? adminTutorialSteps :
    activeTutorial === 'plan-builder' ? planBuilderTutorialSteps : [];

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-all duration-300 ${activeTutorial ? 'border-[10px] border-brand-primary rounded-xl shadow-2xl' : ''}`}>
      <Header 
        plan={currentPlan}
        onBack={view === 'admin' ? () => setView('main') : handleBackToTemplates}
        onDownloadPdf={handleDownloadPdf}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        view={view}
        onSetView={setView}
        logoUrl={definitions.practiceInfo.logoUrl}
        onCreateBlankPlan={handleCreateBlankPlan}
      />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>

       {!activeTutorial && (
         <div className="fixed bottom-6 right-6 z-40 group">
            <button
              onClick={() => startTutorial(view === 'admin' ? 'admin' : (currentPlan ? 'plan-builder' : 'main'))}
              className="w-16 h-16 bg-brand-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-brand-primary-dark transition-transform transform group-hover:scale-110"
              aria-label={t('startTutorial')}
            >
              <MessageCircleIcon className="w-8 h-8" />
            </button>
            <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 whitespace-nowrap bg-brand-text-primary text-white text-xs font-bold px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {t('startTutorial')}
            </div>
        </div>
      )}

      {activeTutorial && (
        <Tutorial 
            steps={tutorialSteps}
            step={tutorialStep}
            onNext={() => setTutorialStep(s => s + 1)}
            onPrev={() => setTutorialStep(s => s - 1)}
            onFinish={endTutorial}
            language={language}
            t={t}
        />
      )}
    </div>
  );
};

export default App;