const numTodoTasksToDisplay = document.getElementById(
  "num-todo-tasks-to-display"
);
numTodoTasksToDisplay.addEventListener("change", (event) => {
  const val = event.target.value;
  if (val < 1 || val > 100) {
    numTodoTasksToDisplay.value = 5;
  }
});

const numCompletedTasksToDisplay = document.getElementById(
  "num-completed-tasks-to-display"
);
numCompletedTasksToDisplay.addEventListener("change", (event) => {
  const val = event.target.value;
  if (val < 1 || val > 100) {
    numCompletedTasksToDisplay.value = 5;
  }
});

const completedFlag = document.getElementById("completed-flag");
completedFlag.addEventListener("change", (event) => {});

const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    numTodoTasksToDisplay: numTodoTasksToDisplay.value,
    numCompletedTasksToDisplay: numCompletedTasksToDisplay.value,
    completedFlag: completedFlag.value,
  });
});

chrome.storage.local.get(["numTodoTasksToDisplay"], (res) => {
  numTodoTasksToDisplay.value = res.numTodoTasksToDisplay;
});

chrome.storage.local.get(["numCompletedTasksToDisplay"], (res) => {
  numCompletedTasksToDisplay.value = res.numCompletedTasksToDisplay;
});

chrome.storage.local.get(["completedFlag"], (res) => {
  completedFlag.value = res.completedFlag;
});
