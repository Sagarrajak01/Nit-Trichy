document.getElementById("dataForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = document.getElementById("data")?.value.trim();
  const username = localStorage.getItem("loggedInUser");

  if (!username) {
    alert("You must be logged in.");
    window.location.href = "login.html";
    return;
  }

  if (!data) {
    alert("Please enter some data.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/store-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, data }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      document.getElementById("dataForm").reset();
    } else {
      alert(result.message || "Failed to store data.");
    }
  } catch (err) {
    console.error("Store data error:", err);
    alert("Connection error while storing data.");
  }
});