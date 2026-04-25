import { Project } from '../types';

const initialProjects: Project[] = [
  {
    "id": "C202614",
    "clientName": "Exemplo Contrato Real",
    "clientAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    "clientEmail": "cliente@exemplo.com",
    "phone": "(11) 90000-0000",
    "projectType": "Bancada com Fechamento Lateral",
    "concept": "Projeto em Quartzo Branco com fechamento lateral e cuba fornecida pela Braga Marmoraria.",
    "value": 6000,
    "paymentMethod": "R$ 6.000,00 EM 6X NO FECHAMENTO DO PEDIDO",
    "startDate": "2026-02-18",
    "estimatedDelivery": "30 dias úteis após medição",
    "status": "AGUARDANDO_MEDICAO",
    "progress": 10,
    "responsible": "Leonil Braga",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    "beforeImages": [],
    "afterImages": [],
    "teamIds": ["tm1"],
    "supplierIds": [],
    "stakeholderIds": [],
    "materials": ["Quartzo Branco"],
    "references": [],
    "detailedScope": [
      {
        "title": "Cozinha",
        "items": [
          "Bancada em Quartzo Branco",
          "Fechamento lateral (pé de cascata)",
          "Instalação de cuba fornecida pela empresa"
        ]
      }
    ],
    "history": [
      {
        "id": "h1",
        "date": "2026-02-18",
        "user": "Sistema",
        "action": "Contrato assinado e sinal efetuado."
      }
    ],
    "documents": [],
    "tasks": [
      { "id": "t1", "title": "Confirmar se móveis estão instalados (Item 10)", "completed": false, "category": "TECNICO" },
      { "id": "t2", "title": "Medição Técnica no Local", "completed": false, "category": "TECNICO" },
      { "id": "t3", "title": "Compra de Chapas (Quartzo Branco)", "completed": false, "category": "PRODUCAO" }
    ],
    "timeline": [],
    "contractData": {
      "contractorName": "Exemplo Contrato Real",
      "cpf": "000.000.000-00",
      "phone": "(11) 90000-0000",
      "address": "Endereço da Obra, Guarulhos/SP",
      "cep": "07000-000",
      "salesperson": "Leonil Braga",
      "closingDate": "2026-02-18",
      "projectType": "Bancada com Fechamento Lateral",
      "scope": ["Bancada", "Fechamento Lateral"],
      "commercialConditions": {
        "totalValue": 6000,
        "paymentMethod": "6x no Fechamento",
        "downPayment": 1000,
        "cancellationRule": "Desistência não implica na devolução do sinal (Cláusula 13)"
      },
      "billingData": {
        "pixKey": "17.496.099/0001-67",
        "bank": "Itaú (Ag 6830 C/C 39240-0) / Santander (Ag 4638 C/C 13002688-9)",
        "agency": "Várias",
        "account": "Ver Contrato"
      },
      "responsibilities": {
        "client": [
          "Garantir local livre e móveis instalados para medição.",
          "Fornecer projetos de hidráulica/elétrica/gás.",
          "Remover granitos/pisos existentes (Item 9)."
        ],
        "company": [
          "Instalação do granito e cuba.",
          "Garantia de 2 anos contra defeitos de fabricação.",
          "Peso máximo suportado: 30kg."
        ]
      },
      "warranty": {
        "period": "24 meses (2 anos)",
        "coverage": "Defeitos de fabricação e instalação.",
        "exclusions": "Uso de produtos abrasivos, ácidos, peso excessivo (>30kg)."
      }
    }
  }
];

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        return data.length > 0 ? data : initialProjects;
      }
      return initialProjects;
    } catch (e) {
      console.warn("API fallback to initialProjects");
      return initialProjects;
    }
  },

  subscribeToProjects: (callback: (projects: Project[]) => void) => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const projects = await response.json();
          callback(projects);
        } else {
          callback(initialProjects);
        }
      } catch (error) {
        callback(initialProjects);
      }
    };

    fetchProjects();
    const interval = setInterval(fetchProjects, 5000);
    return () => clearInterval(interval);
  },

  addProject: async (project: Project) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return response.json();
  },

  updateProject: async (project: Project) => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return response.json();
  },

  softDeleteProject: async (projectId: string) => {
    // We already have a put route, we'll fetch the project first or just send a partial update
    // But for simplicity with our current backend, we can just send the updated project
    const response = await fetch('/api/projects');
    const projects = await response.json();
    const project = projects.find((p: any) => p.id === projectId);
    if (project) {
      const updated = { ...project, deletedAt: new Date().toISOString() };
      return projectService.updateProject(updated);
    }
  },

  restoreProject: async (projectId: string) => {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    const project = projects.find((p: any) => p.id === projectId);
    if (project) {
      const updated = { ...project, deletedAt: null };
      return projectService.updateProject(updated);
    }
  },

  deletePermanent: async (projectId: string) => {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  cleanupTrash: async () => {
    // This could be done on the backend, but we'll leave it for now or implement as a loop
  }
};
