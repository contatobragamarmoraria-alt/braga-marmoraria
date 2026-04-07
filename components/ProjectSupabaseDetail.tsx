import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseProjectService, SupabaseProject } from '../services/supabaseProjectService';
import { ChevronLeft, FileText, Activity, LayoutTemplate, MapPin, Tag, Box, CheckCircle, Calendar, Download } from 'lucide-react';

const ProjectSupabaseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<SupabaseProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await supabaseProjectService.getProjectById(id);
      setProject(data);
      setIsLoading(false);
    };
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center bg-white dark:bg-onyx rounded-3xl mt-8">
        <h2 className="text-xl font-bold text-stone-900 border-b pb-4 mb-4">Projeto não encontrado</h2>
        <button onClick={() => navigate('/app/projetos-lista')} className="text-stone-500 hover:text-gold flex items-center justify-center gap-2 mx-auto"><ChevronLeft size={16} /> Voltar para lista</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative min-h-full pb-10">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><LayoutTemplate size={120} /></div>
        <div className="flex items-center gap-4 text-stone-500 mb-6">
           <button onClick={() => navigate('/app/projetos-lista')} className="p-2 border border-stone-200 dark:border-white/10 rounded-xl hover:bg-stone-50 dark:hover:bg-white/5 transition-all"><ChevronLeft size={16}/></button>
           <span className="text-[10px] font-bold uppercase tracking-widest">Painel do Projeto</span>
        </div>
        
        <div className="flex justify-between items-start z-10 relative">
           <div>
             <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">{project.name}</h1>
             <div className="flex flex-wrap items-center gap-4 mt-3 text-stone-500 text-xs font-bold uppercase tracking-widest">
               {project.client_name && <span className="flex items-center gap-1.5"><Box size={14}/> {project.client_name}</span>}
               {project.type && <span className="flex items-center gap-1.5"><Tag size={14}/> {project.type} {project.area && `(${project.area})`}</span>}
               {project.address && <span className="flex items-center gap-1.5"><MapPin size={14}/> {project.address}</span>}
             </div>
           </div>
           <span className="px-4 py-2 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px] text-stone-600 dark:text-stone-300">
             STATUS: {project.status}
           </span>
        </div>
        
        {project.description && (
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-white/5">
             <p className="text-sm font-serif italic text-stone-600 dark:text-stone-400">{project.description}</p>
          </div>
        )}
      </div>

      {/* Grid for Etapas, Ocorrencias, Arquivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Etapas */}
        <div className="bg-white dark:bg-onyx border border-stone-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-white/5 pb-4">
             <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><CheckCircle size={18}/></div>
             <h3 className="font-bold text-sm uppercase tracking-widest">Etapas</h3>
           </div>
           
           <div className="space-y-4">
             {(!project.timeline || project.timeline.length === 0) ? (
               <p className="text-xs text-stone-400 font-serif italic">Nenhuma etapa cadastrada.</p>
             ) : (
               project.timeline.map((item, idx) => (
                 <div key={idx} className="flex gap-3 items-center">
                   <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${item.completed ? 'border-blue-500 bg-blue-500' : 'border-stone-300 dark:border-stone-600'}`}>
                     {item.completed && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                   </div>
                   <span className={`text-xs font-bold uppercase tracking-wider ${item.completed ? 'text-stone-400 line-through' : 'text-stone-900 dark:text-white'}`}>{item.label}</span>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Ocorrências */}
        <div className="bg-white dark:bg-onyx border border-stone-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-white/5 pb-4">
             <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Activity size={18}/></div>
             <h3 className="font-bold text-sm uppercase tracking-widest">Ocorrências</h3>
           </div>
           
           <div className="space-y-4">
             {(!project.occurrences || project.occurrences.length === 0) ? (
               <p className="text-xs text-stone-400 font-serif italic">Nenhuma ocorrência registrada.</p>
             ) : (
               project.occurrences.map((occ, idx) => (
                 <div key={idx} className="p-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl border-l-4" style={{borderLeftColor: occ.type === 'POSITIVE' ? '#10b981' : occ.type === 'NEGATIVE' ? '#ef4444' : '#f59e0b'}}>
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900 dark:text-white">{occ.title}</span>
                     <span className="text-[8px] font-bold tracking-widest text-stone-400 flex flex-col items-end"><Calendar size={8} className="mb-0.5"/>{occ.date}</span>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Arquivos */}
        <div className="bg-white dark:bg-onyx border border-stone-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-white/5 pb-4">
             <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><FileText size={18}/></div>
             <h3 className="font-bold text-sm uppercase tracking-widest">Arquivos</h3>
           </div>
           
           <div className="space-y-3">
             {(!project.documents || project.documents.length === 0) ? (
               <p className="text-xs text-stone-400 font-serif italic">Nenhum arquivo anexado.</p>
             ) : (
               project.documents.map((doc, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 border border-stone-100 dark:border-white/5 rounded-xl bg-stone-50 dark:bg-white/5 hover:border-gold/30 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-lg text-purple-500"><FileText size={14}/></div>
                      <span className="text-[10px] font-bold tracking-widest text-stone-600 dark:text-stone-300 group-hover:text-gold transition-colors">{doc.name}</span>
                    </div>
                    <Download size={14} className="text-stone-300 group-hover:text-gold transition-colors" />
                 </div>
               ))
             )}
           </div>
        </div>

      </div>

    </div>
  );
};

export default ProjectSupabaseDetail;
