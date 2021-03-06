import { readFile, writeFile } from "fs/promises";

const readData = async () => {
  let data;
  try {
    data = await readFile(new URL("task.txt", import.meta.url), "utf-8");
  } catch (error) {
    await writeData([]);
    data = "[]";
    return JSON.parse(data);
  }
  return JSON.parse(data);
};
const writeData = async (task) => {
  await writeFile(new URL("task.txt", import.meta.url), JSON.stringify(task));
};
const usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

/**
 * ls Command utils
 */
export const help = async () => {
  console.log(usage);
};
/**
 * Add Command Utils
 */
export const add = async (priority, task) => {
  const preTask = await readData();
  await writeData([...preTask, { priority, task, isDone: false }]);
  console.log(`Added task: "${task}" with priority ${priority}`);
};

/**
 * Ls Command Utils
 */
export const listTask = async () => {
  //getting Tasks
  const tasks = await readData();
  const pendingTasks = tasks.filter((task) => !task.isDone);
  const completedTasks = tasks.filter((task) => task.isDone);

  if (pendingTasks.length === 0) {
    console.log("There are no pending tasks!");
  } else {
    pendingTasks.sort((a, b) => {
      return a.priority - b.priority;
    });
    //for add sorted task in json For Done Command
    await writeData([...pendingTasks, ...completedTasks]);
    pendingTasks.map((value, index) => {
      console.log(`${index + 1}. ${value.task} [${value.priority}]`);
    });
  }
};
/**
 * Done Command Utils
 */

export const done = async (index) => {
  //fetching json data
  const tasks = await readData();
  const pendingTasks = tasks.filter((task) => !task.isDone);
  const completedTasks = tasks.filter((task) => task.isDone);

  pendingTasks.sort((a, b) => {
    return a.priority - b.priority;
  });

  // marking as Done
  pendingTasks[index - 1].isDone = true;
  //write in the file
  await writeData([...pendingTasks, ...completedTasks]);
  //logged on terminal
  console.log("Marked item as done.");
};

/**
 * delete Command Utils
 */

export const deleteTask = async (indexs) => {
  //getting tasks from json
  const tasks = await readData();
  let newTasks;
  let isDeletedTask = false;
  const pendingTasks = tasks.filter((task) => !task.isDone);
  // console.log("pendinf=g task:", pendingTasks);
  const completedTasks = tasks.filter((task) => task.isDone);
  //delete by index
  if (indexs > 0 && pendingTasks.length >= indexs) {
    newTasks = pendingTasks.filter(
      (value, index) => index + 1 !== parseInt(indexs)
    );
    isDeletedTask = true;
    console.log(`Deleted task #${indexs}`);
  } else {
    console.log(
      `Error: task with index #${indexs} does not exist. Nothing deleted.`
    );
  }
  // console.log("new Task:", newTasks);
  if (isDeletedTask) {
    let writeTasks = [...newTasks, ...completedTasks];
    await writeData(writeTasks);
  }
  // console.log(writeTasks);
};

/**
 * Report Command Utils
 */
export const report = async () => {
  const tasks = await readData();
  const completedTasks = tasks
    .filter((task) => task.isDone)
    .sort((a, b) => {
      return a.priority - b.priority;
    });
  const pendingTasks = tasks
    .filter((task) => !task.isDone)
    .sort((a, b) => {
      return a.priority - b.priority;
    });

  console.log(`Pending : ${pendingTasks.length}`);
  pendingTasks.map((value, index) => {
    console.log(`${index + 1}. ${value.task} [${value.priority}]`);
  });

  console.log(`\nCompleted : ${completedTasks.length}`);
  completedTasks.map((value, index) => {
    console.log(`${index + 1}. ${value.task}`);
  });
};
