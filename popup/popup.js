let tasks = [];
let completedTasks = [];
let width = 0;

const startBtn = document.getElementById("start-timer-btn");
const addTaskBtn = document.getElementById("add-task-btn");
const clearBtn = document.getElementById("clear-btn");
const progressBar = document.getElementById("progress-bar");

addTaskBtn.addEventListener("click", () => {
  addTask();
  updateBadge();
  updateProgress();
});

clearBtn.addEventListener("click", () => {
  tasks = [];
  completedTasks = [];
  if (confirm("Are you sure you want to clear all tasks?")) {
    renderTasks();
    saveTasks();
    renderCompletedTasks();
    updateProgress();
  }
});

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

chrome.storage.sync.get(["completedTasks"], (res) => {
  completedTasks = res.completedTasks ? res.completedTasks : [];
  renderCompletedTasks();
});

chrome.storage.sync.get(["width"], (res) => {
  width = res.width ? res.width : [];
  updateProgress();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
    completedTasks,
    width,
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
    renderTask(taskNum, tasks, "task-container");
  });
}

function renderCompletedTasks() {
  const completedTaskContainer = document.getElementById(
    "completed-task-container"
  );
  completedTaskContainer.textContent = "";
  completedTasks.forEach((taskText, taskNum) => {
    renderTask(taskNum, completedTasks, "completed-task-container");
  });
}

function renderTask(taskNum, taskList, taskContainerName) {
  const taskRow = document.createElement("div");
  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task";
  text.value = taskList[taskNum];
  text.className = "task-input";
  text.addEventListener("change", () => {
    taskList[taskNum] = text.value;
    saveTasks();
  });

  const completedBtn = document.createElement("input");
  completedBtn.type = "button";
  completedBtn.value = "✔";
  completedBtn.className = "task-delete";
  completedBtn.title = "Completed task";
  completedBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  // const editBtn = document.createElement("input");
  // editBtn.type = "button";
  // editBtn.value = "✎";
  // editBtn.className = "task-edit";
  // editBtn.title = "Edit task";
  // editBtn.addEventListener("click", () => {
  //   editTask(taskNum);
  // });

  const undoBtn = document.createElement("input");
  undoBtn.type = "button";
  undoBtn.value = "↩";
  undoBtn.className = "task-undo";
  undoBtn.title = "Undo";
  undoBtn.addEventListener("click", () => {
    undoTask(taskNum);
  });

  taskRow.appendChild(text);

  if (taskList == tasks) {
    taskRow.appendChild(completedBtn);
  } else {
    taskRow.appendChild(undoBtn);
  }
  // taskRow.appendChild(editBtn);

  const taskContainer = document.getElementById(taskContainerName);
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum, tasks, "task-container");
  saveTasks();
}

function deleteTask(taskNum) {
  const completedTaskNum = completedTasks.length;
  completedTasks[completedTaskNum] = tasks[taskNum];
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
  renderCompletedTasks();
  updateProgress();
}

function undoTask(taskNum) {
  tasks.push(completedTasks[taskNum]);
  completedTasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
  renderCompletedTasks();
  updateProgress();
}

function renderCompletedTask(taskNum) {
  const taskRow = document.createElement("div");
  const text = document.createElement("input");
  text.value = completedTasks[taskNum];
  text.addEventListener("change", () => {
    completedTasks[taskNum] = text.value;
    saveTasks();
  });

  const undoBtn = document.createElement("input");
  undoBtn.type = "button";
  undoBtn.value = "Undo";
  undoBtn.addEventListener("click", () => {
    undoTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(undoBtn);

  const taskContainer = document.getElementById("completed-task-container");
  taskContainer.appendChild(taskRow);
}

function updateProgress() {
  var totalTasks = completedTasks.length + tasks.length;
  width = 0; // needed to reset width after clearing tasks
  if (totalTasks != 0) {
    width = Math.round((completedTasks.length / totalTasks) * 100);
  }

  progressBar.style.width = width + "%";
  document.getElementById("progress-bar-text").innerHTML = `${width}%`;
}

const tabs = document.querySelector(".wrapper");
const tabButton = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".content");

console.log("tabs:", tabs);
console.log("tabButton:", tabButton);
console.log("contents:", contents);

tabs.onclick = (e) => {
  const id = e.target.dataset.id;
  console.log("ID:", id);
  if (id) {
    tabButton.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");

    contents.forEach((content) => {
      content.classList.remove("active");
    });
    const element = document.getElementById(id);
    element.classList.add("active");
  }
};
