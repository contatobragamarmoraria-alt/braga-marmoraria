
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
  { id: 'tm1', name: 'Braga', role: 'Diretoria', email: 'braga@bragamarmoraria.com', phone: '(11) 90000-0001', avatar: 'https://i.pravatar.cc/150?u=brn', workload: 85, activeProjects: 4 },
  { id: 'tm2', name: 'Jamile', role: 'Comercial', email: 'jamile@bragamarmoraria.com', phone: '(11) 90000-0002', avatar: 'https://i.pravatar.cc/150?u=jml', workload: 90, activeProjects: 12 },
  { id: 'tm3', name: 'Léo', role: 'Medidor / Conferente', email: 'leo@bragamarmoraria.com', phone: '(11) 90000-0003', avatar: 'https://i.pravatar.cc/150?u=leo', workload: 80, activeProjects: 5 },
  { id: 'tm4', name: 'Pedro', role: 'Medidor / Conferente', email: 'pedro@bragamarmoraria.com', phone: '(11) 90000-0004', avatar: 'https://i.pravatar.cc/150?u=pdr', workload: 70, activeProjects: 3 },
  { id: 'tm5', name: 'Rafa', role: 'Medidor', email: 'rafa@bragamarmoraria.com', phone: '(11) 90000-0005', avatar: 'https://i.pravatar.cc/150?u=raf', workload: 60, activeProjects: 2 },
  { id: 'tm6', name: 'Danilo', role: 'Serrador', email: 'danilo@bragamarmoraria.com', phone: '(11) 90000-0006', avatar: 'https://i.pravatar.cc/150?u=dnl', workload: 95, activeProjects: 6 },
  { id: 'tm7', name: 'Vitor', role: 'Acabador', email: 'vitor@bragamarmoraria.com', phone: '(11) 90000-0007', avatar: 'https://i.pravatar.cc/150?u=vtr', workload: 85, activeProjects: 4 },
  { id: 'tm8', name: 'Sr Vicente', role: 'Acabador', email: 'vicente@bragamarmoraria.com', phone: '(11) 90000-0008', avatar: 'https://i.pravatar.cc/150?u=vct', workload: 100, activeProjects: 5 },
  { id: 'tm9', name: 'Edivaldo', role: 'Acabador', email: 'edivaldo@bragamarmoraria.com', phone: '(11) 90000-0009', avatar: 'https://i.pravatar.cc/150?u=edv', workload: 90, activeProjects: 4 },
  { id: 'tm10', name: 'Edson', role: 'Instalador', email: 'edson@bragamarmoraria.com', phone: '(11) 90000-0010', avatar: 'https://i.pravatar.cc/150?u=eds', workload: 100, activeProjects: 8 },
  { id: 'tm11', name: 'Silvio', role: 'Ajudante', email: 'silvio@bragamarmoraria.com', phone: '(11) 90000-0011', avatar: 'https://i.pravatar.cc/150?u=slv', workload: 60, activeProjects: 3 },
  { id: 'tm12', name: 'Marcos', role: 'Ajudante', email: 'marcos@bragamarmoraria.com', phone: '(11) 90000-0012', avatar: 'https://i.pravatar.cc/150?u=mrc', workload: 60, activeProjects: 3 },
  { id: 'tm13', name: 'Rafael', role: 'Motorista', email: 'rafael@bragamarmoraria.com', phone: '(11) 90000-0013', avatar: 'https://i.pravatar.cc/150?u=rfl', workload: 75, activeProjects: 10 },
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
