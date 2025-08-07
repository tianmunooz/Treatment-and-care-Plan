
import React, { useState, useRef, useEffect } from 'react';
import { Plan, Language } from '../types';
import { Button } from './common/Button';
import { 
  ArrowLeftIcon, 
  DownloadIcon, 
  UserIcon,
  TreatmentPlanIcon,
  SaveIcon,
  EyeIcon,
  ShareIcon,
  SettingsIcon,
  A360Logo,
  LanguagesIcon,
  CheckIcon,
  PlusIcon
} from './icons';
import { TranslationKey } from '../i18n';

interface HeaderProps {
  plan: Plan | null;
  onBack: () => void;
  onDownloadPdf: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  view: 'main' | 'admin';
  onSetView: (view: 'main' | 'admin') => void;
  logoUrl?: string;
  onCreateBlankPlan: () => void;
}

export const Header: React.FC<HeaderProps> = ({ plan, onBack, onDownloadPdf, language, onLanguageChange, t, view, onSetView, logoUrl, onCreateBlankPlan }) => {
  const isMainViewHome = view === 'main' && !plan;
  const isPlanView = view === 'main' && plan;
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangSelect = (lang: Language) => {
    onLanguageChange(lang);
    setLangDropdownOpen(false);
  };
  
  return (
    <header className={isPlanView || view === 'admin' ? 'bg-white border-b border-brand-background-strong' : ''}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             {isMainViewHome && (
                <A360Logo logoUrl={logoUrl} className="h-11 w-auto" />
             )}
             {(isPlanView || view === 'admin') && (
                <>
                    <Button variant="ghost" onClick={onBack} className="!p-2 flex items-center">
                    <ArrowLeftIcon className="w-5 h-5 m-0" />
                    <span className="ml-2 hidden sm:inline">{t('back')}</span>
                    </Button>
                </>
             )}
          </div>
          <div className="flex items-center space-x-2">
            {isPlanView && plan && (
                <div className="hidden lg:flex items-center space-x-2">
                    <Button variant="secondary" Icon={SaveIcon}>{t('save')}</Button>
                    <Button variant="secondary" onClick={onDownloadPdf} Icon={DownloadIcon}>{t('pdf')}</Button>
                    <Button variant="secondary" Icon={EyeIcon}>{t('patientView')}</Button>
                </div>
            )}
            
            {isMainViewHome && (
              <div ref={langDropdownRef} className="relative">
                <Button 
                    variant="secondary" 
                    className="!p-2" 
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    aria-label="Change language"
                >
                    <LanguagesIcon className="w-5 h-5" />
                </Button>

                {langDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-brand-background-strong py-1 z-20">
                        <button 
                            onClick={() => handleLangSelect('en')} 
                            className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-background-soft"
                        >
                            {t('langEnglish')}
                            {language === 'en' && <CheckIcon className="w-4 h-4 text-brand-primary" />}
                        </button>
                        <button 
                            onClick={() => handleLangSelect('es')} 
                            className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-background-soft"
                        >
                            {t('langSpanish')}
                            {language === 'es' && <CheckIcon className="w-4 h-4 text-brand-primary" />}
                        </button>
                    </div>
                )}
              </div>
            )}
            
            {isMainViewHome && (
                <Button id="create-plan-button" variant="primary" onClick={onCreateBlankPlan} className="!p-2.5 sm:!py-2 sm:!px-4" aria-label={t('patientPlan')}>
                    <PlusIcon className="w-5 h-5 sm:mr-2 sm:-ml-1" />
                    <span className="hidden sm:inline">{t('patientPlan')}</span>
                </Button>
            )}

            {isMainViewHome && (
                 <Button
                    id="tutorial-admin-button"
                    variant="secondary"
                    onClick={() => onSetView('admin')}
                    className="!p-2.5 sm:!py-2 sm:!px-4"
                    aria-label={t('admin')}
                 >
                    <SettingsIcon className="w-5 h-5 sm:mr-2 sm:-ml-1" />
                    <span className="hidden sm:inline">{t('admin')}</span>
                </Button>
            )}

            {isPlanView && plan && (
                <Button variant="primary" Icon={ShareIcon}>{t('finalize')}</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};