document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const EQUIPMENTS_URL = "http://127.0.0.1:8000/resources/equipments";
  const VEHICLES_URL = "http://127.0.0.1:8000/resources/vehicles";
  const DEVICES_URL = "http://127.0.0.1:8000/resources/devices";
  const WAYNE_VAULT_URL = "http://127.0.0.1:8000/resources/wayne-vault";

  if (!token) {
    window.location.href = "login.html";
  }

  // Event listeners para os botões de navegação
  document
    .querySelector("#equipments-button")
    .addEventListener("click", () =>
      navigateByRole(EQUIPMENTS_URL, "equipments.html")
    );
  document
    .querySelector("#vehicles-button")
    .addEventListener("click", () =>
      navigateByRole(VEHICLES_URL, "vehicles.html")
    );
  document
    .querySelector("#devices-button")
    .addEventListener("click", () =>
      navigateByRole(DEVICES_URL, "devices.html")
    );
  document
    .querySelector("#wayne-vault-button")
    .addEventListener("click", () =>
      navigateByRole(WAYNE_VAULT_URL, "wayne-vault.html")
    );

  document.querySelector("#back-button").addEventListener("click", () => {
    window.location.href = "home.html";
  });

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
});
