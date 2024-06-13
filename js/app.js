document.addEventListener("DOMContentLoaded", () => {
    let taskForm = document.getElementById("taskForm");
    let taskList = document.getElementById("taskList");
    let editTaskModal = new bootstrap.Modal(document.getElementById("editTaskModal"));
    let editTaskForm = document.getElementById("editTaskForm");
    let contactForm = document.getElementById("contactForm");
    let messageInput = document.getElementById("message");
    let charCount = document.getElementById("charCount");

    let sortOptions = document.getElementById("sortOptions");
    let tasks = [];

    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(data => {
            tasks = data.slice(0, 10).map(task => ({
                ...task,
                description: "This is a dummy description",
                deadline: "2024-06-15",
                completed: false,
            }));
            renderTasks();
        });

    taskForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (!validateTaskForm(taskForm)) {
            return;
        }
        let title = document.getElementById("title").value;
        let description = document.getElementById("description").value;
        let deadline = document.getElementById("deadline").value;

        let newTask = {
            userId: 1,
            id: Date.now(),
            title: title,
            description,
            deadline,
            completed: false
        };
        tasks.push(newTask);
        renderTasks();
        taskForm.reset();
    });

    editTaskForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (!validateTaskForm(editTaskForm)) {
            return;
        }
         let id = document.getElementById("editTaskId").value;
        let title = document.getElementById("editTitle").value;
        let description = document.getElementById("editDescription").value;
        let deadline = document.getElementById("editDeadline").value;

        let taskIndex = tasks.findIndex(task => task.id == id);
        if (taskIndex !== -1) {
            tasks[taskIndex].title = title;
            tasks[taskIndex].description = description;
            tasks[taskIndex].deadline = deadline;
        }

        renderTasks();
        editTaskModal.hide();
        editTaskForm.reset();
    });

    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (!validateForm(contactForm)) {
            return;
        }
        contactForm.reset();
        updateCharCount();
    });

    messageInput.addEventListener("input", updateCharCount);

    sortOptions.addEventListener("change", renderTasks);

    function renderTasks() {
        taskList.innerHTML = "";
        let sortedTasks = [...tasks];

        switch (sortOptions.value) {
            case "title":
                sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "deadline":
                sortedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                break;
        }

        sortedTasks.forEach(addTaskToDOM);
    }

    function addTaskToDOM(task) {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center testLI";
        li.setAttribute("data-task-id", task.id);

        let deadlineDate = new Date(task.deadline);
        let isOverdue = deadlineDate < new Date();

        li.innerHTML = `
            <div class="div1">
                <input type="checkbox" class="form-check-input me-2 cursor-pointer delete-task" data-id="${task.id}">
                <span class="task-title fw-bold">${task.title}</span>
                ${isOverdue ? '<span class="text-danger">(Overdue)</span>' : ''}
                <br>
                <span class="task-deadline ${isOverdue ? 'text-danger' : ''}">${task.deadline}</span>
            </div>
            <div class="div2">
                <button class="btn btn-info view-task" data-bs-toggle="modal" data-bs-target="#taskModal" data-description="${task.description}">View</button>
                <button class="btn btn-warning edit-task" data-id="${task.id}">Edit</button>
            </div>
        `;
        taskList.appendChild(li);

        li.querySelector(".delete-task").addEventListener("change", (e) => {
            if (e.target.checked) {
                tasks = tasks.filter(task => task.id != e.target.getAttribute('data-id'));
                renderTasks();
            }
        });

    li.querySelector('.view-task').addEventListener('click', (e) => {
        document.getElementById('taskModalBody').textContent = e.target.getAttribute('data-description');
    });

        li.querySelector(".edit-task").addEventListener("click", () => {
            const task = tasks.find(task => task.id == li.getAttribute('data-task-id'));
            if (task) {
                document.getElementById('editTaskId').value = task.id;
                document.getElementById('editTitle').value = task.title;
                document.getElementById('editDescription').value = task.description;
                document.getElementById('editDeadline').value = task.deadline;
                editTaskModal.show();
            }
        });
    }

    function validateTaskForm(form) {
        let isValid = true;
        let inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });
        return isValid;
    }

    function validateForm(form) {
        let isValid = true;
        let inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });
        return isValid;
    }

    function updateCharCount() {
        let currentLength = messageInput.value.length;
        charCount.textContent = `${currentLength}/100 characters used`;
    }

    // Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__lightSpeedInLeft');
                observer.unobserve(entry.target);  
            }
        });
    }, {
        threshold: 0.6
    });

    const quoteParagraph = document.querySelector('.qoute-paragraph');
    observer.observe(quoteParagraph);
});

let moonIcon = document.getElementById("moonIcon");
let sunIcon = document.getElementById("sunIcon");
let themeStylesheet = document.getElementById("themeStylesheet");

function toggleTheme() {
    if (themeStylesheet.getAttribute("href") === "css/style.css") {
        themeStylesheet.setAttribute("href", "css/darkTheme.css");
        moonIcon.style.display = "none";
        sunIcon.style.display = "block";
    } else {
        themeStylesheet.setAttribute("href", "css/style.css");
        moonIcon.style.display = "block";
        sunIcon.style.display = "none";
    }
}


