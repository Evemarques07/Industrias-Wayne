let requiredRoles = [];
let redirectUrl = "";

function openRestrictedModal(roles, url) {
  requiredRoles = roles;
  redirectUrl = url; // Armazena a URL para redirecionar após autenticação
  document.getElementById("restrictedModal").style.display = "block";
}

function closeModal() {
  document.getElementById("restrictedModal").style.display = "none";
  document.getElementById("restrictedError").textContent = "";
}

function showSuccessModal(message) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="document.body.removeChild(this.parentElement.parentElement)">&times;</span>
      <h2>Sucesso</h2>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(modal);
}

document
  .getElementById("restrictedLoginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("restrictedUsername").value;
    const password = document.getElementById("restrictedPassword").value;

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;

        // Verificar o papel do usuário
        const userResponse = await fetch("http://127.0.0.1:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const user = await userResponse.json();

          // Verificar se o papel do usuário está na lista de papéis permitidos
          if (requiredRoles.includes(user.role)) {
            showSuccessModal(`Acesso concedido ao ${user.role}!`);
            closeModal();
            // Redirecionar para a URL definida
            if (redirectUrl) {
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 2000);
            }
          } else {
            document.getElementById("restrictedError").textContent =
              "Você não tem permissão para acessar esta funcionalidade.";
            document.getElementById("restrictedError").style.display = "block";
          }
        } else {
          document.getElementById("restrictedError").textContent =
            "Erro ao validar o papel do usuário.";
          document.getElementById("restrictedError").style.display = "block";
        }
      } else {
        document.getElementById("restrictedError").textContent =
          "Login inválido.";
        document.getElementById("restrictedError").style.display = "block";
      }
    } catch (error) {
      console.error("Erro:", error);
      document.getElementById("restrictedError").textContent =
        "Erro ao conectar ao servidor.";
      document.getElementById("restrictedError").style.display = "block";
    }
  });
