document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const mobile = document.getElementById("mobile")?.value.trim();
  const state = document.getElementById("state")?.value;
  const qualification = document.getElementById("qualification")?.value;
  const discipline = document.getElementById("discipline")?.value;
  const data = document.getElementById("data")?.value.trim();

  if (name && email && mobile && state && qualification && discipline) {
    if (!email.includes("@") || mobile.length < 10) {
      alert("Please enter a valid email and a 10-digit mobile number.");
      return;
    }

    let category;
    if (qualification === "Intermediate (10+2)") category = "Engineering";
    else if (qualification === "Undergraduate (UG)") category = "Masters";
    else if (qualification === "Postgraduate (PG)") category = "Research";
    else category = "Other";

    const formData = {
      name,
      email,
      mobile,
      state,
      qualification,
      discipline,
      category
    };

    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        document.querySelector("form").reset();
      } else {
        alert(result.message || "Error submitting the form.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit the form. Check your connection.");
    }
  } else if (username && password) {
    if (username.length < 3 || password.length < 6) {
      alert("Username must be at least 3 characters. Password must be at least 6 characters.");
      return;
    }

    const loginData = { username, password };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        localStorage.setItem("loggedInUser", username);
        setTimeout(() => {
          window.location.href = result.redirect;
        }, 1000); 
      } else {
        alert(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Failed to login. Check your connection.");
    }
  } else if (data) {
    const username = localStorage.getItem("loggedInUser");
    if (username && data) {
      const storeData = { username, data };

      try {
        const response = await fetch("http://localhost:3000/store-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storeData)
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          document.getElementById("dataForm")?.reset();
        } else {
          alert(result.message || "Error storing data.");
        }
      } catch (err) {
        console.error("Data storage error:", err);
        alert("Failed to store data. Check your connection.");
      }
    } else {
      alert("Please login first or enter data.");
    }
  } else {
    alert("Please fill in the required fields.");
  }
});
function showMenu() {
  document.getElementById("navLinks").style.right = "0";
}

function hideMenu() {
  document.getElementById("navLinks").style.right = "-200px";
}

document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("loggedInUser");
  if (!username) return;

  try {
    const response = await fetch("http://localhost:3000/get-user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const result = await response.json();
    if (response.ok && Array.isArray(result.entries)) {
      const list = document.getElementById("dataList");
      result.entries.forEach(entry => {
        const li = document.createElement("li");
        li.className = "stored-entry";
        li.innerHTML = `
          <h3>${entry.data}</h3>
          <p><strong>Saved On:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
        `;
        list.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Failed to fetch stored data:", err);
  }
});
document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("loggedInUser");
  if (!username) return;

  try {
    const response = await fetch("http://localhost:3000/get-user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const result = await response.json();
    if (response.ok && Array.isArray(result.entries)) {
      const list = document.getElementById("dataList");
      list.innerHTML = ""; // Clear previous content

      result.entries.forEach(entry => {
        const li = document.createElement("li");
        li.className = "stored-entry";
        li.setAttribute("data-id", entry._id);

        li.innerHTML = `
          <h3 contenteditable="false">${entry.data}</h3>
          <p><strong>Saved On:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        `;

        list.appendChild(li);
      });

      // Attach event listeners after rendering
      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", async function () {
          const entryEl = this.closest(".stored-entry");
          const h3 = entryEl.querySelector("h3");
          const id = entryEl.getAttribute("data-id");

          if (this.textContent === "Edit") {
            h3.setAttribute("contenteditable", "true");
            h3.focus();
            this.textContent = "Save";
          } else {
            const newData = h3.textContent.trim();
            h3.setAttribute("contenteditable", "false");
            this.textContent = "Edit";

            await fetch("http://localhost:3000/update-data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, data: newData })
            });
            alert("Updated successfully");
          }
        });
      });

      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async function () {
          const entryEl = this.closest(".stored-entry");
          const id = entryEl.getAttribute("data-id");

          if (confirm("Are you sure you want to delete this entry?")) {
            await fetch("http://localhost:3000/delete-data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id })
            });
            entryEl.remove();
          }
        });
      });
    }
  } catch (err) {
    console.error("Failed to fetch stored data:", err);
  }
});
