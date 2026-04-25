
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, Save, Bell, Lock, LogOut, ChevronRight, Key, Eye, EyeOff, Users, Edit2 } from 'lucide-react';
import { AppUser } from '../types';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';

interface Props {
  user: AppUser;
  onUpdate: (u: Partial<AppUser>) => void;
  onLogout: () => void;
}

const UserProfile: React.FC<Props> = ({ user, onUpdate, onLogout }) => {
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [editingOtherUser, setEditingOtherUser] = useState<AppUser | null>(null);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  React.useEffect(() => {
    if (isAdmin) {
      userService.getUsers().then(setAllUsers);
    }
  }, [isAdmin]);

  const handleSave = async () => {
    try {
      await userService.updateUser(user.id, formData);
      onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      alert('Erro ao salvar alterações.');
    }
  };

  const handlePinUpdate = async () => {
    if (newPin.length < 4) return alert('O PIN deve ter pelo menos 4 dígitos.');
    try {
      await userService.updateUser(user.id, { pin: newPin });
      alert('PIN alterado com sucesso!');
      setNewPin('');
    } catch (error) {
      alert('Erro ao alterar PIN.');
    }
  };

  const handleOtherUserPinUpdate = async (userId: string, pin: string) => {
    if (pin.length < 4) return alert('O PIN deve ter pelo menos 4 dígitos.');
    try {
      await userService.updateUser(userId, { pin });
      const updatedUsers = await userService.getUsers();
      setAllUsers(updatedUsers);
      alert('PIN do usuário atualizado!');
    } catch (error) {
      alert('Erro ao atualizar PIN do usuário.');
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scroll p-4 md:p-12 lg:p-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row items-center gap-8 border-b border-stone-200 dark:border-white/5 pb-12">
           <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] overflow-hidden border-4 border-white dark:border-onyx shadow-2xl">
                <img src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-gold text-black rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera size={20} />
              </button>
           </div>
           <div className="text-center md:text-left space-y-2">
              <span className="px-4 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">{user.role}</span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tighter">{user.name}</h1>
              <p className="text-stone-500 font-serif italic text-lg">{user.email}</p>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Dados Pessoais</h3>
                <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                   {isEditing ? <><Save size={14} /> Salvar Alterações</> : <><User size={14} /> Editar Perfil</>}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl outline-none focus:ring-1 focus:ring-gold transition-all text-stone-900 dark:text-white font-serif disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 ml-1">E-mail Corporativo</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl outline-none focus:ring-1 focus:ring-gold transition-all text-stone-900 dark:text-white font-serif disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-5 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl outline-none focus:ring-1 focus:ring-gold transition-all text-stone-900 dark:text-white font-serif disabled:opacity-50"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Segurança (PIN)</h3>
              <div className="p-8 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-[2rem] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-gold shadow-sm">
                    <Key size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-stone-800 dark:text-white uppercase tracking-tight">Alterar Código de Acesso</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Seu PIN atual é usado para logar no sistema</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <input 
                      type={showPin ? "text" : "password"}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Novo PIN (mín. 4 dígitos)"
                      className="w-full p-4 pl-12 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl outline-none focus:border-gold transition-all text-stone-900 dark:text-white"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <button 
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-gold"
                    >
                      {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={handlePinUpdate}
                    className="px-8 py-4 gold-bg text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                  >
                    Atualizar PIN
                  </button>
                </div>
              </div>
            </section>

            {isAdmin && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Gestão de Equipe (Admin)</h3>
                  <div className="flex items-center gap-2 text-gold">
                    <Users size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{allUsers.length} Membros</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {allUsers.map((u) => (
                    <div key={u.id} className="p-6 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-2xl object-cover" />
                        <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight">{u.name}</p>
                          <p className="text-[9px] font-bold text-gold uppercase tracking-[0.2em]">{u.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="bg-stone-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-stone-100 dark:border-white/5">
                          <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">PIN Atual</p>
                          <p className="text-sm font-mono font-bold text-stone-900 dark:text-white tracking-widest">{u.pin}</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const newP = prompt(`Novo PIN para ${u.name}:`, u.pin);
                            if (newP && newP !== u.pin) handleOtherUserPinUpdate(u.id, newP);
                          }}
                          className="p-3 bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 rounded-xl hover:text-gold transition-colors"
                          title="Alterar PIN"
                        >
                          <Edit2 size={18} />
                        </button>
                        
                        <button 
                          onClick={async () => {
                            if (confirm(`Deseja acessar o sistema como ${u.name}?`)) {
                              await logout();
                              localStorage.setItem('bm-local-user', JSON.stringify(u));
                              window.location.reload();
                            }
                          }}
                          className="p-3 bg-gold/10 text-gold rounded-xl hover:bg-gold hover:text-black transition-all"
                          title="Acessar Conta"
                        >
                          <LogIn size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8">
             <div className="p-8 bg-stone-950 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <h4 className="text-xl font-serif font-bold uppercase tracking-tight text-gold">Status de Permissão</h4>
                  <div className="space-y-4">
                    {Object.entries(user.permissions).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-widest text-stone-400">
                        <span>{key.replace('can', '').replace(/([A-Z])/g, ' $1')}</span>
                        <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl" />
             </div>

             <button 
                onClick={onLogout}
                className="w-full p-6 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center gap-3 text-rose-500 font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
             >
                <LogOut size={16} /> Encerrar Sessão
             </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
