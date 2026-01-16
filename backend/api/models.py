from django.db import models
from django.core.validators import MinValueValidator

class Specialization(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Doctor(models.Model):
    # Update CONSULTATION_MODES to support all 3 types
    CONSULTATION_MODES = [
        ('all', 'All Modes'),
        ('online_only', 'Online Only (Video/Phone)'),
        ('in_person_only', 'In-Person Only'),
        ('video_only', 'Video Call Only'),
        ('phone_only', 'Phone Call Only'),
        ('in_person_video', 'In-Person & Video'),
        ('in_person_phone', 'In-Person & Phone')
    ]
    
    name = models.CharField(max_length=200)
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE, related_name='doctors')
    years_experience = models.IntegerField(validators=[MinValueValidator(0)])
    bio = models.TextField()
    consultation_modes = models.CharField(max_length=20, choices=CONSULTATION_MODES, default='all')
    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Dr. {self.name} - {self.specialization.name}"
    
    class Meta:
        ordering = ['name']
    
    # Helper method to check if doctor supports a specific consultation type
    def supports_consultation_type(self, consultation_type):
        """Check if doctor supports the given consultation type"""
        if self.consultation_modes == 'all':
            return True
        elif self.consultation_modes == 'online_only':
            return consultation_type in ['video', 'phone']
        elif self.consultation_modes == 'in_person_only':
            return consultation_type == 'in_person'
        elif self.consultation_modes == 'video_only':
            return consultation_type == 'video'
        elif self.consultation_modes == 'phone_only':
            return consultation_type == 'phone'
        elif self.consultation_modes == 'in_person_video':
            return consultation_type in ['in_person', 'video']
        elif self.consultation_modes == 'in_person_phone':
            return consultation_type in ['in_person', 'phone']
        return False

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed')
    ]
    
    # Update CONSULTATION_TYPES to match React
    CONSULTATION_TYPES = [
        ('video', 'Video Call'),
        ('phone', 'Phone Call'),
        ('in_person', 'In-Person')
    ]
    
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    patient_name = models.CharField(max_length=200)
    patient_email = models.EmailField()
    patient_phone = models.CharField(max_length=15)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    consultation_type = models.CharField(max_length=20, choices=CONSULTATION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient_name} with Dr. {self.doctor.name} on {self.appointment_date}"
    
    class Meta:
        ordering = ['-appointment_date', 'appointment_time']
        unique_together = ['doctor', 'appointment_date', 'appointment_time']
    
    def clean(self):
        """Validate appointment before saving"""
        from django.core.exceptions import ValidationError
        from datetime import datetime, date
        
        # Check if doctor supports the selected consultation type
        if not self.doctor.supports_consultation_type(self.consultation_type):
            raise ValidationError({
                'consultation_type': f'Doctor does not support {self.consultation_type} consultations.'
            })
        
        # Check if appointment is in the past - SIMPLE VERSION
        if self.appointment_date:
            today = date.today()
            
            # Check if date is in the past
            if self.appointment_date < today:
                raise ValidationError('Cannot book appointments in the past.')
            
            # If it's today, check the time
            if self.appointment_date == today and self.appointment_time:
                current_time = datetime.now().time()
                if self.appointment_time < current_time:
                    raise ValidationError('Cannot book appointments in the past.')
        
        # Check if doctor is available
        if not self.doctor.is_available:
            raise ValidationError('Doctor is not available for appointments.')
    
    def save(self, *args, **kwargs):
        """Override save to call clean validation"""
        self.full_clean()
        super().save(*args, **kwargs)