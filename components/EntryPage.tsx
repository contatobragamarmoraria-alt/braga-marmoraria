import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, AlertCircle, Loader2, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from './AuthContext';

const EntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, loginAsGuest, loading } = useAuth();
  const [error, setError] = useState('');
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  React.useEffect(() => {
    if (user && !loading) {
      navigate('/app/dashboard');
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    setIsLocalLoading(true);
    setError('');
    try {
      await login();
    } catch (err) {
      setError('Erro ao entrar com Google.');
      setIsLocalLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLocalLoading(true);
    setError('');
    try {
      await loginAsGuest();
      // Navigation will be handled by useEffect when user is set
    } catch (err: any) {
      console.error('Guest login error:', err);
      setError(err.message || 'Erro ao entrar. Verifique se o login anônimo está ativado.');
      setIsLocalLoading(false);
    }
  };

  const showLoading = isLocalLoading || (loading && !error);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 selection:bg-stone-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center max-w-md w-full bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl border border-stone-100"
      >
        <img 
          src="/logo.png" 
          alt="Braga Marmoraria" 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-stone-50 shadow-lg mb-6" 
        />
        
        <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-950 uppercase tracking-tight leading-tight mb-1">
          Acesso ao Portal
        </h1>
        <h2 className="text-sm md:text-base font-serif italic text-stone-500 mb-8">
          Braga Marmoraria
        </h2>

        <div className="w-full space-y-6">
          <button 
            type="button"
            onClick={handleGuestLogin}
            disabled={showLoading}
            className="w-full py-6 gold-bg text-black rounded-2xl text-xs font-bold uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-70"
          >
            {showLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>Entrar no Sistema <ArrowRight size={20} /></>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider text-center justify-center px-2"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-stone-400">Ou use sua conta</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={showLoading}
            className="w-full py-4 bg-white border border-stone-200 text-stone-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
          >
            <Chrome size={18} className="text-red-500" /> Google Account
          </button>
        </div>
      </motion.div>
      
      <div className="mt-12 text-center">
         <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.4em]">Braga Marmoraria • 2026</p>
      </div>
    </div>
  );
};

export default EntryPage;
