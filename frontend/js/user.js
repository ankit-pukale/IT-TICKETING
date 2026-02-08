let SYSTEM_INFO = { hostname: "Unknown", ip: "Unknown" };

fetch("http://localhost:3000/api/system-info")
  .then(r => r.json())
  .then(d => SYSTEM_INFO = d);

document.getElementById("ticketForm").onsubmit = async (e) => {
  e.preventDefault();

  await fetch("http://localhost:3000/api/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: category.value,
      title: title.value,
      description: description.value,
      hostname: SYSTEM_INFO.hostname,
      ip: SYSTEM_INFO.ip
    })
  });

  msg.innerHTML = `<div class="alert alert-success">Ticket submitted successfully</div>`;
  e.target.reset();
};
