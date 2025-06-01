from fastapi import APIRouter, Depends, HTTPException
from app.schemas.payment import PaymentCreate, Payment, PaymentUpdate
from app.crud import payment as payment_crud
from app.core.database import get_db
from app.dependencies import get_current_user, role_required
from app.enums.user_role import Role
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.schemas.booking import Booking
from app.schemas.user import User

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
)


@router.post("/", response_model=Payment)
async def create_new_payment(
    payment: PaymentCreate,
    db=Depends(get_db),
    current_user=Depends(role_required([Role.USER])),
):
    return await payment_crud.create_payment(db, payment, current_user)


@router.get("/{payment_id}", response_model=Payment)
async def read_payment(
    payment_id: int, db=Depends(get_db), current_user=Depends(get_current_user)
):
    return await payment_crud.get_payment(db, payment_id, current_user)


@router.delete("/{payment_id}")
async def delete_payment(
    payment_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await payment_crud.delete_payment(db, payment_id, current_user)


@router.get("/", response_model=List[Payment])
async def get_user_payments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await payment_crud.get_user_payments(db, current_user)