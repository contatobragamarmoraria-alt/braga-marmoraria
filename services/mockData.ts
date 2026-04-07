
import { Project, TimelineAction, ProjectDocument, Occurrence } from '../types';

// Helper functions to get dynamic dates
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

const getToday = (): Date => new Date();
const getTomorrow = (): Date => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today;
};
const getInDays = (n: number): Date => {
  const today = new Date();
  today.setDate(today.getDate() + n);
  return today;
};


// Datas fixas para estabilidade do cronograma
const projectTimelines: { [key: string]: TimelineAction[] } = {
  'OP-ANB-001': [
    { id: 'LEAD-anb', week: 1, label: 'Lead Fechado', description: 'Reunião inicial com Ana Beatriz para definição de escopo e conceito.', completed: true, date: '2025-11-20', responsibleId: 'tm2' },
    { id: 'MEDICAO-anb', week: 2, label: 'Medição', description: 'Visita técnica para escaneamento 3D da cozinha.', completed: true, date: '2025-12-05', responsibleId: 'tm4' },
    { id: 'REUNIAO_2-anb', week: 4, label: 'Conceito', description: 'Defesa técnica da solução de paginação do Quartzito.', completed: false, date: '2026-01-15', responsibleId: 'tm2' },
    { id: 'APROVACAO_TECNICA-anb', week: 5, label: 'Apresentação', description: 'Validação do projeto executivo final.', completed: false, date: '2026-01-28', responsibleId: 'tm2'},
    { id: 'PAGINACAO-anb', week: 6, label: 'Produção', description: 'Desenvolvimento da paginação e otimização do corte das chapas.', completed: false, date: '2026-02-10', responsibleId: 'tm5'},
    { id: 'CORTE-anb', week: 8, label: 'Corte', description: 'Corte de precisão das chapas de Quartzito Taj Mahal.', completed: false, date: '2026-02-25', responsibleId: 'tm5' },
    { id: 'POLIMENTO-anb', week: 10, label: 'Acabamento', description: 'Polimento e acabamento de bordas.', completed: false, date: '2026-03-12', responsibleId: 'tm1' },
    { id: 'INSTALACAO-anb', week: 12, label: 'Instalação', description: 'Montagem final da cozinha na Penthouse.', completed: false, date: '2026-04-02', responsibleId: 'tm3' },
    { id: 'FINALIZADO-anb', week: 13, label: 'Entrega Técnica', description: 'Vistoria final e assinatura do termo.', completed: false, date: '2026-04-10', responsibleId: 'tm3'},
    { id: 'MANUTENCAO-anb', week: 14, label: 'Pós-obra', description: 'Acompanhamento pós-obra.', completed: false, date: '2026-04-25', responsibleId: 'tm1'}
  ],
  'OP-MSQ-002': [
    { id: 'LEAD-msq', week: 1, label: 'Lead Fechado', description: 'Reunião com Dr. Marcos para briefing da recepção.', completed: true, date: '2025-12-01', responsibleId: 'tm2' },
    { id: 'MEDICAO-msq', week: 2, label: 'Medição', description: 'Escaneamento da clínica para projeto do balcão.', completed: true, date: '2025-12-10', responsibleId: 'tm4' },
    { id: 'REUNIAO_2-msq', week: 4, label: 'Conceito', description: 'Apresentação de Mármore Carrara.', completed: false, date: '2026-01-20', responsibleId: 'tm2' },
    { id: 'APROVACAO_TECNICA-msq', week: 5, label: 'Apresentação', description: 'Aprovação técnica do design do balcão.', completed: false, date: '2026-02-05', responsibleId: 'tm2' },
    { id: 'PAGINACAO-msq', week: 6, label: 'Produção', description: 'Paginação para veios contínuos.', completed: false, date: '2026-02-18', responsibleId: 'tm5' },
    { id: 'CORTE-msq', week: 8, label: 'Corte', description: 'Corte do balcão em CNC.', completed: false, date: '2026-03-04', responsibleId: 'tm5' },
    { id: 'POLIMENTO-msq', week: 10, label: 'Acabamento', description: 'Acabamento e polimento do Carrara.', completed: false, date: '2026-03-20', responsibleId: 'tm1' },
    { id: 'INSTALACAO-msq', week: 12, label: 'Instalação', description: 'Instalação noturna para não afetar a clínica.', completed: false, date: '2026-04-15', responsibleId: 'tm3' },
    { id: 'FINALIZADO-msq', week: 13, label: 'Entrega Técnica', description: 'Entrega da obra e manual de cuidados.', completed: false, date: '2026-04-22', responsibleId: 'tm3' },
    { id: 'MANUTENCAO-msq', week: 14, label: 'Pós-obra', description: 'Agendamento de polimento semestral.', completed: false, date: '2026-10-22', responsibleId: 'tm1' }
  ],
  'OP-SOC-003': [
    { id: 'LEAD-soc', week: 1, label: 'Lead Fechado', description: 'Briefing inicial com Sofia e Carlos para cozinha gourmet.', completed: true, date: '2025-10-10', responsibleId: 'tm2'},
    { id: 'MEDICAO-soc', week: 2, label: 'Medição', description: 'Levantamento de medidas no Itaim Bibi.', completed: true, date: '2025-10-25', responsibleId: 'tm4'},
    { id: 'REUNIAO_2-soc', week: 4, label: 'Conceito', description: 'Apresentação de conceito com mármore de veios dourados.', completed: true, date: '2026-01-10', responsibleId: 'tm2'},
    { id: 'APROVACAO_TECNICA-soc', week: 5, label: 'Apresentação', description: 'Validação final dos desenhos técnicos.', completed: false, date: '2026-01-24', responsibleId: 'tm2'},
    { id: 'PAGINACAO-soc', week: 6, label: 'Produção', description: 'Paginação do mármore Nero Marquina.', completed: false, date: '2026-02-08', responsibleId: 'tm5'},
    { id: 'CORTE-soc', week: 8, label: 'Corte', description: 'Corte da bancada e ilha.', completed: false, date: '2026-02-22', responsibleId: 'tm5'},
    { id: 'POLIMENTO-soc', week: 10, label: 'Acabamento', description: 'Acabamento das bordas e cuba esculpida.', completed: false, date: '2026-03-10', responsibleId: 'tm1'},
    { id: 'INSTALACAO-soc', week: 12, label: 'Instalação', description: 'Instalação e integração com a marcenaria.', completed: false, date: '2026-03-28', responsibleId: 'tm3'},
    { id: 'FINALIZADO-soc', week: 13, label: 'Entrega Técnica', description: 'Apresentação do projeto finalizado ao casal.', completed: false, date: '2026-04-05', responsibleId: 'tm3'},
    { id: 'MANUTENCAO-soc', week: 14, label: 'Pós-obra', description: 'Contato de acompanhamento e satisfação.', completed: false, date: '2026-05-05', responsibleId: 'tm1'}
  ]
};

