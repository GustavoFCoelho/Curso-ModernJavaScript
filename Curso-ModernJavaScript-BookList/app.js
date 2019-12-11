function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function UI(){}

UI.prototype.addBookToList = function (book) { 
    const list = document.getElementById("bookList");
    const row = document.createElement("tr");
    row.innerHTML = `<td>${book.title}</td>
                     <td>${book.author}</td>
                     <td>${book.isbn}</td>
                     <td><a href="#" class="delete">X</a></td>`;
    list.appendChild(row);
}

UI.prototype.clearFields = function () { 
    document.getElementById("title").value = "";  
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
}

const form = document.getElementById("book-form");

form.addEventListener("submit", add);


UI.prototype.showAlert = function(message, classname){
    const div = document.createElement("div");
    div.className = "alert " + classname;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    container.insertBefore(div, form);
    
    setTimeout(() => {
        document.querySelector(".alert").remove();
    }, 3000);
}

UI.prototype.deleteBook = function(target){
    if(target.className === "delete"){
        target.parentElement.parentElement.remove();
    }
}

function add(e){
    e.preventDefault();

    const title = document.getElementById("title").value,   
          author = document.getElementById("author").value,
          isnb = document.getElementById("isbn").value;

    const ui = new UI();

    if(title === "" ||author === "" ||isnb === ""){
        ui.showAlert('Please Fill in all fields', "error");
        return;
    }

    const book = new Book(title, author, isnb);

    ui.addBookToList(book);
    ui.showAlert("The book was added succeful", "success")
    ui.clearFields();
}

const bookList = document.getElementById("bookList");
bookList.addEventListener("click", remove);

function remove(e) {
    
    const ui = new UI();

    ui.deleteBook(e.target);

    ui.showAlert("The book was removed from the list", "success");

    e.preventDefault();
}