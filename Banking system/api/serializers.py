from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = Account
        fields = [
            "id",
            "account_no",
            "name",
            "phone",
            "pin",
            "balance",
        ]
        extra_kwargs = {
            "pin": {"write_only": True},
            "balance": {"read_only": True},
        }

    def create(self, validated_data):
        return Account.objects.create(**validated_data)