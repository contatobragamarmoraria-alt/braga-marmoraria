
import React from 'react';
import { Project } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  project: Project;
}

const ProjectCalendar: React.FC<Props> = ({ project }) => {
  // Simplificação: apenas exibe as atividades da timeline que possuem data
  const datedActions = project.timeline.filter(a => a.date);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
         <div>
            <h3 className="text-3xl font-serif text-stone-900 dark:text-white">Agenda Executiva</h3>
            <p className="text-[10px] text-stone-500 uppercase tracking-[0.3em] mt-2">Novembro / Dezembro 2023</p>
         </div>
         <div className="flex gap-2">
            <button className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full"><ChevronLeft size={20}/></button>
            <button className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full"><ChevronRight size={20}/></button>
         </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-stone-200 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
          <div key={day} className="bg-stone-50 dark:bg-onyx p-4 text-center">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{day}</span>
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const dayNum = (i % 31) + 1;
          const hasEvent = datedActions.find(a => parseInt(a.date!.split('-')[2]) === dayNum);
          
          return (
            <div key={i} className="min-h-[140px] bg-white dark:bg-onyx p-4 group hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-colors relative">
              <span className="text-xs font-serif text-stone-300 dark:text-stone-700">{dayNum}</span>
              {hasEvent && (
                <div className="mt-2 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl space-y-2">
                  <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">{hasEvent.label}</p>
                  <p className="text-[8px] text-stone-500 leading-tight">{hasEvent.description.substring(0, 30)}...</p>
                </div>
              )}
              {i === 15 && (
                 <div className="absolute inset-0 bg-stone-900/5 dark:bg-white/5 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-8 items-center p-8 bg-stone-50 dark:bg-white/5 rounded-3xl border border-stone-100 dark:border-white/5">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] font-bold uppercase text-stone-400">Atividade Marmoraria</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase text-stone-400">Instalação / Obra Ativa</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-stone-300" />
            <span className="text-[10px] font-bold uppercase text-stone-400">Feriado / Recesso</span>
         </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;
