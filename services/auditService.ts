
export type AuditAction =
  | 'LOGIN' | 'LOGOUT' | 'UPDATE_PROFILE' | 'UPDATE_AVATAR'
  | 'CREATE_PROJECT' | 'UPDATE_PROJECT' | 'DELETE_PROJECT' | 'RESTORE_PROJECT'
  | 'CREATE_CLIENT' | 'UPDATE_CLIENT' | 'DELETE_CLIENT'
  | 'CREATE_TASK' | 'COMPLETE_TASK' | 'UPDATE_TASK'
  | 'ASSIGN_TASK' | 'CREATE_OCCURRENCE' | 'UPDATE_OCCURRENCE'
  | 'CREATE_USER' | 'UPDATE_USER' | 'DELETE_USER' | 'REVOKE_ACCESS' | 'GRANT_ACCESS'
  | 'VIEW_FINANCIAL' | 'EXPORT_DATA' | 'IMPORT_DATA'
  | 'CREATE_TEAM_MEMBER' | 'UPDATE_TEAM_MEMBER' | 'DELETE_TEAM_MEMBER';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  resource: string; // o que foi afetado (projeto ID, usuário ID, etc)
  resourceName: string;
  description: string;
  details?: Record<string, any>;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILED';
  duration?: number; // em ms
}

export interface AuditStats {
  totalLogins: number;
  projectsCreated: number;
  projectsDeleted: number;
  usersCreated: number;
  tasksCompleted: number;
  occurrencesLogged: number;
  activeUsers: string[];
  mostActiveFunctions: { name: string; count: number }[];
  lastActivity: AuditLog | null;
  errorCount: number;
}

const STORAGE_KEY = 'bm-audit-logs';
const MAX_LOGS = 10000;

export const auditService = {
  // Record an action
  logAction: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const logs = auditService.getLogs();
    const newLog: AuditLog = {
      ...log,
      id: 'audit-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };

    logs.unshift(newLog);
    if (logs.length > MAX_LOGS) logs.pop();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return newLog;
  },

  // Get all logs
  getLogs: (): AuditLog[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  // Get logs for a specific user
  getUserLogs: (userId: string): AuditLog[] => {
    return auditService.getLogs().filter(log => log.userId === userId);
  },

  // Get logs for a specific action
  getActionLogs: (action: AuditAction): AuditLog[] => {
    return auditService.getLogs().filter(log => log.action === action);
  },

  // Get logs within a date range
  getLogsByDateRange: (startDate: string, endDate: string): AuditLog[] => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return auditService.getLogs().filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  },

  // Get statistics
  getStats: (): AuditStats => {
    const logs = auditService.getLogs();
    const activeUsers = Array.from(new Set(logs.map(l => l.userId)));
    const actionCounts: Record<AuditAction, number> = {} as any;

    logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    const mostActiveFunctions = Object.entries(actionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalLogins: logs.filter(l => l.action === 'LOGIN').length,
      projectsCreated: logs.filter(l => l.action === 'CREATE_PROJECT').length,
      projectsDeleted: logs.filter(l => l.action === 'DELETE_PROJECT').length,
      usersCreated: logs.filter(l => l.action === 'CREATE_USER').length,
      tasksCompleted: logs.filter(l => l.action === 'COMPLETE_TASK').length,
      occurrencesLogged: logs.filter(l => l.action === 'CREATE_OCCURRENCE').length,
      activeUsers,
      mostActiveFunctions,
      lastActivity: logs[0] || null,
      errorCount: logs.filter(l => l.status === 'FAILED').length,
    };
  },

  // Clear logs (only SUPPORT can do this)
  clearLogs: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Export logs as JSON
  exportLogs: (): string => {
    const logs = auditService.getLogs();
    return JSON.stringify(logs, null, 2);
  },

  // Subscribe to log changes
  subscribeToLogs: (callback: (logs: AuditLog[]) => void) => {
    const fetchLogs = () => {
      callback(auditService.getLogs());
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }
};
