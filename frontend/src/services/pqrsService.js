// services/pqrsService.js
// Todas las peticiones HTTP relacionadas con PQRS usando Axios
import api from './axiosConfig';

export const pqrsService = {
  obtenerTodas: ()           => api.get('/pqrs'),
  obtenerPorId: (id)         => api.get(`/pqrs/${id}`),
  crear:        (datos)      => api.post('/pqrs', datos),
  actualizar:   (id, datos)  => api.put(`/pqrs/${id}`, datos),
  eliminar:     (id)         => api.delete(`/pqrs/${id}`),
};

export const authService = {
  login:    (credenciales) => api.post('/auth/login', credenciales),
  registro: (datos)        => api.post('/auth/registro', datos),
};
