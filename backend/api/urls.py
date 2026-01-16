from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views 

router = DefaultRouter()
router.register(r'doctors', views.DoctorViewSet)
router.register(r'specializations', views.SpecializationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Appointments endpoints
    path('appointments/', views.AppointmentView.as_view(), name='appointments'),
    path('appointments/<int:appointment_id>/', views.AppointmentView.as_view(), name='appointment-detail'),
    # Availability endpoints
    path('check-availability/', views.CheckAvailabilityView.as_view(), name='check-availability'),
    path('doctors/<int:doctor_id>/availability/', views.DoctorAvailabilityView.as_view(), name='doctor-availability'),
]