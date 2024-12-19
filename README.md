Segue a documentação atualizada com as informações solicitadas, incluindo a inserção automática de veículos, equipamentos e dispositivos para melhorar o uso do projeto:

---

# **Wayne Industries - Sistema de Segurança**

Este é um sistema completo de gerenciamento de segurança, desenvolvido como projeto final. A aplicação é composta por um backend em **FastAPI**, um banco de dados **MySQL** e um frontend em **HTML/CSS**.

## **Funcionalidades**

- Gerenciamento de Usuários (com autenticação e autorização).
- Gerenciamento de Equipamentos, Veículos e Dispositivos de Segurança.
- Diferentes níveis de acesso: Funcionário, Gerente, Administrador de Segurança e CEO.
- **Dados automáticos**: Equipamentos, veículos e dispositivos de segurança já cadastrados para simulação e uso imediato.

---

## **Pré-requisitos**

Antes de começar, certifique-se de ter os seguintes programas instalados:

- **Python 3.9+**
- **MySQL**
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
uvicorn app.main:app --reload
```

Durante a inicialização, o projeto automaticamente insere:

- **Equipamentos**: Incluindo gadgets como Bat-Sinal, Bat-Garrafa e outros dispositivos tecnológicos.
- **Veículos**: Como Batmóvel, Bat-Jato, entre outros.
- **Dispositivos**: Ferramentas tecnológicas avançadas da Wayne Industries.

Esses dados são inseridos automaticamente para que você possa testar e utilizar o sistema de forma imediata.

---

## **Estrutura do Projeto**

```plaintext
D:\Adm Joias\Documents\Everton\Projeto_Final_IN\
├── app\
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── utils\
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── password.py
│   ├── routers\
│   │   ├── __init__.py
│   │   ├── users.py
│   │   ├── equipments.py
│   │   ├── vehicles.py
│   │   ├── devices.py
│   ├── templates\
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── equipments.html
│   │   ├── vehicles.html
│   │   ├── devices.html
│   └── __pycache__\  # Gerado automaticamente pelo Python
├── static\
│   ├── css\
│   │   ├── styles.css
│   ├── js\
│   │   ├── scripts.js
├── venv\  # Ambiente virtual (não listado em requisições de estrutura)
├── requirements.txt  # Dependências do projeto
```

---

## **Configuração de Segurança**

Este projeto utiliza autenticação com JWT (JSON Web Tokens). A chave secreta (`SECRET_KEY`) é usada para assinar os tokens e garantir a segurança. Por padrão, o projeto inclui uma chave padrão:

```python
SECRET_KEY = "default-secret-key"
```

**🚨 Recomendação:**
Substitua a chave padrão por uma chave forte e configure-a como variável de ambiente em produção.

---

## **Testes**

Use o **Postman**, **cURL**, ou outro cliente HTTP para testar as APIs:

1. Faça login com as credenciais padrão para obter o token JWT.
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

Com essas atualizações, a documentação reflete melhor o estado atual do projeto e as funcionalidades automáticas. Se precisar ajustar algo mais, é só avisar! 🚀
