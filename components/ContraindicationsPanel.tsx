
import React, { useState } from 'react';
import { Plan } from '../types';
import { TextArea } from './common/Input';
import { AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

interface ContraindicationsPanelProps {
    plan: Plan;
    setPlan: (plan: Plan) => void;
}

export const ContraindicationsPanel: React.FC<ContraindicationsPanelProps> = ({ plan, setPlan }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (field: keyof Plan['contraindications'], value: string) => {
        setPlan({
            ...plan,
            contraindications: {
                ...plan.contraindications,
                [field]: value,
            },
        });
    };

    return (
        <div id="tutorial-contraindications" className="bg-white rounded-2xl shadow-sm border border-brand-background-strong mb-4 overflow-hidden">
            <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="contraindications-content"
            >
                <div className="flex items-center space-x-3">
                    <AlertTriangleIcon className="w-6 h-6 text-brand-warning" />
                    <h3 className="font-semibold text-lg text-brand-text-primary">Contraindications & Medical History</h3>
                </div>
                {isOpen ? <ChevronUpIcon className="w-6 h-6 text-brand-text-secondary" /> : <ChevronDownIcon className="w-6 h-6 text-brand-text-secondary" />}
            </button>

            <div
                id="contraindications-content"
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-background-medium pt-6">
                        <TextArea
                            label="Allergies"
                            id="allergies"
                            value={plan.contraindications.allergies}
                            onChange={(e) => handleChange('allergies', e.target.value)}
                            placeholder="e.g., Penicillin, Aspirin"
                            rows={3}
                        />
                        <TextArea
                            label="Previous Aesthetic Treatments"
                            id="previous-treatments"
                            value={plan.contraindications.previousTreatments}
                            onChange={(e) => handleChange('previousTreatments', e.target.value)}
                            placeholder="e.g., Botox (6 months ago), Microneedling (1 year ago)"
                            rows={3}
                        />
                        <TextArea
                            label="Current Medications"
                            id="medications"
                            value={plan.contraindications.medications}
                            onChange={(e) => handleChange('medications', e.target.value)}
                            placeholder="e.g., None reported"
                            rows={3}
                        />
                        <TextArea
                            label="Relevant Medical History"
                            id="medical-history"
                            value={plan.contraindications.medicalHistory}
                            onChange={(e) => handleChange('medicalHistory', e.target.value)}
                            placeholder="e.g., Eczema"
                            rows={3}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};