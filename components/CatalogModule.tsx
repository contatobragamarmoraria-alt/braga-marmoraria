import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, Plus, Image as ImageIcon, Trash2, Edit2, 
  Settings, ChevronLeft, ChevronRight, X, Maximize2, DollarSign
} from 'lucide-react';

type CatalogCategory = 'COZINHA' | 'SERVICO' | 'LAVATORIO' | 'BANCADA_INTEGRADA';

interface CatalogItem {
  id: string;
  category: CatalogCategory;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  specs: { name: string; value: string }[];
  materials: { name: string; priceMod: number }[];
}

const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  COZINHA: 'Cozinha',
  SERVICO: 'Área de Serviço',
  LAVATORIO: 'Lavatórios',
  BANCADA_INTEGRADA: 'Bancada Integrada'
};

const DEFAULT_CATALOG: CatalogItem[] = [
  {
    id: 'cat-1', category: 'COZINHA',
    name: 'Ilha em L Tradicional',
    description: 'Ilha ampla para cozinha com área seca e área molhada, frontão tradicional.',
    images: ['https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=800'],
    basePrice: 5500,
    specs: [{ name: 'Frontão', value: 'Tradicional 10cm' }, { name: 'Rebaixo', value: 'Área Molhada padrão' }],
    materials: [{ name: 'Branco Itaúnas', priceMod: 0 }, { name: 'Preto São Gabriel', priceMod: 500 }, { name: 'Via Láctea', priceMod: 1200 }]
  },
  {
    id: 'cat-2', category: 'LAVATORIO',
    name: 'Cuba Esculpida Master',
    description: 'Bancada de banheiro com cuba esculpida em rampa dupla, design moderno.',
    images: ['https://images.unsplash.com/photo-1604709177227-055fbf762454?auto=format&fit=crop&q=80&w=800'],
    basePrice: 3200,
    specs: [{ name: 'Cuba', value: 'Esculpida em Rampa' }, { name: 'Saia', value: '15cm 45 Graus' }],
    materials: [{ name: 'Travertino', priceMod: 800 }, { name: 'Branco Prime', priceMod: 1100 }]
  },
  {
    id: 'cat-3', category: 'SERVICO',
    name: 'Bancada Tanque Duplo',
    description: 'Lavanderia extensa com recorte para tanque duplo de inóx e área para embutir máquina.',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'],
    basePrice: 1900,
    specs: [{ name: 'Rodapia', value: '7cm Frontal' }, { name: 'Furação', value: 'Tanque Tramontina M' }],
    materials: [{ name: 'Verde Ubatuba', priceMod: 0 }, { name: 'Branco Siena', priceMod: 300 }]
  },
  {
    id: 'cat-4', category: 'BANCADA_INTEGRADA',
    name: 'Gourmet Churrasqueira',
    description: 'Bancada longa para área de churrasco integrada à ilha de apoio e cooktop.',
    images: ['https://images.unsplash.com/photo-1588854337115-1c67d9247e0d?auto=format&fit=crop&q=80&w=800'],
    basePrice: 8500,
    specs: [{ name: 'Acabamento', value: 'Meia Esquadria' }, { name: 'Furo Cooktop', value: 'Sim - 5 Bocas' }],
    materials: [{ name: 'Preto São Gabriel Escovado', priceMod: 2000 }, { name: 'Quartzito Taj Mahal', priceMod: 5400 }]
  }
];

const CatalogModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CatalogCategory>('COZINHA');
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // View state for images
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('bm-catalog');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(DEFAULT_CATALOG);
      localStorage.setItem('bm-catalog', JSON.stringify(DEFAULT_CATALOG));
    }
  }, []);

  const saveItems = (newItems: CatalogItem[]) => {
    setItems(newItems);
    localStorage.setItem('bm-catalog', JSON.stringify(newItems));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do catálogo?')) {
      saveItems(items.filter(i => i.id !== id));
    }
  };

  const handleNextImage = (itemId: string, maxIdx: number) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [itemId]: prev[itemId] !== undefined ? (prev[itemId] + 1) % maxIdx : 1 % maxIdx
    }));
  };

  const handlePrevImage = (itemId: string, maxIdx: number) => {
    setActiveImageIndexes(prev => {
      const current = prev[itemId] || 0;
      return {
        ...prev,
        [itemId]: current === 0 ? maxIdx - 1 : current - 1
      };
    });
  };

  const filteredItems = items.filter(i => i.category === activeTab);

  return (
    <div className="flex flex-col h-full space-y-6 pb-20 md:pb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-6 bg-white dark:bg-onyx border border-stone-200 dark:border-white/5 rounded-3xl shrink-0 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
          <Library size={120} />
        </div>
        <div className="relative z-10 w-full">
          <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400 mb-2">
            <Library size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Braga Marmoraria</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between w-full items-start md:items-center gap-4">
            <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-white leading-tight">
              Catálogo de Projetos
            </h1>
            <button 
              onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
              className="w-full md:w-auto py-3 px-6 gold-bg text-stone-900 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl flex justify-center items-center gap-2 hover:scale-105 transition-all"
            >
              <Plus size={16} /> Construir Modelo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 shrink-0 border-b border-stone-200 dark:border-white/5 pb-2">
        {Object.keys(CATEGORY_LABELS).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat as CatalogCategory)}
            className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === cat 
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-md' 
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5'
            }`}
          >
            {CATEGORY_LABELS[cat as CatalogCategory]}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto custom-scroll -mx-4 px-4 pb-10">
        {filteredItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 dark:border-white/10 rounded-[3rem]">
            <Library size={32} className="text-stone-300 mb-4" />
            <p className="text-sm font-bold text-stone-900 dark:text-white">Nenhum modelo cadastrado</p>
            <p className="text-xs text-stone-400 mt-1">Crie um modelo para servir de vitrine.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
               const cIdx = activeImageIndexes[item.id] || 0;
               return (
                 <div key={item.id} className="bg-white dark:bg-onyx rounded-3xl border border-stone-200 dark:border-white/10 overflow-hidden flex flex-col group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                   {/* Carousel */}
                   <div className="relative h-56 bg-stone-100 dark:bg-stone-800">
                     {item.images.length > 0 ? (
                       <>
                         <img 
                           src={item.images[cIdx]} 
                           alt={item.name} 
                           className="w-full h-full object-cover transition-opacity duration-500 cursor-pointer"
                           onClick={() => setFullScreenImage(item.images[cIdx])}
                         />
                         {item.images.length > 1 && (
                           <>
                             <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={(e) => { e.stopPropagation(); handlePrevImage(item.id, item.images.length); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-900 hover:bg-white transition-all shadow-md"><ChevronLeft size={16}/></button>
                               <button onClick={(e) => { e.stopPropagation(); handleNextImage(item.id, item.images.length); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-900 hover:bg-white transition-all shadow-md"><ChevronRight size={16}/></button>
                             </div>
                             <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1">
                               {item.images.map((_, idx) => (
                                 <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === cIdx ? 'bg-white scale-125' : 'bg-white/50'}`} />
                               ))}
                             </div>
                           </>
                         )}
                         <button 
                           onClick={() => setFullScreenImage(item.images[cIdx])}
                           className="absolute top-3 right-3 p-1.5 bg-black/40 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
                         >
                           <Maximize2 size={14} />
                         </button>
                       </>
                     ) : (
                       <div className="flex items-center justify-center h-full text-stone-400">
                         <ImageIcon size={32} />
                       </div>
                     )}
                     
                     <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[8px] font-bold uppercase tracking-widest text-stone-900 shadow-sm">
                       {CATEGORY_LABELS[item.category]}
                     </div>
                   </div>

                   {/* Info */}
                   <div className="p-5 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-stone-900 dark:text-white leading-tight line-clamp-1">{item.name}</h3>
                       <div className="flex gap-1 shrink-0">
                         <button onClick={() => { setEditingItem(item); setIsFormOpen(true); }} className="p-1.5 text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg transition-all"><Edit2 size={14}/></button>
                         <button onClick={() => handleDelete(item.id)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-white/5 rounded-lg transition-all"><Trash2 size={14}/></button>
                       </div>
                     </div>
                     <p className="text-[10px] text-stone-500 dark:text-stone-400 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                     
                     {item.specs.length > 0 && (
                       <div className="flex flex-wrap gap-2 mb-4">
                         {item.specs.map((s, idx) => (
                           <span key={idx} className="px-2 py-1 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-md text-[9px] font-bold text-stone-600 dark:text-stone-300">
                             <span className="opacity-50">{s.name}:</span> {s.value}
                           </span>
                         ))}
                       </div>
                     )}

                     <div className="mt-auto pt-4 border-t border-stone-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1"><DollarSign size={10}/> Preço Base</span>
                          <span className="font-serif font-bold text-stone-900 dark:text-gold text-lg">R$ {item.basePrice.toLocaleString('pt-BR')}</span>
                        </div>
                        {item.materials.length > 0 && (
                          <div className="space-y-1">
                             {item.materials.map((m, idx) => (
                               <div key={idx} className="flex justify-between items-center text-[9px] font-medium text-stone-500">
                                 <span>• {m.name}</span>
                                 <span>{m.priceMod >= 0 ? '+' : '-'} R$ {Math.abs(m.priceMod).toLocaleString('pt-BR')}</span>
                               </div>
                             ))}
                          </div>
                        )}
                     </div>
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setFullScreenImage(null)}
          >
            <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"><X size={24} /></button>
            <img src={fullScreenImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <CatalogForm 
            item={editingItem} 
            onSave={(newItem) => {
              if (editingItem) {
                saveItems(items.map(i => i.id === editingItem.id ? newItem : i));
              } else {
                saveItems([newItem, ...items]);
              }
              setIsFormOpen(false);
            }}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

// Extracted Sub-component for the complex form
function CatalogForm({ item, onSave, onClose }: { item: CatalogItem | null; onSave: (i: CatalogItem) => void; onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<CatalogItem>>(item || {
    category: 'COZINHA',
    name: '',
    description: '',
    images: [],
    basePrice: 0,
    specs: [],
    materials: []
  });

  const [newImage, setNewImage] = useState('');
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newMatName, setNewMatName] = useState('');
  const [newMatPrice, setNewMatPrice] = useState(0);

  const addImage = () => {
    if (newImage && formData.images) {
      setFormData({ ...formData, images: [...formData.images, newImage] });
      setNewImage('');
    }
  };

  const addSpec = () => {
    if (newSpecName && formData.specs) {
      setFormData({ ...formData, specs: [...formData.specs, { name: newSpecName, value: newSpecValue }] });
      setNewSpecName(''); setNewSpecValue('');
    }
  };

  const addMat = () => {
    if (newMatName && formData.materials) {
      setFormData({ ...formData, materials: [...formData.materials, { name: newMatName, priceMod: Number(newMatPrice) }] });
      setNewMatName(''); setNewMatPrice(0);
    }
  };

  const handleSave = () => {
    if (!formData.name) return alert('Nome é obrigatório');
    onSave({
      id: item?.id || Math.random().toString(36).substr(2, 9),
      category: formData.category as CatalogCategory,
      name: formData.name!,
      description: formData.description || '',
      images: formData.images || [],
      basePrice: formData.basePrice || 0,
      specs: formData.specs || [],
      materials: formData.materials || []
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col md:items-center justify-end md:justify-center p-0 md:p-10 pointer-events-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="w-full md:max-w-2xl bg-white dark:bg-onyx flex flex-col h-[90vh] md:h-auto md:max-h-[85vh] md:rounded-[3rem] rounded-t-[2rem] shadow-2xl relative pointer-events-auto overflow-hidden"
      >
        <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-stone-50/50 dark:bg-black/20">
          <div>
             <h2 className="text-xl font-bold text-stone-900 dark:text-white font-serif">{item ? 'Editar' : 'Novo'} Modelo de Catálogo</h2>
             <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Configuração de Vitrine</p>
          </div>
          <button onClick={onClose} className="p-2 bg-stone-100 dark:bg-white/10 hover:bg-stone-200 rounded-full transition-all"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scroll space-y-8">
           
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Categoria</label>
                 <select 
                   value={formData.category} 
                   onChange={e => setFormData({...formData, category: e.target.value as CatalogCategory})}
                   className="w-full p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-sm focus:border-gold outline-none"
                 >
                   {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                     <option key={k} value={k}>{v}</option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Nome do Modelo</label>
                 <input 
                   type="text" 
                   value={formData.name} 
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   placeholder="Ex: Bancada com Cuba Esculpida"
                   className="w-full p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-sm focus:border-gold outline-none"
                 />
               </div>
             </div>

             <div>
               <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Descrição</label>
               <textarea 
                 value={formData.description} 
                 onChange={e => setFormData({...formData, description: e.target.value})}
                 placeholder="Descreva os detalhes..."
                 className="w-full p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-sm h-24 custom-scroll focus:border-gold outline-none"
               />
             </div>

             <div>
               <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Preço Médio / Base (R$)</label>
               <input 
                 type="number" 
                 value={formData.basePrice || ''} 
                 onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})}
                 className="w-full p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-sm focus:border-gold outline-none font-bold"
               />
             </div>
           </div>

           <div className="pt-6 border-t border-stone-100 dark:border-white/5 space-y-4">
             <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2"><ImageIcon size={14}/> Imagens (URLs)</label>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newImage} 
                  onChange={e => setNewImage(e.target.value)}
                  placeholder="Cole o link da imagem..."
                  className="flex-1 p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-xs"
                />
                <button onClick={addImage} className="px-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all w-fit">Add</button>
             </div>
             {formData.images && formData.images.length > 0 && (
               <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                 {formData.images.map((img, idx) => (
                   <div key={idx} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-stone-200">
                     <img src={img} className="w-full h-full object-cover" />
                     <button onClick={() => setFormData({...formData, images: formData.images!.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md"><Trash2 size={10}/></button>
                   </div>
                 ))}
               </div>
             )}
           </div>

           <div className="pt-6 border-t border-stone-100 dark:border-white/5 space-y-4">
             <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2"><Settings size={14}/> Especificações (Ex: Frontão, Área Seca)</label>
             <div className="flex gap-2">
                <input 
                  type="text" value={newSpecName} onChange={e => setNewSpecName(e.target.value)}
                  placeholder="Nome (Ex: Rebaixo)"
                  className="w-1/3 p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-xs"
                />
                <input 
                  type="text" value={newSpecValue} onChange={e => setNewSpecValue(e.target.value)}
                  placeholder="Valor (Ex: Sim)"
                  className="flex-1 p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-xs"
                />
                <button onClick={addSpec} className="px-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Add</button>
             </div>
             <div className="space-y-2">
               {formData.specs?.map((s, idx) => (
                 <div key={idx} className="flex justify-between items-center p-2 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-100 dark:border-white/5">
                   <p className="text-[10px] font-bold"><span className="text-stone-400">{s.name}:</span> {s.value}</p>
                   <button onClick={() => setFormData({...formData, specs: formData.specs!.filter((_, i) => i !== idx)})} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={12}/></button>
                 </div>
               ))}
             </div>
           </div>

           <div className="pt-6 border-t border-stone-100 dark:border-white/5 space-y-4">
             <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Tabela de Materiais (Adicionais de Preço)</label>
             <div className="flex gap-2">
                <input 
                  type="text" value={newMatName} onChange={e => setNewMatName(e.target.value)}
                  placeholder="Material"
                  className="flex-1 p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-xs"
                />
                <input 
                  type="number" value={newMatPrice || ''} onChange={e => setNewMatPrice(Number(e.target.value))}
                  placeholder="Diferença R$"
                  className="w-1/3 p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-xs"
                />
                <button onClick={addMat} className="px-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Add</button>
             </div>
             <div className="space-y-2">
               {formData.materials?.map((m, idx) => (
                 <div key={idx} className="flex justify-between items-center p-2 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-100 dark:border-white/5">
                   <p className="text-[10px] font-bold text-stone-600 dark:text-stone-300">{m.name} <span className="text-gold">(+ R$ {m.priceMod.toLocaleString('pt-BR')})</span></p>
                   <button onClick={() => setFormData({...formData, materials: formData.materials!.filter((_, i) => i !== idx)})} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={12}/></button>
                 </div>
               ))}
             </div>
           </div>

        </div>

        <div className="p-6 border-t border-stone-100 dark:border-white/5 shrink-0 bg-white dark:bg-onyx">
          <button 
            onClick={handleSave}
            className="w-full py-4 gold-bg text-stone-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex justify-center items-center gap-2 hover:scale-105 transition-all"
          >
            <Check size={16} /> Salvar Modelo no Catálogo
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CatalogModule;
