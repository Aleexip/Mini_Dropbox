// Verify if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    // 2. Set logout button
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // 3. Take user statistics from backend
    try {
        const response = await fetch(`http://localhost:8082/api/files/user/${currentUser.id}`);
        if (response.ok) {
            const files = await response.json();
            
           // Calculate statistics
            const count = files.length;
            const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
            
            // Assuming a storage limit of 500 MB
            const limitMB = 500; 
            const percent = Math.min((totalMB / limitMB) * 100, 100);

            // Update UI
            document.getElementById('fileCountText').textContent = `${count} fișiere`;
            document.getElementById('storageText').textContent = `${totalMB} MB / ${limitMB} MB`;
            document.getElementById('storageBar').style.width = `${percent}%`;
            
            // Change color based on usage
            if (percent > 80) document.getElementById('storageBar').style.background = '#ef4444';
        }
    } catch (error) {
        console.error("Error at loading", error);
    }
});