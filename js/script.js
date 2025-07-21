// Get references to the HTML elements
const textInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoList = document.getElementById("todoList");
const finishedList = document.getElementById("finishedList");
// Get the theme toggle button
const themeToggleBtn = document.getElementById("theme-toggle");
// Add an event listener to the theme toggle button
themeToggleBtn.addEventListener("click", () => {
  // Toggle the 'dark-theme' class on the body
  document.body.classList.toggle("dark-theme");
  // Change the button text based on the current theme
  if (document.body.classList.contains("dark-theme")) {
    themeToggleBtn.textContent = "🌞"; // Switch to light theme
  } else {
    themeToggleBtn.textContent = "🌙"; // Switch to dark theme
  }
  saveTasks();
});

// Update the counter for list
const updateTodoCounters = () => {
  [...todoList.children].forEach((li, index) => {
    const span = li.querySelector(".counter");
    if (span) span.textContent = `${index + 1})`;
  });

  [...finishedList.children].forEach((li, index) => {
    const span = li.querySelector(".counter");
    if (span) span.textContent = `${index + 1})`;
  });
};

// Add an event listener to the add task button
addTaskBtn.onclick = () => {
  const taskText = textInput.value.trim();
  if (taskText === "") return;

  // Check if the task already exists in the todo list
  const exists = [...todoList.children].some(
    (li) =>
      li.querySelector(".task-value").textContent.toLowerCase() === taskText
  );
  if (exists) {
    alert("This task already exists!");
    return;
  }

  // Create a new list item for the task
  const li = document.createElement("li");
  li.className = "task-item";

  // Create a div to hold the span of task value
  const taskContent = document.createElement("div");
  taskContent.className = "task-content-container";

  // Create a counter for the todo task
  const counterTodo = document.createElement("span");
  counterTodo.className = "counter";
  counterTodo.textContent = `${todoList.children.length + 1})`;
  taskContent.appendChild(counterTodo);

  //  create span for value of task
  const taskTextNode = document.createElement("span");
  taskTextNode.textContent = taskText;
  taskTextNode.className = "task-value";
  taskContent.appendChild(taskTextNode);

  li.append(taskContent);

  // Create a span for the task creation date
  const createdAt = document.createElement("span");
  createdAt.className = "created-at";
  createdAt.innerHTML = `<span>${new Date().toLocaleString()}</span><i class="fa-solid fa-spinner"></i>`;
  taskContent.appendChild(createdAt);

  // Create a div for actions
  const actions = document.createElement("div");
  actions.className = "actions";

  li.classList.add("fade-in");

  setTimeout(() => {
    li.classList.remove("fade-in");
  }, 500);

  // Create buttons for edit, delete, and finish actions
  //   Edit
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit";
  editBtn.onclick = () => {
    const currentText = li.querySelector(".task-value").textContent;
    const newText = prompt("Edit Your Task:", currentText);
    if (newText === null) return; // User cancelled the prompt
    const trimmed = newText.trim();
    if (!trimmed || trimmed === currentText) return;
    // Check if the new task already exists in the todo list
    const exists = [...todoList.children].some(
      (item) =>
        item !== li &&
        item.querySelector(".task-value").textContent.toLowerCase() ===
          trimmed.toLowerCase()
    );
    if (exists) {
      alert("This task already exists!");
      return;
    }
    li.querySelector(".task-value").textContent = newText;
    updateTodoCounters();
    saveTasks();
  };
  //   Delete
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete";
  deleteBtn.onclick = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateTodoCounters();
      saveTasks();
    }
  };
  //   Finish
  const finishBtn = document.createElement("button");
  finishBtn.textContent = "Finish";
  finishBtn.className = "finish";
  finishBtn.onclick = () => {
    const oldActions = li.querySelector(".actions");
    if (oldActions) oldActions.remove();
    if (createdAt) createdAt.remove();

    //
    li.classList.add("move-in");

    setTimeout(() => {
      li.classList.remove("move-in");
    }, 500);

    //  Create a new actions div for the finished task
    const deleteFinishedBtn = document.createElement("button");
    deleteFinishedBtn.textContent = "Delete";
    deleteFinishedBtn.className = "delete-finished";
    deleteFinishedBtn.onclick = () => {
      if (confirm("Are you sure you want to delete this finished task?")) {
        li.remove();
        updateTodoCounters();
        saveTasks();
      }
    };

    // Create a span for the task finished date
    const finishedAt = document.createElement("span");
    finishedAt.className = "finished-at";
    finishedAt.innerHTML = `<span>${new Date().toLocaleString()}</span><i class="fa-solid fa-clipboard-check"></i>`;
    taskContent.appendChild(finishedAt);

    const finishActions = document.createElement("div");
    finishActions.className = "actions";
    finishActions.appendChild(deleteFinishedBtn);
    li.appendChild(finishActions);

    finishedList.appendChild(li);

    updateTodoCounters();
    saveTasks();
  };

  //   Append buttons to actions div and then to the list item

  actions.append(editBtn, deleteBtn, finishBtn);
  li.appendChild(actions);
  todoList.appendChild(li);

  textInput.value = "";
  updateTodoCounters();
  saveTasks();
};

