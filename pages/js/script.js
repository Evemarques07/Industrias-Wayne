document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Armazenar o token JWT (por exemplo, no localStorage)
          localStorage.setItem("access_token", data.access_token);
          window.location.href = "/"; // Redirecionar para a página inicial ou dashboard
        } else {
          errorMessage.textContent =
            data.detail || "Falha no login. Verifique suas credenciais.";
        }
      } catch (error) {
        console.error("Erro durante o login:", error);
        errorMessage.textContent = "Erro ao conectar com o servidor.";
      }
    });
  }

  // Funções para adicionar o token a outras requisições (exemplo)
  async function fetchDataWithToken(url) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login";
      return null; // Redirecionar para o login se não houver token
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = "/login";
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data with token:", error);
      throw error;
    }
  }

  // Adicionando um listener para carregar o conteúdo depois de carregar o dom
  const dashboardLink = document.querySelector('a[href="/dashboard-data"]');
  if (dashboardLink) {
    dashboardLink.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const dashboardData = await fetchDataWithToken("/dashboard-data");
        if (dashboardData) {
          alert(
            `Bem-vindo, ${dashboardData.username}! Seu papel é: ${dashboardData.role}`
          );
        }
      } catch (error) {
        alert("Erro ao carregar o dashboard.");
      }
    });
  }

  const adminLink = document.querySelector('a[href="/admin-only"]');
  if (adminLink) {
    adminLink.addEventListener("click", async (event) => {
      event.preventDefault();
      window.location.href = "/admin-only";
    });
  }
  const managerLink = document.querySelector('a[href="/manager-or-above"]');
  if (managerLink) {
    managerLink.addEventListener("click", async (event) => {
      event.preventDefault();
      window.location.href = "/manager-or-above";
    });
  }
  const ceoSecurityLink = document.querySelector(
    'a[href="/ceo-and-security-admin"]'
  );
  if (ceoSecurityLink) {
    ceoSecurityLink.addEventListener("click", async (event) => {
      event.preventDefault();
      window.location.href = "/ceo-and-security-admin";
    });
  }

  const resourcesLink = document.querySelector('a[href="/resources"]');
  if (resourcesLink) {
    resourcesLink.addEventListener("click", async (event) => {
      event.preventDefault();
      window.location.href = "/resources";
    });
  }
});
