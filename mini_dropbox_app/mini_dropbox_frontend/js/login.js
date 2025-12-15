document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageEl = document.getElementById("message");

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8082/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Take user data from response and store it in localStorage
        const user = await response.json();

        // Save the user in browser localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));

        messageEl.textContent = "Login successful!";
        messageEl.style.color = "green";

        // Redirect to main page
        window.location.href = "index.html";
      } else {
        messageEl.textContent = "Invalid username or password.";
        messageEl.style.color = "red";
      }
    } catch (error) {
      console.error(error);
      messageEl.textContent = "Server connection failed.";
      messageEl.style.color = "red";
    }
  });
