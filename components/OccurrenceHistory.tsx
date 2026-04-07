
import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, Filter, 
  Search, User, Calendar as CalendarIcon, 
  Plus, MoreVertical, MapPin, MessageSquare,
  AlertTriangle, TrendingUp, TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Occurrence, OccurrenceType } from '../types';
import { occurrenceService } from '../services/occurrenceService';

const OccurrenceBadge = ({ type }: { type: OccurrenceType }) => {
  const configs = {
    POSITIVE: { label: 'Positivo', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
    NEGATIVE: { label: 'Negativo', color: 'bg-red-50 text-red-600 border-red-100', icon: AlertCircle },
    NEUTRAL: { label: 'Neutro', color: 'bg-stone-50 text-stone-600 border-stone-100', icon: Clock }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${config.color}`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
};

const OccurrenceHistory: React.FC = () => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'POSITIVE' | 'NEGATIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentOccurrence, setCurrentOccurrence] = useState<Partial<Occurrence> | null>(null);

  React.useEffect(() => {
    const unsubscribe = occurrenceService.subscribeToOccurrences(setOccurrences);
    return () => unsubscribe();
  }, []);

  const filteredOccurrences = occurrences.filter(occ => {
    const matchesFilter = filter === 'ALL' || occ.type === filter;
    const matchesSearch = 
      occ.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      occ.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      occ.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      occ.involvedTeamNames?.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const handleSave = async () => {
    if (!currentOccurrence?.title || !currentOccurrence?.description) return;

    if (currentOccurrence.id) {
      await occurrenceService.updateOccurrence(currentOccurrence.id, currentOccurrence);
    } else {
      const newOcc: Occurrence = {
        ...currentOccurrence,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        type: currentOccurrence.type || 'NEUTRAL',
        involvedTeamIds: currentOccurrence.involvedTeamIds || []
      } as Occurrence;
      await occurrenceService.addOccurrence(newOcc);
    }
    setIsEditing(false);
    setCurrentOccurrence(null);
  };

  const handleDelete = async () => {
    if (currentOccurrence?.id) {
      await occurrenceService.deleteOccurrence(currentOccurrence.id);
      setIsEditing(false);
      setCurrentOccurrence(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tighter">Histórico de Ocorrências</h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Registro centralizado de eventos e feedbacks</p>
        </div>
        <button 
          onClick={() => {
            setCurrentOccurrence({ type: 'POSITIVE', involvedTeamNames: [] });
            setIsEditing(true);
          }}
          className="gold-bg px-6 py-3 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={16} />
          Nova Ocorrência
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-onyx p-6 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={18} className="text-emerald-500" />
            <span className="text-2xl font-serif font-bold text-stone-950 dark:text-white">
              {occurrences.filter(o => o.type === 'POSITIVE').length}
            </span>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Pontos Positivos</p>
        </div>
        <div className="bg-white dark:bg-onyx p-6 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown size={18} className="text-red-500" />
            <span className="text-2xl font-serif font-bold text-stone-950 dark:text-white">
              {occurrences.filter(o => o.type === 'NEGATIVE').length}
            </span>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Pontos Negativos</p>
        </div>
        <div className="bg-white dark:bg-onyx p-6 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare size={18} className="text-gold" />
            <span className="text-2xl font-serif font-bold text-stone-950 dark:text-white">
              {occurrences.length}
            </span>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Total de Registros</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar por projeto, profissional ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-onyx border border-stone-200 dark:border-white/5 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all"
          />
        </div>
        <div className="flex bg-white dark:bg-onyx p-1.5 rounded-2xl border border-stone-200 dark:border-white/5">
          {(['ALL', 'POSITIVE', 'NEGATIVE'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                filter === type 
                  ? 'gold-bg text-black shadow-md' 
                  : 'text-stone-400 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'Todos' : type === 'POSITIVE' ? 'Positivos' : 'Negativos'}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline of Occurrences */}
      <div className="space-y-6">
        {filteredOccurrences.map((occ, i) => (
          <motion.div 
            key={occ.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-onyx rounded-[2.5rem] border border-stone-200 dark:border-white/5 shadow-sm overflow-hidden group"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-48 shrink-0 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-stone-400">
                    <CalendarIcon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{occ.date}</span>
                  </div>
                  <OccurrenceBadge type={occ.type} />
                  {occ.projectName && (
                    <div className="mt-4 p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1">Projeto</p>
                      <p className="text-[10px] font-bold text-stone-900 dark:text-white uppercase leading-tight">{occ.projectName}</p>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 
                      onClick={() => {
                        setCurrentOccurrence(occ);
                        setIsEditing(true);
                      }}
                      className="text-xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight leading-tight group-hover:text-gold transition-colors cursor-pointer"
                    >
                      {occ.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setCurrentOccurrence(occ);
                          setIsEditing(true);
                        }}
                        className="p-2 text-stone-300 hover:text-gold transition-all"
                      >
                        <Plus size={16} className="rotate-45" /> {/* Edit icon placeholder */}
                      </button>
                      <button className="p-2 text-stone-300 hover:text-stone-950 dark:hover:text-white transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
                    {occ.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 dark:border-white/5">
                    <div className="space-y-2">
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">Profissionais Envolvidos</p>
                      <div className="flex flex-wrap gap-2">
                        {occ.involvedTeamNames?.map((name, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-white/5 rounded-full border border-stone-100 dark:border-white/5">
                            <User size={10} className="text-gold" />
                            <span className="text-[9px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {occ.location && (
                      <div className="space-y-2">
                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">Localização</p>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-white/5 rounded-full border border-stone-100 dark:border-white/5 w-fit">
                          <MapPin size={10} className="text-gold" />
                          <span className="text-[9px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">{occ.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredOccurrences.length === 0 && (
          <div className="py-20 text-center">
            <AlertTriangle size={48} className="mx-auto text-stone-200 mb-4" />
            <p className="text-stone-400 font-serif italic">Nenhuma ocorrência encontrada para os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">
                  {currentOccurrence?.id ? 'Editar Ocorrência' : 'Nova Ocorrência'}
                </h3>
              </div>

              <div className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Tipo</label>
                    <select 
                      value={currentOccurrence?.type}
                      onChange={(e) => setCurrentOccurrence({ ...currentOccurrence, type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    >
                      <option value="POSITIVE">Positivo</option>
                      <option value="NEGATIVE">Negativo</option>
                      <option value="NEUTRAL">Neutro</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Título</label>
                    <input 
                      type="text" 
                      value={currentOccurrence?.title || ''}
                      onChange={(e) => setCurrentOccurrence({ ...currentOccurrence, title: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Descrição</label>
                  <textarea 
                    value={currentOccurrence?.description || ''}
                    onChange={(e) => setCurrentOccurrence({ ...currentOccurrence, description: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all min-h-[100px]"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  {currentOccurrence?.id && (
                    <button 
                      onClick={handleDelete}
                      className="py-4 px-6 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 dark:border-red-500/20"
                    >
                      Excluir
                    </button>
                  )}
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OccurrenceHistory;
