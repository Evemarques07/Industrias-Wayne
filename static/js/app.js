// Verifica o estado de login ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");

  if (token) {
    // Se o usuário está autenticado, mostra o dashboard
    document.querySelector(".login-section").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
  } else {
    // Caso contrário, mostra a tela de login
    document.querySelector(".login-section").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  }
});

// Lógica de login
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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
        sessionStorage.setItem("token", data.access_token);

        // Esconde a tela de login e mostra o dashboard
        document.querySelector(".login-section").style.display = "none";
        document.getElementById("dashboard").style.display = "flex";
      } else {
        document.getElementById("loginError").textContent =
          "Login falhou. Verifique suas credenciais.";
        document.getElementById("loginError").style.display = "block";
      }
    } catch (error) {
      console.error("Erro:", error);
      document.getElementById("loginError").textContent =
        "Erro ao conectar ao servidor.";
      document.getElementById("loginError").style.display = "block";
    }
  });

// Lógica de logout
document.getElementById("logoutButton").addEventListener("click", () => {
  // Remove o token e volta para a tela de login
  sessionStorage.removeItem("token");
  document.querySelector(".login-section").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
});

// Adiciona event listeners para os links do dashboard
document.querySelectorAll(".dashboard-cards .card a").forEach((link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Você precisa fazer login para acessar esta página.");
      return;
    }

    const href = event.target.getAttribute("href");

    try {
      const response = await fetch(`http://127.0.0.1:8000${href}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const html = await response.text();
        document.body.innerHTML = html; // Renderiza a página retornada
      } else if (response.status === 403) {
        alert("Você não tem permissão para acessar esta página.");
      } else {
        alert("Erro ao acessar a página.");
      }
    } catch (error) {
      console.error("Erro ao acessar a rota protegida:", error);
    }
  });
});
