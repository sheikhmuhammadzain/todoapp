const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const tasksCount = document.getElementById("tasks-count");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  const currentFilter =
    document.querySelector(".filter-btn.active").dataset.filter;

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  todoList.innerHTML = "";
  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
            <input type="checkbox" id="todo-${index}" ${
      todo.completed ? "checked" : ""
    }>
            <label for="todo-${index}" class="todo-text ${
      todo.completed ? "completed" : ""
    }">${todo.text}</label>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
    todoList.appendChild(li);

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", () => toggleTodo(index));

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteTodo(index));
  });

  updateTasksCount();
}

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText) {
    todos.push({ text: todoText, completed: false });
    saveTodos();
    todoInput.value = "";
    renderTodos();
  }
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

function updateTasksCount() {
  const activeTasks = todos.filter((todo) => !todo.completed).length;
  tasksCount.textContent = `${activeTasks} task${
    activeTasks !== 1 ? "s" : ""
  } left`;
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTodos();
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

renderTodos();
