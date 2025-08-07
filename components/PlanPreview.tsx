

import React, { useMemo, useState, useEffect } from 'react';
import { Plan, Phase, Definitions, Treatment } from '../types';
import { A360Logo, AlertTriangleIcon, PhoneIcon, MailIcon, GlobeIcon, CheckSquareIcon, CheckIcon, ListChecksIcon, DollarSignIcon, LandmarkIcon, HomeIcon, FileTextIcon, EditIcon } from './icons';
import { Language, TranslationKey } from '../i18n';

// --- Reusable Styled Components for the Document ---

const formatCurrency = (amount: number, minimumFractionDigits = 2) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits }).format(amount);
};

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string, icon?: React.ElementType }> = ({ title, children, className = '', icon: Icon }) => (
    <div className={`mt-8 ${className}`}>
        <div className="flex items-center pb-2 mb-4 border-b border-slate-200">
            {Icon && <Icon className="w-5 h-5 text-brand-primary mr-3" />}
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600">{title}</h2>
        </div>
        <div className="text-sm text-slate-700 leading-relaxed">
            {children}
        </div>
    </div>
);

const PageFooter: React.FC<{ page: number; totalPages: number; practiceName: string }> = ({ page, totalPages, practiceName }) => (
    <div className="text-xs text-slate-500 pt-8 mt-auto flex justify-between items-center">
        <span>{practiceName} &copy; {new Date().getFullYear()}</span>
        <span>Page {page} of {totalPages}</span>
    </div>
);

const getWeekRangeForPhase = (index: number): string => {
    const startWeek = index * 4 + 1;
    const endWeek = (index + 1) * 4;
    return `Weeks ${startWeek} - ${endWeek}`;
};
const currentPhaseForDisplay = 2; // To match image: Phase 1 is complete, Phase 2 is active

