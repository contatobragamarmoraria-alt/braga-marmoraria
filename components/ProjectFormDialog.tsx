import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabaseProjectService, SupabaseProject } from '../services/supabaseProjectService';
import { X, Save, RefreshCw } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const ProjectFormDialog: React.FC<Props> = ({ onClose, onCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<SupabaseProject>>({
    name: '',
    client_name: '',
    type: '',
    area: '',
    description: '',
    address: '',
    status: 'PRODUCAO'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return; // Basic validation
    
    setIsSubmitting(true);
    try {
      await supabaseProjectService.createProject(formData as SupabaseProject);
      onCreated();
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Erro ao tentar criar projeto. Verifique suas credenciais e se a tabela "projects" existe no Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-2xl rounded-[2.5rem] p-6 md:p-8 border border-stone-200 dark:border-white/10 shadow-2xl flex flex-col max-h-full">
        
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white uppercase">Novo Projeto (Supabase)</h3>
          <button onClick={onClose} className="p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto custom-scroll pr-2 space-y-5">
           
           <div className="space-y-1.5">
             <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Nome do Projeto *</label>
             <input required name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Residência Villagio" className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div className="space-y-1.5">
               <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Cliente</label>
               <input name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Nome do Cliente" className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif" />
             </div>
             
             <div className="space-y-1.5">
               <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Tipo</label>
               <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif">
                 <option value="">Selecione...</option>
                 <option value="Bancada">Bancada</option>
                 <option value="Pia">Pia</option>
                 <option value="Tanque">Tanque</option>
                 <option value="Lavabo">Lavabo</option>
                 <option value="Escada">Escada</option>
                 <option value="Revestimento">Revestimento</option>
               </select>
             </div>

             <div className="space-y-1.5">
               <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Área</label>
               <select name="area" value={formData.area} onChange={handleChange} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif">
                 <option value="">Selecione...</option>
                 <option value="Cozinha">Cozinha</option>
                 <option value="Banheiro">Banheiro</option>
                 <option value="Área Gourmet">Área Gourmet</option>
                 <option value="Área Externa">Área Externa</option>
                 <option value="Sala">Sala</option>
               </select>
             </div>

             <div className="space-y-1.5">
               <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Status Inicial</label>
               <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif">
                 <option value="LEAD_FECHADO">1. Lead Fechado</option>
                 <option value="AGUARDANDO_MEDICAO">2. Aguardando Medição</option>
                 <option value="PRODUCAO">3. Produção</option>
                 <option value="INSTALACAO">4. Instalação</option>
               </select>
             </div>
           </div>

           <div className="space-y-1.5">
             <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Endereço da Obra</label>
             <input name="address" value={formData.address} onChange={handleChange} placeholder="Rua, Número, Bairro, Cidade" className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif" />
           </div>

           <div className="space-y-1.5">
             <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Descrição / Observações</label>
             <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Detalhes do projeto, materiais desejados..." className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif resize-none" />
           </div>

           <div className="pt-6 shrink-0 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 border border-stone-200 dark:border-white/10 text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-white/5">Cancelar</button>
              <button disabled={isSubmitting} type="submit" className="flex-[2] py-4 bg-stone-950 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50">
                {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Salvando...</> : <><Save size={16} /> Salvar Projeto</>}
              </button>
           </div>
        </form>

      </motion.div>
    </div>
  );
};

export default ProjectFormDialog;
