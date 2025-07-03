let todaysTasks = [];

document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('todayTasks').value;
  todaysTasks = input.split('\n').map(t => t.trim()).filter(t => t.length > 0);

  const listDiv = document.getElementById('taskList');
  listDiv.innerHTML = '<h5>Select Task Status:</h5>';
  
  todaysTasks.forEach((task, index) => {
    const group = document.createElement('div');
    group.className = 'mb-2';
    group.innerHTML = `
      <strong>${task}</strong>
      <select class="form-select mt-1" id="status-${index}">
        <option value="Completed">Completed</option>
        <option value="In Progress">In Progress</option>
        <option value="Pending">Pending</option>
      </select>
    `;
    listDiv.appendChild(group);
  });
});

document.getElementById('eodForm').addEventListener('submit', function (e) {
  e.preventDefault();

  let yesterdayTasks = "";
  for (let i = 0; i < todaysTasks.length; i++) {
    const status = document.getElementById(`status-${i}`).value;
    yesterdayTasks += `${todaysTasks[i]} (${status})\n`;
  }

  const hurdles = document.getElementById('hurdles').value;

  const payload = {
    date: new Date().toISOString().split('T')[0],
    yesterdayTasks: yesterdayTasks,
    todayTasks: todaysTasks.join("\n"),
    hurdles: hurdles
  };

  fetch('YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.text())
  .then(() => {
    alert("Submitted successfully!");
  })
  .catch(err => {
    console.error(err);
    alert("Failed to submit.");
  });
});
