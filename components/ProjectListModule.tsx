import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseProjectService, SupabaseProject } from '../services/supabaseProjectService';
import { Plus, LayoutTemplate, MapPin, Tag, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectFormDialog from './ProjectFormDialog';

const ProjectListModule: React.FC = () => {
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await supabaseProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Falha ao carregar projetos', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = () => {
    fetchProjects();
  };

  return (
    <div className="flex flex-col gap-4 relative min-h-full pb-8">
      {/* Header Banner */}
      <div className="bg-stone-950 dark:bg-white/5 text-white p-6 rounded-[2rem] relative overflow-hidden shrink-0 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LayoutTemplate size={16} className="text-gold" />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">Base Geral Supabase</span>
            </div>
            <h3 className="text-2xl font-serif leading-tight">
              Projetos Ativos
            </h3>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[7px] font-bold uppercase tracking-widest text-stone-500 mb-0.5">Total de Projetos</p>
              <p className="text-xl font-serif text-gold">{projects.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 bg-white dark:bg-onyx p-4 px-6 rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="space-y-0.5">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Lista de Obras</h2>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
           <button onClick={() => setIsFormOpen(true)} className="flex-1 md:flex-none justify-center gold-bg px-4 md:px-5 py-2 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> Novo Projeto</button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-3xl border border-stone-200 border-dashed">
          <LayoutTemplate size={32} className="text-stone-300 mb-3" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Nenhum projeto encontrado</h3>
          <p className="text-xs text-stone-400 mt-2">Clique em 'Novo Projeto' para adicionar a sua primeira obra no Supabase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scroll">
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              onClick={() => navigate(`/app/projetos-detalhe/${project.id}`)}
              className="bg-white dark:bg-onyx p-5 rounded-[1.5rem] border border-stone-200 shadow-sm cursor-pointer hover:border-gold/50 hover:shadow-md transition-all flex flex-col gap-3 group"
            >
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-white group-hover:text-gold transition-colors">{project.name}</h4>
                <span className="text-[8px] font-bold uppercase tracking-widest bg-stone-100 dark:bg-white/5 px-2 py-1 rounded border border-stone-200 dark:border-white/10 text-stone-500 shrink-0">{project.status}</span>
              </div>
              
              <div className="space-y-1.5 flex-1">
                {project.client_name && (
                   <p className="text-xs text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wide flex items-center gap-1.5"><span className="w-4 h-4 bg-stone-100 rounded flex items-center justify-center shrink-0">C</span> {project.client_name}</p>
                )}
                {project.type && (
                   <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5"><Tag size={12} className="shrink-0" /> {project.type} {project.area ? `- ${project.area}` : ''}</p>
                )}
                {project.address && (
                   <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 line-clamp-1"><MapPin size={12} className="shrink-0" /> {project.address}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Formulário Modal */}
      <AnimatePresence>
        {isFormOpen && (
           <ProjectFormDialog onClose={() => setIsFormOpen(false)} onCreated={handleProjectCreated} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectListModule;
