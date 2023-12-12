const inputBoxEl = document.getElementById("input-box");
const btnAddEl = document.querySelector(".btn-add");
const updateBoxEl = document.getElementById("update-box");
const btnUpdateEl = document.querySelector(".btn-update");
const updateTaskEl = document.querySelector(".update");
const overlayEl = document.querySelector(".overlay");
const listContainerEl = document.querySelector(".list-container");
const btnDeleteEl = document.querySelector(".btn-delete");

let taskList = [];
let indexUpdate = 0;

displayTaskList();

// Add Task
btnAddEl.addEventListener("click", function () {
  const inputValue = inputBoxEl.value;
  if (inputValue.trim()) {
    taskList.push(inputValue);
    displayTaskList();
    console.log(taskList);
    inputBoxEl.value = "";
  }
  console.log(taskList);
  updateStatusDeleteBtn();
});

// Done, Update or Delete
listContainerEl.addEventListener("click", function (e) {
  // Change status to DONE or DOING
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("done");
  } else if (e.target.classList.contains("fa-trash")) {
    // Remove task by filter
    taskList = taskList.filter(
      (element) => element !== e.target.parentNode.textContent
    );
    displayTaskList();
    updateStatusDeleteBtn();
  } else if (e.target.classList.contains("fa-pen-to-square")) {
    // Display update box
    updateTaskEl.classList.remove("hidden");
    overlayEl.classList.remove("hidden");
    const taskToUpdate = e.target.parentNode.textContent;
    updateBoxEl.value = taskToUpdate;
    indexUpdate = taskList.indexOf(taskToUpdate);
  }
});

// Update
btnUpdateEl.addEventListener("click", function () {
  taskList[indexUpdate] = updateBoxEl.value;
  updateTaskEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
  displayTaskList();
});

// Remove All Task
btnDeleteEl.addEventListener("click", function () {
  taskList = [];
  displayTaskList();
  updateStatusDeleteBtn();
});

function displayTaskList() {
  listContainerEl.innerHTML = "";
  taskList.forEach((element) => {
    let li = document.createElement("li");
    li.textContent = element;
    listContainerEl.insertAdjacentElement("afterbegin", li);
    let pencileIcon = document.createElement("i");
    pencileIcon.classList.add("fa-solid", "fa-pen-to-square");
    let binIcon = document.createElement("i");
    binIcon.classList.add("fa-solid", "fa-trash");
    li.appendChild(pencileIcon);
    li.appendChild(binIcon);
  });
}

function updateStatusDeleteBtn() {
  if (!taskList.length) {
    btnDeleteEl.classList.add("hidden");
  } else {
    btnDeleteEl.classList.remove("hidden");
  }
}
