from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, auth_utils

router = APIRouter(prefix="/inspecoes", tags=["Inspeções"])

@router.post("/", response_model=schemas.Inspecao)
def criar_inspecao(
    inspecao: schemas.InspecaoCreate, 
    db: Session = Depends(database.get_db),
    current_user: str = Depends(auth_utils.get_current_user)
):
    nova_inspecao = models.Inspecao(**inspecao.dict(), fiscal_responsavel=current_user)
    db.add(nova_inspecao)
    db.commit()
    db.refresh(nova_inspecao)
    return nova_inspecao

@router.get("/", response_model=List[schemas.Inspecao])
def listar_inspecoes(db: Session = Depends(database.get_db)):
    return db.query(models.Inspecao).all()

@router.put("/{inspecao_id}/finalizar/", response_model=schemas.Inspecao)
def finalizar_inspecao(
    inspecao_id: int, 
    dados: schemas.InspecaoFinalizar, 
    db: Session = Depends(database.get_db),
    current_user: str = Depends(auth_utils.get_current_user)
):
    db_inspecao = db.query(models.Inspecao).filter(models.Inspecao.id == inspecao_id).first()
    
    if not db_inspecao or db_inspecao.finalizada:
         raise HTTPException(status_code=400, detail="Inspeção inexistente ou já finalizada.")

    historico = models.HistoricoStatus(
        inspecao_id=inspecao_id,
        status_anterior=db_inspecao.status_atual,
        status_novo=dados.novo_status
    )
    
    db_inspecao.status_atual = dados.novo_status
    db_inspecao.finalizada = True
    
    db.add(historico)
    db.commit()
    db.refresh(db_inspecao)
    return db_inspecao