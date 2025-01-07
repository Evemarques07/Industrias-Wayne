document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const VEHICLES_API_URL = "http://127.0.0.1:8000/vehicles/";

  if (!token) {
    window.location.href = "login.html";
  }
  const addVehicleForm = document.querySelector(".add-vehicle-form");
  addVehicleForm.addEventListener("submit", handleAddVehicle);
  getVehicles();

  document.querySelector("#back-button").addEventListener("click", () => {
    window.location.href = "resources.html";
  });

  async function getVehicles() {
    const vehiclesListDiv = document.querySelector("#vehicles-list");
    vehiclesListDiv.innerHTML =
      '<div class="vehicle-card-loading">Carregando veículos...</div>';
    try {
      const response = await fetch(VEHICLES_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        displayVehicles(data);
      } else {
        console.error("Erro ao buscar veículos:", response.statusText);
        vehiclesListDiv.innerHTML =
          '<div class="vehicle-card-loading">Erro ao carregar veículos.</div>';
        alert("Ocorreu um erro ao buscar os veículos.");
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      vehiclesListDiv.innerHTML =
        '<div class="vehicle-card-loading">Erro ao carregar veículos.</div>';
      alert("Ocorreu um erro ao buscar os veículos.");
    }
  }

  function displayVehicles(vehicles) {
    const vehiclesListDiv = document.querySelector("#vehicles-list");
    vehiclesListDiv.innerHTML = ""; // Limpa o conteúdo anterior
    vehicles.forEach((vehicle) => {
      const vehicleCard = document.createElement("div");
      vehicleCard.classList.add("vehicle-card");
      vehicleCard.dataset.vehicleId = vehicle.id; // Armazena o ID do veículo

      vehicleCard.innerHTML = `
              <img src="${vehicle.image_url}" alt="${vehicle.name}">
              <h3>${vehicle.name}</h3>
              <p>${vehicle.description}</p>
               <div class="crud-buttons">
                   <button class="edit-button">Editar</button>
                  <button class="delete-button">Excluir</button>
             </div>
          `;
      vehiclesListDiv.appendChild(vehicleCard);

      // Event listeners para editar e excluir
      const editButton = vehicleCard.querySelector(".edit-button");
      const deleteButton = vehicleCard.querySelector(".delete-button");

      editButton.addEventListener("click", () =>
        handleEditVehicle(vehicle.id, vehicleCard)
      );
      deleteButton.addEventListener("click", () =>
        handleDeleteVehicle(vehicle.id)
      );
    });
  }

  async function handleAddVehicle(event) {
    event.preventDefault();
    const addVehicleForm = document.querySelector(".add-vehicle-form");
    const formData = new FormData(addVehicleForm);
    const vehicleData = {
      name: formData.get("name"),
      description: formData.get("description"),
      image_url: formData.get("image_url"),
    };

    try {
      const response = await fetch(VEHICLES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        alert("Veículo adicionado com sucesso!");
        addVehicleForm.reset(); // Limpa os campos do formulário
        getVehicles(); // Atualiza a lista de veículos
      } else {
        console.error("Erro ao adicionar veículo:", response.statusText);
        alert("Ocorreu um erro ao adicionar o veículo.");
      }
    } catch (error) {
      console.error("Erro ao adicionar veículo:", error);
      alert("Ocorreu um erro ao adicionar o veículo.");
    }
  }

  async function handleEditVehicle(vehicleId, vehicleCard) {
    // Verifica se já há um formulário de edição aberto
    const existingEditForm = vehicleCard.querySelector(".edit-vehicle-form");
    if (existingEditForm) {
      existingEditForm.remove(); // Se sim, remove
      return;
    }

    // Se não houver, cria o formulário de edição
    const editForm = document.createElement("form");
    editForm.classList.add("edit-vehicle-form");
    editForm.innerHTML = `
          <input type="text" name="name" placeholder="Nome" required>
          <textarea name="description" placeholder="Descrição" required></textarea>
          <input type="text" name="image_url" placeholder="URL da Imagem" required>
           <div class="crud-buttons">
             <button type="submit" class="save-button">Salvar</button>
             <button type="button" class="cancel-button">Cancelar</button>
           </div>

      `;
    vehicleCard.appendChild(editForm);

    // Adiciona os valores atuais do veículo ao formulário para edição
    const vehicle = getVehicleFromCard(vehicleCard);
    editForm.name.value = vehicle.name;
    editForm.description.value = vehicle.description;
    editForm.image_url.value = vehicle.image_url;

    const saveButton = editForm.querySelector(".save-button");
    const cancelButton = editForm.querySelector(".cancel-button");

    cancelButton.addEventListener("click", () => {
      editForm.remove();
    });
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(editForm);
      const vehicleData = {
        name: formData.get("name"),
        description: formData.get("description"),
        image_url: formData.get("image_url"),
      };

      try {
        const response = await fetch(`${VEHICLES_API_URL}${vehicleId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(vehicleData),
        });

        if (response.ok) {
          alert("Veículo atualizado com sucesso!");
          getVehicles();
        } else {
          console.error("Erro ao atualizar veículo:", response.statusText);
          alert("Ocorreu um erro ao atualizar o veículo.");
        }
      } catch (error) {
        console.error("Erro ao atualizar veículo:", error);
        alert("Ocorreu um erro ao atualizar o veículo.");
      }
      editForm.remove();
    });
  }

  async function handleDeleteVehicle(vehicleId) {
    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      try {
        const response = await fetch(`${VEHICLES_API_URL}${vehicleId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Veículo excluído com sucesso!");
          getVehicles(); // Atualiza a lista de veículos
        } else {
          console.error("Erro ao excluir veículo:", response.statusText);
          alert("Ocorreu um erro ao excluir o veículo.");
        }
      } catch (error) {
        console.error("Erro ao excluir veículo:", error);
        alert("Ocorreu um erro ao excluir o veículo.");
      }
    }
  }

  function getVehicleFromCard(vehicleCard) {
    const vehicle = {
      name: vehicleCard.querySelector("h3").textContent,
      description: vehicleCard.querySelector("p").textContent,
      image_url: vehicleCard.querySelector("img").getAttribute("src"),
    };
    return vehicle;
  }
});
