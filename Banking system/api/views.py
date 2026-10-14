import json
from decimal import Decimal
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET
from django.db import transaction
from .models import Profile, Transaction

@ensure_csrf_cookie
@require_GET
def get_csrf_token(request):
    """View to set and return the CSRF cookie."""
    return JsonResponse({'detail': 'CSRF cookie set'})


@require_POST
def register_user(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return JsonResponse({'message': 'All fields are required'}, status=400)

        if User.objects.filter(username=email).exists():
            return JsonResponse({'message': 'User with this email already exists'}, status=400)

        # Create user
        with transaction.atomic():
            user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
            Profile.objects.create(user=user)

        # Automatically login the user
        login(request, user)
        return JsonResponse({
            'success': True,
            'message': 'Registered successfully',
            'user': {
                'name': user.first_name,
                'email': user.email,
                'account_number': user.profile.account_number,
                'balance': str(user.profile.balance)
            }
        })
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)


@require_POST
def login_user(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'message': 'Email and password are required'}, status=400)

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True,
                'message': 'Logged in successfully',
                'user': {
                    'name': user.first_name,
                    'email': user.email,
                    'account_number': user.profile.account_number,
                    'balance': str(user.profile.balance)
                }
            })
        else:
            return JsonResponse({'message': 'Invalid email or password'}, status=401)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)


@login_required(login_url='/')
def logout_user(request):
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})


@login_required(login_url='/')
@require_GET
def get_profile(request):
    try:
        user = request.user
        profile = user.profile
        transactions = Transaction.objects.filter(profile=profile).order_by('-timestamp')

        transactions_list = []
        for tx in transactions:
            transactions_list.append({
                'id': tx.id,
                'type': tx.transaction_type,
                'amount': str(tx.amount),
                'sender_email': tx.sender_email or '',
                'recipient_email': tx.recipient_email or '',
                'timestamp': tx.timestamp.isoformat()
            })

        return JsonResponse({
            'success': True,
            'user': {
                'name': user.first_name,
                'email': user.email,
                'account_number': profile.account_number,
                'balance': str(profile.balance)
            },
            'transactions': transactions_list
        })
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)


@login_required(login_url='/')
@require_POST
def deposit_funds(request):
    try:
        data = json.loads(request.body)
        amount_str = data.get('amount')

        if not amount_str:
            return JsonResponse({'message': 'Amount is required'}, status=400)

        amount = Decimal(str(amount_str))
        if amount <= 0:
            return JsonResponse({'message': 'Amount must be greater than zero'}, status=400)

        profile = request.user.profile

        with transaction.atomic():
            profile.balance += amount
            profile.save()

            Transaction.objects.create(
                profile=profile,
                transaction_type='DEPOSIT',
                amount=amount
            )

        return JsonResponse({
            'success': True,
            'message': f'Successfully deposited ৳{amount:.2f}',
            'balance': str(profile.balance)
        })
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)


@login_required(login_url='/')
@require_POST
def withdraw_funds(request):
    try:
        data = json.loads(request.body)
        amount_str = data.get('amount')

        if not amount_str:
            return JsonResponse({'message': 'Amount is required'}, status=400)

        amount = Decimal(str(amount_str))
        if amount <= 0:
            return JsonResponse({'message': 'Amount must be greater than zero'}, status=400)

        profile = request.user.profile

        if profile.balance < amount:
            return JsonResponse({'message': 'Insufficient funds'}, status=400)

        with transaction.atomic():
            profile.balance -= amount
            profile.save()

            Transaction.objects.create(
                profile=profile,
                transaction_type='WITHDRAWAL',
                amount=amount
            )

        return JsonResponse({
            'success': True,
            'message': f'Successfully withdrew ৳{amount:.2f}',
            'balance': str(profile.balance)
        })
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)


@login_required(login_url='/')
@require_POST
def transfer_funds(request):
    try:
        data = json.loads(request.body)
        amount_str = data.get('amount')
        recipient_identifier = data.get('recipient') # email or account number

        if not amount_str or not recipient_identifier:
            return JsonResponse({'message': 'Amount and recipient are required'}, status=400)

        amount = Decimal(str(amount_str))
        if amount <= 0:
            return JsonResponse({'message': 'Amount must be greater than zero'}, status=400)

        sender_profile = request.user.profile

        if sender_profile.balance < amount:
            return JsonResponse({'message': 'Insufficient funds for transfer'}, status=400)

        # Try to find recipient profile by email or account number
        recipient_profile = None
        
        # 1. Try by account number
        recipient_profile = Profile.objects.filter(account_number=recipient_identifier).first()
        
        # 2. Try by email/username if not found by account number
        if not recipient_profile:
            recipient_user = User.objects.filter(email=recipient_identifier).first()
            if recipient_user:
                recipient_profile = getattr(recipient_user, 'profile', None)

        if not recipient_profile:
            return JsonResponse({'message': 'Recipient account or email not found'}, status=404)

        if recipient_profile == sender_profile:
            return JsonResponse({'message': 'Cannot transfer money to your own account'}, status=400)

        with transaction.atomic():
            # Deduct from sender
            sender_profile.balance -= amount
            sender_profile.save()

            # Credit recipient
            recipient_profile.balance += amount
            recipient_profile.save()

            # Record transaction for sender (Debit)
            Transaction.objects.create(
                profile=sender_profile,
                transaction_type='TRANSFER_OUT',
                amount=amount,
                sender_email=sender_profile.user.email,
                recipient_email=recipient_profile.user.email
            )

            # Record transaction for recipient (Credit)
            Transaction.objects.create(
                profile=recipient_profile,
                transaction_type='TRANSFER_IN',
                amount=amount,
                sender_email=sender_profile.user.email,
                recipient_email=recipient_profile.user.email
            )

        return JsonResponse({
            'success': True,
            'message': f'Successfully transferred ৳{amount:.2f} to {recipient_profile.user.first_name}',
            'balance': str(sender_profile.balance)
        })
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Account
from .serializers import AccountSerializer


@api_view(["POST"])
def register(request):

    serializer = AccountSerializer(data=request.data)

    if serializer.is_valid():
        account = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Registration successful",
                "account_no": account.account_no,
                "name": account.name,
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        {
            "success": False,
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )