
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Megaphone, UserCheck, 
  FileCheck, Target, Stethoscope, Trash2, GripVertical, X, ShieldCheck,
  Calendar, Clock, Edit3, Save, Undo2, Redo2, History, CloudUpload, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../constants';

const ICON_MAP: Record<string, any> = {
  Megaphone, UserCheck, FileCheck, Target, Stethoscope, ShieldCheck, Calendar
};

interface SalesItem {
  id: string;
  label: string;
  description?: string;
  date?: string;
}

interface SalesStage {
  id: string;
  label: string;
  iconName: string;
  color: string;
  items: SalesItem[];
}

const INITIAL_STAGES: SalesStage[] = [
  { 
    id: 'AQUISICAO', 
    label: '1. Aquisição', 
    iconName: 'Megaphone', 
    color: 'text-gold',
    items: [
      { id: 'aq1', label: "Tráfego Pago", description: "Campanhas ativas no Google Ads e Meta Ads.", date: '2024-04-10' },
      { id: 'aq2', label: "Cliente Balcão", description: "Lead que entrou diretamente pela loja física.", date: '2024-04-12' }
    ]
  },
  { 
    id: 'QUALIFICACAO', 
    label: '2. Qualificação', 
    iconName: 'UserCheck', 
    color: 'text-cyan-500',
    items: [
      { id: 'q1', label: 'Atendimento Braga', description: 'Contato iniciado e qualificado pessoalmente pelo Braga.', date: '2024-04-11'}
    ]
  },
  { 
    id: 'NEGOCIACAO', 
    label: '3. Negociação', 
    iconName: 'ShieldCheck', 
    color: 'text-emerald-500', 
    items: [
      { id: 'n1', label: "Proposta Comercial", description: "Aguardando ajuste de valores e assinatura.", date: '2024-03-24' }
    ] 
  },
  { 
    id: 'POS_VENDA', 
    label: '4. Pós-venda', 
    iconName: 'Stethoscope', 
    color: 'text-blue-500',
    items: [
      { id: 'pv1', label: 'Suporte Final', description: 'Acompanhamento pós-instalação e coleta de avaliações.', date: '2024-03-20'}
    ]
  }
];

