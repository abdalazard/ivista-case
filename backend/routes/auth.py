from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import schemas, database, auth_utils

router = APIRouter(tags=["Autenticação"])

@router.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != "fiscal" or form_data.password != "ivisa123":
        raise HTTPException(status_code=400, detail="Usuário ou senha incorretos")
    
    access_token = auth_utils.create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}