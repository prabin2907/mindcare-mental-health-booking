import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctor, createAppointment, checkAvailability } from '../services/api';
import { Calendar, Clock, Check } from 'lucide-react';

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    consultation_type: 'video',
    appointment_date: '',
    appointment_time: '',
    patient_name: '',
    patient_email: '',
    patient_phone: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showDiscount, setShowDiscount] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const sessionTypes = [
    { id: 'in_person', label: 'In-person', icon: '🏥' },
    { id: 'video', label: 'Video call', icon: '📹' },
    { id: 'phone', label: 'Phone call', icon: '📞' }
  ];

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const slots = i === 0 ? 6 : 
                    i === 1 ? 6 : 
                    i === 2 ? 0 : 
                    i === 3 ? 4 : Math.floor(Math.random() * 8);
      
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        slots: slots,
        isToday: i === 0
      });
    }
    return dates;
  };

  const timeSlots = {
    morning: ['09:00', '10:00', '11:00'],
    afternoon: ['12:00', '14:00', '15:00'],
    evening: ['17:00', '18:00', '19:00', '20:00']
  };

  useEffect(() => {
    fetchDoctor();
    setAvailableDates(generateDates());
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await getDoctor(doctorId);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage(''); // Clear error when user types
  };

  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, appointment_date: date }));
    setAvailableSlots(timeSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (!formData.appointment_date || !formData.appointment_time) {
        setErrorMessage('Please select both date and time');
        return;
      }
      setCurrentStep(2);
      setErrorMessage('');
      return;
    }

    // Step 2 validation
    if (!formData.patient_name.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!formData.patient_email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }
    if (!formData.patient_phone.trim()) {
      setErrorMessage('Please enter your phone number');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Log what we're sending
      console.log('Sending appointment data:', {
        doctor: doctorId,
        consultation_type: formData.consultation_type,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time + ':00',
        patient_name: formData.patient_name,
        patient_email: formData.patient_email,
        patient_phone: formData.patient_phone
      });

      const appointmentData = {
        doctor: parseInt(doctorId), // Ensure it's a number
        consultation_type: formData.consultation_type,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time + ':00',
        patient_name: formData.patient_name,
        patient_email: formData.patient_email,
        patient_phone: formData.patient_phone
      };

      const response = await createAppointment(appointmentData);
      console.log('Booking successful:', response.data);
      
      alert('Appointment booked successfully!');
      navigate('/doctors');
      
    } catch (error) {
      console.error('Booking error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Try to extract specific error messages
      let errorMsg = 'Booking failed. Please try again.';
      
      if (error.response?.data) {
        // Django serializer errors usually have field-specific errors
        const errors = error.response.data;
        
        if (typeof errors === 'object') {
          // Get first error message
          for (const key in errors) {
            if (Array.isArray(errors[key]) && errors[key].length > 0) {
              errorMsg = `${key}: ${errors[key][0]}`;
              break;
            } else if (typeof errors[key] === 'string') {
              errorMsg = errors[key];
              break;
            }
          }
        } else if (typeof errors === 'string') {
          errorMsg = errors;
        }
      }
      
      setErrorMessage(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/doctors/${doctorId}`)}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Doctor
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">With {doctor?.name}</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              {showDiscount && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-orange-800">20% Off</span>
                      <p className="text-orange-600 text-sm">FIRSTSESSION20</p>
                    </div>
                    <button 
                      onClick={() => setShowDiscount(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Mode of Session */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mode of Session</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sessionTypes.map((type) => (
                    <label key={type.id} className="relative">
                      <input
                        type="radio"
                        name="consultation_type"
                        value={type.id}
                        checked={formData.consultation_type === type.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.consultation_type === type.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-medium text-gray-900">{type.label}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">Session Duration</h3>
                    <p className="text-gray-600">50 mins, 1 session</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹1600</div>
                    <div className="text-sm text-gray-500">/ session</div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Select session details</h2>
                  <span className="text-sm text-gray-500">{currentStep}/2</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`flex items-center ${currentStep >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                      currentStep >= 1 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300'
                    }`}>
                      {currentStep > 1 ? '✓' : '1'}
                    </div>
                    <span className="font-medium">Select Date & Time</span>
                  </div>
                  
                  <div className="flex-1 h-0.5 mx-4 bg-gray-200"></div>
                  
                  <div className={`flex items-center ${currentStep >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${
                      currentStep >= 2 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300'
                    }`}>
                      2
                    </div>
                    <span className="font-medium">Enter Details</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Date and Time</h3>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-6">
                    {availableDates.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateSelect(day.date)}
                        disabled={day.slots === 0}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.appointment_date === day.date
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : day.slots === 0
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-xs font-medium">{day.day}</div>
                        <div className={`text-lg font-bold ${day.isToday ? 'text-teal-600' : ''}`}>
                          {day.dateNum}
                        </div>
                        <div className="text-xs text-gray-500">{day.month}</div>
                        <div className={`text-xs mt-1 ${
                          day.slots === 0 ? 'text-red-500' : 'text-green-600'
                        }`}>
                          {day.slots === 0 ? 'no slots' : `${day.slots} slots`}
                        </div>
                      </button>
                    ))}
                  </div>

                  {formData.appointment_date && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Afternoon</h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {timeSlots.afternoon.map((time) => (
                            <label key={time} className="relative">
                              <input
                                type="radio"
                                name="appointment_time"
                                value={time}
                                checked={formData.appointment_time === time}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div className={`p-3 border rounded-lg text-center cursor-pointer ${
                                formData.appointment_time === time
                                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}>
                                {time}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Evening</h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {timeSlots.evening.map((time) => (
                            <label key={time} className="relative">
                              <input
                                type="radio"
                                name="appointment_time"
                                value={time}
                                checked={formData.appointment_time === time}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div className={`p-3 border rounded-lg text-center cursor-pointer ${
                                formData.appointment_time === time
                                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}>
                                {time}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-gray-900 mb-4">Enter your details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="patient_email"
                        value={formData.patient_email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="patient_phone"
                        value={formData.patient_phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || (currentStep === 1 && (!formData.appointment_date || !formData.appointment_time))}
                  className="w-full bg-teal-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 
                   currentStep === 1 ? 'CONTINUE' : 'COMPLETE BOOKING'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{doctor?.name}</h3>
                  <p className="text-teal-600 text-sm">{doctor?.specialization_name}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="font-medium capitalize">
                    {formData.consultation_type === 'in_person' ? 'In-person' :
                     formData.consultation_type === 'video' ? 'Video call' : 'Phone call'}
                  </span>
                </div>
                
                {formData.appointment_date && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(formData.appointment_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formData.appointment_time}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">50 mins</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹1600</div>
                    {showDiscount && (
                      <div className="text-sm text-gray-500 line-through">₹2000</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Need help? Call us at <span className="text-teal-600">+91 98765 43210</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;