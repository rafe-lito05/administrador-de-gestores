document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const contactsList = document.getElementById("contactsList");
  const exportBtn = document.getElementById("exportBtn");
  const saveNotice = document.createElement("div");
  saveNotice.className = "save-notice";
  contactsList.parentNode.insertBefore(saveNotice, contactsList.nextSibling);

  let contacts = [];
  let needsSave = false;

  // Cargar contactos desde el LocalStorage
  loadContacts();

  // Manejar el envío del formulario
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (nombre && apellido && telefono) {
      const id = generateId(nombre, apellido);
      const newContact = { id, nombre, apellido, telefono };

      addContact(newContact);
      contactForm.reset();
      showSaveNotice();
    }
  });

  // Botón para exportar a JSON
  exportBtn.addEventListener("click", function () {
    exportToJSON();
    hideSaveNotice();
  });

  // Función para generar ID (primera letra del nombre + apellido)
  function generateId(nombre, apellido) {
    return nombre.charAt(0) + apellido;
  }

  // Función para agregar un contacto
  function addContact(contact) {
    contacts.push(contact);
    needsSave = true;
    saveToLocalStorage();
    renderContacts();
  }

  // Función para eliminar un contacto
  function deleteContact(id) {
    contacts = contacts.filter((contact) => contact.id !== id);
    needsSave = true;
    saveToLocalStorage();
    renderContacts();
    showSaveNotice();
  }

  // Función para renderizar la lista de contactos
  function renderContacts() {
    contactsList.innerHTML = "";

    if (contacts.length === 0) {
      contactsList.innerHTML = "<p><b>No hay contactos guardados.</b></p>";
      return;
    }

    contacts.forEach((contact) => {
      const contactCard = document.createElement("div");
      contactCard.className = "contact-card";

      contactCard.innerHTML = `
                <div class="contact-info">
                    <span class="contact-id"><b>ID:</b> ${contact.id}</span>
                    <p><b>Nombre y Apellido:</b> ${contact.nombre} ${contact.apellido}</p>
                    <p><b>Teléfono:</b> ${contact.telefono}</p>
                </div>
                <button class="delete-btn" data-id="${contact.id}">Eliminar</button>
            `;

      contactsList.appendChild(contactCard);
    });

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        deleteContact(id);
      });
    });
  }

  // Función para cargar contactos desde el LocalStorage
  function loadContacts() {
    const savedContacts = localStorage.getItem("contactos");
    if (savedContacts) {
      contacts = JSON.parse(savedContacts);
    }
    renderContacts();
  }

  // Función para guardar en LocalStorage
  function saveToLocalStorage() {
    localStorage.setItem("contactos", JSON.stringify(contacts));
  }

  // Función para exportar a JSON
  function exportToJSON() {
    const dataStr = JSON.stringify(contacts, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "contactos.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    needsSave = false;
  }

  // Mostrar aviso de cambios no guardados
  function showSaveNotice() {
    saveNotice.textContent =
      'Tienes cambios sin guardar. Haz clic en "Exportar a JSON" para guardar.';
    saveNotice.style.display = "block";
  }

  // Ocultar aviso
  function hideSaveNotice() {
    saveNotice.style.display = "none";
  }
});
