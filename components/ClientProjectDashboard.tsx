import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, AlertCircle, Users, Gem, Ruler, Wrench,
  Phone, MessageCircle, Calendar, ChevronDown, ChevronUp, MapPin,
  Package, Scissors, Truck, Home, Star, Shield, Info
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { Project, AppUser } from '../types';

// Maps project status to a 0-based milestone index (0–5)
const STATUS_MILESTONE: Record<string, number> = {
  LEAD_FECHADO: 0,
  AGUARDANDO_MEDICAO: 0,
  MEDICAO_CONCLUIDA: 1,
  PRODUCAO: 2,
  INSTALACAO: 3,
  FINALIZADO: 4,
  MANUTENCAO: 4,
};

const MILESTONES = [
  { label: 'Pedido Confirmado', icon: CheckCircle2 },
  { label: 'Medição Realizada', icon: Ruler },
  { label: 'Em Produção', icon: Wrench },
  { label: 'Instalação', icon: Home },
  { label: 'Entrega Final', icon: Star },
];

const STATUS_LABEL: Record<string, string> = {
  LEAD_FECHADO: 'Pedido Confirmado',
  AGUARDANDO_MEDICAO: 'Aguardando Medição',
  MEDICAO_CONCLUIDA: 'Medição Concluída',
  PRODUCAO: 'Em Produção',
  INSTALACAO: 'Instalação Agendada',
  FINALIZADO: 'Entrega Concluída',
  MANUTENCAO: 'Suporte Pós-Venda',
};

interface DashboardProps {
  project?: Project;
}

