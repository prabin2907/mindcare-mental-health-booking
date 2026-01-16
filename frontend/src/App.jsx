import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DoctorList from './pages/DoctorList';
import DoctorDetail from './pages/DoctorDetail';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
              <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<Navigate to="/admin/login" />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/booking/:doctorId" element={<BookingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;