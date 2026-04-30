import { ProjectTask } from '../types';

export function getDefaultProductionTasks(): ProjectTask[] {
  const id = () => Math.random().toString(36).substr(2, 9);

  return [
    // ── PRÉ-PRODUÇÃO ──────────────────────────────────────────────────────
    { id: id(), name: 'Contrato assinado', description: 'Pré-produção', completed: false, category: 'PRODUCAO', priority: 'CRITICAL' },
    { id: id(), name: 'Pagamento confirmado', description: 'Pré-produção', completed: false, category: 'PRODUCAO', priority: 'CRITICAL' },
    { id: id(), name: 'Medição realizada', description: 'Pré-produção', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Croqui aprovado pelo cliente', description: 'Pré-produção — NÃO PRODUZIR sem aprovação', completed: false, category: 'PRODUCAO', priority: 'CRITICAL' },
    { id: id(), name: 'Projeto liberado para produção', description: 'Pré-produção', completed: false, category: 'PRODUCAO', priority: 'HIGH' },

    // ── MATERIAL ─────────────────────────────────────────────────────────
    { id: id(), name: 'Material separado', description: 'Material — conferência de tipo, origem e lote', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Conferência de qualidade do material', description: 'Material', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Material disponível no pátio', description: 'Material', completed: false, category: 'PRODUCAO', priority: 'MEDIUM' },

    // ── CORTE ─────────────────────────────────────────────────────────────
    { id: id(), name: 'Medidas do croqui conferidas', description: 'Corte — CRÍTICO: conferir antes de cortar', completed: false, category: 'PRODUCAO', priority: 'CRITICAL' },
    { id: id(), name: 'Corte programado', description: 'Corte', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Corte das peças realizado', description: 'Corte', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Peças identificadas', description: 'Corte', completed: false, category: 'PRODUCAO', priority: 'MEDIUM' },

    // ── PRODUÇÃO / ACABAMENTO ─────────────────────────────────────────────
    { id: id(), name: 'Acabamento das bordas', description: 'Produção', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Execução do modelo (slim, reta, etc.)', description: 'Produção', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Polimento final', description: 'Produção', completed: false, category: 'PRODUCAO', priority: 'HIGH' },
    { id: id(), name: 'Revisão geral — sem trincas, manchas ou irregularidades', description: 'Controle de qualidade', completed: false, category: 'PRODUCAO', priority: 'CRITICAL' },

    // ── LOGÍSTICA / AGENDAMENTO ───────────────────────────────────────────
    { id: id(), name: 'Produto finalizado e conferido', description: 'Logística', completed: false, category: 'LOGISTICA', priority: 'HIGH' },
    { id: id(), name: 'Separação para entrega', description: 'Logística', completed: false, category: 'LOGISTICA', priority: 'HIGH' },
    { id: id(), name: 'Agendamento confirmado com cliente', description: 'Logística — verificar se local está pronto', completed: false, category: 'LOGISTICA', priority: 'HIGH' },

    // ── INSTALAÇÃO ────────────────────────────────────────────────────────
    { id: id(), name: 'Transporte seguro até o local', description: 'Instalação', completed: false, category: 'INSTALACAO', priority: 'HIGH' },
    { id: id(), name: 'Posicionamento e fixação da peça', description: 'Instalação — sem hidráulica ou ajuste de móveis', completed: false, category: 'INSTALACAO', priority: 'HIGH' },
    { id: id(), name: 'Rejunte e acabamento final', description: 'Instalação', completed: false, category: 'INSTALACAO', priority: 'MEDIUM' },
    { id: id(), name: 'Limpeza básica pós-instalação', description: 'Instalação', completed: false, category: 'INSTALACAO', priority: 'MEDIUM' },

    // ── FINALIZAÇÃO ───────────────────────────────────────────────────────
    { id: id(), name: 'Conferência final com cliente', description: 'Finalização', completed: false, category: 'INSTALACAO', priority: 'HIGH' },
    { id: id(), name: 'Orientação de uso e limpeza passada ao cliente', description: 'Finalização', completed: false, category: 'INSTALACAO', priority: 'MEDIUM' },
    { id: id(), name: 'Foto da entrega registrada', description: 'Finalização', completed: false, category: 'INSTALACAO', priority: 'MEDIUM' },

    // ── PÓS-VENDA ─────────────────────────────────────────────────────────
    { id: id(), name: 'Contato pós-entrega realizado (até 1 dia)', description: 'Pós-venda — cliente tem 7 dias para relatar problemas', completed: false, category: 'LOGISTICA', priority: 'HIGH' },
    { id: id(), name: 'Feedback coletado', description: 'Pós-venda', completed: false, category: 'LOGISTICA', priority: 'MEDIUM' },
  ];
}
