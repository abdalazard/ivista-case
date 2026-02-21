from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Inspecao(Base):
    __tablename__ = "inspecoes"

    id = Column(Integer, primary_key=True, index=True)
    estabelecimento = Column(String)
    fiscal_responsavel = Column(String)
    data_hora = Column(DateTime, default=datetime.datetime.utcnow)
    status_atual = Column(String, default="Em Andamento")
    finalizada = Column(Boolean, default=False)

    irregularidades = relationship("Irregularidade", back_populates="inspecao")
    historico = relationship("HistoricoStatus", back_populates="inspecao")

class Irregularidade(Base):
    __tablename__ = "irregularidades"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String)
    gravidade = Column(String)
    exige_interdicao_imediata = Column(Boolean, default=False)
    inspecao_id = Column(Integer, ForeignKey("inspecoes.id"))

    inspecao = relationship("Inspecao", back_populates="irregularidades")

class HistoricoStatus(Base):
    __tablename__ = "historico_status"

    id = Column(Integer, primary_key=True, index=True)
    inspecao_id = Column(Integer, ForeignKey("inspecoes.id"))
    status_anterior = Column(String)
    status_novo = Column(String)
    data_hora = Column(DateTime, default=datetime.datetime.utcnow)

    inspecao = relationship("Inspecao", back_populates="historico")