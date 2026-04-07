
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, FileAudio, Zap, Bot, Sparkles, UploadCloud, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { Project, ProjectTask } from '../types';

interface Summary {
  resumo_geral: string;
  pontos_chave: string[];
  acoes_necessarias: string[];
}

interface Props {
  projects: Project[];
  updateProject: (p: Project) => void;
}

const ConversationSummarizer: React.FC<Props> = ({ projects, updateProject }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachedImageUrl, setAttachedImageUrl] = useState<string | null>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<{screenshots: number, audios: number, synced: boolean}>({screenshots: 0, audios: 0, synced: false});

  const handleAttachImage = () => {
    setUploadedFiles(s => ({ ...s, screenshots: s.screenshots + 1 }));
    // Simula anexar a imagem para o projeto do Dr. Marcos, como solicitado.
    if (selectedProject?.id === 'MO-MSQ-002') {
      setAttachedImageUrl('https://images.unsplash.com/photo-1533044537623-270d12224b69?auto=format&fit=crop&q=80&w=1200');
    } else {
      // Imagem genérica para outros projetos como fallback
      setAttachedImageUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800');
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);
    setSummary(null);

    const mockConversation = `
      Cliente (${selectedProject.clientName}): Olá, tudo bem? Viemos hoje no atelier e ficamos encantados com o quartzito Taj Mahal. Ele ficaria bom na nossa cozinha?
      Artesão (Mais Obras): Olá! Sim, o Taj Mahal é uma escolha fantástica, muito resistente e elegante. Para a sua ilha, podemos fazer a paginação 'bookmatched' para criar um efeito espelhado.
      Cliente: Adorei a ideia! E sobre o prazo? A obra começa em duas semanas.
      Artesão: Se fecharmos o contrato até sexta, consigo reservar o lote e garantir a entrega em 45 dias, alinhado com o seu cronograma.
      Cliente: Perfeito. Pode me enviar a proposta formal para o e-mail cadastrado?
      Artesão: Com certeza. Envio ainda hoje com os detalhes técnicos da instalação e o cronograma físico-financeiro.
    `;

    try {
      const prompt = `Você é um diretor de operações em uma marmoraria de luxo. Analise a transcrição da conversa com o cliente "${selectedProject.clientName}" e gere um resumo executivo em JSON.
      
      O JSON deve ter exatamente este formato:
      {
        "resumo_geral": "string",
        "pontos_chave": ["string"],
        "acoes_necessarias": ["string"]
      }

      Transcrição: "${mockConversation}"`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Você é um assistente especializado em gestão de marmorarias de luxo. Responda apenas em JSON válido.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro ao comunicar com o ChatGPT');
      }

      const chatData = await response.json();
      const summaryData = JSON.parse(chatData.content);
      setSummary(summaryData);
      
      let projectToUpdate = { ...selectedProject };
      
      if (attachedImageUrl) {
        projectToUpdate.image = attachedImageUrl;
        setAttachedImageUrl(null);
      }

      if (summaryData.acoes_necessarias && summaryData.acoes_necessarias.length > 0) {
        const newTasks: ProjectTask[] = summaryData.acoes_necessarias.map((action: string) => ({
          id: `task_ai_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: action,
          completed: false,
          category: 'PRODUCAO',
        }));
        projectToUpdate.tasks = [...projectToUpdate.tasks, ...newTasks];
      }

      updateProject(projectToUpdate);
      setSelectedProject(projectToUpdate);

    } catch (e) {
      console.error(e);
      setError("Não foi possível gerar o resumo. Verifique a conexão com a IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setSummary(null);
    setError(null);
    setIsLoading(false);
    setUploadedFiles({screenshots: 0, audios: 0, synced: false});
    setAttachedImageUrl(null);
  }

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 overflow-hidden">
      <div className={`w-full md:w-[350px] bg-white dark:bg-onyx/40 rounded-[2.5rem] border border-stone-200 dark:border-white/5 shadow-sm flex flex-col shrink-0 ${selectedProject ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-stone-200 dark:border-white/10">
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Central de Sincronia</h3>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Selecione o Proprietário</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-1.5">
          {projects.map(p => (
            <button 
              key={p.id}
              onClick={() => {setSelectedProject(p); resetState();}}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${selectedProject?.id === p.id ? 'bg-stone-900 dark:bg-gold text-white dark:text-black shadow-lg' : 'hover:bg-stone-50 dark:hover:bg-white/5'}`}
            >
              <img src={p.clientAvatar} alt={p.clientName} className="w-10 h-10 rounded-xl border border-stone-200 dark:border-white/10 shrink-0" />
              <div className="min-w-0">
                <p className={`text-sm font-serif font-bold truncate ${selectedProject?.id === p.id ? 'text-white dark:text-black' : 'text-stone-900 dark:text-white'}`}>{p.clientName}</p>
                <p className={`text-[8px] font-bold uppercase tracking-widest ${selectedProject?.id === p.id ? 'text-stone-300 dark:text-stone-800' : 'text-stone-400'}`}>{p.id}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className={`flex-1 bg-white dark:bg-onyx/40 rounded-[2.5rem] border border-stone-200 dark:border-white/5 shadow-sm flex flex-col p-4 md:p-8 overflow-hidden ${!selectedProject ? 'hidden md:flex' : 'flex'}`}>
        {!selectedProject ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
            <Bot size={48} className="text-stone-300 dark:text-stone-700"/>
            <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-white">Selecione um projeto</h4>
            <p className="max-w-xs text-sm text-stone-500 dark:text-stone-400 font-serif italic">Escolha um cliente na barra lateral para iniciar a análise de conversas.</p>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setSelectedProject(null)} className="md:hidden p-2 bg-stone-100 dark:bg-white/5 rounded-full text-stone-600 dark:text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              </button>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight truncate">Resumo de Conversa: <span className="text-gold italic">{selectedProject.clientName}</span></h3>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
                <div className="flex flex-col gap-8">
                    <div className="p-8 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-[2rem] flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-16 h-16 bg-stone-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-stone-400 border border-stone-200 dark:border-white/10">
                            <UploadCloud size={32} />
                        </div>
                        <h4 className="text-lg font-serif font-bold text-stone-900 dark:text-white">Adicionar Fontes de Dados</h4>
                        <div className="flex gap-4 w-full">
                            <button onClick={handleAttachImage} className="flex-1 p-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-gold transition-all">
                                <ImageIcon size={14}/> Anexar Imagens {uploadedFiles.screenshots > 0 && `(${uploadedFiles.screenshots})`}
                            </button>
                             <button onClick={() => setUploadedFiles(s => ({...s, audios: s.audios+1}))} className="flex-1 p-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-gold transition-all">
                                <FileAudio size={14}/> Anexar Áudios {uploadedFiles.audios > 0 && `(${uploadedFiles.audios})`}
                            </button>
                        </div>
                         {attachedImageUrl && (
                            <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="w-full space-y-2 text-left">
                               <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Imagem para sincronizar:</p>
                               <img src={attachedImageUrl} alt="Preview" className="w-full h-24 object-cover rounded-xl" />
                            </motion.div>
                         )}
                         <button onClick={() => setUploadedFiles(s => ({...s, synced: true}))} className={`w-full p-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${uploadedFiles.synced ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 hover:border-gold'}`}>
                            {uploadedFiles.synced ? <CheckCircle2 size={14}/> : <Zap size={14}/>} {uploadedFiles.synced ? 'WhatsApp Sincronizado' : 'Sincronizar WhatsApp'}
                         </button>
                    </div>
                    <button 
                        onClick={handleGenerateSummary} 
                        disabled={isLoading}
                        className="w-full py-6 gold-bg text-black rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                        {isLoading ? 'Analisando...' : 'Analisar e Sincronizar'}
                    </button>
                </div>
                <AnimatePresence>
                <div className="bg-stone-50 dark:bg-onyx p-8 rounded-[2rem] border border-stone-100 dark:border-white/10 flex flex-col overflow-y-auto custom-scroll">
                    {isLoading && (
                        <div className="m-auto flex flex-col items-center justify-center text-center space-y-4 text-stone-400">
                            <Bot size={40} className="animate-pulse" />
                            <p className="text-sm font-bold uppercase tracking-widest">IA está lendo a conversa...</p>
                        </div>
                    )}
                    {error && (
                         <div className="m-auto flex flex-col items-center justify-center text-center space-y-4 text-red-500">
                            <AlertTriangle size={40} />
                            <p className="text-sm font-bold uppercase tracking-widest">Erro na Análise</p>
                            <p className="text-xs max-w-xs">{error}</p>
                        </div>
                    )}
                    {summary && !isLoading && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-8">
                            <div>
                                <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Visão Geral</h4>
                                <p className="text-base text-stone-600 dark:text-stone-300 font-serif italic leading-relaxed">"{summary.resumo_geral}"</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Pontos Chave</h4>
                                <ul className="space-y-3">
                                {summary.pontos_chave.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-800 dark:text-stone-200">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0"/>
                                        <span>{point}</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Próximos Passos (Ações)</h4>
                                 <ul className="space-y-3">
                                {summary.acoes_necessarias.map((action, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-800 dark:text-stone-200 font-bold p-4 bg-white dark:bg-onyx/50 border border-stone-200 dark:border-white/10 rounded-xl">
                                         <div className="mt-1 w-6 h-6 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 font-serif">{i+1}</div>
                                        <span>{action}</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </div>
                </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSummarizer;
