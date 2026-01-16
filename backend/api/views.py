from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Specialization, Doctor, Appointment
from .serializers import (
    SpecializationSerializer, 
    DoctorSerializer, 
    AppointmentSerializer
)


class SpecializationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    pagination_class = None


class DoctorViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()
    
    def get_queryset(self):
        queryset = Doctor.objects.filter(is_active=True)
        
        # Filter by specialization
        specialization = self.request.query_params.get('specialization')
        if specialization:
            queryset = queryset.filter(specialization_id=specialization)
        
        # Filter by availability
        available = self.request.query_params.get('available')
        if available and available.lower() == 'true':
            queryset = queryset.filter(is_available=True)
        
        # Filter by consultation mode
        consultation_mode = self.request.query_params.get('consultation_mode')
        if consultation_mode:
            queryset = queryset.filter(consultation_modes__in=[consultation_mode, 'both'])
        
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete - set is_active=False"""
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(
            {'message': 'Doctor deactivated successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


class AppointmentView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, appointment_id=None):
        if appointment_id:
            try:
                appointment = Appointment.objects.get(id=appointment_id)
                serializer = AppointmentSerializer(appointment)
                return Response(serializer.data)
            except Appointment.DoesNotExist:
                return Response(
                    {'error': 'Appointment not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Get all appointments with filters
        appointments = Appointment.objects.all()
        
        # Filter by doctor
        doctor_id = request.query_params.get('doctor')
        if doctor_id:
            appointments = appointments.filter(doctor_id=doctor_id)
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            appointments = appointments.filter(status=status_filter)
        
        # Filter by date range
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
            appointments = appointments.filter(appointment_date__gte=start_date)
        if end_date:
            appointments = appointments.filter(appointment_date__lte=end_date)
        
        # Filter by consultation type
        consultation_type = request.query_params.get('consultation_type')
        if consultation_type:
            appointments = appointments.filter(consultation_type=consultation_type)
        
        appointments = appointments.order_by('appointment_date', 'appointment_time')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        
        if serializer.is_valid():
            doctor = serializer.validated_data['doctor']
            appointment_date = serializer.validated_data['appointment_date']
            appointment_time = serializer.validated_data['appointment_time']
            
            # Check for double booking
            existing_appointment = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                status='confirmed'
            ).exists()
            
            if existing_appointment:
                return Response(
                    {'error': 'This time slot is already booked'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if doctor is available
            if not doctor.is_available:
                return Response(
                    {'error': 'Doctor is not available for appointments'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            appointment = serializer.save()
            return Response(
                {
                    'message': 'Appointment booked successfully',
                    'appointment_id': appointment.id,
                    'appointment': AppointmentSerializer(appointment).data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Appointment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = AppointmentSerializer(appointment, data=request.data)
        
        if serializer.is_valid():
            # Check for double booking if time is changed
            if 'appointment_date' in request.data or 'appointment_time' in request.data:
                doctor = serializer.validated_data.get('doctor', appointment.doctor)
                appointment_date = serializer.validated_data.get('appointment_date', appointment.appointment_date)
                appointment_time = serializer.validated_data.get('appointment_time', appointment.appointment_time)
                
                existing_appointment = Appointment.objects.filter(
                    doctor=doctor,
                    appointment_date=appointment_date,
                    appointment_time=appointment_time,
                    status='confirmed'
                ).exclude(id=appointment_id).exists()
                
                if existing_appointment:
                    return Response(
                        {'error': 'This time slot is already booked'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            serializer.save()
            return Response(
                {
                    'message': 'Appointment updated successfully',
                    'appointment': serializer.data
                }
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, appointment_id):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            appointment.status = 'cancelled'
            appointment.save()
            return Response(
                {'message': 'Appointment cancelled successfully'},
                status=status.HTTP_200_OK
            )
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Appointment not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class DoctorAvailabilityView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, doctor_id):
        try:
            doctor = Doctor.objects.get(id=doctor_id, is_active=True)
        except Doctor.DoesNotExist:
            return Response(
                {'error': 'Doctor not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get date from query params (default: today)
        date_str = request.query_params.get('date')
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            target_date = timezone.now().date()
        
        # Check if date is in the past
        if target_date < timezone.now().date():
            return Response({
                'doctor_id': doctor.id,
                'doctor_name': doctor.name,
                'date': target_date,
                'available': False,
                'message': 'Cannot check availability for past dates'
            })
        
        # Check if doctor is generally available
        if not doctor.is_available:
            return Response({
                'doctor_id': doctor.id,
                'doctor_name': doctor.name,
                'date': target_date,
                'available': False,
                'message': 'Doctor is not available'
            })
        
        # Generate time slots (9 AM to 5 PM)
        time_slots = []
        for hour in range(9, 17):
            slot_time = f"{hour:02d}:00:00"
            
            # Check if slot is booked
            is_booked = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=target_date,
                appointment_time=slot_time,
                status='confirmed'
            ).exists()
            
            time_slots.append({
                'time': f"{hour:02d}:00",
                'available': not is_booked
            })
        
        return Response({
            'doctor_id': doctor.id,
            'doctor_name': doctor.name,
            'date': target_date,
            'is_available': doctor.is_available,
            'time_slots': time_slots,
            'consultation_modes': doctor.consultation_modes
        })


class CheckAvailabilityView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        doctor_id = request.data.get('doctor_id')
        date_str = request.data.get('date')
        time_str = request.data.get('time')
        
        if not all([doctor_id, date_str, time_str]):
            return Response(
                {'error': 'doctor_id, date, and time are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            appointment_time = f"{time_str}:00" if ':' in time_str else f"{time_str}:00:00"
        except ValueError:
            return Response(
                {'error': 'Invalid date or time format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            doctor = Doctor.objects.get(id=doctor_id, is_active=True)
        except Doctor.DoesNotExist:
            return Response(
                {'error': 'Doctor not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check basic availability
        if not doctor.is_available:
            return Response({
                'available': False,
                'reason': 'Doctor is not available for appointments'
            })
        
        # Check if date is in the past
        if appointment_date < timezone.now().date():
            return Response({
                'available': False,
                'reason': 'Cannot book appointments in the past'
            })
        
        # Check for existing appointment
        existing_appointment = Appointment.objects.filter(
            doctor=doctor,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status='confirmed'
        ).exists()
        
        if existing_appointment:
            return Response({
                'available': False,
                'reason': 'Time slot is already booked'
            })
        
        return Response({
            'available': True,
            'doctor': doctor.name,
            'date': appointment_date,
            'time': time_str,
            'consultation_modes': doctor.consultation_modes
        })