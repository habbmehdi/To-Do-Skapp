# Getting Started with To-Do List Skynet Application 

In the project directory, you can run:

# Prerequisites

NodeJS installed.  
Yarn installed. (npm install -g yarn)  
skynet-js (yarn add skynet-js@beta)  
Clone this repo.  

# Setup 

When hosted on a skynet portal, SkynetClient doesn't need any arguments.However, you will need to define a portal to allow for developing on localhost.You can do that by making the following change in the /src/ToDoList.js file : 

'const portal =
  window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;
  
const client = new SkynetClient(portal);'

yarn start to run the app in the development mode. 
Open http://localhost:3000 to view it in the browser.
