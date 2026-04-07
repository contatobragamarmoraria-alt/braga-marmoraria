
export type OccurrenceType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';

export interface Occurrence {
  id: string;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  type: OccurrenceType;
  involvedTeamIds: string[];
  involvedTeamNames?: string[];
  location?: string;
  reportedBy?: string;
  attachments?: string[];
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'TEAM_MEMBER' | 'CLIENT' | 'PARTNER';

export interface UserPermissions {
  canViewFinancials: boolean;
  canViewTechnical: boolean;
  canViewCalendar: boolean;
  canViewOccurrences: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canManageUsers: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'ACTIVE' | 'REVOKED' | 'PENDING';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  permissions: UserPermissions;
}

export type ProjectStatus = 
  | 'LEAD_FECHADO' 
  | 'AGUARDANDO_MEDICAO' 
  | 'MEDICAO_CONCLUIDA'
  | 'PRODUCAO'
  | 'INSTALACAO'
  | 'FINALIZADO'
  | 'MANUTENCAO';

export type LeadSource = 
  | 'TRAFEGO_PAGO' 
  | 'CONTEUDO' 
  | 'PROSPECCAO_ATIVA' 
  | 'INDICACAO' 
  | 'SITE' 
  | 'LINK_AFILIADO' 
  | 'TRAFEGO_ORGANICO' 
  | 'ASSESSORIA_IMPRENSA';

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  date: string;
}

export interface ProjectTask {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  assignedToId?: string;
  category?: 'PRODUCAO' | 'INSTALACAO' | 'LOGISTICA';
  scheduledDate?: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  googleCalendarId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Interface for team members used in MOCK_TEAM
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  workload: number;
  activeProjects: number;
}

// Interface for partners used in MOCK_PARTNERS
export interface Partner {
  id: string;
  name: string;
  type: 'SUPPLIER' | 'STAKEHOLDER';
  category: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
}

// Interface for chat messages used in WhatsAppMirror
export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

// Interface for timeline actions used in VerticalTimeline
export interface TimelineAction {
  id: string;
  label: string;
  description: string;
  week: number;
  completed: boolean;
  responsibleId?: string;
  date?: string;
}

export interface ProjectScope {
  description: string;
  sizeM2: number;
  numCuts: number;
  stoneType: string;
  deliveryDeadline: string;
  address: string;
  clientName: string;
  clientPhone: string;
  photos: string[];
  aiAnalysisDate?: string;
  // New contract-based fields
  itemType: string;
  inclusions: string[];
  exclusions: string[];
}

export interface ProjectContractData {
  contractorName: string;
  cpf: string;
  phone: string;
  address: string;
  cep: string;
  salesperson: string;
  closingDate: string;
  projectType: string;
  scope: string[];
  commercialConditions: {
    totalValue: number;
    paymentMethod: string;
    downPayment: number;
    cancellationRule: string;
  };
  billingData?: {
    pixKey: string;
    bank: string;
    agency: string;
    account: string;
  };
  preExecutionStage: {
    siteCheckPerformed: boolean;
    templateReady: boolean;
    technicalConditionsMet: {
      plasterFinished: boolean;
      plumbingInstalled: boolean;
      electricalInstalled: boolean;
      cabinetStructureReady: boolean;
    };
  };
  responsibilities: {
    client: string[];
    company: string[];
  };
  technicalConditions: {
    variationsAcknowledged: boolean;
    finishingTolerancesAccepted: boolean;
    educationCompleted: boolean;
  };
  warranty: {
    period: string;
    coverage: string;
    exclusions: string;
  };
}

export interface Project {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientEmail: string;
  phone: string;
  projectType: string;
  concept: string;
  value: number;
  paymentMethod: string;
  startDate: string;
  estimatedDelivery: string;
  status: ProjectStatus;
  progress: number;
  responsible: string;
  tasks: ProjectTask[];
  timeline: TimelineAction[];
  history: any[];
  image?: string;
  beforeImages: string[];
  afterImages: string[];
  teamIds: string[];
  supplierIds: string[];
  stakeholderIds: string[];
  materials: any[];
  references: string[];
  photoLog: any[];
  notes?: string;
  detailedScope?: any[];
  documents: ProjectDocument[];
  scope?: ProjectScope;
  contractData?: ProjectContractData;
  deletedAt?: string; // ISO date when moved to trash
}

export interface KnowledgeEntry {
  id: string;
  type: 'LESSON_LEARNED' | 'OCCURRENCE' | 'BEST_PRACTICE';
  title: string;
  description: string;
  projectId?: string;
  projectName?: string;
  date: string;
  involvedUserIds: string[];
  tags: string[];
}
