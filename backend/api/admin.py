from django.contrib import admin
from .models import Specialization, Doctor, Appointment

@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ['name', 'description_short']
    search_fields = ['name']
    
    def description_short(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    description_short.short_description = 'Description'

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialization', 'years_experience', 'consultation_modes', 'is_available', 'is_active']
    list_filter = ['specialization', 'is_available', 'is_active', 'consultation_modes']
    search_fields = ['name', 'bio']
    list_editable = ['is_available', 'is_active']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient_name', 'doctor', 'appointment_date', 'appointment_time', 'consultation_type', 'status']
    list_filter = ['doctor', 'appointment_date', 'status', 'consultation_type']
    search_fields = ['patient_name', 'patient_email', 'patient_phone']
    list_editable = ['status']
    date_hierarchy = 'appointment_date'