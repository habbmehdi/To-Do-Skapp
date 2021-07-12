import React, { useState, useEffect } from 'react';
import { Button} from 'semantic-ui-react';
import ToDoItems from "./ToDoItems.js";

// Import the SkynetClient and a helper
import { SkynetClient } from 'skynet-js';

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const portal =
  window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;

// Initiate the SkynetClient
const client = new SkynetClient(portal);
 
function ToDoList(){

    const [mySky, setMySky] = useState();
    const [loggedIn, setLoggedIn] = useState(null);
    const [AllTasks, setAllTasks] = useState([]);
    

    const hostApp = 'localhost';

    useEffect(() => {
        async function initMySky() {
            try {

              // load invisible iframe and define app's data domain
              // needed for permissions write
              const mySky = await client.loadMySky(hostApp);
          
              // load necessary DACs and permissions
              //await mySky.loadDacs(contentRecord);
          
              // check if user is already logged in with permissions
              const loggedIn = await mySky.checkLogin();
              
              // set react state for login status and
              // to access mySky in rest of app
              setMySky(mySky);
              setLoggedIn(loggedIn);
              mySky.checkLogin();
            } catch (e) {
              console.error(e);
            }
          }
          
          // call async setup function
        initMySky();
    });

    const handleMySkyLogin = async () => {
        // Try login again, opening pop-up
        const status = await mySky.requestLoginAccess();

        // set react state
        setLoggedIn(status);

    }

    const handleMySkyLogout = async () => {

      //logout the user
      await mySky.logout();

      //set react state
      setLoggedIn(false);
    };

    const setTask = async () => {
      try {

        // Set discoverable JSON data at the given path. 
        //The return type is the same as getJSON.

        //first get the list of tasks from Skynet
        if(loggedIn == true){
          var tasks = await mySky.getJSON(hostApp);

          //if there is no data saved and the user is saving his first task,
          // assign a new array, otherwise add to the array
          if (tasks.data.length == undefined){
            console.log("null")
            tasks.data = [document.getElementById("task").value];
          }else{
            console.log("not null");
            tasks.data.push(document.getElementById("task").value);
          }
          
          //add the updated Json to the user's skynet and save the 
          //Json task into AllTasks to keep track of them 
          await mySky.setJSON(hostApp , tasks.data);
          setAllTasks(tasks.data);
        }else{
          window.alert("You need to log in first!")
        }

      } catch (error) {
        console.log(error)
      }
    }

    const getTask = async () => {
      try {
        // Get discoverable JSON data from the given path.
        if(loggedIn == true){
        var tasks = await mySky.getJSON(hostApp);

        //console.log(tasks)
        setAllTasks(tasks.data);
        }else{
          window.alert("You need to log in first!")
        }
      } catch (error) {
        console.log(error)
      }
    }

    //this is a function that deletes the nth task passed by the ToDoItems function in
    // ToDoItems.js that keeps track of which button from which task has been clicked
    const deleteT = async (index) => {

      //first get the list of tasks from Skynet
      var tasks = await mySky.getJSON(hostApp);

      //remove the task from the Json
      tasks.data.splice(index,1);

      //add the updated Json to the user's skynet and save the 
      //updated Json task into AllTasks to keep track of them 
      await mySky.setJSON(hostApp , tasks.data);
      setAllTasks(tasks.data);
    }

    const taskListProps = {
      //List of tasks 
      AllTasks,
      //function to delete tasks 
      deleteT,
    }
    
    

    return (
      <div className="todoListMain">
        <div className="header">
          <div id="taskform">
            <form name="myForm">
              <input type="text" id="task" placeholder="enter task">
              </input>
            </form>
          </div>

          <div id="mainbuttons">
            <Button  onClick={setTask} >Add Task</Button>
            <Button  onClick={getTask} >Show my Tasks</Button>
              {loggedIn === true && (
                <Button onClick={handleMySkyLogout}>
                  Log Out of MySky
                </Button>
              )}
              {loggedIn === false && (
                <Button color="green" onClick={handleMySkyLogin}>
                  Login with MySky
                </Button>
              )}
          </div>
          <ToDoItems {...taskListProps} />
        </div>
      </div>
    );
}
 


export default ToDoList;