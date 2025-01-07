document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const REGISTER_API_URL = "http://127.0.0.1:8000/users/";
  const ME_API_URL = "http://127.0.0.1:8000/users/me";

  const form = document.querySelector("#register-form");
  const errorMessage = document.querySelector("#error-message");

  if (!token) {
    window.location.href = "login.html";
  }

  getCurrentUser();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const role = document.querySelector("#role").value;

    const userData = {
      username,
      password,
      role,
    };

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        form.reset();
      } else {
        const data = await response.json();
        errorMessage.textContent = data.detail;
        console.error(data.detail);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      errorMessage.textContent = "Ocorreu um erro ao cadastrar o usuário";
    }
  });

  document.querySelector("#back-button").addEventListener("click", () => {
    window.location.href = "home.html";
  });

  async function getCurrentUser() {
    try {
      const response = await fetch(ME_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        document.querySelector("#current-user-id").textContent = data.id;
        document.querySelector("#current-user-username").textContent =
          data.username;
        document.querySelector("#current-user-role").textContent = data.role;
      } else {
        console.error(
          "Erro ao buscar informações do usuário logado:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar informações do usuário logado:", error);
    }
  }
});
