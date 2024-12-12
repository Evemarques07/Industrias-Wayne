const apiUrl = "http://127.0.0.1:8000/equipments";

async function fetchEquipments() {
  const response = await fetch(apiUrl);
  const equipments = await response.json();

  const equipmentList = document.getElementById("equipments");
  equipmentList.innerHTML = "";

  equipments.forEach((equipment) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${equipment.name}</h3>
      <p>${equipment.description}</p>
      <img src="${equipment.image_url}" alt="${equipment.name}" width="200" />
      <button onclick="editEquipment(${equipment.id}, '${equipment.name}', '${equipment.description}', '${equipment.image_url}')">Editar</button>
      <button onclick="deleteEquipment(${equipment.id})">Excluir</button>
    `;
    equipmentList.appendChild(li);
  });
}

async function addEquipment(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const image_url = document.getElementById("image_url").value;

  await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, image_url }),
  });

  document.getElementById("equipmentForm").reset();
  fetchEquipments();
}

async function deleteEquipment(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchEquipments();
}

function editEquipment(id, name, description, image_url) {
  // Exibir o formulário de edição
  document.getElementById("editEquipment").style.display = "block";
  document.getElementById("addEquipment").style.display = "none";

  // Preencher os campos do formulário com os dados do equipamento
  document.getElementById("edit_id").value = id;
  document.getElementById("edit_name").value = name;
  document.getElementById("edit_description").value = description;
  document.getElementById("edit_image_url").value = image_url;
}

async function saveEditedEquipment(event) {
  event.preventDefault();

  const id = document.getElementById("edit_id").value;
  const name = document.getElementById("edit_name").value;
  const description = document.getElementById("edit_description").value;
  const image_url = document.getElementById("edit_image_url").value;

  await fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description, image_url }),
  });

  // Ocultar o formulário de edição e exibir o formulário de adição
  document.getElementById("editEquipment").style.display = "none";
  document.getElementById("addEquipment").style.display = "block";

  fetchEquipments();
}

function cancelEdit() {
  // Ocultar o formulário de edição e exibir o formulário de adição
  document.getElementById("editEquipment").style.display = "none";
  document.getElementById("addEquipment").style.display = "block";
}

document
  .getElementById("equipmentForm")
  .addEventListener("submit", addEquipment);

document
  .getElementById("editEquipmentForm")
  .addEventListener("submit", saveEditedEquipment);

fetchEquipments();