// Add more timelines for other projects to make calendar full
projectTimelines['OP-JLU-004'] = projectTimelines['OP-ANB-001'].map(t => ({...t, date: new Date(new Date(t.date).getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}));
projectTimelines['OP-PMN-005'] = projectTimelines['OP-MSQ-002'].map(t => ({...t, date: new Date(new Date(t.date).getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}));
projectTimelines['OP-CVI-006'] = projectTimelines['OP-SOC-003'].map(t => ({...t, date: new Date(new Date(t.date).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}));
projectTimelines['OP-JPA-007'] = projectTimelines['OP-ANB-001'].map(t => ({...t, date: new Date(new Date(t.date).getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}));
projectTimelines['OP-RJU-008'] = projectTimelines['OP-MSQ-002'].map(t => ({...t, date: new Date(new Date(t.date).getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}));
projectTimelines['OP-MSI-009'] = projectTimelines['OP-SOC-003'].map(t => ({...t, date: new Date(new Date(t.date).getTime() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}));
projectTimelines['OP-UNI-010'] = projectTimelines['OP-ANB-001'].map(t => ({...t, date: new Date(new Date(t.date).getTime() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}));


export const initialProjects: Project[] = [
  {
    id: 'OP-ANB-001',
    clientName: 'Ana Beatriz Cavalcanti',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'ana.beatriz@estudio.com',
    phone: '(11) 99122-3344',
    projectType: 'Penthouse Jardins - Cozinha Integrada',
    concept: 'Minimalismo escandinavo com foco em texturas naturais e veios contínuos do Quartzito.',
    value: 22500,
    paymentMethod: 'Parcelado 10x s/ Juros (Cartão Corporativo)',
    startDate: '2025-11-20',
    estimatedDelivery: '2026-04-15',
    status: 'LEAD_FECHADO',
    progress: 18,
    responsible: 'Ana Paula',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [],
    afterImages: [],
    teamIds: ['tm2', 'tm4'],
    supplierIds: ['p1'],
    stakeholderIds: ['p3'],
    materials: [{ id: 'm1', name: 'Quartzito Taj Mahal', origin: 'Brasil', type: 'Natural', image: 'https://i.pravatar.cc/150?u=m1' }],
    references: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1628592102751-ba834f691838?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596205252519-ef236d259589?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617806118233-528e02b28bab?auto=format&fit=crop&q=80&w=800'
    ],
    detailedScope: [
      { title: 'Bancada Principal', items: ['Quartzito Taj Mahal 4cm', 'Acabamento em meia esquadria invisível', 'Corte para cuba esculpida', 'Furação para misturador monocomando'] },
      { title: 'Ilha Central', items: ['Revestimento total em Quartzito', 'Paginação bookmatched nos 4 lados', 'Tomadas embutidas na pedra'] },
      { title: 'Frontão', items: ['Peça única de 3 metros', 'Alinhamento de veios com a bancada'] }
    ],
    photoLog: [
        { id: 'pl1', date: '2025-11-20', author: 'Ana Paula', notes: 'Primeira visita e alinhamento de expectativas. Cliente receptiva ao conceito de veios contínuos.', images: ['https://images.unsplash.com/photo-1588854337236-6889d631f385?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1567062957823-b16d610a51e1?auto=format&fit=crop&q=80&w=600'] },
        { id: 'pl2', date: '2025-12-05', author: 'Ricardo Silva', notes: 'Medição técnica realizada com scanner 3D. Conferência de prumos e níveis concluída.', images: ['https://images.unsplash.com/photo-1503387762-592dee58292b?auto=format&fit=crop&q=80&w=600'] }
    ],
    timeline: projectTimelines['OP-ANB-001'],
    tasks: [
      { id: 't1_anb', name: 'Briefing Criativo: Reunião 1', description: 'Definição de materiais e fluxos.', completed: true, scheduledDate: '2025-11-20', scheduledTime: '10:00' },
      { id: 't2_anb', name: 'Agendamento Medição Laser', description: 'Visita técnica no local.', completed: true, scheduledDate: '2025-12-05', scheduledTime: '09:00' },
      { id: 't3_anb', name: 'Apresentação N2 - Conceito', description: 'Reunião de defesa técnica da proposta.', completed: false, scheduledDate: formatDate(getToday()), scheduledTime: '14:00' },
      { id: 't4_anb', name: 'Enviar contrato para assinatura', description: 'Formalização do projeto.', completed: false, scheduledDate: formatDate(getInDays(4)), scheduledTime: '18:00' }
    ],
    history: [
      { id: 'h1', date: '2025-11-20T10:00:00', type: 'EVENT', description: 'Reunião de Briefing realizada no Atelier.' },
      { id: 'h2', date: '2025-12-05T09:00:00', type: 'VISIT', description: 'Visita técnica para medição laser concluída.' },
      { id: 'h3', date: '2026-01-10T15:30:00', type: 'DOC', description: 'Contrato enviado para assinatura digital.' }
    ],
    documents: [
      { id: 'doc_anb_1', name: 'Proposta Comercial v2', type: 'Comercial / PDF', url: '#', date: '2025-11-25' },
      { id: 'doc_anb_2', name: 'Certificado de Autenticidade Taj Mahal', type: 'Técnico / PDF', url: '#', date: '2025-12-10' }
    ]
  },
  {
    id: 'OP-MSQ-002',
    clientName: 'Dr. Marcos Siqueira',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'contato@siqueiraodonto.com.br',
    phone: '(11) 98765-4321',
    projectType: 'Clínica Odonto Luxo - Recepção',
    concept: 'Imponência e assepsia com Mármore Carrara e iluminação embutida.',
    value: 24800,
    paymentMethod: 'À Vista com Desconto (PIX)',
    startDate: '2025-12-01',
    estimatedDelivery: '2026-05-10',
    status: 'AGUARDANDO_MEDICAO',
    progress: 15,
    responsible: 'Carla Dias',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbb563?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [],
    afterImages: [],
    teamIds: ['tm4', 'tm2'],
    supplierIds: ['p1'],
    stakeholderIds: ['p4'],
    materials: [],
    references: [],
    detailedScope: [
      { title: 'Balcão de Atendimento', items: ['Mármore Carrara Gióia', 'Design monolítico', 'Iluminação LED embutida na base'] },
      { title: 'Paredes Laterais', items: ['Revestimento em painéis de mármore', 'Frisos em metal dourado'] }
    ],
    photoLog: [
      { id: 'pl_msq_1', date: '2025-12-10', author: 'Carla Dias', notes: 'Medição concluída. Espaço pronto para receber a estrutura metálica de suporte.', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbb563?auto=format&fit=crop&q=80&w=600'] }
    ],
    timeline: projectTimelines['OP-MSQ-002'],
    tasks: [
      { id: 't1_msq', name: 'Medição Técnica Laser', description: 'Escaneamento 3D da recepção.', completed: true, scheduledDate: '2025-12-10', scheduledTime: '14:00' },
      { id: 't2_msq', name: 'Processamento de Nuvem de Pontos', description: 'Gerar CAD para paginação.', completed: false, scheduledDate: formatDate(getTomorrow()), scheduledTime: '08:00' },
      { id: 't3_msq', name: 'Seleção de Chapa de Carrara', description: 'Visita ao fornecedor com o cliente.', completed: false, scheduledDate: formatDate(getInDays(7)), scheduledTime: '10:00' }
    ],
    history: [
      { id: 'h_msq_1', date: '2025-12-01T14:00:00', type: 'EVENT', description: 'Contrato fechado e sinal recebido.' },
      { id: 'h_msq_2', date: '2025-12-10T14:00:00', type: 'VISIT', description: 'Medição técnica laser realizada.' }
    ],
    documents: []
  },
  {
    id: 'OP-SOC-003',
    clientName: 'Sofia e Carlos',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'sofia.carlos@gmail.com',
    phone: '(11) 99911-2233',
    projectType: 'Cozinha Gourmet Itaim Bibi',
    concept: 'Contraste entre marcenaria escura e bancada em mármore com veios dourados.',
    value: 18000,
    paymentMethod: 'Entrada + 3x no Boleto',
    startDate: '2025-10-10',
    estimatedDelivery: '2026-02-05',
    status: 'AGUARDANDO_MEDICAO',
    progress: 25,
    responsible: 'Ana Paula',
    image: 'https://images.unsplash.com/photo-1600607688960-e095fb823438?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [
      'https://images.unsplash.com/photo-1556911220-e1094c9654b2?auto=format&fit=crop&q=80&w=800',
    ],
    afterImages: [],
    teamIds: ['tm2'],
    supplierIds: ['p2'],
    stakeholderIds: ['p3'],
    materials: [],
    references: [
      'https://images.unsplash.com/photo-1600607688960-e095fb823438?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=800'
    ],
    detailedScope: [
        { title: 'Bancada Principal', items: ['Mármore Nero Marquina 4cm', 'Acabamento polido', 'Corte para cuba dupla'] },
        { title: 'Marcenaria', items: ['Armários em MDF tom ébano', 'Puxadores em concha dourados'] }
    ],
    photoLog: [
      { id: 'pl_soc_1', date: '2025-11-05', author: 'Ana Paula', notes: 'Alinhamento N2, cliente aprovou o contraste de materiais.', images: ['https://images.unsplash.com/photo-1556911220-e1094c9654b2?auto=format&fit=crop&q=80&w=800'] }
    ],
    timeline: projectTimelines['OP-SOC-003'],
    tasks: [
      { id: 't1_soc', name: 'Apresentação de Layout Preliminar', description: 'Defesa técnica do projeto.', completed: true, scheduledDate: '2026-01-10', scheduledTime: '16:30' },
      { id: 't2_soc', name: 'Revisão de Projeto com Arquiteto', description: 'Alinhar pontos de elétrica para iluminação.', completed: false, scheduledDate: formatDate(getInDays(3)), scheduledTime: '11:00' }
    ],
    history: [],
    documents: [
      { id: 'doc_soc_1', name: 'Contrato Prestação de Serviço v1.0', type: 'Jurídico / PDF', url: '#', date: '2025-10-10' },
      { id: 'doc_soc_2', name: 'Planta Baixa Cozinha (Cliente)', type: 'Arquitetônico / DWG', url: '#', date: '2025-10-10' }
    ]
  },
  {
    id: 'OP-JLU-004',
    clientName: 'Arq. Jorge Lucca',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'jorge@lucca-arq.com',
    phone: '(11) 91122-3344',
    projectType: 'Lobby Edifício Corporate Faria Lima',
    concept: 'Sustentabilidade e luxo com pedras nacionais de baixo impacto.',
    value: 25000,
    paymentMethod: 'Faturamento Mensal p/ Construtora',
    startDate: '2025-09-15',
    estimatedDelivery: '2026-06-15',
    status: 'PRODUCAO',
    progress: 35,
    responsible: 'Roberto Silva',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b614c8b2?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [], afterImages: [], teamIds: ['tm1', 'tm2', 'tm5'], supplierIds: ['p1'], stakeholderIds: ['p4'], materials: [], references: [],
    detailedScope: [
      { title: 'Piso Térreo', items: ['Quartzito Mont Blanc 120x120cm', 'Acabamento levigado', 'Paginação bookmatched'] },
      { title: 'Recepção', items: ['Bancada em Mármore Verde Alpi', 'Design orgânico com bordas arredondadas'] }
    ],
    photoLog: [],
    timeline: projectTimelines['OP-JLU-004'],
    tasks: [
      { id: 't1_jlu', name: 'Paginação de Piso 120x120', description: 'Otimização de cortes p/ redução de perda.', completed: true, scheduledDate: '2026-02-01', scheduledTime: '09:00' },
      { id: 't2_jlu', name: 'Validação de Amostras de Lote', description: 'Conferência de tonalidade.', completed: false, scheduledDate: formatDate(getInDays(5)), scheduledTime: '15:00' },
      { id: 't3_jlu', name: 'Planejamento de Logística de Entrega', description: 'Coordenar com a construtora o recebimento.', completed: false, scheduledDate: '2026-02-28', scheduledTime: '10:00'}
    ],
    history: [],
    documents: [ { id: 'doc_jlu_1', name: 'Memorial Descritivo Edifício', type: 'Engenharia / PDF', url: '#', date: '2025-09-15' } ]
  },
  {
    id: 'OP-PMN-005',
    clientName: 'Patrícia Mendonça',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'patricia@mendonca.adv.br',
    phone: '(11) 97766-5544',
    projectType: 'Banheiro Master em Calacatta Borghini',
    concept: 'Experiência de SPA residencial com aquecimento de piso e mármore book-matched.',
    value: 15750,
    paymentMethod: 'Cartão de Crédito 12x',
    startDate: '2025-08-20',
    estimatedDelivery: '2026-01-20',
    status: 'MEDICAO_CONCLUIDA',
    progress: 45,
    responsible: 'Ana Paula',
    image: 'https://images.unsplash.com/photo-1603991342933-f16f39958342?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [], afterImages: [], teamIds: ['tm2', 'tm4'], supplierIds: ['p1'], stakeholderIds: ['p3'], materials: [], references: [],
    detailedScope: [
      { title: 'Paredes Box', items: ['Mármore Calacatta Borghini paginado', 'Nicho com iluminação embutida'] },
      { title: 'Bancada', items: ['Cuba dupla esculpida na pedra', 'Válvula oculta'] }
    ],
    photoLog: [],
    timeline: projectTimelines['OP-PMN-005'],
    tasks: [ 
      { id: 't1_pmn', name: 'Assinatura de Projeto Executivo', description: 'Aprovação final das cotas.', completed: true, scheduledDate: '2025-12-10', scheduledTime: '11:00' },
      { id: 't2_pmn', name: 'Pedido de Lote Especial Calacatta', description: 'Formalizar compra do material.', completed: false, scheduledDate: formatDate(getInDays(6))}
    ],
    history: [],
    documents: []
  },
  {
    id: 'OP-CVI-006',
    clientName: 'Construtora Viver S/A',
    clientAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'obras@viversa.com.br',
    phone: '(11) 3344-0011',
    projectType: 'Escadaria Monumental - Hall Central',
    concept: 'Impacto visual com mármore verde e metal dourado.',
    value: 23500,
    paymentMethod: 'Cronograma Físico-Financeiro',
    startDate: '2025-07-15',
    estimatedDelivery: '2026-03-30',
    status: 'PRODUCAO',
    progress: 60,
    responsible: 'Marcos V.',
    image: 'https://images.unsplash.com/photo-1617806118233-528e02b28bab?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [], afterImages: [], teamIds: ['tm5', 'tm1'], supplierIds: ['p1'], stakeholderIds: ['p4'], materials: [], references: [],
    detailedScope: [], photoLog: [], timeline: projectTimelines['OP-CVI-006'],
    tasks: [
      { id: 't1_cvi', name: 'Corte CNC de Degraus Curvos', description: 'Precisão milimétrica em curvas.', completed: true, scheduledDate: '2026-01-15', scheduledTime: '08:00' },
      { id: 't2_cvi', name: 'Conferência de Encaixes', description: 'Teste de montagem em seco.', completed: false, scheduledDate: '2026-01-20', scheduledTime: '13:00' }
    ],
    history: [], documents: []
  },
  {
    id: 'OP-JPA-007',
    clientName: 'Juliana P. Almeida',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'juliana.almeida@design.com',
    phone: '(11) 98888-9999',
    projectType: 'Bancada de Lavabo',
    concept: 'Peça única em Ônix translúcido com iluminação interna.',
    value: 4800,
    paymentMethod: 'À Vista',
    startDate: '2025-08-01',
    estimatedDelivery: '2025-12-12',
    status: 'PRODUCAO',
    progress: 75,
    responsible: 'Roberto Silva',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a67767e85?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [], afterImages: [], teamIds: ['tm1'], supplierIds: ['p2'], stakeholderIds: ['p3'], materials: [], references: [],
    detailedScope: [], photoLog: [], timeline: projectTimelines['OP-JPA-007'],
    tasks: [
      { id: 't1_jpa', name: 'Polimento de Bordas 45°', description: 'Acabamento invisível.', completed: false, scheduledDate: formatDate(getInDays(2)), scheduledTime: '09:00' },
      { id: 't2_jpa', name: 'Aplicação de Impermeabilizante', description: 'Proteção contra manchas de gordura.', completed: false, scheduledDate: '2025-11-22', scheduledTime: '15:00' },
      { id: 't3_jpa', name: 'Teste de Iluminação Interna', description: 'Verificar uniformidade do LED.', completed: false, scheduledDate: '2025-11-25', scheduledTime: '11:00'}
    ],
    history: [], documents: []
  },
  {
    id: 'OP-RJU-008',
    clientName: 'Ricardo Junqueira',
    clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'rj@junqueirainvest.com',
    phone: '(11) 99112-2233',
    projectType: 'Adega Subterrânea de Luxo',
    concept: 'Climatização e sofisticação com basalto vulcânico.',
    value: 19200,
    paymentMethod: 'Entrada 50% + 50% na Entrega',
    startDate: '2025-07-01',
    estimatedDelivery: '2025-12-18',
    status: 'INSTALACAO',
    progress: 90,
    responsible: 'Sandro Tech',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631f385?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [], afterImages: [], teamIds: ['tm3', 'tm1'], supplierIds: ['p1'], stakeholderIds: ['p4'], materials: [], references: [],
    detailedScope: [], photoLog: [], timeline: projectTimelines['OP-RJU-008'],
    tasks: [
      { id: 't1_rju', name: 'Montagem de Suportes Invisíveis', description: 'Carga técnica pesada.', completed: true, scheduledDate: '2025-12-05', scheduledTime: '08:30' },
      { id: 't2_rju', name: 'Colocação das Placas de Revestimento', description: 'Obra ativa no local.', completed: false, scheduledDate: '2025-12-10', scheduledTime: '09:00' }
    ],
    history: [], documents: []
  },
  {
    id: 'OP-MSI-009',
    clientName: 'Marina Silva',
    clientAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'marina.silva@arquitetura.com',
    phone: '(11) 97777-1111',
    projectType: 'Soleira de Apartamento',
    concept: 'Ajuste de soleira em Granito Preto São Gabriel.',
    value: 1200,
    paymentMethod: 'PIX',
    startDate: '2025-11-10',
    estimatedDelivery: '2025-11-28',
    status: 'FINALIZADO',
    progress: 100,
    responsible: 'Sandro Tech',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200',
    beforeImages: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'],
    afterImages: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'],
    teamIds: ['tm3'],
    supplierIds: ['p2'],
    stakeholderIds: ['p3'],
    materials: [],
    references: [],
    detailedScope: [ { title: 'Serviço', items: ['Remoção de peça existente', 'Corte e instalação de nova soleira 90x15cm', 'Rejuntamento e limpeza'] } ],
    photoLog: [],
    timeline: projectTimelines['OP-MSI-009'],
    tasks: [ { id: 't1_msi', name: 'Entrega Técnica e Termo', description: 'Assinatura do certificado.', completed: true, scheduledDate: '2025-11-28', scheduledTime: '10:00' } ],
    history: [],
    documents: [ { id: 'doc_msi_1', name: 'Ordem de Serviço 987', type: 'Operacional / PDF', url: '#', date: '2025-11-10' } ]
  },
  {
    id: 'OP-UNI-010',
    clientName: 'Condomínio Unique',
    clientAvatar: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=200',
    clientEmail: 'sindico@unique-morumbi.com',
    phone: '(11) 3221-5566',
    projectType: 'Revitalização de Fachada',
    concept: 'Manutenção preventiva e restauração de brilho original.',
    value: 9500,
    paymentMethod: 'Boleto Mensal (Fundo de Reserva)',
    startDate: '2025-07-01',
    estimatedDelivery: '2026-01-20',
    status: 'MANUTENCAO',
    progress: 95,
    responsible: 'Roberto Silva',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    beforeImages: [], afterImages: [], teamIds: ['tm1', 'tm3'], supplierIds: [], stakeholderIds: ['p4'], materials: [], references: [],
    detailedScope: [], photoLog: [], timeline: projectTimelines['OP-UNI-010'],
    tasks: [ 
      { id: 't1_uni', name: 'Visita de Inspeção Trimestral', description: 'Checar impermeabilização.', completed: false, scheduledDate: '2026-02-15', scheduledTime: '14:00' },
      { id: 't2_uni', name: 'Aplicação de Hidrofugante', description: 'Manutenção preventiva da fachada.', completed: false, scheduledDate: '2026-02-20', scheduledTime: '09:00'}
    ],
    history: [], documents: []
  }
];

// Add 28 new leads for the current month
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

for (let i = 1; i <= 28; i++) {
  const randomDay = Math.floor(Math.random() * 28) + 1; // Day between 1 and 28
  const leadDate = new Date(currentYear, currentMonth, randomDay);

  initialProjects.push({
    id: `OP-LEAD-${String(i).padStart(3, '0')}`,
    clientName: `Novo Lead #${i}`,
    clientAvatar: `https://i.pravatar.cc/150?u=lead${i}`,
    clientEmail: `lead${i}@example.com`,
    phone: '(11) 91234-5678',
    projectType: 'Diagnóstico Inicial',
    concept: 'Análise de viabilidade e escopo para novo projeto.',
    value: 0,
    paymentMethod: '',
    startDate: formatDate(leadDate),
    estimatedDelivery: '',
    status: 'LEAD_FECHADO',
    progress: 0,
    responsible: 'Ana Paula',
    tasks: [],
    timeline: [],
    history: [],
    beforeImages: [],
    afterImages: [],
    teamIds: ['tm2'],
    supplierIds: [],
    stakeholderIds: [],
    materials: [],
    references: [],
    photoLog: [],
    documents: []
  });
}

export const MOCK_OCCURRENCES: Occurrence[] = [
  {
    id: 'occ1',
    projectId: 'OP-ANB-001',
    projectName: 'Penthouse Ana Beatriz',
    clientName: 'Ana Beatriz Cavalcanti',
    date: '2026-03-10',
    title: 'Dano no Piso da Cliente',
    description: 'A cliente relatou que durante a visita técnica para medição final, houve um dano (risco profundo) no piso de madeira da sala. O dano foi causado pela movimentação de equipamentos sem a proteção adequada.',
    type: 'NEGATIVE',
    involvedTeamIds: ['tm6', 'tm7'],
    involvedTeamNames: ['Leandro Santos', 'Gabriel Lima'],
    location: 'Sala de Estar',
    reportedBy: 'Ana Beatriz Cavalcanti'
  },
  {
    id: 'occ2',
    projectId: 'OP-MSQ-002',
    projectName: 'Clínica Dr. Marcos',
    clientName: 'Dr. Marcos Siqueira',
    date: '2026-03-15',
    title: 'Elogio à Limpeza e Organização',
    description: 'O cliente entrou em contato para elogiar a postura da equipe durante a instalação noturna. Ressaltou que o ambiente foi deixado impecável, superando as expectativas de organização.',
    type: 'POSITIVE',
    involvedTeamIds: ['tm3'],
    involvedTeamNames: ['Sandro Tech'],
    location: 'Recepção',
    reportedBy: 'Dr. Marcos Siqueira'
  },
  {
    id: 'occ3',
    projectId: 'OP-ANB-001',
    projectName: 'Penthouse Ana Beatriz',
    clientName: 'Ana Beatriz Cavalcanti',
    date: '2026-03-18',
    title: 'Atraso na Entrega de Material',
    description: 'O fornecedor Granitos Export atrasou a entrega das chapas de Quartzito Taj Mahal em 2 dias devido a problemas na logística interna.',
    type: 'NEGATIVE',
    involvedTeamIds: ['tm1'],
    involvedTeamNames: ['Roberto Silva'],
    location: 'Atelier / Produção',
    reportedBy: 'Roberto Silva'
  }
];
