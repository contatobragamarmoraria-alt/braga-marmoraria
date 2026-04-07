
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Copy, Check, FileText, Loader2, Wand2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { Project } from '../types';
import { generateProposal } from '../services/claudeService';

interface Props {
  project: Project;
}

const ProjectProposalIA: React.FC<Props> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [details, setDetails] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await generateProposal({
        clientName: project.clientName,
        projectType: project.projectType,
        value: project.value,
        details: details || 'Foco em acabamento de alto padrão e prazos rigorosos.'
      });
      setProposal(text);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar proposta. Verifique a chave da API do Claude.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-[2rem] p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gold/10 rounded-2xl border border-gold/20 text-gold">
            <Wand2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white uppercase">Proposta Comercial IA (Claude)</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Geração de propostas de alto luxo com Anthropic Claude 3.5</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Instruções Adicionais (Opcional)</label>
            <textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Ex: Enfatizar o uso de Mármore Carrara, incluir desconto de 5% para pagamento à vista..."
              className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-serif min-h-[100px] focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-stone-950 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:bg-gold hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Redigindo Proposta Sofisticada...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Gerar Proposta de Luxo
              </>
            )}
          </button>
        </div>
      </div>

      {proposal && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-lg"
        >
          <div className="px-8 py-4 border-b border-stone-100 dark:border-white/5 flex justify-between items-center bg-stone-50/50 dark:bg-black/20">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gold" />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Minuta da Proposta</span>
            </div>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-stone-600 dark:text-gold hover:border-gold/30 transition-all"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scroll">
            <div className="prose prose-stone dark:prose-invert max-w-none prose-sm font-serif leading-relaxed">
              <Markdown>{proposal}</Markdown>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectProposalIA;
