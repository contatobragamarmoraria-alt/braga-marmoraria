
import React, { useState, useMemo } from 'react';
import { Trash2, RotateCcw, Search, AlertCircle, Calendar, User, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

interface TrashProps {
  projects: Project[];
  onRestore: (projectId: string) => void;
  onDeletePermanent: (projectId: string) => void;
}

const Trash: React.FC<TrashProps> = ({ projects, onRestore, onDeletePermanent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const deletedProjects = useMemo(() => {
    return projects.filter(p => p.deletedAt).sort((a, b) => {
      return new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime();
    });
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return deletedProjects.filter(p => 
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deletedProjects, searchQuery]);

  const getDaysRemaining = (deletedAt: string) => {
    const deleteDate = new Date(deletedAt);
    const expiryDate = new Date(deleteDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="h-full flex flex-col space-y-8 pb-20 overflow-hidden">
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tighter">Lixeira</h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Projetos removidos serão excluídos permanentemente após 30 dias</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar na lixeira..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-onyx border border-stone-200 dark:border-white/5 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll pr-2">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(project => {
              const daysLeft = getDaysRemaining(project.deletedAt!);
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={project.id}
                  className="bg-white dark:bg-onyx p-6 rounded-[2.5rem] border border-stone-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">{project.clientName}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                        <Briefcase size={12} />
                        {project.projectType}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[8px] font-bold uppercase tracking-widest border border-red-500/20">
                      {daysLeft} dias restantes
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <Calendar size={14} />
                      Excluído em: {new Date(project.deletedAt!).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <User size={14} />
                      Responsável: {project.responsible}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-stone-100 dark:border-white/5">
                    <button 
                      onClick={() => onRestore(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <RotateCcw size={14} />
                      Restaurar
                    </button>
                    <button 
                      onClick={() => setConfirmDelete(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-stone-400 space-y-4 bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/5">
            <Trash2 size={48} className="opacity-20" />
            <p className="text-sm font-serif italic">A lixeira está vazia</p>
          </div>
        )}
      </div>

      {/* Permanent Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-onyx rounded-[3rem] p-8 border border-stone-200 dark:border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight mb-2">Excluir Permanentemente?</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
                Esta ação não pode ser desfeita. Todos os dados associados a este projeto serão removidos para sempre.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    onDeletePermanent(confirmDelete);
                    setConfirmDelete(null);
                  }}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
                >
                  Excluir Agora
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Trash;
