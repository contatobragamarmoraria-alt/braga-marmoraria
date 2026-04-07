
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, Save, Bell, Lock, LogOut, ChevronRight } from 'lucide-react';
import { AppUser } from '../types';

interface Props {
  user: AppUser;
  onUpdate: (u: Partial<AppUser>) => void;
  onLogout: () => void;
}

const UserProfile: React.FC<Props> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
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
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Preferências & Segurança</h3>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { icon: Bell, label: 'Notificações do Sistema', desc: 'Alertas de produção e novos leads', active: true },
                   { icon: Lock, label: 'Segurança da Conta', desc: 'Gerenciar senhas e acessos', active: false },
                   { icon: Shield, label: 'Privacidade de Dados', desc: 'Controle de visibilidade do perfil', active: true }
                 ].map((item, i) => (
                   <button key={i} className="flex items-center justify-between p-6 bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-3xl hover:border-gold/20 transition-all group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-stone-400 group-hover:text-gold transition-colors shadow-sm">
                            <item.icon size={20} />
                         </div>
                         <div className="text-left">
                            <p className="text-sm font-bold text-stone-800 dark:text-white uppercase tracking-tight">{item.label}</p>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-none mt-1">{item.desc}</p>
                         </div>
                      </div>
                      <ChevronRight size={20} className="text-stone-300 group-hover:text-gold translate-x-0 group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
              </div>
            </section>
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
