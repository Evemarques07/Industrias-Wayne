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

document.getElementById("logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("token");
  document.querySelector(".login-section").style.display = "block";
  document.getElementById("dashboard").style.display = "flex";
});
