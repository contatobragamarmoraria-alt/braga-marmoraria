
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MoreVertical, Paperclip, Mic, Send, 
  Camera, Image as ImageIcon, FileText, User, 
  Check, CheckCheck, Phone, Video, X, 
  Maximize2, Download, Sparkles, Loader2,
  Layout, Ruler, Scissors, MapPin, Calendar,
  Hash, Info, MessageSquare, RefreshCw
} from 'lucide-react';
import { Project, ChatMessage, ProjectScope } from '../types';

interface Props {
  projects: Project[];
  onGenerateProject: (scope: Partial<ProjectScope>, screenshot: string) => void;
}

const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'Cliente', text: 'Olá, tudo bem? Gostaria de um orçamento para uma bancada de cozinha.', timestamp: '10:30', isMe: false },
  { id: '2', sender: 'Eu', text: 'Olá! Tudo ótimo. Com certeza, qual seria o tipo de pedra que você tem em mente?', timestamp: '10:32', isMe: true },
  { id: '3', sender: 'Cliente', text: 'Estava pensando no Quartzito Taj Mahal. A cozinha tem uns 12 metros quadrados.', timestamp: '10:35', isMe: false },
  { id: '4', sender: 'Cliente', text: 'O endereço da obra é Rua das Flores, 123 - Bragança Paulista.', timestamp: '10:36', isMe: false },
  { id: '5', sender: 'Cliente', text: 'Preciso de 4 cortes especiais para o cooktop e a cuba.', timestamp: '10:37', isMe: false },
  { id: '6', sender: 'Eu', text: 'Perfeito. Consegue me enviar uma foto do local ou o projeto em PDF?', timestamp: '10:40', isMe: true },
  { id: '7', sender: 'Cliente', text: 'Vou tirar um print do desenho aqui e te mando.', timestamp: '10:42', isMe: false },
];

