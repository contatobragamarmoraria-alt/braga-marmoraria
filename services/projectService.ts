import { Project } from '../types';

const initialProjects: Project[] = [];

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) return response.json();
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
