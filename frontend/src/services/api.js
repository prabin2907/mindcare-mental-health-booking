import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Doctor APIs
export const getDoctors = () => api.get('/doctors/');
export const getDoctor = (id) => api.get(`/doctors/${id}/`);
export const createDoctor = (doctorData) => api.post('/doctors/', doctorData);
export const updateDoctor = (id, doctorData) => api.put(`/doctors/${id}/`, doctorData);
export const patchDoctor = (id, doctorData) => api.patch(`/doctors/${id}/`, doctorData);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}/`);

export const getDoctorAvailability = (id, date) => 
  api.get(`/doctors/${id}/availability/`, { params: { date } });

// Specialization APIs
export const getSpecializations = () => api.get('/specializations/');

// Appointment APIs - NOW COMPLETE!
export const getAppointments = (params = {}) => api.get('/appointments/', { params });
export const getAppointment = (id) => api.get(`/appointments/${id}/`);
export const createAppointment = (appointmentData) => api.post('/appointments/', appointmentData);
export const updateAppointment = (id, appointmentData) => api.put(`/appointments/${id}/`, appointmentData);
export const patchAppointment = (id, appointmentData) => api.patch(`/appointments/${id}/`, appointmentData);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}/`);

// Check availability for double booking prevention
export const checkAvailability = (doctorId, date, time) => 
  api.post('/check-availability/', {
    doctor: doctorId,
    date: date,
    time: time
  });

export default api;
