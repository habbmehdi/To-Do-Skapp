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

    const [userID, setUserID] = useState();
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
              mySky.checkLogin()
              if (loggedIn) {
                setUserID(await mySky.userID());
              }
            } catch (e) {
              console.error(e);
            }
          }
          
          // call async setup function
        initMySky();
    });

    const handleMySkyLogin = async () => {
        // Try login again, opening pop-up. Returns true if successful
        const status = await mySky.requestLoginAccess();

        // set react state
        setLoggedIn(status);

       if (status) {
          setUserID(await mySky.userID());
        }
    }

    const handleMySkyLogout = async () => {
      await mySky.logout();

      //set react state
      setLoggedIn(false);
      setUserID('');
    };

    const setTask = async () => {
      try {
        // Set discoverable JSON data at the given path. The return type is the same as getJSON.
        


        var tasks = await mySky.getJSON(hostApp);
        //var newtasks;
        console.log(tasks.data.length)
        if (tasks.data.length == undefined){
          console.log("null")
          tasks.data = [document.getElementById("task").value]
        }else{
          //console.log(tasks.data.length)
          //newtasks = [...tasks.data];
          console.log("not null")
          tasks.data.push(document.getElementById("task").value)

          
        }
      
      await mySky.setJSON(hostApp , tasks.data);
      setAllTasks(tasks.data);

      } catch (error) {
        console.log(error)
      }
    }

    const getTask = async () => {
      try {
        // Get discoverable JSON data from the given path.
        var tasks = await mySky.getJSON(hostApp);

        //console.log(tasks)
        setAllTasks(tasks.data);

      } catch (error) {
        console.log(error)
      }
    }

    
    const deleteT = async (index) => {

      var tasks = await mySky.getJSON(hostApp);
      tasks.data.splice(index,1);

      await mySky.setJSON(hostApp , tasks.data);
      setAllTasks(tasks.data);
    }

    const taskListProps = {
      AllTasks,
      deleteT,
    }
    
    

    return (
      <div className="todoListMain">
        <div className="header">
          <div id="test">
            <form name="myForm">
              <input type="text" id="task" placeholder="enter task">
              </input>
            </form>
          </div>

          <div id="test2">
            <Button  onClick={setTask} >add</Button>
            <Button  onClick={getTask} >show</Button>
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