
import React, { useState } from 'react';
import { Search, Phone, Mail, Building, Globe, ArrowUpRight, MessageSquare, Users, Sparkles } from 'lucide-react';
import { MOCK_PARTNERS, MOCK_USER } from '../constants';

const PartnersList: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'SUPPLIER' | 'STAKEHOLDER'>('ALL');
  const partners = filter === 'ALL' ? MOCK_PARTNERS : MOCK_PARTNERS.filter(p => p.type === filter);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Welcome Section */}
      <div className="bg-stone-950 dark:bg-white/5 text-white p-6 rounded-[2rem] relative overflow-hidden shrink-0 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">Ecossistema de Parceiros</span>
            </div>
            <h3 className="text-2xl font-serif leading-tight">
              Olá, {MOCK_USER.name.split(' ')[1] || MOCK_USER.name}
            </h3>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[7px] font-bold uppercase tracking-widest text-stone-500 mb-0.5">Total de Parceiros</p>
              <p className="text-xl font-serif text-gold">{MOCK_PARTNERS.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <div className="bg-white dark:bg-onyx p-6 rounded-[2rem] border border-stone-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm shrink-0">
        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Equipe & Parceiros</h2>
          <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.3em]">Ecossistema de Fornecedores & Parceiros</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
           {['ALL', 'SUPPLIER', 'STAKEHOLDER'].map(type => (
             <button 
               key={type}
               onClick={() => setFilter(type as any)}
               className={`px-4 md:px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border flex-1 md:flex-none ${
                 filter === type ? 'bg-stone-950 text-white shadow-lg border-stone-950' : 'bg-white dark:bg-white/5 text-stone-400 hover:text-stone-900 dark:hover:text-white border-stone-100 dark:border-white/10'
               }`}
             >
               {type === 'ALL' ? 'Todos' : type === 'SUPPLIER' ? 'Fornecedores' : 'Parceiros'}
             </button>
           ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={14} />
            <input type="text" placeholder="Filtrar..." className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/10 rounded-xl text-[10px] focus:outline-none focus:ring-1 focus:ring-gold" />
          </div>
          <button className="gold-bg px-6 py-2.5 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all w-full sm:w-auto">Novo Registro</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll pr-1 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {partners.map(p => (
            <div key={p.id} className="bg-white dark:bg-onyx p-4 rounded-[1.8rem] border border-stone-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden min-h-[240px]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-stone-50 dark:bg-white/[0.02] rounded-bl-[3rem] -mr-6 -mt-6" />
              
              <div className="relative mb-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl shadow-sm border ${p.type === 'SUPPLIER' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gold/10 text-gold border-gold/20'}`}>
                    <Building size={20} />
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-stone-300 dark:text-stone-600 block mb-0.5">Time / Marketing</span>
                    <div className="flex items-center justify-end gap-1.5">
                       <Users size={10} className="text-gold" />
                       <span className="text-[9px] font-serif font-bold text-stone-900 dark:text-stone-400">{p.category}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-serif font-bold text-stone-950 dark:text-white leading-tight group-hover:text-gold transition-colors">{p.name}</h3>
                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Contato: <span className="text-stone-600 dark:text-stone-300">{p.contactName}</span></p>
              </div>

              <div className="mt-auto space-y-3 pt-5 border-t border-stone-100 dark:border-white/5 relative">
                <a href={`mailto:${p.email}`} className="flex items-center gap-3 text-stone-500 hover:text-stone-950 dark:hover:text-white transition-colors">
                  <Mail size={12} className="shrink-0" />
                  <span className="text-[10px] truncate">{p.email}</span>
                </a>
                
                <a href={`tel:${p.phone}`} className="flex items-center gap-3 text-stone-500 hover:text-stone-950 dark:hover:text-white transition-colors">
                  <Phone size={12} className="shrink-0" />
                  <span className="text-[10px] truncate">{p.phone}</span>
                </a>

                <div className="pt-2 flex items-center justify-between">
                  {p.website && (
                    <a 
                      href={p.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-gold hover:underline group/web"
                    >
                      <Globe size={12} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Website</span>
                    </a>
                  )}
                  <button className="p-2 bg-stone-50 dark:bg-white/5 text-stone-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 transition-all">
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersList;
