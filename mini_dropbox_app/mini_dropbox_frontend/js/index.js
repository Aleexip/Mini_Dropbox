// 1. Verificam imediat daca userul e logat
const currentUserJSON = localStorage.getItem("currentUser");

if (!currentUserJSON) {
  // Daca nu e logat, il trimitem la Login
  window.location.href = "login.html";
}

const currentUser = JSON.parse(currentUserJSON);

// 2. Initializam pagina cand s-a incarcat HTML-ul
document.addEventListener("DOMContentLoaded", function () {
  // Afisam numele userului sus
  document.getElementById("userSection").style.display = "flex";
  document.getElementById("guestNav").style.display = "none";
  document.getElementById(
    "welcomeText"
  ).textContent = `Salut, ${currentUser.username}!`;
  document.getElementById(
    "mainTitle"
  ).textContent = `Dashboard-ul lui ${currentUser.username}`;

  // Incarcam fisierele userului curent
  loadFiles();

  // Butonul de Logout
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("currentUser"); // Stergem sesiunea
    window.location.href = "login.html";
  });

  // Butonul de Upload
  document.getElementById("uploadBtn").addEventListener("click", uploadFile);
});

// --- FUNCTIILE ---

async function loadFiles() {
  const tableBody = document.getElementById("filesListBody");

  try {
    // Folosim ID-ul din localStorage (currentUser.id)
    const response = await fetch(
      `http://localhost:8082/api/files/user/${currentUser.id}`
    );

    if (response.ok) {
      const files = await response.json();
      tableBody.innerHTML = "";

      if (files.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="4" style="text-align:center;">Nu ai niciun fișier.</td></tr>';
        return;
      }

      files.forEach((file) => {
        const sizeKB = (file.size / 1024).toFixed(2);
        const downloadUrl = `http://localhost:8082/api/files/${file.id}`;

        const row = `
                    <tr>
                        <td>${file.name}</td>
                        <td>${file.type}</td>
                        <td>${sizeKB} KB</td>
                        <td style="text-align: center;">
                            <a href="${downloadUrl}" class="btn-download">⬇ Download</a>
                        </td>
                    </tr>
                `;
        tableBody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error("Eroare la incarcarea fisierelor:", error);
  }
}

async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const messageEl = document.getElementById("message");

  if (fileInput.files.length === 0) {
    messageEl.textContent = "Te rog selectează un fișier!";
    messageEl.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  // AICI E SECRETUL: Luam ID-ul automat din userul logat
  formData.append("userId", currentUser.id);

  messageEl.textContent = "Se încarcă...";
  messageEl.style.color = "black";

  try {
    const response = await fetch("http://localhost:8082/api/files/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      messageEl.textContent = "✅ Fișier încărcat cu succes!";
      messageEl.style.color = "green";
      fileInput.value = ""; // Golim inputul
      loadFiles(); // Reincarcam lista
    } else {
      messageEl.textContent = "Eroare server.";
      messageEl.style.color = "red";
    }
  } catch (error) {
    console.error(error);
    messageEl.textContent = "Nu pot contacta serverul.";
    messageEl.style.color = "red";
  }
}
