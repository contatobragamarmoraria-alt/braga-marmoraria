
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Columns, X, Home, 
  BarChart3, PanelLeftClose, PanelLeft,
  ChevronLeft, Sparkles, Sun, Moon, TrendingUp,
  Settings, Megaphone, Monitor, Users, MessageSquare,
  Layout, LayoutTemplate, Bot, LogOut, History, Calendar, Trash2, LogIn, User, Compass, Library
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import EntryPage from './components/EntryPage';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import SalesFlow from './components/SalesFlow';
import ClientView from './components/ClientView';
import ProjectMasterView from './components/ProjectMasterView';
import ClientsList from './components/ClientsList';
import PartnersList from './components/PartnersList';
import ImportCenter from './components/ImportCenter';
import ConversationSummarizer from './components/ConversationSummarizer';
import ChatGPT from './components/ChatGPT';
import SettingsPage from './components/SettingsPage';
import OccurrenceHistory from './components/OccurrenceHistory';
import GlobalCalendar from './components/GlobalCalendar';
import ProjectListModule from './components/ProjectListModule';
import ProjectSupabaseDetail from './components/ProjectSupabaseDetail';
import Trash from './components/Trash';
import WhatsAppMirror from './components/WhatsAppMirror';
import UserProfile from './components/UserProfile';
import ClientPortal from './components/ClientPortal';
import CatalogModule from './components/CatalogModule';
import { MOCK_USER } from './constants';
import { Project, AppUser } from './types';
import { initialProjects } from './services/mockData';
import { AuthProvider, useAuth } from './components/AuthContext';
import { projectService } from './services/projectService';

