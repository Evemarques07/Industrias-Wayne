document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const EQUIPMENTS_API_URL = "http://127.0.0.1:8000/equipments/";

  if (!token) {
    window.location.href = "login.html";
  }
  const addEquipmentForm = document.querySelector(".add-equipment-form");
  addEquipmentForm.addEventListener("submit", handleAddEquipment);
  getEquipments();

  document.querySelector("#back-button").addEventListener("click", () => {
    window.location.href = "resources.html";
  });

  async function getEquipments() {
    const equipmentsListDiv = document.querySelector("#equipments-list");
    equipmentsListDiv.innerHTML =
      '<div class="equipment-card-loading">Carregando equipamentos...</div>';
    try {
      const response = await fetch(EQUIPMENTS_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        displayEquipments(data);
      } else {
        console.error("Erro ao buscar equipamentos:", response.statusText);
        equipmentsListDiv.innerHTML =
          '<div class="equipment-card-loading">Erro ao carregar equipamentos.</div>';
        alert("Ocorreu um erro ao buscar os equipamentos.");
      }
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
      equipmentsListDiv.innerHTML =
        '<div class="equipment-card-loading">Erro ao carregar equipamentos.</div>';
      alert("Ocorreu um erro ao buscar os equipamentos.");
    }
  }

  function displayEquipments(equipments) {
    const equipmentsListDiv = document.querySelector("#equipments-list");
    equipmentsListDiv.innerHTML = ""; // Limpa o conteúdo anterior

    equipments.forEach((equipment) => {
      const equipmentCard = document.createElement("div");
      equipmentCard.classList.add("equipment-card");
      equipmentCard.dataset.equipmentId = equipment.id; // Armazena o ID do equipamento

      equipmentCard.innerHTML = `
              <img src="${equipment.image_url}" alt="${equipment.name}">
              <h3>${equipment.name}</h3>
              <p>${equipment.description}</p>
              <div class="crud-buttons">
                   <button class="edit-button">Editar</button>
                  <button class="delete-button">Excluir</button>
             </div>
          `;
      equipmentsListDiv.appendChild(equipmentCard);

      // Event listeners para editar e excluir
      const editButton = equipmentCard.querySelector(".edit-button");
      const deleteButton = equipmentCard.querySelector(".delete-button");

      editButton.addEventListener("click", () =>
        handleEditEquipment(equipment.id, equipmentCard)
      );
      deleteButton.addEventListener("click", () =>
        handleDeleteEquipment(equipment.id)
      );
    });
  }

  async function handleAddEquipment(event) {
    event.preventDefault();
    const addEquipmentForm = document.querySelector(".add-equipment-form");
    const formData = new FormData(addEquipmentForm);
    const equipmentData = {
      name: formData.get("name"),
      description: formData.get("description"),
      image_url: formData.get("image_url"),
    };

    try {
      const response = await fetch(EQUIPMENTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(equipmentData),
      });

      if (response.ok) {
        alert("Equipamento adicionado com sucesso!");
        addEquipmentForm.reset(); // Limpa os campos do formulário
        getEquipments(); // Atualiza a lista de equipamentos
      } else {
        console.error("Erro ao adicionar equipamento:", response.statusText);
        alert("Ocorreu um erro ao adicionar o equipamento.");
      }
    } catch (error) {
      console.error("Erro ao adicionar equipamento:", error);
      alert("Ocorreu um erro ao adicionar o equipamento.");
    }
  }

  async function handleEditEquipment(equipmentId, equipmentCard) {
    // Verifica se já há um formulário de edição aberto
    const existingEditForm = equipmentCard.querySelector(
      ".edit-equipment-form"
    );
    if (existingEditForm) {
      existingEditForm.remove(); // Se sim, remove
      return;
    }

    // Se não houver, cria o formulário de edição
    const editForm = document.createElement("form");
    editForm.classList.add("edit-equipment-form");
    editForm.innerHTML = `
          <input type="text" name="name" placeholder="Nome" required>
          <textarea name="description" placeholder="Descrição" required></textarea>
          <input type="text" name="image_url" placeholder="URL da Imagem" required>
           <div class="crud-buttons">
             <button type="submit" class="save-button">Salvar</button>
             <button type="button" class="cancel-button">Cancelar</button>
           </div>

      `;
    equipmentCard.appendChild(editForm);

    // Adiciona os valores atuais do equipamento ao formulário para edição
    const equipment = getEquipmentFromCard(equipmentCard);
    editForm.name.value = equipment.name;
    editForm.description.value = equipment.description;
    editForm.image_url.value = equipment.image_url;

    const saveButton = editForm.querySelector(".save-button");
    const cancelButton = editForm.querySelector(".cancel-button");

    cancelButton.addEventListener("click", () => {
      editForm.remove();
    });
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(editForm);
      const equipmentData = {
        name: formData.get("name"),
        description: formData.get("description"),
        image_url: formData.get("image_url"),
      };

      try {
        const response = await fetch(`${EQUIPMENTS_API_URL}${equipmentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(equipmentData),
        });

        if (response.ok) {
          alert("Equipamento atualizado com sucesso!");
          getEquipments();
        } else {
          console.error("Erro ao atualizar equipamento:", response.statusText);
          alert("Ocorreu um erro ao atualizar o equipamento.");
        }
      } catch (error) {
        console.error("Erro ao atualizar equipamento:", error);
        alert("Ocorreu um erro ao atualizar o equipamento.");
      }
      editForm.remove();
    });
  }

  async function handleDeleteEquipment(equipmentId) {
    if (confirm("Tem certeza que deseja excluir este equipamento?")) {
      try {
        const response = await fetch(`${EQUIPMENTS_API_URL}${equipmentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Equipamento excluído com sucesso!");
          getEquipments(); // Atualiza a lista de equipamentos
        } else {
          console.error("Erro ao excluir equipamento:", response.statusText);
          alert("Ocorreu um erro ao excluir o equipamento.");
        }
      } catch (error) {
        console.error("Erro ao excluir equipamento:", error);
        alert("Ocorreu um erro ao excluir o equipamento.");
      }
    }
  }

  function getEquipmentFromCard(equipmentCard) {
    const equipment = {
      name: equipmentCard.querySelector("h3").textContent,
      description: equipmentCard.querySelector("p").textContent,
      image_url: equipmentCard.querySelector("img").getAttribute("src"),
    };

    return equipment;
  }
});
