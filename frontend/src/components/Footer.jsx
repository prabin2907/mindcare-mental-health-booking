import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  const services = [
    'Psychiatry',
    'Psychology',
    'Therapy',
    'Counseling',
    'Online Consultations',
    'Emergency Support'
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Stethoscope className="w-8 h-8 text-teal-400" />
              <div>
                <h2 className="text-2xl font-bold">MindCare</h2>
                <p className="text-teal-300 text-sm">Mental Healthcare Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Professional mental healthcare services with certified specialists. 
              Your journey to wellness starts with us.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-700 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-teal-300">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-teal-300 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-teal-300">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 hover:text-teal-300 transition-colors">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                    {service}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-teal-300">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Emergency Helpline</p>
                  <p className="text-gray-300">(555) 123-HELP</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300">support@mindcare.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-300">123 Health Street, Medical District, City 10001</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="text-lg font-bold mb-4 text-teal-300">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-r-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 MindCare Healthcare System. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                HIPAA Compliant
              </span>
              <span className="text-gray-400 text-sm">Licensed Healthcare Provider</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;