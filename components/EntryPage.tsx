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
        className="flex flex-col items-center text-center max-w-sm w-full bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-stone-100"
      >
        <img 
          src="/logo.png.jpg" 
          alt="Braga Marmoraria" 
          className="w-32 h-32 md:w-40 md:h-40 object-contain mb-8 mix-blend-multiply rounded-full transition-transform rotate-[45deg] shadow-sm" 
        />

        <div className="w-full space-y-4">
          <button 
            type="button"
            onClick={handleGuestLogin}
            disabled={showLoading}
            className="w-full py-4 gold-bg text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {showLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>Entrar no Sistema <ArrowRight size={16} /></>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-red-500 text-[9px] font-bold uppercase tracking-wider text-center justify-center px-2 py-1"
              >
                <AlertCircle size={12} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest">
              <span className="bg-white px-3 text-stone-400">Ou use sua conta</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={showLoading}
            className="w-full py-3.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
          >
            <Chrome size={16} className="text-red-500" /> Google Account
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
