
import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { A360Logo, MailIcon, EyeOffIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, AlertTriangleIcon } from './icons';
import { getTranslator, Language, TranslationKey } from '../i18n';
import { Checkbox } from './common/Checkbox';
import { Modal } from './common/Modal';

const RightPanel: React.FC<{ t: (key: TranslationKey) => string }> = ({ t }) => (
     <div className="relative hidden lg:flex flex-col items-center justify-end w-1/2 h-full bg-login-hero bg-cover bg-center p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="relative w-full">
            <h2 className="text-3xl font-bold">{t('optimizeTitle')}</h2>
            <p className="mt-4 text-white/80">{t('optimizeSubtitle')}</p>
            <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-1 bg-white/80 rounded-full"></div>
                    <div className="w-10 h-1 bg-white/30 rounded-full"></div>
                    <div className="w-10 h-1 bg-white/30 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronLeftIcon className="w-5 h-5"/></button>
                    <button className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/10 transition-colors"><ChevronRightIcon className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
     </div>
);

export const Login: React.FC<{ language: Language }> = ({ language }) => {
  const t = getTranslator(language);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showErrorModal = (message: string) => {
    setError(message);
    setIsErrorModalOpen(true);
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              practice_name: practiceName,
            }
          }
        });
        if (error) throw error;
        alert('Sign up successful! Please check your email to verify your account and then log in.');
        setIsSignUp(false);
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // onAuthStateChange in App.tsx will handle successful login
      }
    } catch (err: any) {
      const errorMessage = err.error_description || err.message;
      if (err.status === 401 || (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('invalid api key'))) {
          showErrorModal(t('invalidApiKeyError'));
      } else {
          showErrorModal(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleFastLogin = async () => {
    setLoading(true);
    setError(null);
    const devEmail = 'dev@aesthetics360.com';
    const devPassword = 'Withfriends1234*!';
    
    try {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: devEmail, password: devPassword });
        if (!signInError) {
             setLoading(false);
             return;
        }

        if (signInError && (signInError.message.includes('Invalid login credentials') || signInError.message.includes('User not found'))) {
             const { error: signUpError } = await supabase.auth.signUp({
                 email: devEmail,
                 password: devPassword,
                 options: {
                     data: {
                         full_name: 'Dev User',
                         practice_name: 'Dev Clinic',
                     }
                 }
             });
             if (signUpError && !signUpError.message.includes('User already registered')) {
                throw signUpError
             }
        } else {
            throw signInError;
        }

    } catch (err: any) {
        const errorMessage = err.error_description || err.message;
        if (err.status === 401 || (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('invalid api key'))) {
            showErrorModal(t('invalidApiKeyError'));
        } else {
            showErrorModal(errorMessage);
        }
    } finally {
        setLoading(false);
    }
  };


  return (
    <>
        <Modal
            isOpen={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
            title={t('authErrorTitle')}
            size="md"
            footer={
                <Button variant="secondary" className="w-full justify-center" onClick={() => setIsErrorModalOpen(false)}>
                    {t('close')}
                </Button>
            }
        >
            <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <p className="text-brand-text-secondary mt-4">
                    {error}
                </p>
            </div>
        </Modal>

        <div className="w-full h-screen flex bg-white">
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-8 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md mx-auto">
                    <A360Logo className="h-9 mb-8" />
                    
                    <h1 className="text-3xl font-bold text-brand-text-primary">{isSignUp ? t('createAccount') : t('signIn')}</h1>
                    <p className="text-brand-text-secondary mt-2">{isSignUp ? t('signUpSubtitle') : t('signInSubtitle')}</p>
                    
                    <form onSubmit={handleAuthAction} className="mt-8 space-y-4">
                        {isSignUp && (
                            <>
                                <Input label={t('yourName')} value={name} onChange={e => setName(e.target.value)} required />
                                <Input label={t('practiceName')} value={practiceName} onChange={e => setPracticeName(e.target.value)} required />
                            </>
                        )}

                        <Input 
                            Icon={MailIcon}
                            label={t('emailLabel')}
                            id="email"
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <Input
                                label={t('passwordLabel')}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('passwordPlaceholder')}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-7">
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {!isSignUp && (
                            <div className="flex items-center justify-between">
                                <Checkbox
                                    id="remember-me"
                                    label={t('rememberMe')}
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <a href="#" className="text-sm font-semibold text-brand-primary hover:underline">{t('forgotPassword')}</a>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-x-2 pt-2">
                            <Button 
                                type="submit" 
                                className="flex-grow !py-2.5 !text-base"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (isSignUp ? t('signUpButton') : t('loginButton'))}
                            </Button>
                            <Button 
                                type="button" 
                                variant="secondary"
                                onClick={handleFastLogin}
                                className="!py-2.5"
                                aria-label="Fast Login (Dev)"
                                disabled={loading}
                            >
                            Fast Login
                            </Button>
                        </div>
                    </form>
                    
                    <div className="text-center mt-6">
                        <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="text-sm font-semibold text-brand-primary hover:underline">
                            {isSignUp ? t('alreadyHaveAccount') : t('noAccount')}
                        </button>
                    </div>

                </div>
                <div className="w-full max-w-md mx-auto mt-auto pt-8 text-center text-xs text-brand-text-body">
                    <div className="flex justify-center items-center gap-x-4">
                        <a href="#" className="hover:underline">{t('termsOfService')}</a>
                        <span className="text-gray-300">&bull;</span>
                        <a href="#" className="hover:underline">{t('privacyPolicy')}</a>
                        <span className="text-gray-300">&bull;</span>
                        <a href="#" className="hover:underline">{t('cookies')}</a>
                    </div>
                    <p className="mt-2">{t('copyright', { year: new Date().getFullYear().toString() })}</p>
                </div>
            </div>
            <RightPanel t={t} />
        </div>
    </>
  );
};