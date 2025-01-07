from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.initial_data import initialize_database
from app.routers import users, equipments, vehicles, devices
from app.models import User, Equipment, Device, Vehicle
from app.utils.auth import get_current_user, check_role
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

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

# Rota de boas-vindas
@app.get("/")
async def root():
    return {"message": "Bem-vindo ao sistema de gerenciamento de segurança!"}

# Rotas protegidas
@app.get("/dashboard-data")
def get_dashboard_data(current_user=Depends(get_current_user)):
    # Garantir que o usuário esteja autenticado
    db: Session = SessionLocal()

    # Verificar papel do usuário (somente gerentes ou superiores podem acessar)
    check_role(current_user, ["manager", "security_admin", "ceo"])

    # Consultas ao banco de dados
    total_users = db.query(User.role, func.count(User.id).label("total")).group_by(User.role).all()
    total_users_formatted = [{"role": row.role, "total": row.total} for row in total_users]

    total_equipments = db.query(Equipment).count()
    total_devices = db.query(Device).count()
    total_vehicles = db.query(Vehicle).count()

    recent_users = db.query(User.id, User.username, User.role).order_by(User.id.desc()).limit(5).all()
    recent_users_formatted = [{"id": row.id, "username": row.username, "role": row.role} for row in recent_users]

    recent_equipments = db.query(Equipment.id, Equipment.name, Equipment.description).order_by(Equipment.id.desc()).limit(5).all()
    recent_equipments_formatted = [{"id": row.id, "name": row.name, "description": row.description} for row in recent_equipments]

    # Retornar os dados formatados
    return {
        "dashboard": {
            "total_users": total_users_formatted,
            "total_equipments": total_equipments,
            "total_devices": total_devices,
            "total_vehicles": total_vehicles,
             "recent_users": recent_users_formatted,
             "recent_equipments": recent_equipments_formatted
        },
        "current_user": {
            "username": current_user.username,
            "role": current_user.role
        }
    }


@app.get("/admin-only")
async def admin_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["manager","security_admin", "ceo"])
    return {"message": "Página restrita para administradores ou CEO"}

@app.get("/manager-or-above")
async def manager_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["manager", "ceo"])
    return {"message": "Página restrita para gerentes ou superiores"}

@app.get("/ceo-and-security-admin")
async def ceo_security_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["ceo", "security_admin"])
    return {"message": "Página restrita para CEO e administradores de segurança"}

@app.get("/resources")
async def resources_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["ceo", "security_admin", "manager"])
    return {"message": "Gerenciamento de recursos"}

@app.get("/resources/equipments")
async def equipments_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["manager", "security_admin", "ceo"])
    return {"message": "Gerenciamento de equipamentos"}

@app.get("/resources/vehicles")
async def vehicles_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["security_admin", "ceo", "employee"])
    return {"message": "Gerenciamento de veículos"}

@app.get("/resources/devices")
async def devices_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["security_admin", "ceo"])
    return {"message": "Gerenciamento de dispositivos"}

@app.get("/resources/wayne-vault")
async def wayne_vault_page(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["ceo"])
    return {"message": "Acesso ao Cofre Wayne"}