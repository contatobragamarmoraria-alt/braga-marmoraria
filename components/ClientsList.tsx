
import React, { useState } from 'react';
import { Search, UserPlus, Filter, ChevronRight, DollarSign, Sparkles, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { MOCK_USER } from '../constants';

const ClientsList: React.FC<{ projects: Project[], onDelete: (id: string) => void }> = ({ projects, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeProjects = projects.filter(p => !p.deletedAt);

  const filteredProjects = activeProjects.filter(p => 
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col h-full overflow-hidden">
      {/* Welcome Section */}
      <div className="bg-stone-950 dark:bg-white/5 text-white p-5 rounded-2xl relative overflow-hidden shrink-0 shadow-sm">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">Gestão de Clientes</span>
            </div>
            <h3 className="text-2xl font-serif leading-tight">
              Olá, {MOCK_USER.name.split(' ')[1] || MOCK_USER.name}
            </h3>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[7px] font-bold uppercase tracking-widest text-stone-500 mb-0.5">Total de Clientes</p>
              <p className="text-xl font-serif text-gold">{projects.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 bg-white dark:bg-onyx p-4 rounded-2xl border border-stone-200 dark:border-white/5">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input 
            type="text" 
            placeholder="Pesquisar proprietário ou obra..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-gold transition-all text-[11px] text-stone-900 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-[10px] font-bold text-stone-500 uppercase tracking-widest hover:text-gold transition-all">
            <Filter size={14} />
            Segmentar
          </button>
          <button className="flex-1 md:flex-none gold-bg flex justify-center items-center gap-2 px-6 py-3 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
            <UserPlus size={16} />
            Novo Cadastro
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll pr-2 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="relative group">
              <Link 
                to={`/project/${project.id}`}
                className="block bg-white dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl p-3 hover:border-gold/40 transition-all flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md min-h-[140px]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-stone-100 dark:border-white/10 shadow-sm shrink-0">
                      {project.clientAvatar ? (
                        <img src={project.clientAvatar} alt={project.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-stone-100 dark:bg-white/5 flex items-center justify-center text-stone-400 font-serif text-[10px]">
                          {project.clientName[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[11px] font-serif font-bold text-stone-950 dark:text-white truncate group-hover:text-gold transition-colors">{project.clientName}</h3>
                      <p className="text-[7px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{project.id}</p>
                    </div>
                  </div>
                  <div className="text-stone-300 dark:text-stone-700 opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight size={12} />
                  </div>
                </div>

                <div className="mb-2 flex-1">
                  <p className="text-[9px] text-stone-500 dark:text-stone-400 font-medium italic truncate mb-1">{project.projectType}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-gold" />
                    <span className="text-[7px] font-bold text-stone-400 uppercase tracking-widest">
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-50 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-stone-900 dark:text-stone-100">
                    <DollarSign size={8} className="text-gold" />
                    <span className="text-[9px] font-serif font-bold">
                      {project.value >= 1000 ? `${(project.value/1000).toFixed(1)}k` : project.value}
                    </span>
                  </div>
                  <Link 
                    to={`/client/${project.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-1 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg text-[7px] font-bold uppercase tracking-widest text-stone-400 hover:text-gold hover:border-gold/30 transition-all"
                  >
                    Portal
                  </Link>
                </div>
              </Link>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmDelete(project.id);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          
          <button className="border border-dashed border-stone-200 dark:border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-stone-300 hover:border-gold hover:text-gold transition-all group min-h-[140px]">
             <UserPlus size={16} className="mb-2 group-hover:scale-110 transition-transform" />
             <span className="text-[8px] font-bold uppercase tracking-widest">Novo Proprietário</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
              <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight mb-2">Mover para Lixeira?</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
                O cliente e todos os seus processos serão movidos para a lixeira. Você poderá restaurá-los em até 30 dias.
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
                    onDelete(confirmDelete);
                    setConfirmDelete(null);
                  }}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientsList;
