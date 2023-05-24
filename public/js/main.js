const deleteBtn = document.querySelectorAll(".del");
const todoItem = document.querySelectorAll("span.not");
const todoComplete = document.querySelectorAll("span.completed");

Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", markIncomplete);
});

async function deleteTodo() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markComplete() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/markComplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markIncomplete() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/markIncomplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var sortableList = document.getElementById("sortableList");
  Sortable.create(sortableList, {
    animation: 150, // Set animation duration in milliseconds
    // Add any additional Sortable options as needed
    // ...
    onUpdate: async function (event) {
      // Callback function triggered when the order is updated
      var updatedOrder = Array.from(sortableList.children).map(function (
        item,
        ind
      ) {
        return {
          taskId: item.dataset.id,
          taskName: item.innerText,
          order: ind + 1,
        };
      });
      // You can send the updated order to the server or perform any other actions
      try {
        const response = await fetch("todos/updateTasksOrder", {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            newTasks: updatedOrder,
          }),
        }).then((data) => data.json());
        console.log(response);
        // location.reload();
      } catch (err) {
        console.log(err);
      }
    },
  });
});
