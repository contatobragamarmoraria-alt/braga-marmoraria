
import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Edit3, Trash2, X, Phone, Mail,
  Briefcase, CheckSquare, Plus, AlertCircle, Clock,
  CheckCircle2, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';
import { MOCK_TEAM } from '../constants';
import { TeamMember } from '../types';

interface TeamTask {
  id: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedToId: string;
  assignedToName: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
  createdBy: string;
}

const PRIORITY_CONFIG: Record<TeamTask['priority'], { label: string; color: string }> = {
  LOW:      { label: 'Baixa',   color: 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-white/5 dark:border-white/10' },
  MEDIUM:   { label: 'Média',   color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' },
  HIGH:     { label: 'Alta',    color: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
  CRITICAL: { label: 'Crítica', color: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' },
};

const STORAGE_MEMBERS = 'bm-team-members';
const STORAGE_TASKS   = 'bm-team-tasks';

const InputField = ({
  label, icon: Icon, value, onChange, placeholder, type = 'text'
}: {
  label: string; icon: any; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
      />
    </div>
  </div>
);

const Modal = ({ title, subtitle, onClose, children }: {
  title: string; subtitle: string; onClose: () => void; children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="relative w-full max-w-lg bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
    >
      <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
        <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-950 dark:hover:text-white transition-all">
          <X size={20} />
        </button>
      </div>
      <div className="p-8">{children}</div>
    </motion.div>
  </div>
);

const TeamModule: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [members, setMembers]         = useState<TeamMember[]>([]);
  const [tasks, setTasks]             = useState<TeamTask[]>([]);
  const [isAdding, setIsAdding]       = useState(false);
  const [editing, setEditing]         = useState<TeamMember | null>(null);
  const [assigning, setAssigning]     = useState<TeamMember | null>(null);
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [newMember, setNewMember]     = useState<Partial<TeamMember>>({});
  const [newTask, setNewTask]         = useState<Partial<TeamTask>>({ priority: 'MEDIUM' });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_MEMBERS);
    setMembers(saved ? JSON.parse(saved) : MOCK_TEAM);
    const savedTasks = localStorage.getItem(STORAGE_TASKS);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
  }, []);

  const saveMembers = (list: TeamMember[]) => {
    setMembers(list);
    localStorage.setItem(STORAGE_MEMBERS, JSON.stringify(list));
  };

  const saveTasks = (list: TeamTask[]) => {
    setTasks(list);
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(list));
  };

  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER';

  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <ShieldAlert size={48} className="text-red-500" />
        <h3 className="text-xl font-bold text-stone-900 dark:text-white uppercase tracking-tight">Acesso Restrito</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">
          Apenas Braga e Jamile têm acesso à gestão de equipe.
        </p>
      </div>
    );
  }

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) return;
    const member: TeamMember = {
      id: 'tm-' + Math.random().toString(36).substr(2, 9),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email || '',
      phone: newMember.phone || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=c8a96e&color=fff`,
      workload: 0,
      activeProjects: 0,
    };
    saveMembers([...members, member]);
    setIsAdding(false);
    setNewMember({});
  };

  const handleEditMember = () => {
    if (!editing) return;
    saveMembers(members.map(m => m.id === editing.id ? editing : m));
    setEditing(null);
  };

  const handleDeleteMember = (id: string) => {
    if (!window.confirm('Remover este integrante da equipe?')) return;
    saveMembers(members.filter(m => m.id !== id));
    saveTasks(tasks.filter(t => t.assignedToId !== id));
    if (expanded === id) setExpanded(null);
  };

  const handleAssignTask = () => {
    if (!assigning || !newTask.title) return;
    const task: TeamTask = {
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      description: newTask.description,
      priority: (newTask.priority as TeamTask['priority']) || 'MEDIUM',
      assignedToId: assigning.id,
      assignedToName: assigning.name,
      deadline: newTask.deadline,
      completed: false,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || 'Sistema',
    };
    saveTasks([...tasks, task]);
    setAssigning(null);
    setNewTask({ priority: 'MEDIUM' });
  };

  const toggleTask   = (id: string) => saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const removeTask   = (id: string) => saveTasks(tasks.filter(t => t.id !== id));
  const memberTasks  = (memberId: string) => tasks.filter(t => t.assignedToId === memberId);

  const totalPending = tasks.filter(t => !t.completed).length;
  const avgWorkload  = members.length ? Math.round(members.reduce((a, m) => a + m.workload, 0) / members.length) : 0;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Gestão de Equipe</h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Gerencie integrantes e atribua tarefas</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="gold-bg px-6 py-3 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
        >
          <UserPlus size={16} />
          Novo Integrante
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Integrantes',    value: members.length,                    icon: Users },
          { label: 'Tarefas Ativas', value: totalPending,                      icon: AlertCircle },
          { label: 'Concluídas',     value: tasks.filter(t => t.completed).length, icon: CheckCircle2 },
          { label: 'Carga Média',    value: avgWorkload + '%',                  icon: Briefcase },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-onyx p-5 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <s.icon size={18} className="text-gold" />
              <span className="text-2xl font-serif font-bold text-stone-950 dark:text-white">{s.value}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map(member => {
          const mTasks      = memberTasks(member.id);
          const pendingCount = mTasks.filter(t => !t.completed).length;
          const isExpanded  = expanded === member.id;

          return (
            <motion.div key={member.id} layout className="bg-white dark:bg-onyx rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-5">
                {/* Avatar + actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-2xl object-cover border border-stone-200 dark:border-white/10" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-950 dark:text-white uppercase tracking-tight">{member.name}</h4>
                      <p className="text-[9px] text-gold font-bold uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(member)} className="p-1.5 text-stone-400 hover:text-gold rounded-lg transition-all" title="Editar">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDeleteMember(member.id)} className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg transition-all" title="Remover">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Workload */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Carga de trabalho</span>
                    <span className="text-[9px] font-bold text-stone-600 dark:text-stone-300">{member.workload}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        member.workload >= 90 ? 'bg-red-500' : member.workload >= 70 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${member.workload}%` }}
                    />
                  </div>
                </div>

                {/* Contacts */}
                {member.phone && (
                  <div className="flex items-center gap-2 text-[9px] text-stone-400 mb-1">
                    <Phone size={10} /><span>{member.phone}</span>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center gap-2 text-[9px] text-stone-400 mb-3">
                    <Mail size={10} /><span className="truncate">{member.email}</span>
                  </div>
                )}

                {/* Pending badge */}
                {pendingCount > 0 && (
                  <div className="flex items-center gap-1.5 mb-3 px-2 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
                    <AlertCircle size={10} className="text-amber-500" />
                    <span className="text-[8px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                      {pendingCount} tarefa{pendingCount > 1 ? 's' : ''} pendente{pendingCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setAssigning(member)}
                    className="flex-1 py-2 gold-bg text-black rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 hover:scale-105 transition-all"
                  >
                    <Plus size={12} />
                    Atribuir Tarefa
                  </button>
                  {mTasks.length > 0 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : member.id)}
                      className="p-2 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-xl text-stone-400 hover:text-gold transition-all"
                      title="Ver tarefas"
                    >
                      <CheckSquare size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded tasks panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-stone-100 dark:border-white/5"
                  >
                    <div className="p-4 space-y-2 max-h-56 overflow-y-auto">
                      {mTasks.map(task => (
                        <div
                          key={task.id}
                          className={`flex items-start gap-2 p-2.5 rounded-xl border transition-all ${
                            task.completed
                              ? 'opacity-50 bg-stone-50 dark:bg-white/[0.02] border-stone-100 dark:border-white/5'
                              : 'bg-white dark:bg-white/5 border-stone-200 dark:border-white/10'
                          }`}
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300 dark:border-white/20'
                            }`}
                          >
                            {task.completed && <CheckCircle2 size={10} className="text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </p>
                            {task.deadline && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock size={8} className="text-stone-400" />
                                <span className="text-[8px] text-stone-400">{task.deadline}</span>
                              </div>
                            )}
                          </div>
                          <span className={`shrink-0 px-1.5 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-widest border ${PRIORITY_CONFIG[task.priority].color}`}>
                            {PRIORITY_CONFIG[task.priority].label}
                          </span>
                          <button onClick={() => removeTask(task.id)} className="shrink-0 p-0.5 text-stone-300 hover:text-red-500 transition-all">
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isAdding && (
          <Modal title="Novo Integrante" subtitle="Adicione um membro à equipe" onClose={() => { setIsAdding(false); setNewMember({}); }}>
            <div className="space-y-4">
              <InputField label="Nome *"    icon={Users}    value={newMember.name || ''}  onChange={v => setNewMember({ ...newMember, name: v })}  placeholder="Ex: João Silva" />
              <InputField label="Função *"  icon={Briefcase} value={newMember.role || ''}  onChange={v => setNewMember({ ...newMember, role: v })}  placeholder="Ex: Instalador, Medidor..." />
              <InputField label="Telefone"  icon={Phone}    value={newMember.phone || ''} onChange={v => setNewMember({ ...newMember, phone: v })} placeholder="(11) 99999-9999" />
              <InputField label="E-mail"    icon={Mail}     value={newMember.email || ''} onChange={v => setNewMember({ ...newMember, email: v })} placeholder="joao@bragamarmoraria.com" />
              <div className="pt-4 flex gap-3">
                <button onClick={() => { setIsAdding(false); setNewMember({}); }} className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all">Cancelar</button>
                <button onClick={handleAddMember} disabled={!newMember.name || !newMember.role} className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">Adicionar</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {editing && (
          <Modal title="Editar Integrante" subtitle={editing.name} onClose={() => setEditing(null)}>
            <div className="space-y-4">
              <InputField label="Nome"     icon={Users}    value={editing.name}  onChange={v => setEditing({ ...editing, name: v })}  placeholder="Nome completo" />
              <InputField label="Função"   icon={Briefcase} value={editing.role}  onChange={v => setEditing({ ...editing, role: v })}  placeholder="Função na equipe" />
              <InputField label="Telefone" icon={Phone}    value={editing.phone} onChange={v => setEditing({ ...editing, phone: v })} placeholder="(11) 99999-9999" />
              <InputField label="E-mail"   icon={Mail}     value={editing.email} onChange={v => setEditing({ ...editing, email: v })} placeholder="email@bragamarmoraria.com" />

              {/* Workload slider */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">
                  Carga de Trabalho — {editing.workload}%
                </label>
                <input
                  type="range" min={0} max={100}
                  value={editing.workload}
                  onChange={e => setEditing({ ...editing, workload: Number(e.target.value) })}
                  className="w-full accent-gold"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setEditing(null)} className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all">Cancelar</button>
                <button onClick={handleEditMember} className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Salvar</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Assign Task Modal */}
      <AnimatePresence>
        {assigning && (
          <Modal title="Atribuir Tarefa" subtitle={`Para: ${assigning.name} — ${assigning.role}`} onClose={() => { setAssigning(null); setNewTask({ priority: 'MEDIUM' }); }}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Título da Tarefa *</label>
                <input
                  type="text"
                  placeholder="Ex: Realizar medição no Apto 301"
                  value={newTask.title || ''}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Descrição (opcional)</label>
                <textarea
                  placeholder="Detalhes da tarefa..."
                  value={newTask.description || ''}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Prioridade</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as TeamTask['priority'] })}
                    className="w-full px-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all appearance-none"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Prazo</label>
                  <input
                    type="date"
                    value={newTask.deadline || ''}
                    onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full px-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => { setAssigning(null); setNewTask({ priority: 'MEDIUM' }); }} className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all">Cancelar</button>
                <button onClick={handleAssignTask} disabled={!newTask.title} className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">Atribuir</button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamModule;
