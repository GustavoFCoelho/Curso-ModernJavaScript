import { http } from "./http"
import { ui } from "./ui"

document.addEventListener("DOMContentLoaded", getPosts)
document.querySelector(".post-submit").addEventListener("click", submitPost)
ui.post.addEventListener("click", enableEdit);
document.querySelector(".card-form").addEventListener('click', cancelEdit);
document.querySelector('#posts').addEventListener("click", deletePost);

const baseUrl = 'http://localhost:3000/posts'

function getPosts() {
    http.get(baseUrl)
        .then((data) => {
            ui.showPosts(data);
        }).catch(err => {
            console.log(err);
        })
}

function submitPost() {
    const title = ui.titleInput.value
    const body = ui.bodyInput.value
    const id = ui.idInput.value;

    if (title === "" || body === "") {
        ui.showAlert("Please fill in all field", "alert alert-danger mt-3");
        return;
    }

    const data = {
        title,
        body
    }

    if (id === '') {

        http.post(baseUrl, data)
            .then(data => {
                getPosts();
                ui.showAlert("Post added", "alert alert-success mt-3");
                ui.clearFields();
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        const data = {
            title,
            body
        }
        http.put(baseUrl + `\\${id}`, data)
            .then(data => {
                getPosts();
                ui.showAlert("Post updated", "alert alert-success mt-3");
                ui.clearFields();
                ui.changeFormState('add')
            })
            .catch(err => {
                console.log(err);
            })
    }
}

function enableEdit(e) {
    e.preventDefault();

    if (e.target.parentElement.classList.contains("edit")) {
        const id = e.target.parentElement.dataset.id;
        const body = e.target.parentElement.previousElementSibling.textContent
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent

        const data = {
            id,
            title,
            body
        }

        ui.fillForm(data);
    }
}

function cancelEdit(e) {
    e.preventDefault()
    if (e.target.classList.contains("post-cancel")) {
        ui.changeFormState('add')
    }
}

function deletePost(e) {
    e.preventDefault();

    if (e.target.parentElement.classList.contains("delete")) {
        const id = e.target.parentElement.dataset.id;       

        http.delete(baseUrl + `\\${id}`)
            .then(data => {
                getPosts();
                ui.showAlert("Post deleted", "alert alert-warning mt-3");
                ui.clearFields();
            })
            .catch(err => {
                console.log(err);
            })

        ui.changeFormState('add');
    }
}