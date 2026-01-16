from rest_framework import serializers
from .models import Specialization, Doctor, Appointment
from django.utils import timezone

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name', 'description']

class DoctorSerializer(serializers.ModelSerializer):
    specialization_name = serializers.CharField(source='specialization.name', read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'specialization', 'specialization_name',
            'years_experience', 'bio', 'consultation_modes', 
            'is_available', 'created_at'
        ]

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization.name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_specialization',
            'patient_name', 'patient_email', 'patient_phone',
            'appointment_date', 'appointment_time', 'consultation_type',
            'status', 'notes', 'created_at'
        ]
        read_only_fields = ['status', 'notes', 'created_at']
    
    def validate(self, data):
        """Validate appointment data"""
        doctor = data.get('doctor')
        consultation_type = data.get('consultation_type')
                
        # Check if doctor is available
        if doctor and not doctor.is_available:
            raise serializers.ValidationError({
                'doctor': 'Doctor is not available for appointments.'
            })
        
        # Check if doctor supports the consultation type
        if doctor and consultation_type:
            if not doctor.supports_consultation_type(consultation_type):
                # Get human-readable doctor modes
                mode_display = dict(Doctor.CONSULTATION_MODES).get(doctor.consultation_modes, doctor.consultation_modes)
                raise serializers.ValidationError({
                    'consultation_type': f'Doctor only offers {mode_display} consultations.'
                })
        
        return data
    
    def create(self, validated_data):
        """Override create to handle validation properly"""
        try:
            # Set default status if not provided
            if 'status' not in validated_data:
                validated_data['status'] = 'confirmed'
            
            # Create the appointment
            return Appointment.objects.create(**validated_data)
            
        except Exception as e:
            raise serializers.ValidationError(str(e))