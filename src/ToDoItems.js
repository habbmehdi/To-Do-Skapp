import React from "react";

const ToDoItems = (props) => {
    console.log(props.AllTasks)

    const deleteTask = (task) => {
        props.deleteT(task);
    }

    var listItems
    if (props.AllTasks != null) {
    listItems = props.AllTasks.map((task, index) =>
    <li><button id="sbutton" onClick={() => deleteTask(index)}>Delete</button ><div id="taskbutton">{task}</div></li>

  )}else{
    listItems = "No tasks available"
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