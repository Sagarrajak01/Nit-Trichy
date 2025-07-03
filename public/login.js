document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!username || !password) {
        alert("Username and password are required.");
        return;
    }

    const loginData = { username, password };

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            localStorage.setItem("loggedInUser", username);
            window.location.href = result.redirect;
        } else {
            alert(result.message || "Login failed.");
        }
    } catch (err) {
        console.error("Login error:", err);
        alert("Login error. Try again later.");
    }
});