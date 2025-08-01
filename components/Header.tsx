import React from 'react';
import { Plan } from '../types';
import { Button } from './common/Button';
import { 
  ArrowLeftIcon, 
  DownloadIcon, 
  UserIcon,
  TreatmentPlanIcon,
  SaveIcon,
  EyeIcon,
  ShareIcon
} from './icons';

interface HeaderProps {
  plan: Plan | null;
  onBack: () => void;
  onDownloadPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({ plan, onBack, onDownloadPdf }) => {
  return (
    <header className="bg-white border-b border-brand-background-strong">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <Button variant="ghost" onClick={onBack} className="!p-2 flex items-center">
              <ArrowLeftIcon className="w-5 h-5 m-0" />
              <span className="ml-2 hidden sm:inline">Back</span>
            </Button>
            <div className="w-px h-6 bg-brand-background-strong" />
            <div className="flex items-center space-x-3">
              <UserIcon className="w-6 h-6 text-brand-text-secondary" />
              <span className="text-xl font-semibold text-brand-text-primary">
                {plan?.patient?.name || "Sarah Johnson"}
              </span>
            </div>
            <div className="hidden md:flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              <TreatmentPlanIcon className="w-4 h-4 mr-1.5" />
              Treatment Plan
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="secondary" Icon={SaveIcon}>Save</Button>
              <Button variant="secondary" onClick={onDownloadPdf} Icon={DownloadIcon}>PDF</Button>
              <Button variant="secondary" Icon={EyeIcon}>Patient View</Button>
            </div>
            <Button variant="primary" Icon={ShareIcon} className="bg-slate-700 hover:bg-slate-800">Finalize</Button>
          </div>
        </div>
      </div>
    </header>
  );
};