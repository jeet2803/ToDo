let todaysTasks = [];

function addTask() {
  const input = document.getElementById("newTaskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  todaysTasks.push({ text: taskText, status: "" });
  input.value = "";
  renderTaskList();
}

function renderTaskList() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  todaysTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${task.text}
      <span class="badge bg-secondary">${task.status || "Not updated"}</span>
    `;
    list.appendChild(li);
  });
}

function saveTasks() {
  if (todaysTasks.length === 0) {
    alert("Please add at least one task.");
    return;
  }
  document.getElementById("morningForm").style.display = "none";
  document.getElementById("eodForm").style.display = "block";
  renderStatusDropdowns();
}

function renderStatusDropdowns() {
  const container = document.getElementById("statusList");
  container.innerHTML = "";

  todaysTasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "card task-card p-3";

    card.innerHTML = `
      <strong>${task.text}</strong>
      <select class="form-select mt-2" id="status-${index}">
        <option value="">Select Status</option>
        <option value="Completed">✅ Completed</option>
        <option value="In Progress">🔄 In Progress</option>
        <option value="Pending">⏸️ Pending</option>
      </select>
    `;
    container.appendChild(card);
  });
}

function submitEOD() {
  let allUpdated = true;
  let yesterdayTasks = "";

  todaysTasks.forEach((task, index) => {
    const status = document.getElementById(`status-${index}`).value;
    if (!status) {
      allUpdated = false;
    }
    task.status = status;
    yesterdayTasks += `${task.text} (${status})\n`;
  });

  if (!allUpdated) {
    alert("Please select status for all tasks.");
    return;
  }

  const hurdles = document.getElementById("hurdlesInput").value.trim();

  const payload = {
    date: new Date().toISOString().split('T')[0],
    yesterdayTasks,
    todayTasks: todaysTasks.map(t => t.text).join("\n"),
    hurdles: hurdles || "None"
  };

  fetch('https://script.google.com/macros/s/AKfycbzdkSt-Zk7W7ZlGuOwIaHaKHlet3x4ILNX5Hm6RW0X3NXvjM6-hqoZ6EfKa4C80MruDNQ/exec', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.text())
  .then(() => {
    alert("Submitted successfully!");
    location.reload();
  })
  .catch(err => {
    console.error(err);
    alert("Failed to submit.");
  });
}
