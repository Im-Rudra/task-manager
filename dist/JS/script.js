// funciton to get 12 hr time system
const getTime = timeStamp => {
    const newDate = timeStamp ? new Date(timeStamp) : new Date();
    let hour = newDate.getHours();
    let amPm = 'PM';
    if (newDate.getHours() >= 0 && newDate.getHours() < 12) {
        if (newDate.getHours() === 0) {
            hour = 12;
        }
        amPm = 'AM';
    } else {
        hour = newDate.getHours() > 12 ? newDate.getHours() - 12 : newDate.getHours();
    }
    const time = `${hour}:${newDate.getMinutes()}:${newDate.getSeconds()} ${amPm}`;
    return time;
}

// fuction to get date format eg. "Sep 03, 2021"
const getDate = timeStamp => {
    const newDate = timeStamp ? new Date(timeStamp) : new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = `${months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
    return date;
}

// unique id generator
const idGenerator = (digitNumber=6) => {
    let id = '';
    for (let i = 1; i <= digitNumber; i++) {
        let randomNumber = Math.floor(Math.random() * 10);
        id += randomNumber;
    }
    let localData = localStorage.taskList;
    if(localData) {
        JSON.parse(localData).forEach(task => {
            if(task.id === id){
                return idGenerator();
            }
        });
    }
    return id;
}

// function to get element
const getElement = selector => document.querySelector(selector);

const taskForm = getElement('.task-form');
const taskName = getElement('.task-name');
const assignedName = getElement('.assigned-name');
const taskDate = getElement('.task-date');
const taskDescription = getElement('.task-description');
const taskGroup = getElement('.task-group');

// task constructor
class Task {
    constructor(id, taskName, assignedName, taskDate, taskDescription) {
        this.id = id;
        this.taskName = taskName;
        this.assignedName = assignedName;
        this.taskDate = taskDate;
        this.taskDescription = taskDescription;
    }
    isComplete = false;
    creationTime = new Date();
}

// add data to local storage
const addToLocalStorage = (task) => {
    const localData = localStorage.taskList;
    if (localData) {
        localStorage.taskList = JSON.stringify([...JSON.parse(localData), task]);
    } else {
        localStorage.taskList = JSON.stringify([task]);
    }
}

// update display according to local storage data
const updateDisplay = (taskList) => {
    if(!taskList || JSON.parse(taskList).length === 0) {
        taskGroup.textContent = '';
        taskGroup.innerHTML = '<h2 class="text-center text-muted">Add New Task</h2>';
        return;
    }
    taskGroup.textContent = '';
    const taskParsed = JSON.parse(taskList);
    taskParsed.forEach(task => {
        const {id, taskName, assignedName, taskDate, creationTime, taskDescription, isComplete} = task;
        let taskNameTemplate;
        let completeStatusTemplate;
        let statusBtnTemplate;
        if(isComplete){
            taskNameTemplate = `<del>${taskName}</del>`;
            completeStatusTemplate = `<span class="badge bg-success fw-normal">Completed</span>`;
            statusBtnTemplate = `<button class="btn btn-success status-btn" value="${id}" disabled>Done <i class="far fa-check-circle status-btn"></i></button>`;
        } else {
            taskNameTemplate = taskName;
            completeStatusTemplate = `<span class="badge bg-danger fw-normal">In progress</span>`;
            statusBtnTemplate = `<button class="btn btn-danger status-btn" value="${id}">Done <i class="far fa-check-circle status-btn"></i></button>`;
        }
        const taskTemplate = `
            <div class="task bg-smoke p-3 rounded-3 shadow-lg mb-3">
                <span class="id badge bg-dark rounded-pill fw-normal">ID: ${id}</span>
                <h3 class="mb-2">${taskNameTemplate}</h3>
                <h5 class="mb-1">Assigned To: ${assignedName}</h5>
                <h5 class="mb-1">Description:</h5>
                <p class="mb-2">${taskDescription}</p>
                <h6 class="mb-2">Status: ${completeStatusTemplate}</h6>
                <h6>Created At: <span class="fw-normal">${getDate(creationTime)} | ${getTime(creationTime)}</span></h6>
                <h6>Dead Line: <span class="fw-normal">${getDate(taskDate)}</span></h6>
                ${statusBtnTemplate}
                <button class="btn btn-danger delete-btn" value="${id}">Delete <i class="far fa-trash-alt delete-btn"></i></button>
            </div>
        `;
        taskGroup.innerHTML += taskTemplate;
    });
}

// getting form data
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const task = new Task(idGenerator(), taskName.value, assignedName.value, new Date(taskDate.value), taskDescription.value);
    addToLocalStorage(task);
    updateDisplay(localStorage.taskList);
    taskForm.reset();
});

// setting btns' actions
getElement('body').addEventListener('click', e => {
    const element = e.target;
    // status btn
    if(element.classList.contains('status-btn')) {
        let newTaskList = [];
        JSON.parse(localStorage.taskList).forEach(task => {
            if (element.value === task.id || element.parentNode.value === task.id) {
                task.isComplete = true;
                newTaskList.push(task);
            } else {
                newTaskList.push(task);
            }
        })
        localStorage.taskList = JSON.stringify(newTaskList);
        updateDisplay(localStorage.taskList);
    }

    // delete btn
    if(element.classList.contains('delete-btn')) {
        const deleteId = element.value || element.parentNode.value;
        let newTaskList = JSON.parse(localStorage.taskList).filter(task => task.id !== deleteId);
        localStorage.taskList = JSON.stringify(newTaskList);
        updateDisplay(localStorage.taskList);
    }

    // filter by complete btn
    if(element.classList.contains('filter-complete')) {
        let newTaskList = JSON.parse(localStorage.taskList).filter(task => task.isComplete);
        updateDisplay(JSON.stringify(newTaskList));
    }

    // filter by incomplete btn
    if(element.classList.contains('filter-incomplete')) {
        let newTaskList = JSON.parse(localStorage.taskList).filter(task => !task.isComplete);
        updateDisplay(JSON.stringify(newTaskList));
    }

    // cancel all filters
    if(element.classList.contains('cancel-filter')) {
        updateDisplay(localStorage.taskList);
    }
})

updateDisplay(localStorage.taskList);