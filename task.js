import { add, deleteTask, done, help, listTask, report } from "./utils.js";
const args = process.argv;

const command = args.slice(2);

switch (command[0]) {
  case undefined:
    help();
    break;
  case "help":
    help();
    break;
  case "add":
    if (!command[2]) {
      console.log("Error: Missing tasks string. Nothing added!");
    } else {
      add(command[1], command[2]);
    }
    break;
  case "ls":
    listTask();
    break;
  case "report":
    report();
    break;
  case "done":
    if (!command[1]) {
      console.log("Error: Missing NUMBER for marking tasks as done.");
      break;
    } else if (command[1] == 0) {
      console.log("Error: no incomplete item with index #0 exists.");
      break;
    } else {
      done(command[1]);
      break;
    }

  case "del":
    if(!command[1]){
      //no args
      console.log("Error: Missing NUMBER for deleting tasks.");
      break;
    }
    else if (!command[2]) {
      deleteTask(command[1]);
    }
    break;
  default:
    break;
}
