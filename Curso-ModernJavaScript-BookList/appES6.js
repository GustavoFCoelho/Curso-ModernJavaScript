class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book) { 
        const list = document.getElementById("bookList");
        const row = document.createElement("tr");
        row.innerHTML = `<td>${book.title}</td>
                         <td>${book.author}</td>
                         <td>${book.isbn}</td>
                         <td><a href="#" class="delete">X</a></td>`;
        list.appendChild(row);
    }

    clearFields(){ 
        document.getElementById("title").value = "";  
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }

    showAlert(message, classname){
        const div = document.createElement("div");
        div.className = "alert " + classname;
        div.appendChild(document.createTextNode(message));
    
        const container = document.querySelector(".container");
        container.insertBefore(div, document.getElementById("book-form"));
        
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    deleteBook(target){
        if(target.className === "delete"){
            target.parentElement.parentElement.remove();
        }
    }
}

class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem("bookList") === null){
            books = []
        } else {
            books = JSON.parse(localStorage.getItem("bookList"));
        }

        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(element => {
            const ui = new UI();

            ui.addBookToList(element);
        });
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book)
        localStorage.setItem("bookList", JSON.stringify(books))
    }

    static removeBooks(isbn){
        let books = this.getBooks();
        books.forEach(function (element, index) {
            if(element.isbn === isbn){
                books.splice(index, 1)
            }
        })
        localStorage.setItem("bookList", JSON.stringify(books))
    }
}

const form = document.getElementById("book-form");
const bookList = document.getElementById("bookList");

form.addEventListener("submit", add);
bookList.addEventListener("click", remove);
document.addEventListener("DOMContentLoaded", Store.displayBooks);

function add(e){
    e.preventDefault();

    const title = document.getElementById("title").value,   
          author = document.getElementById("author").value,
          isbn = document.getElementById("isbn").value;

    const ui = new UI();

    if(title === "" ||author === "" ||isbn === ""){
        ui.showAlert('Please Fill in all fields', "error");
        return;
    }

    const book = new Book(title, author, isbn);

    Store.addBook(book)

    ui.addBookToList(book);

    ui.showAlert("The book was added succeful", "success")
    ui.clearFields();
}

function remove(e) {
    
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

    const ui = new UI();

    ui.deleteBook(e.target);

    ui.showAlert("The book was removed from the list", "success");

    e.preventDefault();
}