const SidebarLink = ({ to, icon: Icon, label, active, isCollapsed, onClick }: { to: string, icon: any, label: string, active: boolean, isCollapsed: boolean, onClick?: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-2.5 md:py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'gold-bg text-black shadow-lg shadow-gold/20' 
        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-950 dark:hover:text-white'
    }`}
  >
    <Icon size={18} className="shrink-0" />
    {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">{label}</span>}
  </Link>
);

const BottomNavLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
      active 
        ? 'text-gold' 
        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? 'drop-shadow-md' : ''} />
    <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
  </Link>
);

const AppLayout = ({ children, onOpenImport, theme, toggleTheme }: { 
  children?: React.ReactNode, 
  onOpenImport: () => void,
  theme: 'light' | 'dark',
  toggleTheme: () => void
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLP = location.pathname === '/';
  const isClient = location.pathname.startsWith('/client/');
  const isMainTab = ['/app/dashboard', '/app/vendas', '/app/projetos', '/app/proprietarios', '/app/marketing', '/app/conversas', '/app/configuracoes'].includes(location.pathname);

  if (isLP || isClient) {
    return <div className="min-h-screen overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="flex min-h-[100dvh] bg-ivory dark:bg-onyx transition-colors duration-500">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-[100] bg-white dark:bg-onyx border-r border-stone-200 dark:border-white/5 transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isCollapsed ? 'w-20' : 'w-64'}
        md:sticky md:translate-x-0 md:top-0 h-[100dvh] flex flex-col shrink-0
      `}>
        <div className="flex flex-col h-full py-4 md:py-6">
          <div className={`px-6 mb-6 md:mb-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <img src="/logo.png.jpg" alt="Braga Marmoraria" className="h-8 md:h-10 w-auto aspect-square object-cover mix-blend-multiply rounded-full shrink-0 transition-transform rotate-[45deg]" />
                <h1 className="text-[11px] font-bold tracking-tight text-stone-950 dark:text-white uppercase whitespace-nowrap">
                  Braga Marmoraria
                </h1>
              </div>
            )}
            {isCollapsed && (
               <img src="/logo.png.jpg" alt="Braga Marmoraria" className="w-6 h-6 object-cover mix-blend-multiply rounded-full shrink-0 transition-transform rotate-[45deg]" />
            )}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:block p-1.5 text-stone-400 hover:text-gold transition-all">
              {isCollapsed ? <PanelLeft size={18}/> : <PanelLeftClose size={18}/>}
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1.5 text-stone-400 hover:text-gold">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
            <SidebarLink to="/app/dashboard" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/app/dashboard'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/vendas" icon={TrendingUp} label="Comercial" active={location.pathname === '/app/vendas'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/catalogo" icon={Library} label="Catálogo" active={location.pathname === '/app/catalogo'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/projetos-lista" icon={LayoutTemplate} label="Projetos" active={location.pathname === '/app/projetos-lista'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/projetos" icon={Columns} label="Produção" active={location.pathname === '/app/projetos'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/proprietarios" icon={Users} label="Clientes" active={location.pathname === '/app/proprietarios'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/historico" icon={History} label="Histórico" active={location.pathname === '/app/historico'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/calendario" icon={Calendar} label="Calendário" active={location.pathname === '/app/calendario'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/lixeira" icon={Trash2} label="Lixeira" active={location.pathname === '/app/lixeira'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/whatsapp" icon={MessageSquare} label="WhatsApp" active={location.pathname === '/app/whatsapp'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/conversas" icon={MessageSquare} label="Conversas" active={location.pathname === '/app/conversas'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/portal-do-cliente" icon={Compass} label="Portal Cliente" active={location.pathname === '/app/portal-do-cliente'} isCollapsed={isCollapsed} />
            <SidebarLink to="/app/perfil" icon={User} label="Meu Perfil" active={location.pathname === '/app/perfil'} isCollapsed={isCollapsed} />

            <div className="border-t border-stone-100 dark:border-white/5 mx-3 my-2 md:my-3" />
            <SidebarLink to="/app/configuracoes" icon={Settings} label="Ajustes" active={location.pathname === '/app/configuracoes'} isCollapsed={isCollapsed} />
            
            <div className="pt-2 md:pt-6 px-2">
               <button onClick={() => onOpenImport()} className={`hidden w-full flex items-center gap-3 px-3 py-2.5 md:py-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-gold hover:bg-stone-100 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
                 <Sparkles size={18} className="shrink-0" />
                 {!isCollapsed && <span className="text-[9px] font-bold uppercase tracking-widest">Sincronia IA</span>}
               </button>
            </div>
          </nav>

          <div className="px-3 pt-4 md:pt-6 border-t border-stone-100 dark:border-white/5 space-y-1.5 md:space-y-2 shrink-0">
            <button 
              onClick={async () => {
                await logout();
                navigate('/');
              }} 
              className={`w-full flex items-center gap-3 px-4 py-2.5 md:py-3 text-stone-500 hover:text-red-500 transition-all ${isCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={16} />
              {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">Sair</span>}
            </button>
            <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-4 py-2.5 md:py-3 text-stone-500 hover:text-stone-950 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {!isCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest">{theme === 'dark' ? 'Dia' : 'Noite'}</span>}
            </button>
            <div className={`flex items-center gap-3 px-4 py-2 md:py-3 rounded-xl bg-stone-50 dark:bg-white/5 ${isCollapsed ? 'justify-center' : ''}`}>
              <img src={user?.avatar || MOCK_USER.avatar} alt="User" className="w-6 h-6 rounded-lg" />
              {!isCollapsed && <p className="text-[9px] font-bold text-stone-900 dark:text-white truncate uppercase tracking-widest">{user?.name || MOCK_USER.name}</p>}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="sticky top-0 flex items-center justify-between p-4 bg-white/90 backdrop-blur dark:bg-onyx/90 border-b border-stone-200 dark:border-white/5 shrink-0 z-50">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-stone-600 dark:text-gold hover:bg-stone-50 rounded-lg transition-all"><PanelLeft size={24} /></button>
            {!isMainTab && (
              <button onClick={() => navigate(-1)} className="p-2.5 text-stone-500 hover:text-stone-950 dark:text-stone-400 transition-all border border-stone-200 dark:border-white/5 rounded-xl flex items-center gap-2 bg-white dark:bg-white/5"><ChevronLeft size={16} /><span className="text-[9px] font-bold uppercase tracking-widest">Voltar</span></button>
            )}
            <button onClick={() => navigate('/app/dashboard')} className="hidden md:flex p-2.5 text-stone-500 hover:text-stone-950 dark:text-stone-400 transition-all border border-stone-200 dark:border-white/5 rounded-xl items-center gap-2 bg-white dark:bg-white/5"><Home size={16} /><span className="text-[9px] font-bold uppercase tracking-widest">Início</span></button>
          </div>
          <div className="flex items-center gap-2 md:gap-3 px-2">
            <img src="/logo.png.jpg" alt="Braga Marmoraria" className="h-6 md:h-8 w-auto aspect-square object-cover mix-blend-multiply rounded-full shrink-0 transition-transform rotate-[45deg]" />
            <h1 className="text-[9px] md:text-sm font-bold tracking-tight text-stone-950 dark:text-white uppercase whitespace-nowrap">
              Braga Marmoraria
            </h1>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 flex flex-col relative w-full">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="h-full">
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation for Mobile */}
        <nav className="md:hidden bg-white dark:bg-onyx border-t border-stone-200 dark:border-white/5 shrink-0 flex justify-around items-center h-16 px-2 pb-[env(safe-area-inset-bottom)] z-50">
          <BottomNavLink to="/app/dashboard" icon={LayoutDashboard} label="Início" active={location.pathname === '/app/dashboard'} />
          <BottomNavLink to="/app/vendas" icon={TrendingUp} label="Vendas" active={location.pathname === '/app/vendas'} />
          <BottomNavLink to="/app/projetos-lista" icon={LayoutTemplate} label="Projetos" active={location.pathname === '/app/projetos-lista'} />
          <BottomNavLink to="/app/projetos" icon={Columns} label="Produção" active={location.pathname === '/app/projetos'} />
          <BottomNavLink to="/app/proprietarios" icon={Users} label="Clientes" active={location.pathname === '/app/proprietarios'} />
          <BottomNavLink to="/app/conversas" icon={MessageSquare} label="Chat" active={location.pathname === '/app/conversas'} />
        </nav>
      </main>
    </div>
  );
};

const AppContent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('obrapositiva-theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('obrapositiva-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      const unsubscribe = projectService.subscribeToProjects((updatedProjects) => {
        setProjects(prev => {
          if (JSON.stringify(prev) === JSON.stringify(updatedProjects)) {
            return prev;
          }
          return updatedProjects;
        });
      });
      return () => unsubscribe();
    }
  }, [user]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const updateProject = async (updatedProject: Project) => {
    await projectService.updateProject(updatedProject);
  };

  const addProject = async (newProject: Project) => {
    await projectService.addProject(newProject);
  };
  
  const deleteProject = async (projectId: string) => {
    await projectService.softDeleteProject(projectId);
  };

  const restoreProject = async (projectId: string) => {
    await projectService.restoreProject(projectId);
  };

  const deletePermanent = async (projectId: string) => {
    await projectService.deletePermanent(projectId);
  };

  const ProtectedRoute = ({ children, permission }: { children: React.ReactNode, permission?: keyof AppUser['permissions'] }) => {
    const { loginWithRole, loginAsGuest } = useAuth();
    const [loginName, setLoginName] = useState('Braga');
    const [loginPin, setLoginPin] = useState('');
    const [isClientMode, setIsClientMode] = useState(false);

    const TEAM_MEMBERS_CREDENTIALS = [
      { name: 'Braga', role: 'ADMIN', pin: '10001' },
      { name: 'Jamile', role: 'MANAGER', pin: '20002' },
      { name: 'Silvio', role: 'TEAM_MEMBER', pin: '30003' },
      { name: 'Marcos', role: 'TEAM_MEMBER', pin: '30004' },
      { name: 'Rafael', role: 'PARTNER', pin: '40001' },
      { name: 'Léo', role: 'TEAM_MEMBER', pin: '50001' },
      { name: 'Pedro', role: 'TEAM_MEMBER', pin: '50002' },
      { name: 'Rafa', role: 'TEAM_MEMBER', pin: '50003' },
      { name: 'Danilo', role: 'TEAM_MEMBER', pin: '60001' },
      { name: 'Vitor', role: 'TEAM_MEMBER', pin: '70001' },
      { name: 'Sr Vicente', role: 'TEAM_MEMBER', pin: '70002' },
      { name: 'Edivaldo', role: 'TEAM_MEMBER', pin: '70003' },
      { name: 'Edson', role: 'PARTNER', pin: '80001' }
    ];

    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-ivory dark:bg-onyx">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
    
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-ivory dark:bg-onyx p-4">
          <div className="max-w-md w-full bg-white dark:bg-onyx p-10 rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
               <div className="w-20 h-20 bg-stone-950 text-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                 <Sparkles size={32} />
               </div>
              <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Braga Marmoraria</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest">Acesso Restrito</p>
            </div>

            <div className="space-y-5">
               <div className="flex bg-stone-100 dark:bg-white/5 rounded-2xl p-1">
                  <button onClick={() => { setIsClientMode(false); setLoginName('Braga'); setLoginPin(''); }} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${!isClientMode ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>Sou Equipe</button>
                  <button onClick={() => { setIsClientMode(true); setLoginName(''); setLoginPin(''); }} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${isClientMode ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>Sou Cliente</button>
               </div>

               {!isClientMode ? (
                 <>
                   <div>
                     <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Quem está acessando?</label>
                     <select 
                       value={loginName}
                       onChange={e => setLoginName(e.target.value)}
                       className="w-full p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-sm focus:border-gold outline-none"
                     >
                       {TEAM_MEMBERS_CREDENTIALS.map(m => (
                         <option key={m.name} value={m.name}>{m.name} ({m.role === 'ADMIN' ? 'Diretoria' : m.role === 'MANAGER' ? 'Comercial' : 'Operacional'})</option>
                       ))}
                     </select>
                   </div>
                 </>
               ) : (
                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Seu Nome Completo</label>
                   <input 
                     type="text" 
                     value={loginName}
                     onChange={e => setLoginName(e.target.value)}
                     className="w-full p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-sm focus:border-gold outline-none"
                     placeholder="Ex: João Vitor"
                   />
                 </div>
               )}

               <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Código de 5 Dígitos (PIN)</label>
                 <input 
                   type="password" 
                   maxLength={5}
                   value={loginPin}
                   onChange={e => setLoginPin(e.target.value.replace(/\D/g, ''))}
                   className="w-full p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-center text-xl font-bold tracking-widest focus:border-gold outline-none"
                   placeholder="•••••"
                 />
               </div>

              <button 
                onClick={async () => {
                  if (loginPin.length !== 5) return alert('O código (PIN) deve ter exatamente 5 dígitos numéricos.');
                  if (!loginName) return alert('Informe ou selecione seu nome.');
                  
                  let assignedRole = 'CLIENT';

                  if (!isClientMode) {
                     const memberConfig = TEAM_MEMBERS_CREDENTIALS.find(m => m.name === loginName);
                     if (!memberConfig) return alert('Usuário inválido.');
                     if (memberConfig.pin !== loginPin) return alert('Código/PIN incorreto para este usuário!');
                     assignedRole = memberConfig.role;
                  } else {
                     // In the future, validate client PIN with Supabase record
                     console.log("Client login with PIN", loginPin);
                  }

                  try {
                    await loginWithRole(loginName, assignedRole as any);
                  } catch (err: any) {
                    alert(err.message || 'Erro ao entrar.');
                  }
                }}
                className="w-full py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <LogIn size={16} /> Validar Acesso
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (permission && !(user.permissions as any)[permission]) {
      return <Navigate to="/app/dashboard" replace />;
    }

    return <>{children}</>;
  };

  const activeProjects = projects.filter(p => !p.deletedAt);

  return (
    <>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/app/dashboard" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><Dashboard projects={activeProjects} updateProject={updateProject} addProject={addProject} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/vendas" element={<ProtectedRoute permission="canViewFinancials"><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><SalesFlow /></AppLayout></ProtectedRoute>} />
        <Route path="/app/catalogo" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><CatalogModule /></AppLayout></ProtectedRoute>} />
        <Route path="/app/projetos-lista" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><ProjectListModule /></AppLayout></ProtectedRoute>} />
        <Route path="/app/projetos-detalhe/:id" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><ProjectSupabaseDetail /></AppLayout></ProtectedRoute>} />
        <Route path="/app/projetos" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><KanbanBoard projects={activeProjects} updateProject={updateProject} addProject={addProject} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/proprietarios" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><ClientsList projects={activeProjects} onDelete={deleteProject} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/historico" element={<ProtectedRoute permission="canViewOccurrences"><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><OccurrenceHistory /></AppLayout></ProtectedRoute>} />
        <Route path="/app/calendario" element={<ProtectedRoute permission="canViewCalendar"><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><GlobalCalendar projects={activeProjects} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/whatsapp" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><WhatsAppMirror projects={activeProjects} onGenerateProject={addProject} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/conversas" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><ConversationSummarizer projects={activeProjects} updateProject={updateProject} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/configuracoes" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><SettingsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/app/perfil" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><UserProfile user={user!} onUpdate={(u) => {/* trigger update if needed */}} onLogout={logout} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/portal-do-cliente" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><ClientPortal user={user!} projects={activeProjects} onNavigate={(tab, id) => navigate(id ? `/project/${id}` : `/app/${tab}`)} /></AppLayout></ProtectedRoute>} />
        <Route path="/app/lixeira" element={<ProtectedRoute permission="canDeleteProjects"><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><Trash projects={projects} onRestore={restoreProject} onDeletePermanent={deletePermanent} /></AppLayout></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><AppLayout theme={theme} toggleTheme={toggleTheme} onOpenImport={() => setIsImportOpen(true)}><ProjectMasterView projects={projects} updateProject={updateProject} deleteProject={deleteProject} /></AppLayout></ProtectedRoute>} />
        <Route path="/client/:id" element={<ClientView projects={activeProjects} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isImportOpen && <ImportCenter onImport={async (data) => {
        try {
          const areaInfo = data.endereco_obra || 'N/D';
          const nameInfo = data.nome_cliente ? `Projeto ${data.nome_cliente}` : 'Projeto Importado';
          
          const teamAllocation = `
---
EQUIPE ALOCADA AUTOMATICAMENTE (IA):
• Vendas: Jamile, Braga
• Medidores: Léo, Pedro, Rafa, Braga
• Conferentes: Léo, Pedro
• Serrador: Danilo
• Acabadores: Vitor, Sr Vicente, Edivaldo
• Instalador: Edson
• Ajudantes: Silvio, Marcos
• Motorista: Rafael
• Compradores: Braga, Jamile`;

          const supabasePayload: any = {
            name: nameInfo,
            client_name: data.nome_cliente || 'N/D',
            type: data.tipo_projeto || 'Geral',
            area: areaInfo,
            address: areaInfo,
            description: (data.materiais_mencionados ? `Materiais: ${data.materiais_mencionados}\n` : '') + 
                         (data.prazos_estimados ? `Prazos: ${data.prazos_estimados}\n` : '') +
                         (data.observacoes_tecnicas ? `Obs: ${data.observacoes_tecnicas}\n` : '') +
                         (data.valor_total ? `Valor: R$ ${data.valor_total}\n` : '') +
                         teamAllocation,
            status: 'AGUARDANDO_MEDICAO',
            timeline: [
              { label: 'Lead', completed: true },
              { label: 'Medição', completed: false },
              { label: 'Corte', completed: false },
              { label: 'Acabamento', completed: false },
              { label: 'Instalação', completed: false }
            ],
            audit_logs: [{
              id: Math.random().toString(36).substr(2, 9),
              action: 'Projeto importado e equipe técnica alocada via IA',
              user: 'Sistema IA',
              device: 'Nuvem',
              date: new Date().toLocaleString('pt-BR')
            }]
          };

          // try to add to supabase table
          try {
            const { supabaseProjectService } = await import('./services/supabaseProjectService');
            await supabaseProjectService.createProject(supabasePayload);
          } catch(e) { console.error("Supabase fail", e); } 

          setIsImportOpen(false);
          alert('Projeto criado e equipe alocada com sucesso!');
          navigate('/app/projetos-lista');
          // Force reload to fetch new data from Supabase if not using realtime
          setTimeout(() => window.location.reload(), 500);
        } catch (error) {
          alert('Erro ao criar projeto: ' + error);
        }
      }} onClose={() => setIsImportOpen(false)} />}
    </>
  );
};

const App = () => (
  <HashRouter>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </HashRouter>
);

export default App;
