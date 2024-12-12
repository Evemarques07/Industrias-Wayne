const apiUrl = "http://127.0.0.1:8000/vehicles";

async function fetchVehicles() {
  const response = await fetch(apiUrl);
  const vehicles = await response.json();

  const vehicleList = document.getElementById("vehicles");
  vehicleList.innerHTML = "";

  vehicles.forEach((vehicle) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${vehicle.name}</h3>
      <p>${vehicle.description}</p>
      <img src="${vehicle.image_url}" alt="${vehicle.name}" width="200" />
      <button onclick="editVehicle(${vehicle.id}, '${vehicle.name}', '${vehicle.description}', '${vehicle.image_url}')">Editar</button>
      <button onclick="deleteVehicle(${vehicle.id})">Excluir</button>
    `;
    vehicleList.appendChild(li);
  });
}

async function addVehicle(event) {
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

  document.getElementById("vehicleForm").reset();
  fetchVehicles();
}

function editVehicle(id, name, description, image_url) {
  document.getElementById("editVehicle").style.display = "block";
  document.getElementById("addVehicle").style.display = "none";

  document.getElementById("edit_id").value = id;
  document.getElementById("edit_name").value = name;
  document.getElementById("edit_description").value = description;
  document.getElementById("edit_image_url").value = image_url;
}

async function saveEditedVehicle(event) {
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

  document.getElementById("editVehicle").style.display = "none";
  document.getElementById("addVehicle").style.display = "block";

  fetchVehicles();
}

function cancelEdit() {
  document.getElementById("editVehicle").style.display = "none";
  document.getElementById("addVehicle").style.display = "block";
}

async function deleteVehicle(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchVehicles();
}

document.getElementById("vehicleForm").addEventListener("submit", addVehicle);
document
  .getElementById("editVehicleForm")
  .addEventListener("submit", saveEditedVehicle);

fetchVehicles();
