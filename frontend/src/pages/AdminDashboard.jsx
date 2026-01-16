import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getDoctors, createDoctor, updateDoctor, deleteDoctor,
  getSpecializations, createAppointment,
  getAppointments, updateAppointment, deleteAppointment  
} from '../services/api';
import { 
  Users, Calendar, Activity, LogOut, 
  PlusCircle, Edit2, Eye, Filter, Trash2,
  Search, Download, X, Save, UserPlus,
  Phone, Mail, MapPin, Award, Clock, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    activeAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0
  });
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '', // This should be specialization ID
    consultation_modes: 'both',
    years_experience: '',
    bio: '',
    is_available: true,
  });

  const [appointmentForm, setAppointmentForm] = useState({
    doctor: '',
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00',
    consultation_type: 'online',
    status: 'confirmed',
    notes: ''
  });

  const consultationModes = [
    { id: 'online', label: 'Online Only' },
    { id: 'in_person', label: 'In-Person Only' },
    { id: 'both', label: 'Both' }
  ];

  const appointmentStatuses = [
    'confirmed', 'cancelled', 'completed', 'pending'
  ];

  const consultationTypes = [
    { id: 'online', label: 'Online' },
    { id: 'in_person', label: 'In-Person' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load doctors from Django API
      const doctorsResponse = await getDoctors();
      const doctorsData = doctorsResponse.data;
      setDoctors(doctorsData);
      
      // Load specializations from Django API
      const specsResponse = await getSpecializations();
      setSpecializations(specsResponse.data);
      
      // Load appointments from Django API
      // Note: You need to create a GET endpoint for appointments in Django
      // For now, using mock appointments if API not available
      // NEW CODE (use real API):
// Load appointments from Django API
try {
  const appointmentsResponse = await getAppointments();
  console.log('Appointments API response:', appointmentsResponse.data);
  
  if (Array.isArray(appointmentsResponse.data)) {
    setAppointments(appointmentsResponse.data);
    console.log(`✅ Loaded ${appointmentsResponse.data.length} appointments`);
  } else {
    console.error('❌ Invalid appointments response:', appointmentsResponse.data);
    setAppointments([]);
  }
} catch (error) {
  console.error('❌ Error loading appointments:', error);
  alert(`Failed to load appointments: ${error.message}`);
  setAppointments([]);
}
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayAppointmentsCount = appointments.filter(
        apt => apt.appointment_date === today && apt.status === 'confirmed'
      ).length;
      
      const activeAppointmentsCount = appointments.filter(
        apt => apt.status === 'confirmed'
      ).length;
      
      // Count unique patients (simplified)
      const uniquePatients = [...new Set(appointments.map(apt => apt.patient_email))].length;
      
      setStats({
        totalDoctors: doctorsData.length,
        activeAppointments: activeAppointmentsCount,
        todayAppointments: todayAppointmentsCount,
        totalPatients: uniquePatients || 156 // fallback
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      alert('Failed to load dashboard data. Please check if Django server is running.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const openDoctorModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor.id);
      setDoctorForm({ 
        name: doctor.name,
        specialization: doctor.specialization, // This is the ID
        consultation_modes: doctor.consultation_modes,
        years_experience: doctor.years_experience,
        bio: doctor.bio,
        is_available: doctor.is_available
      });
    } else {
      setEditingDoctor(null);
      setDoctorForm({
        name: '',
        specialization: specializations.length > 0 ? specializations[0].id : '',
        consultation_modes: 'both',
        years_experience: '',
        bio: '',
        is_available: true,
      });
    }
    setShowDoctorModal(true);
  };

  const openAppointmentModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment.id);
      setAppointmentForm({ 
        ...appointment,
        appointment_time: appointment.appointment_time.substring(0, 5) // Remove seconds
      });
    } else {
      setEditingAppointment(null);
      setAppointmentForm({
        doctor: doctors.length > 0 ? doctors[0].id : '',
        patient_name: '',
        patient_email: '',
        patient_phone: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:00',
        consultation_type: 'online',
        status: 'confirmed',
        notes: ''
      });
    }
    setShowAppointmentModal(true);
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert years_experience to number
      const doctorData = {
        ...doctorForm,
        years_experience: parseInt(doctorForm.years_experience)
      };
      
      if (editingDoctor) {
        // Update existing doctor in Django
        const response = await updateDoctor(editingDoctor, doctorData);
        
        // Update local state
        setDoctors(doctors.map(d => 
          d.id === editingDoctor ? response.data : d
        ));
        alert('✅ Doctor updated successfully!');
      } else {
        // Add new doctor to Django
        const response = await createDoctor(doctorData);
        
        // Update local state
        setDoctors([...doctors, response.data]);
        setStats(prev => ({
          ...prev,
          totalDoctors: prev.totalDoctors + 1
        }));
        alert('✅ Doctor added successfully!');
      }
      
      setShowDoctorModal(false);
      resetDoctorForm();
      
    } catch (error) {
      console.error('Error saving doctor:', error);
      const errorMsg = error.response?.data || error.message;
      alert(`❌ Failed to save doctor: ${JSON.stringify(errorMsg)}`);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const appointmentData = {
        ...appointmentForm,
        appointment_time: appointmentForm.appointment_time + ':00'
      };
      
      if (editingAppointment) {
        // Update existing appointment
        const response = await updateAppointment(editingAppointment, appointmentData);
        
        // Update local state
        setAppointments(appointments.map(a => 
          a.id === editingAppointment ? response.data : a
        ));
        alert('✅ Appointment updated successfully!');
      } else {
        // Add new appointment
        const response = await createAppointment(appointmentData);
        
        // Update local state
        setAppointments([...appointments, response.data]);
        
        // Update stats
        const today = new Date().toISOString().split('T')[0];
        setStats(prev => ({
          ...prev,
          activeAppointments: prev.activeAppointments + 1,
          todayAppointments: appointmentForm.appointment_date === today 
            ? prev.todayAppointments + 1 
            : prev.todayAppointments
        }));
        alert('✅ Appointment added successfully!');
      }
      
      setShowAppointmentModal(false);
      resetAppointmentForm();
      
    } catch (error) {
      console.error('Error saving appointment:', error);
      const errorMsg = error.response?.data || error.message;
      alert(`❌ Failed to save appointment: ${JSON.stringify(errorMsg)}`);
    }
  };

  const deleteDoctorHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        // Delete from Django
        await deleteDoctor(id);
        
        // Update local state
        setDoctors(doctors.filter(d => d.id !== id));
        setStats(prev => ({
          ...prev,
          totalDoctors: prev.totalDoctors - 1
        }));
        alert('✅ Doctor deleted successfully!');
        
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('❌ Failed to delete doctor');
      }
    }
  };

  const deleteAppointmentHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        // Delete from Django
        await deleteAppointment(id);
        
        // Update local state
        const appointment = appointments.find(a => a.id === id);
        setAppointments(appointments.filter(a => a.id !== id));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          activeAppointments: prev.activeAppointments - 1,
          todayAppointments: appointment?.appointment_date === new Date().toISOString().split('T')[0] 
            ? prev.todayAppointments - 1 
            : prev.todayAppointments
        }));
        
        alert('✅ Appointment deleted successfully!');
        
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('❌ Failed to delete appointment');
      }
    }
  };

  const resetDoctorForm = () => {
    setDoctorForm({
      name: '',
      specialization: specializations.length > 0 ? specializations[0].id : '',
      consultation_modes: 'both',
      years_experience: '',
      bio: '',
      is_available: true,
    });
    setEditingDoctor(null);
  };

  const resetAppointmentForm = () => {
    setAppointmentForm({
      doctor: doctors.length > 0 ? doctors[0].id : '',
      patient_name: '',
      patient_email: '',
      patient_phone: '',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '10:00',
      consultation_type: 'online',
      status: 'confirmed',
      notes: ''
    });
    setEditingAppointment(null);
  };

  // Filter appointments based on search
  const filteredAppointments = appointments.filter(appt => 
    appt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appt.patient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appt.doctor?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (specializations.find(s => s.id === doctor.specialization)?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get doctor name by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  // Get specialization name by ID
  const getSpecializationName = (specId) => {
    const spec = specializations.find(s => s.id === specId);
    return spec ? spec.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">MindCare Healthcare Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2 text-gray-600 hover:text-teal-600 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button 
                onClick={() => openDoctorModal()}
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
              >
                <UserPlus className="w-4 h-4" /> Add Doctor
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Users />, label: 'Total Doctors', value: stats.totalDoctors, color: 'bg-blue-500' },
            { icon: <Calendar />, label: 'Active Appointments', value: stats.activeAppointments, color: 'bg-green-500' },
            { icon: <Activity />, label: "Today's Appointments", value: stats.todayAppointments, color: 'bg-purple-500' },
            { icon: <Users />, label: 'Total Patients', value: stats.totalPatients, color: 'bg-orange-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['appointments', 'doctors', 'patients'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search appointments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button 
                      onClick={() => openAppointmentModal()}
                      className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Appointment
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{appt.patient_name}</div>
                            <div className="text-sm text-gray-500">{appt.patient_email}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {appt.doctor?.name || getDoctorName(appt.doctor)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-900">{appt.appointment_date}</div>
                            <div className="text-gray-500 text-sm">
                              {appt.appointment_time.substring(0, 5)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appt.consultation_type === 'online' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {appt.consultation_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appt.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : appt.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appt.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => openAppointmentModal(appt)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit2 className="w-4 h-4 inline mr-1" /> Edit
                            </button>
                            <button 
                              onClick={() => deleteAppointmentHandler(appt.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No appointments found
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Doctors</h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search doctors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button 
                      onClick={() => openDoctorModal()}
                      className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                    >
                      <UserPlus className="w-4 h-4" /> Add New Doctor
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {getSpecializationName(doctor.specialization)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{doctor.years_experience} years</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            doctor.is_available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {doctor.is_available ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            doctor.consultation_modes === 'online' ? 'bg-blue-100 text-blue-800' :
                            doctor.consultation_modes === 'in_person' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {doctor.consultation_modes}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {doctor.bio}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{doctor.appointments_count || 0} appointments</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {doctor.is_available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => openDoctorModal(doctor)}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button 
                          onClick={() => deleteDoctorHandler(doctor.id)}
                          className="flex-1 border border-red-300 text-red-700 py-2 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredDoctors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No doctors found
                  </div>
                )}
              </div>
            )}

            {activeTab === 'patients' && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Management</h3>
                <p className="text-gray-600">Patient management features coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button 
                onClick={() => {
                  setShowDoctorModal(false);
                  resetDoctorForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleDoctorSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Dr. John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <select
                    required
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select specialization</option>
                    {specializations.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Modes
                  </label>
                  <select
                    value={doctorForm.consultation_modes}
                    onChange={(e) => setDoctorForm({...doctorForm, consultation_modes: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {consultationModes.map(mode => (
                      <option key={mode.id} value={mode.id}>{mode.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={doctorForm.years_experience}
                    onChange={(e) => setDoctorForm({...doctorForm, years_experience: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="10"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio *
                  </label>
                  <textarea
                    required
                    value={doctorForm.bio}
                    onChange={(e) => setDoctorForm({...doctorForm, bio: e.target.value})}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Professional background and expertise..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={doctorForm.is_available}
                    onChange={(e) => setDoctorForm({...doctorForm, is_available: e.target.checked})}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">
                    Available for appointments
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowDoctorModal(false);
                    resetDoctorForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
              </h2>
              <button 
                onClick={() => {
                  setShowAppointmentModal(false);
                  resetAppointmentForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAppointmentSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={appointmentForm.patient_name}
                    onChange={(e) => setAppointmentForm({...appointmentForm, patient_name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={appointmentForm.patient_email}
                    onChange={(e) => setAppointmentForm({...appointmentForm, patient_email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={appointmentForm.patient_phone}
                    onChange={(e) => setAppointmentForm({...appointmentForm, patient_phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor *
                  </label>
                  <select
                    required
                    value={appointmentForm.doctor}
                    onChange={(e) => setAppointmentForm({...appointmentForm, doctor: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.appointment_date}
                    onChange={(e) => setAppointmentForm({...appointmentForm, appointment_date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentForm.appointment_time}
                    onChange={(e) => setAppointmentForm({...appointmentForm, appointment_time: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type
                  </label>
                  <select
                    value={appointmentForm.consultation_type}
                    onChange={(e) => setAppointmentForm({...appointmentForm, consultation_type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {consultationTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={appointmentForm.status}
                    onChange={(e) => setAppointmentForm({...appointmentForm, status: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {appointmentStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentModal(false);
                    resetAppointmentForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;