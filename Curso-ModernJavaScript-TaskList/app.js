const form = document.querySelector("#form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

let maxItensPerPage;
let totalOfItens;
let numberOfPages;

loadEventListeners();


//====================================================================
// Carrega Lista de eventos
//====================================================================
function loadEventListeners() {

    document.addEventListener('DOMContentLoaded', getTasks)
    document.addEventListener('DOMContentLoaded', generatePaginationSystem)
    form.addEventListener("submit", addTask);
    taskList.addEventListener("click", removeTask);
    taskList.addEventListener("click", goUp);
    taskList.addEventListener("click", goDown);
    clearBtn.addEventListener("click", clearTasks);
    filter.addEventListener("keyup", filterTasks);
}

//====================================================================
// Carrega tasks salvas no localstorage
//====================================================================
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

//====================================================================
// Adiciona nova tarefa
//====================================================================
function addTask(e) {
    if (taskInput.value === "") {
        alert("Add a task");
        return;
    }
    createTaskToList(taskInput.value);

    storeTaskInLocalStorage(taskInput.value);

    e.preventDefault();
}

//====================================================================
// Adiciona novo elemento para a lista
//====================================================================
function createTaskToList(task) {

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

//====================================================================
// Adiciona novo item na localstorage
//====================================================================
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

//====================================================================
// Remove tarefa
//====================================================================
function removeTask(e) {
    if (e.target.parentElement.classList.contains("delete-item")) {
        if (confirm("Are you sure?")) {
            e.target.parentElement.parentElement.remove();
            removeTaskFromStorage(e.target.parentElement.parentElement)
        }
    }
}

//====================================================================
// Remove tarefa do localstorage
//====================================================================
function removeTaskFromStorage(taskItem) {
    let tasks;
    if (localStorage.getItem('tasks') === null || localStorage.getItem('tasks') === undefined) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task, index) {
        if (taskItem.textContent === task) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//====================================================================
// Limpa todas as tarefas
//====================================================================
function clearTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    clearAllTask();
}

//====================================================================
// Limpa todas as tarefas do localstorage
//====================================================================
function clearAllTask() {
    localStorage.clear();
}

//====================================================================
// Busca as tarefas
//====================================================================
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

//====================================================================
// Troca a posição do elemento com o elemento de cima
//====================================================================
function goUp(e) {
    if (e.target.classList.contains("fa-sort-up")) {
        let elements = document.querySelectorAll(".collection-item");
        elements.forEach(function (task) {
            if (task.textContent === e.target.parentElement.textContent) {
                if (elements[0] === task) {
                    return;
                }

                let elementIndex = findIndex(elements, task);
                let upperElement = elements[elementIndex - 1];

                upperElement.parentElement.insertBefore(task, upperElement);

            }
        })
        setTaskNewOrder();
    }
}

//====================================================================
// Troca a posição com o elemento a baixo
//====================================================================
function goDown(e) {
    if (e.target.classList.contains("fa-sort-down")) {
        let elements = document.querySelectorAll(".collection-item");

        elements.forEach(function (task) {
            if (task.textContent === e.target.parentElement.textContent) {

                if (elements[elements.length - 1] === task) {
                    return;
                }

                let elementIndex = findIndex(elements, task);
                let bottomElement = elements[elementIndex + 1];

                task.parentElement.insertBefore(bottomElement, task);
            }
        })
        setTaskNewOrder();
    }
}

//====================================================================
// Procura o index em um array
//====================================================================
function findIndex(array, objeto) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === objeto) {
            return i;
        }
    }
}

//====================================================================
// Após a troca de posição troca seta a nova ordem no localstorage
//====================================================================
function setTaskNewOrder() {
    let tasks = [];
    document.querySelectorAll(".collection-item").forEach(function (task) {
        tasks.push(task.textContent);
    })

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//====================================================================
// Gera sistema de paginação
//====================================================================
function generatePaginationSystem() {
    let colecao = document.querySelectorAll(".collection-item");

    totalOfItens = colecao.length;
    maxItensPerPage = 5;
    numberOfPages = parsePagesNumber(totalOfItens/maxItensPerPage);

    console.log(numberOfPages);

    if (totalOfItens > maxItensPerPage) {
        colecao.forEach(function (task) {
            let taskIndex = findIndex(colecao, task)
            if (taskIndex > maxItensPerPage - 1) {
                colecao[taskIndex].style.display = "none";
            }
        })

        let ul = document.createElement("ul");
        ul.classList.add("pagination");
        let previousPage = document.createElement("li");
        previousPage.innerHTML = '<a href="#!"><i class="fa fa-arrow-left"></i></a>';
        ul.append(previousPage);

        for (let i = 0; i < numberOfPages; i++) {
            let pageNumber = document.createElement("li");
            pageNumber.classList.add("pagination-item");
            pageNumber.innerHTML = '<a href="#!">'+ (i+1) +'</a>';
            ul.append(pageNumber)
        }

        let nextPage = document.createElement("li");
        nextPage.innerHTML = '<a href="#!"><i class="fa fa-arrow-right"></i></a>';
        ul.append(nextPage);

        taskList.append(ul);
    }
}

//====================================================================
// Retorna a quantidade de páginas
//====================================================================
function parsePagesNumber(numero) {
    let inteiro = Number.parseInt(numero);
    if(numero > inteiro){
        return inteiro + 1
    } else { 
        return inteiro - 1
    }
}