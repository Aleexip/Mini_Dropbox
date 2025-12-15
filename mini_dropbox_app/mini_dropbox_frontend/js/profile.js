const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) window.location.href = 'login.html';

document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', () => {
    
    
    // Populate user info
    const infoContainer = document.querySelector('.user-info');
    if(infoContainer) {
        infoContainer.innerHTML = `
            <p><strong>Username:</strong> ${currentUser.username}</p>
            <p><strong>Email:</strong> ${currentUser.email || 'Not set'}</p>
        `;
    }

   // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(f => {
        f.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("This feature is not implemented yet.");
        });
    });
});