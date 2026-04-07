
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, XAxis, YAxis } from 'recharts';
import { CheckCircle, PlusCircle, Briefcase, DollarSign, X, Clock, User, Layers, Plus, ChevronRight, MessageCircle, Mail, Globe, LogOut, RefreshCw, Send, Check, Eye, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectTask } from '../types';
import { MOCK_TEAM, STAGES } from '../constants';
import { occurrenceService } from '../services/occurrenceService';
import ProjectDetailsModal from './ProjectDetailsModal';
import SmartProjectModal from './SmartProjectModal';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleService } from '../src/services/GoogleService';
import { useAuth } from './AuthContext';

const COLORS = ['#D4AF37', '#6b7280', '#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

const AlertsModal = ({ isOpen, onClose, notifications, onCompleteTask, onNavigate, googleAuth }: { isOpen: boolean, onClose: () => void, notifications: any[], onCompleteTask: (projectId: string, taskId: string) => void, onNavigate: (projectId: string) => void, googleAuth: boolean }) => {
  const [sending, setSending] = useState<string | null>(null);
  const [sentStatus, setSentStatus] = useState<Record<string, 'sent' | 'delivered' | 'read'>>({});

  if (!isOpen) return null;

  const { overdue, today, tomorrow, next7Days, later, noDate } = useMemo(() => {
    const categories: { [key: string]: any[] } = { overdue: [], today: [], tomorrow: [], next7Days: [], later: [], noDate: [] };
    notifications.forEach(notif => {
        if (notif.diffDays === Infinity) categories.noDate.push(notif);
        else if (notif.diffDays < 0) categories.overdue.push(notif);
        else if (notif.diffDays === 0) categories.today.push(notif);
        else if (notif.diffDays === 1) categories.tomorrow.push(notif);
        else if (notif.diffDays <= 7) categories.next7Days.push(notif);
        else categories.later.push(notif);
    });
    return categories;
  }, [notifications]);

  const handleWhatsApp = (notif: any) => {
    const text = `Olá, gostaria de notificar sobre a tarefa "${notif.task.name}" do projeto "${notif.project.clientName}", que está com status de alerta no sistema Braga Marmoraria.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setSentStatus(prev => ({ ...prev, [notif.task.id]: 'sent' }));
  };

  const handleEmail = async (notif: any) => {
    if (googleAuth) {
      setSending(notif.task.id);
      try {
        const subject = `Alerta de Tarefa: ${notif.task.name} - ${notif.project.clientName}`;
        const body = `
          <div style="font-family: serif; color: #1c1917; max-width: 600px; margin: 0 auto; border: 1px solid #e7e5e4; border-radius: 16px; overflow: hidden;">
            <div style="background-color: #1c1917; padding: 24px; text-align: center;">
              <h1 style="color: #d4af37; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">Braga Marmoraria</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="margin-top: 0;">Alerta de Cronograma</h2>
              <p>Olá,</p>
              <p>Esta é uma notificação automática sobre uma tarefa que requer sua atenção:</p>
              <div style="background-color: #f5f5f4; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Tarefa:</strong> ${notif.task.name}</p>
                <p style="margin: 5px 0;"><strong>Projeto:</strong> ${notif.project.clientName}</p>
                <p style="margin: 5px 0;"><strong>Vencimento:</strong> ${notif.task.scheduledDate || 'N/A'}</p>
              </div>
              <p>Por favor, acesse o sistema para atualizar o status desta atividade.</p>
            </div>
            <div style="background-color: #f5f5f4; padding: 16px; text-align: center; font-size: 12px; color: #78716c;">
              © 2026 Braga Marmoraria - Sistema de Gestão de Produção
            </div>
          </div>
        `;
        await GoogleService.sendEmail('ampliacaomktdigital@gmail.com', subject, body);
        setSentStatus(prev => ({ ...prev, [notif.task.id]: 'sent' }));
        
        // Simulate delivery and read status for demo
        setTimeout(() => setSentStatus(prev => ({ ...prev, [notif.task.id]: 'delivered' })), 2000);
        setTimeout(() => setSentStatus(prev => ({ ...prev, [notif.task.id]: 'read' })), 5000);
      } catch (error) {
        console.error('Error sending email:', error);
      } finally {
        setSending(null);
      }
    } else {
      const subject = `Alerta de Tarefa: ${notif.task.name} - ${notif.project.clientName}`;
      const body = `Olá,\n\nEsta é uma notificação sobre a tarefa "${notif.task.name}" do projeto "${notif.project.clientName}".\n\nStatus: Alerta de Cronograma\nVencimento: ${notif.task.scheduledDate || 'N/A'}\n\nPor favor, verifique o sistema para mais detalhes.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const sections = [
    { title: 'Atrasadas', tasks: overdue, color: 'red-900', legend: 'Tarefas que já deveriam ter sido concluídas.' },
    { title: 'Hoje', tasks: today, color: 'red-500', legend: 'Tarefas com vencimento hoje. Ação imediata.' },
    { title: 'Amanhã', tasks: tomorrow, color: 'yellow-500', legend: 'Tarefas com vencimento para amanhã. Planejar.' },
    { title: 'Próximos 7 Dias', tasks: next7Days, color: 'emerald-500', legend: 'Tarefas com vencimento na semana. Monitorar.'},
    { title: 'Futuras', tasks: later, color: 'stone-400', legend: 'Tarefas planejadas para depois de 7 dias.' },
    { title: 'Sem Data', tasks: noDate, color: 'stone-400', legend: 'Tarefas sem data definida para execução.' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl" />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-4xl h-[90vh] rounded-[3rem] border border-stone-200 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 md:p-8 border-b border-stone-100 dark:border-white/5 flex items-start md:items-center justify-between shrink-0 gap-4">
                <div>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-stone-900 dark:text-white uppercase">Agenda Mestra de Alertas</h3>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Visão completa e acionável de todas as tarefas da produção</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full shrink-0"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll p-8 space-y-8">
                {sections.map(section => section.tasks.length > 0 && (
                    <div key={section.title}>
                        <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] text-${section.color} mb-3`}>{section.title}</h4>
                        <div className="space-y-3">
                            {section.tasks.map((notif) => {
                                const responsible = MOCK_TEAM.find(m => m.id === notif.task.assignedToId) || MOCK_TEAM.find(m => m.name === notif.project.responsible);
                                const phase = STAGES.find(s => s.id === notif.project.status);
                                const status = sentStatus[notif.task.id];
                                
                                return (
                                <div key={notif.task.id} className={`p-5 border-l-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 bg-stone-50/50 dark:bg-white/5 border-l-${section.color} hover:bg-stone-100/50 dark:hover:bg-white/10 transition-all group`}>
                                    <div className="flex-1 space-y-3 cursor-pointer w-full" onClick={() => onNavigate(notif.project.id)}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <p className="text-sm font-serif font-bold text-stone-900 dark:text-white truncate leading-tight">{notif.task.name}</p>
                                                {status && (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-200 dark:bg-white/10 text-[8px] font-bold uppercase tracking-widest text-stone-500">
                                                        {status === 'sent' && <><Send size={8} /> Enviado</>}
                                                        {status === 'delivered' && <><Check size={8} /> Recebido</>}
                                                        {status === 'read' && <><Eye size={8} className="text-blue-500" /> Lido</>}
                                                    </div>
                                                )}
                                            </div>
                                            <ChevronRight size={16} className="text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                                            <InfoItem icon={Clock} label="Vencimento" value={notif.task.scheduledDate || 'N/A'} />
                                            <InfoItem icon={User} label="Responsável" value={responsible?.name || 'N/A'} />
                                            <InfoItem icon={Briefcase} label="Cliente" value={notif.project.clientName} />
                                            <InfoItem icon={Layers} label="Fase" value={phase?.label || 'N/A'} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-stone-200 dark:border-white/5">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleWhatsApp(notif); }}
                                            className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                                            title="Notificar via WhatsApp"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                        <button 
                                            disabled={sending === notif.task.id}
                                            onClick={(e) => { e.stopPropagation(); handleEmail(notif); }}
                                            className={`p-2.5 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all ${sending === notif.task.id ? 'animate-pulse' : ''}`}
                                            title={googleAuth ? "Enviar E-mail via Google" : "Notificar via Email"}
                                        >
                                            <Mail size={18} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onCompleteTask(notif.project.id, notif.task.id); }} 
                                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all bg-white dark:bg-onyx border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-${section.color} hover:text-white hover:border-${section.color} shadow-sm`}
                                        >
                                            Concluir
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    </div>
  )
}

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div>
    <p className="text-[8px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icon size={10} /> {label}</p>
    <p className="text-[10px] font-bold text-stone-700 dark:text-stone-300 mt-0.5 truncate">{value}</p>
  </div>
)

const AreaProjectsModal = ({ isOpen, onClose, areaName, projects, onNavigate }: { isOpen: boolean, onClose: () => void, areaName: string, projects: Project[], onNavigate: (projectId: string) => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl" />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-2xl max-h-[80vh] rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white uppercase">Projetos: {areaName}</h3>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">{projects.length} obras nesta categoria</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full shrink-0"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-3">
                {projects.map((project) => {
                    const phase = STAGES.find(s => s.id === project.status);
                    return (
                        <div key={project.id} onClick={() => onNavigate(project.id)} className="p-4 border border-stone-200 dark:border-white/10 rounded-xl flex items-center gap-4 bg-stone-50/50 dark:bg-white/5 cursor-pointer hover:border-gold/50 transition-colors">
                            <div className="flex-1 space-y-2">
                                <p className="text-sm font-serif font-bold text-stone-900 dark:text-white truncate leading-tight">{project.clientName}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                                    <InfoItem icon={Briefcase} label="Tipo" value={project.projectType} />
                                    <InfoItem icon={Layers} label="Fase" value={phase?.label || 'N/A'} />
                                    <InfoItem icon={Clock} label="Entrega" value={project.estimatedDelivery} />
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-stone-400" />
                        </div>
                    );
                })}
                {projects.length === 0 && (
                    <p className="text-center text-stone-500 dark:text-stone-400 text-sm py-8">Nenhuma obra encontrada para esta área.</p>
                )}
            </div>
        </motion.div>
    </div>
  )
}

const InboxModal = ({ isOpen, onClose, googleAuth }: { isOpen: boolean, onClose: () => void, googleAuth: boolean }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [replyBody, setReplyBody] = useState('');

  useEffect(() => {
    if (isOpen && googleAuth) {
      fetchMessages();
    }
  }, [isOpen, googleAuth]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const msgs = await GoogleService.getMessages();
      setMessages(msgs);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyingTo) return;
    const toHeader = replyingTo.payload.headers.find((h: any) => h.name === 'From')?.value;
    const subjectHeader = replyingTo.payload.headers.find((h: any) => h.name === 'Subject')?.value;
    
    try {
      await GoogleService.sendEmail(toHeader, `Re: ${subjectHeader}`, replyBody);
      setReplyingTo(null);
      setReplyBody('');
      fetchMessages();
    } catch (error) {
      console.error('Error replying:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl" />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-onyx w-full max-w-2xl h-[80vh] rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white uppercase">Caixa de Entrada Google</h3>
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1">Gerencie suas comunicações integradas</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full shrink-0"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4">
                {!googleAuth ? (
                    <div className="text-center py-12">
                        <Globe size={48} className="mx-auto text-stone-300 mb-4" />
                        <p className="text-stone-500">Conecte sua conta Google para ver mensagens.</p>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-12">
                        <RefreshCw size={32} className="animate-spin text-gold" />
                    </div>
                ) : messages.length === 0 ? (
                    <p className="text-center text-stone-500 py-12">Nenhuma mensagem encontrada.</p>
                ) : (
                    messages.map((msg) => {
                        const from = msg.payload.headers.find((h: any) => h.name === 'From')?.value;
                        const subject = msg.payload.headers.find((h: any) => h.name === 'Subject')?.value;
                        const date = msg.payload.headers.find((h: any) => h.name === 'Date')?.value;
                        
                        return (
                            <div key={msg.id} className="p-4 border border-stone-200 dark:border-white/10 rounded-xl bg-stone-50/50 dark:bg-white/5 hover:border-gold/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-bold text-gold uppercase tracking-widest">{from}</p>
                                    <p className="text-[8px] text-stone-400">{new Date(date).toLocaleString()}</p>
                                </div>
                                <p className="text-sm font-serif font-bold text-stone-900 dark:text-white mb-2">{subject}</p>
                                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">{msg.snippet}</p>
                                <button 
                                    onClick={() => setReplyingTo(msg)}
                                    className="text-[9px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-300 hover:text-gold transition-colors flex items-center gap-1"
                                >
                                    <MessageCircle size={12} /> Responder
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <AnimatePresence>
                {replyingTo && (
                    <motion.div 
                        initial={{ y: '100%' }} 
                        animate={{ y: 0 }} 
                        exit={{ y: '100%' }}
                        className="absolute inset-0 bg-white dark:bg-onyx z-10 flex flex-col"
                    >
                        <div className="p-6 border-b border-stone-100 dark:border-white/5 flex items-center justify-between">
                            <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-white uppercase">Respondendo a: {replyingTo.payload.headers.find((h: any) => h.name === 'From')?.value}</h4>
                            <button onClick={() => setReplyingTo(null)} className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <textarea 
                                value={replyBody}
                                onChange={(e) => setReplyBody(e.target.value)}
                                placeholder="Escreva sua resposta..."
                                className="flex-1 p-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-sm outline-none focus:border-gold/50 resize-none"
                            />
                            <button 
                                onClick={handleReply}
                                className="gold-bg py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Send size={14} /> Enviar Resposta
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </div>
  )
}

const Dashboard: React.FC<{ projects: Project[], updateProject: (p: Project) => void, addProject?: (p: Project) => void }> = ({ projects, updateProject, addProject }) => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [googleAuth, setGoogleAuth] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [occurrences, setOccurrences] = useState<any[]>([]);

  useEffect(() => {
    occurrenceService.subscribeToOccurrences(setOccurrences);
  }, []);
  
  const navigate = useNavigate();
  const currentDate = new Date();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    checkGoogleAuth();
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        checkGoogleAuth();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkGoogleAuth = async () => {
    setLoadingGoogle(true);
    try {
      const status = await GoogleService.getAuthStatus();
      setGoogleAuth(status.isAuthenticated);
    } catch (error) {
      console.error('Error checking google auth:', error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGoogleConnect = async () => {
    try {
      const url = await GoogleService.getAuthUrl();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Error getting auth url:', error);
    }
  };

  const handleGoogleLogout = async () => {
    await GoogleService.logout();
    setGoogleAuth(false);
  };

  const handleCompleteTask = (projectId: string, taskId: string) => {
    const projectToUpdate = projects.find(p => p.id === projectId);
    if (projectToUpdate) {
      const updatedTasks = projectToUpdate.tasks.map(t =>
        t.id === taskId ? { ...t, completed: true } : t
      );
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : projectToUpdate.progress;
      const updatedProject = { ...projectToUpdate, tasks: updatedTasks, progress };
      updateProject(updatedProject);
    }
  };

  const handleNavigate = (projectId: string) => {
    navigate(`/project/${projectId}?tab=tarefas`);
    setIsAlertsModalOpen(false);
    setSelectedArea(null);
  };

  const ongoingProjects = useMemo(() => projects.filter(p => p.progress > 0 && p.progress < 100), [projects]);
  const completedThisMonth = useMemo(() => {
    return projects.filter(p => {
      if (p.progress !== 100) return false;
      const deliveryDateParts = p.estimatedDelivery.split('/');
      const deliveryDate = new Date(+deliveryDateParts[2], +deliveryDateParts[1] - 1, +deliveryDateParts[0]);
      return deliveryDate.getFullYear() === currentDate.getFullYear() && deliveryDate.getMonth() === currentDate.getMonth();
    });
  }, [projects, currentDate]);
  
  const newLeadsThisMonth = useMemo(() => {
    return projects.filter(p => {
      const projectDate = new Date(p.startDate);
      return projectDate.getFullYear() === currentDate.getFullYear() && 
             projectDate.getMonth() === currentDate.getMonth() && 
             p.status === 'LEAD';
    });
  }, [projects, currentDate]);

  const monthlyRevenue = useMemo(() => ongoingProjects.reduce((acc, p) => acc + p.value, 0), [ongoingProjects]);

  const projectTypesData = useMemo(() => {
    const types = ongoingProjects.reduce((acc, p) => {
      const typeKey = p.projectType.match(/cozinha|banheiro|lavabo|recepção|escadaria|lobby/i)?.[0] || 'Outro';
      const capitalizedKey = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
      acc[capitalizedKey] = (acc[capitalizedKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [ongoingProjects]);

  const projectsByArea = useMemo(() => {
    if (!selectedArea) return [];
    return ongoingProjects.filter(p => {
      const typeKey = p.projectType.match(/cozinha|banheiro|lavabo|recepção|escadaria|lobby/i)?.[0] || 'Outro';
      const capitalizedKey = typeKey.charAt(0).toUpperCase() + typeKey.slice(1);
      return capitalizedKey === selectedArea;
    });
  }, [ongoingProjects, selectedArea]);
  
  const professionalWorkload = useMemo(() => {
    return MOCK_TEAM.map(member => ({
      name: member.name.split(' ')[0],
      projetos: ongoingProjects.filter(p => p.teamIds.includes(member.id)).length,
    }));
  }, [ongoingProjects]);

  const revenueForecastData = useMemo(() => {
    const forecast = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const monthName = monthDate.toLocaleString('pt-BR', { month: 'short' });
        const revenue = projects
            .filter(p => {
                const deliveryDateParts = p.estimatedDelivery.split('/');
                const deliveryDate = new Date(+deliveryDateParts[2], +deliveryDateParts[1] - 1, +deliveryDateParts[0]);
                return deliveryDate.getFullYear() === monthDate.getFullYear() && deliveryDate.getMonth() === monthDate.getMonth();
            })
            .reduce((sum, p) => sum + p.value, 0);
        forecast.push({ month: monthName.toUpperCase(), 'Previsão': revenue });
    }
    return forecast;
  }, [projects]);


  const notifications = useMemo(() => {
    const allTasks: {task: ProjectTask, project: Project, diffDays: number, colorClass: string}[] = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    projects.forEach(p => {
      p.tasks.forEach(t => {
        if (!t.completed) {
          let diffDays = Infinity;
          let colorClass = "border-l-stone-400";
          if (t.scheduledDate) {
              const taskDateParts = t.scheduledDate.split('-');
              const taskDate = new Date(+taskDateParts[0], +taskDateParts[1] - 1, +taskDateParts[2]);
              taskDate.setHours(0,0,0,0);
              const diffTime = taskDate.getTime() - today.getTime();
              diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays < 0) colorClass = "border-l-red-900";
              else if (diffDays === 0) colorClass = "border-l-red-500";
              else if (diffDays === 1) colorClass = "border-l-yellow-500";
              else if (diffDays <= 7) colorClass = "border-l-emerald-500";
          }
          allTasks.push({ task: t, project: p, diffDays, colorClass });
        }
      });
    });
    return allTasks.sort((a, b) => a.diffDays - b.diffDays);
  }, [projects]);
  
  const alertCounts = useMemo(() => {
    const counts = { overdue: 0, red: 0, yellow: 0, green: 0 };
    notifications.forEach(n => {
        if (n.diffDays < 0) counts.overdue++;
        else if (n.diffDays === 0) counts.red++;
        else if (n.diffDays === 1) counts.yellow++;
        else if (n.diffDays > 1 && n.diffDays <= 7) counts.green++;
    });
    return counts;
  }, [notifications]);

  const kpiCards = [
      { icon: DollarSign, label: 'Faturamento Mês (Ativos)', value: `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, onClick: () => navigate('/app/producao') },
      { icon: Briefcase, label: 'Projetos em Andamento', value: ongoingProjects.length, onClick: () => navigate('/app/producao') },
      { icon: CheckCircle, label: 'Concluídos no Mês', value: completedThisMonth.length, onClick: () => navigate('/app/historico') },
      { icon: PlusCircle, label: 'Novos Leads no Mês', value: newLeadsThisMonth.length, onClick: () => navigate('/app/comercial') },
  ];

  return (
    <div className="flex flex-col space-y-4 min-h-full pb-8">
      <div className="shrink-0 flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white tracking-tight uppercase">Dashboard Estratégico</h2>
              <p className="text-[11px] text-stone-400 font-bold uppercase tracking-[0.3em]">Visão Geral do Atelier</p>
           </div>
           
           <div className="flex items-center gap-3">
              {!loadingGoogle && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsInboxModalOpen(true)}
                    className="p-2 rounded-xl bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-gold/50 transition-all relative"
                    title="Caixa de Entrada Google"
                  >
                    <Mail size={18} />
                    {googleAuth && <div className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full border-2 border-white dark:border-onyx" />}
                  </button>
                  <button 
                    onClick={googleAuth ? handleGoogleLogout : handleGoogleConnect}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                      googleAuth 
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' 
                      : 'bg-white dark:bg-white/5 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-gold/50'
                    }`}
                  >
                    {googleAuth ? (
                      <><Globe size={14} /> Google Conectado <LogOut size={12} className="ml-1" /></>
                    ) : (
                      <><Globe size={14} /> Conectar Google</>
                    )}
                  </button>
                </div>
              )}
              {loadingGoogle && <RefreshCw size={16} className="animate-spin text-stone-400" />}
           </div>
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16, scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
            className="bg-stone-950 dark:bg-white/5 text-white p-6 md:p-8 rounded-[2.5rem] relative shrink-0 shadow-xl"
            style={{ overflow: 'hidden' }}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Bem-vindo de volta</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif leading-tight">
                  Olá, {user?.name?.split(' ')[0] || 'Artesão'}
                </h3>
                <p className="text-stone-400 text-sm font-serif italic max-w-lg">
                  "A excelência na marmoraria não é um ato, mas um hábito de precisão e artesania."
                </p>
              </div>

              <div className="flex flex-col gap-3 min-w-[240px]">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gold">Status do Sistema</span>
                    <span className="text-[10px] font-bold text-white">Pronto</span>
                  </div>
                  <p className="text-[8px] text-stone-400 uppercase tracking-tighter">Sincronizado e Operacional</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div 
                  className="text-center md:text-right cursor-pointer group"
                  onClick={() => navigate('/app/producao')}
                >
                  <p className="text-[8px] font-bold uppercase tracking-widest text-stone-500 mb-1 group-hover:text-gold transition-colors">Projetos Ativos</p>
                  <p className="text-2xl font-serif text-gold group-hover:scale-110 transition-transform origin-right">{ongoingProjects.length}</p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block" />
                <div 
                  className="text-center md:text-right cursor-pointer group"
                  onClick={() => setIsAlertsModalOpen(true)}
                >
                  <p className="text-[8px] font-bold uppercase tracking-widest text-stone-500 mb-1 group-hover:text-red-400 transition-colors">Alertas Críticos</p>
                  <p className="text-2xl font-serif text-red-400 group-hover:scale-110 transition-transform origin-right">{alertCounts.overdue + alertCounts.red}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 30, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1.5 bg-gold z-20"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
         {kpiCards.map((item, i) => (
           <div key={i} onClick={item.onClick} className="bg-white dark:bg-white/5 p-3 rounded-2xl border border-stone-100 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-3 transition-all hover:shadow-md cursor-pointer hover:border-gold/30">
              <div className="w-8 h-8 bg-stone-50 dark:bg-white/5 rounded-lg flex items-center justify-center text-gold shrink-0">
                <item.icon size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[7px] font-bold text-stone-400 uppercase tracking-[0.1em] truncate">{item.label}</p>
                <h3 className="text-sm font-serif font-bold text-stone-950 dark:text-white mt-0.5 truncate">{item.value}</h3>
              </div>
           </div>
         ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-stone-100 dark:border-white/5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col h-[180px] shrink-0">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Previsão Semestral</h4>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueForecastData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" className="dark:stroke-white/5" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: '700', fill: '#a8a29e'}} />
                    <YAxis hide domain={[0, 'dataMax + 20000']} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px' }} 
                    />
                    <Bar dataKey="Previsão" fill="#D4AF37" radius={[2, 2, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
           <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-stone-100 dark:border-white/5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col flex-1 min-h-[300px]">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Distribuição por Área</h4>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                          data={projectTypesData} 
                          dataKey="value" 
                          nameKey="name" 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={60}
                          outerRadius={85} 
                          paddingAngle={5}
                          labelLine={false} 
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          onClick={(data) => setSelectedArea(data.name)}
                          className="cursor-pointer outline-none hover:opacity-80 transition-opacity"
                        >
                        {projectTypesData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend iconSize={6} wrapperStyle={{fontSize: "9px", paddingTop: "15px"}} />
                    </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>

        <div className="flex flex-col gap-4 h-full">
            <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-stone-100 dark:border-white/5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col cursor-pointer hover:border-gold/30 shrink-0 transition-all" onClick={() => setIsAlertsModalOpen(true)}>
               <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Alertas de Cronograma</h4>
               <div className="flex-1 grid grid-cols-4 gap-2">
                  <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-xl flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-serif font-bold text-red-800 dark:text-red-400">{alertCounts.overdue}</span>
                    <span className="text-[7px] font-bold text-red-700/60 dark:text-red-400/60 uppercase tracking-widest">Atraso</span>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-serif font-bold text-orange-600 dark:text-orange-400">{alertCounts.red}</span>
                    <span className="text-[7px] font-bold text-orange-600/60 dark:text-orange-400/60 uppercase tracking-widest">Crítico</span>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-serif font-bold text-yellow-600 dark:text-yellow-400">{alertCounts.yellow}</span>
                    <span className="text-[7px] font-bold text-yellow-600/60 dark:text-yellow-400/60 uppercase tracking-widest">Atenção</span>
                  </div>
                   <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-serif font-bold text-emerald-600 dark:text-emerald-400">{alertCounts.green}</span>
                    <span className="text-[7px] font-bold text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-widest">OK</span>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-stone-100 dark:border-white/5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col cursor-pointer hover:border-gold/30 shrink-0 transition-all" onClick={() => navigate('/app/historico')}>
               <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Ocorrências Recentes</h4>
               <div className="space-y-3 lg:overflow-y-auto lg:max-h-[120px] custom-scroll pr-2">
                 {occurrences.slice(0, 4).map(occ => (
                   <div key={occ.id} className="flex items-center gap-3">
                     <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${occ.type === 'POSITIVE' ? 'bg-emerald-500' : occ.type === 'NEGATIVE' ? 'bg-red-500' : 'bg-stone-300'}`} />
                     <div className="flex-1 min-w-0">
                       <p className="text-[10px] font-bold text-stone-900 dark:text-white truncate uppercase tracking-tight">{occ.title}</p>
                       <p className="text-[8px] text-stone-400 truncate uppercase tracking-widest">{projects.find(p => p.id === occ.projectId)?.clientName || occ.projectName}</p>
                     </div>
                     <ChevronRight size={12} className="text-stone-300 shrink-0" />
                   </div>
                 ))}
                 {occurrences.length === 0 && (
                   <p className="text-[10px] text-stone-500">Nenhuma ocorrência recente.</p>
                 )}
               </div>
            </div>

           <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-stone-100 dark:border-white/5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex flex-col">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Carga da Equipe</h4>
              <div className="flex-1 min-h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={professionalWorkload} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={60} tick={{fontSize: 8, fontWeight: '700', fill: '#a8a29e'}} axisLine={false} tickLine={false}/>
                          <Tooltip 
                            cursor={{fill: 'rgba(212, 175, 55, 0.05)'}}
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px' }}
                          />
                          <Bar dataKey="projetos" fill="#D4AF37" barSize={8} radius={[0, 2, 2, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
            </div>
        </div>
      </div>
      
      <div className="shrink-0 flex justify-end mt-4">
        <button 
          onClick={() => setIsSmartModalOpen(true)} 
          className="gold-bg px-8 py-4 text-black rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-gold/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>
      
      <AnimatePresence>
        {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} updateProject={updateProject} />}
        <AlertsModal isOpen={isAlertsModalOpen} onClose={() => setIsAlertsModalOpen(false)} notifications={notifications} onCompleteTask={handleCompleteTask} onNavigate={handleNavigate} googleAuth={googleAuth} />
        <SmartProjectModal isOpen={isSmartModalOpen} onClose={() => setIsSmartModalOpen(false)} onProjectCreated={(p) => { addProject?.(p); setSelectedProject(p); }} />
        <AreaProjectsModal isOpen={!!selectedArea} onClose={() => setSelectedArea(null)} areaName={selectedArea || ''} projects={projectsByArea} onNavigate={handleNavigate} />
        <InboxModal isOpen={isInboxModalOpen} onClose={() => setIsInboxModalOpen(false)} googleAuth={googleAuth} />
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
