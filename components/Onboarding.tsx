import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './common/Button';
import { SparkleIcon, SettingsIcon, MessageCircleIcon } from './icons';
import { getTranslator, Language, TranslationKey } from '../i18n';

interface OnboardingProps {
    user: User;
    onFinish: () => void;
    language: Language;
}

const steps = [
    {
        icon: MessageCircleIcon,
        titleKey: 'onboardingWelcomeTitle' as TranslationKey,
        textKey: 'onboardingWelcomeText' as TranslationKey,
    },
    {
        icon: SparkleIcon,
        titleKey: 'onboardingFeaturesTitle' as TranslationKey,
        textKey: 'onboardingFeaturesText' as TranslationKey,
    },
    {
        icon: SettingsIcon,
        titleKey: 'onboardingAdminTitle' as TranslationKey,
        textKey: 'onboardingAdminText' as TranslationKey,
    },
];

export const Onboarding: React.FC<OnboardingProps> = ({ user, onFinish, language }) => {
    const [step, setStep] = useState(0);
    const t = getTranslator(language);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            onFinish();
        }
    };
    
    const currentStep = steps[step];
    const Icon = currentStep.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-text-primary/60 backdrop-blur-sm animate-fade-in-fast p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden transform transition-all animate-slide-up-fast">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
                        <Icon className="w-8 h-8"/>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text-primary">{t(currentStep.titleKey, { name: user.name })}</h2>
                    <p className="text-base text-brand-text-secondary mt-3">{t(currentStep.textKey)}</p>
                </div>
                <div className="px-6 pb-6 bg-brand-background-soft border-t">
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                             {steps.map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                            ))}
                        </div>
                        <Button variant="primary" onClick={handleNext} className="!py-2.5 !px-6">
                            {step < steps.length - 1 ? t('tutorialNext') : t('onboardingFinish')}
                        </Button>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
                @keyframes slide-up-fast { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-up-fast { animation: slide-up-fast 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
}
