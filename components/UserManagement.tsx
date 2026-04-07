
import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Shield, ShieldAlert, ShieldCheck, 
  MoreVertical, Mail, User, Trash2, CheckCircle2, 
  XCircle, Filter, Search, ChevronDown, UserCog, Edit3, DollarSign, Ruler, Calendar, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppUser, UserRole, UserPermissions } from '../types';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';
import UserProfile from './UserProfile';

const DEFAULT_PERMISSIONS: UserPermissions = {
  canViewFinancials: false,
  canViewTechnical: true,
  canViewCalendar: true,
  canViewOccurrences: true,
  canEditProjects: false,
  canDeleteProjects: false,
  canManageUsers: false,
};

const ADMIN_PERMISSIONS: UserPermissions = {
  canViewFinancials: true,
  canViewTechnical: true,
  canViewCalendar: true,
  canViewOccurrences: true,
  canEditProjects: true,
  canDeleteProjects: true,
  canManageUsers: true,
};

const RoleBadge = ({ role }: { role: UserRole }) => {
  const configs: Record<UserRole, { label: string, color: string, icon: any }> = {
    ADMIN: { label: 'Administrador', color: 'bg-gold/10 text-gold border-gold/20', icon: ShieldCheck },
    MANAGER: { label: 'Gerente', color: 'bg-stone-900 text-white border-stone-800', icon: Shield },
    TEAM_MEMBER: { label: 'Equipe', color: 'bg-stone-100 text-stone-600 border-stone-200', icon: User },
    CLIENT: { label: 'Cliente', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
    PARTNER: { label: 'Parceiro', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: UserCog }
  };

  const config = configs[role];
  const Icon = config.icon;

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${config.color}`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
};

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState<AppUser | null>(null);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState<Partial<AppUser>>({
    role: 'CLIENT',
    status: 'ACTIVE'
  });

  useEffect(() => {
    const unsubscribe = userService.subscribeToUsers((usersData) => {
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const id = Math.random().toString(36).substr(2, 9);
    const user: AppUser = {
      id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      status: 'ACTIVE',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`,
      createdAt: new Date().toISOString(),
      permissions: newUser.role === 'ADMIN' ? ADMIN_PERMISSIONS : DEFAULT_PERMISSIONS
    };

    await userService.addUser(user);
    setIsAddingUser(false);
    setNewUser({ role: 'CLIENT', status: 'ACTIVE' });
  };

  const handleUpdatePermissions = async (userId: string, permissions: UserPermissions) => {
    if (window.confirm('Confirmar alteração de níveis de acesso?')) {
      await userService.updateUser(userId, { permissions });
      setEditingPermissions(null);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    await userService.updateUser(id, { status: newStatus });
  };

  const deleteUser = async (id: string) => {
    if (id === currentUser?.id) {
      alert('Você não pode remover seu próprio acesso.');
      return;
    }
    
    const userToDelete = users.find(u => u.id === id);
    const confirmMessage = userToDelete?.role === 'CLIENT' 
      ? 'Tem certeza que deseja remover este cliente? Todos os projetos associados serão movidos para a lixeira.'
      : 'Tem certeza que deseja remover este usuário?';

    if (window.confirm(confirmMessage)) {
      await userService.deleteUser(id);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser?.permissions.canManageUsers && currentUser?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <ShieldAlert size={48} className="text-red-500" />
        <h3 className="text-xl font-bold text-stone-900 dark:text-white uppercase tracking-tight">Acesso Restrito</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">Você não possui permissões administrativas para gerenciar usuários do sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Gestão de Acessos</h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Controle quem entra no seu ecossistema</p>
        </div>
        <button 
          onClick={() => setIsAddingUser(true)}
          className="gold-bg px-6 py-3 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
        >
          <UserPlus size={16} />
          Novo Usuário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total de Usuários', value: users.length, icon: User },
          { label: 'Acessos Ativos', value: users.filter(u => u.status === 'ACTIVE').length, icon: ShieldCheck },
          { label: 'Acessos Revogados', value: users.filter(u => u.status === 'REVOKED').length, icon: ShieldAlert },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-onyx p-6 rounded-3xl border border-stone-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={18} className="text-gold" />
              <span className="text-2xl font-serif font-bold text-stone-950 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-onyx p-4 rounded-2xl border border-stone-200 dark:border-white/5 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-gold transition-all"
          />
        </div>
        <button className="p-3 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl text-stone-400 hover:text-gold transition-all">
          <Filter size={18} />
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-onyx rounded-[2rem] border border-stone-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Usuário</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Nível de Acesso</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Último Acesso</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 dark:hover:bg-white/[0.01] transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-stone-200 dark:border-white/10" />
                        <div>
                          <h4 className="text-sm font-bold text-stone-950 dark:text-white uppercase tracking-tight">{user.name}</h4>
                          <p className="text-xs text-stone-400 font-serif italic">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                        user.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {user.status === 'ACTIVE' ? 'Ativo' : 'Revogado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{user.lastLogin || 'Nunca'}</p>
                      <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-0.5">Criado em {new Date(user.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-stone-400 hover:text-gold hover:bg-gold/5 rounded-lg transition-all"
                          title="Editar Perfil"
                        >
                          <User size={18} />
                        </button>
                        <button 
                          onClick={() => setEditingPermissions(user)}
                          className="p-2 text-stone-400 hover:text-gold hover:bg-gold/5 rounded-lg transition-all"
                          title="Editar Permissões"
                        >
                          <Shield size={18} />
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          title={user.status === 'ACTIVE' ? 'Revogar Acesso' : 'Ativar Acesso'}
                          className={`p-2 rounded-lg transition-all ${
                            user.status === 'ACTIVE' 
                              ? 'text-stone-400 hover:text-red-500 hover:bg-red-50' 
                              : 'text-stone-400 hover:text-emerald-500 hover:bg-emerald-50'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-stone-400 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-stone-400 hover:text-gold rounded-lg transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddingUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingUser(false)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Novo Acesso</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Defina as credenciais e permissões</p>
                  </div>
                  <button onClick={() => setIsAddingUser(false)} className="p-2 text-stone-400 hover:text-stone-950 dark:hover:text-white transition-all">
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddUser} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Nome Completo</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: João Silva"
                        value={newUser.name || ''}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">E-mail de Acesso</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <input 
                        required
                        type="email" 
                        placeholder="Ex: joao@exemplo.com"
                        value={newUser.email || ''}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Nível de Permissão</label>
                    <div className="relative">
                      <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <select 
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                        className="w-full pl-12 pr-10 py-4 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all appearance-none uppercase font-bold tracking-widest"
                      >
                        <option value="CLIENT">Cliente (Portal do Proprietário)</option>
                        <option value="TEAM_MEMBER">Equipe (Produção/Instalação)</option>
                        <option value="MANAGER">Gerente (Gestão de Projetos)</option>
                        <option value="ADMIN">Administrador (Acesso Total)</option>
                        <option value="PARTNER">Parceiro (Arquitetos/Stakeholders)</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                  >
                    Criar Acesso
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Permissions Modal */}
      <AnimatePresence>
        {editingPermissions && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPermissions(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-stone-950 dark:text-white uppercase tracking-tight">Níveis de Acesso</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Configurando {editingPermissions.name}</p>
                  </div>
                  <button onClick={() => setEditingPermissions(null)} className="p-2 text-stone-400 hover:text-stone-950 dark:hover:text-white transition-all">
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { key: 'canViewFinancials', label: 'Ver Financeiro', icon: DollarSign },
                    { key: 'canViewTechnical', label: 'Ver Área Técnica', icon: Ruler },
                    { key: 'canViewCalendar', label: 'Ver Agenda Global', icon: Calendar },
                    { key: 'canViewOccurrences', label: 'Ver Ocorrências', icon: AlertCircle },
                    { key: 'canEditProjects', label: 'Editar Projetos', icon: Edit3 },
                    { key: 'canDeleteProjects', label: 'Excluir Projetos', icon: Trash2 },
                    { key: 'canManageUsers', label: 'Gerir Usuários', icon: UserCog },
                  ].map((perm) => (
                    <label key={perm.key} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-stone-100 dark:hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <perm.icon size={16} className="text-gold" />
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest">{perm.label}</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={(editingPermissions.permissions as any)[perm.key]}
                        onChange={(e) => {
                          const newPerms = { ...editingPermissions.permissions, [perm.key]: e.target.checked };
                          setEditingPermissions({ ...editingPermissions, permissions: newPerms });
                        }}
                        className="w-5 h-5 rounded border-stone-300 text-gold focus:ring-gold"
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setEditingPermissions(null)}
                    className="flex-1 py-4 bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => handleUpdatePermissions(editingPermissions.id, editingPermissions.permissions)}
                    className="flex-1 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Profile Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scroll"
            >
              <div className="p-8">
                <UserProfile 
                  user={editingUser} 
                  isAdminView={true} 
                  onClose={() => setEditingUser(null)} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
