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
            
            // Calculate total size and count
            const fileCount = files.length;
            let totalSizeBytes = 0;
            files.forEach(f => totalSizeBytes += f.size);

            // Convert size to MB
            const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
            
         
            // Update the dashboard cards after fetching data
            const cards = document.querySelectorAll('.card p');
            if(cards.length >= 2) {
                cards[0].textContent = `${totalSizeMB} MB of 5 GB`; // Space
                cards[1].textContent = `${fileCount} files`;        // Count
            }
        }
    } catch (error) {
        console.error("Error at loading", error);
    }
});