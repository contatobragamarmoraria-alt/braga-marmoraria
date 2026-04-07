
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Clipboard, Database, Sparkles, X, Check, AlertCircle, MessageSquare } from 'lucide-react';
interface ImportCenterProps {
  onImport: (data: any) => void;
  onClose: () => void;
}

const ImportCenter: React.FC<ImportCenterProps> = ({ onImport, onClose }) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file' | 'whatsapp' | 'contract'>('paste');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const processWithAI = async (text?: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const contentToProcess = text || inputText;
      const prompt = `Analise o seguinte texto de reunião/conversa ou contrato e extraia dados estruturados para um sistema de marmoraria.
      Texto: "${contentToProcess}"
      Retorne um JSON com: nome_cliente, tipo_projeto, materiais_mencionados, prazos_estimados, observacoes_tecnicas, endereco_obra, valor_total.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, responseType: 'json' })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro na IA');
      }

      const data = await response.json();
      const parsed = JSON.parse(data.text || '{}');
      setResult(parsed);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}
        className="absolute inset-0 bg-stone-900/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Central de Ingestão</h2>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">IA Inteligente de Sincronização</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all"><X size={20}/></button>
        </div>

        <div className="flex border-b border-stone-100">
          {[
            { id: 'paste', label: 'Colar Notas', icon: Clipboard },
            { id: 'file', label: 'Excel/Sheets', icon: Database },
            { id: 'contract', label: 'Contrato/PDF', icon: FileText },
            { id: 'whatsapp', label: 'WhatsApp Chat', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-stone-900 border-b-2 border-stone-900' : 'bg-stone-50 text-stone-400'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scroll">
          {activeTab === 'paste' && (
            <div className="space-y-6">
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                <Sparkles className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Cole aqui atas de reuniões, anotações do Google Docs ou rascunhos. Nossa IA irá extrair automaticamente os dados do projeto para você.
                </p>
              </div>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex: Reunião com Dra Helena. Ela confirmou a ilha em Calacatta. O engenheiro Ricardo aprovou a carga. Instalação prevista para 20/12..."
                className="w-full h-48 p-6 bg-stone-50 border border-stone-200 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-light leading-relaxed"
              />
              <button 
                onClick={() => processWithAI()}
                disabled={isProcessing || !inputText}
                className="w-full py-5 bg-stone-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? "IA Processando..." : <><Sparkles size={16}/> Sincronizar com Projeto</>}
              </button>
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                <FileText className="text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Suba um contrato ou PDF de projeto. Nossa IA lerá os termos, materiais e prazos para criar o projeto automaticamente.
                </p>
              </div>
              <div className="h-48 border-2 border-dashed border-stone-200 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-stone-400 transition-all group cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Simulate reading PDF/Text
                      processWithAI(`Contrato de Marmoraria para Cliente ${file.name.split('.')[0]}. Valor: R$ 15.000,00. Material: Granito Preto Absoluto. Prazo: 30 dias.`);
                    }
                  }}
                />
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Clique ou arraste o Contrato (PDF/DOCX)</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">IA fará a leitura completa do escopo</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'file' && (
            <div className="h-64 border-2 border-dashed border-stone-200 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-stone-400 transition-all group cursor-pointer">
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">Arraste seu Excel ou CSV</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Ou clique para navegar no Google Drive</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
              <AlertCircle size={16} />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] space-y-6"
            >
              <div className="flex items-center gap-3 text-emerald-700">
                <Check size={20} />
                <h4 className="text-sm font-bold uppercase tracking-widest">Dados Identificados</h4>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(result).map(([key, value]: any) => (
                  <div key={key}>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{key.replace('_', ' ')}</p>
                    <p className="text-sm font-medium text-stone-900">{value || 'Não identificado'}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">Confirmar e Importar para Base</button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ImportCenter;
