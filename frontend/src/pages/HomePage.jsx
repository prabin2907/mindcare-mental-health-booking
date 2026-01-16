import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Shield, Clock, ArrowRight, CheckCircle, Star, Heart } from 'lucide-react';

const HomePage = () => {
  // Using Pexels images - reliable and fast
  const images = {
    heroDoctor: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    therapy: "https://images.pexels.com/photos/5722163/pexels-photo-5722163.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    nature: "https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
    consultation: "https://images.pexels.com/photos/5722160/pexels-photo-5722160.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
  };

  // Fallback solid colors if images fail to load
  const fallbackColors = {
    heroDoctor: "bg-gradient-to-r from-teal-600 to-emerald-700",
    therapy: "bg-gradient-to-r from-blue-500 to-purple-600",
    nature: "bg-gradient-to-r from-green-500 to-teal-600",
    consultation: "bg-gradient-to-r from-indigo-500 to-blue-600"
  };

  const features = [
  {
    icon: <Users className="w-10 h-10" />,
    title: 'Expert Specialists',
    description: 'Board-certified psychiatrists, psychologists, and therapists.',
    image: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    fallback: "bg-gradient-to-r from-blue-500 to-blue-600",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Calendar className="w-10 h-10" />,
    title: 'Flexible Scheduling',
    description: 'Book appointments that fit your schedule, including weekends.',
    image: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    fallback: "bg-gradient-to-r from-purple-500 to-purple-600",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: 'Confidential & Secure',
    description: 'HIPAA-compliant platform ensuring complete privacy.',
    image: "https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop", // Security image
    fallback: "bg-gradient-to-r from-green-500 to-green-600",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <Clock className="w-10 h-10" />,
    title: 'Quick Access',
    description: 'Get appointments within 48 hours for urgent needs.',
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop", // Fast/clock image
    fallback: "bg-gradient-to-r from-orange-500 to-orange-600",
    color: "from-orange-500 to-orange-600"
  }
];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Patient',
      content: 'MindCare changed my life. The therapists are incredibly understanding and professional.',
      rating: 5
    },
    {
      name: 'James L.',
      role: 'Patient',
      content: 'Easy to use platform and excellent doctors. Highly recommended for anyone seeking help.',
      rating: 5
    }
  ];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-50 to-emerald-50 overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <span className="inline-block bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                🏆 Trusted by 10,000+ Patients
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Professional Mental Healthcare, <br />
                <span className="text-teal-700">When You Need It Most</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl">
                Connect with licensed mental health professionals through secure video consultations 
                or in-person visits. Your journey to wellness starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/doctors"
                  className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Find a Specialist <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="border-2 border-teal-700 text-teal-700 hover:bg-teal-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                  Speak to Advisor
                </button>
              </div>
            </div>

            {/* Hero Image with Fallback */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                <div className={`${fallbackColors.heroDoctor} w-full h-96 flex items-center justify-center`}>
                  <img 
                    src={images.heroDoctor}
                    alt="Professional doctor consultation"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.className = `${fallbackColors.heroDoctor} w-full h-96 flex items-center justify-center`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-teal-700" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">98%</div>
                      <div className="text-sm text-gray-600">Patient Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 py-8">
            {[
              { value: '50+', label: 'Specialists' },
              { value: '10k+', label: 'Patients Helped' },
              { value: '98%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid - FIXED VERSION */}
<div className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Care Services</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        We offer a wide range of mental health services tailored to your needs.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="group">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-teal-300 hover:shadow-xl transition-all duration-300 h-full">
            <div className="h-48 relative overflow-hidden">
              {/* Image container */}
              <div className="w-full h-full relative">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // If image fails, show gradient fallback
                    e.target.style.display = 'none';
                    // Show fallback gradient
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = `absolute inset-0 bg-gradient-to-br ${feature.color}`;
                    e.target.parentElement.appendChild(fallbackDiv);
                  }}
                />
                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Icon badge */}
              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <div className="text-gray-800">
                    {feature.icon}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Patient Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our patients about their journey to better mental health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden bg-gradient-to-r from-teal-900 to-emerald-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Start Your Wellness Journey Today</h2>
            <p className="text-xl mb-10 opacity-90">
              Take the first step towards better mental health. Our team of specialists is ready to support you.
            </p>
            <Link 
              to="/doctors"
              className="inline-block bg-white text-teal-700 hover:bg-gray-100 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Find Your Specialist Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;