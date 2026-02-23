from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Esquema para as irregularidades
class IrregularidadeBase(BaseModel):
    descricao: str
    gravidade: str
    exige_interdicao_imediata: bool

class IrregularidadeCreate(IrregularidadeBase):
    pass

class Irregularidade(IrregularidadeBase):
    id: int
    inspecao_id: int

    class Config:
        from_attributes = True

# Esquema para as inspeções
class InspecaoBase(BaseModel):
    estabelecimento: str

class InspecaoCreate(InspecaoBase):
    pass

class Inspecao(InspecaoBase):
    id: int
    data_hora: datetime
    status_atual: str
    finalizada: bool
    irregularidades: List[Irregularidade] = []

    class Config:
        from_attributes = True

# Para a finalização (conforme enunciado)
class InspecaoFinalizar(BaseModel):
    novo_status: str 

# Autenticação
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None