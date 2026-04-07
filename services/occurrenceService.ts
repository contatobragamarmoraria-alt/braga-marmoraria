import { Occurrence } from '../types';

export const occurrenceService = {
  getOccurrences: async (): Promise<Occurrence[]> => {
    try {
      const response = await fetch('/api/occurrences');
      if (response.ok) {
        return response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching occurrences:', error);
      return [];
    }
  },

  addOccurrence: async (occurrence: Occurrence): Promise<Occurrence | null> => {
    try {
      const response = await fetch('/api/occurrences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(occurrence)
      });
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      console.error('Error adding occurrence:', error);
      return null;
    }
  },

  updateOccurrence: async (id: string, updates: Partial<Occurrence>): Promise<Occurrence | null> => {
    try {
      const response = await fetch(`/api/occurrences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      console.error('Error updating occurrence:', error);
      return null;
    }
  },

  deleteOccurrence: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/occurrences/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting occurrence:', error);
      return false;
    }
  },

  subscribeToOccurrences: (callback: (occurrences: Occurrence[]) => void) => {
    const fetchOccurrences = async () => {
      try {
        const response = await fetch('/api/occurrences');
        if (response.ok) {
          const occurrences = await response.json();
          callback(occurrences);
        }
      } catch (error) {
        console.error('Error in occurrence subscription:', error);
      }
    };

    fetchOccurrences();
    const interval = setInterval(fetchOccurrences, 5000);
    return () => clearInterval(interval);
  }
};