const SalesFlow: React.FC = () => {
  const navigate = useNavigate();
  const [stages, setStages] = useState<SalesStage[]>(() => {
    const saved = localStorage.getItem('braga_sales_stages_v3');
    return saved ? JSON.parse(saved) : INITIAL_STAGES;
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<{ stageId: string, item: SalesItem } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(INITIAL_STAGES.map(s => s.id)));
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 30000);
    return () => clearTimeout(timer);
  }, []);

  const toggleStage = (stageId: string) => {
    const next = new Set(expandedStages);
    if (next.has(stageId)) next.delete(stageId);
    else next.add(stageId);
    setExpandedStages(next);
  };

  useEffect(() => {
    localStorage.setItem('braga_sales_stages_v3', JSON.stringify(stages));
    setShowAutoSaveToast(true);
    const timer = setTimeout(() => setShowAutoSaveToast(false), 2000);
    return () => clearTimeout(timer);
  }, [stages]);

  const handleDragStart = (e: React.DragEvent, itemId: string, stageId: string) => {
    e.dataTransfer.setData('itemId', itemId);
    e.dataTransfer.setData('fromStageId', stageId);
    // Needed to allow dropping
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDropToStage = (e: React.DragEvent, toStageId: string) => {
    e.preventDefault();
    setIsDragging(false);
    const itemId = e.dataTransfer.getData('itemId');
    const fromStageId = e.dataTransfer.getData('fromStageId');
    if (!itemId || !fromStageId || fromStageId === toStageId) return;

    setStages(prev => {
      const newStages = [...prev];
      const fromStageIndex = newStages.findIndex(s => s.id === fromStageId);
      const toStageIndex = newStages.findIndex(s => s.id === toStageId);
      if (fromStageIndex < 0 || toStageIndex < 0) return prev;
      
      const fromStage = { ...newStages[fromStageIndex], items: [...newStages[fromStageIndex].items] };
      const toStage = { ...newStages[toStageIndex], items: [...newStages[toStageIndex].items] };
      
      const itemIndex = fromStage.items.findIndex(i => i.id === itemId);
      if (itemIndex < 0) return prev;
      
      const [item] = fromStage.items.splice(itemIndex, 1);
      toStage.items.push(item);
      
      newStages[fromStageIndex] = fromStage;
      newStages[toStageIndex] = toStage;
      return newStages;
    });
  };

  const handleTrashDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const itemId = e.dataTransfer.getData('itemId');
    const fromStageId = e.dataTransfer.getData('fromStageId');
    if (!itemId || !fromStageId) return;

    setStages(prev => {
      return prev.map(s => {
        if (s.id !== fromStageId) return s;
        return { ...s, items: s.items.filter(i => i.id !== itemId) };
      });
    });
  };

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleAddItem = (stageId: string) => {
    const newItemId = Math.random().toString(36).substr(2, 9);
    const newItem = { id: newItemId, label: "Novo", description: "" };
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, items: [...s.items, newItem] } : s));
    setEditingItem({ stageId, item: newItem });
  };

  return (
    <div className="flex flex-col gap-4 relative min-h-full pb-8">
      {/* Welcome Section */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-stone-950 dark:bg-white/5 text-white p-6 rounded-[2rem] relative shrink-0 shadow-lg"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">Arquitetura Comercial</span>
                </div>
                <h3 className="text-2xl font-serif leading-tight">
                  Olá, {MOCK_USER.name.split(' ')[1] || MOCK_USER.name}
                </h3>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[7px] font-bold uppercase tracking-widest text-stone-500 mb-0.5">Leads Ativos</p>
                  <p className="text-xl font-serif text-gold">12</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 bg-white dark:bg-onyx p-4 px-6 rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="space-y-0.5">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Arquitetura Comercial</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
               <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Canais de Venda Braga Marmoraria</p>
               {showAutoSaveToast && <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full"><CloudUpload size={10} /> Sincronizado</span>}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
           <button onClick={() => setStages([...stages, { id: Math.random().toString(36).substr(2, 9), label: 'Novo Estágio', iconName: 'Target', color: 'text-stone-400', items: [] }])} className="flex-1 md:flex-none justify-center gold-bg px-4 md:px-5 py-2 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> Novo Estágio</button>
        </div>
      </motion.div>

      <motion.div layout className="flex-1 flex gap-3 pb-2 overflow-x-auto no-scrollbar min-h-[75vh] px-1">
        {stages.map((stage, idx) => {
          const Icon = ICON_MAP[stage.iconName] || Target;
          const isExpanded = expandedStages.has(stage.id);
          
          return (
            <motion.div 
              key={stage.id} 
              layout
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={(e) => handleDropToStage(e, stage.id)}
              animate={{ 
                width: isExpanded ? '100%' : 60,
                flex: isExpanded ? 1 : 'none'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }} 
              style={{ minWidth: isExpanded ? '240px' : '60px' }}
              className={`relative group flex flex-col h-full rounded-[2rem] border transition-colors duration-500 overflow-hidden shrink-0 
                ${isExpanded ? 'bg-stone-50/50 dark:bg-stone-900/30 border-stone-200 dark:border-white/10' : 'bg-white dark:bg-onyx border-stone-100 dark:border-white/5 hover:border-gold/30'}
                ${isDragging ? 'border-dashed border-stone-300 dark:border-white/20' : ''}`}
            >
              <div onClick={() => toggleStage(stage.id)} className={`p-4 cursor-pointer flex transition-all duration-500 ${isExpanded ? 'flex-row items-center justify-between border-b border-stone-200 dark:border-white/5' : 'flex-col items-center h-full py-8'}`}>
                {isExpanded ? (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 bg-white dark:bg-white/5 rounded-lg border border-stone-200 dark:border-white/10 shrink-0 ${stage.color}`}><Icon size={16} /></div>
                      <h3 className="text-[11px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest truncate">{stage.label}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 bg-stone-200 dark:bg-white/10 text-stone-500 dark:text-stone-300 rounded-full text-[10px] font-bold">{stage.items.length}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-between h-full w-full">
                    <div className={`p-1.5 bg-white dark:bg-white/5 rounded-lg border border-stone-100 dark:border-white/5 shrink-0 ${stage.color}`}><Icon size={14} /></div>
                    <h3 className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em] leading-none [writing-mode:vertical-lr] rotate-180 whitespace-nowrap mb-6">{stage.label}</h3>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-stone-100 dark:bg-white/10 text-stone-500 dark:text-stone-300 rounded-full text-[10px] font-bold">{stage.items.length}</div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-3 space-y-2 custom-scroll">
                    {stage.items.map((item) => {
                      const isSelected = selectedIds.has(item.id);
                      return (
                        <motion.div 
                          key={item.id} layout
                          draggable={true}
                          onDragStart={(e: React.DragEvent) => handleDragStart(e, item.id, stage.id)}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => toggleSelection(item.id, e)}
                          className={`group relative flex flex-col p-4 rounded-2xl cursor-grab active:cursor-grabbing shadow-sm transition-all border ${isSelected ? 'bg-gold/10 border-gold shadow-gold/10 scale-[1.02] z-10' : 'bg-white dark:bg-onyx/40 border-stone-100 dark:border-white/5 hover:border-gold/30'}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <GripVertical size={12} className={isSelected ? 'text-gold' : 'text-stone-300'} />
                            <h4 className={`flex-1 text-sm font-serif font-bold uppercase tracking-tight ${isSelected ? 'text-stone-950 dark:text-gold' : 'text-stone-900 dark:text-stone-300'}`}>{item.label}</h4>
                            <button onClick={(e) => { e.stopPropagation(); setEditingItem({ stageId: stage.id, item }); }} className="p-1 opacity-0 group-hover:opacity-100 text-stone-300 hover:text-gold"><Edit3 size={12} /></button>
                          </div>
                          {item.description && <p className="text-xs text-stone-400 dark:text-stone-500 italic mb-2 line-clamp-2 leading-relaxed">{item.description}</p>}
                          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-white/5">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10}/> {item.date || 'TBD'}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                    <button onClick={() => handleAddItem(stage.id)} className="w-full mt-2 py-3 border border-dashed border-stone-300 dark:border-white/10 rounded-xl text-[9px] font-bold text-stone-400 uppercase tracking-widest hover:text-gold flex items-center justify-center gap-2"><Plus size={12} /> Novo</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>

      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingItem(null)} className="absolute inset-0 bg-stone-950/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-md rounded-[2.5rem] p-8 border border-stone-200 dark:border-white/10 shadow-2xl">
               <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white uppercase mb-8">Refinar Atividade Comercial</h3>
               <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Título da Atividade</label>
                    <input type="text" value={editingItem.item.label} onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, label: e.target.value } })} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setEditingItem(null)} className="flex-1 py-4 border border-stone-200 dark:border-white/10 text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Cancelar</button>
                    <button onClick={() => {
                        setStages(prev => prev.map(s => s.id === editingItem.stageId ? { ...s, items: s.items.map(i => i.id === editingItem.item.id ? editingItem.item : i) } : s));
                        setEditingItem(null);
                    }} className="flex-[2] py-4 bg-stone-950 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><Save size={16} /> Salvar</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDragging && (
          <motion.div 
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: 100, opacity: 0 }}
             onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
             onDrop={handleTrashDrop}
             className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500/90 text-white rounded-[2rem] px-8 py-5 flex items-center gap-4 z-[300] border-2 border-dashed border-red-300 shadow-2xl backdrop-blur-md"
          >
            <div className="bg-white/20 p-3 rounded-full">
               <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase">Mover para Lixeira</h3>
              <p className="text-[10px] text-white/80 font-bold tracking-widest mt-0.5">Arraste o item aqui para excluir</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesFlow;
