
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, CheckCircle2, Clock, Hammer, Layers, Sparkles, Save, ImageIcon, FileText, Trash2, Download, Paperclip, Camera, DollarSign, Plus, MapPin, Info } from 'lucide-react';
import { Project, ProjectTask } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  project: Project;
  onClose: () => void;
  updateProject: (p: Project) => void;
}

// Reusable print function
const printReport = (contentId: string, title: string) => {
    const printContent = document.getElementById(contentId);
    if (printContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>${title}</title>
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; padding: 2rem; }
                h1, h2, h3 { font-family: serif; }
                p { white-space: pre-line; margin-bottom: 1em; }
                ul { list-style-type: '✓ '; padding-left: 20px; }
                li { margin-bottom: 0.5em; }
            </style>
        </head><body>${printContent.innerHTML}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}


const ProjectDetailsModal: React.FC<Props> = ({ project, onClose, updateProject }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiUpdate, setAiUpdate] = useState('');
  const [activeTab, setActiveTab] = useState<'checklist' | 'media' | 'docs' | 'scope'>('checklist');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [individualReport, setIndividualReport] = useState<string | null>(null);
  const [isGeneratingIndividualReport, setIsGeneratingIndividualReport] = useState(false);
  
  // New Task States
  const [taskForm, setTaskForm] = useState({
    name: '',
    date: '',
    time: '',
    desc: ''
  });

  const generateIndividualReport = async () => {
    setIsGeneratingIndividualReport(true);
    setIndividualReport(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Gere um relatório técnico e executivo detalhado para o projeto "${project.projectType}" do cliente ${project.clientName}. Status atual: ${project.status} (${project.progress}% concluído). Valor: R$${project.value}. Analise o progresso, destaque pontos de atenção, e liste os próximos passos críticos. O relatório deve ser formatado profissionalmente para apresentação ao cliente e à diretoria, com títulos claros e listas.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setIndividualReport(response.text?.replace(/\*/g, '') || '');
    } catch (error) {
      setIndividualReport("Erro ao processar relatório da obra via IA.");
    } finally {
      setIsGeneratingIndividualReport(false);
    }
  };

  const addTask = () => {
    if (!taskForm.name.trim()) return;
    const newTask: ProjectTask = {
      id: Math.random().toString(36).substr(2, 9),
      name: taskForm.name,
      description: taskForm.desc,
      completed: false,
      scheduledDate: taskForm.date,
      scheduledTime: taskForm.time,
      category: 'PRODUCAO'
    };
    updateProject({ ...project, tasks: [...project.tasks, newTask] });
    setTaskForm({ name: '', date: '', time: '', desc: '' });
    setIsAddingTask(false);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;
    updateProject({ ...project, tasks: updatedTasks, progress });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-6xl bg-white dark:bg-onyx rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-stone-200 dark:border-white/5">
          
          <div className="w-full h-64 md:h-full md:w-[380px] bg-stone-900 relative shrink-0 overflow-hidden group">
            <img src={project.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 md:p-10 flex flex-col justify-end gap-2">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Protocolo Executivo</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-tighter leading-tight">{project.clientName}</h2>
              <div className="flex items-center gap-3 border-l-2 border-gold pl-4 mt-2">
                 <p className="text-stone-400 text-[11px] font-bold uppercase tracking-[0.2em]">{project.projectType}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-onyx">
            <div className="p-4 md:p-8 border-b dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex gap-4 md:gap-8 overflow-x-auto custom-scroll w-full md:w-auto pb-2 md:pb-0">
                 {['checklist', 'scope', 'media', 'docs'].map(tab => (
                   <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative pb-2 whitespace-nowrap ${activeTab === tab ? 'text-gold' : 'text-stone-400 hover:text-white'}`}>
                     {tab === 'checklist' ? <Hammer size={14}/> : tab === 'scope' ? <Layers size={14}/> : tab === 'media' ? <Camera size={14}/> : <FileText size={14}/>}
                     {tab === 'checklist' ? 'Produção' : tab === 'scope' ? 'Escopo' : tab === 'media' ? 'Mídia' : 'Documentos'}
                     {activeTab === tab && <motion.div layoutId="activeTabModal" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                   </button>
                 ))}
               </div>
               <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <button onClick={generateIndividualReport} disabled={isGeneratingIndividualReport} className="px-4 py-2 bg-stone-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-gold hover:bg-stone-100 disabled:opacity-50">
                        <Sparkles size={14}/> {isGeneratingIndividualReport ? "..." : "Relatório IA"}
                    </button>
                    <button onClick={onClose} className="p-2 text-stone-400 hover:text-white"><X size={24}/></button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 md:space-y-12 custom-scroll">
              {activeTab === 'checklist' && (
                <div className="space-y-6 md:space-y-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Tarefas e Agendamentos</h4>
                    <button onClick={() => setIsAddingTask(!isAddingTask)} className="w-full sm:w-auto justify-center px-6 py-3 bg-stone-950 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                      {isAddingTask ? <X size={14}/> : <Plus size={14}/>} {isAddingTask ? 'Cancelar' : 'Novo Agendamento'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isAddingTask && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-8 bg-stone-50 dark:bg-white/5 rounded-[2.5rem] border border-stone-200 dark:border-white/10 space-y-6 overflow-hidden">
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Nome da Tarefa</label>
                           <input type="text" value={taskForm.name} onChange={(e) => setTaskForm({...taskForm, name: e.target.value})} className="w-full bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm font-serif" placeholder="Ex: Conferência Final de Bancada" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Data Programada</label>
                              <input type="date" value={taskForm.date} onChange={(e) => setTaskForm({...taskForm, date: e.target.value})} className="w-full bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm font-serif" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Horário</label>
                              <input type="time" value={taskForm.time} onChange={(e) => setTaskForm({...taskForm, time: e.target.value})} className="w-full bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm font-serif" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Observações Estratégicas</label>
                           <textarea value={taskForm.desc} onChange={(e) => setTaskForm({...taskForm, desc: e.target.value})} className="w-full bg-white dark:bg-onyx border border-stone-200 dark:border-white/10 rounded-xl px-5 py-4 text-sm font-serif italic" rows={2} />
                        </div>
                        <button onClick={addTask} className="w-full py-5 bg-gold text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                           <Calendar size={16} /> Salvar no Cronograma e Google Calendar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 gap-3">
                    {project.tasks.map(task => (
                      <div key={task.id} className="group p-5 bg-white dark:bg-white/[0.02] border border-stone-100 dark:border-white/5 rounded-2xl flex items-center justify-between hover:border-gold/30 transition-all">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleTask(task.id)}>
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-200 dark:border-white/10'}`}>
                            {task.completed && <CheckCircle2 size={14} />}
                          </div>
                          <div>
                            <span className={`text-sm font-serif ${task.completed ? 'text-stone-300 line-through' : 'text-stone-800 dark:text-stone-200'}`}>{task.name}</span>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={10} /> {task.scheduledDate || 'Sem data'}</span>
                               {task.scheduledTime && <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> {task.scheduledTime}</span>}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-stone-300 hover:text-gold opacity-0 group-hover:opacity-100 transition-all"><Info size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'scope' && (
                <div className="space-y-8">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Escopo Detalhado da Obra</h4>
                    {project.detailedScope && project.detailedScope.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {project.detailedScope.map((section, idx) => (
                                <div key={idx} className="p-6 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/10">
                                    <h5 className="text-sm font-bold font-serif text-stone-900 dark:text-white uppercase mb-4">{section.title}</h5>
                                    <ul className="space-y-2">
                                        {section.items.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-xs text-stone-500 dark:text-stone-400 italic">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gold/50" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-stone-400 italic">Escopo ainda não definido.</p>
                    )}
                </div>
              )}
              {activeTab === 'media' && (
                <div className="space-y-12">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-6">Fotos do Antes</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {project.beforeImages.map((img, i) => (
                        <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-stone-100 dark:border-white/5 shadow-sm group cursor-pointer">
                           <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                      {project.beforeImages.length === 0 && <p className="text-xs text-stone-400 italic">Nenhum registro encontrado.</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-6">Fotos do Depois</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {project.afterImages.map((img, i) => (
                        <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-stone-100 dark:border-white/5 shadow-sm group cursor-pointer">
                           <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                      {project.afterImages.length === 0 && <p className="text-xs text-stone-400 italic">Nenhum registro encontrado.</p>}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-6">Documentos Anexados</h4>
                    {project.documents && project.documents.length > 0 ? (
                        project.documents.map((doc) => (
                            <div key={doc.id} className="group p-5 bg-white dark:bg-white/[0.02] border border-stone-100 dark:border-white/5 rounded-2xl flex items-center justify-between hover:border-gold/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-white/5 flex items-center justify-center text-stone-400 group-hover:text-gold transition-colors">
                                        <Paperclip size={16} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-serif text-stone-800 dark:text-stone-200">{doc.name}</span>
                                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">{doc.type}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-stone-300 hover:text-gold transition-all"><Download size={16} /></button>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-stone-400 italic">Nenhum documento anexado.</p>
                    )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {individualReport && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIndividualReport(null)} className="absolute inset-0 bg-stone-950/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-2xl rounded-[3rem] p-10 border border-stone-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between mb-8 shrink-0">
                 <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white uppercase">Relatório do Projeto</h3>
                 <button onClick={() => setIndividualReport(null)} className="p-2 text-stone-400 hover:text-stone-900 dark:hover:text-white"><X size={20}/></button>
              </div>
              <div id="individual-report-content" className="prose prose-stone dark:prose-invert overflow-y-auto custom-scroll flex-1 pr-4">
                <p className="text-lg font-serif italic text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">{individualReport}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-stone-100 dark:border-white/5 shrink-0">
                <button onClick={() => printReport('individual-report-content', `Relatório - ${project.clientName}`)} className="w-full py-4 gold-bg text-black rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Download size={16}/> Baixar Relatório (PDF)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;
