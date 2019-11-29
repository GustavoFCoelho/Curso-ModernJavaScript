const form = document.querySelector("#form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

loadEventListeners();

function loadEventListeners() {

    document.addEventListener('DOMContentLoaded', getTasks)
    form.addEventListener("submit", addTask);
    taskList.addEventListener("click", removeTask);
    taskList.addEventListener("click", goUp);
    taskList.addEventListener("click", goDown);
    clearBtn.addEventListener("click", clearTasks);
    filter.addEventListener("keyup", filterTasks);
}

function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null || localStorage.getItem('tasks') == undefined) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task) {
        createTaskToList(task);
    })
}

function addTask(e) {
    if (taskInput.value === "") {
        alert("Add a task");
        return;
    }
    createTaskToList(taskInput.value);

    storeTaskInLocalStorage(taskInput.value);

    e.preventDefault();
}

function createTaskToList(task){

    const li = document.createElement('li');

    li.className = "collection-item"
    li.innerHTML = "<i class='fa fa-sort-up'></i><i class='fa fa-sort-down'></i>";

    li.appendChild(document.createTextNode(task));

    const link = document.createElement('a');
    link.className = "delete-item secondary-content";
    link.innerHTML = '<i class="fa fa-remove"></i>';

    

    li.appendChild(link);

    taskList.appendChild(li);
}

function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(e) {
    if (e.target.parentElement.classList.contains("delete-item")) {
        if (confirm("Are you sure?")){
            e.target.parentElement.parentElement.remove();
            removeTaskFromStorage(e.target.parentElement.parentElement)
        }
    }
}

function removeTaskFromStorage(taskItem) {
    let tasks;
    if (localStorage.getItem('tasks') === null || localStorage.getItem('tasks') === undefined) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index) {
        if(taskItem.textContent === task){
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    clearAllTask();
}

function clearAllTask() {
    localStorage.clear();
}

function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(".collection-item").forEach(function (task) {
        const item = task.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    })
}

function goUp(e) {
    if(e.target.classList.contains("fa-sort-up")){
        let elements = document.querySelectorAll(".collection-item");
        elements.forEach(function(task){
            if(task.textContent === e.target.parentElement.textContent){
                if(elements[0] === task){
                    return;
                }
                
                let elementIndex = findIndex(elements, task);
                let upperElement = elements[elementIndex-1];

                upperElement.parentElement.insertBefore(task, upperElement);
                
            }
        })
        setTaskNewOrder();
    }
}

function goDown(e) {
    if(e.target.classList.contains("fa-sort-down")){
        let elements = document.querySelectorAll(".collection-item");
        
        elements.forEach(function(task){
            if(task.textContent === e.target.parentElement.textContent){
                
                if(elements[elements.length-1] === task){
                    return;
                }
                
                let elementIndex = findIndex(elements, task);
                let bottomElement = elements[elementIndex+1];

                task.parentElement.insertBefore(bottomElement, task);
            }
        })
        setTaskNewOrder();
    }
}

function findIndex(array, objeto) {
    for (let i = 0; i < array.length; i++) {
        if(array[i] === objeto){
            return i;
        }
    }
}

function setTaskNewOrder(){
    let tasks = [];
    document.querySelectorAll(".collection-item").forEach(function (task) { 
        tasks.push(task.textContent);
    })

    localStorage.setItem("tasks", JSON.stringify(tasks));
}