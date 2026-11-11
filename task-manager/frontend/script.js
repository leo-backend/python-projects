const API_URL = "http://127.0.0.1:8000/tasks";

// HTML elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const message = document.getElementById("message");

const totalCount = document.getElementById("total-count");
const activeCount = document.getElementById("active-count");
const completedCount = document.getElementById("completed-count");

const clearButton = document.getElementById("clear-button");
const refreshButton = document.getElementById("refresh-button");


// Display a message
function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = isError ? "error-message" : "success-message";
}


// Load tasks from backend
async function loadTasks() {
    try {
        taskList.innerHTML = '<p class="empty-message">Загрузка задач...</p>';

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const tasks = await response.json();

        renderTasks(tasks);

    } catch (error) {
        console.error("Loading error:", error);

        taskList.innerHTML = `
            <p class="empty-message">
                Не удалось загрузить задачи.
                Проверьте подключение к серверу.
            </p>
        `;

        showMessage("Ошибка подключения к API", true);
    }
}


// Render tasks on the page
function renderTasks(tasks) {
    taskList.innerHTML = "";

    totalCount.textContent = tasks.length;

    activeCount.textContent =
        tasks.filter(task => !task.completed).length;

    completedCount.textContent =
        tasks.filter(task => task.completed).length;

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <p class="empty-message">
                Пока задач нет. Добавьте первую!
            </p>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
            console.log("Checkbox changed:", checkbox.checked);
            try {
        const response = await fetch(`${API_URL}/${task.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: checkbox.checked
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        await loadTasks();

         } catch (error) {
        console.error("Error updating task:", error);
        alert("Не удалось обновить задачу");
         }
         });

        const textContainer = document.createElement("div");

        const title = document.createElement("div");
        title.className = "task-title";
        title.textContent = task.title;

        const status = document.createElement("div");
        status.className = "task-status";
        status.textContent = task.completed ? "Completed" : "In progress";

        textContainer.appendChild(title);
        textContainer.appendChild(status);

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(textContainer);

        taskElement.appendChild(taskInfo);

        const editButton = document.createElement("button");
editButton.textContent = "✏️";

editButton.addEventListener("click", () => {
    editTask(task);
});

taskElement.appendChild(editButton);

const deleteButton = document.createElement("button");
deleteButton.textContent = "🗑️";

deleteButton.addEventListener("click", () => {
    deleteTask(task);
});

taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);
    });
}


// Delete an existing task
async function deleteTask(task) {
    const confirmed = confirm(`Delete task "${task.title}"?`);

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${task.id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        await loadTasks();

    } catch (error) {
        console.error("Deletion error:", error);
        alert("Не удалось удалить задачу");
    }
}


// Create a new task
async function createTask(title) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        taskInput.value = "";

        showMessage("The Task succesfully created!");

        await loadTasks();

    } catch (error) {
        console.error("Creation error:", error);

        showMessage("Не удалось создать задачу", true);
    }
}


// Edit an existing task
async function editTask(task) {
    const newTitle = prompt("Enter new task title:", task.title);

    if (newTitle === null) {
        return;
    }

    const title = newTitle.trim();

    if (!title) {
        alert("Task title cannot be empty!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                completed: task.completed
            })
        });

        if (!response.ok) {
            throw new Error("Failed to edit task");
        }

        await loadTasks();

    } catch (error) {
        console.error("Editing error:", error);
        alert("Не удалось изменить задачу");
    }
}


// Handle form submission
taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        showMessage("Введите название задачи", true);
        return;
    }

    await createTask(title);
});


// Clear input
clearButton.addEventListener("click", () => {
    taskInput.value = "";
    showMessage("");
});

// Refresh task list
refreshButton.addEventListener("click", () => {
    showMessage("");
    loadTasks();
});

// Initial loading
loadTasks();