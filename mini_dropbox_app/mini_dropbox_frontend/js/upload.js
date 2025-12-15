const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) window.location.href = 'login.html';

document.getElementById('logoutBtn')?.addEventListener('click', (e) => { // Optional chaining in case element is not found
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

const form = document.querySelector('form'); 

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = form.querySelector('input[type="file"]');
    const btn = form.querySelector('button');
    
    if(fileInput.files.length === 0) return alert("Select a file!");

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("userId", currentUser.id);

    btn.textContent = "Uploading...";
    btn.disabled = true;

    try {
        const response = await fetch('http://localhost:8082/api/files/upload', {
            method: 'POST',
            body: formData
        });

        if(response.ok) {
            alert("File uploaded successfully!");
            window.location.href = 'files.html'; // Redirect to files page
        } else {
            alert("Upload failed.");
        }
    } catch (error) {
        console.error(error);
        alert("Server error.");
    } finally {
        btn.textContent = "Upload";
        btn.disabled = false;
    }
});