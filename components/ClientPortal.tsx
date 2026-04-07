
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, LayoutDashboard, Clock, FileText, 
  MessageSquare, Settings, Sparkles, ChevronRight,
  ShieldCheck, HardHat, Camera, Compass
} from 'lucide-react';
import { Project, AppUser } from '../types';

interface Props {
  user: AppUser;
  projects: Project[];
  onNavigate: (tab: string, pid?: string) => void;
}

const ClientPortal: React.FC<Props> = ({ user, projects, onNavigate }) => {
  const clientProjects = projects.filter(p => p.clientEmail === user.email);

  return (
    <div className="h-full overflow-y-auto custom-scroll p-4 md:p-12 lg:p-20 space-y-16">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-b border-stone-200 dark:border-white/5 pb-12">
        <div className="space-y-3 text-center md:text-left">
          <span className="px-4 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-[0.4em]">Portal do Proprietário</span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tighter leading-tight">Olá, {user.name.split(' ')[0]}</h1>
          <p className="text-stone-500 font-serif italic text-xl max-w-xl">Bem-vindo ao seu espaço exclusivo de acompanhamento artesanal.</p>
        </div>
        <div className="flex gap-4">
           <div className="p-8 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-[2.5rem] flex flex-col items-center">
              <span className="text-4xl font-serif text-gold font-bold">{clientProjects.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Projetos Ativos</span>
           </div>
           <div className="p-8 bg-stone-900 rounded-[2.5rem] text-white flex flex-col items-center border border-white/10 shadow-xl">
              <Sparkles size={24} className="text-gold mb-2" />
              <span className="text-sm font-serif font-bold text-gold uppercase tracking-widest">Premium</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mt-1">Nível de Acesso</span>
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-20">
        <section className="space-y-8">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 px-1">Meus Compromissos & Projetos</h3>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {clientProjects.map((p, i) => (
               <motion.div 
                 key={p.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="group relative bg-white dark:bg-white/5 rounded-[3rem] border border-stone-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-2xl hover:border-gold/30 transition-all cursor-pointer"
                 onClick={() => onNavigate('projects', p.id)}
               >
                  <div className="h-64 relative overflow-hidden">
                     <img src={p.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                        <span className="px-3 py-1 bg-gold text-black rounded-lg text-[9px] font-bold uppercase tracking-widest inline-block w-fit mb-3">{p.status.replace('_', ' ')}</span>
                        <h4 className="text-2xl font-serif font-bold text-white uppercase tracking-tight">{p.projectType}</h4>
                     </div>
                  </div>
                  <div className="p-10 space-y-8">
                     <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                           <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Progresso</p>
                           <p className="text-xl font-serif text-stone-900 dark:text-white">{p.progress}%</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Entrega</p>
                           <p className="text-xl font-serif text-stone-900 dark:text-white capitalize">{p.estimatedDelivery}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Responsável</p>
                           <p className="text-xl font-serif text-stone-900 dark:text-white text-xs">{p.responsible}</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2">
                           <Clock size={14} className="text-gold" /> Ver Linha do Tempo
                        </button>
                        <button className="flex-1 py-4 bg-white dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-gold transition-all flex items-center justify-center gap-2">
                           <MessageSquare size={14} className="text-stone-400" /> Falar com Equipe
                        </button>
                     </div>
                  </div>
               </motion.div>
             ))}

             {clientProjects.length === 0 && (
               <div className="col-span-full p-20 bg-stone-50 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-stone-200 dark:border-white/10 flex flex-col items-center justify-center text-center space-y-6">
                  <Compass size={48} className="text-stone-300" />
                  <div className="space-y-2">
                    <h4 className="text-2xl font-serif font-bold text-stone-800 dark:text-white uppercase tracking-tight">Nenhum projeto encontrado</h4>
                    <p className="text-stone-400 text-sm max-w-sm font-serif">Parece que você ainda não possui projetos vinculados ao seu e-mail corporativo.</p>
                  </div>
               </div>
             )}
           </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: ShieldCheck, title: 'Termos & Garantias', desc: 'Acesse certificados e manuais de cuidados.', color: 'text-emerald-500' },
             { icon: FileText, title: 'Documentação Executiva', desc: 'Plantas, cortes e aprovações técnicas.', color: 'text-gold' },
             { icon: Camera, title: 'Diário de Obra', desc: 'Registro fotográfico diário do seu projeto.', color: 'text-blue-500' }
           ].map((item, i) => (
             <div key={i} className="p-10 bg-white dark:bg-white/5 border border-stone-100 dark:border-white/10 rounded-[2.5rem] space-y-4 hover:border-gold/30 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center ${item.color}`}>
                   <item.icon size={24} />
                </div>
                <div>
                   <h4 className="text-lg font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">{item.title}</h4>
                   <p className="text-sm font-serif italic text-stone-500 mt-1">{item.desc}</p>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-gold mt-4 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Ver agora <ChevronRight size={14} />
                </button>
             </div>
           ))}
        </section>
      </main>

      <footer className="max-w-7xl mx-auto py-20 border-t border-stone-100 dark:border-white/5 text-center space-y-6">
         <Sparkles size={32} className="text-gold mx-auto opacity-20" />
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-400">Artesani • Gestão de Luxo para Marmorarias</p>
      </footer>
    </div>
  );
};

export default ClientPortal;
