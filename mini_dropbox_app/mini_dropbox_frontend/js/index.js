// 1. Functia care incarca lista de fisiere (NOUA)
async function loadFiles() {
  const userId = document.getElementById("userId").value;
  const tableBody = document.getElementById("filesListBody");

  if (!userId) return;

  try {
    // Apelam endpoint-ul creat in Backend: /api/files/user/{userId}
    const response = await fetch(
      `http://localhost:8082/api/files/user/${userId}`
    );

    if (response.ok) {
      const files = await response.json();

      // Curatam tabelul vechi
      tableBody.innerHTML = "";

      if (files.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="4" style="text-align:center;">No files found for this user.</td></tr>';
        return;
      }

      // Adaugam fiecare fisier in tabel
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
    console.error("Error loading files:", error);
  }
}

// 2. Functia de upload (MODIFICATA putin)
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const userIdInput = document.getElementById("userId");
  const messageEl = document.getElementById("message");

  if (fileInput.files.length === 0) {
    messageEl.textContent = "Please select a file!";
    messageEl.className = "error";
    return;
  }

  const userId = userIdInput.value;
  if (!userId) {
    messageEl.textContent = "Enter a valid User ID!";
    messageEl.className = "error";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("userId", userId);

  messageEl.textContent = "Loading...";
  messageEl.className = "";

  try {
    const response = await fetch("http://localhost:8082/api/files/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const text = await response.text();
      messageEl.textContent = "Success! " + text;
      messageEl.className = "success";

      // AICI E SCHIMBAREA IMPORTANTA: Reincarcam lista dupa upload
      loadFiles();
    } else {
      messageEl.textContent = "Server Error: " + response.status;
      messageEl.className = "error";
    }
  } catch (error) {
    console.error(error);
    messageEl.textContent = "Backend didn't respond";
    messageEl.className = "error";
  }
}

// 3. Incarcam lista imediat ce se deschide pagina
document.addEventListener("DOMContentLoaded", loadFiles);
