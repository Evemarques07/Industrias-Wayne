document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const ADMIN_URL = "http://127.0.0.1:8000/admin-only";
  const CEO_SECURITY_ADMIN_URL = "http://127.0.0.1:8000/ceo-and-security-admin";
  const MANAGER_URL = "http://127.0.0.1:8000/manager-or-above";
  const RESOURCES_URL = "http://127.0.0.1:8000/resources";

  if (!token) {
    window.location.href = "login.html";
  } else {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      document.querySelector("#username-display").textContent = payload.sub;
      document.querySelector("#role-display").textContent = payload.role;

      document.querySelector("#logout-button").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });

      // Event listeners para os botões de navegação
      document
        .querySelector("#admin-button")
        .addEventListener("click", () =>
          navigateByRole(ADMIN_URL, "admin.html")
        );
      document
        .querySelector("#ceo-security-admin-button")
        .addEventListener("click", () =>
          navigateByRole(CEO_SECURITY_ADMIN_URL, "ceo_security_admin.html")
        );
      document
        .querySelector("#manager-button")
        .addEventListener("click", () =>
          navigateByRole(MANAGER_URL, "manager.html")
        );
      document
        .querySelector("#resources-button")
        .addEventListener("click", () =>
          navigateByRole(RESOURCES_URL, "resources.html")
        );

      // Função para verificar o role e redirecionar
      async function navigateByRole(url, redirectUrl) {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            window.location.href = redirectUrl;
          } else {
            alert("Você não tem permissão para acessar essa página.");
            console.error("Erro ao verificar role:", response.statusText);
          }
        } catch (error) {
          console.error("Erro ao verificar role:", error);
          alert("Ocorreu um erro ao verificar a permissão.");
        }
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  }
});