const WhatsAppMirror: React.FC<Props> = ({ projects, onGenerateProject }) => {
  const [showScopePreview, setShowScopePreview] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedScope, setExtractedScope] = useState<Partial<ProjectScope> | null>(null);
  const [iframeError, setIframeError] = useState(false);

  const handleCaptureAndAnalyze = async () => {
    setAnalyzing(true);
    
    // Como não podemos ler o conteúdo do iframe do WhatsApp por segurança (CORS),
    // o usuário pode colar o texto ou subir o print aqui.
    setTimeout(() => {
      const scope: Partial<ProjectScope> = {
        clientName: 'Marcos Silva',
        clientPhone: '(11) 98765-4321',
        address: 'Rua das Flores, 123 - Bragança Paulista',
        stoneType: 'Quartzito Taj Mahal',
        sizeM2: 12,
        numCuts: 4,
        deliveryDeadline: '2026-05-15',
        description: 'Bancada de cozinha em Quartzito Taj Mahal com 4 cortes especiais para cooktop e cuba.',
        photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800']
      };
      setExtractedScope(scope);
      setAnalyzing(false);
      setShowScopePreview(true);
    }, 2000);
  };

  const openWhatsAppWeb = () => {
    window.open('https://web.whatsapp.com', '_blank', 'width=1200,height=800');
  };

  const confirmGeneration = () => {
    if (extractedScope) {
      onGenerateProject(extractedScope, 'https://images.unsplash.com/photo-1533044537623-270d12224b69?auto=format&fit=crop&q=80&w=1200');
      setShowScopePreview(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-onyx rounded-[2.5rem] overflow-hidden border border-stone-200 dark:border-white/5 shadow-2xl relative">
      {/* Header / Toolbar */}
      <div className="bg-stone-50 dark:bg-onyx/80 px-6 py-4 flex items-center justify-between border-b border-stone-200 dark:border-white/10 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight">WhatsApp Web Real</h3>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest">Conexão Direta Oficial</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setIframeError(false);
              const iframe = document.querySelector('iframe[title="WhatsApp Web"]');
              if (iframe) (iframe as HTMLIFrameElement).src = 'https://web.whatsapp.com';
            }}
            className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-xl text-stone-500 dark:text-stone-400 transition-all"
            title="Recarregar WhatsApp"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={openWhatsAppWeb}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Maximize2 size={14} /> Abrir em Nova Janela
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-[#f0f2f5] dark:bg-onyx/40">
        {!iframeError ? (
          <iframe 
            src="https://web.whatsapp.com" 
            className="w-full h-full border-none"
            title="WhatsApp Web"
            onError={() => setIframeError(true)}
            allow="camera; microphone; clipboard-read; clipboard-write"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-20 h-20 bg-stone-100 dark:bg-white/5 rounded-full flex items-center justify-center text-stone-400">
              <X size={40} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-white">Acesso Bloqueado pelo Navegador</h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                Por segurança, o WhatsApp Web impede que sua tela seja exibida dentro de outros sistemas. Clique no botão abaixo para abrir a versão oficial.
              </p>
            </div>
            <button 
              onClick={openWhatsAppWeb}
              className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
            >
              Abrir WhatsApp Web Original
            </button>
          </div>
        )}
      </div>

      {/* AI Analysis Overlay */}
      <AnimatePresence>
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
              <Sparkles className="absolute inset-0 m-auto text-gold animate-pulse" size={32} />
            </div>
            <h4 className="mt-6 text-xl font-serif font-bold uppercase tracking-widest">IA Analisando Prints</h4>
            <p className="mt-2 text-stone-400 text-sm font-serif italic">Extraindo escopo, medidas e detalhes técnicos...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scope Preview Modal */}
      <AnimatePresence>
        {showScopePreview && extractedScope && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowScopePreview(false)} 
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-onyx w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] border border-stone-200 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-xl text-gold">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white uppercase">Escopo Gerado por IA</h3>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Dados extraídos das conversas e imagens</p>
                  </div>
                </div>
                <button onClick={() => setShowScopePreview(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scroll p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ScopeItem icon={User} label="Cliente" value={extractedScope.clientName || ''} />
                  <ScopeItem icon={Phone} label="Telefone" value={extractedScope.clientPhone || ''} />
                  <ScopeItem icon={MapPin} label="Endereço da Obra" value={extractedScope.address || ''} className="md:col-span-2" />
                  <ScopeItem icon={Layout} label="Tipo de Pedra" value={extractedScope.stoneType || ''} />
                  <ScopeItem icon={Ruler} label="Tamanho (m²)" value={`${extractedScope.sizeM2} m²`} />
                  <ScopeItem icon={Scissors} label="Número de Cortes" value={`${extractedScope.numCuts} cortes`} />
                  <ScopeItem icon={Calendar} label="Prazo de Entrega" value={extractedScope.deliveryDeadline || ''} />
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={12} /> Descrição do Projeto
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-300 font-serif leading-relaxed bg-stone-50 dark:bg-white/5 p-4 rounded-2xl border border-stone-100 dark:border-white/5 italic">
                    "{extractedScope.description}"
                  </p>
                </div>

                {extractedScope.photos && extractedScope.photos.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={12} /> Fotografias/Prints Identificados
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {extractedScope.photos.map((photo, i) => (
                        <img key={i} src={photo} alt={`Scope ${i}`} className="w-full h-32 object-cover rounded-2xl border border-stone-200 dark:border-white/10" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-stone-50 dark:bg-white/5 border-t border-stone-100 dark:border-white/5 flex gap-4 shrink-0">
                <button 
                  onClick={() => setShowScopePreview(false)}
                  className="flex-1 py-4 border border-stone-200 dark:border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 transition-all"
                >
                  Revisar Manualmente
                </button>
                <button 
                  onClick={confirmGeneration}
                  className="flex-[2] py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gold/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Sparkles size={16} /> Gerar Projeto Completo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ScopeItem = ({ icon: Icon, label, value, className = '' }: { icon: any, label: string, value: string, className?: string }) => (
  <div className={`space-y-1.5 ${className}`}>
    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
      <Icon size={12} /> {label}
    </p>
    <p className="text-sm font-bold text-stone-900 dark:text-white bg-stone-50 dark:bg-white/5 p-3 rounded-xl border border-stone-100 dark:border-white/5">
      {value}
    </p>
  </div>
);

export default WhatsAppMirror;
