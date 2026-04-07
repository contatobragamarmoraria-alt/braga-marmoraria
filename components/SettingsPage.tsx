
import React, { useState } from 'react';
// Added ShieldCheck to imports
import { User, Building2, Bell, Shield, CreditCard, ChevronRight, Check, Palette, Globe, Smartphone, ShieldCheck, ArrowLeft } from 'lucide-react';
// Added motion import for animations
import { motion, AnimatePresence } from 'framer-motion';
import UserManagement from './UserManagement';
import UserProfile from './UserProfile';
import { useAuth } from './AuthContext';

const SettingsItem = ({ icon: Icon, title, description, badge, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-6 hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group border-b border-stone-100 dark:border-white/5 last:border-none"
  >
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 bg-stone-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-stone-600 dark:text-stone-400 group-hover:bg-stone-900 dark:group-hover:bg-gold group-hover:text-white dark:group-hover:text-black transition-all">
        <Icon size={22} />
      </div>
      <div>
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight">{title}</h4>
          {badge && <span className="px-2 py-0.5 bg-gold/10 text-gold text-[8px] font-bold rounded-full uppercase tracking-widest border border-gold/20">{badge}</span>}
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 font-serif italic">{description}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-stone-300 dark:text-stone-800 group-hover:text-gold group-hover:translate-x-1 transition-all" />
  </div>
);

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'main' | 'users' | 'profile'>('main');

  if (view === 'users') {
    return (
      <div className="h-full flex flex-col space-y-8 overflow-hidden">
        <div className="shrink-0 px-2">
          <button 
            onClick={() => setView('main')}
            className="flex items-center gap-2 text-stone-400 hover:text-gold transition-all mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Voltar para Configurações</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll pr-2">
          <UserManagement />
        </div>
      </div>
    );
  }

  if (view === 'profile' && user) {
    return (
      <div className="h-full flex flex-col space-y-8 overflow-hidden">
        <div className="shrink-0 px-2">
          <button 
            onClick={() => setView('main')}
            className="flex items-center gap-2 text-stone-400 hover:text-gold transition-all mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Voltar para Configurações</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll pr-2">
          <UserProfile user={user} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 overflow-hidden">
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-3xl font-serif font-bold text-stone-950 dark:text-white tracking-tighter uppercase">Configurações</h2>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">Gerenciamento de Atelier & White Label</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-400">Exportar Logs</button>
          <button className="flex-1 md:flex-none gold-bg px-6 py-2.5 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg">Salvar Preferências</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll pr-2 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Personalização de Grife</h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Sua identidade em cada ponto de contato</p>
                </div>
                <Palette className="text-gold opacity-50" size={24} />
              </div>
              
              <div className="flex flex-col">
                <SettingsItem 
                  icon={User} 
                  title="Meu Perfil" 
                  description="Edite seus dados pessoais, telefone e foto de perfil" 
                  onClick={() => setView('profile')}
                />
                <SettingsItem 
                  icon={Building2} 
                  title="Branding do Atelier" 
                  description="Logo principal, favicon e cores da interface do proprietário" 
                  badge="White Label"
                />
                <SettingsItem 
                  icon={Palette} 
                  title="Paleta Exclusiva" 
                  description="Defina os tons de ouro e pedra da sua marca no portal" 
                />
                <SettingsItem 
                  icon={Globe} 
                  title="Domínio Customizado" 
                  description="Use seu próprio link (ex: portal.suamarmoraria.com.br)" 
                  badge="Premium"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-onyx rounded-[3rem] border border-stone-200 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-black/20">
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">Segurança & Acessos</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Gestão de permissões para mestre e instaladores</p>
              </div>
              
              <div className="flex flex-col">
                <SettingsItem 
                  icon={User} 
                  title="Gestão de Usuários" 
                  description="Gerencie administradores, medidores e vendedores" 
                  onClick={() => setView('users')}
                />
                <SettingsItem 
                  icon={Shield} 
                  title="Logs de Atividade" 
                  description="Histórico completo de alterações em projetos e propostas" 
                />
                <SettingsItem 
                  icon={Smartphone} 
                  title="Integração WhatsApp" 
                  description="Conecte seu número para notificações automáticas via IA" 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-stone-950 dark:bg-gold p-10 rounded-[3rem] text-white dark:text-black shadow-2xl relative overflow-hidden group">
               <ShieldCheck size={120} className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700" />
               <div className="relative z-10">
                 <h4 className="text-3xl font-serif font-bold uppercase tracking-tighter mb-4 leading-none">Plano <br/><span className="italic">Atelier Pro</span></h4>
                 <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-sm opacity-60">Vencimento:</span>
                   <span className="text-sm font-bold uppercase tracking-widest">15 Dez 2023</span>
                 </div>
                 <button className="w-full py-4 bg-white dark:bg-black text-black dark:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Fazer Upgrade</button>
               </div>
            </div>

            <div className="bg-white dark:bg-onyx p-8 rounded-[3rem] border border-stone-200 dark:border-white/5 shadow-sm space-y-6">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Uso de Recursos</h4>
               <div className="space-y-4">
                  {[
                    { label: 'Projetos Ativos', current: 14, max: 50, color: 'gold' },
                    { label: 'Proprietários', current: 124, max: 500, color: 'emerald-500' },
                    { label: 'Armazenamento', current: 4.2, max: 20, unit: 'GB', color: 'indigo-500' }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                        <span className="text-stone-500 dark:text-stone-400">{stat.label}</span>
                        <span className="text-stone-900 dark:text-white">{stat.current}{stat.unit} / {stat.max}{stat.unit}</span>
                      </div>
                      <div className="h-1 bg-stone-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${(stat.current/stat.max)*100}%` }}
                          className={`h-full`} 
                          style={{ backgroundColor: stat.color === 'gold' ? '#D4AF37' : stat.color }}
                        />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
