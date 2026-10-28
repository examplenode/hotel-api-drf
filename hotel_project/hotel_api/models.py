from django.db import models

class Room(models.Model):
    ROOM_TYPES = [
        ('STD', 'Standard'),
        ('DLX', 'Deluxe'),
        ('SUITE', 'Suite'),
        ('PRES', 'Presidential'),
    ]
    number = models.CharField(max_length=10, unique=True)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPES)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.PositiveIntegerField(default=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.number} ({self.get_room_type_display()})"

class Guest(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    ]
    room = models.ForeignKey(Room, on_delete=models.PROTECT, related_name='bookings')
    guest = models.ForeignKey(Guest, on_delete=models.PROTECT, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.guest} in {self.room}"