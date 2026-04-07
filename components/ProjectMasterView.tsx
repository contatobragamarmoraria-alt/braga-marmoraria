
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Phone, Mail, MapPin, 
  Calendar, Layers, Target, DollarSign, 
  Share2, MessageSquare, Download, Sparkles,
  FileText, Clock, Camera, Eye, ShieldCheck,
  CheckCircle2, ArrowUpRight, Award, Expand,
  Check, X, User, Undo2, AlertCircle, Trash2
} from 'lucide-react';
import { Project } from '../types';
import ProjectPresentation from './ProjectPresentation';
import ProjectContractTab from './ProjectContractTab';
import ProjectCalendar from './ProjectCalendar';
import ProjectArtifacts from './ProjectArtifacts';
import ProjectProposalIA from './ProjectProposalIA';
import ProjectScopeIA from './ProjectScopeIA';
import { MOCK_TEAM, MOCK_PARTNERS, STAGES } from '../constants';
import { MOCK_OCCURRENCES } from '../services/mockData';

interface Props {
  projects: Project[];
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;
}

const ProjectMasterView: React.FC<Props> = ({ projects, updateProject, deleteProject }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = (searchParams.get('tab') as any) || 'presentation';
  
  const project = projects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'presentation' | 'contract' | 'tarefas' | 'timeline' | 'calendar' | 'gallery' | 'artifacts' | 'proposal' | 'occurrences' | 'scope'>(initialTab);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingOccurrence, setEditingOccurrence] = useState<any | null>(null);
  const [occurrences, setOccurrences] = useState(MOCK_OCCURRENCES);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) setActiveTab(tabFromUrl as any);
  }, [location.search]);

  const handleAddPhotoLog = () => {
    if (!project) return;
    const newLogEntry = {
      id: `pl_new_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Diretor Guilherme',
      notes: 'Novo registro adicionado ao diário de obra a partir do sistema.',
      images: ['https://images.unsplash.com/photo-1620138600155-816995642a8b?auto=format&fit=crop&q=80&w=600']
    };
    const updatedProject = { ...project, photoLog: [newLogEntry, ...project.photoLog] };
    updateProject(updatedProject);
  };
  
  const handleToggleTask = (taskId: string) => {
    if (!project) return;
    const updatedTasks = project.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = project.tasks.length > 0 ? Math.round((completedCount / project.tasks.length) * 100) : project.progress;
    const updatedProject = { ...project, tasks: updatedTasks, progress };
    updateProject(updatedProject);
  };

  if (!project) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-serif text-stone-900 dark:text-white">Artesania não localizada</h2>
        <Link to="/app/projetos" className="text-gold font-bold uppercase tracking-widest text-[10px] hover:underline">Retornar ao Quadro</Link>
      </div>
    </div>
  );

  const currentStage = STAGES.find(s => s.id === project.status);
  
  const getNextStatusInfo = () => {
    const s = project.status;
    if (s === 'LEAD_FECHADO') return { id: 'AGUARDANDO_MEDICAO', label: 'Avançado: Aguardar Medição' };
    if (s === 'AGUARDANDO_MEDICAO') return { id: 'MEDICAO_CONCLUIDA', label: 'Concluir Medição Técnica' };
    if (s === 'MEDICAO_CONCLUIDA') return { id: 'PRODUCAO', label: 'Enviar p/ Produção' };
    if (s === 'PRODUCAO') return { id: 'INSTALACAO', label: 'Iniciar Instalação' };
    if (s === 'INSTALACAO') return { id: 'FINALIZADO', label: 'Finalizar Obra' };
    return null;
  };

  const nextStatusInfo = getNextStatusInfo();

  const handleAdvanceStatus = () => {
    if (nextStatusInfo) {
      updateProject({ ...project, status: nextStatusInfo.id as any });
    }
  };

  const contractData = project.contractData;
  const isPreExecutionDone = contractData ? (
    contractData.preExecutionStage?.siteCheckPerformed && 
    contractData.preExecutionStage?.templateReady &&
    contractData.preExecutionStage?.technicalConditionsMet?.plasterFinished &&
    contractData.preExecutionStage?.technicalConditionsMet?.plumbingInstalled &&
    contractData.preExecutionStage?.technicalConditionsMet?.electricalInstalled &&
    contractData.preExecutionStage?.technicalConditionsMet?.cabinetStructureReady
  ) : false;

  const canAdvance = () => {
    if (project.status === 'AGUARDANDO_MEDICAO') return isPreExecutionDone;
    return true;
  };
  
  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div>
      <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icon size={10} /> {label}</p>
      <p className="text-[10px] font-bold text-stone-700 dark:text-stone-300 mt-0.5 truncate">{value}</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden bg-ivory dark:bg-onyx transition-colors duration-500 print:bg-white print:h-auto">
      <AnimatePresence>
        {isTimelineModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ivory/90 dark:bg-onyx/90 backdrop-blur-xl flex flex-col p-4 sm:p-6 md:p-8"
          >
            <header className="flex items-center justify-between pb-6 shrink-0 max-w-4xl mx-auto w-full">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tighter">Jornada Completa</h2>
                <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">{project.clientName}</p>
              </div>
              <button onClick={() => setIsTimelineModalOpen(false)} className="p-3 bg-white dark:bg-white/5 rounded-full shadow-lg border border-stone-200 dark:border-white/10 hover:scale-110 transition-transform">
                <X size={20} className="text-stone-900 dark:text-white" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto custom-scroll">
              <div className="max-w-4xl mx-auto relative py-8">
                  <div className="absolute left-[31px] top-8 bottom-8 w-px bg-stone-200 dark:bg-white/10" />
                  <div className="space-y-4 md:space-y-6 relative">
                    {STAGES.map((stage, idx) => {
                      const currentStageIndex = STAGES.findIndex(s => s.id === project.status);
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const timelineEvent = project.timeline.find(t => t.id.startsWith(stage.id));
                      const eventDateStr = timelineEvent?.date ? new Date(timelineEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'A programar';
                      return (
                        <motion.div 
                          key={stage.id} 
                          className="flex items-start gap-6 md:gap-12 py-2 md:py-4 group"
                        >
                          <div className={`z-10 shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center border-4 border-ivory dark:border-onyx shadow-lg transition-all ${isCompleted ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-stone-900 dark:bg-gold text-white dark:text-black' : 'bg-stone-100 dark:bg-white/5 text-stone-400'}`}>
                            {isCompleted ? <Check size={32}/> : <span className="text-2xl font-serif font-bold italic">{idx + 1}</span>}
                          </div>
                          <div className="pt-1">
                            <h4 className={`text-4xl font-serif font-bold ${isCompleted || isCurrent ? 'text-stone-900 dark:text-white' : 'text-stone-300 dark:text-stone-700'}`}>{stage.label}</h4>
                            <p className={`text-base mt-2 leading-relaxed max-w-lg ${isCompleted || isCurrent ? 'text-stone-600 dark:text-stone-400' : 'text-stone-300 dark:text-stone-700'} italic`}>
                              {stage.description}
                            </p>
                             <p className={`mt-3 text-sm font-bold uppercase tracking-widest ${isCompleted || isCurrent ? 'text-gold' : 'text-stone-300 dark:text-stone-700'}`}>
                                {eventDateStr}
                             </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-0 px-6 md:px-10 mt-4 overflow-hidden">
        <div className="flex flex-col mb-4 gap-2">
            <div className="flex flex-wrap items-center gap-2">
               <h2 className="text-2xl font-serif font-bold text-stone-950 dark:text-white tracking-tight uppercase">{project.clientName}</h2>
               <span className="px-2 py-0.5 bg-stone-100 dark:bg-gold/10 text-stone-600 dark:text-gold rounded-full text-[8px] font-bold uppercase tracking-widest border border-stone-200 dark:border-gold/20">
                 {currentStage?.label}
               </span>
               {nextStatusInfo && (
                 <button 
                   onClick={handleAdvanceStatus}
                   disabled={!canAdvance()}
                   title={!canAdvance() ? "Preencha o Checklist de Pré-Execução no Protocolo para liberar" : ""}
                   className={`md:ml-4 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm ${
                     canAdvance() ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' : 'bg-stone-200 dark:bg-white/10 text-stone-400 cursor-not-allowed border border-stone-200 dark:border-white/5'
                   }`}
                 >
                   <CheckCircle2 size={14} /> {nextStatusInfo.label}
                 </button>
               )}
               <Link 
                 to={`/client/${project.id}`}
                 className="px-4 py-2 bg-stone-950 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-md flex items-center gap-2"
               >
                 <Eye size={14} /> Área do Cliente
               </Link>
               <button 
                 onClick={() => setIsDeleteModalOpen(true)}
                 className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
               >
                 <Trash2 size={14} /> Excluir
               </button>
            </div>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em]">
              {project.id} • Protocolo Técnico
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 shrink-0 print:grid-cols-2">
           <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
              <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Target size={10} className="text-gold" /> Progresso
              </p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-xl font-serif font-bold text-stone-950 dark:text-white">{project.progress}%</span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Ativo</span>
              </div>
              <div className="h-1 bg-stone-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} className="h-full gold-bg" />
              </div>
           </div>
           <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-sm">
              <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <DollarSign size={10} className="text-stone-400" /> Valor
              </p>
              <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white">R$ {(project.value/1000).toFixed(1)}k</h3>
              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-1">{project.paymentMethod}</p>
           </div>
           <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-stone-200 dark:border-white/10 shadow-sm">
              <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Calendar size={10} className="text-gold" /> Entrega
              </p>
              <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white">{project.estimatedDelivery}</h3>
              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-1">Finalização</p>
           </div>
           <div className="bg-stone-950 dark:bg-white/5 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden flex items-center gap-3">
              <img src={MOCK_TEAM.find(t => t.name === project.responsible)?.avatar} className="w-8 h-8 rounded-lg border border-white/10" />
              <div>
                <h3 className="text-[11px] font-bold tracking-tight">{project.responsible}</h3>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-50">Artesão Líder</p>
              </div>
           </div>
        </div>

        <div className="flex gap-6 border-b border-stone-200 dark:border-white/5 mb-4 overflow-x-auto no-scrollbar shrink-0 print:hidden">
          {[
            { id: 'presentation', label: 'Resumo', icon: Eye },
            { id: 'contract', label: 'Contrato & Protocolos', icon: FileText },
            { id: 'tarefas', label: 'Checklist', icon: CheckCircle2 },
            { id: 'timeline', label: 'Fluxo', icon: Clock },
            { id: 'calendar', label: 'Agenda', icon: Calendar },
            { id: 'gallery', label: 'Diário', icon: Camera },
            { id: 'artifacts', label: 'Documentos', icon: Layers },
            { id: 'occurrences', label: 'Ocorrências', icon: AlertCircle },
            { id: 'scope', label: 'Escopo IA', icon: Sparkles },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-gold' : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}>
              <tab.icon size={12} /> {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTabMaster" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-gold" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden pb-4">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="h-full">
              {activeTab === 'presentation' && <ProjectPresentation project={project} />}
              
              {activeTab === 'contract' && <ProjectContractTab project={project} updateProject={updateProject} />}
              
              {activeTab === 'tarefas' && (
                <div className="h-full overflow-y-auto custom-scroll space-y-6 py-2">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">Tarefas Pendentes</h4>
                        <div className="space-y-3">
                            {project.tasks.filter(t => !t.completed).map(task => {
                                const responsible = MOCK_TEAM.find(m => m.id === task.assignedToId) || MOCK_TEAM.find(m => m.name === project.responsible);
                                const phase = STAGES.find(s => s.id === project.status);
                                return (
                                    <div key={task.id} className={`p-4 border rounded-xl flex items-center gap-4 bg-white/50 dark:bg-white/5 border-stone-200 dark:border-white/10`}>
                                        <div className="flex-1 space-y-3">
                                           <p className="text-sm font-serif font-bold text-stone-900 dark:text-white truncate leading-tight">{task.name}</p>
                                           <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                                              <InfoItem icon={User} label="Responsável" value={responsible?.name || 'N/A'} />
                                              <InfoItem icon={Calendar} label="Data" value={task.scheduledDate || 'A definir'} />
                                              <InfoItem icon={Layers} label="Fase" value={phase?.label || 'N/A'} />
                                           </div>
                                        </div>
                                        <button onClick={() => handleToggleTask(task.id)} className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-colors bg-white dark:bg-onyx border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20`}>OK</button>
                                    </div>
                                );
                            })}
                             {project.tasks.filter(t => !t.completed).length === 0 && (
                                <div className="text-center py-10 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-2xl">
                                    <Check size={32} className="mx-auto text-emerald-500" />
                                    <p className="mt-4 text-sm font-serif text-stone-500">Nenhuma tarefa pendente.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">Tarefas Concluídas</h4>
                        <div className="space-y-3">
                            {project.tasks.filter(t => t.completed).map(task => {
                                const responsible = MOCK_TEAM.find(m => m.id === task.assignedToId) || MOCK_TEAM.find(m => m.name === project.responsible);
                                return (
                                    <div key={task.id} className={`p-4 border rounded-xl flex items-center gap-4 bg-stone-50/30 dark:bg-white/[0.02] border-stone-100 dark:border-white/5 opacity-60`}>
                                         <div className="flex-1 space-y-3">
                                           <p className="text-sm font-serif font-bold text-stone-500 dark:text-stone-600 truncate leading-tight line-through">{task.name}</p>
                                           <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                                              <InfoItem icon={User} label="Responsável" value={responsible?.name || 'N/A'} />
                                              <InfoItem icon={Calendar} label="Data" value={task.scheduledDate || 'A definir'} />
                                              <InfoItem icon={Layers} label="Fase" value={"Concluída"} />
                                           </div>
                                        </div>
                                        <button onClick={() => handleToggleTask(task.id)} className="p-2 text-stone-400 rounded-full hover:bg-stone-200 dark:hover:bg-white/10"><Undo2 size={14}/></button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="h-full flex flex-col overflow-hidden bg-white/30 dark:bg-white/5 rounded-t-[2rem]">
                  <div className="px-6 py-3 border-b border-stone-200 dark:border-white/5 flex justify-between items-center shrink-0">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Fluxo de Trabalho Detalhado</h4>
                    <button 
                      onClick={() => setIsTimelineModalOpen(true)} 
                      className="flex items-center gap-2 px-4 py-2 bg-stone-950 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-md"
                    >
                      <Expand size={12} />
                      Ver Jornada Completa
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scroll">
                    <div className="max-w-3xl mx-auto py-8 px-4 relative">
                      <div className="absolute left-[31px] top-8 bottom-8 w-px bg-stone-200 dark:bg-white/10" />
                      <div className="space-y-4 md:space-y-6 relative">
                        {STAGES.map((stage, idx) => {
                          const currentStageIndex = STAGES.findIndex(s => s.id === project.status);
                          const isCompleted = idx < currentStageIndex;
                          const isCurrent = idx === currentStageIndex;
                          const timelineEvent = project.timeline.find(t => t.id.startsWith(stage.id));
                          const eventDateStr = timelineEvent?.date ? new Date(timelineEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'A programar';
                          return (
                            <div key={stage.id} className="flex items-start gap-12 py-4 group">
                              <div className={`z-10 shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center border-4 border-ivory dark:border-onyx shadow-lg transition-all ${isCompleted ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-stone-900 dark:bg-gold text-white dark:text-black' : 'bg-stone-100 dark:bg-white/5 text-stone-400'}`}>
                                {isCompleted ? <Check size={32}/> : <span className="text-2xl font-serif font-bold italic">{idx + 1}</span>}
                              </div>
                              <div className="pt-1">
                                <h4 className={`text-2xl font-serif font-bold ${isCompleted || isCurrent ? 'text-stone-900 dark:text-white' : 'text-stone-300 dark:text-stone-700'}`}>{stage.label}</h4>
                                <p className={`text-sm mt-2 leading-relaxed max-w-lg ${isCompleted || isCurrent ? 'text-stone-600 dark:text-stone-400' : 'text-stone-300 dark:text-stone-700'} italic`}>
                                  {stage.description}
                                </p>
                                <p className={`mt-3 text-xs font-bold uppercase tracking-widest ${isCompleted || isCurrent ? 'text-gold' : 'text-stone-300 dark:text-stone-700'}`}>
                                    {eventDateStr}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && <div className="h-full overflow-y-auto custom-scroll py-2"><ProjectCalendar project={project} /></div>}
              
              {activeTab === 'artifacts' && <div className="h-full overflow-y-auto custom-scroll py-2"><ProjectArtifacts project={project} updateProject={updateProject} /></div>}

              {activeTab === 'proposal' && <div className="h-full overflow-y-auto custom-scroll py-2"><ProjectProposalIA project={project} /></div>}

              {activeTab === 'scope' && <ProjectScopeIA project={project} updateProject={updateProject} />}

              {activeTab === 'occurrences' && (
                <div className="h-full overflow-y-auto custom-scroll py-2 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Histórico de Ocorrências</h4>
                    <button className="px-4 py-2 bg-stone-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-md flex items-center gap-2">
                      <AlertCircle size={12} /> Registrar Nova
                    </button>
                  </div>
                  <div className="space-y-4">
                    {occurrences.filter(o => o.projectId === project.id).length > 0 ? (
                      occurrences.filter(o => o.projectId === project.id).map(occurrence => (
                        <div 
                          key={occurrence.id} 
                          onClick={() => setEditingOccurrence(occurrence)}
                          className="p-5 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl shadow-sm hover:border-gold/30 transition-all group cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                occurrence.type === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-600' :
                                occurrence.type === 'NEGATIVE' ? 'bg-rose-500/10 text-rose-600' :
                                'bg-amber-500/10 text-amber-600'
                              }`}>
                                {occurrence.type === 'POSITIVE' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                              </div>
                              <div>
                                <h5 className="text-sm font-serif font-bold text-stone-900 dark:text-white">{occurrence.title}</h5>
                                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">{new Date(occurrence.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                              occurrence.type === 'POSITIVE' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20' :
                              occurrence.type === 'NEGATIVE' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-100 dark:border-rose-500/20' :
                              'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100 dark:border-amber-500/20'
                            }`}>
                              {occurrence.type === 'POSITIVE' ? 'Positiva' : occurrence.type === 'NEGATIVE' ? 'Negativa' : 'Neutra'}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic mb-4 leading-relaxed">"{occurrence.description}"</p>
                          <div className="flex flex-wrap gap-4 pt-4 border-t border-stone-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                              <User size={12} className="text-stone-400" />
                              <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Envolvidos: {occurrence.involvedTeamNames?.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={12} className="text-stone-400" />
                              <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">{occurrence.location}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-stone-200 dark:border-white/10 rounded-2xl">
                        <AlertCircle size={32} className="mx-auto text-stone-300 mb-4" />
                        <p className="text-sm font-serif text-stone-500">Nenhuma ocorrência registrada para este projeto.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && <div className="h-full overflow-y-auto custom-scroll space-y-6 py-2">
                   <div className="flex justify-end">
                      <button 
                        onClick={handleAddPhotoLog}
                        className="px-5 py-2.5 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-stone-600 dark:text-gold flex items-center gap-2 hover:border-gold/30 transition-all shadow-sm"
                      >
                        <Camera size={14} /> Adicionar Registro Fotográfico
                      </button>
                   </div>
                   <div className="grid grid-cols-1 gap-6">
                     {project.photoLog.map(entry => (
                       <div key={entry.id} className="p-6 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl">
                          <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-stone-50 dark:bg-white/5 flex items-center justify-center text-stone-400 border border-stone-200 dark:border-white/10"><FileText size={18} /></div>
                                <div>
                                  <p className="text-[8px] text-gold font-bold uppercase tracking-[0.2em] mb-0.5">{new Date(entry.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                                  <h4 className="text-sm font-serif font-bold text-stone-950 dark:text-white">{entry.author}</h4>
                                </div>
                             </div>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-300 font-serif italic mb-4">"{entry.notes}"</p>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                             {entry.images.map((img, idx) => (
                               <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-stone-200 dark:border-onyx shadow-sm relative group cursor-pointer">
                                  <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                               </div>
                             ))}
                          </div>
                       </div>
                     ))}
                   </div>
                </div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Occurrence Modal */}
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-onyx rounded-[3rem] p-8 border border-stone-200 dark:border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight mb-2">Mover para Lixeira?</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
                Este projeto e todos os seus processos serão movidos para a lixeira. Você poderá restaurá-lo em até 30 dias.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    deleteProject(project.id);
                    setIsDeleteModalOpen(false);
                    navigate('/app/projetos');
                  }}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingOccurrence && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingOccurrence(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Editar Ocorrência</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Atualize os detalhes do evento</p>
                  </div>
                  <button onClick={() => setEditingOccurrence(null)} className="p-2 text-stone-400 hover:text-stone-950 dark:hover:text-white transition-all">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Título</label>
                  <input 
                    type="text" 
                    value={editingOccurrence.title}
                    onChange={(e) => setEditingOccurrence({ ...editingOccurrence, title: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Descrição</label>
                  <textarea 
                    value={editingOccurrence.description}
                    onChange={(e) => setEditingOccurrence({ ...editingOccurrence, description: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Tipo</label>
                    <select 
                      value={editingOccurrence.type}
                      onChange={(e) => setEditingOccurrence({ ...editingOccurrence, type: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    >
                      <option value="POSITIVE">Positiva</option>
                      <option value="NEGATIVE">Negativa</option>
                      <option value="NEUTRAL">Neutra</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Data</label>
                    <input 
                      type="date" 
                      value={editingOccurrence.date}
                      onChange={(e) => setEditingOccurrence({ ...editingOccurrence, date: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setEditingOccurrence(null)}
                    className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      setOccurrences(occurrences.map(o => o.id === editingOccurrence.id ? editingOccurrence : o));
                      setEditingOccurrence(null);
                    }}
                    className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectMasterView;
