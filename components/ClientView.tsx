
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Info, FileText, Camera, MessageSquare, 
  Download, MapPin, Sparkles, Phone, Award, Check, 
  FileCheck, ShieldCheck, Calendar, ChevronRight, 
  Expand, X, LayoutDashboard, ClipboardList, 
  History, CreditCard, Image as ImageIcon, Menu,
  User, Clock, Package, Briefcase, PanelLeft, PanelLeftClose
} from 'lucide-react';
import { Project } from '../types';
import { STAGES } from '../constants';
import FinancialTimeline from './FinancialTimeline';

const ClientView: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'sumario' | 'timeline' | 'gallery' | 'scope' | 'docs' | 'agenda' | 'financeiro' | 'relatorios'>('sumario');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date('2026-01-15'));

  const handleLogout = () => {
    localStorage.removeItem('bm-session');
    navigate('/');
  };

  const handleConcierge = () => {
    const text = encodeURIComponent(`Olá, sou ${project?.clientName}. Gostaria de falar sobre o projeto REF-${project?.id}.`);
    window.open(`https://wa.me/5511980000000?text=${text}`, '_blank');
  };

  const eventsByDate = useMemo(() => {
    if (!project) return {};
    const events: { [key: string]: any[] } = {};
    const allItems = [...(project.timeline || []), ...(project.tasks || [])];
    
    allItems.forEach(item => {
      const date = (item as any).date || (item as any).scheduledDate;
      if (date) {
        if (!events[date]) events[date] = [];
        events[date].push({
          label: (item as any).label || (item as any).name,
          type: (item as any).week ? 'timeline' : 'task'
        });
      }
    });
    return events;
  }, [project]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentDate]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center space-y-6">
          <h2 className="text-xl font-serif text-stone-900">Artesania não localizada</h2>
          <Link to="/" className="inline-block px-8 py-3 bg-stone-950 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase">Retornar ao Atelier</Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex(s => s.id === project.status);

  const NavItem = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left group ${
        activeTab === id 
          ? 'bg-stone-950 text-white shadow-lg shadow-stone-950/20' 
          : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
      } ${isCollapsed ? 'justify-center px-0' : ''}`}
    >
      <Icon size={18} className="shrink-0" />
      {!isCollapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-ivory overflow-hidden selection:bg-stone-200">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-[100] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 256,
          x: isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : -256
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed inset-y-0 left-0 z-[110] bg-white border-r border-stone-200 flex flex-col shrink-0
          md:relative md:translate-x-0 overflow-hidden
        `}
      >
        <div className="p-6 flex flex-col h-full">
          <div className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
              <img src="https://ui-avatars.com/api/?name=BM&background=000000&color=ffffff&rounded=true&size=256&bold=true" alt="Logo" className="w-10 h-10 rounded-full shrink-0" />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <h1 className="text-[10px] font-bold text-stone-950 uppercase tracking-tight leading-tight">Braga Marmoraria</h1>
                  <span className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">Portal do Cliente</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-1.5 text-stone-400 hover:text-stone-950 transition-all"
            >
              {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <NavItem id="sumario" label="Sumário" icon={LayoutDashboard} />
            <NavItem id="timeline" label="Jornada" icon={ClipboardList} />
            <NavItem id="relatorios" label="Histórico" icon={History} />
            <NavItem id="agenda" label="Agenda" icon={Calendar} />
            <NavItem id="financeiro" label="Financeiro" icon={CreditCard} />
            <NavItem id="scope" label="Executivo" icon={FileCheck} />
            <NavItem id="gallery" label="Mídia" icon={ImageIcon} />
            <NavItem id="docs" label="Acervo" icon={FileText} />
          </nav>

          <div className="mt-auto pt-6 border-t border-stone-100 space-y-2">
            <button onClick={handleConcierge} className={`w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-stone-900 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
              <MessageSquare size={18} />
              {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">Concierge</span>}
            </button>
            <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-red-500 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
              <ChevronLeft size={18} />
              {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">Sair</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-stone-600 hover:bg-stone-50 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-[11px] font-bold text-stone-950 uppercase tracking-[0.2em]">
              {activeTab === 'sumario' && 'Sumário Executivo'}
              {activeTab === 'timeline' && 'Jornada da Obra'}
              {activeTab === 'relatorios' && 'Relatórios & Histórico'}
              {activeTab === 'agenda' && 'Agenda Técnica'}
              {activeTab === 'financeiro' && 'Financeiro'}
              {activeTab === 'scope' && 'Projeto Executivo'}
              {activeTab === 'gallery' && 'Galeria de Mídia'}
              {activeTab === 'docs' && 'Acervo Digital'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-bold text-stone-950 uppercase">{project.clientName}</span>
              <span className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">{project.id}</span>
            </div>
            <img src={project.clientAvatar} alt="Avatar" className="w-8 h-8 rounded-full border border-stone-200" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'sumario' && (
                <div className="max-w-5xl mx-auto space-y-12">
                  {/* Elegant Greeting Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 py-8"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">Artesanio Experience • Of and Out</p>
                    <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-none">
                      Olá, <span className="text-stone-400 italic">{project.clientName.split(' ')[0]}.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-serif text-stone-500 italic max-w-2xl mx-auto leading-relaxed">
                      "{project.concept}"
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-stone-950 text-white p-8 rounded-[2.5rem] relative overflow-hidden">
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                          <Sparkles size={20} className="text-gold" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Visão Geral do Projeto</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-serif leading-tight">
                          {project.projectType}
                        </h3>
                        <p className="text-stone-400 text-sm font-serif italic max-w-lg">
                          "{project.concept}"
                        </p>
                        <div className="pt-4 flex flex-wrap gap-6">
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-stone-500 mb-1">Status Atual</p>
                            <p className="text-sm font-serif">{STAGES.find(s => s.id === project.status)?.label}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-stone-500 mb-1">Previsão de Entrega</p>
                            <p className="text-sm font-serif text-gold underline decoration-gold/30">{project.estimatedDelivery}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-widest text-stone-500 mb-1">Progresso</p>
                            <p className="text-sm font-serif">{project.progress}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                    </div>

                    <div className="bg-white border border-stone-200 p-8 rounded-[2.5rem] flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-950">
                          <User size={24} />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400 mb-1">Responsável Técnico</p>
                          <h4 className="text-xl font-serif text-stone-950">{project.responsible}</h4>
                        </div>
                      </div>
                      <button onClick={handleConcierge} className="mt-6 w-full py-3 bg-stone-50 text-stone-950 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-stone-100 transition-all border border-stone-200">
                        Falar com Responsável
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 text-stone-400">
                        <Package size={18} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Materiais</span>
                      </div>
                      <div className="space-y-2">
                        {project.materials.length > 0 ? project.materials.map((m, i) => (
                          <p key={i} className="text-xs font-serif text-stone-800">{m.name}</p>
                        )) : <p className="text-xs text-stone-400 italic">Em definição</p>}
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 text-stone-400">
                        <CreditCard size={18} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Investimento</span>
                      </div>
                      <p className="text-lg font-serif text-stone-950">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.value)}
                      </p>
                      <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-1">{project.paymentMethod}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 text-stone-400">
                        <Clock size={18} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Tempo de Obra</span>
                      </div>
                      <p className="text-lg font-serif text-stone-950">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : '---'}
                      </p>
                      <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-1">Data de Início</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 text-stone-400">
                        <ShieldCheck size={18} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Garantia</span>
                      </div>
                      <p className="text-lg font-serif text-stone-950">Vitalícia</p>
                      <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-1">Padrão Braga</p>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 border-b border-stone-100 flex items-center justify-between">
                      <h4 className="text-xl font-serif font-bold text-stone-950 uppercase">Escopo Resumido</h4>
                      <FileCheck size={20} className="text-stone-300" />
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {project.detailedScope?.slice(0, 2).map((section, idx) => (
                        <div key={idx} className="space-y-4">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-gold">{section.title}</h5>
                          <ul className="space-y-2">
                            {section.items.map((item: string, i: number) => (
                              <li key={i} className="text-xs text-stone-600 italic flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 bg-stone-300 rounded-full shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="max-w-4xl mx-auto relative py-8">
                  <div className="absolute left-[23px] md:left-[31px] top-0 bottom-0 w-px bg-stone-200" />
                  <div className="space-y-8 relative">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const timelineEvent = project.timeline.find(t => t.id.startsWith(stage.id));
                      const eventDateStr = timelineEvent?.date ? new Date(timelineEvent.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'A programar';
                      
                      return (
                        <motion.div 
                          key={stage.id} 
                          className="flex items-start gap-6 md:gap-10 py-2 group"
                        >
                          <div className={`z-10 shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-4 border-ivory shadow-lg transition-all ${isCompleted ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-stone-950 text-white scale-110' : 'bg-stone-100 text-stone-400'}`}>
                            {isCompleted ? <Check size={24}/> : <span className="text-lg font-serif font-bold italic">{idx + 1}</span>}
                          </div>
                          <div className="pt-1">
                            <h4 className={`text-xl md:text-2xl font-serif font-bold ${isCompleted || isCurrent ? 'text-stone-950' : 'text-stone-300'}`}>{stage.label}</h4>
                            <p className={`text-xs md:text-sm mt-1 leading-relaxed max-w-lg ${isCompleted || isCurrent ? 'text-stone-500' : 'text-stone-300'} italic`}>
                              {stage.description}
                            </p>
                            <p className={`mt-2 text-[9px] font-bold uppercase tracking-widest ${isCompleted || isCurrent ? 'text-gold' : 'text-stone-300'}`}>
                              {eventDateStr}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'relatorios' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-serif font-bold text-stone-950 uppercase">Histórico de Atividades</h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-full text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                      <Clock size={12} /> Atualizado em Tempo Real
                    </div>
                  </div>

                  <div className="space-y-6">
                    {project.photoLog.length > 0 ? project.photoLog.map((log, i) => (
                      <div key={log.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-50 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-stone-50 rounded-full flex items-center justify-center text-stone-400">
                              <Camera size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-serif text-stone-950">Relatório de Visita Técnica</p>
                              <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">{log.author}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-serif text-stone-950">{new Date(log.date).toLocaleDateString('pt-BR')}</p>
                            <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">09:45 AM</p>
                          </div>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed italic">"{log.notes}"</p>
                        {log.images && log.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            {log.images.map((img: string, idx: number) => (
                              <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-stone-100">
                                <img src={img} alt="Log" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-20 opacity-40">
                        <History size={48} className="mx-auto mb-4 text-stone-400" />
                        <p className="font-serif text-xl text-stone-600">Nenhuma atividade registrada ainda.</p>
                      </div>
                    )}

                    {/* Simulated History Entries */}
                    <div className="bg-stone-50 p-6 rounded-3xl border border-dashed border-stone-200 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                        <div>
                          <p className="text-xs font-serif text-stone-950">Contrato assinado digitalmente</p>
                          <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-1">15/01/2026 • 14:20 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                        <div>
                          <p className="text-xs font-serif text-stone-950">Projeto executivo enviado para aprovação</p>
                          <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-1">14/01/2026 • 10:15 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'agenda' && (
                <div className="max-w-5xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h3 className="text-2xl font-serif font-bold text-stone-950 uppercase">Agenda Técnica</h3>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="p-2 hover:bg-stone-100 rounded-full"><ChevronLeft size={20}/></button>
                      <span className="text-base font-serif capitalize w-32 text-center">{currentDate.toLocaleString('pt-BR', { month: 'long' })} {currentDate.getFullYear()}</span>
                      <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="p-2 hover:bg-stone-100 rounded-full"><ChevronRight size={20}/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
                    {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
                      <div key={day} className="bg-stone-50 p-2 text-center text-[8px] font-bold text-stone-400 uppercase tracking-widest">{day}</div>
                    ))}
                    {calendarDays.map((day, i) => {
                      const dayStr = day ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` : '';
                      const dayEvents = day ? eventsByDate[dayStr] : [];
                      return (
                        <div key={i} className={`min-h-[70px] md:min-h-[100px] bg-white p-2 space-y-1 ${day ? '' : 'bg-stone-50/50'}`}>
                          {day && <span className="text-[10px] font-serif text-stone-400">{day}</span>}
                          {dayEvents?.map((event: any, idx: number) => (
                            <div key={idx} className={`p-1 rounded-md text-[8px] ${event.type === 'timeline' ? 'bg-gold/10 text-gold-900' : 'bg-emerald-50 text-emerald-800'}`}>
                              <p className="font-bold truncate">{event.label}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'financeiro' && (
                <FinancialTimeline project={project} />
              )}

              {activeTab === 'scope' && (
                <div className="max-w-4xl mx-auto space-y-10">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-6">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-stone-950 uppercase">Projeto Executivo</h3>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Detalhamento Técnico</p>
                    </div>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 bg-stone-950 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest">
                      <Download size={14} /> Exportar PDF
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.detailedScope?.map((section, idx) => (
                      <div key={idx} className="p-8 bg-white border border-stone-100 rounded-[2rem] shadow-sm">
                        <h4 className="text-lg font-serif font-bold text-stone-950 uppercase mb-4">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item: string, i: number) => (
                            <li key={i} className="text-xs text-stone-600 italic flex items-start gap-2">
                              <div className="mt-1.5 w-1 h-1 rounded-full bg-gold/50 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.photoLog.flatMap(log => log.images).map((img, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      className="group relative aspect-video bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100"
                    >
                      <img src={img} alt="Galeria" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon size={20} className="text-white" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="max-w-3xl mx-auto space-y-4">
                  {project.documents.map((doc) => (
                    <div key={doc.id} className="bg-white p-5 rounded-2xl border border-stone-200 flex items-center justify-between hover:border-gold/40 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 group-hover:bg-stone-950 group-hover:text-white transition-all">
                          <FileText size={18} />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-stone-950">{doc.name}</h4>
                          <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{doc.type}</p>
                        </div>
                      </div>
                      <button className="p-2 text-stone-300 hover:text-gold">
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ClientView;
