
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, Plus, Trash2 } from 'lucide-react';
import { auditService } from '../services/auditService';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { useAuth } from './AuthContext';
import { Project, ProjectStatus, AppUser, UserPermissions } from '../types';

interface ClientData {
  name: string;
  cpf: string;
  phone: string;
  email: string;
}

interface WorkData {
  address: string;
  cep: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface ScopeItem {
  id: string;
  type: string;
  material: string;
  color: string;
  description: string;
  value: number;
}

interface ScopeData {
  items: ScopeItem[];
  totalValue: number;
  paymentForm: string;
  paymentInstallments: number;
  desiredDate: string;
  notes: string;
  clientResponsibilities: string[];
}

const ITEM_TYPES = [
  'Bancada com Fechamento',
  'Bancada sem Fechamento',
  'Cuba (Inox)',
  'Piso',
  'Escadaria',
  'Lavatório Master',
  'Área de Serviço',
  'Outro'
];

const MATERIALS = [
  'Granito',
  'Quartzo',
  'Mármore',
  'Travertino',
  'Limestones',
  'Outro'
];

const CLIENT_RESPONSIBILITIES = [
  'Fornecer argamassa e rejunte (piso)',
  'Remover granito existente',
  'Remover piso antigo',
  'Remover rodapés',
  'Preparar ambiente (livre de móveis)',
  'Responsável por instalações hidráulicas',
  'Responsável por instalações elétricas',
  'Responsável por acabamentos'
];

interface InitialClientData {
  name?: string;
  cpf?: string;
  phone?: string;
  email?: string;
}

const DRAFT_KEY = 'bm-project-wizard-draft';


const ProjectFormWizard: React.FC<{ onClose: () => void; onCreated: () => void; initialClient?: InitialClientData }> = ({ onClose, onCreated, initialClient }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientCreated, setClientCreated] = useState<AppUser | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  const [client, setClient] = useState<ClientData>(() => {
    if (initialClient) {
      return {
        name: initialClient.name || '',
        cpf: initialClient.cpf || '',
        phone: initialClient.phone || '',
        email: initialClient.email || ''
      };
    }
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        return draft.client || { name: '', cpf: '', phone: '', email: '' };
      } catch {
        return { name: '', cpf: '', phone: '', email: '' };
      }
    }
    return { name: '', cpf: '', phone: '', email: '' };
  });

  const [work, setWork] = useState<WorkData>(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        return draft.work || { address: '', cep: '', neighborhood: '', city: '', state: 'SP' };
      } catch {
        return { address: '', cep: '', neighborhood: '', city: '', state: 'SP' };
      }
    }
    return { address: '', cep: '', neighborhood: '', city: '', state: 'SP' };
  });

  const [scope, setScope] = useState<ScopeData>(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        return draft.scope || { items: [], totalValue: 0, paymentForm: 'parcelado', paymentInstallments: 6, desiredDate: '', notes: '', clientResponsibilities: [] };
      } catch {
        return { items: [], totalValue: 0, paymentForm: 'parcelado', paymentInstallments: 6, desiredDate: '', notes: '', clientResponsibilities: [] };
      }
    }
    return { items: [], totalValue: 0, paymentForm: 'parcelado', paymentInstallments: 6, desiredDate: '', notes: '', clientResponsibilities: [] };
  });

  const validateStep = (stepNum: number): boolean => {
    if (stepNum === 1) {
      return client.name.trim() !== '' && client.cpf.trim() !== '' &&
             client.phone.trim() !== '' && client.email.trim() !== '';
    }
    if (stepNum === 2) {
      return work.address.trim() !== '' && work.cep.trim() !== '' &&
             work.neighborhood.trim() !== '' && work.city.trim() !== '';
    }
    if (stepNum === 3) {
      return scope.items.length > 0 && scope.totalValue > 0;
    }
    if (stepNum === 4) {
      return true; // Revisão sempre é válida
    }
    return false;
  };

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ client, work, scope, step }));
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      saveDraft();
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      saveDraft();
      setStep(step - 1);
    }
  };

  const handleAddItem = () => {
    const newItem: ScopeItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: '',
      material: '',
      color: '',
      description: '',
      value: 0
    };
    setScope({ ...scope, items: [...scope.items, newItem] });
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = scope.items.filter(item => item.id !== itemId);
    const newTotal = updatedItems.reduce((sum, item) => sum + item.value, 0);
    setScope({ ...scope, items: updatedItems, totalValue: newTotal });
  };

  const handleUpdateItem = (itemId: string, field: string, value: any) => {
    const updatedItems = scope.items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === 'value') {
          updated.value = parseFloat(value) || 0;
        }
        return updated;
      }
      return item;
    });

    const newTotal = updatedItems.reduce((sum, item) => sum + item.value, 0);
    setScope({ ...scope, items: updatedItems, totalValue: newTotal });
  };

  const handleResponsibilityToggle = (responsibility: string) => {
    const updated = scope.clientResponsibilities.includes(responsibility)
      ? scope.clientResponsibilities.filter(r => r !== responsibility)
      : [...scope.clientResponsibilities, responsibility];
    setScope({ ...scope, clientResponsibilities: updated });
  };

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const createClientUser = async (clientName: string, clientEmail: string): Promise<AppUser | null> => {
    try {
      const password = generatePassword();
      const newClient: AppUser = {
        id: `cl_${Math.random().toString(36).substr(2, 9)}`,
        name: clientName,
        email: clientEmail,
        phone: client.phone,
        role: 'CLIENT',
        status: 'ACTIVE',
        avatar: `https://i.pravatar.cc/150?u=${clientEmail}`,
        createdAt: new Date().toISOString(),
        permissions: {
          canViewFinancials: false,
          canViewTechnical: false,
          canViewCalendar: true,
          canViewOccurrences: true,
          canEditProjects: false,
          canDeleteProjects: false,
          canManageUsers: false
        },
        pin: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
        password: password
      };

      await userService.addUser(newClient);

      console.log('Novo cliente criado:', {
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        password: newClient.password,
        pin: newClient.pin
      });

      return newClient;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      // Criar novo cliente
      const newClient = await createClientUser(client.name, client.email);
      if (newClient) {
        setClientCreated(newClient);
      }

      const projectId = Math.random().toString(36).substr(2, 9);
      const newProject: Project = {
        id: projectId,
        clientName: client.name,
        clientEmail: client.email,
        phone: client.phone,
        projectType: scope.items[0]?.type || 'Obra',
        concept: scope.notes || `Projeto para ${client.name}`,
        value: scope.totalValue,
        paymentMethod: scope.paymentForm === 'parcelado' ? `${scope.paymentInstallments}x` : 'À Vista',
        startDate: new Date().toISOString().split('T')[0],
        estimatedDelivery: scope.desiredDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'AGUARDANDO_MEDICAO' as ProjectStatus,
        progress: 0,
        responsible: user?.name || '',
        tasks: [],
        timeline: [],
        history: [{
          id: 'h1',
          date: new Date().toISOString().split('T')[0],
          user: user?.name || 'Sistema',
          action: 'Projeto criado via formulário wizard'
        }],
        image: '',
        beforeImages: [],
        afterImages: [],
        teamIds: [user?.id || ''],
        supplierIds: [],
        stakeholderIds: [],
        materials: scope.items.map(item => item.material).filter(m => m),
        references: [],
        photoLog: [],
        documents: [],
        notes: scope.notes,
        contractData: {
          contractorName: client.name,
          cpf: client.cpf,
          phone: client.phone,
          address: work.address,
          cep: work.cep,
          salesperson: user?.name || '',
          closingDate: new Date().toISOString().split('T')[0],
          projectType: scope.items[0]?.type || 'Obra',
          scope: scope.items.map(item => item.description || item.type),
          commercialConditions: {
            totalValue: scope.totalValue,
            paymentMethod: scope.paymentForm === 'parcelado' ? `${scope.paymentInstallments}x` : 'À Vista',
            downPayment: Math.round(scope.totalValue * 0.15),
            cancellationRule: 'A ser confirmado'
          },
          responsibilities: {
            client: scope.clientResponsibilities,
            company: []
          },
          preExecutionStage: {
            siteCheckPerformed: false,
            templateReady: false,
            technicalConditionsMet: {
              plasterFinished: false,
              plumbingInstalled: false,
              electricalInstalled: false,
              cabinetStructureReady: false
            }
          },
          technicalConditions: {
            variationsAcknowledged: false,
            finishingTolerancesAccepted: false,
            educationCompleted: false
          },
          warranty: {
            period: '24 meses',
            coverage: 'Defeitos de fabricação e instalação',
            exclusions: 'Uso indevido do material'
          }
        }
      };

      await projectService.addProject(newProject);

      await auditService.logAction({
        action: 'CREATE_PROJECT',
        resource: 'projects',
        details: `Projeto criado: ${newProject.clientName} - ${newProject.projectType}`,
        status: 'SUCCESS'
      });

      // Limpar rascunho após criação bem-sucedida
      localStorage.removeItem(DRAFT_KEY);

      // Mostrar credenciais por 5 segundos, depois fechar
      setShowCredentials(true);
      setTimeout(() => {
        onCreated();
        onClose();
      }, 5000);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      await auditService.logAction({
        action: 'CREATE_PROJECT',
        resource: 'projects',
        details: `Falha ao criar projeto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        status: 'FAILED'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-onyx rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gold/10 dark:bg-gold/5 border-b border-stone-200 dark:border-white/10 p-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Novo Projeto</h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">Etapa {step} de 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-200 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-stone-600 dark:text-stone-400" />
          </button>
        </div>

        {/* Progress Bar */}
        {!showCredentials && (
          <div className="h-2 bg-stone-200 dark:bg-white/10">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: '25%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {showCredentials && clientCreated ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Projeto Criado com Sucesso!</h3>
                  <p className="text-stone-600 dark:text-stone-400">Novo cliente criado e projeto vinculado</p>
                </div>

                <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg p-6 space-y-4 text-left">
                  <h4 className="font-bold text-stone-900 dark:text-white text-lg">Credenciais do Cliente</h4>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Nome</label>
                    <p className="text-lg font-serif text-stone-900 dark:text-white">{clientCreated.name}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">E-mail (Login)</label>
                    <p className="text-lg font-mono text-stone-900 dark:text-white break-all">{clientCreated.email}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Senha</label>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-mono text-stone-900 dark:text-white flex-1">{clientCreated.password}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(clientCreated.password!);
                        }}
                        className="px-3 py-1.5 bg-gold text-black rounded hover:bg-gold/90 transition-colors text-xs font-semibold"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">PIN (Login Alternativo)</label>
                    <p className="text-lg font-mono text-stone-900 dark:text-white">{clientCreated.pin}</p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mt-4">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      <strong>Importante:</strong> Compartilhe essas credenciais com o cliente de forma segura. O cliente poderá acompanhar a evolução do projeto usando essas informações.
                    </p>
                  </div>
                </div>

                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Encerrando em poucos segundos...
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Dados do Cliente</h3>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={client.cpf}
                    onChange={(e) => setClient({ ...client, cpf: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={client.email}
                    onChange={(e) => setClient({ ...client, email: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="cliente@email.com"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Local da Obra</h3>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={work.address}
                    onChange={(e) => setWork({ ...work, address: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Rua/Av., número"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={work.cep}
                      onChange={(e) => setWork({ ...work, cep: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={work.neighborhood}
                      onChange={(e) => setWork({ ...work, neighborhood: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Bairro"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={work.city}
                      onChange={(e) => setWork({ ...work, city: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      UF
                    </label>
                    <input
                      type="text"
                      value={work.state}
                      onChange={(e) => setWork({ ...work, state: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Escopo e Condições Comerciais</h3>

                {/* Items Section */}
                <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-stone-900 dark:text-white">Itens do Serviço</h4>
                    <button
                      onClick={handleAddItem}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors text-sm font-semibold"
                    >
                      <Plus size={16} /> Adicionar Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {scope.items.map((item) => (
                      <div key={item.id} className="bg-white dark:bg-white/10 p-4 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Tipo</label>
                            <select
                              value={item.type}
                              onChange={(e) => handleUpdateItem(item.id, 'type', e.target.value)}
                              className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                              <option value="">Selecione...</option>
                              {ITEM_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Material</label>
                            <select
                              value={item.material}
                              onChange={(e) => handleUpdateItem(item.id, 'material', e.target.value)}
                              className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                              <option value="">Selecione...</option>
                              {MATERIALS.map((material) => (
                                <option key={material} value={material}>{material}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Cor</label>
                            <input
                              type="text"
                              value={item.color}
                              onChange={(e) => handleUpdateItem(item.id, 'color', e.target.value)}
                              placeholder="Ex: Preto Absoluto"
                              className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Valor (R$)</label>
                            <input
                              type="number"
                              value={item.value}
                              onChange={(e) => handleUpdateItem(item.id, 'value', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Descrição</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            placeholder="Detalhes adicionais..."
                            className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors text-sm font-semibold"
                          >
                            <Trash2 size={14} /> Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Value */}
                  <div className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-stone-900 dark:text-white">Valor Total:</span>
                      <span className="text-2xl font-serif font-bold text-gold">
                        R$ {scope.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-stone-900 dark:text-white">Condições de Pagamento</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Forma de Pagamento</label>
                      <select
                        value={scope.paymentForm}
                        onChange={(e) => setScope({ ...scope, paymentForm: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="à vista">À Vista</option>
                        <option value="parcelado">Parcelado</option>
                      </select>
                    </div>
                    {scope.paymentForm === 'parcelado' && (
                      <div>
                        <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Parcelamento</label>
                        <select
                          value={scope.paymentInstallments}
                          onChange={(e) => setScope({ ...scope, paymentInstallments: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        >
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                            <option key={n} value={n}>{n}x</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Data Desejada para Entrega</label>
                    <input
                      type="date"
                      value={scope.desiredDate}
                      onChange={(e) => setScope({ ...scope, desiredDate: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400">Observações/Notas</label>
                    <textarea
                      value={scope.notes}
                      onChange={(e) => setScope({ ...scope, notes: e.target.value })}
                      placeholder="Detalhes adicionais do projeto..."
                      rows={3}
                      className="w-full px-3 py-2 border border-stone-300 dark:border-white/10 rounded bg-white dark:bg-white/5 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                {/* Client Responsibilities */}
                <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-stone-900 dark:text-white">Responsabilidades do Cliente</h4>
                  <div className="space-y-2">
                    {CLIENT_RESPONSIBILITIES.map((responsibility) => (
                      <label key={responsibility} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scope.clientResponsibilities.includes(responsibility)}
                          onChange={() => handleResponsibilityToggle(responsibility)}
                          className="w-4 h-4 text-gold rounded focus:ring-2 focus:ring-gold"
                        />
                        <span className="text-sm text-stone-700 dark:text-stone-300">{responsibility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Revisão do Projeto</h3>

                {/* Cliente */}
                <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Dados do Cliente</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Nome</p>
                      <p className="text-sm font-serif text-stone-900 dark:text-white">{client.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">CPF</p>
                      <p className="text-sm font-mono text-stone-900 dark:text-white">{client.cpf}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Telefone</p>
                      <p className="text-sm text-stone-900 dark:text-white">{client.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">E-mail</p>
                      <p className="text-sm font-mono text-stone-900 dark:text-white">{client.email}</p>
                    </div>
                  </div>
                </div>

                {/* Local da Obra */}
                <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Local da Obra</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Endereço</p>
                      <p className="text-sm text-stone-900 dark:text-white">{work.address}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">CEP</p>
                        <p className="text-sm text-stone-900 dark:text-white">{work.cep}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Bairro</p>
                        <p className="text-sm text-stone-900 dark:text-white">{work.neighborhood}</p>
                      </div>
                      <div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Cidade</p>
                        <p className="text-sm text-stone-900 dark:text-white">{work.city}, {work.state}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Escopo e Itens */}
                <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Itens do Serviço</h4>
                  <div className="space-y-3">
                    {scope.items.map((item, idx) => (
                      <div key={item.id} className="bg-white dark:bg-white/10 p-3 rounded space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Item {idx + 1}</p>
                            <p className="text-sm text-stone-900 dark:text-white font-semibold">{item.type}</p>
                          </div>
                          <p className="text-sm font-serif font-bold text-gold">R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <div>
                            <span className="text-stone-600 dark:text-stone-400">Material:</span>
                            <span className="text-stone-900 dark:text-white ml-2">{item.material}</span>
                          </div>
                          <div>
                            <span className="text-stone-600 dark:text-stone-400">Cor:</span>
                            <span className="text-stone-900 dark:text-white ml-2">{item.color}</span>
                          </div>
                        </div>
                        {item.description && (
                          <div>
                            <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Descrição</p>
                            <p className="text-sm text-stone-900 dark:text-white">{item.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-stone-200 dark:border-white/10 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-stone-900 dark:text-white">Valor Total:</span>
                      <span className="text-xl font-serif font-bold text-gold">
                        R$ {scope.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Condições Comerciais */}
                <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-stone-900 dark:text-white text-sm">Condições Comerciais</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Forma de Pagamento</p>
                      <p className="text-sm text-stone-900 dark:text-white">
                        {scope.paymentForm === 'parcelado' ? `${scope.paymentInstallments}x` : 'À Vista'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Data Desejada</p>
                      <p className="text-sm text-stone-900 dark:text-white">
                        {scope.desiredDate ? new Date(scope.desiredDate).toLocaleDateString('pt-BR') : 'Não informado'}
                      </p>
                    </div>
                  </div>
                  {scope.notes && (
                    <div>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold">Observações</p>
                      <p className="text-sm text-stone-900 dark:text-white">{scope.notes}</p>
                    </div>
                  )}
                  {scope.clientResponsibilities.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-semibold mb-2">Responsabilidades do Cliente</p>
                      <ul className="text-sm text-stone-900 dark:text-white space-y-1">
                        {scope.clientResponsibilities.map((resp) => (
                          <li key={resp} className="flex items-start gap-2">
                            <span className="text-gold mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Atenção:</strong> Ao confirmar, um novo cliente será criado com credenciais automáticas para acompanhar o projeto.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 dark:border-white/10 p-6 bg-stone-50 dark:bg-white/5 flex items-center justify-between gap-4">
          <button
            onClick={handlePreviousStep}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-white/10 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={!validateStep(step)}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Próximo <ChevronRight size={16} />
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleNextStep}
              disabled={!validateStep(3)}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Revisar <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Criando...
                </>
              ) : (
                <>
                  <Check size={16} /> Confirmar e Criar
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectFormWizard;
