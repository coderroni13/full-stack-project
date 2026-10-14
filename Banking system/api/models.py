import random
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    account_number = models.CharField(max_length=10, unique=True, blank=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = self.generate_unique_account_number()
        super().save(*args, **kwargs)

    def generate_unique_account_number(self):
        while True:
            # Generate random 10-digit string
            acct = "".join([str(random.randint(0, 9)) for _ in range(10)])
            if not Profile.objects.filter(account_number=acct).exists():
                return acct

    def __str__(self):
        return f"{self.user.username}'s Profile - Balance: {self.balance}"


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAWAL', 'Withdrawal'),
        ('TRANSFER_IN', 'Transfer In'),
        ('TRANSFER_OUT', 'Transfer Out'),
    ]

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=15, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    sender_email = models.CharField(max_length=254, blank=True, null=True)
    recipient_email = models.CharField(max_length=254, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} of ${self.amount} on {self.timestamp}"


class Account(models.Model):
    account_no = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, unique=True)
    pin = models.CharField(max_length=128)
    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"{self.account_no} - {self.name}"