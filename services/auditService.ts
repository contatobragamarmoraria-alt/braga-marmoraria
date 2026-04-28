import { useAuth } from '../components/AuthContext';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  status: 'SUCCESS' | 'FAILED';
  duration?: number;
}

const AUDIT_LOGS_KEY = 'audit_logs';
const MAX_LOGS = 10000;

export const auditService = {
  logAction: async (data: {
    action: string;
    resource: string;
    details: string;
    status: 'SUCCESS' | 'FAILED';
    duration?: number;
  }) => {
    try {
      const logs = JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]') as AuditLog[];

      const newLog: AuditLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        userId: 'system',
        userName: 'Sistema',
        action: data.action,
        resource: data.resource,
        details: data.details,
        status: data.status,
        duration: data.duration
      };

      logs.push(newLog);

      if (logs.length > MAX_LOGS) {
        logs.shift();
      }

      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
      return newLog;
    } catch (error) {
      console.error('Erro ao registrar ação na auditoria:', error);
      return null;
    }
  },

  getLogs: async (): Promise<AuditLog[]> => {
    try {
      return JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]') as AuditLog[];
    } catch {
      return [];
    }
  }
};