export const PlanPreview: React.FC<{ 
    plan: Plan; 
    previewRef: React.RefObject<HTMLDivElement>;
    language: Language;
    definitions: Definitions;
    t: (key: TranslationKey) => string;
    activePhaseId: string | null;
}> = ({ plan, previewRef, language, definitions, t, activePhaseId }) => {
    
    const { subtotal, planDiscountAmount, finalCost } = useMemo(() => {
        const sub = plan.phases.reduce((acc, phase) => {
            return acc + phase.treatments.reduce((pAcc, treatment) => {
                const price = treatment.price || 0;
                const discount = treatment.discount || 0;
                return pAcc + (price * (1 - (discount / 100)));
            }, 0);
        }, 0);

        const discountAmount = sub * (plan.investment.discountPercent / 100);
        const final = sub - discountAmount;

        return {
            subtotal: sub,
            planDiscountAmount: discountAmount,
            finalCost: final,
        };
    }, [plan]);

    const allTreatments = useMemo(() => plan.phases.flatMap(phase => phase.treatments), [plan.phases]);

    const homeCareItems = useMemo(() => 
        allTreatments.filter(t => t.categoryKey === 'skincare-medications'), 
        [allTreatments]
    );

    const treatmentsWithContraindications = useMemo(() => 
        allTreatments.filter(t => t.contraindications && t.contraindications.trim() !== '' && t.contraindications.trim().toLowerCase() !== 'none'),
        [allTreatments]
    );

     const overviewItems = useMemo(() => {
        return [
            ...plan.phases.map((phase, index) => {
                const isCompleted = index < currentPhaseForDisplay - 1;
                return {
                    id: phase.id,
                    isPhase: true,
                    isCompleted: isCompleted,
                    weekRange: getWeekRangeForPhase(index),
                    title: phase.title || `Phase ${index + 1}`,
                    description: phase.treatments.length > 0 ? `${phase.treatments.length} ${phase.treatments.length === 1 ? 'treatment' : 'treatments'} planned.` : '',
                    Icon: isCompleted ? CheckIcon : FileTextIcon,
                    iconWrapperClass: isCompleted ? 'w-6 h-6 rounded-full bg-brand-success flex items-center justify-center' : 'w-6 h-6 flex items-center justify-center',
                    iconClass: isCompleted ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-slate-400'
                }
            }),
            {
                id: 'follow-up',
                isPhase: false,
                isCompleted: false,
                weekRange: getWeekRangeForPhase(plan.phases.length),
                title: 'Follow-Up & Next Steps',
                description: 'Schedule Follow-up Appointment',
                Icon: EditIcon,
                iconWrapperClass: 'w-6 h-6 flex items-center justify-center',
                iconClass: 'w-5 h-5 text-slate-400'
            }
        ];
    }, [plan.phases]);

    useEffect(() => {
        if (!activePhaseId || !previewRef.current) return;

        const scrollContainer = previewRef.current.parentElement;
        const targetElement = document.getElementById(`preview-phase-${activePhaseId}`);

        if (scrollContainer && targetElement) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            
            const offset = targetRect.top - containerRect.top;
            
            scrollContainer.scrollTo({
                top: scrollContainer.scrollTop + offset - 24, // 24px (1.5rem) for top padding
                behavior: 'smooth',
            });
        }
    }, [activePhaseId, previewRef]);

    const hasContent = (text: string | undefined | null): boolean => {
        if (!text) return false;
        const lowerText = text.trim().toLowerCase();
        return lowerText !== '' && lowerText !== 'none' && lowerText !== 'none reported';
    };

    const contraindicationData = [
        { label: 'Medications', value: plan.contraindications.medications },
        { label: 'Allergies', value: plan.contraindications.allergies },
        { label: 'Medical History', value: plan.contraindications.medicalHistory },
        { label: 'Previous Treatments', value: plan.contraindications.previousTreatments },
    ];
    const visibleContraindications = contraindicationData.filter(item => hasContent(item.value));

    const totalPages = 3;
    
    const renderSpecificDetails = (treatment: Treatment) => {
        const targetAreaNames = treatment.targetArea?.map(key => definitions.options.targetAreas.find(o => o.key === key)?.name[language] || key).join(', ');
        const applicationName = definitions.options.applications.find(o => o.key === treatment.application)?.name[language];
        const intensityName = definitions.options.intensities.find(o => o.key === treatment.intensity)?.name[language];
        const technologyName = definitions.options.technologies.find(o => o.key === treatment.technology)?.name[language];
        
        const detailsMap: { [key: string]: string | undefined } = {
            'Area': targetAreaNames,
            'Units': treatment.units,
            'Volume': treatment.volume ? `${treatment.volume}ml` : undefined,
            'Vials': treatment.vials,
            'Dosage': treatment.dosage,
            'Apply': applicationName,
            'Intensity': intensityName,
            'Tech': technologyName || treatment.technology,
        };
        
        const details = Object.entries(detailsMap)
          .filter(([, value]) => value && value.length > 0);

        if (details.length === 0) return null;

        return (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs mt-2">
                {details.map(([key, value], index) => (
                    <span key={index} className="inline-flex items-center bg-slate-100 border border-slate-200/80 px-2 h-6 rounded-md text-slate-700">
                        <span className="font-medium text-slate-600 mr-1.5">{key}:</span>
                        <span>{value}</span>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div ref={previewRef} className="p-4 md:p-6 bg-brand-background-medium font-sans">
            {/* Page 1 */}
            <div className="printable-page bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-lg text-slate-800 p-12 flex flex-col">
                <header className="mb-8">
                    <A360Logo logoUrl={plan.practice.logoUrl} className="h-9 w-auto" />
                    <h1 className="text-2xl font-extrabold tracking-widest text-slate-800 mt-8">TREATMENT & CARE PLAN</h1>

                    <div className="mt-6 text-sm">
                        <p className="font-bold text-slate-700">{plan.practice.name}</p>
                        <p className="text-slate-500">{plan.practice.address}</p>
                        <div className="flex items-center gap-x-4 pt-1 text-slate-500">
                            <span className="flex items-center gap-1.5"><PhoneIcon className="w-3.5 h-3.5"/><span>{plan.practice.phone}</span></span>
                            <span className="flex items-center gap-1.5"><MailIcon className="w-3.5 h-3.5"/><span>{plan.practice.email}</span></span>
                            <span className="flex items-center gap-1.5"><GlobeIcon className="w-3.5 h-3.5"/><span>{plan.practice.website}</span></span>
                        </div>
                    </div>
                </header>
                
                <div className="mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Patient Information</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm pb-4 border-b border-slate-200">
                        <p><strong className="font-semibold text-slate-600">Name:</strong><span className="text-slate-800 ml-2">{plan.patient.name}</span></p>
                        <p><strong className="font-semibold text-slate-600">Age:</strong><span className="text-slate-800 ml-2">{plan.patient.age}</span></p>
                        <p><strong className="font-semibold text-slate-600">Sex:</strong><span className="text-slate-800 ml-2">{plan.patient.sex}</span></p>
                        <p><strong className="font-semibold text-slate-600">Date:</strong><span className="text-slate-800 ml-2">{plan.date}</span></p>
                        <p className="col-span-2"><strong className="font-semibold text-slate-600">Provider:</strong><span className="text-slate-800 ml-2">{plan.provider}</span></p>
                    </div>
                </div>
                
                <Section title="General Contraindications & Allergies" icon={AlertTriangleIcon}>
                    {visibleContraindications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {visibleContraindications.map(item => (
                                <div key={item.label} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{item.label}</h4>
                                    <p className="text-sm text-slate-800">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">No significant contraindications, allergies, or relevant medical history reported.</p>
                    )}
                     <div className="flex items-center mt-4 text-xs text-slate-600">
                        <CheckSquareIcon className="w-4 h-4 mr-2 text-slate-700" />
                        Verified by provider on {plan.date}
                     </div>
                </Section>
                
                <Section title="Plan Overview" icon={ListChecksIcon}>
                    <p className="mb-6 text-slate-600">Your personalized treatment journey is structured in the following phases to achieve the best results over time.</p>
                    <div className="flex flex-col">
                        {overviewItems.map((item, index) => {
                            const isLast = index === overviewItems.length - 1;
                            const { Icon } = item;
                            
                            return (
                                <div key={item.id} className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                        <div className={`flex-shrink-0 bg-white ${item.iconWrapperClass}`}>
                                            <Icon className={item.iconClass} />
                                        </div>
                                        {!isLast && (
                                            <div className="w-px flex-1 bg-slate-200" />
                                        )}
                                    </div>
                                    <div className={`flex-grow pt-px -mt-1 ${!isLast ? 'pb-8' : ''}`}>
                                        <p className="text-xs uppercase font-semibold tracking-wider text-slate-500">{item.weekRange}</p>
                                        <h4 className={`text-base mt-1 ${item.isPhase ? 'font-semibold text-slate-800' : 'font-bold text-brand-text-primary'}`}>{item.title}</h4>
                                        {item.description && <p className={`text-sm mt-1 ${!item.isPhase ? 'text-brand-primary font-medium hover:underline cursor-pointer' : 'text-slate-600'}`}>{item.description}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>
                
                <PageFooter page={1} totalPages={totalPages} practiceName={plan.practice.name} />
            </div>

            <div className="my-4" style={{ pageBreakBefore: 'always' }}></div>

            {/* Page 2 */}
            <div className="printable-page bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-lg text-slate-800 p-12 flex flex-col">
                <header className="flex justify-between items-start mb-8 pb-4 border-b border-slate-200">
                    <A360Logo logoUrl={plan.practice.logoUrl} className="h-9 w-auto" />
                     <div className="text-right">
                        <p className="font-semibold text-lg text-slate-700">{plan.patient.name}</p>
                        <p className="text-sm text-slate-500">Treatment Details & Investment</p>
                     </div>
                </header>

                <Section title="TREATMENT DETAILS" icon={ListChecksIcon}>
                    {plan.phases.map(phase => (
                        <div key={phase.id} id={`preview-phase-${phase.id}`} className="mb-6 break-inside-avoid">
                            <h3 className="font-bold text-base text-slate-800 mb-3 border-b pb-2">{phase.title}</h3>
                            <div className="space-y-3">
                                {phase.treatments.map(treatment => {
                                    const treatmentDef = definitions.categories[treatment.categoryKey]?.items.find(i => i.key === treatment.treatmentKey);
                                    const treatmentDisplayName = treatmentDef ? treatmentDef.name[language] : 'Untitled Treatment';
                                    const finalPrice = (treatment.price || 0) * (1 - ((treatment.discount || 0) / 100));
                                    
                                    return (
                                        <div key={treatment.id} className="p-3 rounded-md bg-slate-50/50 border border-slate-200/80">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-slate-700 pr-4">{treatmentDisplayName}</p>
                                                <p className="font-semibold text-slate-800 whitespace-nowrap">{formatCurrency(finalPrice)}</p>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1">{treatment.goal}</p>
                                            {renderSpecificDetails(treatment)}
                                        </div>
                                    )
                                })}
                                {phase.treatments.length === 0 && (
                                  <p className="text-sm text-slate-500 italic">No treatments scheduled for this phase.</p>  
                                )}
                            </div>
                        </div>
                    ))}
                </Section>
                
                <Section title="INVESTMENT SUMMARY" icon={DollarSignIcon}>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Subtotal</span>
                                <span className="font-semibold text-slate-700">{formatCurrency(subtotal)}</span>
                            </div>
                            {plan.investment.discountPercent > 0 && (
                                <div className="flex justify-between text-brand-success">
                                    <span>Plan Discount ({plan.investment.discountPercent}%)</span>
                                    <span className="font-semibold">-{formatCurrency(planDiscountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                                <span className="text-slate-800">Total Investment</span>
                                <span className="text-brand-primary">{formatCurrency(finalCost)}</span>
                            </div>
                        </div>
                    </div>
                </Section>

                <Section title="FINANCING OPTIONS" icon={LandmarkIcon}>
                    <p className="mb-4 text-slate-600">We offer flexible financing to make your plan achievable.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {plan.investment.financingOptions.slice(0, 3).map(opt => (
                            <div key={opt.months} className="p-4 border border-slate-200 rounded-lg bg-white flex flex-col justify-center items-center text-center">
                                <p className="font-bold text-brand-primary text-xl">
                                    {formatCurrency(finalCost / opt.months, 2)}
                                    <span className="text-sm font-normal text-slate-500">/mo</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{opt.months} months at {opt.apr}% APR</p>
                            </div>
                        ))}
                    </div>
                </Section>

                <PageFooter page={2} totalPages={totalPages} practiceName={plan.practice.name} />
            </div>

            <div className="my-4" style={{ pageBreakBefore: 'always' }}></div>

            {/* Page 3 */}
            <div className="printable-page bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-lg text-slate-800 p-12 flex flex-col">
                 <header className="flex justify-between items-start mb-8 pb-4 border-b border-slate-200">
                    <A360Logo logoUrl={plan.practice.logoUrl} className="h-9 w-auto" />
                     <div className="text-right">
                        <p className="font-semibold text-lg text-slate-700">{plan.patient.name}</p>
                        <p className="text-sm text-slate-500">At-Home Care & Recommendations</p>
                     </div>
                </header>
                
                <Section title="Medications - Home Care & Important Notes" icon={HomeIcon}>
                    <div>
                        <h3 className="font-semibold text-base text-slate-800 mb-3">Home Care Regimen</h3>
                        {homeCareItems.length > 0 ? (
                            <div className="space-y-3">
                                {homeCareItems.map(treatment => {
                                    const treatmentDef = definitions.categories[treatment.categoryKey]?.items.find(i => i.key === treatment.treatmentKey);
                                    const treatmentDisplayName = treatmentDef ? treatmentDef.name[language] : 'Untitled Treatment';
                                    const applicationName = definitions.options.applications.find(o => o.key === treatment.application)?.name[language];
                                    
                                    return (
                                        <div key={treatment.id} className="p-3 rounded-md bg-slate-50/50 border border-slate-200/80">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-slate-700 pr-4">{treatmentDisplayName}</p>
                                                <div className="text-sm text-slate-600 font-medium bg-slate-200 px-2 py-0.5 rounded-full whitespace-nowrap">{applicationName || treatment.application}</div>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1">{treatment.goal}</p>
                                            {treatment.dosage && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                <span className="font-semibold">Dosage:</span> {treatment.dosage}
                                            </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic pl-4">No specific at-home products prescribed in this plan.</p>
                        )}
                    </div>

                    {treatmentsWithContraindications.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-200">
                            <h3 className="font-semibold text-base text-red-700 mb-3 flex items-center gap-2">
                                <AlertTriangleIcon className="w-5 h-5" />
                                Treatment Contraindications & Allergies
                            </h3>
                            <div className="space-y-3">
                            {treatmentsWithContraindications.map(treatment => {
                                const treatmentDef = definitions.categories[treatment.categoryKey]?.items.find(i => i.key === treatment.treatmentKey);
                                const treatmentDisplayName = treatmentDef ? treatmentDef.name[language] : 'Untitled Treatment';
                                
                                return (
                                <div key={`contra-${treatment.id}`} className="p-3 rounded-md bg-red-50 border border-red-200 text-red-900">
                                    <p className="font-semibold">{treatmentDisplayName}</p>
                                    <p className="text-sm text-red-800 mt-1">{treatment.contraindications}</p>
                                </div>
                                );
                            })}
                            </div>
                        </div>
                    )}
                </Section>

                <Section title="GENERAL RECOMMENDATIONS">
                    <ul className="list-disc list-outside pl-5 space-y-2 marker:text-brand-primary">
                        {plan.generalRecommendations.map((rec, i) => (
                            <li key={`rec-${i}`} className="pl-2 text-slate-700">
                                {rec.text}
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section title="NEXT STEPS">
                    <ol className="list-none pl-0 space-y-2 text-slate-700">
                        {plan.nextSteps.map((step, i) => (
                            <li key={`next-${i}`} className="flex items-start">
                                <span className="w-6 shrink-0 text-right mr-2">{(i + 1)}.</span>
                                <span className="flex-1">{step}</span>
                            </li>
                        ))}
                    </ol>
                </Section>

                <PageFooter page={3} totalPages={totalPages} practiceName={plan.practice.name} />
            </div>
             <style>{`
                @media print {
                    body, .p-4, .md\\:p-6, .bg-brand-background-medium, .font-sans {
                        background-color: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .printable-page {
                        box-shadow: none !important;
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        min-height: 0 !important;
                        height: auto !important;
                        padding: 1rem !important;
                    }
                    .break-inside-avoid {
                        page-break-inside: avoid;
                    }
                     div[style*="pageBreakBefore"] {
                         page-break-before: always;
                         height: 0;
                         display: block;
                     }
                }
            `}</style>
        </div>
    );
};