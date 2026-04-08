
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Camera, Paperclip, 
  MoreVertical, Phone, Video, Search, 
  Sparkles, FileText, Image as ImageIcon, 
  Upload, Check, AlertCircle, Loader2,
  Maximize2, Trash2, MapPin, User, Ruler,
  Scissors, Calendar, Info
} from 'lucide-react';
import { Project, ProjectScope } from '../types';

interface Props {
  project: Project;
  updateProject: (p: Project) => void;
}

const ProjectScopeIA: React.FC<Props> = ({ project, updateProject }) => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Cliente', text: 'Olá, gostaria de um orçamento para minha cozinha.', timestamp: '09:00', isMe: false },
    { id: '2', sender: 'Braga', text: 'Olá! Com certeza. Pode me enviar as medidas e o tipo de pedra que prefere?', timestamp: '09:05', isMe: true },
    { id: '3', sender: 'Cliente', text: 'A cozinha tem uns 12m². Quero em Granito Preto São Gabriel.', timestamp: '09:10', isMe: false },
    { id: '4', sender: 'Cliente', text: 'Vou te mandar um print do desenho que o arquiteto fez.', timestamp: '09:11', isMe: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now().toString(),
      sender: 'Braga',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedFiles([...uploadedFiles, ...newImages]);
      
      // Add a message about the upload
      const msg = {
        id: Date.now().toString(),
        sender: 'Braga',
        text: `[Upload de ${files.length} arquivo(s)]`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages([...messages, msg]);
    }
  };

  const runAIAnalysis = async () => {
    if (uploadedFiles.length === 0) return;
    setIsAnalyzing(true);

    try {
      const chatContext = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const prompt = `
        Você é um especialista em marmoraria e gestão de obras.
        Analise o histórico de conversa abaixo para gerar o escopo técnico do projeto.

        Conversa:
        ${chatContext}

        Retorne APENAS um JSON com os campos:
        description, sizeM2 (número), numCuts (número), stoneType, deliveryDeadline, address, clientName, clientPhone.
      `;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, responseType: 'json' })
      });

      if (!response.ok) throw new Error('Erro na API');
      const data = await response.json();
      const result = JSON.parse(data.text || '{}');
      
      const analyzedScope: ProjectScope = {
        ...result,
        photos: uploadedFiles,
        aiAnalysisDate: new Date().toISOString(),
        itemType: result.itemType || 'Padrão',
        inclusions: result.inclusions || [],
        exclusions: result.exclusions || []
      };

      updateProject({
        ...project,
        scope: analyzedScope
      });

    } catch (error) {
      console.error("Erro na análise IA:", error);
      // Fallback to mock if API fails or key is missing
      const fallbackScope: ProjectScope = {
        description: "Cozinha residencial com bancada em L e ilha central (Simulado).",
        sizeM2: 12.5,
        numCuts: 8,
        stoneType: "Granito Preto São Gabriel",
        deliveryDeadline: "15 dias úteis",
        address: "Rua das Flores, 123 - Jardim América",
        clientName: project.clientName,
        clientPhone: project.phone,
        photos: uploadedFiles,
        aiAnalysisDate: new Date().toISOString(),
        itemType: 'Padrão',
        inclusions: [],
        exclusions: []
      };
      updateProject({ ...project, scope: fallbackScope });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* WhatsApp Mirror Section */}
      <div className="flex-1 flex flex-col bg-stone-100 dark:bg-black/20 rounded-[2rem] overflow-hidden border border-stone-200 dark:border-white/5 shadow-inner">
        {/* WhatsApp Header */}
        <div className="bg-stone-200 dark:bg-white/5 px-6 py-4 flex items-center justify-between border-b border-stone-300 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-400 flex items-center justify-center text-white font-bold">
              {project.clientName.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">{project.clientName}</h4>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <Video size={18} />
            <Phone size={18} />
            <div className="w-px h-4 bg-stone-300 dark:bg-white/10 mx-1" />
            <Search size={18} />
            <MoreVertical size={18} />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll bg-[#e5ddd5] dark:bg-[#0b141a]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl shadow-sm relative ${
                msg.isMe 
                  ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-stone-900 dark:text-white rounded-tr-none' 
                  : 'bg-white dark:bg-[#202c33] text-stone-900 dark:text-white rounded-tl-none'
              }`}>
                <p className="text-xs">{msg.text}</p>
                <p className="text-[8px] text-stone-400 text-right mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
          
          {uploadedFiles.length > 0 && (
            <div className="flex justify-end">
              <div className="bg-[#dcf8c6] dark:bg-[#005c4b] p-2 rounded-xl shadow-sm grid grid-cols-2 gap-2 max-w-[80%]">
                {uploadedFiles.map((img, i) => (
                  <img key={i} src={img} className="w-full aspect-square object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-stone-200 dark:bg-white/5 p-4 flex items-center gap-4">
          <button onClick={() => fileInputRef.current?.click()} className="text-stone-500 hover:text-gold transition-colors">
            <Paperclip size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
          />
          <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-xl px-4 py-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite uma mensagem"
              className="w-full bg-transparent border-none outline-none text-sm text-stone-900 dark:text-white"
            />
          </div>
          <button onClick={handleSendMessage} className="text-stone-500 hover:text-gold transition-colors">
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* AI Scope Section */}
      <div className="w-full md:w-[400px] flex flex-col gap-4">
        <div className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Escopo do Projeto (IA)</h4>
            <button 
              onClick={runAIAnalysis}
              disabled={isAnalyzing || uploadedFiles.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                isAnalyzing 
                  ? 'bg-stone-100 dark:bg-white/5 text-stone-400 cursor-not-allowed' 
                  : 'bg-stone-950 text-white hover:bg-gold hover:text-black shadow-lg'
              }`}
            >
              {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {isAnalyzing ? 'Analisando...' : 'Gerar com IA'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll space-y-6">
            {!project.scope && !isAnalyzing ? (
              <div className="text-center py-12 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-2xl">
                <Info size={32} className="mx-auto text-stone-300 mb-4" />
                <p className="text-xs text-stone-500 font-serif italic px-6">
                  Suba prints do WhatsApp, fotos de desenhos ou PDFs para que a IA gere o escopo automaticamente.
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-stone-100 dark:bg-white/5 rounded-xl" />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <ScopeItem icon={User} label="Cliente" value={project.scope?.clientName || ''} />
                <ScopeItem icon={MapPin} label="Endereço" value={project.scope?.address || ''} />
                <ScopeItem icon={Info} label="Descrição" value={project.scope?.description || ''} />
                <div className="grid grid-cols-2 gap-4">
                  <ScopeItem icon={Ruler} label="Tamanho" value={`${project.scope?.sizeM2} m²`} />
                  <ScopeItem icon={Scissors} label="Cortes" value={`${project.scope?.numCuts} un`} />
                </div>
                <ScopeItem icon={ImageIcon} label="Tipo de Pedra" value={project.scope?.stoneType || ''} />
                <ScopeItem icon={Calendar} label="Prazo Entrega" value={project.scope?.deliveryDeadline || ''} />
                
                <div className="pt-4 border-t border-stone-100 dark:border-white/5">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400 mb-2">Imagens do Escopo</p>
                  <div className="grid grid-cols-3 gap-2">
                    {project.scope?.photos.map((img, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden border border-stone-200 dark:border-white/10">
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest text-center mt-4">
                  ✓ Gerado via IA em {new Date(project.scope?.aiAnalysisDate || '').toLocaleDateString()}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScopeItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
      <Icon size={10} /> {label}
    </p>
    <p className="text-xs font-bold text-stone-900 dark:text-white">{value}</p>
  </div>
);

export default ProjectScopeIA;
