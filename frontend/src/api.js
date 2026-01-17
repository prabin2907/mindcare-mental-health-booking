import axios from 'axios';

// Use Render backend URL
const API_BASE_URL = 'https://mindcare-hospital-booking.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug log
console.log('🚀 Backend URL:', API_BASE_URL);

// Doctor APIs
export const getDoctors = () => api.get('/doctors/');
export const getDoctor = (id) => api.get(/doctors//);
export const createDoctor = (doctorData) => api.post('/doctors/', doctorData);
export const updateDoctor = (id, doctorData) => api.put(/doctors//, doctorData);
export const patchDoctor = (id, doctorData) => api.patch(/doctors//, doctorData);
export const deleteDoctor = (id) => api.delete(/doctors//);

export const getDoctorAvailability = (id, date) => 
  api.get(/doctors//availability/, { params: { date } });

// Specialization APIs
export const getSpecializations = () => api.get('/specializations/');

// Appointment APIs - NOW COMPLETE!
export const getAppointments = (params = {}) => api.get('/appointments/', { params });
export const getAppointment = (id) => api.get(/appointments//);
export const createAppointment = (appointmentData) => api.post('/appointments/', appointmentData);
export const updateAppointment = (id, appointmentData) => api.put(/appointments//, appointmentData);
export const patchAppointment = (id, appointmentData) => api.patch(/appointments//, appointmentData);
export const deleteAppointment = (id) => api.delete(/appointments//);

// Check availability for double booking prevention
export const checkAvailability = (doctorId, date, time) => 
  api.post('/check-availability/', {
    doctor: doctorId,
    date: date,
    time: time
  });

export default api;
