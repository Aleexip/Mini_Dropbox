// 1. Verify the security - is user logged in?
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Logout Logic
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Upload file list
    loadFiles();
});

// Function to load files
async function loadFiles() {
    const tableBody = document.getElementById('filesListBody');

    try {
        const response = await fetch(`http://localhost:8082/api/files/user/${currentUser.id}`);
        
        if (response.ok) {
            const files = await response.json();
            tableBody.innerHTML = ''; // Clean up existing rows
            if (files.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Nu ai niciun fișier. Începe prin a încărca unul!</td></tr>';
                return;
            }

            files.forEach(file => {
                // Convert size to human-readable format from bytes to KB or MB
                let sizeDisplay;
                if (file.size < 1024 * 1024) {
                    sizeDisplay = (file.size / 1024).toFixed(2) + ' KB';
                } else {
                    sizeDisplay = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                }

                const downloadUrl = `http://localhost:8082/api/files/${file.id}`;
                
                // Generate the html code
                const row = `
                    <tr>
                        <td>
                            <strong>${file.name}</strong>
                        </td>
                        <td style="color: #666; font-size: 0.9rem;">${file.type}</td>
                        <td>${sizeDisplay}</td>
                        <td style="text-align: center;">
                            <a href="${downloadUrl}" class="btn-action btn-download">⬇ Download</a>
                            <button onclick="deleteFile(${file.id})" class="btn-action btn-delete">🗑️ Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Eroare la încărcarea fișierelor.</td></tr>';
        }
    } catch (error) {
        console.error("Eroare:", error);
        tableBody.innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Serverul nu răspunde.</td></tr>';
    }
}

// Delete function
async function deleteFile(fileId) {
    if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8082/api/files/${fileId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Reload the file list
            loadFiles();
        } else {
            alert("Error deleting file.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Impossible to reach the server.");
    }
}