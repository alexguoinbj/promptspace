import React, { useState, useEffect } from 'react';
import { X, Mail, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  language: 'zh' | 'en';
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, language }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setEmail('');
      setPassword('');
      setCode('');
      setMode('login');
    }
  }, [isOpen]);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg(language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsSending(true);
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    setIsSending(false);
    
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg(language === 'zh' ? '验证码已发送，请查收邮箱' : 'Verification code sent to email');
    setCountdown(60);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    
    if (mode === 'login') {
      if (!password) {
        setErrorMsg(language === 'zh' ? '请输入密码' : 'Please enter password');
        setIsSubmitting(false);
        return;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(language === 'zh' ? '邮箱或密码错误' : 'Invalid email or password');
      } else if (data.session) {
        onLogin(email);
      }
    } else {
      if (!code || !password) {
        setErrorMsg(language === 'zh' ? '请输入验证码和密码' : 'Please enter code and password');
        setIsSubmitting(false);
        return;
      }
      
      // 注册逻辑：先验证验证码登录，然后再设置密码
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (error) {
        setErrorMsg(language === 'zh' ? '验证码错误或已过期' : 'Invalid or expired code');
      } else if (data.session) {
        // 登录成功后设置密码
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setErrorMsg(updateError.message);
        } else {
          onLogin(email);
        }
      }
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-[#1a1d23] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`text-2xl font-bold transition-colors ${mode === 'login' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
                >
                  {language === 'zh' ? '登录' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`text-2xl font-bold transition-colors ${mode === 'register' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}
                >
                  {language === 'zh' ? '注册' : 'Register'}
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-500/10 rounded-xl">
                  {successMsg}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {language === 'zh' ? '邮箱地址' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {language === 'zh' ? '验证码' : 'Verification Code'}
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        required
                        maxLength={8}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={language === 'zh' ? '邮箱验证码' : 'Email Code'}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <button 
                      type="button"
                      disabled={countdown > 0 || !email || isSending}
                      onClick={handleSendCode}
                      className="px-4 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
                    >
                      {isSending ? <Loader2 size={18} className="animate-spin" /> : (countdown > 0 ? `${countdown}s` : (language === 'zh' ? '获取验证码' : 'Get Code'))}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {mode === 'login' ? (language === 'zh' ? '密码' : 'Password') : (language === 'zh' ? '设置密码' : 'Set Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'login' ? (language === 'zh' ? '输入密码' : 'Enter password') : (language === 'zh' ? '设置新密码' : 'Set new password')}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !email || (mode === 'login' ? !password : (!code || !password))}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (mode === 'login' ? (language === 'zh' ? '立即登录' : 'Login now') : (language === 'zh' ? '注册并登录' : 'Register & Login'))}
              </button>
            </form>

            {mode === 'register' && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
                <p className="text-xs text-gray-400">
                  {language === 'zh' ? '注册成功后我们将以您设置的密码作为此后登录的凭证。' : 'After successful registration, your password will be used for subsequent logins.'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
