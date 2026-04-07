
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Clock, ChevronRight, ChevronLeft, Calendar, X, Layers, Briefcase, User, CheckCircle, Sparkles, Trash2 } from 'lucide-react';
import { STAGES, MOCK_TEAM, MOCK_USER } from '../constants';
import { Project, ProjectStatus, ProjectTask } from '../types';
import ProjectDetailsModal from './ProjectDetailsModal';
import SmartProjectModal from './SmartProjectModal';

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div>
    <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icon size={10} /> {label}</p>
    <p className="text-[10px] font-bold text-stone-700 dark:text-stone-300 mt-0.5 truncate">{value}</p>
  </div>
);

const MasterScheduleModal = ({ 
  isOpen, 
  onClose, 
  projects, 
  onSelectProject 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  projects: Project[], 
  onSelectProject: (p: Project) => void 
}) => {
  if (!isOpen) return null;

  const [currentDate, setCurrentDate] = useState(new Date());

  const eventsByDate = useMemo(() => {
    const map = new Map<string, { task: ProjectTask, project: Project }[]>();
    projects.forEach(p => {
      p.tasks.forEach(t => {
        if (!t.completed && t.scheduledDate) {
          if (!map.has(t.scheduledDate)) {
            map.set(t.scheduledDate, []);
          }
          map.get(t.scheduledDate)!.push({ task: t, project: p });
        }
      });
    });
    return map;
  }, [projects]);
  
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  const calendarDays = Array.from({ length: firstDayOfMonth }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const getTaskColor = (status: ProjectStatus) => {
     const stageIndex = STAGES.findIndex(s => s.id === status);
     const colors = ['bg-sky-500/20 text-sky-800', 'bg-cyan-500/20 text-cyan-800', 'bg-teal-500/20 text-teal-800', 'bg-emerald-500/20 text-emerald-800', 'bg-lime-500/20 text-lime-800', 'bg-yellow-500/20 text-yellow-800', 'bg-amber-500/20 text-amber-800', 'bg-orange-500/20 text-orange-800', 'bg-red-500/20 text-red-800', 'bg-stone-500/20 text-stone-800'];
     return colors[stageIndex] || 'bg-stone-500/20 text-stone-800';
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-6xl h-[90vh] rounded-[3rem] border border-stone-200 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-white/5 flex items-center justify-center text-gold border border-stone-200 dark:border-white/10 shrink-0">
                <Calendar size={18} />
             </div>
             <div>
              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase">Agenda Mestra</h3>
              <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Visão Calendário da Produção</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full"><ChevronLeft size={20}/></button>
            <span className="text-lg font-serif capitalize w-48 text-center text-stone-900 dark:text-white">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full"><ChevronRight size={20}/></button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-hidden grid grid-rows-[auto,1fr]">
          <div className="grid grid-cols-7 gap-px bg-stone-200 dark:bg-white/10 shrink-0">
             {['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'].map(day => (
                  <div key={day} className="bg-stone-50 dark:bg-onyx p-2 text-center text-[8px] font-bold text-stone-400 uppercase tracking-widest">{day}</div>
             ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 gap-px bg-stone-200 dark:bg-white/10">
            {calendarDays.map((day, i) => {
                const dayStr = day ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
                const dayEvents = day ? eventsByDate.get(dayStr) : [];
                const isToday = day && new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                
                return (
                  <div key={i} className={`bg-white dark:bg-onyx p-2 space-y-1.5 flex flex-col overflow-hidden relative ${day ? '' : 'bg-stone-50/50 dark:bg-white/5'}`}>
                    {day && <span className={`text-xs font-serif ${isToday ? 'text-gold font-bold' : 'text-stone-400 dark:text-stone-600'}`}>{day}</span>}
                    <div className="overflow-y-auto space-y-1.5 custom-scroll flex-1">
                      {dayEvents?.map(({ task, project }, idx) => (
                        <div key={idx} onClick={() => onSelectProject(project)} className={`p-1.5 rounded-lg cursor-pointer hover:scale-105 transition-transform ${getTaskColor(project.status)}`}>
                          <p className="text-[8px] font-bold truncate leading-tight">{task.name}</p>
                          <p className="text-[7px] font-bold opacity-70 truncate">{project.clientName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};


interface Props {
  projects: Project[];
  updateProject: (p: Project) => void;
  addProject: (p: Project) => void;
}

const KanbanBoard: React.FC<Props> = ({ projects, updateProject, addProject }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStages, setExpandedStages] = useState<Set<ProjectStatus>>(new Set());
  const [isMasterScheduleOpen, setIsMasterScheduleOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent, projectId: string, currentStatus: string) => {
    e.dataTransfer.setData('projectId', projectId);
    e.dataTransfer.setData('currentStatus', currentStatus);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDropToStage = (e: React.DragEvent, newStatus: ProjectStatus) => {
    e.preventDefault();
    setIsDragging(false);
    const projectId = e.dataTransfer.getData('projectId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    if (!projectId || currentStatus === newStatus) return;

    const projectToUpdate = projects.find(p => p.id === projectId);
    if (projectToUpdate) {
      updateProject({ ...projectToUpdate, status: newStatus });
    }
  };

  const handleTrashDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const projectId = e.dataTransfer.getData('projectId');
    if (!projectId) return;

    const projectToUpdate = projects.find(p => p.id === projectId);
    if (projectToUpdate) {
      updateProject({ ...projectToUpdate, deletedAt: new Date().toISOString() });
    }
  };

  const toggleStage = (stageId: ProjectStatus) => {
    const next = new Set(expandedStages);
    if (next.has(stageId)) next.delete(stageId);
    else next.add(stageId);
    setExpandedStages(next);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsMasterScheduleOpen(false);
  };

  const activeProjects = useMemo(() => projects.filter(p => !p.deletedAt), [projects]);

  const filteredProjects = activeProjects.filter(p => 
    p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.projectType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      {/* Welcome Section */}
      <div className="bg-stone-950 dark:bg-white/5 text-white p-6 rounded-[2rem] relative overflow-hidden shrink-0 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gold">Gestão Operacional</span>
            </div>
            <h3 className="text-2xl font-serif leading-tight">
              Olá, {MOCK_USER.name.split(' ')[1] || MOCK_USER.name}
            </h3>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[7px] font-bold uppercase tracking-widest text-stone-500 mb-0.5">Obras em Produção</p>
              <p className="text-xl font-serif text-gold">{projects.filter(p => p.status !== 'LEAD' && p.status !== 'FINALIZADO').length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <div className="bg-white dark:bg-onyx p-4 px-6 rounded-[2rem] border border-stone-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm shrink-0">
        <div className="space-y-0.5">
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Plano de Produção</h2>
          <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.3em]">Gestão Operacional de Atelier</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
           <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={12} />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Localizar obra..." className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-[10px] focus:outline-none focus:ring-1 focus:ring-gold" />
           </div>
           
           <button onClick={() => setIsMasterScheduleOpen(true)} className="flex-1 sm:flex-none justify-center px-5 py-2 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-stone-600 dark:text-gold flex items-center gap-2 hover:bg-white transition-all"><Calendar size={14} /> Agenda</button>
           <button onClick={() => setIsSmartModalOpen(true)} className="flex-1 sm:flex-none justify-center gold-bg px-5 py-2 text-black rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14} /> Novo</button>
        </div>
      </div>

      <div className="flex-1 flex gap-3 pb-2 overflow-x-auto no-scrollbar min-h-[600px] md:min-h-0 px-1">
        {STAGES.map((stage, idx) => {
          const isExpanded = expandedStages.has(stage.id);
          const stageProjects = filteredProjects.filter(p => p.status === stage.id);
          return (
            <motion.div 
              key={stage.id} 
              layout 
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={(e) => handleDropToStage(e, stage.id)}
              animate={{ width: isExpanded ? 320 : 60 }} 
              transition={{ type: "spring", stiffness: 300, damping: 30 }} 
              className={`relative group flex flex-col h-full rounded-[2rem] border transition-colors duration-500 overflow-hidden shrink-0 ${isExpanded ? 'bg-stone-50/50 dark:bg-stone-900/30 border-stone-200 dark:border-white/10' : 'bg-white dark:bg-onyx border-stone-100 dark:border-white/5 hover:border-gold/30'} ${isDragging ? 'border-dashed border-stone-300 dark:border-white/20' : ''}`}
            >
              <div onClick={() => toggleStage(stage.id)} className={`p-4 cursor-pointer flex transition-all duration-500 ${isExpanded ? 'flex-row items-center justify-between border-b border-stone-200 dark:border-white/5' : 'flex-col items-center h-full py-8'}`}>
                {isExpanded ? (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-serif font-bold text-gold shrink-0 bg-gold/10 w-6 h-6 rounded flex items-center justify-center">{idx + 1}</span>
                      <h3 className="text-[11px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest truncate">{stage.label}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 bg-stone-200 dark:bg-white/10 text-stone-500 dark:text-stone-300 rounded-full text-[10px] font-bold">{stageProjects.length}</span>
                       <ChevronLeft size={14} className="text-stone-300" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-between h-full w-full">
                      <span className="text-[10px] font-serif font-bold text-gold">{idx + 1}</span>
                      <h3 className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em] leading-none [writing-mode:vertical-lr] rotate-180 whitespace-nowrap mb-6">{stage.label}</h3>
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-stone-100 dark:bg-white/10 text-stone-500 dark:text-stone-300 rounded-full text-[10px] font-bold">{stageProjects.length}</div>
                      <ChevronRight size={14} className="text-stone-200" />
                    </div>
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-60 p-5 bg-stone-950 text-white rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none border border-stone-800">
                      <h4 className="font-bold text-sm text-gold mb-2">{stage.label}</h4>
                      <p className="text-xs text-stone-300 font-serif italic leading-relaxed">"{stage.description}"</p>
                    </div>
                  </>
                )}
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 custom-scroll space-y-2">
                    {stageProjects.map(project => (
                      <div 
                        key={project.id} 
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, project.id, stage.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedProject(project)} 
                        className="group bg-white dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl p-3 hover:border-gold/50 cursor-grab active:cursor-grabbing shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md mb-2"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img src={project.clientAvatar} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-serif font-bold text-stone-950 dark:text-white truncate group-hover:text-gold transition-colors">{project.clientName}</h4>
                            <p className="text-[7px] text-stone-400 font-bold uppercase tracking-widest">{project.id}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 italic truncate mb-3">{project.projectType}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-50 dark:border-white/5">
                           <div className="flex items-center gap-1">
                             <div className="w-1 h-1 rounded-full bg-gold" />
                             <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest italic">Produção</span>
                           </div>
                           <div className="flex items-center gap-1 text-[8px] font-bold text-stone-500 uppercase">
                             <Clock size={8} className="text-gold" />
                             <span>{project.estimatedDelivery}</span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isMasterScheduleOpen && (
          <MasterScheduleModal 
            isOpen={isMasterScheduleOpen} 
            onClose={() => setIsMasterScheduleOpen(false)} 
            projects={activeProjects} 
            onSelectProject={handleSelectProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDragging && (
          <motion.div 
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: 100, opacity: 0 }}
             onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
             onDrop={handleTrashDrop}
             className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-500/90 text-white rounded-[2rem] px-8 py-5 flex items-center gap-4 z-[300] border-2 border-dashed border-red-300 shadow-2xl backdrop-blur-md"
          >
            <div className="bg-white/20 p-3 rounded-full">
               <Trash2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase">Apagar Obra (Lixeira)</h3>
              <p className="text-[10px] text-white/80 font-bold tracking-widest mt-0.5">Arraste a obra aqui para marcar como deletada</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} updateProject={updateProject} />}
      <SmartProjectModal isOpen={isSmartModalOpen} onClose={() => setIsSmartModalOpen(false)} onProjectCreated={(p) => { addProject(p); setSelectedProject(p); }} />
    </div>
  );
};

export default KanbanBoard;
