const API_URL = "http://127.0.0.1:8000/users/login";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#login-form");
  const errorMessage = document.querySelector("#error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        window.location.href = "home.html";
      } else {
        const data = await response.json();
        errorMessage.textContent = data.detail;
        console.error(data.detail);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      errorMessage.textContent = "Ocorreu um erro ao fazer o login";
    }
  });
});
