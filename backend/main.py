from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
from routes import auth, inspecoes, irregularidades

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="iVisa - Sistema de Inspeções")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão das rotas modulares
app.include_router(auth.router)
app.include_router(inspecoes.router)
app.include_router(irregularidades.router)

@app.get("/")
def read_root():
    return {"message": "API iVisa Online"}