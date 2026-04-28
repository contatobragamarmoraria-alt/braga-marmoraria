import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Project, ProjectTask } from '../types';

const ClientProjectDashboard: React.FC = () => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'visao' | 'escopo' | 'cronograma' | 'equipe'>('visao');

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projects = await projectService.getProjects();
        const found = projects.find(p => p.id === projectId);
        if (found) {
          setProject(found);
        }
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle size={48} className="text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Projeto não encontrado</h2>
        <p className="text-stone-600 dark:text-stone-400 mt-2">O projeto que você está tentando acessar não existe ou você não tem permissão.</p>
      </div>
    );
  }

  const progressPercentage = project.progress || 0;
  const tasksCompleted = project.tasks?.filter(t => t.completed).length || 0;
  const totalTasks = project.tasks?.length || 0;

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'LEAD_FECHADO': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      'AGUARDANDO_MEDICAO': 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      'MEDICAO_CONCLUIDA': 'text-green-600 bg-green-50 dark:bg-green-900/20',
      'PRODUCAO': 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      'INSTALACAO': 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      'FINALIZADO': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
      'MANUTENCAO': 'text-red-600 bg-red-50 dark:bg-red-900/20',
    };
    return statusColors[status] || 'text-stone-600 bg-stone-50 dark:bg-stone-900/20';
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-black/40 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-onyx rounded-2xl shadow-md p-6 border-l-4 border-gold"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-2">{project.clientName}</h1>
              <p className="text-stone-600 dark:text-stone-400 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-serif font-bold text-gold mb-1">{progressPercentage}%</p>
              <p className="text-sm text-stone-600 dark:text-stone-400">Progresso do Projeto</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-onyx rounded-2xl shadow-md p-6"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-stone-900 dark:text-white">Progresso Geral</h3>
              <span className="text-sm font-semibold text-gold">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-white/10 h-4 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold to-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-onyx rounded-2xl shadow-md p-6 border-t-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Tarefas Completas</p>
                <p className="text-3xl font-bold text-stone-900 dark:text-white mt-2">{tasksCompleted}/{totalTasks}</p>
              </div>
              <CheckCircle2 size={40} className="text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-onyx rounded-2xl shadow-md p-6 border-t-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Valor Total</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  R$ {(project.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>
              <TrendingUp size={40} className="text-green-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-onyx rounded-2xl shadow-md p-6 border-t-4 border-orange-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Data Estimada</p>
                <p className="text-lg font-bold text-stone-900 dark:text-white mt-2">
                  {project.estimatedDelivery ? new Date(project.estimatedDelivery).toLocaleDateString('pt-BR') : 'Indefinida'}
                </p>
              </div>
              <Calendar size={40} className="text-orange-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-onyx rounded-2xl shadow-md p-6 border-t-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Responsável</p>
                <p className="text-lg font-bold text-stone-900 dark:text-white mt-2">{project.responsible || 'Não atribuído'}</p>
              </div>
              <Users size={40} className="text-purple-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-onyx rounded-2xl shadow-md overflow-hidden">
          <div className="flex border-b border-stone-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('visao')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition-colors ${
                activeTab === 'visao'
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('escopo')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition-colors ${
                activeTab === 'escopo'
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Escopo
            </button>
            <button
              onClick={() => setActiveTab('cronograma')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition-colors ${
                activeTab === 'cronograma'
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Cronograma
            </button>
            <button
              onClick={() => setActiveTab('equipe')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition-colors ${
                activeTab === 'equipe'
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Equipe
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'visao' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Informações do Projeto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Tipo de Projeto</p>
                      <p className="text-lg text-stone-900 dark:text-white mt-1">{project.projectType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Método de Pagamento</p>
                      <p className="text-lg text-stone-900 dark:text-white mt-1">{project.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Data Inicial</p>
                      <p className="text-lg text-stone-900 dark:text-white mt-1">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString('pt-BR') : 'Não definida'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-stone-600 dark:text-stone-400 font-semibold">Materiais</p>
                      <p className="text-lg text-stone-900 dark:text-white mt-1">
                        {project.materials?.join(', ') || 'Não definidos'}
                      </p>
                    </div>
                  </div>
                </div>

                {project.notes && (
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Observações</h3>
                    <div className="bg-stone-50 dark:bg-white/5 p-4 rounded-lg text-stone-700 dark:text-stone-300">
                      {project.notes}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'escopo' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Escopo do Projeto</h3>
                {project.detailedScope && project.detailedScope.length > 0 ? (
                  <div className="space-y-4">
                    {project.detailedScope.map((scope: any, idx: number) => (
                      <div key={idx} className="bg-stone-50 dark:bg-white/5 p-4 rounded-lg">
                        <h4 className="font-semibold text-stone-900 dark:text-white mb-2">{scope.title}</h4>
                        <ul className="space-y-1">
                          {scope.items?.map((item: string, i: number) => (
                            <li key={i} className="text-stone-600 dark:text-stone-400 flex items-start gap-2">
                              <span className="text-gold mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-600 dark:text-stone-400">Escopo ainda não foi detalhado.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'cronograma' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Cronograma de Atividades</h3>
                {project.tasks && project.tasks.length > 0 ? (
                  <div className="space-y-3">
                    {project.tasks.map((task: ProjectTask) => (
                      <div key={task.id} className="bg-stone-50 dark:bg-white/5 p-4 rounded-lg flex items-start gap-4">
                        <div className="mt-1">
                          {task.completed ? (
                            <CheckCircle2 size={24} className="text-green-600" />
                          ) : (
                            <Clock size={24} className="text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${task.completed ? 'line-through text-stone-400' : 'text-stone-900 dark:text-white'}`}>
                            {task.name}
                          </h4>
                          {task.scheduledDate && (
                            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                              📅 {new Date(task.scheduledDate).toLocaleDateString('pt-BR')}
                              {task.scheduledTime && ` às ${task.scheduledTime}`}
                            </p>
                          )}
                          {task.priority && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                              Prioridade: {task.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-600 dark:text-stone-400">Cronograma ainda não foi definido.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'equipe' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Equipe Alocada</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
                  {project.teamIds && project.teamIds.length > 0
                    ? `${project.teamIds.length} integrante(s) alocado(s)`
                    : 'Nenhum integrante alocado ainda'}
                </p>
                {project.teamIds && project.teamIds.length > 0 ? (
                  <div className="bg-stone-50 dark:bg-white/5 p-4 rounded-lg text-stone-600 dark:text-stone-400">
                    <p className="text-sm">IDs da equipe: {project.teamIds.join(', ')}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">Mais detalhes sobre a equipe serão exibidos em breve.</p>
                  </div>
                ) : (
                  <p className="text-stone-600 dark:text-stone-400">A equipe será alocada em breve.</p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4"
        >
          <AlertCircle className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Dúvidas sobre seu projeto?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Entre em contato com a Braga Marmoraria para mais detalhes sobre o andamento do seu projeto.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientProjectDashboard;
