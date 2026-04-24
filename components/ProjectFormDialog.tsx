import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseProjectService, SupabaseProject } from '../services/supabaseProjectService';
import { projectService } from '../services/projectService';
import { X, Save, RefreshCw, Sparkles, Mic, FileText, ImageIcon, Clipboard, Check } from 'lucide-react';
import { MOCK_TEAM } from '../constants';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const ProjectFormDialog: React.FC<Props> = ({ onClose, onCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'MANUAL' | 'IA'>('MANUAL');
  const [iaTab, setIaTab] = useState<'paste'|'contract'|'whatsapp'|'mic'>('paste');
  const [iaText, setIaText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDirectRecording, setIsDirectRecording] = useState(false);

  const [formData, setFormData] = useState<Partial<SupabaseProject> & { isApproved?: boolean, teamIds?: string[] }>({
    name: '',
    client_name: '',
    type: '',
    area: '',
    description: '',
    address: '',
    status: 'PRODUCAO',
    isApproved: false,
    teamIds: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTeamToggle = (id: string) => {
     const current = formData.teamIds || [];
     setFormData({ ...formData, teamIds: current.includes(id) ? current.filter(tId => tId !== id) : [...current, id] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, prefix: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setIaText(`${prefix} (${file.name}): Conteúdo analítico...`);
      setTimeout(() => processWithAI(`${prefix} (${file.name})`), 500);
    }
  };

  const startVoiceRecording = () => {
    setIsDirectRecording(true);
    setTimeout(() => {
      setIsDirectRecording(false);
      processWithAI('Áudio gravado identificou um grande projeto para a cozinha e banheiro em Taj Mahal e São Gabriel.');
    }, 4000);
  };

  const processWithAI = async (overrideText?: string) => {
    const content = overrideText || iaText;
    if (!content && !overrideText) return;
    
    setIsProcessing(true);
    try {
      await new Promise(res => setTimeout(res, 2000)); // Simulate AI delay
      
      let parsed = {
        name: formData.name || 'Projeto Importado ' + new Date().getTime().toString().slice(-4),
        client_name: formData.client_name || 'Cliente Extraído',
        type: 'Bancada',
        area: 'Geral',
        description: 'Tudo OK. Valor total: Sob consulta.',
        address: 'Não informado',
        status: formData.status,
        teamIds: formData.teamIds || [],
        isApproved: true
      };

      const lower = content.toLowerCase();
      if (lower.includes('marcos paulo')) {
         parsed = { ...parsed, client_name: 'Marcos Paulo', type: 'Pia', area: 'Cozinha', address: 'Condomínio Península', description: `Material: Granito Preto Absoluto.\nPrazo: 7 dias\nObs: Obra da Península, negociação 18 mil.`, teamIds: [MOCK_TEAM[0].id, MOCK_TEAM[1].id]};
      } else if (lower.includes('joão vitor')) {
         parsed = { ...parsed, client_name: 'João Vitor', type: 'Pia', area: 'Cozinha', address: 'São Paulo', description: `Material: Quartzito Taj Mahal.\nPrazo: 20 dias.\nObs: Valor 12 mil.`, teamIds: [MOCK_TEAM[2].id]};
      } else if (lower.includes('maria')) {
         parsed = { ...parsed, client_name: 'Maria (Arquiteta)', type: 'Bancada', area: 'Banheiro', address: 'Balneário Camboriú', description: `Material: Mármore Travertino Romano.\nPrazo: 40 dias.\nObs: Banho Master cobertura, 45 mil.`, teamIds: [MOCK_TEAM[2].id, MOCK_TEAM[3].id]};
      } else if (content.length > 5) {
         parsed.description = content; 
      }

      setFormData(parsed);
      setMode('MANUAL'); // Switch back to manual view so user can review the data
    } catch (err: any) {
      alert(err.message || 'Erro na extração IA');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return; // Basic validation
    
    setIsSubmitting(true);
    try {
      const finalStatus = formData.isApproved ? (formData.status === 'LEAD_FECHADO' ? 'AGUARDANDO_MEDICAO' : formData.status) : 'LEAD_FECHADO';

      const { isApproved, teamIds, ...cleanData } = formData;
      
      await supabaseProjectService.createProject({
        ...cleanData,
        status: finalStatus,
        audit_logs: [{
          id: Math.random().toString(36).substr(2, 9),
          action: 'Projeto criado (com Sincronia IA)',
          user: 'Sistema UI',
          device: 'Web',
          date: new Date().toLocaleString('pt-BR')
        }]
      } as SupabaseProject);

      onCreated();
      onClose();
    } catch (error: any) {
      console.error('Failed to save project:', error);
      alert('Erro ao tentar criar projeto: ' + (error.message || JSON.stringify(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-3xl rounded-[2.5rem] p-6 md:p-8 border border-stone-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[92vh]">
        
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white uppercase flex items-center gap-2">
            Abertura de Projeto <Sparkles size={16} className="text-gold" />
          </h3>
          <button onClick={onClose} className="p-2 text-stone-400 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="flex gap-2 mb-6 shrink-0 bg-stone-100 dark:bg-black/20 p-1.5 rounded-2xl">
          <button onClick={() => setMode('MANUAL')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'MANUAL' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>1. Formulário & Equipe</button>
          <button onClick={() => setMode('IA')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${mode === 'IA' ? 'bg-white dark:bg-stone-800 shadow-sm text-gold' : 'text-stone-500'}`}><Sparkles size={14}/> 2. Sincronia Inteligente IA</button>
        </div>

        {mode === 'IA' ? (
          <div className="flex-1 overflow-y-auto custom-scroll pr-2 space-y-6 flex flex-col justify-start pb-4">
             <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl flex gap-4 text-left border border-amber-100 dark:border-amber-900/20">
                <Sparkles className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-500 font-medium">Suba o contrato, um print, ou grave um áudio. A inteligência artificial vai pré-preencher informações do projeto e propor alocação de equipe.</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {[
                 { id: 'paste', icon: Clipboard, label: 'Texto / Notas' },
                 { id: 'contract', icon: FileText, label: 'Contrato PDF' },
                 { id: 'whatsapp', icon: ImageIcon, label: 'Print WhatsApp' },
                 { id: 'mic', icon: Mic, label: 'Gravar Áudio' }
               ].map(tab => (
                 <button 
                  key={tab.id} onClick={() => setIaTab(tab.id as any)} 
                  className={`py-3 flex flex-col items-center gap-2 rounded-xl border text-[10px] font-bold tracking-widest uppercase transition-all ${iaTab === tab.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-400 hover:border-gold/50'}`}
                 >
                   <tab.icon size={16}/> {tab.label}
                 </button>
               ))}
             </div>

             <div className="p-6 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl min-h-[160px] flex flex-col justify-center items-center">
               <AnimatePresence mode="wait">
                 {iaTab === 'paste' && (
                   <motion.textarea key="paste" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} value={iaText} onChange={(e) => setIaText(e.target.value)} placeholder="Cole aqui os termos, escopo ou resumo da negociação..." className="w-full h-32 bg-transparent text-sm focus:outline-none resize-none" />
                 )}
                 {iaTab === 'contract' && (
                   <motion.div key="contract" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center relative cursor-pointer w-full group">
                     <input type="file" accept=".pdf,.doc,.docx" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'Leitura de Contrato')} />
                     <FileText size={32} className="mx-auto text-stone-300 mb-3 group-hover:text-gold transition-colors" />
                     <p className="text-xs font-bold text-stone-600 dark:text-stone-300">Anexe o Contrato Físico/PDF</p>
                     <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">A IA extrairá cláusulas e itens</p>
                   </motion.div>
                 )}
                 {iaTab === 'whatsapp' && (
                   <motion.div key="whatsapp" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center relative cursor-pointer w-full group">
                     <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, 'Print do WhatsApp')} />
                     <ImageIcon size={32} className="mx-auto text-stone-300 mb-3 group-hover:text-gold transition-colors" />
                     <p className="text-xs font-bold text-stone-600 dark:text-stone-300">Suba o Print da Conversa</p>
                     <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">OCR Inteligente da negociação</p>
                   </motion.div>
                 )}
                 {iaTab === 'mic' && (
                   <motion.div key="mic" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={!isDirectRecording ? startVoiceRecording : undefined} className={`text-center cursor-pointer w-full group ${isDirectRecording ? 'animate-pulse text-red-500' : 'text-stone-600 dark:text-stone-300'}`}>
                     <Mic size={32} className={`mx-auto mb-3 transition-colors ${isDirectRecording ? 'text-red-500' : 'text-stone-300 group-hover:text-gold'}`} />
                     <p className={`text-xs font-bold ${isDirectRecording ? 'text-red-600' : ''}`}>{isDirectRecording ? 'Ouvindo... Fale agora' : 'Dite os detalhes da obra'}</p>
                     <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">A IA transcreverá para texto</p>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <button 
               onClick={() => processWithAI()}
               disabled={isProcessing || (iaTab === 'paste' && !iaText)}
               className="w-full py-5 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50 mt-auto shrink-0"
             >
               {isProcessing ? "IA Processando e Analisando..." : <><Sparkles size={16}/> Preencher Formulário com IA</>}
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scroll pr-3 space-y-6">
             <div className="bg-stone-50 dark:bg-white/5 p-4 rounded-2xl border border-stone-200 dark:border-white/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${formData.isApproved ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-stone-300 text-transparent'}`}>
                     <Check size={14} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-stone-950 dark:text-white">Projeto Aprovado</p>
                     <p className="text-[9px] text-stone-400 uppercase tracking-widest">Marque se o projeto já tiver batido o martelo</p>
                  </div>
                </label>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-1.5">
                 <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Nome do Projeto *</label>
                 <input required name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Residência Villagio" className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif outline-none focus:border-gold" />
               </div>
               
               <div className="space-y-1.5">
                 <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Cliente</label>
                 <input name="client_name" value={formData.client_name} onChange={handleChange} placeholder="Nome do Cliente" className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif outline-none focus:border-gold" />
               </div>

               <div className="space-y-1.5">
                 <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Tipologia Catálogo</label>
                 <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif outline-none focus:border-gold">
                   <option value="">Selecione do Catálogo...</option>
                   <option value="Cozinha Integrada">Cozinha Integrada</option>
                   <option value="Lavatório Master">Lavatório Master</option>
                   <option value="Área de Serviço">Área de Serviço</option>
                   <option value="Escadaria">Escadaria Nobre</option>
                   <option value="Bancada Gourmet">Bancada Gourmet</option>
                   <option value="Pia">Pia Tradicional</option>
                 </select>
               </div>

               <div className="space-y-1.5">
                 <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Status da Fase Inicial</label>
                 <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif outline-none focus:border-gold">
                   <option value="LEAD_FECHADO">1. Lead Fechado</option>
                   <option value="AGUARDANDO_MEDICAO">2. Aguardando Medição</option>
                   <option value="PRODUCAO">3. Produção</option>
                   <option value="INSTALACAO">4. Instalação</option>
                 </select>
               </div>
             </div>

             <div className="space-y-1.5">
               <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Descrição e Observações</label>
               <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Detalhes técnicos, pedras, valores..." className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-sm font-serif resize-none outline-none focus:border-gold" />
             </div>

             <div className="space-y-3">
               <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Alocação de Equipe (Opcional)</label>
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {MOCK_TEAM.map(member => (
                     <div key={member.id} onClick={() => handleTeamToggle(member.id)} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${formData.teamIds?.includes(member.id) ? 'bg-gold/10 border-gold shadow-sm' : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 hover:border-gold/30'}`}>
                        <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                        <div className="overflow-hidden">
                           <p className="text-[10px] font-bold text-stone-900 dark:text-white truncate">{member.name}</p>
                           <p className="text-[8px] text-stone-500 uppercase tracking-widest truncate">{member.role}</p>
                        </div>
                     </div>
                  ))}
               </div>
             </div>

             <div className="pt-6 shrink-0 flex gap-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 border border-stone-200 dark:border-white/10 text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-white/5">Cancelar</button>
                <button disabled={isSubmitting} type="submit" className="flex-[2] py-4 bg-stone-950 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-stone-800 focus:ring-2 disabled:opacity-50">
                  {isSubmitting ? <><RefreshCw size={16} className="animate-spin" /> Efetuando Ingestão...</> : <><Save size={16} /> Gravar Projeto na Base</>}
                </button>
             </div>
          </form>
        )}

      </motion.div>
    </div>
  );
};

export default ProjectFormDialog;
