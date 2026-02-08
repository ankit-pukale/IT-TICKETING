document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("LOGIN RESPONSE:", data);

  if (res.ok && data.adminName) {
    localStorage.setItem("adminName", data.adminName);
    window.location.href = "admin.html";
  } else {
    document.getElementById("error").innerText =
      data.message || "Login failed";
  }
});
