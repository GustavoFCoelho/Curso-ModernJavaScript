const form = document.querySelector("#form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

let maxItensPerPage;
let totalOfItens;
let numberOfPages;
let paginationIndexs = []
let paginaAtual = 1;
let pageGerada = false;

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
    taskList.addEventListener("click", changeNextPage);
    taskList.addEventListener("click", changePreviousPage);
    taskList.addEventListener("click", jumpToPage);
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
    if (!pageGerada) {
        generatePaginationSystem();
    }

    e.preventDefault();


    jumpToFinalPage();
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

    if (pageGerada) {
        taskList.insertBefore(li, taskList.lastChild);
    } else {
        taskList.appendChild(li);
    }

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
    numberOfPages = parsePagesNumber(totalOfItens / maxItensPerPage);

    if (totalOfItens > maxItensPerPage) {
        pageGerada = true;
        colecao.forEach(function (task) {
            let taskIndex = findIndex(colecao, task)
            if (taskIndex > maxItensPerPage - 1) {
                colecao[taskIndex].style.display = "none";
            } else {
                paginationIndexs.push(taskIndex);
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
            pageNumber.innerHTML = '<a href="#!">' + (i + 1) + '</a>';
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
    if (numero > inteiro) {
        return inteiro + 1
    } else if(numero == inteiro){
        return inteiro
    } else {
        return inteiro - 1
    }
}

//====================================================================
// Avança para a próxima página
//====================================================================
function changeNextPage(e) {
    if (e.target.classList.contains("fa-arrow-right")) {
        let elements = document.querySelectorAll('.collection-item');

        let aux = [];

        paginationIndexs.forEach(function (indice) {
            elements[indice].style.display = 'none';
            if (elements[indice + maxItensPerPage] !== undefined) {
                elements[indice + maxItensPerPage].style.display = 'block';
                aux.push(indice + maxItensPerPage);
            }
        })

        while (paginationIndexs.length !== 0) {
            paginationIndexs.pop();
        }

        paginationIndexs = aux;

        if (paginaAtual == numberOfPages) {
            e.target.parentElement.parentElement.style.display = 'none';
        }

        if (e.target.parentElement.parentElement.parentElement.firstChild.style.display === 'none') {
            e.target.parentElement.parentElement.parentElement.firstChild.style.display = 'inline';
        }

        paginaAtual++;
    }
}

//====================================================================
// Volta para página anterior
//====================================================================
function changePreviousPage(e) {
    if (e.target.classList.contains("fa-arrow-left")) {
        let elements = document.querySelectorAll('.collection-item');

        let aux = [];

        let lastIndex;

        let paginationLenght = paginationIndexs.length;

        while (paginationIndexs.length !== 0) {
            let indice = paginationIndexs.pop();
            elements[indice].style.display = 'none';

            if (elements[indice - paginationLenght] !== undefined) {
                elements[indice - paginationLenght].style.display = 'block';
                aux.push(indice - paginationLenght);
            }

            lastIndex = indice - paginationLenght;
        }

        while (aux.length < maxItensPerPage) {
            lastIndex--;
            elements[lastIndex].style.display = 'block';
            aux.push(lastIndex);
        }

        paginationIndexs = aux;

        if (paginationIndexs[0] === 0) {
            e.target.parentElement.parentElement.style.display = 'none';
        }

        if (e.target.parentElement.parentElement.parentElement.lastChild.style.display === 'none') {
            e.target.parentElement.parentElement.parentElement.lastChild.style.display = 'inline';
        }

        paginaAtual--;
    }
}

//====================================================================
// Pular para página selecionada
//====================================================================
function jumpToPage(e) {
    if (e.target.parentElement.classList.contains("pagination-item")) {

        let pagina = e.target.textContent

        if (pagina == paginaAtual) {
            return;
        }

        let elements = document.querySelectorAll(".collection-item");

        elements.forEach(function (task) {
            task.style.display = 'none';
        })

        if (pagina > paginaAtual) {
            let aux = [];

            let i = 0
            while (paginationIndexs.length != 0) {
                let index = paginationIndexs[i] + (maxItensPerPage * (pagina - paginaAtual));
                elements[index].style.display = 'block';

                aux.push(index);

                paginationIndexs.reverse();
                paginationIndexs.pop();
                paginationIndexs.reverse();
                if (elements[index + 1] === undefined)
                    break;
            }

            paginationIndexs = aux;
        } else {
            let aux = [];

            let i = 0
            let index;
            while (paginationIndexs.length != 0) {
                index = paginationIndexs[i] - maxItensPerPage * (paginaAtual - pagina);
                elements[index].style.display = 'block';

                aux.push(index);

                paginationIndexs.reverse();
                paginationIndexs.pop();
                paginationIndexs.reverse();
            }

            while (aux.length != maxItensPerPage) {
                index++;
                elements[index].style.display = 'block';
                aux.push(index);
            }

            paginationIndexs = aux;
        }

        paginaAtual = pagina;
    }
}
//====================================================================
// Pular para página final
//====================================================================
function jumpToFinalPage() {
    let elements = document.querySelectorAll('.collection-item');

    let items = []

    elements.forEach(function (task) {
        task.style.display = 'none';
        items.push(task);
    })

    do {
        let item = items.pop()
        item.style.display = 'block';
        paginationIndexs.push(items.length);
    } while (items.length % maxItensPerPage != 0);

    if(document.querySelectorAll('.collection-item').length % maxItensPerPage == 1){
        let ul = taskList.lastChild
        let pageNumber = document.createElement("li");
        pageNumber.classList.add("pagination-item");
        pageNumber.innerHTML = '<a href="#!">' + (numberOfPages + 1) + '</a>';
        ul.insertBefore(pageNumber, ul.lastChild)
        numberOfPages++;
    }
}
