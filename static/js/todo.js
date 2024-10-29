//todo.js
document.addEventListener('DOMContentLoaded', function() {
    // Function to fade out and remove flash messages
    function removeFlashMessages() {
        const flashMessages = document.querySelectorAll('.alert');
        flashMessages.forEach(function(message) {
            // Start fading out after 3 seconds
            setTimeout(function() {
                message.style.transition = 'opacity 1s';
                message.style.opacity = '0';

                // Remove the element after fade out
                setTimeout(function() {
                    message.remove();
                }, 1000);
            }, 3000);
        });
    }

    // Call the function when the page loads
    removeFlashMessages();
});

document.querySelector("#addToDo").addEventListener("click", addToDo);

document.querySelector(".change-theme").addEventListener("click", function () {
    changeTheme(this);
});

window.addEventListener("keydown", function (key) {
    if (key.code === "Enter") {
        addToDo();
    }
});

function addToDo() {
    const todosList = document.querySelector("#todos");
    const newTodo = document.querySelector("#todoName").value.trim();
    if (newTodo) {
        const li = document.createElement("li");
        li.classList.add("todo-item");

        const todoText = document.createElement("span");
        todoText.setAttribute("id", "todoText");
        todoText.textContent = newTodo;
        todoText.classList.add("todo-text");
        todoText.addEventListener("click", function () {
            editTodo(todoText);
        });

        const doneButton = document.createElement("button");
        doneButton.textContent = "Done 🚀";
        doneButton.classList.add("btn", "done-btn", "btn-md", "btn-dark");

        const removeButton = document.createElement("button");
        removeButton.textContent = "Delete 🗑️";
        removeButton.classList.add("btn", "delete-btn", "btn-md", "btn-dark");

        li.appendChild(todoText);
        li.appendChild(doneButton);
        li.appendChild(removeButton);

        todosList.appendChild(li);

        doneButton.addEventListener("click", () => doneToDo(li));
        removeButton.addEventListener("click", () => removeToDo(li));

        document.querySelector("#todoName").value = "";
    }
}

function doneToDo(li) {
    const todoText = li.querySelector("#todoText");
    todoText.classList.toggle("removedLight");
}

// Edit Todo
document.querySelectorAll('.todo-text').forEach(todoSpan => {
    todoSpan.addEventListener('click', function() {
        const todoId = this.dataset.id;
        const currentText = this.textContent;
        const input = document.createElement('input');
        input.value = currentText;
        input.classList.add('edit-input', 'inputStyle');

        this.textContent = '';
        this.appendChild(input);
        input.focus();

        input.addEventListener('blur', function() {
            updateTodo(todoId, this.value);
        });

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                updateTodo(todoId, this.value);
            }
        });
    });
});

function updateTodo(todoId, newText) {
    fetch(`/update_todo/${todoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: newText})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const todoSpan = document.querySelector(`[data-id="${todoId}"]`);
            todoSpan.textContent = newText;
        }
    })
    .catch((error) => console.error('Error:', error));
}

function removeToDo(li) {
    li.remove();
}

function changeTheme(button) {
    const body = document.body;
    body.classList.toggle("welcomePageLight");
    body.classList.toggle("welcomePageDark");
}

// Toggle Todo
function toggleTodo(todoId) {
    fetch(`/toggle_todo/${todoId}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const todoSpan = document.querySelector(`[data-id="${todoId}"]`);
                todoSpan.classList.toggle('removedLight');
            }
        })
        .catch((error) => console.error('Error:', error));
}

// Delete Todo
function deleteTodo(todoId) {
    fetch(`/delete_todo/${todoId}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const todoItem = document.querySelector(`[data-id="${todoId}"]`).closest('li');
                todoItem.remove();
            }
        })
        .catch((error) => console.error('Error:', error));
}

document.getElementById('addTodoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const todoText = document.getElementById('todoName').value;

    fetch('/add_todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({todo: todoText})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const todosList = document.getElementById('todos');
            const newTodoItem = document.createElement('li');
            newTodoItem.className = 'todo-item';
            newTodoItem.innerHTML = `
                <span class="todo-text" data-id="${data.todo_id}">${todoText}</span>
                <button class="btn btn-md btn-dark done-btn" onclick="toggleTodo(${data.todo_id})">Done 🚀</button>
                <button class="btn btn-md btn-dark delete-btn" onclick="deleteTodo(${data.todo_id})">Delete 🗑️</button>
            `;
            todosList.insertBefore(newTodoItem, todosList.firstChild);
            document.getElementById('todoName').value = '';
        }
    })
    .catch((error) => console.error('Error:', error));
});
