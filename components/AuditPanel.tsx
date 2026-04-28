
import React, { useState, useEffect } from 'react';
import {
  Eye, Activity, Users, Zap, TrendingUp, AlertCircle, Download,
  Search, Filter, Calendar, ChevronDown, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auditService, AuditLog } from '../services/auditService';
import { useAuth } from './AuthContext';

const AuditPanel: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auditService.subscribeToLogs(setLogs);
    return () => unsubscribe();
  }, []);

  const canAccess = currentUser?.role === 'SUPPORT';

  if (!canAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <ShieldAlert size={48} className="text-red-500" />
        <h3 className="text-xl font-bold text-stone-900 dark:text-white uppercase tracking-tight">
          Acesso Restrito
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">
          Apenas o perfil de Suporte Técnico pode acessar este painel de auditoria.
        </p>
      </div>
    );
  }

  const stats = auditService.getStats();
  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = !filterAction || log.action === filterAction;
    const matchesUser = !filterUser || log.userId === filterUser;

    let matchesDate = true;
    if (startDate && endDate) {
      const logDate = new Date(log.timestamp).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      matchesDate = logDate >= start && logDate <= end;
    }

    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const uniqueUsers = Array.from(new Set(logs.map(l => l.userId)));
  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (action.includes('DELETE')) return 'bg-red-50 text-red-600 border-red-100';
    if (action.includes('UPDATE')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (action.includes('LOGIN')) return 'bg-purple-50 text-purple-600 border-purple-100';
    return 'bg-stone-50 text-stone-600 border-stone-100';
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">
            Painel de Auditoria
          </h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">
            Monitoramento completo de todas as ações do sistema
          </p>
        </div>
        <button
          onClick={() => {
            const data = auditService.exportLogs();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="gold-bg px-6 py-3 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Download size={16} />
          Exportar Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total de Logs', value: logs.length, icon: Activity },
          { label: 'Usuários Ativos', value: stats.activeUsers.length, icon: Users },
          { label: 'Projetos Criados', value: stats.projectsCreated, icon: Zap },
          { label: 'Acessos', value: stats.totalLogins, icon: Eye },
          { label: 'Tarefas Concluídas', value: stats.tasksCompleted, icon: TrendingUp },
          { label: 'Erros', value: stats.errorCount, icon: AlertCircle, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-onyx p-4 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={14} className={stat.color || 'text-gold'} />
              <span className="text-lg font-serif font-bold text-stone-950 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Most Active Functions */}
      {stats.mostActiveFunctions.length > 0 && (
        <div className="bg-white dark:bg-onyx p-6 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4">
            Funcionalidades Mais Usadas
          </h3>
          <div className="space-y-3">
            {stats.mostActiveFunctions.slice(0, 5).map((func, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-white/5 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">
                  {func.name}
                </span>
                <div className="flex items-center gap-3">
                  <div className="h-2 bg-stone-100 dark:bg-white/5 rounded-full w-32 overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{ width: `${(func.count / stats.mostActiveFunctions[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 w-8 text-right">
                    {func.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-onyx p-6 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 ml-1 block mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Usuário, ação, descrição..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 ml-1 block mb-2">
              Ação
            </label>
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold appearance-none transition-all"
            >
              <option value="">Todas as ações</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 ml-1 block mb-2">
              Usuário
            </label>
            <select
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold appearance-none transition-all"
            >
              <option value="">Todos os usuários</option>
              {uniqueUsers.map(userId => {
                const userName = logs.find(l => l.userId === userId)?.userName;
                return (
                  <option key={userId} value={userId}>{userName}</option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 ml-1 block mb-2">
              Data Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="flex-1 px-2 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="flex-1 px-2 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-onyx rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Horário</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Usuário</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Ação</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Recurso</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                    <p className="text-sm font-bold uppercase tracking-widest">Nenhum log encontrado</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-stone-50/50 dark:hover:bg-white/[0.01] transition-all group cursor-pointer" onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-widest">
                          {new Date(log.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-stone-950 dark:text-white uppercase tracking-tight">{log.userName}</p>
                          <p className="text-[8px] text-stone-400 font-serif italic">{log.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[9px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-tight truncate">{log.resourceName}</p>
                          <p className="text-[8px] text-stone-400">{log.resource}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <ChevronDown size={14} className={`transition-transform ${expandedLog === log.id ? 'rotate-180' : ''}`} />
                      </td>
                    </tr>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedLog === log.id && (
                        <motion.tr
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-stone-50/50 dark:bg-white/[0.02]"
                        >
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                                  Descrição
                                </p>
                                <p className="text-sm text-stone-700 dark:text-stone-300">{log.description}</p>
                              </div>
                              {log.details && Object.keys(log.details).length > 0 && (
                                <div>
                                  <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                                    Detalhes Adicionais
                                  </p>
                                  <div className="bg-black/20 rounded-lg p-3 overflow-x-auto">
                                    <pre className="text-[8px] font-mono text-stone-300">
                                      {JSON.stringify(log.details, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              {log.duration && (
                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                                  ⏱️ Duração: {log.duration}ms
                                </p>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditPanel;
