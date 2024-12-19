from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse
from app.database import Base, engine
from app.initial_data import initialize_database
from app.routers import users, equipments, vehicles, devices
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from app.models import User
from app.utils.auth import get_current_user, check_role


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

# Montar arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configurar templates
templates = Jinja2Templates(directory="app/templates")

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Rota para o index.html
@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/dashboard-data")
def get_dashboard_data(current_user=Depends(get_current_user)):
    return {"message": "Bem-vindo ao Dashboard!", "username": current_user.username, "role": current_user.role}


@app.get("/admin-only", response_class=HTMLResponse)
async def admin_page(request: Request, current_user: User = Depends(get_current_user)):
    check_role(current_user, ["admin", "ceo"])
    return templates.TemplateResponse("admin.html", {"request": request})

@app.get("/manager-or-above", response_class=HTMLResponse)
async def manager_page(request: Request, current_user: User = Depends(get_current_user)):
    check_role(current_user, ["manager", "admin", "ceo"])
    return templates.TemplateResponse("manager.html", {"request": request})

@app.get("/ceo-and-security-admin", response_class=HTMLResponse)
async def ceo_security_page(request: Request, current_user: User = Depends(get_current_user)):
    check_role(current_user, ["ceo", "security_admin"])
    return templates.TemplateResponse("ceo_security_admin.html", {"request": request})

@app.get("/resources", response_class=HTMLResponse)
async def resources_page(request: Request, current_user: User = Depends(get_current_user)):
    # Verificar os papéis permitidos
    check_role(current_user, ["ceo", "security_admin"])
    return templates.TemplateResponse("resources.html", {"request": request})

@app.get("/resources/equipments", response_class=HTMLResponse)
async def equipments_page(request: Request, current_user: User = Depends(get_current_user)):
    check_role(current_user, ["manager", "security_admin", "ceo"])
    return templates.TemplateResponse("equipments.html", {"request": request})


@app.get("/resources/vehicles", response_class=HTMLResponse)
async def vehicles_page(request: Request, current_user: User = Depends(get_current_user)):
    check_role(current_user, ["security_admin", "ceo"])
    return templates.TemplateResponse("vehicles.html", {"request": request})


@app.get("/resources/devices", response_class=HTMLResponse)
async def devices_page(request: Request, current_user: User = Depends(get_current_user)):
    check_role(current_user, ["security_admin", "ceo"])
    return templates.TemplateResponse("devices.html", {"request": request})


@app.get("/resources/wayne-vault", response_class=HTMLResponse)
async def wayne_vault_page(request: Request, current_user: User = Depends(get_current_user)):
    check_role(current_user, ["ceo"])
    return templates.TemplateResponse("wayne-vault.html", {"request": request})
