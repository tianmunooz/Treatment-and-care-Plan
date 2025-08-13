
import React, { useState, useRef, useEffect } from 'react';
import { Plan, Language } from '../types';
import { Button } from './common/Button';
import { 
  ArrowLeftIcon, 
  DownloadIcon, 
  SettingsIcon,
  A360Logo,
  PlusIcon,
  SaveIcon,
  EyeIcon,
  ShareIcon,
  LogOutIcon
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
  onLogout: () => void;
  isLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ plan, onBack, onDownloadPdf, language, onLanguageChange, t, view, onSetView, logoUrl, onCreateBlankPlan, onLogout, isLoggedIn }) => {
  const isMainViewHome = view === 'main' && !plan;
  const isPlanView = view === 'main' && plan;
  
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
              <>
                <Button id="create-plan-button" variant="primary" onClick={onCreateBlankPlan} className="!p-2.5 sm:!py-2 sm:!px-4" aria-label={t('patientPlan')}>
                    <PlusIcon className="w-5 h-5 sm:mr-2 sm:-ml-1" />
                    <span className="hidden sm:inline">{t('patientPlan')}</span>
                </Button>

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
              </>
            )}

            {isPlanView && plan && (
                <Button variant="primary" Icon={ShareIcon}>{t('finalize')}</Button>
            )}

            {isLoggedIn && !isMainViewHome && (
                 <Button
                    variant="secondary"
                    onClick={onLogout}
                    className="!p-2.5 sm:!py-2 sm:!px-4 !bg-red-50 !text-red-700 !border-red-200 hover:!bg-red-100 focus:!ring-red-300"
                    aria-label={t('logout')}
                 >
                    <LogOutIcon className="w-5 h-5 sm:mr-2 sm:-ml-1" />
                    <span className="hidden sm:inline">{t('logout')}</span>
                </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
