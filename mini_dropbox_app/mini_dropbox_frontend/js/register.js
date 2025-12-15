document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Stop form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const messageEl = document.getElementById('message');

    // Simple validation
    if (password !== confirmPassword) {
        messageEl.textContent = "Passwords do not match!";
        messageEl.style.color = "red";
        return;
    }

    const userData = {
        username: username,
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:8082/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            messageEl.textContent = "Account created! Redirecting to login...";
            messageEl.style.color = "green";
            // Wait for 2 seconds before redirecting
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            const errorText = await response.text();
            messageEl.textContent = "Error: " + errorText;
            messageEl.style.color = "red";
        }
    } catch (error) {
        console.error(error);
        messageEl.textContent = "Server connection failed.";
        messageEl.style.color = "red";
    }
});