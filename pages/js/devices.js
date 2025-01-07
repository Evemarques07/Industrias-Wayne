document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const DEVICES_API_URL = "http://127.0.0.1:8000/devices/";

  if (!token) {
    window.location.href = "login.html";
  }
  const addDeviceForm = document.querySelector(".add-device-form");
  addDeviceForm.addEventListener("submit", handleAddDevice);
  getDevices();

  document.querySelector("#back-button").addEventListener("click", () => {
    window.location.href = "resources.html";
  });

  async function getDevices() {
    const devicesListDiv = document.querySelector("#devices-list");
    devicesListDiv.innerHTML =
      '<div class="device-card-loading">Carregando dispositivos...</div>';
    try {
      const response = await fetch(DEVICES_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        displayDevices(data);
      } else {
        console.error("Erro ao buscar dispositivos:", response.statusText);
        devicesListDiv.innerHTML =
          '<div class="device-card-loading">Erro ao carregar dispositivos.</div>';
        alert("Ocorreu um erro ao buscar os dispositivos.");
      }
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
      devicesListDiv.innerHTML =
        '<div class="device-card-loading">Erro ao carregar dispositivos.</div>';
      alert("Ocorreu um erro ao buscar os dispositivos.");
    }
  }

  function displayDevices(devices) {
    const devicesListDiv = document.querySelector("#devices-list");
    devicesListDiv.innerHTML = ""; // Limpa o conteúdo anterior
    devices.forEach((device) => {
      const deviceCard = document.createElement("div");
      deviceCard.classList.add("device-card");
      deviceCard.dataset.deviceId = device.id; // Armazena o ID do dispositivo

      deviceCard.innerHTML = `
              <img src="${device.image_url}" alt="${device.name}">
              <h3>${device.name}</h3>
              <p>${device.description}</p>
              <div class="crud-buttons">
                   <button class="edit-button">Editar</button>
                  <button class="delete-button">Excluir</button>
             </div>
          `;
      devicesListDiv.appendChild(deviceCard);

      // Event listeners para editar e excluir
      const editButton = deviceCard.querySelector(".edit-button");
      const deleteButton = deviceCard.querySelector(".delete-button");

      editButton.addEventListener("click", () =>
        handleEditDevice(device.id, deviceCard)
      );
      deleteButton.addEventListener("click", () =>
        handleDeleteDevice(device.id)
      );
    });
  }

  async function handleAddDevice(event) {
    event.preventDefault();
    const addDeviceForm = document.querySelector(".add-device-form");
    const formData = new FormData(addDeviceForm);
    const deviceData = {
      name: formData.get("name"),
      description: formData.get("description"),
      image_url: formData.get("image_url"),
    };

    try {
      const response = await fetch(DEVICES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deviceData),
      });

      if (response.ok) {
        alert("Dispositivo adicionado com sucesso!");
        addDeviceForm.reset(); // Limpa os campos do formulário
        getDevices(); // Atualiza a lista de dispositivos
      } else {
        console.error("Erro ao adicionar dispositivo:", response.statusText);
        alert("Ocorreu um erro ao adicionar o dispositivo.");
      }
    } catch (error) {
      console.error("Erro ao adicionar dispositivo:", error);
      alert("Ocorreu um erro ao adicionar o dispositivo.");
    }
  }

  async function handleEditDevice(deviceId, deviceCard) {
    // Verifica se já há um formulário de edição aberto
    const existingEditForm = deviceCard.querySelector(".edit-device-form");
    if (existingEditForm) {
      existingEditForm.remove(); // Se sim, remove
      return;
    }

    // Se não houver, cria o formulário de edição
    const editForm = document.createElement("form");
    editForm.classList.add("edit-device-form");
    editForm.innerHTML = `
          <input type="text" name="name" placeholder="Nome" required>
          <textarea name="description" placeholder="Descrição" required></textarea>
          <input type="text" name="image_url" placeholder="URL da Imagem" required>
           <div class="crud-buttons">
             <button type="submit" class="save-button">Salvar</button>
             <button type="button" class="cancel-button">Cancelar</button>
           </div>

      `;
    deviceCard.appendChild(editForm);

    // Adiciona os valores atuais do dispositivo ao formulário para edição
    const device = getDeviceFromCard(deviceCard);
    editForm.name.value = device.name;
    editForm.description.value = device.description;
    editForm.image_url.value = device.image_url;

    const saveButton = editForm.querySelector(".save-button");
    const cancelButton = editForm.querySelector(".cancel-button");

    cancelButton.addEventListener("click", () => {
      editForm.remove();
    });
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(editForm);
      const deviceData = {
        name: formData.get("name"),
        description: formData.get("description"),
        image_url: formData.get("image_url"),
      };

      try {
        const response = await fetch(`${DEVICES_API_URL}${deviceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(deviceData),
        });

        if (response.ok) {
          alert("Dispositivo atualizado com sucesso!");
          getDevices();
        } else {
          console.error("Erro ao atualizar dispositivo:", response.statusText);
          alert("Ocorreu um erro ao atualizar o dispositivo.");
        }
      } catch (error) {
        console.error("Erro ao atualizar dispositivo:", error);
        alert("Ocorreu um erro ao atualizar o dispositivo.");
      }
      editForm.remove();
    });
  }

  async function handleDeleteDevice(deviceId) {
    if (confirm("Tem certeza que deseja excluir este dispositivo?")) {
      try {
        const response = await fetch(`${DEVICES_API_URL}${deviceId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Dispositivo excluído com sucesso!");
          getDevices(); // Atualiza a lista de dispositivos
        } else {
          console.error("Erro ao excluir dispositivo:", response.statusText);
          alert("Ocorreu um erro ao excluir o dispositivo.");
        }
      } catch (error) {
        console.error("Erro ao excluir dispositivo:", error);
        alert("Ocorreu um erro ao excluir o dispositivo.");
      }
    }
  }

  function getDeviceFromCard(deviceCard) {
    const device = {
      name: deviceCard.querySelector("h3").textContent,
      description: deviceCard.querySelector("p").textContent,
      image_url: deviceCard.querySelector("img").getAttribute("src"),
    };

    return device;
  }
});
