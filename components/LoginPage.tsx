
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Sparkles, User, ShieldCheck, Mail, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';
import { AppUser } from '../types';

const LoginPage = () => {
  const { loginWithEmail, loginWithPin } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isClientMode, setIsClientMode] = useState(false);
  const [email, setEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isClientMode) {
      if (!clientName || !password) {
        setError('Por favor, informe seu nome e código.');
        setLoading(false);
        return;
      }
      try {
        await loginWithPin(clientName, password);
      } catch (err: any) {
        setError(err.message || 'Erro ao entrar. Verifique seus dados.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        setError('Por favor, informe seu e-mail e senha.');
        setLoading(false);
        return;
      }
      try {
        await loginWithEmail(email, password);
      } catch (err: any) {
        setError(err.message || 'Credenciais inválidas.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory dark:bg-onyx p-4 selection:bg-gold selection:text-black">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/80 dark:bg-onyx/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-stone-200/50 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] space-y-10">
          
          {/* Logo & Header */}
          <div className="text-center space-y-4">
            <motion.div 
              initial={{ scale: 0.8, rotate: -45 }}
              animate={{ scale: 1, rotate: -45 }}
              className="w-20 h-20 bg-stone-950 text-gold rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-gold/20"
            >
              <Sparkles size={32} />
            </motion.div>
            <div className="space-y-1">
              <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">
                Braga <span className="text-gold">Marmoraria</span>
              </h2>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-[0.3em]">
                Sistema de Gestão de Produção
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-stone-100/50 dark:bg-white/5 rounded-2xl p-1.5 border border-stone-200/50 dark:border-white/5">
            <button 
              onClick={() => { setIsClientMode(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                !isClientMode 
                  ? 'bg-white dark:bg-white/10 shadow-lg text-stone-900 dark:text-white' 
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <ShieldCheck size={14} /> Equipe
            </button>
            <button 
              onClick={() => { setIsClientMode(true); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                isClientMode 
                  ? 'bg-white dark:bg-white/10 shadow-lg text-stone-900 dark:text-white' 
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <User size={14} /> Cliente
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Identity Input */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-2 px-1">
                  {isClientMode ? 'Seu Nome Completo' : 'E-mail Corporativo'}
                </label>
                <div className="relative group">
                  <input 
                    type={isClientMode ? "text" : "email"} 
                    value={isClientMode ? clientName : email}
                    onChange={e => isClientMode ? setClientName(e.target.value) : setEmail(e.target.value)}
                    className="w-full p-4 pl-12 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-200/50 dark:border-white/10 text-stone-900 dark:text-white text-sm focus:border-gold dark:focus:border-gold outline-none transition-all"
                    placeholder={isClientMode ? "Ex: João da Silva" : "seu@email.com"}
                  />
                  {isClientMode ? (
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-gold transition-colors" size={18} />
                  ) : (
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-gold transition-colors" size={18} />
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-2 px-1">
                  {isClientMode ? 'Código de Acesso (PIN)' : 'Senha de Acesso'}
                </label>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-200/50 dark:border-white/10 text-stone-900 dark:text-white text-sm focus:border-gold dark:focus:border-gold outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-gold transition-colors" size={18} />
                </div>
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-bold text-red-500 uppercase tracking-wider text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 gold-bg text-black rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-[0_20px_40px_-12px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Validar Acesso
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="pt-4 text-center">
            <p className="text-[9px] text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-relaxed">
              &copy; 2026 Braga Marmoraria <br /> Artesania Digital & Gestão de Luxo
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
