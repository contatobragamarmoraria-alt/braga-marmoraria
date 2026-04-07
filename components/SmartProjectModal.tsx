import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Mic, FileText, CheckCircle, ChevronRight, ChevronLeft, Users, FileCheck, Play } from 'lucide-react';
import { Project } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const SmartProjectModal: React.FC<Props> = ({ isOpen, onClose, onProjectCreated }) => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Form state (AI Generated/Editable)
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [measurements, setMeasurements] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [risks, setRisks] = useState('');

  // Team Collaboration
  const [teamEmail, setTeamEmail] = useState('');
  const [teamRole, setTeamRole] = useState('Gestor de Projeto');

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) {
            setIsRecording(false);
            return 300;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerateProject = () => {
    const newProject: Project = {
      id: `OP-${Math.floor(Math.random() * 1000)}`,
      clientName: clientName || 'Novo Cliente',
      clientEmail: '',
      phone: '',
      projectType: projectType || 'Nova Obra Executiva',
      concept: description || 'Projeto gerado via Sincronia IA',
      value: parseInt(budget.replace(/\D/g, '')) || 0,
      paymentMethod: 'A definir',
      startDate: new Date().toISOString(),
      estimatedDelivery: deadline || '30/12/2023',
      status: 'LEAD',
      progress: 0,
      responsible: 'Roberto Silva',
      tasks: [],
      timeline: [],
      history: [],
      beforeImages: [],
      afterImages: [],
      teamIds: [],
      supplierIds: [],
      stakeholderIds: [],
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      references: [],
      photoLog: [],
      documents: []
    };
    onProjectCreated(newProject);
    onClose();
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate AI processing after recording
      setTimeout(() => {
        setClientName('Mariana Oliveira');
        setProjectType('Reforma Suíte Master');
        setDescription('Troca de revestimentos, nova iluminação embutida e marcenaria planejada em carvalho.');
        setMaterials('Mármore Carrara, Madeira Carvalho, Metais Dourados');
        setMeasurements('24m²');
        setDeadline('20/12/2023');
        setBudget('R$ 85.000');
        setRisks('Possível infiltração na parede hidráulica');
      }, 1000);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-4xl h-[90vh] rounded-[2.5rem] border border-stone-200 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Criar Projeto Inteligente</h3>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-1">Módulo de IA para captação de leads</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full text-stone-400 transition-colors"><X size={20}/></button>
        </div>

        {/* Progress Stepper */}
        <div className="flex bg-stone-50 dark:bg-white/5 shrink-0 px-8 py-4 gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex flex-col gap-2">
              <div className={`h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-gold' : 'bg-stone-200 dark:bg-white/10'}`} />
              <span className={`text-[8px] font-bold uppercase tracking-widest ${s === step ? 'text-gold' : 'text-stone-400'}`}>Passo 0{s}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scroll">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="max-w-xl mx-auto text-center space-y-4">
                  <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                    <Upload size={28} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Upload de Conversas e Imagens</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">Suba prints de conversas do WhatsApp ou Instagram e fotos do ambiente. Nossa IA extrairá nomes, medidas e orçamentos automaticamente.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group border-2 border-dashed border-stone-200 dark:border-white/10 rounded-[2rem] p-10 text-center hover:border-gold/50 transition-all cursor-pointer bg-stone-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10">
                    <Upload size={32} className="mx-auto text-stone-400 group-hover:text-gold transition-colors mb-4" />
                    <p className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">Prints da Conversa</p>
                    <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-widest">Formatos: PNG, JPEG (Max 20)</p>
                  </div>
                  <div className="group border-2 border-dashed border-stone-200 dark:border-white/10 rounded-[2rem] p-10 text-center hover:border-gold/50 transition-all cursor-pointer bg-stone-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10">
                    <Upload size={32} className="mx-auto text-stone-400 group-hover:text-gold transition-colors mb-4" />
                    <p className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">Fotos do Ambiente</p>
                    <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-widest">Formatos: PNG, JPEG (Max 10)</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="max-w-xl mx-auto text-center space-y-4">
                  <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                    <Mic size={28} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Gravar Áudio Explicativo</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">Explique os detalhes do projeto em áudio. A IA transcreverá e unirá estas informações aos dados dos arquivos subidos.</p>
                </div>

                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <AnimatePresence>
                      {isRecording && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 0.2 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 bg-red-500 rounded-full"
                        />
                      )}
                    </AnimatePresence>
                    <button 
                      onClick={toggleRecording}
                      className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${isRecording ? 'bg-red-500 text-white shadow-2xl shadow-red-500/40' : 'bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-white/20'}`}
                    >
                      {isRecording ? <div className="w-8 h-8 bg-white rounded-lg animate-pulse" /> : <Mic size={36} />}
                    </button>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-2xl font-mono font-bold text-stone-900 dark:text-white">
                      {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                    </p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-2">{isRecording ? 'Gravando Briefing...' : 'Toque para Iniciar'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText size={28} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Revisão do Briefing Gerado</h4>
                  <p className="text-sm text-stone-500">A IA processou os dados. Revise e ajuste as informações antes de criar o projeto.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Nome do Cliente</label>
                    <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ex: João Silva" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Tipo de Projeto</label>
                    <input type="text" value={projectType} onChange={e => setProjectType(e.target.value)} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ex: Cozinha Gourmet" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Descrição Técnica (Briefing)</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Descreva os detalhes técnicos..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Materiais Sugeridos</label>
                    <input type="text" value={materials} onChange={e => setMaterials(e.target.value)} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ex: MDF, Granito, Vidro" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Medidas Identificadas</label>
                    <input type="text" value={measurements} onChange={e => setMeasurements(e.target.value)} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ex: 12m²" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Prazo Estimado</label>
                    <input type="text" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ex: 15/12/2023" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Orçamento Estimado</label>
                    <input type="text" value={budget} onChange={e => setBudget(e.target.value)} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ex: R$ 50.000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-2">Riscos Identificados</label>
                    <input type="text" value={risks} onChange={e => setRisks(e.target.value)} className="w-full px-5 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ex: Atraso fornecedor mármore" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users size={28} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Alocação de Equipe e Acessos</h4>
                  <p className="text-sm text-stone-500">Defina quem trabalhará neste projeto e quais permissões o cliente terá.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-stone-50 dark:bg-white/5 p-8 rounded-[2rem] border border-stone-200 dark:border-white/10 space-y-6">
                    <h5 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-widest flex items-center gap-2"><Users size={16} className="text-gold" /> Adicionar Colaborador</h5>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest ml-1">Email</label>
                        <input type="email" placeholder="colaborador@empresa.com" value={teamEmail} onChange={e => setTeamEmail(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest ml-1">Função</label>
                        <select value={teamRole} onChange={e => setTeamRole(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-gold">
                          <option>Medição</option>
                          <option>Produção</option>
                          <option>Instalação</option>
                          <option>Financeiro</option>
                          <option>Gestor de Projeto</option>
                        </select>
                      </div>
                      <button className="w-full py-3 bg-stone-900 dark:bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black dark:hover:bg-white/20 transition-all">Convidar Equipe</button>
                    </div>
                  </div>

                  <div className="bg-stone-50 dark:bg-white/5 p-8 rounded-[2rem] border border-stone-200 dark:border-white/10 space-y-6">
                    <h5 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-widest flex items-center gap-2"><FileCheck size={16} className="text-gold" /> Área do Cliente</h5>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-onyx rounded-xl border border-stone-100 dark:border-white/5">
                        <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Visualizar Orçamento</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-onyx rounded-xl border border-stone-100 dark:border-white/5">
                        <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Visualizar Cronograma</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-onyx rounded-xl border border-stone-100 dark:border-white/5">
                        <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">Solicitar Alterações</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold" />
                      </div>
                      <button className="w-full py-3 border border-gold/30 text-gold rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all mt-2">Gerar Link de Acesso</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-stone-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-stone-50 dark:bg-onyx/50">
          <button 
            onClick={handlePrev}
            className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-white/10'}`}
          >
            <ChevronLeft size={16} /> Voltar
          </button>
          
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors">Cancelar</button>
            {step < 4 ? (
              <button 
                onClick={handleNext}
                className="gold-bg px-10 py-3 text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gold/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                Próximo Passo <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleGenerateProject}
                className="gold-bg px-10 py-3 text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gold/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <CheckCircle size={16} /> Escrever Projeto
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartProjectModal;
