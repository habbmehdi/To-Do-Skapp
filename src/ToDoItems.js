import React from "react";

const ToDoItems = (props) => {
    console.log(props.AllTasks)

    const deleteTask = (task) => {
        props.deleteT(task);
    }

    // what if all tasks is empty

    var listItems
    if (props.AllTasks.length > 0) {
    listItems = props.AllTasks.map((task, index) =>
    <li>{task}<button id="sbutton" onClick={() => deleteTask(index)}>Delete</button ></li>

  )}else{
    listItems = []
  };
      return (
        <ul>
          <div className="container">
            <span>{listItems}</span>
          </div>
        </ul>
      );
    };
  export default ToDoItems;