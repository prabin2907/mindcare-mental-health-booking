# MindCare - Mental Health Booking Platform

MindCare is a full-stack mental health appointment booking system connecting patients with mental health professionals.

## 🚀 Features

### Frontend (React)
- User-friendly interface for booking appointments
- Therapist search and filtering
- Patient dashboard for managing appointments
- Secure user authentication
- Admin logged can update the necessary details from dashboard
- Responsive design for mobile and desktop

### Backend (Django)
- RESTful API for appointment management
- Therapist profile management
- Appointment scheduling system
- PostgreSQL database hosted on Neon

### Database (Postgres)
- User profiles (patients & therapists)
- Appointment records
- Availability schedules

### AIs Used
DeepSeek: https://chat.deepseek.com/share/7p27zqxxckpnys2226
          https://chat.deepseek.com/share/q4ew4zuuaeavyspgoh

### Instructions to run 
- Frontend
    - In the terminal, go to the frontend directory
    - npm run dev
- Backend
    -  In the terminal, go to the backend directory
    -  venv\Scripts\activate (activate virtual environment)
    -  python manage.py runserver (start the django server)

 ### API Endpoints
 - http://localhost:8000/api/  (base URL)
 - GET	/doctors/
 - GET	/doctors/{id}/
 - POST	/doctors/
 - PUT	/doctors/{id}/
 - DELETE	/doctors/{id}/

### URLS
FRONTEND: 
  - URL: https://mindcarehealthbooking.netlify.app/
  - host: Netlify
  - STEPS TO DO
    - Push React code to GitHub
    - Set the build settings
    - Add environment variable: REACT_APP_API_URL=https://mindcare-hospital-booking.onrender.com/api
    - deploy
BACKEND:
  - URL: https://mindcare-hospital-booking.onrender.com/
  - host: Render
  - STEPS TO DO
    - Push Django code to GitHub repository
    - Connect GitHub repository
    - Add environment variables
    - deploy
