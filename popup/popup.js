let tasks = [];
let completedTasks = [];

const startBtn = document.getElementById("start-timer-btn");
const addTaskBtn = document.getElementById("add-task-btn");

addTaskBtn.addEventListener("click", () => {
  addTask();
  updateBadge();
});

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

chrome.storage.sync.get(["completedTasks"], (res) => {
  completedTasks = res.completedTasks ? res.completedTasks : [];
  renderCompletedTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
  updateBadge();
}

function updateBadge() {
  const taskLength = tasks.length;
  chrome.action.setBadgeText({
    text: `${taskLength}`,
  });
}

function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
}

function renderTask(taskNum) {
  const taskRow = document.createElement("div");
  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task";
  text.value = tasks[taskNum];
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum);
  saveTasks();
}

function deleteTask(taskNum) {
  const completedTaskNum = completedTasks.length;
  completedTasks[completedTaskNum] = tasks[taskNum]; // get text value
  completedTasks.push("");
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
  renderCompletedTasks();
}

// function renderCompletedTask(taskNum) {
//   var completedTaskRow = document.createElement("li");
//   completedTaskRow.setAttribute("class", "item");

//   text.type = "text";
//   text.value = tasks[taskNum];

//   //   const completedTasks = document.createElement("li");
//   //   taskRow.appendChild(text);

//   completedTaskRow.appendChild(text);

//   const completedTaskContainer = document.getElementById("completed-task-list");
//   completedTaskContainer.appendChild(completedTaskRow);
// }

function renderCompletedTasks() {
  let completedTaskList = document.getElementById("completed-task-list");

  completedTasks.forEach((taskText, completedTaskNum) => {
    let li = document.createElement("li");
    li.innerText = taskText;
    completedTaskList.appendChild(li);
  });

  //   taskContainer.textContent = "";
  //   tasks.forEach((taskText, taskNum) => {
  //     renderCompletedTask(taskNum);
  //   });
}
