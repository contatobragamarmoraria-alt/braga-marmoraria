import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { Columns, Plus, Target, Sparkles, UploadCloud, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  projects: Project[];
  updateProject: (p: Project) => void;
  addProject: (p: Project) => void;
}

const ProjectsModule: React.FC<Props> = ({ projects, updateProject, addProject }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden relative">
      <div className="bg-stone-950 dark:bg-white/5 text-white p-6 rounded-[2rem] relative overflow-hidden shrink-0 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">Módulo de Projetos</span>
            </div>
            <h3 className="text-2xl font-serif leading-tight">
              Gestão Global
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 bg-white dark:bg-onyx p-4 px-6 rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="space-y-0.5">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Todos os Projetos</h2>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
           <button className="flex-1 md:flex-none justify-center px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-[10px] font-bold uppercase text-stone-600 flex items-center gap-1 hover:bg-white transition-all"><UploadCloud size={14} /> Importar Contrato</button>
           <button className="flex-1 md:flex-none justify-center px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-[10px] font-bold uppercase text-stone-600 flex items-center gap-1 hover:bg-white transition-all"><Mic size={14} /> Áudio / IA</button>
           <button className="flex-1 md:flex-none justify-center gold-bg px-4 py-2 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 hover:scale-105 transition-all"><Plus size={14} /> Novo Manual</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <motion.div 
              key={p.id}
              onClick={() => navigate(`/project/${p.id}`)}
              className="bg-white dark:bg-onyx/40 p-6 rounded-3xl border border-stone-200 shadow-sm cursor-pointer hover:border-gold hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-white truncate">{p.clientName}</h4>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-stone-100 px-2 py-1 rounded-md text-stone-500">{p.status}</span>
              </div>
              <p className="text-xs text-stone-500 font-serif italic mb-4 truncate">{p.concept}</p>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
                <span>R$ {(p.value/1000).toFixed(1)}k</span>
                <span>{p.projectType}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsModule;
