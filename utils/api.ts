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