import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { projectService } from '../services/projectService';
import { Project } from '../types';

const ClientLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const users = await userService.getUsers();
      const client = users.find(u => u.email === email && u.role === 'CLIENT');

      if (!client) {
        setError('Cliente não encontrado. Verifique o e-mail.');
        setIsLoading(false);
        return;
      }

      if (client.password !== password) {
        setError('Senha incorreta.');
        setIsLoading(false);
        return;
      }

      // Cliente autenticado
      setClientData(client);

      // Buscar projetos do cliente
      const projects = await projectService.getProjects();
      const myProjects = projects.filter(p => p.clientEmail === client.email);
      setClientProjects(myProjects);
    } catch (error) {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-black to-stone-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {!clientData ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center">
                  <Zap className="text-black" size={32} />
                </div>
              </motion.div>
              <h1 className="text-3xl font-serif font-bold text-white">Braga Marmoraria</h1>
              <p className="text-gold text-sm font-semibold tracking-widest uppercase">Portal do Cliente</p>
              <p className="text-stone-400 text-sm mt-2">Acompanhe a evolução do seu projeto em tempo real</p>
            </div>

            {/* Login Form */}
            <motion.form
              onSubmit={handleLogin}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2"
                >
                  <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-red-200 text-sm">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-300 block">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gold/50 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-300 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gold/50 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gold/50 hover:text-gold transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gold text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <LogIn size={20} /> Acessar
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar para página inicial
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-stone-500">
              Não tem conta? Fale com a Braga Marmoraria para criar seu acesso.
            </p>
          </div>
        ) : (
          /* Projects List */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Welcome */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold to-yellow-500 flex items-center justify-center text-2xl">
                {clientData.avatar ? (
                  <img src={clientData.avatar} alt={clientData.name} className="w-full h-full rounded-full" />
                ) : (
                  clientData.name[0]
                )}
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">Olá, {clientData.name}!</h2>
              <p className="text-stone-400 text-sm">Escolha um projeto para acompanhar</p>
            </div>

            {/* Projects */}
            {clientProjects.length > 0 ? (
              <div className="space-y-3">
                {clientProjects.map((project) => (
                  <motion.button
                    key={project.id}
                    onClick={() => navigate(`/client/project/${project.id}`)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white/5 border border-white/10 hover:border-gold/50 rounded-xl p-4 text-left transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{project.projectType}</h3>
                        <p className="text-sm text-stone-400 mt-1">{project.concept}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="text-xs text-stone-500">
                            Status: <span className="text-gold font-semibold">{project.status}</span>
                          </div>
                          <div className="text-xs text-stone-500">
                            Progresso: <span className="text-gold font-semibold">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-serif font-bold text-gold">R$ {(project.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                        <p className="text-xs text-stone-400 mt-1">Valor total</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-stone-700/50 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold to-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-stone-400">Você não possui projetos associados.</p>
                <p className="text-xs text-stone-500 mt-2">Fale com a Braga Marmoraria para adicionar seus projetos.</p>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={() => {
                setClientData(null);
                setClientProjects([]);
                setEmail('');
                setPassword('');
              }}
              className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-white transition-colors py-2"
            >
              <ArrowLeft size={20} />
              Sair
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ClientLoginPage;
