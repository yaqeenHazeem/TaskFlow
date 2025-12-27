const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "";

/* Show Password Login */
const loginPassword = document.getElementById("loginPassword");
const loginShow = document.getElementById("loginShowPassword");
if (loginPassword && loginShow) {
  loginShow.addEventListener("change", () => {
    loginPassword.type = loginShow.checked ? "text" : "password";
  });
}

/* Show Password Register */
const registerPassword = document.getElementById("registerPassword");
const registerShow = document.getElementById("registerShowPassword");
if (registerPassword && registerShow) {
  registerShow.addEventListener("change", () => {
    registerPassword.type = registerShow.checked ? "text" : "password";
  });
}

/* ---------- Register ---------- */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Register:", data);

      if (res.ok) {
        alert("Registered successfully!");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register Error:", err);
      alert("Server error");
    }
  });
}

/* ---------- Login ---------- */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server error");
    }
  });
}

/* ---------- Logout ---------- */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

/* ---------- Projects ---------- */
const projectForm = document.getElementById("projectForm");
const projectsContainer = document.getElementById("projectsContainer");

if (projectForm && projectsContainer) {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "index.html";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  /* Load Projects */
  const loadProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, { headers });
      const projects = await res.json();

      if (Array.isArray(projects)) {
        projectsContainer.innerHTML = projects
          .map(
            (p) => `
          <div class="project-card">
            <h4>${p.title}</h4>
            <p>${p.description}</p>
            <button class="deleteBtn" data-id="${p._id}">Delete</button>
          </div>
        `
          )
          .join("");
      } else {
        projectsContainer.innerHTML = "<p>No projects found</p>";
      }
    } catch (err) {
      console.error("Load Projects Error:", err);
      projectsContainer.innerHTML = "<p>Error loading projects</p>";
    }
  };

  loadProjects();

  /* Add Project */
  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("projectTitle").value;
    const description = document.getElementById("projectDesc").value;

    try {
      await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title, description }),
      });

      projectForm.reset();
      loadProjects();
    } catch (err) {
      console.error("Add Project Error:", err);
      alert("Error adding project");
    }
  });

  /* Delete Project */
  projectsContainer.addEventListener("click", async (e) => {
    if (e.target.classList.contains("deleteBtn")) {
      const id = e.target.dataset.id;

      if (confirm("Delete this project?")) {
        try {
          await fetch(`${API_BASE_URL}/api/projects/${id}`, {
            method: "DELETE",
            headers,
          });
          loadProjects();
        } catch (err) {
          console.error("Delete Error:", err);
          alert("Error deleting project");
        }
      }
    }
  });
}
