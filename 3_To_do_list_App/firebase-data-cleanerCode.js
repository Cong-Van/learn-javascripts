const inputBoxEl = document.getElementById("input-box");
const btnAddEl = document.querySelector(".btn-add");
const updateBoxEl = document.getElementById("update-box");
const btnUpdateEl = document.querySelector(".btn-update");
const updateTaskEl = document.querySelector(".update");
const overlayEl = document.querySelector(".overlay");
const listContainerEl = document.querySelector(".list-container");
const btnDeleteEl = document.querySelector(".btn-delete");

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4n3ckXetFbWKv_ha5hA7dEoJf1sF3at4",
  authDomain: "individual-e7dfb.firebaseapp.com",
  databaseURL:
    "https://individual-e7dfb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "individual-e7dfb",
  storageBucket: "individual-e7dfb.appspot.com",
  messagingSenderId: "995273948246",
  appId: "1:995273948246:web:0678d595a0d698020ecff7",
  measurementId: "G-3P2JR4QRFZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

let taskList = [];
let id = 0;
let idUpdate = 0;

startApp();

/*
Luôn update giao diện rồi update data trên firebase
*/

// Add Task
btnAddEl.addEventListener("click", addTask);

// Add Task, Update Task by Enter
document.addEventListener("keydown", function (e) {
  const inputValue = inputBoxEl.value;
  if (e.key === "Enter") {
    addTask();
    updateTask();
  }
});

// Done, Update or Delete
listContainerEl.addEventListener("click", function (e) {
  /*
  Vì phần tử li chứa phần tử i, nên với phần tử i thì li chính là parentNode của nó
  */
  if (e.target.tagName === "LI") {
    // Change status to DONE or DOING
    idUpdate = e.target.dataset.id;
    const task = findTaskById(idUpdate);
    const indexUpdate = taskList.indexOf(task);
    taskList[indexUpdate].done = taskList[indexUpdate].done ? false : true;
    e.target.classList.toggle("done");

    updateData(taskList[indexUpdate]);
  } else {
    idUpdate = e.target.parentNode.dataset.id;
    const task = findTaskById(idUpdate);

    if (e.target.classList.contains("fa-trash")) {
      // Remove task by splice
      if (confirm(`Are you sure delete Task '${task.content}'`)) {
        const indexDelete = taskList.indexOf(task);
        taskList.splice(indexDelete, 1);
        displayTaskList();
        updateStatusDeleteBtn();

        deleteData(task.id);
      }
    } else if (e.target.classList.contains("fa-pen-to-square")) {
      // Display update box
      displayUpdateBox();
      updateBoxEl.value = e.target.parentNode.textContent;
    }
  }
});

// Update
btnUpdateEl.addEventListener("click", updateTask);

// Remove All Task
btnDeleteEl.addEventListener("click", function () {
  taskList = [];
  deleteAllData();
  displayTaskList();
  console.log(taskList);
});

async function startApp() {
  taskList = await getAllData();
  if (taskList?.length) {
    id = taskList[taskList.length - 1].id + 1;
  }
  displayTaskList();
  console.log(taskList);
}

// Thao tác với dữ liệu hiển thị
function displayTaskList() {
  listContainerEl.innerHTML = "";
  if (taskList.length) {
    taskList.forEach((element) => {
      let li = document.createElement("li");
      li.innerHTML = `${element.content} <i class="fa-solid fa-pen-to-square"></i><i class="fa-solid fa-trash"></i></li>`;
      li.dataset.id = element.id;
      listContainerEl.insertAdjacentElement("afterbegin", li);
      if (element.done) {
        li.classList.add("done");
      }
    });
    updateStatusDeleteBtn();
  }
}

function addTask() {
  const inputValue = inputBoxEl.value.trim();
  if (inputValue) {
    const newTask = { id: id++, content: inputValue, done: false };
    taskList.push(newTask);
    displayTaskList();

    addData(newTask);
    inputBoxEl.value = "";
    updateStatusDeleteBtn();
  }
  console.log(taskList);
}

function updateTask() {
  const task = findTaskById(idUpdate);
  const indexUpdate = taskList.indexOf(task);
  const updatedContent = updateBoxEl.value.trim();
  if (updatedContent) {
    taskList[indexUpdate].content = updatedContent;
    hideUpdateBox();
    updateBoxEl.value = "";
    displayTaskList();

    updateData(taskList[indexUpdate]);
  }
}

function findTaskById(id) {
  return taskList.find((tsk) => tsk?.id == id);
}

// CRUD data with Firebase
function addData(task) {
  set(ref(db, "taskList/" + task.id), task)
    .then(() => {
      console.log("Add successful");
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getAllData() {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, "taskList/"));
  if (snapshot.exists()) {
    const list = snapshot.val();
    return Array.isArray(list) ? list : Object.values(list);
  }
  return [];
}

function getData(id) {
  const dbRef = ref(db);
  get(child(dbRef, "taskList/" + id)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    }
  });
}

function updateData(task) {
  update(ref(db, "taskList/" + task.id), {
    content: task.content,
    done: task.done,
  }).then(() => {
    console.log("update succesfull");
  });
}

function deleteData(id) {
  remove(ref(db, "taskList/" + id)).then(() => {
    updateStatusDeleteBtn();
  });
}

function deleteAllData(id) {
  remove(ref(db, "taskList")).then(() => {
    updateStatusDeleteBtn();
  });
}

// Cập nhật hiển thị
function displayUpdateBox() {
  updateTaskEl.classList.remove("hidden");
  overlayEl.classList.remove("hidden");
}

function hideUpdateBox() {
  updateTaskEl.classList.add("hidden");
  overlayEl.classList.add("hidden");
}

function updateStatusDeleteBtn() {
  if (taskList.length) {
    btnDeleteEl.classList.remove("hidden");
  } else {
    btnDeleteEl.classList.add("hidden");
  }
}
