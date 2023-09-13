
// Getting DOM elements
const inputField = document.getElementById("inputField");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const sortSelect = document.getElementById("sortSelect");
const filterSelect = document.getElementById("filterSelect");

// Task data array
let tasks = [];  //store task object

// Function to render tasks
function renderTasks() { //rendering(make) the list of tasks based on sorting and filtering options
  todoList.innerHTML = "";

  const sortedTasks = tasks.slice(); // Create a copy of tasks to avoid modifying the original array

  // Apply sorting based on select option a and b are two elements from the sortedtasks
  if (sortSelect.value === "oldest") {
    sortedTasks.sort((a, b) => a.dueDate - b.dueDate);
  } 
  else if (sortSelect.value === "newest") {
    sortedTasks.sort((a, b) => b.dueDate - a.dueDate);
  }

  // Apply filtering based on select option
  const filteredTasks = sortedTasks.filter((task) => {
    if (filterSelect.value === "all") {
      return true;
    } 
    else if (filterSelect.value === "completed") {
      return task.completed;
    } 
    else if (filterSelect.value === "active") {
      return !task.completed;
    }
  });

  //Inside the list item, there are buttons for editing, deleting, 
  //and marking the task as complete or incomplete. Each button has an associated event listener that will respond to user interactions.
  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = "item";
    taskItem.innerHTML = `
      <div class="content">
        <input type="text" class="text" value="${task.title}" readonly>
      </div>
      <div class="actions">
        <button class="btn btn-primary edit-button">Edit</button>
        <button class="btn btn-danger delete-button">Delete</button>
        <button class="btn btn-success complete-button">${
          task.completed ? "Incomplete" : "Complete"
        }</button>
      </div>
    `;

    localStorage.setItem("task", JSON.stringify(tasks)); //using setitem data is stored in local storage.
    let retrieve = JSON.parse(localStorage.getItem("task")); //retrieved using localStorage.getItem and logged to the console.
    console.log(retrieve);

    const editButton = taskItem.querySelector(".edit-button");
    const deleteButton = taskItem.querySelector(".delete-button");
    const completeButton = taskItem.querySelector(".complete-button");

    //onclick events
    editButton.addEventListener("click", () => {
    });

    deleteButton.addEventListener("click", () => {
    });

    completeButton.addEventListener("click", () => {
    });

    todoList.appendChild(taskItem); //adding the item to list
  });
}
//search function
document.querySelector("#searchField").addEventListener("input", function () {
  var searchValue = this.value.toLowerCase(); //retrieves the current value of the input field, converts it to lowercase, and assigns it to the variable searchValue
  var taskItems = document.querySelectorAll(".item"); // selects all elements with the class name "item"

  taskItems.forEach(function (taskItem) { //iterate through each task item in list
    var taskName = taskItem.querySelector(".text").value.toLowerCase(); //extracts the value of the task name from the task item
    if (taskName.includes(searchValue)) {
      taskItem.style.display = ""; // Show the task item
    } else {
      taskItem.style.display = "none"; // Hide the task item
    }
  });
});

// Add task function
function addTask(title) { //adding a new task to the tasks array
  const task = {
    title: title,
    dueDate: new Date(), // Add dueDate property
    category: "", // Add category property
    completed: false,
  };

  tasks.push(task);
  renderTasks(); //renderTasks() function is called to update the UI.
}

// Add button click event
//a button that the user can click to add a new task
//When the button is clicked, the code checks if the inputField value (presumably an input field where the user can type task names) 
//is not empty or only whitespace. If not, the addTask function is called with the value of the inputField, and the input field is then cleared.
addButton.addEventListener("click", () => {
  if (inputField.value.trim() !== "") {
    addTask(inputField.value);
    inputField.value = "";
  }
});

renderTasks();

// Edit task function
//responsible for editing the title of a task at a specific index in the tasks array
function editTask(index, newTitle) {
  tasks[index].title = newTitle;
  renderTasks();
}

// Delete task function
//removes a task from the tasks array at the specified index using the splice method
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Toggle completion status function
//toggles the completion status of a task at the specified index.
// It changes the completed property of the task to its opposite value and then calls renderTasks() to update the UI.
function toggleCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Event for edit, delete, and complete buttons
todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-button")) {
    const taskItem = event.target.closest(".item"); //finds the closest ancestor element with the class name "item", which represents the task item.
    const index = Array.from(todoList.children).indexOf(taskItem); //determines the index of the task item within the list
    const newTitle = prompt("Enter the new task title:", tasks[index].title);
    if (newTitle !== null) {
      editTask(index, newTitle);
    }
  } 
  else if (event.target.classList.contains("delete-button")) {
    const taskItem = event.target.closest(".item");
    const index = Array.from(todoList.children).indexOf(taskItem);
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(index);
    }
  } 
  else if (event.target.classList.contains("complete-button")) {
    const taskItem = event.target.closest(".item");
    const index = Array.from(todoList.children).indexOf(taskItem);
    toggleCompletion(index);
  }
});
// Function to sort tasks
// designed to sort the tasks based on different sorting criteria
function sortTasksBy(sortOption) {
  if (sortOption === "dueDate") {
    tasks.sort((a, b) => a.dueDate - b.dueDate);
  } 
  else if (sortOption === "completionStatus") {
    tasks.sort((a, b) => a.completed - b.completed);
  } 
  else if (sortOption === "category") {
    tasks.sort((a, b) => a.category.localeCompare(b.category));
  }
  renderTasks();
}

// Function to filter tasks
//filtering the tasks based on the selected filter option 
function filterTasksBy(filterOption) {
  if (filterOption === "completed") {
    const completedTasks = tasks.filter((task) => task.completed);
    renderTasks(completedTasks);
  } 
  else if (filterOption === "active") {
    const activeTasks = tasks.filter((task) => !task.completed);
    renderTasks(activeTasks);
  } 
  else if (filterOption === "all") {
    renderTasks(tasks); // Display all tasks
  }
}

// Sorting select change event
//When the user selects a sorting option, the event listener triggers the 
//sortTasksBy function, passing in the selected value (sorting criteria) as an argument.
sortSelect.addEventListener("change", () => {
  sortTasksBy(sortSelect.value);
});

// Filtering select change event
//ets up a change event listener on a select element with the ID filterSelect. 
//This element contains filtering options that the user can choose from.
filterSelect.addEventListener("change", () => {
  filterTasksBy(filterSelect.value);
});









