
import { ProjectStatus, TeamMember, Partner } from './types';

export const STAGES: { id: ProjectStatus; label: string; description: string }[] = [
  { id: 'LEAD_FECHADO', label: 'Lead Fechado', description: 'Diagnóstico inicial, briefing criativo e alinhamento de expectativas.' },
  { id: 'AGUARDANDO_MEDICAO', label: 'Aguardando Medição', description: 'Preparação do ambiente e agendamento da visita técnica laser.' },
  { id: 'MEDICAO_CONCLUIDA', label: 'Medição Concluída', description: 'Confirmação de medidas e validação do projeto executivo final.' },
  { id: 'PRODUCAO', label: 'Produção', description: 'Execução do corte, polimento e acabamentos no Atelier.' },
  { id: 'INSTALACAO', label: 'Instalação', description: 'Montagem final e ajustes necessários no local da obra.' },
  { id: 'FINALIZADO', label: 'Finalizado', description: 'Assinatura do aceite digital e início do período de garantia.' },
  { id: 'MANUTENCAO', label: 'Manutenção', description: 'Acompanhamento pós-obra e suporte preventivo.' },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'tm1', name: 'Roberto Silva', role: 'Mestre Marmorista', email: 'roberto@obrapositiva.com', phone: '(11) 91234-5678', avatar: 'https://i.pravatar.cc/150?u=tm1', workload: 85, activeProjects: 4 },
  { id: 'tm2', name: 'Ana Paula', role: 'Projetista Senior', email: 'ana@obrapositiva.com', phone: '(11) 92345-6789', avatar: 'https://i.pravatar.cc/150?u=tm2', workload: 40, activeProjects: 2 },
  { id: 'tm3', name: 'Sandro Tech', role: 'Instalador Líder', email: 'sandro@obrapositiva.com', phone: '(11) 93456-7890', avatar: 'https://i.pravatar.cc/150?u=tm3', workload: 95, activeProjects: 5 },
  { id: 'tm4', name: 'Carla Dias', role: 'Medidora Laser', email: 'carla@obrapositiva.com', phone: '(11) 94567-8901', avatar: 'https://i.pravatar.cc/150?u=tm4', workload: 20, activeProjects: 1 },
  { id: 'tm5', name: 'Marcos V.', role: 'Especialista CNC', email: 'marcos@obrapositiva.com', phone: '(11) 95678-9012', avatar: 'https://i.pravatar.cc/150?u=tm5', workload: 65, activeProjects: 3 },
  { id: 'tm6', name: 'Leandro Santos', role: 'Instalador', email: 'leandro@obrapositiva.com', phone: '(11) 96789-0123', avatar: 'https://i.pravatar.cc/150?u=tm6', workload: 50, activeProjects: 2 },
  { id: 'tm7', name: 'Gabriel Lima', role: 'Auxiliar Técnico', email: 'gabriel@obrapositiva.com', phone: '(11) 97890-1234', avatar: 'https://i.pravatar.cc/150?u=tm7', workload: 30, activeProjects: 1 },
];

export const MOCK_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Granitos Export', type: 'SUPPLIER', category: 'Pedras Naturais', contactName: 'Joaquim', email: 'vendas@granitos.com', phone: '(11) 3344-5566', website: 'https://granitosexport.com.br' },
  { id: 'p2', name: 'Quartzo Tech', type: 'SUPPLIER', category: 'Sintéticos', contactName: 'Lucia', email: 'lucia@quartzotech.com', phone: '(11) 3344-9900', website: 'https://quartzotech.com' },
  { id: 'p3', name: 'Studio Arq', type: 'STAKEHOLDER', category: 'Arquitetura', contactName: 'Fabiana', email: 'fabiana@studioarq.com', phone: '(11) 99988-7766', website: 'https://studioarq.design' },
  { id: 'p4', name: 'Engenharia Civil SP', type: 'STAKEHOLDER', category: 'Gerenciamento', contactName: 'Ricardo', email: 'ricardo@engsp.com', phone: '(11) 99887-1234', website: 'https://engsp.com.br' },
  { id: 'p5', name: 'Marmoraria Imperial', type: 'SUPPLIER', category: 'Pedras Exóticas', contactName: 'César', email: 'cesar@imperial.com', phone: '(11) 3355-7788', website: 'https://marmorariaimperial.com.br' },
  { id: 'p6', name: 'Decora Iluminação', type: 'SUPPLIER', category: 'Iluminação Técnica', contactName: 'Beatriz', email: 'beatriz@decorail.com', phone: '(11) 3211-4567', website: 'https://decorail.com' },
  { id: 'p7', name: 'Marcenaria Fina Arte', type: 'STAKEHOLDER', category: 'Marcenaria', contactName: 'Paulo', email: 'paulo@mfarte.com', phone: '(11) 98765-1234', website: 'https://mfarte.com.br' },
  { id: 'p8', name: 'Vidros & Cia', type: 'SUPPLIER', category: 'Vidraçaria', contactName: 'Mariana', email: 'mariana@vidros.com', phone: '(11) 3456-7890', website: 'https://vidrosecia.com' },
  { id: 'p9', name: 'Construtora Forte', type: 'STAKEHOLDER', category: 'Construção Civil', contactName: 'Fernando', email: 'fernando@forteconstr.com', phone: '(11) 91234-9876', website: 'https://forteconstr.com.br' },
  { id: 'p10', name: 'Metais Nobres', type: 'SUPPLIER', category: 'Ferragens', contactName: 'Sérgio', email: 'sergio@metaisnbs.com', phone: '(11) 3987-6543', website: 'https://metaisnbs.com' },
  { id: 'p11', name: 'Paisagismo Verde', type: 'STAKEHOLDER', category: 'Paisagismo', contactName: 'Camila', email: 'camila@paisagismoverde.com', phone: '(11) 98888-8888', website: 'https://paisagismoverde.com.br' },
  { id: 'p12', name: 'Automação S.A.', type: 'STAKEHOLDER', category: 'Automação Residencial', contactName: 'Gustavo', email: 'gustavo@automacaosa.com', phone: '(11) 97777-7777', website: 'https://automacaosa.com.br' },
  { id: 'p13', name: 'Resinas & Cimentos', type: 'SUPPLIER', category: 'Cimento Queimado', contactName: 'Otávio', email: 'otavio@resinas.com', phone: '(11) 3654-3210', website: 'https://resinas.com' },
  { id: 'p14', name: 'Interiores Concept', type: 'STAKEHOLDER', category: 'Design de Interiores', contactName: 'Laura', email: 'laura@interioresconcept.com', phone: '(11) 96666-6666', website: 'https://interioresconcept.com' },
];

export const MOCK_USER = {
  name: 'Diretor Guilherme',
  role: 'OPERATIONS HEAD',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};
