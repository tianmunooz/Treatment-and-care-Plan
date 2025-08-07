
import React, { useState } from 'react';
import { Plan } from '../types';
import { Input } from './common/Input';
import { UserIcon, ChevronDownIcon, ChevronUpIcon } from './icons';
import { Select } from './common/Select';

interface PatientInfoPanelProps {
    plan: Plan;
    setPlan: (plan: Plan) => void;
}

export const PatientInfoPanel: React.FC<PatientInfoPanelProps> = ({ plan, setPlan }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePatientChange = (field: keyof Plan['patient'], value: string | number) => {
        setPlan({
            ...plan,
            patient: {
                ...plan.patient,
                [field]: value,
            },
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-background-strong mb-4 overflow-hidden">
            <button
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="patient-info-content"
            >
                <div className="flex items-center space-x-3">
                    <UserIcon className="w-6 h-6 text-brand-primary" />
                    <h3 className="font-semibold text-lg text-brand-text-primary">Patient Information</h3>
                </div>
                {isOpen ? <ChevronUpIcon className="w-6 h-6 text-brand-text-secondary" /> : <ChevronDownIcon className="w-6 h-6 text-brand-text-secondary" />}
            </button>

            <div
                id="patient-info-content"
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-brand-background-medium pt-6">
                        <Input
                            label="Patient Name"
                            id="patient-name"
                            value={plan.patient.name}
                            onChange={(e) => handlePatientChange('name', e.target.value)}
                            placeholder="e.g., Sarah Johnson"
                        />
                        <Input
                            label="Age"
                            id="patient-age"
                            type="number"
                            value={plan.patient.age}
                            onChange={(e) => handlePatientChange('age', parseInt(e.target.value, 10) || 0)}
                            placeholder="e.g., 34"
                        />
                        <Select
                            label="Sex"
                            id="patient-sex"
                            value={plan.patient.sex}
                            onChange={(e) => handlePatientChange('sex', e.target.value)}
                        >
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                            <option>Prefer not to say</option>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
};