import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plan, PlanTemplate } from './types';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { PlanBuilder } from './components/PlanBuilder';
import { PlanPreview } from './components/PlanPreview';
import { generatePdf } from './services/pdfService';

const App: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSelectTemplate = (template: PlanTemplate) => {
    const newPlan: Plan = {
      ...template,
      id: uuidv4(),
      patient: {
        name: 'Sarah Johnson',
        age: 34,
        sex: 'Female',
      },
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      providerVerified: false,
      contraindications: {
        medications: 'None reported',
        allergies: 'Penicillin',
        medicalHistory: 'None',
        previousTreatments: 'Botox (6 months ago)',
      },
    };
    setCurrentPlan(newPlan);
  };
  
  const handleBackToTemplates = () => {
    setCurrentPlan(null);
  };

  const handleDownloadPdf = async () => {
    if (previewRef.current && currentPlan) {
      const fileName = `${currentPlan.patient.name}-Treatment-Plan`;
      await generatePdf(previewRef.current, fileName);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-brand-background-soft overflow-hidden">
      <Header 
        plan={currentPlan}
        onBack={handleBackToTemplates}
        onDownloadPdf={handleDownloadPdf}
      />
      <main className="flex-1 overflow-hidden">
        {!currentPlan ? (
          <div className="h-full overflow-y-auto">
            <TemplateSelector onSelectTemplate={handleSelectTemplate} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            <div className="lg:col-span-5 h-full overflow-y-auto">
              <PlanBuilder plan={currentPlan} setPlan={setCurrentPlan} />
            </div>
            <div className="lg:col-span-7 h-full overflow-y-auto bg-brand-background-medium border-l border-brand-background-strong">
              <PlanPreview plan={currentPlan} previewRef={previewRef} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;