import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

export const getProjects = () => API.get('/projects');
export const createProject = (data) => API.post('/projects', data);
export const addMember = (id, data) => API.put(`/projects/${id}/members`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

export const getTasksByProject = (projectId) => API.get(`/tasks/project/${projectId}`);
export const getMyTasks = () => API.get('/tasks/mytasks');
export const createTask = (data) => API.post('/tasks', data);
export const updateTaskStatus = (id, data) => API.put(`/tasks/${id}/status`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);