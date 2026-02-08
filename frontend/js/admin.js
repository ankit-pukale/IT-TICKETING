/* ---------- AUTH GUARD ---------- */
const adminName = localStorage.getItem("adminName");

if (!adminName || adminName === "undefined") {
  localStorage.clear();
  window.location.href = "admin-login.html";
}

/* ---------- SHOW ADMIN NAME ---------- */
document.getElementById("adminName").innerText = adminName;

/* ---------- LOAD DATA ---------- */
async function load() {
  const complaints = await fetch("http://localhost:3000/api/complaints").then(r => r.json());
  const admins = await fetch("http://localhost:3000/api/admins").then(r => r.json());

  const tbody = document.getElementById("rows");
  tbody.innerHTML = "";

  complaints.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${c.category}</td>
      <td>${c.title}</td>
      <td style="max-width:300px; white-space:normal; word-wrap:break-word;">
        ${c.description}
      </td>
      <td>${c.hostname}<br><small>${c.ip}</small></td>
      <td><span class="badge bg-info">${c.status}</span></td>

      <td>
        <select class="form-select form-select-sm">
          ${admins.map(a => `
            <option value="${a.id}" ${a.name === c.assigned_admin ? "selected" : ""}>
              ${a.name}
            </option>`).join("")}
        </select>
      </td>

      <td>
        <button class="btn btn-sm btn-primary">Assign</button>
        <button class="btn btn-sm btn-warning">In Progress</button>
        <button class="btn btn-sm btn-success">Completed</button>
        <button class="btn btn-sm btn-danger">Rejected</button>
      </td>
    `;

    const select = tr.querySelector("select");
    const buttons = tr.querySelectorAll("button");

    buttons[0].onclick = () => updateAssign(c.id, select.value);
    buttons[1].onclick = () => updateStatus(c.id, "IN_PROGRESS");
    buttons[2].onclick = () => updateStatus(c.id, "COMPLETED");
    buttons[3].onclick = () => updateStatus(c.id, "REJECTED");

    tbody.appendChild(tr);
  });
}

/* ---------- API CALLS ---------- */
async function updateAssign(id, adminId) {
  await fetch("http://localhost:3000/api/complaints/assign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, adminId })
  });
  load();
}

async function updateStatus(id, status) {
  await fetch("http://localhost:3000/api/complaints/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status })
  });
  load();
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  window.location.href = "admin-login.html";
}

load();
