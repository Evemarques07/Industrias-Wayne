from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.utils import hash_password, verify_password
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse
from app.utils.auth import get_current_user
from app.utils.password import hash_password, verify_password



router = APIRouter(
    prefix="/users",
    tags=["users"],
)

# Configuração do JWT
SECRET_KEY = "sua-chave-secreta"  # Substitua por uma chave forte
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Função para criar o token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "role": data["role"]})  # Adicione o campo role
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Função para verificar o papel (role)
def check_role(user: User, allowed_roles: list):        
    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Permissões insuficientes."
        )

# Rota para cadastro de usuários
@router.post("/", response_model=UserResponse)
def register_user(
    user: UserCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verificar se o usuário atual tem permissão para cadastrar o novo papel
    if user.role == "security_admin" and current_user.role != "ceo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas o CEO pode cadastrar Administradores de Segurança."
        )
    
    if user.role == "manager" and current_user.role not in ["ceo", "security_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas o CEO ou Administradores de Segurança podem cadastrar Gerentes."
        )
    
    if user.role == "employee" and current_user.role not in ["ceo", "security_admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas o CEO, Administradores de Segurança ou Gerentes podem cadastrar Funcionários."
        )
    
    # Verificar se o username já existe
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário já existe"
        )

    # Verificar se já existe um CEO
    if user.role == "ceo":
        existing_ceo = db.query(User).filter(User.role == "ceo").first()
        if existing_ceo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Já existe um CEO cadastrado no sistema."
            )

    # Criar novo usuário
    hashed_password = hash_password(user.password)
    new_user = User(
        username=user.username,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



# Rota de login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}



@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
    }


# Rota protegida para usuários com role "admin"
@router.get("/admin-only")
def admin_route(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["admin", "ceo"])
    return {"message": "Acesso autorizado para administradores e CEOs."}

# Rota protegida para gerentes e acima
@router.get("/manager-or-above")
def manager_route(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["manager", "admin", "ceo"])
    return {"message": "Acesso autorizado para gerentes e superiores."}

# Rota protegida para CEO e Security Admin
@router.get("/ceo-and-security-admin")
def ceo_and_security_admin_route(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["ceo", "security_admin"])
    return {"message": "Acesso autorizado para CEO e Administradores de Segurança."}

# Rota protegida apenas para CEO
@router.get("/ceo-only")
def ceo_only_route(current_user: User = Depends(get_current_user)):
    check_role(current_user, ["ceo"])
    return {"message": "Bem-vindo ao painel exclusivo do CEO!"}
