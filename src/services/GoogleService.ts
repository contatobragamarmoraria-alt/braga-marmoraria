export interface GoogleAuthStatus {
  isAuthenticated: boolean;
}

export const GoogleService = {
  async getAuthUrl(): Promise<string> {
    const response = await fetch('/api/auth/google/url');
    const data = await response.json();
    return data.url;
  },

  async getAuthStatus(): Promise<GoogleAuthStatus> {
    const response = await fetch('/api/auth/status');
    return response.json();
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  async getCalendarEvents(): Promise<any[]> {
    const response = await fetch('/api/google/calendar/events');
    if (!response.ok) return [];
    return response.json();
  },

  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    const response = await fetch('/api/google/gmail/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body }),
    });
    return response.json();
  },

  async getMessages(): Promise<any[]> {
    const response = await fetch('/api/google/gmail/messages');
    if (!response.ok) return [];
    return response.json();
  }
};