const ClientProjectDashboard: React.FC<DashboardProps> = ({ project: projectProp }) => {
  const { projectId } = useParams();
  const [loadedProject, setLoadedProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(!projectProp);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (projectProp) {
      userService.getUsers().then(users => {
        setTeamMembers(users.filter(u => (projectProp.teamIds || []).includes(u.id)));
      });
      return;
    }
    const load = async () => {
      try {
        const [projects, users] = await Promise.all([
          projectService.getProjects(),
          userService.getUsers(),
        ]);
        const found = projects.find(p => p.id === projectId);
        if (found) {
          setLoadedProject(found);
          setTeamMembers(users.filter(u => (found.teamIds || []).includes(u.id)));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) load();
  }, [projectId, projectProp]);

  const project = projectProp || loadedProject;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50 dark:bg-black/40">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-stone-50 dark:bg-black/40">
        <AlertCircle size={56} className="text-stone-300 dark:text-stone-600 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Projeto não encontrado</h2>
        <p className="text-stone-500 mt-2 max-w-md">O projeto que você está tentando acessar não existe ou você não tem permissão para visualizá-lo.</p>
      </div>
    );
  }

  const currentMilestone = STATUS_MILESTONE[project.status] ?? 0;
  const statusLabel = STATUS_LABEL[project.status] || project.status;

  const toggle = (id: string) => setOpenSection(prev => prev === id ? null : id);

  const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'A confirmar';

  // Build specs from project data
  const specs = [
    { label: 'Tipo de Projeto', value: project.projectType || '—' },
    { label: 'Material', value: (project.materials as any[])?.join(', ') || project.contractData?.projectType || '—' },
    { label: 'Responsável', value: project.responsible || '—' },
    { label: 'Forma de Pagamento', value: project.paymentMethod || '—' },
    { label: 'Início', value: fmtDate(project.startDate) },
    { label: 'Previsão de Entrega', value: fmtDate(project.estimatedDelivery) },
  ];

  // Client-facing description
  const description = project.concept ||
    project.notes ||
    `Seu projeto foi desenvolvido sob medida para atender às suas necessidades, unindo estética, funcionalidade e durabilidade. Todos os detalhes foram cuidadosamente planejados para garantir o melhor resultado.`;

  // Important info from contract or defaults
  const importantInfo: string[] = project.contractData?.responsibilities?.client?.length
    ? project.contractData.responsibilities.client
    : [
        'A instalação não inclui serviços hidráulicos ou elétricos.',
        'O local deve estar pronto para instalação na data agendada.',
        'Após a instalação, recomendamos cuidados específicos para conservação do material.',
        'Qualquer observação deve ser informada em até 7 dias após a entrega.',
      ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black/30">

      {/* ── HERO ── */}
      <div className="bg-stone-950 text-white px-6 py-10 md:px-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold mb-2">Braga Marmoraria · Projeto Personalizado</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-tight leading-tight mb-4">
            {project.clientName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="px-4 py-1.5 bg-gold/20 border border-gold/30 text-gold rounded-full text-[10px] font-bold uppercase tracking-widest">
              {statusLabel}
            </span>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{project.projectType}</span>
          </div>
        </div>
      </div>

      {/* ── MILESTONE PROGRESS ── */}
      <div className="bg-white dark:bg-onyx border-b border-stone-100 dark:border-white/5 px-6 py-8 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-6">Acompanhamento do Projeto</p>
          <div className="flex items-center gap-0">
            {MILESTONES.map((m, i) => {
              const done = i < currentMilestone;
              const active = i === currentMilestone;
              const Icon = m.icon;
              return (
                <React.Fragment key={m.label}>
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0
                      ${done ? 'bg-gold border-gold text-black' : active ? 'bg-gold/10 border-gold text-gold' : 'bg-stone-100 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-400'}`}>
                      {done ? <CheckCircle2 size={20} /> : <Icon size={18} />}
                    </div>
                    <p className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-center leading-tight hidden sm:block
                      ${done ? 'text-gold' : active ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`}>
                      {m.label}
                    </p>
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 md:mx-2 transition-colors ${i < currentMilestone ? 'bg-gold' : 'bg-stone-200 dark:bg-white/10'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-4">

        {/* 1. Sobre o Projeto */}
        <Section id="sobre" title="Sobre o seu projeto" icon={Gem} openSection={openSection} toggle={toggle} defaultOpen>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-serif text-lg">{description}</p>
          {project.scope?.inclusions && project.scope.inclusions.length > 0 && (
            <ul className="mt-4 space-y-2">
              {project.scope.inclusions.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-stone-600 dark:text-stone-300">
                  <span className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* 2. Especificações Técnicas */}
        <Section id="specs" title="Especificações Técnicas" icon={Ruler} openSection={openSection} toggle={toggle}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {specs.map(s => (
              <div key={s.label} className="bg-stone-50 dark:bg-white/5 rounded-2xl p-4 border border-stone-100 dark:border-white/5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">{s.label}</p>
                <p className="text-sm font-bold text-stone-900 dark:text-white font-serif">{s.value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Cronograma */}
        <Section id="cronograma" title="Cronograma do Projeto" icon={Calendar} openSection={openSection} toggle={toggle}>
          <div className="space-y-3">
            {[
              { label: 'Início do Projeto', date: project.startDate, done: true },
              { label: 'Medição Técnica', date: project.startDate, done: currentMilestone >= 1 },
              { label: 'Início da Produção', date: undefined, done: currentMilestone >= 2 },
              { label: 'Instalação', date: project.estimatedDelivery, done: currentMilestone >= 3 },
              { label: 'Entrega Final', date: project.estimatedDelivery, done: currentMilestone >= 4 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.done ? 'bg-gold text-black' : 'bg-stone-200 dark:bg-white/10 text-stone-400'}`}>
                  {item.done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold uppercase tracking-tight ${item.done ? 'text-stone-900 dark:text-white' : 'text-stone-400'}`}>{item.label}</p>
                  {item.date && <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{fmtDate(item.date)}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. Tarefas/Checklist do projeto */}
        {project.tasks && project.tasks.length > 0 && (
          <Section id="checklist" title="Etapas do seu Projeto" icon={CheckCircle2} openSection={openSection} toggle={toggle}>
            <div className="space-y-2">
              {project.tasks.map(task => (
                <div key={task.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all
                  ${task.completed
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20'
                    : 'bg-stone-50 dark:bg-white/5 border-stone-100 dark:border-white/5'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${task.completed ? 'bg-emerald-500 text-white' : 'bg-stone-200 dark:bg-white/10 text-stone-400'}`}>
                    {task.completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <p className={`text-sm font-bold uppercase tracking-tight ${task.completed ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`}>
                    {task.name}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 5. Equipe */}
        <Section id="equipe" title="Equipe Envolvida" icon={Users} openSection={openSection} toggle={toggle}>
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map(m => (
                <div key={m.id} className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5">
                  <img
                    src={m.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'}
                    alt={m.name}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight">{m.name}</p>
                    <p className="text-[9px] font-bold text-gold uppercase tracking-widest mt-0.5">{m.role}</p>
                  </div>
                </div>
              ))}
              {project.responsible && !teamMembers.find(m => m.name === project.responsible) && (
                <div className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Users size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight">{project.responsible}</p>
                    <p className="text-[9px] font-bold text-gold uppercase tracking-widest mt-0.5">Consultor</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5">
              <Users size={20} className="text-stone-400" />
              <p className="text-stone-500 dark:text-stone-400 text-sm">Equipe Braga Marmoraria — especialistas em execução e instalação de alto padrão.</p>
            </div>
          )}
        </Section>

        {/* 6. Informações Importantes */}
        <Section id="info" title="Informações Importantes" icon={Shield} openSection={openSection} toggle={toggle}>
          <ul className="space-y-3">
            {importantInfo.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl">
                <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">{item}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 7. Suporte */}
        <div className="bg-stone-950 text-white rounded-[2.5rem] p-8 md:p-10 space-y-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold mb-2">Suporte</p>
            <h3 className="text-2xl font-serif font-bold uppercase tracking-tight">Precisa de ajuda?</h3>
            <p className="text-stone-400 mt-2 text-sm leading-relaxed">
              Nossa equipe está à disposição para acompanhar você em todas as etapas do projeto. Entre em contato pelo WhatsApp ou telefone.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a
              href="tel:+5511999999999"
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border border-white/10"
            >
              <Phone size={18} /> Ligar Agora
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable collapsible section
interface SectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  openSection: string | null;
  toggle: (id: string) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, icon: Icon, openSection, toggle, defaultOpen, children }) => {
  const isOpen = defaultOpen ? openSection !== `${id}-closed` : openSection === id;

  const handleToggle = () => {
    if (defaultOpen) {
      toggle(isOpen ? `${id}-closed` : id);
    } else {
      toggle(id);
    }
  };

  return (
    <div className="bg-white dark:bg-onyx rounded-[2rem] border border-stone-100 dark:border-white/5 overflow-hidden shadow-sm">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
            <Icon size={18} />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-widest">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-stone-400 shrink-0" /> : <ChevronDown size={18} className="text-stone-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-8 md:px-8 md:pb-10 border-t border-stone-100 dark:border-white/5 pt-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientProjectDashboard;
