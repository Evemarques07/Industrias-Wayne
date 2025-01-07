document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const ADMIN_URL = "http://127.0.0.1:8000/admin-only";
  const CEO_SECURITY_ADMIN_URL = "http://127.0.0.1:8000/ceo-and-security-admin";
  const MANAGER_URL = "http://127.0.0.1:8000/manager-or-above";
  const RESOURCES_URL = "http://127.0.0.1:8000/resources";
  const DASHBOARD_URL = "http://127.0.0.1:8000/dashboard-data";

  if (!token) {
    window.location.href = "login.html";
  } else {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      document.querySelector("#username-display").textContent = payload.sub;
      document.querySelector("#role-display").textContent = payload.role;

      getDashboardData(); // Busca os dados do dashboard

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
      async function getDashboardData() {
        try {
          const response = await fetch(DASHBOARD_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            displayDashboardData(data);
          } else {
            console.error(
              "Erro ao buscar informações do dashboard:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Erro ao buscar informações do dashboard:", error);
        }
      }
      function displayDashboardData(data) {
        // Exibe o total de usuários por role
        const totalUsersDiv = document.querySelector("#total-users");
        totalUsersDiv.innerHTML = "";
        data.dashboard.total_users.forEach((user) => {
          const card = document.createElement("div");
          card.classList.add("data-card");
          card.innerHTML = `
               <h4>${user.role}</h4>
               <p>${user.total}</p>
          `;
          totalUsersDiv.appendChild(card);
        });

        // Exibe o total de equipamentos
        const totalEquipmentsDiv = document.querySelector("#total-equipments");
        totalEquipmentsDiv.innerHTML = `<p>${data.dashboard.total_equipments}</p>`;
        // Exibe o total de dispositivos
        const totalDevicesDiv = document.querySelector("#total-devices");
        totalDevicesDiv.innerHTML = `<p>${data.dashboard.total_devices}</p>`;
        // Exibe o total de veículos
        const totalVehiclesDiv = document.querySelector("#total-vehicles");
        totalVehiclesDiv.innerHTML = `<p>${data.dashboard.total_vehicles}</p>`;

        // Exibe os usuários recentes
        const recentUsersDiv = document.querySelector("#recent-users");
        recentUsersDiv.innerHTML = "";
        data.dashboard.recent_users.forEach((user) => {
          const card = document.createElement("div");
          card.classList.add("data-card");
          card.innerHTML = `
                <h4>${user.username}</h4>
                 <p class="description">${user.role}</p>
            `;
          recentUsersDiv.appendChild(card);
        });
        const recentEquipmentsDiv =
          document.querySelector("#recent-equipments");
        recentEquipmentsDiv.innerHTML = "";
        data.dashboard.recent_equipments.forEach((equipment) => {
          const card = document.createElement("div");
          card.classList.add("data-card");
          card.innerHTML = `
                <h4>${equipment.name}</h4>
                <p class="description">${equipment.description}</p>
                `;
          recentEquipmentsDiv.appendChild(card);
        });
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  }
});
