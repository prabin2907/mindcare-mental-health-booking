import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors, getSpecializations } from '../services/api';
import { 
  Star, Filter, Search, MapPin, Calendar, 
  Video, Users, Award, ChevronRight, Clock
} from 'lucide-react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Mock consultation modes for filtering
  const consultationModes = [
    { id: 'all', label: 'All Modes' },
    { id: 'online', label: 'Online Only' },
    { id: 'in_person', label: 'In-Person Only' },
    { id: 'both', label: 'Both' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedSpec, selectedMode, searchTerm, doctors]);

  const fetchData = async () => {
    try {
      const [doctorsRes, specsRes] = await Promise.all([
        getDoctors(),
        getSpecializations()
      ]);
      setDoctors(doctorsRes.data);
      setFilteredDoctors(doctorsRes.data);
      setSpecializations(specsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...doctors];

    // Filter by specialization
    if (selectedSpec !== 'all') {
      result = result.filter(doc => doc.specialization == selectedSpec);
    }

    // Filter by consultation mode
    if (selectedMode !== 'all') {
      if (selectedMode === 'online') {
        result = result.filter(doc => doc.consultation_modes === 'online');
      } else if (selectedMode === 'in_person') {
        result = result.filter(doc => doc.consultation_modes === 'in_person');
      } else if (selectedMode === 'both') {
        result = result.filter(doc => doc.consultation_modes === 'both');
      }
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(term) ||
        doc.specialization_name.toLowerCase().includes(term) ||
        doc.bio.toLowerCase().includes(term)
      );
    }

    setFilteredDoctors(result);
  };

  const getConsultationBadgeColor = (mode) => {
    switch(mode) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'in_person': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600">Loading specialists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Mental Health Specialist
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Connect with certified professionals who can guide you on your wellness journey. 
              Browse our network of experienced psychiatrists, psychologists, and therapists.
            </p>
            <div className="flex flex-wrap items-center gap-8 text-lg">
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-3 text-teal-300" />
                <span className="font-medium">{doctors.length} Verified Specialists</span>
              </div>
              <div className="flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-400" />
                <span className="font-medium">98% Patient Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, specialization, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:shadow-sm"
              />
            </div>

            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 text-teal-700 rounded-xl font-medium hover:bg-teal-100 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white hover:shadow-sm transition-all duration-300"
                >
                  <option value="all">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 w-4 h-4" />
              </div>

              <div className="relative">
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white hover:shadow-sm transition-all duration-300"
                >
                  {consultationModes.map(mode => (
                    <option key={mode.id} value={mode.id}>{mode.label}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="lg:hidden mt-6 p-6 bg-white border border-gray-200 rounded-xl shadow-lg animate-slide-down">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    value={selectedSpec}
                    onChange={(e) => setSelectedSpec(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Mode
                  </label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    {consultationModes.map(mode => (
                      <option key={mode.id} value={mode.id}>{mode.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Specialists
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'specialist' : 'specialists'} found
              {selectedSpec !== 'all' && ` in ${specializations.find(s => s.id == selectedSpec)?.name}`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Available Now</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">Not Available</span>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Specialists Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Try adjusting your filters or search terms to find available specialists.
            </p>
            <button
              onClick={() => {
                setSelectedSpec('all');
                setSelectedMode('all');
                setSearchTerm('');
              }}
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors hover:shadow-md"
            >
              <Filter className="w-4 h-4" />
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <div 
                key={doctor.id} 
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden hover:-translate-y-1">
                  {/* Doctor Status Badge */}
                  {doctor.is_available && (
                    <div className="absolute top-4 left-0 bg-green-500 text-white px-3 py-1 rounded-r-full shadow-md z-10">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        AVAILABLE NOW
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Doctor Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <div className="text-2xl">👨‍⚕️</div>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                            <p className="text-teal-700 font-medium mt-1">{doctor.specialization_name}</p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700 text-sm">{doctor.years_experience} years experience</span>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getConsultationBadgeColor(doctor.consultation_modes)} transition-all duration-300 hover:scale-105`}>
                                {getModeIcon(doctor.consultation_modes)}
                                {doctor.consultation_modes === 'both' ? 'Online & In-Person' : 
                                 doctor.consultation_modes === 'online' ? 'Online Only' : 'In-Person Only'}
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mt-4">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                4.8 ({Math.floor(100 + doctor.id * 23)} reviews)
                              </span>
                            </div>

                            {/* Bio Excerpt */}
                            <p className="text-gray-600 mt-4 line-clamp-2 text-sm">
                              {doctor.bio.substring(0, 120)}...
                            </p>
                          </div>

                          {/* Quick Actions */}
                          <div className="mt-6 md:mt-0 flex flex-col gap-3 min-w-[150px]">
                            <Link
                              to={`/doctors/${doctor.id}`}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 text-teal-700 rounded-lg font-medium hover:bg-teal-100 transition-all duration-300 border border-teal-200 hover:shadow-sm group-hover:translate-x-1"
                            >
                              View Profile
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                            
                            {doctor.is_available && (
                              <Link
                                to={`/booking/${doctor.id}`}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                              >
                                <Calendar className="w-4 h-4" />
                                Book Appointment
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700 text-sm">Next available: Today</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 text-gray-700">
                                💲
                              </div>
                              <span className="text-gray-700 text-sm">From: ${Math.floor(100 + doctor.id * 15)}/session</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Need Help Section */}
        <div className="mt-12 bg-teal-50 rounded-2xl p-8 border border-teal-100 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Need Help Choosing?</h3>
              <p className="text-gray-600 max-w-2xl">
                Our care coordinators can help you find the right specialist based on your needs.
              </p>
            </div>
            <button className="mt-6 md:mt-0 inline-flex items-center gap-3 bg-white text-teal-700 border-2 border-teal-200 px-6 py-3 rounded-xl font-medium hover:bg-teal-50 transition-all duration-300 hover:shadow-md">
              <Users className="w-5 h-5" />
              Speak with Care Coordinator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;