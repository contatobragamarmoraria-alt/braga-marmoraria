
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, AlertTriangle, CheckCircle2, Search, 
  Filter, Plus, User, Calendar, Tag, Trophy,
  ChevronRight, MessageSquare, Quote
} from 'lucide-react';
import { KnowledgeEntry, TeamMember } from '../types';
import { MOCK_TEAM } from '../constants';

const ENTRY_TYPES = {
  LESSON_LEARNED: { label: 'Lição Aprendida', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  OCCURRENCE: { label: 'Ocorrência', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  BEST_PRACTICE: { label: 'Boa Prática', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
};

const INITIAL_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'k1',
    type: 'BEST_PRACTICE',
    title: 'Uso de Escaneamento 3D em Medições Complexas',
    description: 'Sempre utilizar o scanner 3D em ambientes com muitas quinas ou paredes fora de esquadro. Isso reduziu o retrabalho em 15% no último trimestre.',
    date: '2026-02-15',
    involvedUserIds: ['tm4', 'tm2'],
    tags: ['Medição', 'Tecnologia', 'Precisão'],
    projectName: 'Residência Almeida'
  },
  {
    id: 'k2',
    type: 'LESSON_LEARNED',
    title: 'Proteção de Bordas no Transporte',
    description: 'Peças com acabamento em meia esquadria devem ter proteção extra de cantoneiras de borracha durante o transporte para evitar lascas.',
    date: '2026-03-01',
    involvedUserIds: ['tm3', 'tm5'],
    tags: ['Logística', 'Qualidade'],
    projectName: 'Apartamento Ricardo'
  },
  {
    id: 'k3',
    type: 'OCCURRENCE',
    title: 'Atraso na Entrega de Insumos (Resina)',
    description: 'O fornecedor habitual teve problemas de estoque. Lição: Manter sempre um estoque de segurança para 15 dias de resina epóxi.',
    date: '2026-03-10',
    involvedUserIds: ['tm1', 'tm5'],
    tags: ['Suprimentos', 'Estoque'],
    projectName: 'Geral'
  },
  {
    id: 'k4',
    type: 'BEST_PRACTICE',
    title: 'Checklist de Pré-Instalação',
    description: 'Verificar se a base (marcenaria ou alvenaria) está nivelada antes de descarregar as pedras. Evita perda de tempo da equipe de instalação.',
    date: '2026-03-12',
    involvedUserIds: ['tm3', 'tm1'],
    tags: ['Instalação', 'Eficiência'],
    projectName: 'Escritório Viver S/A'
  }
];

const KnowledgeBase = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>(INITIAL_KNOWLEDGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | 'ALL'>('ALL');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'ALL' || entry.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [entries, searchTerm, filterType]);

  const userCitations = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.involvedUserIds.forEach(uid => {
        counts[uid] = (counts[uid] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        member: MOCK_TEAM.find(m => m.id === id)!,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [entries]);

  return (
    <div className="flex flex-col space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white tracking-tight uppercase">Base de Conhecimento</h2>
          <p className="text-[11px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Lições, Ocorrências e Boas Práticas</p>
        </div>
        <button className="gold-bg px-6 py-3 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-gold/20 hover:scale-105 transition-all">
          <Plus size={16} /> Nova Entrada
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por título, descrição ou tags..." 
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(['ALL', 'BEST_PRACTICE', 'LESSON_LEARNED', 'OCCURRENCE'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest border transition-all ${
                    filterType === type 
                      ? 'bg-stone-950 text-white border-stone-950 dark:bg-gold dark:text-black dark:border-gold' 
                      : 'bg-white dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-500'
                  }`}
                >
                  {type === 'ALL' ? 'Todos' : ENTRY_TYPES[type].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEntries.map((entry) => {
                const typeInfo = ENTRY_TYPES[entry.type];
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm group hover:border-gold/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${typeInfo.bg} ${typeInfo.color}`}>
                          <typeInfo.icon size={20} />
                        </div>
                        <div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <h3 className="text-lg font-serif font-bold text-stone-950 dark:text-white mt-0.5">
                            {entry.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <Calendar size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{entry.date}</span>
                      </div>
                    </div>

                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                      {entry.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {entry.involvedUserIds.map(uid => {
                            const member = MOCK_TEAM.find(m => m.id === uid);
                            return (
                              <img 
                                key={uid} 
                                src={member?.avatar} 
                                alt={member?.name} 
                                title={member?.name}
                                className="w-8 h-8 rounded-lg border-2 border-white dark:border-onyx"
                              />
                            );
                          })}
                        </div>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                          Envolvidos
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-stone-50 dark:bg-white/5 rounded-full text-[9px] font-bold text-stone-500 uppercase tracking-widest border border-stone-100 dark:border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar / Ranking */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-white/5 p-6 rounded-[2.5rem] border border-stone-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gold/10 text-gold rounded-xl">
                <Trophy size={20} />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Ranking de Citações</h4>
                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Membros mais ativos na base</p>
              </div>
            </div>

            <div className="space-y-4">
              {userCitations.map((item, index) => (
                <div key={item.member.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={item.member.avatar} alt={item.member.name} className="w-10 h-10 rounded-xl object-cover" />
                      {index < 3 && (
                        <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                          index === 0 ? 'bg-gold text-black' : 
                          index === 1 ? 'bg-stone-300 text-stone-800' : 
                          'bg-amber-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-stone-900 dark:text-white uppercase tracking-tight">{item.member.name}</p>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{item.member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-serif font-bold text-stone-950 dark:text-white">{item.count}</p>
                    <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">Citações</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-950 dark:bg-gold p-8 rounded-[2.5rem] text-white dark:text-black relative overflow-hidden group">
            <Quote className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
            <h4 className="text-lg font-serif font-bold mb-4 relative z-10">Dica do Dia</h4>
            <p className="text-sm italic opacity-80 mb-6 relative z-10">
              "A precisão na medição é o alicerce de uma instalação perfeita. Nunca economize tempo no escaneamento inicial."
            </p>
            <div className="flex items-center gap-3 relative z-10">
              <img src={MOCK_TEAM[0].avatar} alt="" className="w-8 h-8 rounded-lg" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">{MOCK_TEAM[0].name}</p>
                <p className="text-[8px] uppercase tracking-widest opacity-60">Mestre Marmorista</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
