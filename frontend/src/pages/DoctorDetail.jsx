import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctor } from '../services/api';
import { 
  Star, MapPin, Calendar, Video, 
  Award, Clock, ArrowLeft, Phone,
  Mail, Globe, Users, Shield
} from 'lucide-react';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await getDoctor(id);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigate(`/booking/${id}`);
  };

  const getConsultationBadgeColor = (mode) => {
    switch(mode) {
      case 'online': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'in_person': return 'bg-green-100 text-green-800 border border-green-200';
      case 'both': return 'bg-purple-100 text-purple-800 border border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'online': return <Video className="w-4 h-4" />;
      case 'in_person': return <MapPin className="w-4 h-4" />;
      case 'both': return <><Video className="w-4 h-4" /><MapPin className="w-4 h-4" /></>;
      default: return null;
    }
  };

  const getAverageRating = (doctor) => {
    // Mock ratings based on doctor ID for demo
    const baseRating = 4.5 + (doctor.id % 10) / 10;
    return Math.min(5, baseRating).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600">Loading doctor details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Doctor Not Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              The requested doctor profile could not be found.
            </p>
            <button
              onClick={() => navigate('/doctors')}
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Doctors List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/doctors')}
            className="inline-flex items-center gap-2 text-teal-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Specialists
          </button>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Doctor Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center shadow-lg">
                <div className="text-5xl">👨‍⚕️</div>
              </div>
            </div>

            {/* Doctor Header Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{doctor.name}</h1>
                  <p className="text-xl text-teal-200 font-medium mt-2">{doctor.specialization_name}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span>{doctor.years_experience} years experience</span>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${getConsultationBadgeColor(doctor.consultation_modes)}`}>
                      {getModeIcon(doctor.consultation_modes)}
                      {doctor.consultation_modes === 'both' ? 'Online & In-Person' : 
                       doctor.consultation_modes === 'online' ? 'Online Only' : 'In-Person Only'}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="mt-4 md:mt-0">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold">{getAverageRating(doctor)}</span>
                    </div>
                    <p className="text-sm text-teal-100 mt-1">
                      ({Math.floor(100 + doctor.id * 23)} reviews)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`py-3 px-1 font-medium text-lg border-b-2 transition-colors ${
                      activeTab === 'about'
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`py-3 px-1 font-medium text-lg border-b-2 transition-colors ${
                      activeTab === 'services'
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Services & Specialties
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-3 px 1 font-medium text-lg border-b-2 transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Professional Bio</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {doctor.bio}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-teal-50 p-6 rounded-xl">
                        <h4 className="font-bold text-gray-900 mb-3">Education</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            MD in Psychiatry - Harvard Medical School
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            Board Certified Psychiatrist
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            Fellowship in Cognitive Behavioral Therapy
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-emerald-50 p-6 rounded-xl">
                        <h4 className="font-bold text-gray-900 mb-3">Certifications</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            American Board of Psychiatry and Neurology
                          </li>
                          <li className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Licensed in 5 states
                          </li>
                          <li className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            HIPAA Certified
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Services Offered</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Individual Therapy Sessions',
                        'Cognitive Behavioral Therapy',
                        'Anxiety & Depression Treatment',
                        'Stress Management',
                        'Trauma Therapy',
                        'Relationship Counseling',
                        'Medication Management',
                        'Teletherapy Sessions'
                      ].map((service, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                            <div className="text-teal-600">✓</div>
                          </div>
                          <span className="font-medium text-gray-800">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Patient Reviews</h3>
                    <div className="space-y-6">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="p-6 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                              <div>
                                <h4 className="font-bold text-gray-900">Patient {review}</h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-gray-500 text-sm">2 weeks ago</span>
                          </div>
                          <p className="text-gray-700">
                            Dr. {doctor.name} has been incredibly helpful in my journey. Very professional and understanding.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3">
            {/* Availability Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-900">Appointment</h3>
              </div>
              
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  doctor.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${doctor.is_available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  {doctor.is_available ? 'Available for Appointments' : 'Currently Unavailable'}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Session Duration</p>
                    <p className="font-medium text-gray-900">50 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-gray-700">💲</div>
                  <div>
                    <p className="text-sm text-gray-600">Session Fee</p>
                    <p className="font-medium text-gray-900">${Math.floor(100 + doctor.id * 15)} per session</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {doctor.is_available ? (
                  <button
                    onClick={handleBookAppointment}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-4 rounded-xl font-bold text-lg cursor-not-allowed"
                  >
                    Not Accepting New Patients
                  </button>
                )}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{doctor.name.toLowerCase().replace(' ', '.')}@mindcare.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Languages</p>
                    <p className="font-medium text-gray-900">English, Spanish, French</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Response Time</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-900">Typically responds within 2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;