
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, ShieldCheck, CheckCircle2, AlertCircle, 
  DollarSign, Package, MapPin, HardHat, 
  Info, Scale, Phone, User, Construction
} from 'lucide-react';
import { Project, ProjectContractData } from '../types';

interface Props {
  project: Project;
  updateProject: (p: Project) => void;
}

const ProjectContractTab: React.FC<Props> = ({ project, updateProject }) => {
  const [contractData, setContractData] = useState<ProjectContractData>(project.contractData || {
    contractorName: project.clientName,
    cpf: '',
    phone: project.phone,
    address: '',
    cep: '',
    salesperson: project.responsible,
    closingDate: project.startDate || new Date().toISOString().split('T')[0],
    projectType: project.projectType,
    scope: [],
    commercialConditions: {
      totalValue: project.value,
      paymentMethod: project.paymentMethod,
      downPayment: 0,
      cancellationRule: 'O sinal não será reembolsado em caso de cancelamento por parte do contratante após 7 dias úteis.',
    },
    billingData: {
      pixKey: '00.000.000/0001-00',
      bank: 'Bradesco (237)',
      agency: '1234',
      account: '56789-0',
    },
    preExecutionStage: {
      siteCheckPerformed: false,
      templateReady: false,
      technicalConditionsMet: {
        plasterFinished: false,
        plumbingInstalled: false,
        electricalInstalled: false,
        cabinetStructureReady: false,
      },
    },
    responsibilities: {
      client: [
        'Fornecer cubas e cubos no ato da medição técnica.',
        'Garantir ponto de água e esgoto no local.',
        'Garantir ponto de energia 220v para ferramentas.',
        'Acompanhar a medição técnica e a instalação.',
      ],
      company: [
        'Executar conforme projeto executivo aprovado.',
        'Fornecer materiais de primeira qualidade.',
        'Manter ambiente limpo e organizado durante a obra.',
        'Garantir assistência técnica no prazo de garantia.',
      ],
    },
    technicalConditions: {
      variationsAcknowledged: false,
      finishingTolerancesAccepted: false,
      educationCompleted: false,
    },
    warranty: {
      period: '12 meses contra defeitos de fabricação e instalação.',
      coverage: 'Rachaduras espontâneas, infiltrações por vedação e descolamentos.',
      exclusions: 'Impactos fortuitos, uso de produtos abrasivos, manchas de gordura em pedras naturais sem manutenção.',
    }
  });

  const handleUpdate = (newData: Partial<ProjectContractData>) => {
    const updated = { ...contractData, ...newData };
    setContractData(updated);
    updateProject({ ...project, contractData: updated });
  };



  const isPreExecutionDone = 
    contractData.preExecutionStage.siteCheckPerformed && 
    contractData.preExecutionStage.templateReady &&
    contractData.preExecutionStage.technicalConditionsMet.plasterFinished &&
    contractData.preExecutionStage.technicalConditionsMet.plumbingInstalled &&
    contractData.preExecutionStage.technicalConditionsMet.electricalInstalled &&
    contractData.preExecutionStage.technicalConditionsMet.cabinetStructureReady;

  const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-tight">{title}</h3>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );

  const CheckboxItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
    <div 
      onClick={() => onChange(!checked)}
      className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
        checked 
          ? 'bg-emerald-500/5 border-emerald-500/50 text-emerald-900 dark:text-emerald-400' 
          : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 opacity-60'
      }`}
    >
      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
        checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 dark:border-stone-700'
      }`}>
        {checked && <CheckCircle2 size={14} />}
      </div>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto custom-scroll space-y-12 pb-20">
      {/* 1. DADOS DO PROJETO */}
      <section>
        <SectionTitle icon={User} title="Identificação do Contrato" subtitle="Dados principais do projeto e contratante" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Contratante</label>
            <div className="p-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl font-serif text-stone-900 dark:text-white">{contractData.contractorName}</div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">CPF / CNPJ</label>
            <input 
              type="text" 
              placeholder="000.000.000-00"
              value={contractData.cpf}
              onChange={(e) => handleUpdate({ cpf: e.target.value })}
              className="w-full p-4 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl focus:ring-1 focus:ring-gold outline-none text-stone-900 dark:text-white transition-all" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Telefone</label>
            <input 
              type="text" 
              value={contractData.phone}
              onChange={(e) => handleUpdate({ phone: e.target.value })}
              className="w-full p-4 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl focus:ring-1 focus:ring-gold outline-none text-stone-900 dark:text-white transition-all" 
            />
          </div>
          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Endereço da Obra</label>
            <input 
              type="text" 
              value={contractData.address}
              onChange={(e) => handleUpdate({ address: e.target.value })}
              className="w-full p-4 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl focus:ring-1 focus:ring-gold outline-none text-stone-900 dark:text-white transition-all" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">CEP</label>
            <input 
              type="text" 
              value={contractData.cep}
              onChange={(e) => handleUpdate({ cep: e.target.value })}
              className="w-full p-4 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl focus:ring-1 focus:ring-gold outline-none text-stone-900 dark:text-white transition-all" 
            />
          </div>
        </div>
      </section>

      {/* 2. ESCOPO DO PROJETO */}
      <section>
        <SectionTitle icon={Package} title="Escopo & Produtos" subtitle="Descrição técnica dos itens contratados" />
        <div className="bg-stone-950 rounded-[2rem] p-8 text-white relative overflow-hidden group">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Itens Integrados</h4>
              <ul className="space-y-4">
                {project.detailedScope.map((s, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={14} /></div>
                    <div>
                      <p className="font-serif font-bold text-lg">{s.title}</p>
                      <p className="text-xs text-stone-400 mt-1">{s.items.join(' • ')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-xl">
               <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2"><Info size={14} className="text-gold" /> Regras de Execução</h4>
               <div className="space-y-6">
                  <div>
                    <p className="text-[8px] font-bold text-gold uppercase tracking-widest mb-1">Inclusões</p>
                    <p className="text-xs text-stone-300 italic">Instalação completa, polimento de bordas, colagem de cubas fornecidas sob medida.</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest mb-1">Exclusões Críticas</p>
                    <p className="text-xs text-stone-300 italic">Nossa equipe não realiza serviços de encanamento, elétrica, gesso ou pintura. O local deve estar pronto conforme checklists abaixo.</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mb-32 -mr-32 blur-3xl" />
        </div>
      </section>

      {/* 3. CONDIÇÕES COMERCIAIS */}
      <section>
        <SectionTitle icon={DollarSign} title="Condições Comerciais" subtitle="Valores, pagamentos e regras comerciais" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 p-6 bg-gold/5 border border-gold/20 rounded-3xl flex flex-col justify-center items-center text-center">
            <DollarSign size={32} className="text-gold mb-2" />
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Valor Total</p>
            <h4 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">R$ {contractData.commercialConditions.totalValue.toLocaleString('pt-BR')}</h4>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Forma de Pagamento</label>
              <div className="p-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">
                {contractData.commercialConditions.paymentMethod}
              </div>
            </div>
             <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Sinal (Entrada)</label>
              <div className="p-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl font-serif text-stone-900 dark:text-white">
                R$ {contractData.commercialConditions.downPayment.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Regra de Cancelamento</label>
              <div className="p-4 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl text-[9px] font-medium italic text-stone-500 dark:text-stone-400 leading-relaxed">
                {contractData.commercialConditions.cancellationRule}
              </div>
            </div>
          </div>
        </div>

        {/* Dados de Faturamento Automático */}
        <div className="mt-8 p-8 bg-stone-900 rounded-[2rem] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 text-gold flex items-center justify-center shrink-0"><Info size={20} /></div>
              <div>
                <h5 className="text-white font-serif font-bold text-lg">Dados para Faturamento</h5>
                <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest">Informações bancárias automáticas da Braga Marmoraria</p>
              </div>
           </div>
           <div className="flex flex-wrap gap-6">
              <div className="text-center md:text-left">
                <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest mb-1">Chave PIX (CNPJ)</p>
                <p className="text-xs text-white font-serif">{contractData.billingData?.pixKey}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[8px] font-bold text-stone-500 uppercase tracking-widest mb-1">Banco / Ag / Conta</p>
                <p className="text-xs text-white font-serif">{contractData.billingData?.bank} / {contractData.billingData?.agency} / {contractData.billingData?.account}</p>
              </div>
           </div>
        </div>
      </section>

      {/* 4. ETAPA DE PRÉ-EXECUÇÃO */}
      <section>
        <SectionTitle icon={HardHat} title="Protocolo de Pré-Execução" subtitle="Checklist obrigatório para início da fabricação" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2"><Construction size={14} className="text-gold" /> Condições do Local</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckboxItem 
                  label="Gesso Concluído" 
                  checked={contractData.preExecutionStage.technicalConditionsMet.plasterFinished}
                  onChange={(v) => handleUpdate({ 
                    preExecutionStage: { 
                      ...contractData.preExecutionStage, 
                      technicalConditionsMet: { ...contractData.preExecutionStage.technicalConditionsMet, plasterFinished: v } 
                    } 
                  })}
                />
                <CheckboxItem 
                  label="Hidráulica Instalada" 
                  checked={contractData.preExecutionStage.technicalConditionsMet.plumbingInstalled}
                  onChange={(v) => handleUpdate({ 
                    preExecutionStage: { 
                      ...contractData.preExecutionStage, 
                      technicalConditionsMet: { ...contractData.preExecutionStage.technicalConditionsMet, plumbingInstalled: v } 
                    } 
                  })}
                />
                <CheckboxItem 
                  label="Elétrica Preparada" 
                  checked={contractData.preExecutionStage.technicalConditionsMet.electricalInstalled}
                  onChange={(v) => handleUpdate({ 
                    preExecutionStage: { 
                      ...contractData.preExecutionStage, 
                      technicalConditionsMet: { ...contractData.preExecutionStage.technicalConditionsMet, electricalInstalled: v } 
                    } 
                  })}
                />
                <CheckboxItem 
                  label="Estrutura / Marcenaria" 
                  checked={contractData.preExecutionStage.technicalConditionsMet.cabinetStructureReady}
                  onChange={(v) => handleUpdate({ 
                    preExecutionStage: { 
                      ...contractData.preExecutionStage, 
                      technicalConditionsMet: { ...contractData.preExecutionStage.technicalConditionsMet, cabinetStructureReady: v } 
                    } 
                  })}
                />
              </div>
            </div>
          </div>
          <div className="bg-stone-50 dark:bg-white/5 rounded-[2rem] p-8 border border-stone-200 dark:border-white/10">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /> Medição Técnica Laser</h4>
             <div className="space-y-4">
                <div 
                  onClick={() => handleUpdate({ preExecutionStage: { ...contractData.preExecutionStage, siteCheckPerformed: !contractData.preExecutionStage.siteCheckPerformed } })}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${contractData.preExecutionStage.siteCheckPerformed ? 'bg-gold/10 border-gold text-stone-900 dark:text-white' : 'bg-white dark:bg-onyx border-stone-100 dark:border-white/5 text-stone-300'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${contractData.preExecutionStage.siteCheckPerformed ? 'bg-gold text-black' : 'bg-stone-100 dark:bg-white/10 text-stone-400'}`}>
                    <Construction size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-serif font-bold uppercase tracking-tight">Visita de Conferência Realizada</p>
                    <p className="text-[10px] font-bold text-stone-500 mt-1">Concluída em {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleUpdate({ preExecutionStage: { ...contractData.preExecutionStage, templateReady: !contractData.preExecutionStage.templateReady } })}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${contractData.preExecutionStage.templateReady ? 'bg-emerald-500/10 border-emerald-500 text-stone-900 dark:text-white' : 'bg-white dark:bg-onyx border-stone-100 dark:border-white/5 text-stone-300'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${contractData.preExecutionStage.templateReady ? 'bg-emerald-500 text-white' : 'bg-stone-100 dark:bg-white/10 text-stone-400'}`}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-serif font-bold uppercase tracking-tight">Gabarito Aprovado</p>
                    <p className="text-[10px] font-bold text-stone-500 mt-1">Autorizado para fabricação no Atelier</p>
                  </div>
                </div>

                {isPreExecutionDone && project.status === 'AGUARDANDO_MEDICAO' && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full py-4 bg-emerald-500/10 text-emerald-600 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border border-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Protocolo Liberado para Avanço (Use o botão no topo)
                  </motion.div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* 5. RESPONSABILIDADES */}
      <section className="bg-stone-50 dark:bg-black/20 rounded-[3rem] p-12 border border-stone-100 dark:border-white/5">
        <SectionTitle icon={Scale} title="Divisão de Responsabilidades" subtitle="Compromisso mútuo para excelência da obra" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-6 flex items-center gap-2">Deveres do Contratante</h4>
            <div className="space-y-3">
              {contractData.responsibilities.client.map((r, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5 text-xs font-medium text-stone-600 dark:text-stone-300 italic">
                  <span className="text-red-500 font-bold shrink-0">!</span> {r}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500 mb-6 flex items-center gap-2">Compromissos da Braga Marmoraria</h4>
            <div className="space-y-3">
              {contractData.responsibilities.company.map((r, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5 text-xs font-medium text-stone-600 dark:text-stone-300 italic">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span> {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. ACEITE TÉCNICO & GARANTIA */}
      <section>
        <SectionTitle icon={ShieldCheck} title="Educação, Aceite & Garantia" subtitle="Termos finais e longevidade da pedra" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-6">Manutenção & Cuidados</h4>
             <div className="space-y-4">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-serif leading-relaxed">
                  Oferecemos {contractData.warranty.period}. A garantia cobre {contractData.warranty.coverage.toLowerCase()}.
                </p>
                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                   <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><AlertCircle size={10} /> ATENÇÃO: Exclusões</p>
                   <p className="text-[10px] text-rose-900/60 dark:text-rose-400/60 italic leading-relaxed">{contractData.warranty.exclusions}</p>
                </div>
                <CheckboxItem 
                  label="Educação de Limpeza Realizada" 
                  checked={contractData.technicalConditions.educationCompleted}
                  onChange={(v) => handleUpdate({ technicalConditions: { ...contractData.technicalConditions, educationCompleted: v } })}
                />
             </div>
           </div>
           <div className="bg-stone-900 text-white p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
                  <FileText size={32} />
                </div>
                <h4 className="text-2xl font-serif font-bold uppercase tracking-tighter">Assinatura Digital de Aceite</h4>
                <p className="text-xs text-stone-400 italic max-w-xs mx-auto">
                  Ao finalizar estas etapas, o cliente poderá assinar o termo de aceite digital pelo link exclusivo.
                </p>
                <button 
                  disabled={!contractData.preExecutionStage.templateReady}
                  className={`w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${
                    contractData.preExecutionStage.templateReady 
                      ? 'gold-bg text-black hover:scale-105 shadow-xl shadow-gold/20' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {contractData.preExecutionStage.templateReady ? 'Gerar Contrato para Assinatura' : 'Aguardando Aprovação de Gabarito'}
                </button>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
           </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectContractTab;
