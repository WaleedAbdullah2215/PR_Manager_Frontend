const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const api = 
{
  getAllPRs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/prs?${queryString}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching PRs:', error);
      throw error;
    }
  },

  getPRById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/prs/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching PR:', error);
      throw error;
    }
  },

  createPR: async (prData) => {
    try {
      const response = await fetch(`${API_URL}/prs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating PR:', error);
      throw error;
    }
  },

  updatePR: async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/prs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating PR:', error);
      throw error;
    }
  },

  updatePRStep: async (prId, stepId, updates) => {
    try {
      const response = await fetch(`${API_URL}/prs/${prId}/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating step:', error);
      throw error;
    }
  },

  deletePR: async (id) => {
    try {
      const response = await fetch(`${API_URL}/prs/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting PR:', error);
      throw error;
    }
  },

  getPRStats: async () => {
    try {
      const response = await fetch(`${API_URL}/prs/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  getAllActivities: async (limit = 50, page = 1) => {
    try {
      const response = await fetch(`${API_URL}/activities?limit=${limit}&page=${page}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  createActivity: async (activityData) => {
    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },
};