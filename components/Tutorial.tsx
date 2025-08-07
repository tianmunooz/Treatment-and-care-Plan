
import React, { useState, useEffect, useLayoutEffect, CSSProperties } from 'react';
import { Language, TranslationKey } from '../i18n';
import { Button } from './common/Button';
import { MessageCircleIcon } from './icons';

interface TutorialStep {
    element: string;
    titleKey: TranslationKey;
    textKey: TranslationKey;
    position: 'top' | 'bottom' | 'left' | 'right';
    arrowAlignment?: 'center' | 'left' | 'right';
}

interface TutorialProps {
    steps: TutorialStep[];
    step: number;
    onNext: () => void;
    onPrev: () => void;
    onFinish: () => void;
    language: Language;
    t: (key: TranslationKey) => string;
}

export const Tutorial: React.FC<TutorialProps> = ({ steps, step, onNext, onPrev, onFinish, language, t }) => {
    const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
    const [arrowStyle, setArrowStyle] = useState<CSSProperties>({});
    const [currentElement, setCurrentElement] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const stepData = steps[step];
        if (!stepData) return;

        const el = document.querySelector(stepData.element) as HTMLElement;
        if (!el) {
          console.warn(`Tutorial element not found: ${stepData.element}`);
          return;
        };
        
        currentElement?.classList.remove('tutorial-highlight');
        setCurrentElement(el);

        el.classList.add('tutorial-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        const updatePosition = () => {
            const rect = el.getBoundingClientRect();
            let newStyle: CSSProperties = {
                position: 'fixed',
                zIndex: 1002,
                transition: 'top 0.3s, left 0.3s, transform 0.3s',
                width: '320px',
            };
            let newArrowStyle: CSSProperties = {
                position: 'absolute',
                width: '16px',
                height: '16px',
                backgroundColor: 'white',
                transform: 'rotate(45deg)',
            };

            const popoverWidth = 320;
            const gap = 15;

            switch (stepData.position) {
                case 'bottom': {
                    let left = rect.left + rect.width / 2 - popoverWidth / 2;
                    // Clamp position to be within viewport with a 10px margin
                    left = Math.max(10, left);
                    left = Math.min(left, window.innerWidth - popoverWidth - 10);
                    
                    newStyle.top = `${rect.bottom + gap}px`;
                    newStyle.left = `${left}px`;
                    
                    // Position arrow correctly relative to the popover
                    const arrowLeft = rect.left + rect.width / 2 - left;
                    newArrowStyle.top = '-8px';
                    newArrowStyle.left = `${arrowLeft}px`;
                    newArrowStyle.transform = 'translateX(-50%) rotate(45deg)';
                    break;
                }
                case 'top': {
                    let left = rect.left + rect.width / 2 - popoverWidth / 2;
                    left = Math.max(10, left);
                    left = Math.min(left, window.innerWidth - popoverWidth - 10);

                    newStyle.top = `${rect.top - gap}px`;
                    newStyle.left = `${left}px`;
                    newStyle.transform = 'translateY(-100%)';
                    
                    const arrowLeft = rect.left + rect.width / 2 - left;
                    newArrowStyle.bottom = '-8px';
                    newArrowStyle.left = `${arrowLeft}px`;
                    newArrowStyle.transform = 'translateX(-50%) rotate(45deg)';
                    break;
                }
                case 'right': {
                    newStyle.left = `${rect.right + gap}px`;
                    newStyle.top = `${rect.top + rect.height / 2}px`;
                    newStyle.transform = 'translateY(-50%)';
                    newArrowStyle.left = '-8px';
                    newArrowStyle.top = '50%';
                    newArrowStyle.transform = 'translateY(-50%) rotate(45deg)';
                    break;
                }
                case 'left': {
                    newStyle.left = `${rect.left - gap}px`;
                    newStyle.top = `${rect.top + rect.height / 2}px`;
                    newStyle.transform = 'translateX(-100%) translateY(-50%)';
                    newArrowStyle.right = '-8px';
                    newArrowStyle.top = '50%';
                    newArrowStyle.transform = 'translateY(-50%) rotate(45deg)';
                    break;
                }
            }

            setPopoverStyle(newStyle);
            setArrowStyle(newArrowStyle);
        };
        
        const timer = setTimeout(updatePosition, 300);
        window.addEventListener('resize', updatePosition);

        return () => {
            el.classList.remove('tutorial-highlight');
            window.removeEventListener('resize', updatePosition);
            clearTimeout(timer);
        };

    }, [step, steps, currentElement]);
    
    useEffect(() => {
      // Cleanup on unmount
      return () => {
         steps.forEach(s => {
            const el = document.querySelector(s.element);
            el?.classList.remove('tutorial-highlight');
         });
      };
    }, [steps]);

    const currentStepData = steps[step];
    if (!currentStepData) return null;

    const isLastStep = step === steps.length - 1;

    return (
        <div style={popoverStyle}>
            <div className="relative bg-white rounded-lg shadow-tutorial w-80 max-w-sm">
                <div style={arrowStyle}></div>
                <div className="p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white">
                           <MessageCircleIcon className="w-6 h-6"/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-brand-text-primary">{t(currentStepData.titleKey)}</h3>
                            <p className="text-sm text-brand-text-secondary mt-1">{t(currentStepData.textKey)}</p>
                        </div>
                    </div>
                </div>
                 <div className="px-5 py-3 bg-gray-50 rounded-b-lg flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {step > 0 && <Button variant="ghost" onClick={onPrev}>{t('tutorialBack')}</Button>}
                        <Button variant="primary" onClick={isLastStep ? onFinish : onNext}>
                            {isLastStep ? t('tutorialFinish') : t('tutorialNext')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
