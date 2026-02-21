from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, database, auth_utils

router = APIRouter(prefix="/inspecoes", tags=["Irregularidades"])

@router.post("/{inspecao_id}/irregularidades/", response_model=schemas.Irregularidade)
def adicionar_irregularidade(
    inspecao_id: int, 
    irr: schemas.IrregularidadeCreate, 
    db: Session = Depends(database.get_db),
    current_user: str = Depends(auth_utils.get_current_user)
):
    db_inspecao = db.query(models.Inspecao).filter(models.Inspecao.id == inspecao_id).first()
    
    if not db_inspecao:
        raise HTTPException(status_code=404, detail="Inspeção não encontrada.")
    
    # REGRA DE IMUTABILIDADE
    if db_inspecao.finalizada:
        raise HTTPException(status_code=403, detail="Esta inspeção já foi finalizada e não pode ser alterada.")
    
    nova_irr = models.Irregularidade(**irr.dict(), inspecao_id=inspecao_id)
    db.add(nova_irr)
    db.commit()
    db.refresh(nova_irr)
    return nova_irr