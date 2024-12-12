from fastapi import FastAPI
from app.database import Base, engine
from app.initial_data import initialize_database
from app.routers import users
from app.routers import equipments
from app.routers import vehicles
from app.routers import devices
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Criar as tabelas no banco
Base.metadata.create_all(bind=engine)

# Inicializar o banco de dados (inserir CEO, se necessário)
initialize_database()

# Instância do FastAPI
app = FastAPI()

# Rotas
app.include_router(users.router)
app.include_router(equipments.router)
app.include_router(vehicles.router)
app.include_router(devices.router)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens. Para maior segurança, especifique as origens.
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

app.mount("/static", StaticFiles(directory="static"), name="static")