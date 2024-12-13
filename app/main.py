from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from app.database import Base, engine
from app.initial_data import initialize_database
from app.routers import users, equipments, vehicles, devices
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates

# Criar as tabelas no banco
Base.metadata.create_all(bind=engine)

# Inicializar o banco de dados (inserir CEO, se necessário)
initialize_database()

# Instância do FastAPI
app = FastAPI()

# Configurar templates
templates = Jinja2Templates(directory="static/templates")

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

# Montar arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")



# Rota para o index.html
@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})