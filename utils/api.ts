// Helper to get the auth token
export const getAuthToken = () => localStorage.getItem('authToken');

export const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  // For multipart/form-data, let the browser set the Content-Type
  if (options.body instanceof FormData) {
    // @ts-ignore
    delete headers['Content-Type'];
  }
  return fetch(url, { ...options, headers });
};

// --- Project API Calls ---

const API_URL = ''; // Adjust if your API is hosted elsewhere

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/api/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};

export const createProject = async (projectData: { name: string, isFree: boolean }) => {
  const response = await fetchWithAuth(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
};

export const updateProject = async (id: string, projectData: any) => {
  const response = await fetchWithAuth(`${API_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
};

export const deleteProject = async (id: string) => {
  const response = await fetchWithAuth(`${API_URL}/api/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete project');
  // DELETE requests often return no content
  return response.ok;
};

export const toggleProjectTimer = async (id: string, note: string) => {
    const response = await fetchWithAuth(`${API_URL}/api/projects/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
    });
    if (!response.ok) throw new Error('Failed to toggle timer');
    return response.json();
};