// Add an event listener to the Todo search input

document
  .getElementById("TodoSearchInput")
  .addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const allTasks = document.querySelectorAll("#todoList li");

    allTasks.forEach((task) => {
      const taskText =
        task.querySelector(".task-value")?.textContent.toLowerCase() || "";
      task.style.display = taskText.includes(keyword) ? "flex" : "none";
    });
  });
// Add an event listener to the finished search input
document
  .getElementById("finishedSearchInput")
  .addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    const allTasks = document.querySelectorAll("#finishedList li");

    allTasks.forEach((task) => {
      const taskText =
        task.querySelector(".task-value")?.textContent.toLowerCase() || "";
      task.style.display = taskText.includes(keyword) ? "flex" : "none";
    });
  });

// Save tasks to localStorage

const saveTasks = () => {
  localStorage.setItem("todoTasks", todoList.innerHTML);
  localStorage.setItem("finishTasks", finishedList.innerHTML);
  updateTodoCounters();

  // add dark theme to localStorage
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

const rebindButtons = (list) => {
  [...list.children].forEach((li) => {
    const taskValue = li.querySelector(".task-value");
    const actions = li.querySelector(".actions");

    if (!taskValue || !actions) return;

    actions.innerHTML = ""; // Clear existing actions

    // Recreate the edit, delete, and finish buttons
    if (list === todoList) {
      // Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit";
      editBtn.onclick = () => {
        const currentText = taskValue.textContent;
        const newText = prompt("Edit Your Task:", currentText);
        if (newText === null) return;
        const trimmed = newText.trim();
        if (!trimmed || trimmed === currentText) return;

        const exists = [...todoList.children].some(
          (item) =>
            item !== li &&
            item.querySelector(".task-value").textContent.toLowerCase() ===
              trimmed.toLowerCase()
        );
        if (exists) {
          alert("This task already exists!");
          return;
        }
        taskValue.textContent = trimmed;
        updateTodoCounters();
        saveTasks();
      };

      // Delete button for todo tasks
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete";
      deleteBtn.onclick = () => {
        if (confirm("Are you sure you want to delete this task?")) {
          li.remove();
          updateTodoCounters();
          saveTasks();
        }
      };

      // Finish button for todo tasks

      const finishBtn = document.createElement("button");
      finishBtn.textContent = "Finish";
      finishBtn.className = "finish";
      finishBtn.onclick = () => {
        actions.remove();

        const deleteFinishedBtn = document.createElement("button");
        deleteFinishedBtn.textContent = "Delete";
        deleteFinishedBtn.className = "delete-finished";
        deleteFinishedBtn.onclick = () => {
          if (confirm("Are you sure you want to delete this finished task?")) {
            li.remove();
            updateTodoCounters();
            saveTasks();
          }
        };

        // Create a new actions div for the finished task
        const finishActions = document.createElement("div");
        finishActions.className = "actions";
        finishActions.appendChild(deleteFinishedBtn);
        li.appendChild(finishActions);
        finishedList.appendChild(li);
        updateTodoCounters();
        saveTasks();
      };
      // Append buttons to actions div
      actions.append(editBtn, deleteBtn, finishBtn);
    } else {
      // For finished tasks, only the delete button is needed
      const deleteFinishedBtn = document.createElement("button");
      deleteFinishedBtn.textContent = "Delete";
      deleteFinishedBtn.className = "delete-finished";
      deleteFinishedBtn.onclick = () => {
        if (confirm("Are you sure you want to delete this finished task?")) {
          li.remove();
          updateTodoCounters();
          saveTasks();
        }
      };
      // Append the delete button to actions div
      actions.appendChild(deleteFinishedBtn);
    }
  });
};

// Load tasks from localStorage when the page loads
window.onload = () => {
  const savedTodoTasks = localStorage.getItem("todoTasks");
  const savedFinishTasks = localStorage.getItem("finishTasks");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggleBtn.textContent = "🌞"; // Switch to light theme
  } else {
    document.body.classList.remove("dark-theme");
    themeToggleBtn.textContent = "🌙"; // Switch to dark theme
  }
  // Load saved tasks into the lists
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    themeToggleBtn.textContent = savedTheme === "dark" ? "🌞" : "🌙";
  }

  if (savedTodoTasks) {
    todoList.innerHTML = savedTodoTasks;
    rebindButtons(todoList);
  }
  if (savedFinishTasks) {
    finishedList.innerHTML = savedFinishTasks;
    rebindButtons(finishedList);
  }
  updateTodoCounters();
};

textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTaskBtn.click();
    event.preventDefault(); // Prevent form submission if inside a form
  }
});
