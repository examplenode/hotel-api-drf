from django.contrib.auth.models import User
from django.db.models import ProtectedError
from rest_framework import viewsets, permissions, generics
from rest_framework.exceptions import ValidationError
from .models import Room, Guest, Booking
from .serializers import RoomSerializer, GuestSerializer, BookingSerializer, RegisterSerializer


class ProtectedDeleteMixin:
    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise ValidationError({'detail': 'Нельзя удалить: есть связанные бронирования'})


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_staff

class RoomViewSet(ProtectedDeleteMixin, viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]

class GuestViewSet(ProtectedDeleteMixin, viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
