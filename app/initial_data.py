from sqlalchemy.orm import Session
from app.models import User
from app.utils.password import hash_password
from app.database import SessionLocal

def initialize_database():
    db: Session = SessionLocal()
    try:
        # Verificar se o CEO já está cadastrado
        existing_ceo = db.query(User).filter(User.role == "ceo").first()
        if not existing_ceo:
            hashed_password = hash_password("robin")
            ceo_user = User(
                username="Bruce Wayne",
                hashed_password=hashed_password,
                role="ceo",
            )
            db.add(ceo_user)
            db.commit()
            print("Usuário CEO 'Bruce Wayne' criado com sucesso!")
        else:
            print("Usuário CEO já existente.")
    finally:
        db.close()
