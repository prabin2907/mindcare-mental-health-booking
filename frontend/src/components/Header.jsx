import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Stethoscope, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = localStorage.getItem('adminToken');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg group-hover:from-teal-700 group-hover:to-emerald-700 transition-all">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MindCare</h1>
                <p className="text-xs text-teal-600 font-medium">Mental Healthcare</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all hover:after:w-full"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Admin Button */}
              <button
                onClick={handleAdminClick}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 hover:from-teal-100 hover:to-emerald-100 transition-all border border-teal-100"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Admin Portal</span>
              </button>

              {/* User/Auth Button */}
              <div className="relative">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-teal-700" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => navigate('/admin/dashboard')}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 flex items-center space-x-3"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center space-x-3"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout Admin</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate('/admin/login')}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-teal-50 flex items-center space-x-3"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Login</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 px-4 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Mobile Admin Button */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleAdminClick();
                  }}
                  className="w-full flex items-center justify-between py-3 px-4 text-teal-700 hover:bg-teal-50 rounded-lg font-medium transition-colors"
                >
                  <span>Admin Portal</span>
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Close dropdowns when clicking outside */}
      {isAdminMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsAdminMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;