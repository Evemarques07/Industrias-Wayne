const apiUrl = "http://127.0.0.1:8000/devices";

async function fetchDevices() {
  const response = await fetch(apiUrl);
  const devices = await response.json();

  const deviceList = document.getElementById("devices");
  deviceList.innerHTML = "";

  devices.forEach((device) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${device.name}</h3>
      <p>${device.description}</p>
      <img src="${device.image_url}" alt="${device.name}" width="200" />
      <button onclick="editDevice(${device.id}, '${device.name}', '${device.description}', '${device.image_url}')">Editar</button>
      <button onclick="deleteDevice(${device.id})">Excluir</button>
    `;
    deviceList.appendChild(li);
  });
}

async function addDevice(event) {
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

  document.getElementById("deviceForm").reset();
  fetchDevices();
}

function editDevice(id, name, description, image_url) {
  document.getElementById("editDevice").style.display = "block";
  document.getElementById("addDevice").style.display = "none";

  document.getElementById("edit_id").value = id;
  document.getElementById("edit_name").value = name;
  document.getElementById("edit_description").value = description;
  document.getElementById("edit_image_url").value = image_url;
}

async function saveEditedDevice(event) {
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

  document.getElementById("editDevice").style.display = "none";
  document.getElementById("addDevice").style.display = "block";

  fetchDevices();
}

function cancelEdit() {
  document.getElementById("editDevice").style.display = "none";
  document.getElementById("addDevice").style.display = "block";
}

async function deleteDevice(id) {
  await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
  fetchDevices();
}

document.getElementById("deviceForm").addEventListener("submit", addDevice);
document
  .getElementById("editDeviceForm")
  .addEventListener("submit", saveEditedDevice);

fetchDevices();
