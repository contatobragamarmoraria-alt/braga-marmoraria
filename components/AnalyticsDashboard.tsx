
import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { MOCK_TEAM } from '../constants';
import { ArrowLeft, ArrowRight, Briefcase, DollarSign, Users, CheckCircle } from 'lucide-react';

const COLORS = ['#D4AF37', '#6b7280', '#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

const AnalyticsDashboard: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const projectDate = new Date(p.startDate);
      return projectDate.getFullYear() === currentDate.getFullYear() && projectDate.getMonth() === currentDate.getMonth();
    });
  }, [projects, currentDate]);

  const ongoingProjects = useMemo(() => filteredProjects.filter(p => p.progress < 100 && p.progress > 0), [filteredProjects]);
  const monthlyRevenue = useMemo(() => ongoingProjects.reduce((acc, p) => acc + p.value, 0), [ongoingProjects]);
  
  const projectTypesData = useMemo(() => {
    const types = ongoingProjects.reduce((acc, p) => {
      const typeKey = p.projectType.split(' - ')[0] || 'Outro'; // Simplify project type
      acc[typeKey] = (acc[typeKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [ongoingProjects]);

  const professionalWorkload = useMemo(() => {
    return MOCK_TEAM.map(member => ({
      name: member.name.split(' ')[0],
      projetos: ongoingProjects.filter(p => p.teamIds.includes(member.id)).length,
    }));
  }, [ongoingProjects]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  
  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto custom-scroll md:overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 bg-white dark:bg-onyx p-4 px-6 rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-sm">
            <div>
                <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Análise de Desempenho</h2>
                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.3em]">Métricas do Atelier</p>
            </div>
            <div className="flex items-center gap-3 bg-stone-50 dark:bg-white/5 p-2 rounded-xl border border-stone-200 dark:border-white/10">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-stone-200 dark:hover:bg-white/10 rounded-lg transition-colors"><ArrowLeft size={16} /></button>
                <span className="text-sm font-bold text-stone-700 dark:text-stone-300 w-40 text-center capitalize">{monthName}</span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-stone-200 dark:hover:bg-white/10 rounded-lg transition-colors"><ArrowRight size={16} /></button>
            </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            <KpiCard icon={Briefcase} label="Projetos em Andamento" value={ongoingProjects.length} />
            <KpiCard icon={DollarSign} label="Receita no Mês" value={`R$ ${monthlyRevenue.toLocaleString('pt-BR')}`} />
            <KpiCard icon={Users} label="Equipe Envolvida" value={professionalWorkload.filter(p => p.projetos > 0).length} />
            <KpiCard icon={CheckCircle} label="Projetos Concluídos" value={filteredProjects.filter(p => p.progress === 100).length} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
            {/* Project Progress List */}
            <div className="lg:col-span-2 bg-white dark:bg-onyx p-6 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm flex flex-col">
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white mb-4 uppercase tracking-tight">Progresso dos Projetos</h3>
                <div className="flex-1 overflow-y-auto custom-scroll pr-2 space-y-3">
                    {ongoingProjects.length > 0 ? ongoingProjects.map(p => (
                        <div key={p.id} className="p-3 bg-stone-50/50 dark:bg-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] font-bold text-stone-800 dark:text-stone-200 truncate">{p.clientName}</p>
                                <span className="text-[9px] font-bold text-gold">{p.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full gold-bg" style={{ width: `${p.progress}%` }} />
                            </div>
                        </div>
                    )) : <p className="text-center text-sm text-stone-400 italic mt-10">Nenhum projeto em andamento neste mês.</p>}
                </div>
            </div>

            {/* Charts Section */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Project Types */}
                <div className="md:col-span-2 bg-white dark:bg-onyx p-6 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm flex flex-col">
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white mb-4 uppercase tracking-tight">Distribuição de Projetos</h3>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={projectTypesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {projectTypesData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend iconSize={10} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Professional Workload */}
                <div className="md:col-span-2 bg-white dark:bg-onyx p-6 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm flex flex-col">
                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white mb-4 uppercase tracking-tight">Carga por Profissional</h3>
                     <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={professionalWorkload} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" className="dark:stroke-white/5" />
                                <XAxis type="number" allowDecimals={false} tick={{fontSize: 10}} />
                                <YAxis type="category" dataKey="name" width={60} tick={{fontSize: 10}} />
                                <Tooltip />
                                <Bar dataKey="projetos" name="Nº de Projetos" fill="#D4AF37" barSize={15} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const KpiCard: React.FC<{icon: React.ElementType, label: string, value: string | number}> = ({ icon: Icon, label, value }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-onyx p-5 rounded-[1.5rem] border border-stone-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 bg-stone-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gold border border-stone-200 dark:border-white/10">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white mt-0.5">{value}</h3>
        </div>
    </motion.div>
);

export default AnalyticsDashboard;
