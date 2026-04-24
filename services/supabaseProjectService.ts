import { supabase } from '../src/lib/supabaseClient';

export interface SupabaseProject {
  id?: string;
  name: string;
  client_name: string;
  type: string;
  area: string;
  description: string;
  address: string;
  status?: string;
  created_at?: string;
  occurrences?: any[];
  timeline?: any[];
  documents?: any[];
  audit_logs?: any[];
}

export const supabaseProjectService = {
  getProjects: async (): Promise<SupabaseProject[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      throw error;
    }
    
    return data || [];
  },

  createProject: async (project: SupabaseProject): Promise<SupabaseProject> => {
    console.log('Tentando criar projeto no Supabase com payload:', project);
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
      
    if (error) {
      console.error('ERRO DETALHADO DO SUPABASE:', error);
      throw new Error(`Erro Supabase [${error.code}]: ${error.message}`);
    }
    
    return data;
  },

  getProjectById: async (id: string): Promise<SupabaseProject | null> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching project by id:', error);
      return null;
    }
    
    return data;
  },

  updateProject: async (id: string, updates: Partial<SupabaseProject>): Promise<SupabaseProject> => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
    
    return data;
  },
  
  deleteProject: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }
    
    return true;
  }
};
