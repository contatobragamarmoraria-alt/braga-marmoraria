import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, AlertCircle, Loader2, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from './AuthContext';

const EntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  React.useEffect(() => {
    if (user && !loading) {
      navigate('/app/dashboard');
    }
  }, [user, loading, navigate]);

  const handleStart = () => {
    setIsLocalLoading(true);
    // Redireciona para o dashboard, que por ser rota protegida, 
    // levará o usuário para a tela de Login se ele não estiver autenticado.
    navigate('/app/dashboard');
  };

  const showLoading = isLocalLoading || loading;

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
          className="w-32 h-32 md:w-40 md:h-40 object-contain mb-8 mix-blend-multiply rounded-full transition-transform rotate-[-45deg] shadow-sm" 
        />

        <div className="w-full space-y-4">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-stone-900 uppercase tracking-tight">Atelier Digital</h2>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Gestão de Produção de Luxo</p>
          </div>

          <button 
            type="button"
            onClick={handleStart}
            disabled={showLoading}
            className="w-full py-4 gold-bg text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {showLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>Acessar Área Restrita <Lock size={16} /></>
            )}
          </button>

          <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest pt-2">
            Acesso exclusivo para equipe e clientes autorizados
          </p>
        </div>
      </motion.div>
      
      <div className="mt-12 text-center">
         <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.4em]">Braga Marmoraria • 2026</p>
      </div>
    </div>
  );
};

export default EntryPage;

