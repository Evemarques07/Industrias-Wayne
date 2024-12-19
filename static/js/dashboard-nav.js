document.addEventListener("DOMContentLoaded", function () {
  async function fetchUserRole() {
    const token = localStorage.getItem("access_token");
    console.log("fetchUserRole: Token do localStorage:", token);
    try {
      const response = await fetch("/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("fetchUserRole: Resposta da API /users/me:", response);
      if (response.ok) {
        const data = await response.json();
        console.log("fetchUserRole: Role do usuário:", data.role);
        return data.role;
      } else {
        console.error(
          "fetchUserRole: Erro ao buscar detalhes do usuário:",
          await response.text()
        );
        localStorage.removeItem("access_token");
        window.location.href = "/";
      }
    } catch (error) {
      console.error(
        "fetchUserRole: Erro ao buscar detalhes do usuário:",
        error
      );
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
    return null;
  }

  async function setupNavigationLinks() {
    const role = await fetchUserRole();
    console.log("setupNavigationLinks: Role obtida:", role);
    if (role) {
      const navLinks = document.querySelectorAll(".nav-div");
      navLinks.forEach((link) => {
        const route = link.getAttribute("data-route");
        console.log(`setupNavigationLinks: Verificando link para ${route}`);

        if (route === "/admin-only" && ["admin", "ceo"].includes(role)) {
          link.style.display = "block";
          console.log(`setupNavigationLinks: Exibindo link para ${route}`);
        }
        if (
          route === "/manager-or-above" &&
          ["manager", "admin", "ceo"].includes(role)
        ) {
          link.style.display = "block";
          console.log(`setupNavigationLinks: Exibindo link para ${route}`);
        }
        if (
          route === "/ceo-and-security-admin" &&
          ["ceo", "security_admin"].includes(role)
        ) {
          link.style.display = "block";
          console.log(`setupNavigationLinks: Exibindo link para ${route}`);
        }
        if (
          route === "/resources" &&
          ["ceo", "security_admin"].includes(role)
        ) {
          link.style.display = "block";
          console.log(`setupNavigationLinks: Exibindo link para ${route}`);
        }
        if (
          route === "/" &&
          ["ceo", "employee", "manager", "security_admin", "admin"].includes(
            role
          )
        ) {
          link.style.display = "block";
          console.log(`setupNavigationLinks: Exibindo link para ${route}`);
        }
      });
    } else {
      console.log("setupNavigationLinks: Role não encontrada.");
    }
  }

  setupNavigationLinks();

  const navLinks = document.querySelectorAll("nav div[data-route]");

  navLinks.forEach((link) => {
    link.addEventListener("click", async function (event) {
      event.preventDefault();
      const route = this.getAttribute("data-route");
      await loadPage(route);
    });
  });

  const logoutLink = document.getElementById("logout-link");

  logoutLink.addEventListener("click", function (event) {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  });

  async function loadPage(route) {
    console.log("loadPage: Iniciando carregamento da página:", route);
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(route, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`loadPage: Resposta da requisição para ${route}:`, response);

      if (response.ok) {
        const html = await response.text();
        document.body.innerHTML = html; // Substituir o conteúdo do body com o html da pagina
        window.history.pushState({}, "", route);
        console.log(`loadPage: Página ${route} carregada com sucesso`);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("access_token");
        window.location.href = "/";
        console.log(
          `loadPage: Erro ${response.status} ao carregar página ${route}`
        );
      } else {
        console.error("loadPage: Erro ao carregar página:", response);
        localStorage.removeItem("access_token");
        window.location.href = "/";
      }
    } catch (error) {
      localStorage.removeItem("access_token");
      console.error("loadPage: Erro ao carregar página:", error);
      window.location.href = "/";
    }
  }
});
