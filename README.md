# Wayne Industries - Sistema de Segurança

Este é um sistema completo de gerenciamento de segurança, desenvolvido como projeto final. A aplicação é composta por um backend em **FastAPI**, um banco de dados **MySQL** e um frontend em **HTML/CSS**.

## Funcionalidades

- Gerenciamento de Usuários (com autenticação e autorização).
- Gerenciamento de Equipamentos, Veículos e Dispositivos de Segurança.
- Diferentes níveis de acesso: Funcionário, Gerente, Administrador de Segurança e CEO.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes programas instalados:

- **Python 3.9+**
- **MySQL**
- **Git**

## Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Crie um ambiente virtual

```bash
python -m venv venv
```

### 3. Ative o ambiente virtual

- No **Linux/Mac**:
  ```bash
  source venv/bin/activate
  ```
- No **Windows**:
  ```bash
  venv\Scripts\activate
  ```

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

### 5. Configure o banco de dados

Certifique-se de que o **MySQL** esteja rodando e que você criou o banco de dados necessário. O arquivo de configuração do banco pode ser ajustado no `DATABASE_URL` dentro de `app/database.py`.

## Configuração do Banco de Dados

Certifique-se de que o MySQL esteja instalado e rodando. Este projeto usa as seguintes credenciais padrão para se conectar ao banco de dados:

**Configuração do Banco de Dados:**

- **Usuário:** infinity
- **Senha:** My123456
- **Host:** localhost
- **Porta:** 3306
- **Banco de Dados:** industrias_wayne

### 1. Criação do Banco de Dados

Abra o MySQL e crie o banco de dados com o seguinte comando:

```sql
CREATE DATABASE industrias_wayne;
```

### 2. Configurar o Usuário e Permissões

Crie o usuário `infinity` (se ainda não existir) e garanta que ele tenha acesso ao banco de dados `industrias_wayne`:

```sql
CREATE USER 'infinity'@'localhost' IDENTIFIED BY 'My123456';
GRANT ALL PRIVILEGES ON industrias_wayne.* TO 'infinity'@'localhost';
FLUSH PRIVILEGES;
```

Se o usuário já existir, apenas conceda as permissões:

```sql
GRANT ALL PRIVILEGES ON industrias_wayne.* TO 'infinity'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Verificar a Conexão

Certifique-se de que o MySQL está rodando e que você pode acessar o banco com o seguinte comando:

```bash
mysql -u infinity -p
```

Digite a senha `My123456` para verificar a conexão.

### 4. Configuração no Projeto

O arquivo `app/database.py` já está configurado para usar essa URL:

```python
DATABASE_URL = "mysql+mysqlconnector://infinity:My123456@localhost:3306/industrias_wayne"
```

Se necessário, ajuste esse valor para o seu ambiente local.

### 5. Inicializar o Banco de Dados

Depois de configurar o MySQL e o banco de dados, execute os seguintes comandos para criar as tabelas necessárias no banco:

```bash
uvicorn app.main:app --reload
```

Ou use um script de inicialização no Python para criar as tabelas:

```python
from app.database import Base, engine
from app.models import User, Equipment, Vehicle, Device

Base.metadata.create_all(bind=engine)
```

### 6. Testar o Banco

Certifique-se de que o banco foi criado com sucesso. O primeiro usuário (CEO, Bruce Wayne) será inserido automaticamente no banco com as credenciais:

- **Usuário:** Bruce Wayne
- **Senha:** robin
- **Papel (Role):** ceo

## Estrutura do Projeto

```
.
.
├── app
│   ├── assets
│   │   ├── 479774-3840x2160-desktop-4k-gotham-city-background.jpg
│   │   ├── wayne-enterprises-logo-27B6BAEE5F-seeklogo.com-removebg-preview.png
│   ├── routers
│   │   ├── devices.py
│   │   ├── equipments.py
│   │   ├── users.py
│   │   ├── vehicles.py
│   └── utils
│       ├── auth.py
│       ├── password.py
│       ├── __init__.py
│   ├── crud_Equipment.py
│   ├── crud_device.py
│   ├── crud_vehicle.py
│   ├── database.py
│   ├── initial_data.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── utils.py
│   ├── __init__.py
├── static
│   ├── css
│   │   ├── ArchiveSecret.css
│   │   ├── devices.css
│   │   ├── equipments.css
│   │   ├── resources.css
│   │   ├── styles.css
│   │   ├── vehicles.css
│   ├── js
│   │   ├── app.js
│   │   ├── devices.js
│   │   ├── equipments.js
│   │   ├── resources.js
│   │   ├── vehicles.js
│   ├── templates
│       ├── ArchiveScretVillans.html
│       ├── ArchiveSecretMetahumans.html
│       ├── devices.html
│       ├── equipments.html
│       ├── index.html
│       ├── resources.html
│       ├── secret.html
│       ├── vehicles.html
├── venv
├── .gitignore
├── README.md
├── requirements.txt

```

## Testes

Use o **Postman** ou outro cliente HTTP para testar as APIs.

## Contribuições

Se você quiser contribuir com este projeto, siga os passos abaixo:

1. Crie um fork do repositório.
2. Crie uma branch para suas alterações: `git checkout -b minha-branch`.
3. Faça o commit: `git commit -m 'Minhas alterações'`.
4. Envie suas alterações: `git push origin minha-branch`.
5. Abra um Pull Request.
