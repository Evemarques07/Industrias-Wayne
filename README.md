## **Wayne Industries - Sistema de Segurança**

Este é um sistema completo de gerenciamento de segurança, desenvolvido como projeto final. A aplicação é composta por um backend em **FastAPI**, um banco de dados **MySQL** e um frontend em **HTML/CSS**.

---

## **Funcionalidades**

- Gerenciamento de Usuários (com autenticação e autorização).
- Gerenciamento de Equipamentos, Veículos e Dispositivos de Segurança.
- Diferentes níveis de acesso: Funcionário (employee), Gerente (manager), Administrador de Segurança (security_admin) e CEO.
- **Dados automáticos**: Equipamentos, veículos e dispositivos de segurança já cadastrados para simulação e uso imediato.

---

## **Pré-requisitos**

Antes de começar, certifique-se de ter os seguintes programas instalados:

- **Python 3.9+**
- **MySQL**
- **VSCode**
- **Git**

---

## **Configuração do Ambiente**

### **1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### **2. Crie um ambiente virtual**

```bash
python -m venv venv
```

### **3. Ative o ambiente virtual**

- No **Linux/Mac**:
  ```bash
  source venv/bin/activate
  ```
- No **Windows**:
  ```bash
  venv\Scripts\activate
  ```

### **4. Instale as dependências**

```bash
pip install -r requirements.txt
```

---

## **Configuração do Banco de Dados**

Certifique-se de que o **MySQL** esteja rodando e que você criou o banco de dados necessário. O arquivo de configuração do banco pode ser ajustado no `DATABASE_URL` dentro de `app/database.py`.

### **1. Criação do Banco de Dados**

Abra o MySQL e crie o banco de dados com o seguinte comando:

```sql
CREATE DATABASE industrias_wayne;
```

### **2. Configurar o Usuário e Permissões**

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

### **3. Verificar a Conexão**

Certifique-se de que o MySQL está rodando e que você pode acessar o banco com o seguinte comando:

```bash
mysql -u infinity -p
```

Digite a senha `My123456` para verificar a conexão.

### **4. Configuração no Projeto**

O arquivo `app/database.py` já está configurado para usar essa URL:

```python
DATABASE_URL = "mysql+mysqlconnector://infinity:My123456@localhost:3306/industrias_wayne"
```

Se necessário, ajuste esse valor para o seu ambiente local.

---

## **Inicialização do Projeto**

Depois de configurar o MySQL e o banco de dados, execute os seguintes comandos para criar as tabelas e iniciar o projeto:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## **Inicialização do Frontend**

Para acessar a interface do sistema, você deve abrir o arquivo index.html no navegador. É importante que ele seja servido por um servidor local, como o Live Server no VSCode, para que as interações funcionem corretamente.

1. Instalar o Live Server no VSCode
   Certifique-se de que o Live Server está instalado como extensão no VSCode.
   Para instalar, acesse a aba de extensões (Ctrl+Shift+X), procure por "Live Server" e clique em Instalar.
2. Iniciar o Live Server
   Navegue até o diretório pages/templates/ no VSCode.
   Clique com o botão direito no arquivo index.html e selecione Open with Live Server.
   Isso abrirá o arquivo no navegador com o endereço local, por exemplo:
   ruby
   Copiar código
   http://127.0.0.1:5500/pages/templates/index.html
   Se preferir, você também pode usar outro servidor local, como o Python HTTP Server:

bash
Copiar código
cd pages/templates/
python -m http.server 5500
Depois, acesse no navegador:

arduino
Copiar código
http://127.0.0.1:5500/index.html
⚠️ Importante: Apenas abrir o arquivo diretamente no navegador (duplo clique) pode causar erros, pois algumas funcionalidades dependem de requisições que precisam ser feitas através de um servidor local.

### **Dados Automáticos Inseridos**

Durante a inicialização do projeto, os seguintes dados são inseridos automaticamente:

CEO (Bruce Wayne):

Usuário: Bruce Wayne

Senha: robin

Papel (Role): ceo

⚠️ Importante: O sistema permite apenas um usuário com o papel de ceo, e esse usuário já foi criado automaticamente no sistema. Ele possui permissões exclusivas para gerenciar o cadastro de outros usuários e realizar ações administrativas. Não é possível criar outro usuário com o papel de ceo.

Usuários adicionais para testes:

Para melhorar a experiência de testes no sistema, foram pré-configurados os seguintes usuários:

Alfred Pennyworth

Usuário: Alfred Pennyworth  
Senha: alfred123  
Papel (Role): security_admin

Lucius Fox

Usuário: Lucius Fox  
Senha: lucius123  
Papel (Role): manager

Clark Kent

Usuário: Clark Kent  
Senha: superman123  
Papel (Role): employee

Diana Prince

Usuário: Diana Prince  
Senha: wonderwoman123  
Papel (Role): employee

⚠️ Nota: Esses usuários foram criados automaticamente para facilitar o teste do sistema e validar as permissões e funcionalidades específicas de cada papel (security_admin, manager, employee). Sinta-se à vontade para utilizá-los durante os testes ou para criar novos usuários, caso necessário.

### **Novos usuários**

Login/Administração

É possível realizar o cadastro de novos usuários, respeitando a hierarquia de permissões do sistema:

