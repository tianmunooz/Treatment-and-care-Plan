import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Plan, Phase } from '../types';
import { A360Logo, PhoneIcon, MailIcon, GlobeIcon, CheckIcon, AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

const PAGE_HEIGHT_IN_PX = 1050; // Approximate height for A4 preview

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const PageBreakIndicator = ({ pageNumber }: { pageNumber: number }) => (
    <div className="relative w-full h-px my-4 border-t-2 border-dashed border-gray-300">
        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-xs text-gray-400">
            Page {pageNumber}
        </span>
    </div>
);

const PhaseAccordionItem: React.FC<{
  phase: Phase;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ phase, index, isOpen, onToggle }) => {
    const phaseTotal = phase.treatments.reduce((acc, treatment) => acc + treatment.price, 0);

    return (
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100"
            >
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white font-bold mr-4">
                        {index + 1}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 underline decoration-dotted underline-offset-4">{phase.title}</h3>
                        <p className="text-xs text-gray-500">
                            {phase.treatments.length} treatments • {formatCurrency(phaseTotal)}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-500" /> : <ChevronDownIcon className="w-5 h-5 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="p-4 bg-white">
                    <table className="w-full text-left text-sm mb-6">
                        <thead className="text-xs text-gray-500 bg-gray-50">
                            <tr>
                                <th className="w-[10%] p-3 font-medium rounded-l-md">Week/Month</th>
                                <th className="w-[25%] p-3 font-medium">Treatment</th>
                                <th className="w-[25%] p-3 font-medium">Micro-goal</th>
                                <th className="w-[15%] p-3 font-medium">Frequency</th>
                                <th className="w-[25%] p-3 font-medium rounded-r-md">Key Instructions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {phase.treatments.map(treatment => (
                                <tr key={treatment.id} className="border-b border-gray-100 last:border-b-0">
                                    <td className="p-3 align-top">{treatment.week}</td>
                                    <td className="p-3 align-top font-medium text-gray-800">{treatment.name}</td>
                                    <td className="p-3 align-top">{treatment.goal}</td>
                                    <td className="p-3 align-top">{treatment.frequency}</td>
                                    <td className="p-3 align-top">{treatment.keyInstructions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {phase.controlsAndMetrics.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-sm text-gray-700 mb-3">Controls & Metrics</h4>
                            <div className="space-y-2">
                                {phase.controlsAndMetrics.map((item, i) => (
                                    <div key={i} className="flex items-center text-sm text-gray-600">
                                        <CheckIcon className="w-4 h-4 mr-2 text-green-500 bg-green-100 rounded-full p-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const PlanPreview: React.FC<{ plan: Plan; previewRef: React.RefObject<HTMLDivElement> }> = ({ plan, previewRef }) => {
    const [openPhaseIds, setOpenPhaseIds] = useState<Set<string>>(() => new Set(plan.phases.map(p => p.id)));
    const [pageBreakPositions, setPageBreakPositions] = useState<number[]>([]);

    const togglePhase = (phaseId: string) => {
        setOpenPhaseIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(phaseId)) {
                newSet.delete(phaseId);
            } else {
                newSet.add(phaseId);
            }
            return newSet;
        });
    };

    useLayoutEffect(() => {
        if (!previewRef.current) return;
        
        const calculatePageBreaks = () => {
            if (!previewRef.current) return;
            const contentHeight = previewRef.current.scrollHeight;
            const numPages = Math.ceil(contentHeight / PAGE_HEIGHT_IN_PX);
            const breaks = [];
            for (let i = 1; i < numPages; i++) {
                breaks.push(i * PAGE_HEIGHT_IN_PX);
            }
            setPageBreakPositions(breaks);
        };
        
        // Calculate on mount and after a short delay to allow images/fonts to load
        calculatePageBreaks();
        const timer = setTimeout(calculatePageBreaks, 500);

        return () => clearTimeout(timer);
    }, [plan, openPhaseIds, previewRef]);


    return (
        <div className="p-4 md:p-6 bg-brand-background-medium">
            <div ref={previewRef} className="relative bg-white p-8 sm:p-10 max-w-4xl mx-auto shadow-lg font-sans text-gray-800 rounded-lg">
                {/* Header */}
                <header className="flex justify-between items-start mb-6">
                    <div>
                        <A360Logo className="h-8 w-auto mb-4" />
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">TREATMENT & CARE PLAN</h1>
                        <p className="mt-2 text-sm text-gray-600">{plan.practice.name}</p>
                        <p className="text-sm text-gray-600">{plan.practice.address}</p>
                        <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                            <span className="inline-flex items-center"><PhoneIcon className="w-4 h-4 mr-1.5 text-gray-400"/> {plan.practice.phone}</span>
                            <span className="inline-flex items-center"><MailIcon className="w-4 h-4 mr-1.5 text-gray-400"/> {plan.practice.email}</span>
                            <span className="inline-flex items-center"><GlobeIcon className="w-4 h-4 mr-1.5 text-gray-400"/> {plan.practice.website}</span>
                        </div>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-xs font-semibold text-gray-700">Add to Calendar</p>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:Treatment%20Plan%20at%20${plan.practice.name}%0ADTSTART:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}%0AEND;VALUE=DATE-TIME:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}%0ALOCATION:${plan.practice.address}%0ADESCRIPTION:Your%20personalized%20treatment%20plan.%0AEND:VEVENT%0AEND:VCALENDAR`} alt="QR Code" className="w-20 h-20 mx-auto mt-2" />
                        <p className="text-xs text-gray-400 mt-2">Scan with phone</p>
                    </div>
                </header>

                {/* Patient Info Bar */}
                <div className="border-y border-gray-200 py-3 flex justify-between items-center text-sm">
                    <span>Name: <strong className="font-semibold text-gray-900">{plan.patient.name}</strong></span>
                    <span>Age: <strong className="font-semibold text-gray-900">{plan.patient.age}</strong></span>
                    <span>Sex: <strong className="font-semibold text-gray-900">{plan.patient.sex}</strong></span>
                    <span>Provider: <strong className="font-semibold text-gray-900">{plan.provider}</strong></span>
                    <span>Date: <strong className="font-semibold text-gray-900">{plan.date}</strong></span>
                </div>

                {/* Contraindications */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold flex items-center text-gray-800 mb-4">
                        <AlertTriangleIcon className="w-5 h-5 mr-3 text-yellow-500" />
                        Contraindications & Allergies
                    </h2>
                    <div className="text-sm border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-x-8 gap-y-4 mb-3">
                        <div><strong className="font-medium text-gray-500 block">Medications:</strong> {plan.contraindications.medications}</div>
                        <div><strong className="font-medium text-gray-500 block">Allergies:</strong> {plan.contraindications.allergies}</div>
                        <div><strong className="font-medium text-gray-500 block">Medical History:</strong> {plan.contraindications.medicalHistory}</div>
                        <div><strong className="font-medium text-gray-500 block">Previous Treatments:</strong> {plan.contraindications.previousTreatments}</div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <input type="checkbox" checked={plan.providerVerified} readOnly className="h-3.5 w-3.5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                        <label className="ml-2">Verified by provider on {plan.date}</label>
                    </div>
                </div>

                {/* Phase Details */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Phase Details</h2>
                    {plan.phases.map((phase, index) => (
                        <PhaseAccordionItem 
                            key={phase.id} 
                            phase={phase} 
                            index={index}
                            isOpen={openPhaseIds.has(phase.id)}
                            onToggle={() => togglePhase(phase.id)}
                        />
                    ))}
                </div>

                {/* Page Break Previews */}
                {pageBreakPositions.map((top, i) => (
                    <PageBreakIndicator key={`break-${i}`} pageNumber={i + 2} />
                ))}
            </div>
        </div>
    );
};