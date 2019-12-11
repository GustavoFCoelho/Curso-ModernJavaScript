const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputISBN = document.getElementById("isbn");

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        const list = document.getElementById("bookList");
        const row = document.createElement("tr");
        row.classList.add("selected-item");
        row.innerHTML = `<td class="item-title">${book.title}</td>
                         <td class="item-author">${book.author}</td>
                         <td class="item-isbn">${book.isbn}</td>
                         <td><a href="#" class="delete">X</a></td>`;
        list.appendChild(row);
    }

    clearFields() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";

        inputISBN.disabled = false;
    }

    showAlert(message, classname) {
        const div = document.createElement("div");
        div.className = "alert " + classname;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        container.insertBefore(div, document.getElementById("book-form"));

        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    deleteBook(target) {
        target.parentElement.parentElement.remove();
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("bookList") === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem("bookList"));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(element => {
            const ui = new UI();

            ui.addBookToList(element);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book)
        localStorage.setItem("bookList", JSON.stringify(books))
    }

    static removeBooks(isbn) {
        let books = this.getBooks();
        books.forEach(function (element, index) {
            if (element.isbn === isbn) {
                books.splice(index, 1)
            }
        })
        localStorage.setItem("bookList", JSON.stringify(books))
    }

    static alterBook(book){
        const books = this.getBooks();

        books.forEach(b1 => {
            if(b1.isbn === book.isbn){
                b1.title = book.title;
                b1.author = book.author;
                return;
            }
        })
        localStorage.setItem("bookList", JSON.stringify(books))
    }
}

class Events {
    static add(e) {
        if(inputISBN.disabled){
            return;
        }
        e.preventDefault();

        const title = document.getElementById("title").value,
            author = document.getElementById("author").value,
            isbn = document.getElementById("isbn").value;

        const ui = new UI();

        if (title === "" || author === "" || isbn === "") {
            ui.showAlert('Please Fill in all fields', "error");
            return;
        }

        const book = new Book(title, author, isbn);

        Store.addBook(book)

        ui.addBookToList(book);

        ui.showAlert("The book was added succeful", "success")
        ui.clearFields();
    }

    static remove(e) {

        if (e.target.className === "delete") {
            Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
            const ui = new UI();
            ui.deleteBook(e.target);
            ui.showAlert("The book was removed from the list", "success");
            e.preventDefault();
        }
    }

    static selectElement(e) {
        if (e.target.className === "delete") {
            return;
        }

        if (e.target.parentElement.classList.contains("selected-item")) {
            const row = e.target.parentElement;
            row.childNodes.forEach(node =>{
                if(node.className === "item-title"){
                    inputTitle.value = node.textContent;
                } else if(node.className === "item-author"){
                    inputAuthor.value = node.textContent;
                } else if(node.className === "item-isbn"){
                    inputISBN.value = node.textContent;
                }
                
            })
            inputISBN.disabled = true;
        }
    }

    static alterar(e){
        if(!inputISBN.disabled){
            return;
        }
        e.preventDefault();

        const ui = new UI();
        let childNode;
        const book = new Book(inputTitle.value, inputAuthor.value, inputISBN.value);

        if (book.title === "" || book.author === "" || book.isbn === "") {
            ui.showAlert('Please Fill in all fields', "error");
            return;
        }

        document.getElementById("bookList").childNodes.forEach(child =>{
            if(child.lastChild.previousElementSibling.textContent == book.isbn){
                childNode = child;
                return;
            }
        })

        childNode.childNodes.forEach(node => {
            if(node.className === "item-title"){
                node.textContent = book.title;
            } else if(node.className === "item-author"){
                node.textContent = book.author;
            } else if(node.className === "item-isbn"){
                node.textContent = book.isbn;
            }
        })

        ui.clearFields();
        Store.alterBook(book);
    }
}

const form = document.getElementById("book-form");
const bookList = document.getElementById("bookList");

form.addEventListener("submit", Events.add);
form.addEventListener("submit", Events.alterar)
bookList.addEventListener("click", Events.remove);
bookList.addEventListener("click", Events.selectElement);
document.addEventListener("DOMContentLoaded", Store.displayBooks);