CEO: Pode cadastrar novos usuários com as funções de security_admin, manager ou employee.
Security Admin: Pode cadastrar usuários com as funções de manager ou employee.
Manager: Pode cadastrar usuários apenas com a função de employee.
⚠️ Importante: Cada nível de usuário tem permissões específicas, garantindo que as ações realizadas sejam controladas e auditadas conforme as políticas de segurança da Wayne Industries.

- **Equipamentos**: Incluindo gadgets como Bat-Sinal, Bat-Garrafa e outros dispositivos tecnológicos.
- **Veículos**: Como Batmóvel, Bat-Jato, entre outros.
- **Dispositivos**: Ferramentas tecnológicas avançadas da Wayne Industries.

Esses dados são inseridos automaticamente para que você possa testar e utilizar o sistema de forma imediata.

### **Gerenciamento de Recursos**

Login/Recursos

A partir da página home.html, você pode navegar até resources.html, onde será possível gerenciar os equipamentos, veículos e dispositivos da Wayne Industries. Para acessar resources.html, é necessário que o usuário tenha as credenciais apropriadas, sendo validado por sua função (role).

⚠️ **Cofre Wayne**
Dentro de **resources.html**, há uma área exclusiva chamada **Cofre Wayne**, que contém informações sensíveis e só pode ser acessada pelo **CEO**, Bruce Wayne. Portanto, para acessar o **Cofre Wayne**, o usuário deve possuir as permissões necessárias para a função de CEO, o que será validado através de suas credenciais no sistema.

---

## **Acessando a Documentação da API**

Para verificar todas as rotas disponíveis na API, você pode acessar a documentação interativa gerada pelo FastAPI:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Redoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## **Estrutura do Projeto**

```plaintext
D:\Adm Joias\Documents\Everton\Projeto_Final_IN\
├───app
│   │   database.py
│   │   initial_data.py
│   │   main.py
│   │   models.py
│   │   schemas.py
│   │   utils.py
│   │   __init__.py
│   │
│   ├───assets
│   │
│   ├───crud
│   │   │   crud_device.py
│   │   │   crud_equipment.py
│   │   │   crud_vehicle.py
│   │   │   __init__.py
│   │   │
│   │   └───__pycache__
│   │           crud_device.cpython-312.pyc
│   │           crud_equipment.cpython-312.pyc
│   │           crud_vehicle.cpython-312.pyc
│   │           __init__.cpython-312.pyc
│   │
│   ├───routers
│   │   │   devices.py
│   │   │   equipments.py
│   │   │   users.py
│   │   │   vehicles.py
│   │   │   __init__.py
│   │   │
│   │   └───__pycache__
│   │           devices.cpython-312.pyc
│   │           equipments.cpython-312.pyc
│   │           users.cpython-312.pyc
│   │           vehicles.cpython-312.pyc
│   │           __init__.cpython-312.pyc
│   │
│   ├───utils
│   │   │   auth.py
│   │   │   password.py
│   │   │   __init__.py
│   │   │
│   │   └───__pycache__
│   │           auth.cpython-312.pyc
│   │           password.cpython-312.pyc
│   │           __init__.cpython-312.pyc
│   │
│   └───__pycache__
│           crud.cpython-312.pyc
│           database.cpython-312.pyc
│           initial_data.cpython-312.pyc
│           main.cpython-312.pyc
│           models.cpython-312.pyc
│           schemas.cpython-312.pyc
│           utils.cpython-312.pyc
│           __init__.cpython-312.pyc
│
├───pages
│   ├───css
│   │       admin.css
│   │       ArchiveSecret.css
│   │       devices.css
│   │       equipments.css
│   │       home.css
│   │       login.css
│   │       resources.css
│   │       styles.css
│   │       vehicles.css
│   │       wayne-vault.css
│   │
│   ├───js
│   │       dashboard-nav.js
│   │       devices.js
│   │       equipments.js
│   │       home.js
│   │       login.js
│   │       register.js
│   │       resources.js
│   │       script.js
│   │       vehicles.js
│   │       wayne-vault.js
│   │
│   └───templates
│           admin.html
│           ArchiveScretVillans.html
│           ArchiveSecretMetahumans.html
│           base.html
│           ceo_security_admin.html
│           dashboard.html
│           devices.html
│           equipments.html
│           home.html
│           index.html
│           login.html
│           manager.html
│           resources.html
│           vehicles.html
│           wayne-vault.html
│
├── venv\  # Ambiente virtual (não listado em requisições de estrutura)
├── requirements.txt  # Dependências do projeto

```

---

## **Configuração de Segurança**

Este projeto utiliza autenticação com JWT (JSON Web Tokens). A chave secreta (`SECRET_KEY`) é usada para assinar os tokens e garantir a segurança. Por padrão, o projeto inclui uma chave padrão:

```python
SECRET_KEY = "sua-chave-secreta"
```

**🚨 Recomendação:**
Substitua a chave padrão por uma chave forte e configure-a como variável de ambiente em produção.

---

## **Testes**

Use o **Postman**, **cURL**, ou outro cliente HTTP para testar as APIs:

1. Faça login com as credenciais padrão do CEO para obter o token JWT.
2. Use o token para acessar rotas protegidas, como `/dashboard` ou `/resources/equipments`.

---

## **Contribuições**

Se você quiser contribuir com este projeto, siga os passos abaixo:

1. Crie um fork do repositório.
2. Crie uma branch para suas alterações: `git checkout -b minha-branch`.
3. Faça o commit: `git commit -m 'Minhas alterações'`.
4. Envie suas alterações: `git push origin minha-branch`.
5. Abra um Pull Request.

---
